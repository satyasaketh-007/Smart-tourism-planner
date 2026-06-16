import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Compass, LogOut, MapPin, Calendar, Users, Phone, User } from "lucide-react";

const STATES = [
  "Andhra Pradesh",
  "Goa",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Kerala",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttarakhand",
];

const Plan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string>("");

  const [form, setForm] = useState({
    state: "",
    name: "",
    phone: "",
    date: "",
    people: "",
  });

  useEffect(() => {
    const u = sessionStorage.getItem("stp_user");
    if (!u) {
      navigate("/");
      return;
    }
    setUser(u);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("stp_user");
    navigate("/");
  };

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.state) return toast({ title: "Pick a state to visit." });
    if (!form.name.trim()) return toast({ title: "Please enter your name." });
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone))
      return toast({ title: "Enter a valid phone number." });
    if (!form.date) return toast({ title: "Pick a travel date." });
    const n = Number(form.people);
    if (!Number.isInteger(n) || n < 1 || n > 50)
      return toast({ title: "Number of people must be 1–50." });

    sessionStorage.setItem("stp_plan", JSON.stringify(form));
    toast({ title: "Tour plan created!", description: `${form.state} • ${form.date}` });
    navigate("/packages");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/40 via-background to-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Smart Tour Planner" className="h-9 w-9 object-contain rounded-md" />
            <span className="font-display text-xl font-bold">Smart Tour Planner</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Hi, <span className="font-medium text-foreground">{user}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Plan your next adventure
            </h1>
            <p className="mt-3 text-muted-foreground">
              Tell us where you'd like to go and we'll craft an unforgettable journey.
            </p>
          </div>

          <Card className="p-6 shadow-elegant sm:p-10">
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              {/* State */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Destination state
                </Label>
                <Select value={form.state} onValueChange={(v) => update("state", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a state in India" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Full name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Aarav Sharma"
                  maxLength={80}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  maxLength={20}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Travel date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>

              {/* People */}
              <div className="space-y-2">
                <Label htmlFor="people" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Number of people
                </Label>
                <Input
                  id="people"
                  type="number"
                  min={1}
                  max={50}
                  value={form.people}
                  onChange={(e) => update("people", e.target.value)}
                  placeholder="2"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Create my tour plan
                </Button>
              </div>
            </form>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Plan;
