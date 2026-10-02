/**
 * Interface texts that live in Strapi's "Тексты интерфейса" (ui-string)
 * single type, with these English values as the fallback.
 *
 * The fallback is what renders when Strapi has no entry for the locale yet or
 * a field is empty, so the site never shows a blank button whatever order the
 * frontend and Strapi are deployed in. The Strapi repo seeds every locale from
 * src/api/ui-string/seed/ui-strings.json on boot (empty fields only) — keep the
 * English block there and this object in step when adding a field (ADR-0119).
 */
export const UI_STRING_DEFAULTS = {
  breadcrumbHome: "Home",
  breadcrumbProducts: "Products",
  breadcrumbPrivacyPolicy: "Privacy policy",
  breadcrumbCookiePolicy: "Cookie policy",
  breadcrumbTermsOfUse: "Terms of use",
  breadcrumbAriaLabel: "Breadcrumb",
  menuBack: "Back",
  packageMenuItem: "{title}",
  headerHomeAriaLabel: "Street Barbell — home",
  headerLogoAlt: "Street Barbell logo",
  footerRightsReserved: "All rights reserved",
  footerDevelopedBy: "Developed by",
  newsCardTag: "Event",
  distributionFilterAll: "All",
  distributionEurope: "Europe",
  distributionAfrica: "Africa",
  distributionAmerica: "America",
  distributionAsia: "Asia",
  distributionVisitWebsite: "Visit website",
  productReferencesTitle: "References",
  productQuoteButton: "Contact us",
  productAboutTitle: "About",
  productMainColor: "Main color",
  productAccentColor: "Accent color",
  productMainShort: "Main",
  productAccentShort: "Accent",
  productColourLabel: "Colour",
  productChooseColour: "Choose colour",
  productColoursAriaLabel: "Colours",
  sceneZoomIn: "Zoom in",
  sceneLabel: "3D scene",
  galleryPreviousImage: "Previous image",
  galleryNextImage: "Next image",
  galleryThumbnailsAriaLabel: "Product media thumbnails",
  sliderPrevious: "Previous slide",
  sliderNext: "Next slide",
  sliderAriaLabel: "Product images",
  closeLabel: "Close",
  packageExplore: "Explore",
  mapUnavailableTitle: "Map unavailable",
  mapUnavailableText: "We can't load the map right now. Our projects are listed below.",
  mapRouteButton: "Adjust the route",
  mapOpenInGoogleMaps: "Open in Google Maps",
  policyLastUpdated: "Last updated:",
  notFoundTitle: "Page Not Found",
  notFoundText: "Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or you may have entered an incorrect URL.",
  notFoundButton: "Return to Homepage",
  errorTitleFirst: "Something",
  errorTitleSecond: "broke",
  errorText: "This page didn't load.",
  errorTryAgain: "Try again",
  errorBackHome: "Back to home",
  errorReport: "Report this",
  errorReference: "Reference",
  cookiePrivacyAriaLabel: "Go to Privacy Policy",
} as const;

export type UiStrings = { -readonly [K in keyof typeof UI_STRING_DEFAULTS]: string };

/** Strapi payload (any shape, possibly null) -> complete UiStrings. Empty values fall back to English. */
export function resolveUiStrings(raw: unknown): UiStrings {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const result = { ...UI_STRING_DEFAULTS } as UiStrings;
  for (const key of Object.keys(UI_STRING_DEFAULTS) as (keyof UiStrings)[]) {
    const value = source[key];
    if (typeof value === 'string' && value.trim() !== '') result[key] = value;
  }
  return result;
}

/** "{title} layout" + { title: "Large" } -> "Large layout". Unknown placeholders are left as-is. */
export function fillTemplate(template: string, values: Record<string, string | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}
