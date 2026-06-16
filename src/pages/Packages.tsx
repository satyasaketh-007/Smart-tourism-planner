import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass, LogOut, ArrowLeft, MapPin, Calendar, Users, User, Phone } from "lucide-react";
import TourPackages from "@/components/TourPackages";

interface PlanData {
  state: string;
  name: string;
  phone: string;
  date: string;
  people: string;
}

const Packages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [plan, setPlan] = useState<PlanData | null>(null);

  useEffect(() => {
    const u = sessionStorage.getItem("stp_user");
    if (!u) {
      navigate("/");
      return;
    }
    setUser(u);

    const raw = sessionStorage.getItem("stp_plan");
    if (!raw) {
      navigate("/plan");
      return;
    }
    try {
      setPlan(JSON.parse(raw));
    } catch {
      navigate("/plan");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("stp_user");
    sessionStorage.removeItem("stp_plan");
    navigate("/");
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/40 via-background to-background">
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

      <main className="container py-10 lg:py-14">
        <div className="mx-auto max-w-5xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/plan")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Edit trip details
          </Button>

          <Card className="p-6 shadow-soft border-primary/20 bg-accent/40">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Your trip summary
            </h1>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Destination</dt>
                  <dd className="font-medium">{plan.state}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Traveler</dt>
                  <dd className="font-medium">{plan.name}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium">{plan.phone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium">{plan.date}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Group size</dt>
                  <dd className="font-medium">{plan.people} people</dd>
                </div>
              </div>
            </dl>
          </Card>

          <TourPackages state={plan.state} people={Number(plan.people)} />
        </div>
      </main>
    </div>
  );
};

export default Packages;
