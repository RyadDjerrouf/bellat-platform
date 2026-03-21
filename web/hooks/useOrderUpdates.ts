"use client";

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

/**
 * Subscribes to real-time status updates for a single order via WebSocket.
 * Connects to the /orders namespace on the API gateway, joins the order room,
 * and calls `onStatusUpdate` whenever the admin advances the order status.
 *
 * The connection is cleaned up when the component unmounts or the orderId changes.
 */
export function useOrderUpdates(
  orderId: string | null,
  token: string | null,
  onStatusUpdate: (newStatus: string) => void,
) {
  // Stable ref so the effect doesn't re-run when the callback identity changes
  const callbackRef = useRef(onStatusUpdate);
  callbackRef.current = onStatusUpdate;

  useEffect(() => {
    if (!orderId || !token) return;

    const socket: Socket = io(`${WS_URL}/orders`, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      socket.emit('subscribe_order', orderId);
    });

    socket.on('order_status_updated', (data: { orderId: string; status: string }) => {
      if (data.orderId === orderId) {
        callbackRef.current(data.status);
      }
    });

    socket.on('connect_error', (err) => {
      // Fail silently — the page still works without real-time updates
      console.warn('[WS] Order updates unavailable:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId, token]);
}
