type SiteLink = { label: string; href: string };

// Public marketing surface. Every link resolves to a page that exists.
const MARKETING_NAV: SiteLink[] = [
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const FOOTER_NAV: Record<string, SiteLink[]> = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Log in", href: "/login" },
  ],
  STEMORA: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export const siteConfig = {
  name: "STEMORA",
  tagline: "The home for your school's STEM Club",
  description:
    "One workspace for your school's STEM Club — students, projects, competitions, events, resources, and announcements.",
  marketingNav: MARKETING_NAV,
  footerNav: FOOTER_NAV,
};
