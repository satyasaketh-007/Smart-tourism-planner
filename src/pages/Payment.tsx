import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, LogOut, ArrowLeft, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { inr } from "@/data/packages";
import { apiSaveBooking, apiSavePayment } from "@/lib/api";

interface Booking {
  tier: string;
  name: string;
  nights: number;
  hotel: string;
  hotelStars: number;
  intra: string;
  inter: string;
  guide: string;
  highlights: string[];
  perPerson: number;
  total: number;
  people: number;
  state: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const u = sessionStorage.getItem("stp_user");
    if (!u) return navigate("/");
    setUser(u);
    const raw = sessionStorage.getItem("stp_booking");
    if (!raw) return navigate("/packages");
    try {
      setBooking(JSON.parse(raw));
    } catch {
      navigate("/packages");
    }
  }, [navigate]);

  const userId = sessionStorage.getItem("stp_userId") ?? "";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card.holder.trim()) return toast({ title: "Enter cardholder name." });
    if (card.number.replace(/\s/g, "").length < 16)
      return toast({ title: "Enter a valid 16-digit card number." });
    if (!/^\d{2}\/\d{2}$/.test(card.expiry))
      return toast({ title: "Expiry must be MM/YY." });
    if (!/^\d{3,4}$/.test(card.cvv))
      return toast({ title: "Enter a valid CVV." });

    setSubmitting(true);

    const txnId = "STP" + Date.now().toString().slice(-10);
    const paidAt = new Date().toISOString();
    const cardLast4 = card.number.replace(/\s/g, "").slice(-4);
    const cardHolder = card.holder.trim();

    // Build receipt object (for local session + MongoDB)
    const receipt = {
      ...booking!,
      txnId,
      paidAt,
      cardLast4,
      cardHolder,
    };

    // Save to sessionStorage for receipt page
    sessionStorage.setItem("stp_receipt", JSON.stringify(receipt));

    // Persist payment to MongoDB Atlas
    if (userId && booking) {
      try {
        const planRaw = sessionStorage.getItem("stp_plan");
        const plan = planRaw ? JSON.parse(planRaw) : null;

        await apiSavePayment({
          userId,
          username: user,
          txnId,
          paidAt,
          cardHolder,
          cardLast4,
          perPerson: booking.perPerson,
          total: booking.total,
          people: booking.people,
          state: booking.state,
          packageName: booking.name,
          tier: booking.tier,
          nights: booking.nights,
          hotel: booking.hotel,
          hotelStars: booking.hotelStars,
          guide: booking.guide,
          inter: booking.inter,
          intra: booking.intra,
          highlights: booking.highlights,
        });
        await apiSaveBooking({
          userId,
          username: user,
          travelerName: plan?.name || user,
          phone: plan?.phone || "",
          travelDate: plan?.date || paidAt,
          people: booking.people,
          state: booking.state,
          packageTier: booking.tier,
          packageName: booking.name,
          nights: booking.nights,
          hotel: booking.hotel,
          hotelStars: booking.hotelStars,
          guide: booking.guide,
          inter: booking.inter,
          intra: booking.intra,
          highlights: booking.highlights,
          perPerson: booking.perPerson,
          total: booking.total,
          paymentTxnId: txnId,
          paidAt,
          cardHolder,
          cardLast4,
        });
        console.log("✅ Payment saved to MongoDB:", txnId);
      } catch (err) {
        // Log but don't block navigation — receipt is already in sessionStorage
        console.warn("⚠️ Could not save payment to MongoDB:", err);
      }
    }

    toast({ title: "Payment successful!", description: "Generating your receipt…" });
    navigate("/receipt");
    setSubmitting(false);
  };

  if (!booking) return null;

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
          <Button variant="ghost" size="sm" onClick={() => navigate("/packages")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to packages
          </Button>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Payment form */}
            <Card className="p-6 shadow-elegant sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-warm text-primary-foreground">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">Payment details</h1>
                  <p className="text-sm text-muted-foreground">Secure dummy checkout for demo purposes.</p>
                </div>
              </div>

              <form onSubmit={handlePay} className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="holder">Cardholder name</Label>
                  <Input
                    id="holder"
                    value={card.holder}
                    onChange={(e) => setCard({ ...card, holder: e.target.value })}
                    placeholder="As on card"
                    maxLength={60}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Card number</Label>
                  <Input
                    id="number"
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      inputMode="numeric"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      inputMode="numeric"
                      type="password"
                      value={card.cvv}
                      onChange={(e) =>
                        setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                      }
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-accent/30 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  This is a demo — no real payment is processed.
                </div>

                <Button type="submit" variant="hero" size="lg" disabled={submitting}>
                  <Lock className="mr-2 h-4 w-4" />
                  {submitting ? "Processing…" : `Make payment ${inr(booking.total)}`}
                </Button>
              </form>
            </Card>

            {/* Order summary */}
            <Card className="h-fit p-6 shadow-soft border-primary/20 bg-accent/30">
              <h2 className="font-display text-xl font-bold">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Package" value={booking.name} />
                <Row label="Destination" value={booking.state} />
                <Row label="Hotel" value={`${booking.hotel} (${booking.hotelStars}★)`} />
                <Row label="Guide" value={booking.guide} />
                <Row label="In-state travel" value={booking.intra} />
                <Row label="Reach state" value={booking.inter} />
                <Row label="Nights" value={String(booking.nights)} />
                <Row label="Travelers" value={`${booking.people} people`} />
              </div>
              <div className="my-4 border-t border-border/60" />
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Per person</span>
                <span className="font-medium">{inr(booking.perPerson)}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-display text-lg font-bold">Total</span>
                <span className="font-display text-2xl font-bold text-primary">
                  {inr(booking.total)}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

export default Payment;
