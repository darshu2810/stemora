import { enabledOnly, type Gated } from "@/config/features";

type SiteLink = { label: string; href: string };

// Public surface for the MVP: Home, Features, About, Contact — plus Log in and
// Register school, which live as buttons in the navbar. Ecosystem links
// (Discover, Schools, Projects, Research) and Pricing are parked; see
// src/config/features.ts.
const MARKETING_NAV: Gated<SiteLink>[] = [
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Discover", href: "/discover", feature: "discover" },
  { label: "Pricing", href: "/pricing", feature: "pricing" },
];

const FOOTER_NAV: Record<string, Gated<SiteLink>[]> = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing", feature: "pricing" },
  ],
  Network: [
    { label: "Discover", href: "/discover", feature: "discover" },
    { label: "Schools", href: "/schools", feature: "schoolDirectory" },
    { label: "Projects", href: "/projects", feature: "projectShowcase" },
    { label: "Research", href: "/research", feature: "researchHub" },
  ],
  STEMORA: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

function buildFooterNav(): Record<string, SiteLink[]> {
  const result: Record<string, SiteLink[]> = {};
  for (const [group, items] of Object.entries(FOOTER_NAV)) {
    const enabled = enabledOnly(items);
    // Drop a column entirely once every link in it is parked (Network, today).
    if (enabled.length > 0) result[group] = enabled;
  }
  return result;
}

export const siteConfig = {
  name: "STEMORA",
  tagline: "The home base for STEM clubs",
  description:
    "One workspace for your school's STEM clubs — members, projects, competitions, events, resources, and announcements.",
  marketingNav: enabledOnly(MARKETING_NAV),
  footerNav: buildFooterNav(),
};
