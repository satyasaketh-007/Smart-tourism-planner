/**
 * Centralised API client for Smart Tour Planner backend.
 * All calls go to /api which is proxied to http://localhost:5000
 * via vite.config.ts in development.
 */

const BASE = "/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await res.text();
  let data: unknown;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      throw new Error(`Server returned invalid JSON: ${text}`);
    }
  } else {
    data = {};
  }

  if (!res.ok) {
    const errorMessage =
      typeof data === "object" && data !== null && "error" in data
        ? (data as { error?: string }).error
        : `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(errorMessage || `Request failed: ${res.status} ${res.statusText}`);
  }

  return data as T;
}

// ─── Auth ─────────────────────────────────────

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  fullName: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export async function apiRegister(payload: {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  phone?: string;
}): Promise<{ message: string; user: UserInfo }> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiLogin(payload: {
  username: string;
  password: string;
}): Promise<{ message: string; user: UserInfo }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Payments ────────────────────────────────

export interface PaymentRecord {
  _id: string;
  txnId: string;
  paidAt: string;
  cardHolder: string;
  cardLast4: string;
  state: string;
  packageName: string;
  tier: string;
  nights: number;
  hotel: string;
  hotelStars: number;
  guide: string;
  inter: string;
  intra: string;
  highlights: string[];
  perPerson: number;
  total: number;
  people: number;
  status: string;
}

export async function apiSavePayment(payload: {
  userId: string;
  username: string;
  txnId: string;
  paidAt: string;
  cardHolder: string;
  cardLast4: string;
  perPerson: number;
  total: number;
  people: number;
  state: string;
  packageName: string;
  tier: string;
  nights: number;
  hotel: string;
  hotelStars: number;
  guide: string;
  inter: string;
  intra: string;
  highlights: string[];
}): Promise<{ message: string; payment: PaymentRecord }> {
  return request("/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGetPayments(userId: string): Promise<{ payments: PaymentRecord[] }> {
  return request(`/payments/${userId}`);
}

export interface BookingRecord {
  _id: string;
  userId: string;
  username: string;
  travelerName: string;
  phone: string;
  travelDate: string | null;
  people: number;
  state: string;
  packageTier: string;
  packageName: string;
  nights: number;
  hotel: string;
  hotelStars: number;
  guide: string;
  inter: string;
  intra: string;
  highlights: string[];
  perPerson: number;
  total: number;
  paymentTxnId: string;
  paidAt: string;
  cardHolder: string;
  cardLast4: string;
  status: "confirmed" | "cancelled" | "completed";
}

export async function apiSaveBooking(payload: {
  userId: string;
  username: string;
  travelerName?: string;
  phone?: string;
  travelDate?: string;
  people: number;
  state: string;
  packageTier: string;
  packageName: string;
  nights: number;
  hotel: string;
  hotelStars: number;
  guide: string;
  inter: string;
  intra: string;
  highlights: string[];
  perPerson: number;
  total: number;
  paymentTxnId: string;
  paidAt: string;
  cardHolder: string;
  cardLast4: string;
}): Promise<{ message: string; booking: BookingRecord }> {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGetBookings(userId: string): Promise<{ bookings: BookingRecord[] }> {
  return request(`/bookings/${userId}`);
}

// ─── Trips ───────────────────────────────────

export interface TripRecord {
  _id: string;
  state: string;
  travelDate: string;
  travelerName: string;
  phone: string;
  people: number;
  packageTier: string;
  packageName: string;
  nights: number;
  hotel: string;
  hotelStars: number;
  guide: string;
  inter: string;
  intra: string;
  highlights: string[];
  paymentTxnId: string;
  totalPaid: number;
  status: "upcoming" | "ongoing" | "completed";
  bookedAt: string;
}

export async function apiEnrollTrip(payload: {
  userId: string;
  username: string;
  travelerName: string;
  phone: string;
  travelDate: string;
  people: number;
  state: string;
  packageTier: string;
  packageName: string;
  nights: number;
  hotel: string;
  hotelStars: number;
  guide: string;
  inter: string;
  intra: string;
  highlights: string[];
  paymentTxnId: string;
  totalPaid: number;
}): Promise<{ message: string; trip: TripRecord }> {
  return request("/trips", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGetTrips(userId: string): Promise<{ trips: TripRecord[] }> {
  return request(`/trips/${userId}`);
}
