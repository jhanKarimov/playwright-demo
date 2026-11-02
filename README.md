# playwright-demo

A small Playwright + TypeScript test suite I wrote as a portfolio demo. It runs against the **public pages of my own site, [soz6.com](https://soz6.com)** (an Azerbaijani community dictionary + news site I built and run). It's a demo, not a production test suite for a client system, and I'm not claiming it's more than that.

I'm an SDET with a Java/Selenium background. I wrote this to show how I'd structure the same ideas in Playwright/TS.

## Ground rules I set for it
- Read-only: GET requests only. The login page is only *looked at*, nothing is ever submitted. No accounts, no credentials.
- Polite: one worker, a few dozen page loads per full run.

## Run it
```bash
npm install
npx playwright test          # or: npm test
npm run test:headed          # watch it in Chrome
npm run report               # open the HTML report
npm run typecheck
```
Locally it uses my installed Google Chrome (`channel: 'chrome'`), so no browser download is needed. In CI the workflow installs Playwright's Chromium and sets `PW_USE_BUNDLED_CHROMIUM=1`, which makes the config skip the `chrome` channel.

Two projects: `chromium-desktop` (all specs) and `mobile-chrome` (Pixel 7 emulation, responsive spec only).

## Layout
```
pages/       Page Objects (BasePage + Home, News, Topic, Login)
fixtures/    Custom fixtures: page objects injected into tests, console-error collector
tests/       smoke, news, topic, authz, health, responsive, flaky-hygiene
.github/workflows/playwright.yml   push / PR / nightly, uploads report + traces
```

## What each group shows
- **Page Object Model + fixtures** (`pages/`, `fixtures/`): tests ask for `homePage` or `newsPage` and never touch raw selectors. Shared SEO assertions live in `BasePage`.
- **Smoke** (`smoke.spec.ts`): home returns 200, title, search form, links; login form renders.
- **Content + SEO** (`news.spec.ts`, `topic.spec.ts`): the news feed is rendered client-side, so I poll for articles; links are checked via the `request` fixture; topic page has title, description, canonical and Open Graph tags.
- **Authorization / permission checks** (`authz.spec.ts`): as an anonymous user, `/charts/` and `/projects-map/` must answer `302` to `giris.php` (redirects deliberately not followed so I assert on the real response), and `/charts/api.php` must be `403` JSON with `X-Robots-Tag: noindex`. One test follows the redirect in a browser. This is the "role-based" idea at its smallest: the anonymous role only. I haven't built logged-in role tests here, since that would need real credentials.
- **Quality budgets** (`health.spec.ts`): a console-error budget and an axe-core accessibility scan.
- **Responsive** (`responsive.spec.ts`): viewport meta, no horizontal overflow, mobile vs desktop width.
- **Flaky-test hygiene** (`flaky-hygiene.spec.ts` plus config).

## Flaky-test hygiene
- No fixed sleeps. I use web-first assertions (`expect(locator)...`), `expect.poll` for client-rendered content, and `waitForResponse` set up *before* the navigation that triggers it.
- Retries are 2 in CI and 0 locally (so I see flakes instead of hiding them). Trace is `on-first-retry`, screenshots on failure. Video is off because it needs an extra ffmpeg download.
- Single worker and no shared state between tests.
- Tests assert on things I control (headers, meta tags, structure), not on news headlines that change every few minutes.

## Real findings it turned up (as of 2026-11-02)
- **Console errors on the home page: 9 to 11 depending on the run** (jQuery/Quill load-order errors, a duplicate `leftFrame` declaration, a few 404s). The test uses a budget of 15 as a ratchet (the count itself varies, which is a finding). I'd lower it as I fix them.
- **Accessibility (axe, WCAG A/AA)**: `button-name`, `image-alt` and `label` violations on the home page. They're attached to the report as annotations and a JSON file, and don't fail the run.
- The home `<h1>` is in the DOM but visually hidden (logo styling), so I assert it's attached, not visible.
- The news page currently shows ~4 article links, so the test asks for at least 3.

## Caveats
- It's a live site, so tests can drift when content changes. That's a known trade-off of this demo. A real project would use a stable test environment.
- CI workflow is written but I haven't run it on GitHub.
