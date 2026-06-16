import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Compass, LogOut, ArrowLeft, ArrowRight, Hotel, MapPin, Clock, X } from "lucide-react";
import { LatLng } from "@/data/locations";
import { getStateLocations } from "@/data/locations";

const TripMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [selectedStop, setSelectedStop] = useState<LatLng | null>(null);

  const booking = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("stp_booking") || "");
    } catch {
      return null;
    }
  })();

  const user = sessionStorage.getItem("stp_user");

  const spots = booking ? getStateLocations(booking.state).spots : [];

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    if (!booking) { navigate("/packages"); return; }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || !booking) return;

    const { center, zoom, spots } = getStateLocations(booking.state);
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const makeIcon = (s: { label: string; type: "hotel" | "spot" }) => {
      const isHotel = s.type === "hotel";
      const bg = isHotel ? "#ef4444" : "#3b82f6";
      const emoji = isHotel ? "🏨" : "📍";
      const size = isHotel ? 32 : 28;
      return L.divIcon({
        className: "",
        html: `<div style="display:flex;flex-direction:column;align-items:center;width:max-content">
          <span style="background:${bg};color:#fff;font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.25);margin-bottom:4px">${s.label}</span>
          <div style="background:${bg};color:#fff;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${isHotel ? 16 : 14}px;box-shadow:0 2px 8px rgba(0,0,0,.3)">${emoji}</div>
        </div>`,
        iconSize: [120, size + 24],
        iconAnchor: [60, size + 24],
      });
    };

    const latlngs: L.LatLngExpression[] = [];
    spots.forEach((s) => {
      const icon = makeIcon(s);
      L.marker([s.lat, s.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${s.label}</strong><br/>${s.type === "hotel" ? "Your hotel stay" : "Tourist spot"}`);
      latlngs.push([s.lat, s.lng]);
    });

    if (latlngs.length > 1) {
      const hotel = spots.find((s) => s.type === "hotel");
      const rest = spots.filter((s) => s.type !== "hotel");
      const ordered: L.LatLngExpression[] = [];
      if (hotel) ordered.push([hotel.lat, hotel.lng]);
      rest.forEach((s) => ordered.push([s.lat, s.lng]));
      if (hotel) ordered.push([hotel.lat, hotel.lng]);

      L.polyline(ordered, {
        color: "#3b82f6",
        weight: 3,
        dashArray: "8 6",
        opacity: 0.8,
      }).addTo(map);
    }

    if (latlngs.length > 1) {
      map.fitBounds(L.latLngBounds(latlngs as [number, number][]).pad(0.15));
    }

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [ready]);

  const flyTo = (spot: LatLng) => {
    setSelectedStop(spot);
    mapInstanceRef.current?.flyTo([spot.lat, spot.lng], 14, { duration: 1 });
  };

  if (!ready || !booking) return null;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const hotelSpots = spots.filter((s) => s.type === "hotel");
  const touristSpots = spots.filter((s) => s.type === "spot");

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

      <main className="container py-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <Button variant="ghost" size="sm" onClick={() => navigate("/packages")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to packages
          </Button>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Your Trip Route — {booking.state}
          </h1>
          <p className="text-muted-foreground mb-6">
            🏨 Hotel: <span className="font-medium text-foreground">{booking.hotel}</span> · 
            The dashed line shows the suggested route covering all tourist spots and returning to your hotel.
          </p>

          <div className="flex gap-4">
            {/* Sidebar */}
            <div className="w-64 shrink-0 rounded-xl border border-border bg-card shadow-soft overflow-hidden flex flex-col">
              <div className="p-3 border-b border-border bg-muted/40">
                <h3 className="text-sm font-semibold text-foreground">Stops</h3>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[480px]">
                {hotelSpots.map((s, i) => (
                  <button
                    key={`hotel-${i}`}
                    onClick={() => flyTo(s)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors border-b border-border/40 ${selectedStop?.label === s.label && selectedStop?.type === s.type ? "bg-accent" : "hover:bg-accent/60"}`}
                  >
                    {s.image ? (
                      <img src={s.image} alt={s.label} loading="lazy" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-500 text-white text-xs">
                        <Hotel className="h-4 w-4" />
                      </span>
                    )}
                    <span className="truncate font-medium text-foreground">{s.label}</span>
                  </button>
                ))}
                {touristSpots.map((s, i) => (
                  <button
                    key={`spot-${i}`}
                    onClick={() => flyTo(s)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors border-b border-border/40 last:border-b-0 ${selectedStop?.label === s.label && selectedStop?.type === s.type ? "bg-accent" : "hover:bg-accent/60"}`}
                  >
                    {s.image ? (
                      <img src={s.image} alt={s.label} loading="lazy" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white text-xs">
                        <MapPin className="h-4 w-4" />
                      </span>
                    )}
                    <span className="truncate text-foreground">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Details Panel */}
              {selectedStop && (
                <div className="border-t border-border bg-muted/30 p-3">
                  {selectedStop.image && (
                    <img
                      src={selectedStop.image}
                      alt={selectedStop.label}
                      loading="lazy"
                      className="w-full h-28 rounded-lg object-cover mb-2"
                    />
                  )}
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-xs ${selectedStop.type === "hotel" ? "bg-red-500" : "bg-blue-500"}`}>
                        {selectedStop.type === "hotel" ? <Hotel className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground leading-tight">{selectedStop.label}</h4>
                    </div>
                    <button onClick={() => setSelectedStop(null)} className="text-muted-foreground hover:text-foreground p-0.5">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {selectedStop.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{selectedStop.duration}</span>
                    </div>
                  )}
                  {selectedStop.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{selectedStop.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="flex-1">
              <div
                ref={mapRef}
                className="w-full rounded-xl border border-border shadow-soft overflow-hidden"
                style={{ height: "480px" }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Hotel
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Tourist Spot
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-6 border-t-2 border-dashed border-blue-500" /> Route
            </span>
          </div>

          <div className="mt-8 flex justify-end">
            <Button variant="hero" size="lg" onClick={() => navigate("/payment")}>
              Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripMap;
