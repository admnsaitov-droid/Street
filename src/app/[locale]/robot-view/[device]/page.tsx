/**
 * The home page's robot form (ADR-0121): the same view, rendered at rest for
 * crawlers and lab tools. `[device]` is `phone` or `desktop` — the robot
 * document never hydrates, so it can't pick its layout from the window.
 * Reached only through `src/middleware.ts` → `/robot-doc`; disallowed in
 * robots.txt; its metadata (and canonical) are the home page's.
 */
export { default, generateMetadata } from "../../page";
