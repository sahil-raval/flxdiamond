import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Diamond } from "@/lib/diamond_types";

interface ShortlistContextValue {
  shortlist: Diamond[];
  addToShortlist: (diamond: Diamond) => void;
  removeFromShortlist: (stockId: string) => void;
  clearShortlist: () => void;
  isInShortlist: (stockId: string) => boolean;
  count: number;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

const STORAGE_KEY = "flx_shortlist";

function loadFromStorage(): Diamond[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Diamond[]) : [];
  } catch {
    return [];
  }
}

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<Diamond[]>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist));
    } catch {}
  }, [shortlist]);

  const addToShortlist = useCallback((diamond: Diamond) => {
    setShortlist(prev =>
      prev.some(d => d.stockId === diamond.stockId) ? prev : [...prev, diamond]
    );
  }, []);

  const removeFromShortlist = useCallback((stockId: string) => {
    setShortlist(prev => prev.filter(d => d.stockId !== stockId));
  }, []);

  const clearShortlist = useCallback(() => {
    setShortlist([]);
  }, []);

  const isInShortlist = useCallback(
    (stockId: string) => shortlist.some(d => d.stockId === stockId),
    [shortlist]
  );

  return (
    <ShortlistContext.Provider
      value={{
        shortlist,
        addToShortlist,
        removeFromShortlist,
        clearShortlist,
        isInShortlist,
        count: shortlist.length,
      }}
    >
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside ShortlistProvider");
  return ctx;
}