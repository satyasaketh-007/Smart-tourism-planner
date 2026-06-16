import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import GuideInfo from "@/components/GuideInfo";
import { toast } from "@/hooks/use-toast";
import {
  ALL_GUIDES,
  ALL_HOTELS,
  buildInterOptions,
  calcPerPerson,
  inr,
  type PackageOption,
} from "@/data/packages";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  basePackage: PackageOption;
  state: string;
  people: number;
}

const PackageCustomizer = ({ open, onOpenChange, basePackage, state, people }: Props) => {
  const navigate = useNavigate();
  const hotels = ALL_HOTELS[state] ?? [];
  const guides = ALL_GUIDES[state] ?? [];
  const interOptions = useMemo(() => buildInterOptions(state), [state]);

  const [hotelName, setHotelName] = useState(basePackage.hotel.name);
  const [guideId, setGuideId] = useState(basePackage.guide.id);
  const [interMode, setInterMode] = useState(basePackage.inter[0].mode);
  const [nights, setNights] = useState(basePackage.nights);

  const hotel = hotels.find((h) => h.name === hotelName) ?? basePackage.hotel;
  const guide = guides.find((g) => g.id === guideId) ?? basePackage.guide;
  const inter = interOptions.find((i) => i.mode === interMode) ?? basePackage.inter[0];

  const perPerson = calcPerPerson(
    { hotel, intra: basePackage.intra, nights, tier: basePackage.tier, inter },
    people
  );
  const total = perPerson * people;

  const handleConfirm = () => {
    const booking = {
      tier: basePackage.tier,
      name: basePackage.name,
      nights,
      hotel: hotel.name,
      hotelStars: hotel.stars,
      intra: basePackage.intra.mode,
      inter: inter.mode,
      guide: guide.name,
      highlights: basePackage.highlights,
      perPerson,
      total,
      people,
      state,
    };
    sessionStorage.setItem("stp_booking", JSON.stringify(booking));
    toast({
      title: "Package confirmed!",
      description: `${basePackage.name} · ${nights} nights · ${inr(total)} total`,
    });
    onOpenChange(false);
    navigate("/trip-map");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Customize {basePackage.name}
          </DialogTitle>
          <DialogDescription>
            Swap hotels, guides, travel options or adjust the trip length.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Hotel</Label>
            <Select value={hotelName} onValueChange={setHotelName}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((h) => (
                  <SelectItem key={h.name} value={h.name}>
                    {h.name} · {h.stars}★ · {inr(h.pricePerNight)}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Guide <GuideInfo guide={guide} />
            </Label>
            <Select value={guideId} onValueChange={setGuideId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {guides.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name} · ★ {g.rating.toFixed(1)} · {g.languages.length} langs
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Travel to {state}</Label>
            <Select value={interMode} onValueChange={setInterMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {interOptions.map((i) => (
                  <SelectItem key={i.mode} value={i.mode}>
                    {i.mode} · {i.duration} · {inr(i.pricePerPerson)}/person
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nights">Number of nights</Label>
            <Input
              id="nights"
              type="number"
              min={1}
              max={21}
              value={nights}
              onChange={(e) => setNights(Math.max(1, Math.min(21, Number(e.target.value) || 1)))}
            />
          </div>

          <Card className="bg-accent/40 p-4 text-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-muted-foreground">Per person</span>
              <span className="font-display text-xl font-bold">{inr(perPerson)}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-muted-foreground">Total ({people} {people === 1 ? "person" : "people"})</span>
              <span className="font-semibold">{inr(total)}</span>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleConfirm}>
            Confirm & pay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackageCustomizer;
