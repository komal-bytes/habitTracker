export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Progress Logs",
      href: "/logs",
    },
    {
      label: "Badges",
      href: "/badges",
    },
  ],
};
