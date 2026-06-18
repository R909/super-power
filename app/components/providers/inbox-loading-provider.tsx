"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface InboxLoadingCtx {
  inboxLoading: boolean;
  setInboxLoading: (v: boolean) => void;
}

const Ctx = createContext<InboxLoadingCtx>({
  inboxLoading: false,
  setInboxLoading: () => {},
});

export function InboxLoadingProvider({ children }: { children: ReactNode }) {
  const [inboxLoading, setInboxLoading] = useState(false);
  return <Ctx.Provider value={{ inboxLoading, setInboxLoading }}>{children}</Ctx.Provider>;
}

export const useInboxLoading = () => useContext(Ctx);
