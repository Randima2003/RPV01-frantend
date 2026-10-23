const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${API_ORIGIN}/api/v1`;

async function requestApi(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    return { success: false, message: 'Could not reach the server. Check your connection and try again.' };
  }

  let payload;
  try {
    const parsedPayload = await response.json();
    payload = parsedPayload && typeof parsedPayload === 'object' && !Array.isArray(parsedPayload)
      ? parsedPayload
      : null;
  } catch {
    return {
      success: false,
      status: response.status,
      message: 'The server returned an unreadable response. Please try again.',
    };
  }

  if (!response.ok) {
    if (path === '/auth/me' && response.status === 401) {
      return { success: false, status: 401, user: null, message: payload.message || 'Not logged in.' };
    }
    const error = new Error(payload?.message || 'The request could not be completed.');
    error.status = response.status;
    error.details = payload?.details;
    throw error;
  }

  return payload || { success: false, message: 'The server returned an invalid response.' };
}

const requestAuth = (path, options) => requestApi(`/auth${path}`, options);

function post(path, data) {
  return requestAuth(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export const registerTraveler = (data) => post('/register/traveler', data);
export const registerGuide = (data) => post('/register/guide', data);
export const login = (data) => post('/login', data);
export const getCurrentUser = () => requestAuth('/me');
export const getGuides = () => requestAuth('/guides');
export const logout = () => post('/logout', {});
export const getTrips = () => requestApi('/trips');
export const createTrip = (data) => requestApi('/trips', { method: 'POST', body: JSON.stringify(data) });
export const updateTrip = (tripId, data) => requestApi(`/trips/${tripId}`, { method: 'PATCH', body: JSON.stringify(data) });
export const getBookings = () => requestApi('/bookings');
export const createBooking = (tripId, data) => requestApi(`/trips/${tripId}/bookings`, { method: 'POST', body: JSON.stringify(data) });
export const updateBooking = (bookingId, data) => requestApi(`/bookings/${bookingId}`, { method: 'PATCH', body: JSON.stringify(data) });
export const respondToCounterOffer = (bookingId, status) => requestApi(`/bookings/${bookingId}/respond`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getBookingMessages = (bookingId) => requestApi(`/bookings/${bookingId}/messages`);
export const sendBookingMessage = (bookingId, body) => requestApi(`/bookings/${bookingId}/messages`, { method: 'POST', body: JSON.stringify({ body }) });

export const submitPermissionRequest = (data) => requestApi('/permissions', { method: 'POST', body: JSON.stringify(data) });
export const getPermissions = (params = {}) => {
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))).toString();
  return requestApi(`/permissions${qs ? `?${qs}` : ''}`);
};
export const getPermissionStats = () => requestApi('/permissions/stats');
export const reviewPermission = (id, data) => requestApi(`/permissions/${id}/review`, { method: 'PATCH', body: JSON.stringify(data) });
