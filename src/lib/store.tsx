"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { demoUsers } from "./seed";
import type { Farm, Harvest, Listing, Order, Role, SessionUser } from "./types";
import * as seed from "./seed";

type Toast = { id: number; message: string };

type Store = {
  ready: boolean;
  user: SessionUser | null;
  login: (role: Role) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
  farms: Farm[];
  addFarm: (farm: Omit<Farm, "id">) => void;
  harvests: Harvest[];
  addHarvest: (harvest: Omit<Harvest, "id" | "batchCode">) => string;
  listings: Listing[];
  publishListing: (id: string) => void;
  addListing: (listing: Omit<Listing, "id" | "status">) => void;
  orders: Order[];
  setOrderStatus: (id: string, status: string) => void;
  toasts: Toast[];
  notify: (message: string) => void;
};

const StoreContext = createContext<Store | null>(null);
const KEY = "ranum.session";
const SESSION_EVENT = "ranum-session";

function subscribeSession(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(SESSION_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SESSION_EVENT, handler);
  };
}

function getSessionSnapshot() {
  return localStorage.getItem(KEY);
}

function writeSession(next: SessionUser | null) {
  if (next) localStorage.setItem(KEY, JSON.stringify(next));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const raw = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    () => null,
  );
  let user: SessionUser | null = null;
  if (raw) {
    try {
      user = JSON.parse(raw) as SessionUser;
    } catch {
      user = null;
    }
  }
  const [farms, setFarms] = useState(seed.farms);
  const [harvests, setHarvests] = useState(seed.harvests);
  const [listings, setListings] = useState(seed.listings);
  const [orders, setOrders] = useState(seed.orders);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const persist = (next: SessionUser | null) => {
    writeSession(next);
  };

  const notify = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const value = useMemo<Store>(
    () => ({
      ready,
      user,
      login: (role) => {
        const found = demoUsers.find((u) => u.role === role);
        if (found) {
          persist(found);
          notify(`Masuk sebagai ${found.name}`);
        }
      },
      loginWithEmail: (email) => {
        const found = demoUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!found) return false;
        persist(found);
        notify(`Masuk sebagai ${found.name}`);
        return true;
      },
      logout: () => persist(null),
      switchRole: (role) => {
        const found = demoUsers.find((u) => u.role === role);
        if (found) persist(found);
      },
      farms,
      addFarm: (farm) => {
        const id = `farm-${Date.now()}`;
        setFarms((prev) => [{ ...farm, id }, ...prev]);
        notify("Kebun baru disimpan");
      },
      harvests,
      addHarvest: (harvest) => {
        const code = `RN-MEL-20261028-${String(harvests.length + 3).padStart(3, "0")}`;
        setHarvests((prev) => [
          {
            ...harvest,
            id: `harv-${Date.now()}`,
            batchCode: code,
          },
          ...prev,
        ]);
        notify(`Panen dicatat. Batch ${code} dibuat`);
        return code;
      },
      listings,
      publishListing: (id) => {
        setListings((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "Published" } : item,
          ),
        );
        notify("Listing dipublikasikan ke marketplace");
      },
      addListing: (listing) => {
        setListings((prev) => [
          { ...listing, id: `lst-${Date.now()}`, status: "Published" },
          ...prev,
        ]);
        notify("Listing baru tayang di pasar");
      },
      orders,
      setOrderStatus: (id, status) => {
        setOrders((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item)),
        );
        notify(`Status pesanan diubah: ${status}`);
      },
      toasts,
      notify,
    }),
    [ready, user, farms, harvests, listings, orders, toasts],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
