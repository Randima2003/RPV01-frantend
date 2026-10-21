
const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://rpv01-backend-1.onrender.com/api/v1"
).replace(/\/+$/, "");

async function requestApi(path, options = {}) {
  const url = `${API_BASE}${path}`;

  console.log("Request URL:", url);

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      payload.message || `Request failed: ${response.status}`
    );
    error.status = response.status;
    error.details = payload.details;
    throw error;
  }

  return payload;
}

const requestAuth = (path, options = {}) =>
  requestApi(`/auth${path}`, options);

function post(path, data) {
  return requestAuth(path, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export const registerTraveler = (data) =>
  post("/register/traveler", data);

export const registerGuide = (data) =>
  post("/register/guide", data);

export const login = (data) => post("/login", data);

export const getCurrentUser = () => requestAuth("/me");

export const getGuides = () => requestAuth("/guides");

export const logout = () => post("/logout", {});

export const getTrips = () => requestApi("/trips");

export const createTrip = (data) =>
  requestApi("/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTrip = (tripId, data) =>
  requestApi(`/trips/${tripId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getBookings = () => requestApi("/bookings");

export const createBooking = (tripId, data) =>
  requestApi(`/trips/${tripId}/bookings`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateBooking = (bookingId, data) =>
  requestApi(`/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const respondToCounterOffer = (bookingId, status) =>
  requestApi(`/bookings/${bookingId}/respond`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const getBookingMessages = (bookingId) =>
  requestApi(`/bookings/${bookingId}/messages`);

export const sendBookingMessage = (bookingId, body) =>
  requestApi(`/bookings/${bookingId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });

export const submitPermissionRequest = (data) =>
  requestApi("/permissions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getPermissions = (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value != null)
  ).toString();

  return requestApi(`/permissions${qs ? `?${qs}` : ""}`);
};

export const getPermissionStats = () =>
  requestApi("/permissions/stats");

export const reviewPermission = (id, data) =>
  requestApi(`/permissions/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
