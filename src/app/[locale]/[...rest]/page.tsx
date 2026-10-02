import { notFound } from "next/navigation";

// Any unknown URL inside a locale (/es/whatever) lands here and renders the
// locale's not-found page — translated, inside the site layout, still a 404.
// Without it Next fell back to the root not-found, which is English-only.
export default function UnknownLocalePath() {
  notFound();
}
