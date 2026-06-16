import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info, Phone, Star, Languages, Award } from "lucide-react";
import type { Guide } from "@/data/packages";

interface Props {
  guide: Guide;
}

const GuideInfo = ({ guide }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-primary hover:bg-primary/10"
          aria-label={`More info about guide ${guide.name}`}
        >
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-3">
          <div>
            <p className="font-display text-lg font-semibold leading-tight">{guide.name}</p>
            <p className="text-xs text-muted-foreground">Certified local guide</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>{guide.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <Languages className="mt-0.5 h-4 w-4 text-primary" />
              <span>{guide.languages.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{guide.rating.toFixed(1)} / 5.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>{guide.experienceYears} years experience</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuideInfo;
