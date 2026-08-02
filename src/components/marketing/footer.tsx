import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-[24ch] text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>
        {Object.entries(siteConfig.footerNav).map(([group, items]) => (
          <div key={group}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{group}</h3>
            <ul className="mt-3 space-y-2.5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-foreground/80 hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl px-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} STEMORA. One workspace per school, one STEM Club per workspace.</p>
        </div>
      </div>
    </footer>
  );
}
