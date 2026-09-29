"use client";

import styled from "styled-components";
import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { usePathname } from "next/navigation";
import { generateBreadcrumbSchema } from "@/utils/generateStructuredData";
import { StructuredData } from "@/components/StructuredData/StructuredData";

export interface BreadcrumbItem {
  label: string;
  /**
   * Absolute or already-locale-prefixed href. If provided, it takes precedence over `slug`.
   */
  href?: string;
  /**
   * Route slug coming from Strapi (e.g. "packages" or "packages/medium-layout").
   * The component will automatically prefix it with the active locale from the URL.
   */
  slug?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string; // default: '·'
  /**
   * `dark` for pages whose hero sits on a dark surface — the distributors globe
   * is the case this exists for, where the default black current-page label was
   * invisible. It is a prop rather than a per-page override so the next dark
   * hero gets it for free.
   */
  tone?: 'light' | 'dark';
}

export function Breadcrumbs({ items, className, separator = "·", tone = 'light' }: BreadcrumbsProps) {
  const pathname = usePathname();
  const locale = getFirstPathSegment(pathname) || "en";

  // Generate BreadcrumbList schema for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com';
  const breadcrumbSchema = generateBreadcrumbSchema(
    items.map((item, idx) => {
      const href = item.href ?? withLocale(locale, item.slug);
      const absoluteUrl = href ? `${baseUrl}${href}` : `${baseUrl}/${locale}`;
      return {
        name: item.label,
        url: absoluteUrl,
      };
    })
  );

  return (
    <>
      <StructuredData schemas={[breadcrumbSchema]} />
      <StyledBreadcrumbs className={className} aria-label="Breadcrumb" $tone={tone}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const href = item.href ?? withLocale(locale, item.slug);

          return (
            <StyledItem key={`${item.label}-${idx}`}>
              {isLast ? (
                <StyledCurrent aria-current="page">{item.label}</StyledCurrent>
              ) : (
                <StyledLink href={href}>{item.label}</StyledLink>
              )}
              {!isLast && <StyledSeparator aria-hidden>{separator}</StyledSeparator>}
            </StyledItem>
          );
        })}
      </StyledBreadcrumbs>
    </>
  );
}

// Helpers
function getFirstPathSegment(pathname: string | null): string | null {
  if (!pathname) return null;
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || null;
}

function withLocale(locale: string, slug?: string) {
  if (slug == null) return undefined;
  const trimmed = slug.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return `/${locale}`;
  return `/${locale}/${trimmed}`;
}

// Styles
const StyledBreadcrumbs = styled.nav<{ $tone: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  margin-bottom: ${rm(20)};
  /* the trail inherits this; links dim themselves with opacity */
  color: ${({ $tone }) => ($tone === 'dark' ? colors.white100 : colors.black100)};
`;

const StyledItem = styled.span`
  display: inline-flex;
  align-items: center;
`;

const StyledSeparator = styled.span`
  margin: 0 ${rm(8)};
  color: inherit;
  opacity: 0.45;
  user-select: none;
`;

const StyledLink = styled(AnimLink)`
  ${fontGolosText(400)};
  color: inherit;
  opacity: 0.65;
  font-size: ${rm(16)};
  text-decoration: none;
  line-height: 1;

  transition: color 0.3s ease;

  &:hover {
    opacity: 1;
  }

  ${media.lg`
    font-size: ${rm(14)};
  `}

  ${media.xsm`
    font-size: ${rm(12)};
  `}
`;

const StyledCurrent = styled.span`
  ${fontGolosText(400)};
  color: inherit;
  font-size: ${rm(16)};
  line-height: 1;

  ${media.lg`
    font-size: ${rm(14)};
  `}

  ${media.xsm`
    font-size: ${rm(12)};
  `}
`;

export default Breadcrumbs;

