import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Wallet, Hotel, Car, Plane, UserCheck, Pencil } from "lucide-react";
import GuideInfo from "@/components/GuideInfo";
import PackageCustomizer from "@/components/PackageCustomizer";
import {
  buildPackages,
  calcPerPerson,
  inr,
  type PackageOption,
  type Tier,
} from "@/data/packages";

interface Props {
  state: string;
  people: number;
}

const TIER_META: Record<Tier, { icon: typeof Wallet; accent: string }> = {
  low: { icon: Wallet, accent: "from-secondary/80 to-secondary" },
  mid: { icon: Sparkles, accent: "from-primary to-primary-glow" },
  high: { icon: Crown, accent: "from-primary-glow to-primary" },
};

const TourPackages = ({ state, people }: Props) => {
  const navigate = useNavigate();
  const packages = useMemo(() => buildPackages(state), [state]);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [customizing, setCustomizing] = useState<PackageOption | null>(null);

  const proceedToPayment = (pkg: PackageOption) => {
    const inter = pkg.inter[0];
    const perPerson = calcPerPerson({ ...pkg, inter }, people);
    const booking = {
      tier: pkg.tier,
      name: pkg.name,
      nights: pkg.nights,
      hotel: pkg.hotel.name,
      hotelStars: pkg.hotel.stars,
      intra: pkg.intra.mode,
      inter: inter.mode,
      guide: pkg.guide.name,
      highlights: pkg.highlights,
      perPerson,
      total: perPerson * people,
      people,
      state,
    };
    sessionStorage.setItem("stp_booking", JSON.stringify(booking));
    navigate("/trip-map");
  };

  return (
    <section className="mt-10">
      <div className="mb-6 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">
          Packages for {state}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Hotels, intra-state travel, certified guides & travel options to reach {state}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => {
          const meta = TIER_META[pkg.tier];
          const Icon = meta.icon;
          const popular = pkg.tier === "mid";
          const selected = selectedTier === pkg.tier;
          const defaultInter = pkg.inter[0];
          const perPerson = calcPerPerson({ ...pkg, inter: defaultInter }, people);
          const total = perPerson * people;

          return (
            <Card
              key={pkg.tier}
              className={`relative flex flex-col p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant ${
                selected
                  ? "border-primary ring-2 ring-primary"
                  : popular
                  ? "border-primary/50 ring-2 ring-primary/30"
                  : ""
              }`}
            >
              {popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-warm text-primary-foreground border-0">
                  Most Popular
                </Badge>
              )}

              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.accent} text-primary-foreground shadow-soft`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="font-display text-2xl font-bold">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground">{pkg.tagline}</p>

              <div className="my-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{inr(perPerson)}</span>
                  <span className="text-sm text-muted-foreground">/ person</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pkg.nights} nights · Total {inr(total)} for {people} {people === 1 ? "person" : "people"}
                </p>
              </div>

              <ul className="mb-5 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Hotel className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">{pkg.hotel.name}</span>{" "}
                    <span className="text-muted-foreground">({pkg.hotel.stars}★)</span>
                    <span className="block text-xs text-muted-foreground">{pkg.hotel.notes}</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Car className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">In-state travel:</span> {pkg.intra.mode}
                    <span className="block text-xs text-muted-foreground">{pkg.intra.description}</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Plane className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">Reach {state}:</span> {defaultInter.mode}
                    <span className="block text-xs text-muted-foreground">
                      {defaultInter.duration} · {inr(defaultInter.pricePerPerson)}/person
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="flex flex-wrap items-center gap-1">
                    <span className="font-medium">Guide:</span>
                    <span>{pkg.guide.name}</span>
                    <GuideInfo guide={pkg.guide} />
                  </span>
                </li>
              </ul>

              {pkg.highlights.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Includes visits to
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.highlights.map((h) => (
                      <Badge key={h} variant="secondary" className="font-normal">
                        <Check className="mr-1 h-3 w-3" />
                        {h}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto space-y-2">
                <Button
                  variant={selected || popular ? "hero" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedTier(pkg.tier)}
                >
                  {selected ? "Selected" : `Choose ${pkg.name}`}
                </Button>
                {selected && (
                  <>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setCustomizing(pkg)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Customize this package
                    </Button>
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={() => proceedToPayment(pkg)}
                    >
                      Confirm & proceed to payment
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {customizing && (
        <PackageCustomizer
          open={!!customizing}
          onOpenChange={(o) => !o && setCustomizing(null)}
          basePackage={customizing}
          state={state}
          people={people}
        />
      )}
    </section>
  );
};

export default TourPackages;
