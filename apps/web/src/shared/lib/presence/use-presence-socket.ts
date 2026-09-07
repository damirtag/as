import { useEffect } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from "@/shared/auth/token-store";
import { usePresenceStore } from "./presence-store";

const HEARTBEAT_INTERVAL_MS = 30_000;

export function usePresenceSocket(enabled: boolean): void {
  const setStatus = usePresenceStore((state) => state.setStatus);
  const clearStatuses = usePresenceStore((state) => state.clearStatuses);

  useEffect(() => {
    if (!enabled) {
      clearStatuses();
      return;
    }

    const socket = io(import.meta.env.VITE_PRESENCE_URL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: { token: getAccessToken() },
    });

    const heartbeat = () => socket.emit("presence:heartbeat");
    let heartbeatTimer: ReturnType<typeof setInterval> | undefined;

    socket.on("presence:changed", (update: {
      userId: string;
      isOnline: boolean;
      lastSeenAt: string | null;
    }) => {
      setStatus(update.userId, {
        isOnline: update.isOnline,
        lastSeenAt: update.lastSeenAt,
      });
    });

    socket.on("connect", () => {
      heartbeat();
      heartbeatTimer = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
    });

    socket.on("disconnect", () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      heartbeatTimer = undefined;
    });

    socket.on("connect_error", () => {
      socket.auth = { token: getAccessToken() };
    });

    socket.connect();

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      socket.removeAllListeners();
      socket.disconnect();
      clearStatuses();
    };
  }, [clearStatuses, enabled, setStatus]);
}
