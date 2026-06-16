import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass, LogOut, CheckCircle2, Download, Home } from "lucide-react";
import { inr } from "@/data/packages";
import { apiEnrollTrip } from "@/lib/api";

interface Receipt {
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
  txnId: string;
  paidAt: string;
  cardLast4: string;
  cardHolder: string;
}

const Receipt = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [r, setR] = useState<Receipt | null>(null);
  const [plan, setPlan] = useState<{ date?: string; phone?: string } | null>(null);

  useEffect(() => {
    const u = sessionStorage.getItem("stp_user");
    if (!u) return navigate("/");
    setUser(u);
    const raw = sessionStorage.getItem("stp_receipt");
    if (!raw) return navigate("/packages");
    const planRaw = sessionStorage.getItem("stp_plan");
    const planData = planRaw ? JSON.parse(planRaw) : null;
    setPlan(planData);

    try {
      const parsed: Receipt = JSON.parse(raw);
      setR(parsed);

      // Enroll trip in MongoDB Atlas
      const userId = sessionStorage.getItem("stp_userId");

      if (userId && parsed.txnId) {
        apiEnrollTrip({
          userId,
          username: u,
          travelerName: planData?.name || u,
          phone: planData?.phone || "",
          travelDate: planData?.date || new Date().toISOString(),
          people: parsed.people,
          state: parsed.state,
          packageTier: parsed.tier,
          packageName: parsed.name,
          nights: parsed.nights,
          hotel: parsed.hotel,
          hotelStars: parsed.hotelStars,
          guide: parsed.guide,
          inter: parsed.inter,
          intra: parsed.intra,
          highlights: parsed.highlights,
          paymentTxnId: parsed.txnId,
          totalPaid: parsed.total,
        })
          .then(() => console.log("✅ Trip enrolled in MongoDB:", parsed.txnId))
          .catch((err) => console.warn("⚠️ Trip enroll failed:", err));
      }
    } catch {
      navigate("/packages");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const getLogoDataUrl = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}logo.png`);
      if (!response.ok) throw new Error("Logo fetch failed");
      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  };

  const handleDownload = async () => {
    if (!r) return;
    const date = new Date(r.paidAt);
    const dateStr = date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const taxes = Math.round(r.total * 0.05);
    const subtotal = r.total - taxes;
    const logoDataUrl = await getLogoDataUrl();
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Receipt ${r.txnId}</title>
<style>
  * { box-sizing: border-box; }
  body { margin:0; padding:0; background:#eef2f3; color:#0f172a; font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
  .page { max-width:900px; margin:28px auto; padding:24px; }
  .invoice { background:#ffffff; border-radius:28px; overflow:hidden; box-shadow:0 24px 60px rgba(15, 23, 42, 0.08); }
  .topbar { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; padding:32px; border-bottom:1px solid #e5e7eb; }
  .brand { display:flex; align-items:center; gap:16px; }
  .brand img { width:92px; height:auto; object-fit:contain; }
  .brand-title { line-height:1.2; }
  .brand-title .name { font-size:24px; font-weight:800; margin:0; letter-spacing:-0.02em; }
  .brand-title .tagline { margin:6px 0 0; color:#475569; font-size:14px; }
  .company-meta { color:#475569; font-size:13px; line-height:1.8; }
  .receipt-info { text-align:right; }
  .receipt-info .label { font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:.18em; margin-bottom:10px; display:block; }
  .receipt-info .value { font-size:16px; font-weight:700; color:#0f172a; margin:0; }
  .status-pill { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 14px; border-radius:999px; background:#d1fae5; color:#0f766e; font-size:12px; font-weight:700; margin-top:16px; }
  .summary { padding:32px; }
  .grid { display:grid; gap:18px; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); }
  .field { padding:20px; border:1px solid #e2e8f0; border-radius:18px; background:#f8fafc; }
  .field .label { display:block; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:#64748b; margin-bottom:8px; }
  .field .value { font-size:15px; font-weight:600; color:#0f172a; line-height:1.6; }
  .charges { margin-top:24px; border-radius:24px; overflow:hidden; }
  .charges table { width:100%; border-collapse:collapse; }
  .charges th, .charges td { padding:18px 20px; text-align:left; }
  .charges th { background:#f8fafc; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:.12em; border-bottom:1px solid #e2e8f0; }
  .charges td { border-bottom:1px solid #e2e8f0; color:#0f172a; }
  .charges tr.total td { border-top:2px solid #cbd5e1; font-size:18px; font-weight:800; }
  .note { margin-top:26px; padding:22px 24px; border-radius:20px; background:#f1f5f9; color:#475569; font-size:13px; line-height:1.7; }
  .footer { margin-top:32px; padding:18px 24px; border-top:1px solid #e2e8f0; display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px; color:#64748b; font-size:12px; }
</style>
</head>
<body>
  <div class="page">
    <article class="invoice">
      <div class="topbar">
        <div class="brand">
          ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Smart Tour Planner logo" />` : `<div style="font-size:20px;font-weight:700;color:#111827;">Smart Tour Planner</div>`}
          <div class="brand-title">
            <p class="name">Smart Tour Planner</p>
            <p class="tagline">Luxury tour bookings across India</p>
            <p class="company-meta">Contact: support@smarttourplanner.com · +91 98765 43210</p>
          </div>
        </div>
        <div class="receipt-info">
          <span class="label">Receipt</span>
          <p class="value">${r.txnId}</p>
          <p class="label">Date</p>
          <p class="value">${dateStr}</p>
          <span class="status-pill">PAID</span>
        </div>
      </div>

      <div class="summary">
        <div class="grid">
          <div class="field">
            <span class="label">Billed to</span>
            <span class="value">${escapeHtml(user)}</span>
          </div>
          <div class="field">
            <span class="label">Payment method</span>
            <span class="value">Visa • **** ${r.cardLast4}</span>
          </div>
          <div class="field">
            <span class="label">Destination</span>
            <span class="value">${escapeHtml(r.state)}</span>
          </div>
          <div class="field">
            <span class="label">Travelers</span>
            <span class="value">${r.people} people</span>
          </div>
          <div class="field">
            <span class="label">Duration</span>
            <span class="value">${r.nights} nights</span>
          </div>
        </div>

        <div class="charges">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Package: ${escapeHtml(r.name)} (${escapeHtml(r.tier)})</td>
                <td>${formatINR(subtotal)}</td>
              </tr>
              <tr>
                <td>GST & taxes (5%)</td>
                <td>${formatINR(taxes)}</td>
              </tr>
              <tr class="total">
                <td>Total paid</td>
                <td>${formatINR(r.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="note">
          This receipt confirms your package booking with Smart Tour Planner. Please retain this document for your travel records. If you need assistance, contact our support team at support@smarttourplanner.com.
        </div>
      </div>

      <div class="footer">
        <span>Smart Tour Planner · Registered Office: New Delhi, India</span>
        <span>Receipt generated automatically</span>
      </div>
    </article>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STP-Receipt-${r.txnId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!r) return null;

  const taxes = Math.round(r.total * 0.05);
  const subtotal = r.total - taxes;
  const dateStr = new Date(r.paidAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-100 text-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-white">
      <header className="border-b border-slate-200/70 bg-white/90 text-slate-950 dark:border-white/10 dark:bg-slate-950/90 dark:text-white backdrop-blur-lg">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Smart Tour Planner" className="h-10 w-10 object-contain" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Smart Tour Planner</p>
              <p className="text-xs text-slate-500">Premium travel receipts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">
              Hi, <span className="font-medium text-white">{user}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-2xl shadow-slate-950/10 text-slate-950 dark:border-white/10 dark:bg-slate-950/85 dark:text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Receipt</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Payment confirmed</h1>
                <p className="mt-2 text-sm text-slate-400">Your travel booking is confirmed and your receipt is ready.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total paid</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">{inr(r.total)}</p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden bg-white/90 border border-slate-200/70 text-slate-950 shadow-soft dark:bg-slate-950/85 dark:border-white/10 dark:text-white">
            <div className="grid gap-6 px-6 py-8 sm:grid-cols-[1.2fr_0.8fr] sm:px-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/5">
                  <img src="/logo.png" alt="Smart Tour Planner" className="h-14 w-14 object-contain" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">Smart Tour Planner</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Curated journeys across India</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">support@smarttourplanner.com</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Receipt number" value={r.txnId} />
                  <Field label="Date" value={dateStr} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Traveler" value={user} />
                  <Field label="Payment" value={`**** ${r.cardLast4} · ${r.cardHolder}`} />
                  <Field label="Destination" value={r.state} />
                  <Field label="Travelers" value={`${r.people} people`} />
                  <Field label="Duration" value={`${r.nights} nights`} />
                  <Field label="Package" value={`${r.name} (${r.tier})`} />
                </div>

                <div className="rounded-[32px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-white/5">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>{inr(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>GST & taxes (5%)</span>
                      <span>{inr(taxes)}</span>
                    </div>
                    <div className="border-t border-slate-200/70 pt-4 text-lg font-semibold text-slate-950 dark:border-white/10 dark:text-white">
                      <div className="flex items-center justify-between">
                        <span>Total paid</span>
                        <span>{inr(r.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/80 p-6 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300">
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Booking details</p>
                <div className="space-y-4">
                  <Field label="Destination" value={r.state} />
                  <Field label="Hotel" value={`${r.hotel} (${r.hotelStars}★)`} />
                  <Field label="Guide" value={r.guide} />
                  <Field label="Arrival" value={r.inter} />
                  <Field label="Local travel" value={r.intra} />
                  {plan?.date ? <Field label="Travel date" value={plan.date} /> : null}
                  {plan?.phone ? <Field label="Phone" value={plan.phone} /> : null}
                </div>
                <div className="mt-6 rounded-3xl bg-white/5 p-4 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Important</p>
                  <p className="mt-2 text-sm leading-6">
                    Keep this receipt for your travel records. Contact support if you need an updated invoice or booking details.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-950/95 px-6 py-5 text-sm text-slate-400 sm:px-10">
              <p>Smart Tour Planner · Registered Office: New Delhi, India</p>
              <p>Receipt generated automatically</p>
            </div>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Button variant="hero" size="lg" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download receipt
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/plan")}
              className="border-white/15 text-white hover:border-white/30 hover:bg-white/5">
              <Home className="mr-2 h-4 w-4" /> Plan another trip
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default Receipt;
