import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pricing — STEMORA" };

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For a single club getting started.",
    features: ["Up to 2 clubs", "50 members", "Classroom & project spaces", "Community support"],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Standard",
    price: "$49",
    period: "per month",
    description: "For a school running multiple active clubs.",
    features: [
      "Unlimited clubs",
      "500 members",
      "Channels, wiki & calendar",
      "Priority email support",
      "Custom branding",
    ],
    cta: "Start your school",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "Talk to us",
    period: "annual",
    description: "For districts and large STEM programs.",
    features: [
      "Unlimited members",
      "Custom domain",
      "SSO & advanced audit logs",
      "Dedicated onboarding",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">Pricing</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Simple pricing, per school.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Every plan includes a fully isolated workspace for your school. Upgrade as your program grows.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-2xl border p-8",
              plan.highlighted ? "border-primary bg-card shadow-lg shadow-primary/10" : "border-border bg-card"
            )}
          >
            {plan.highlighted ? (
              <span className="mb-4 w-fit rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                Most popular
              </span>
            ) : (
              <div className="mb-4 h-[26px]" aria-hidden />
            )}
            <h2 className="font-display text-lg font-semibold">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="mt-8"
              variant={plan.highlighted ? "default" : "outline"}
              render={<Link href={plan.name === "Premium" ? "/contact" : "/schools/new"}>{plan.cta}</Link>}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
