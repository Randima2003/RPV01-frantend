import { io } from 'socket.io-client';
import { API_ORIGIN } from './auth';

export function openBookingSocket() {
  return io(API_ORIGIN, {
    withCredentials: true,
  });
}
