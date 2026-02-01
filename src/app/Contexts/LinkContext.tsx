"use client";

import { createContext, useContext, useState } from "react";

interface LinkContextType {
  clickedLink: string;
  setClickedLink: (link: string) => void;
  isPanelActive: boolean;
  setIsPanelActive: any;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export function LinkProvider({ children }: { children: React.ReactNode }) {
  const [clickedLink, setClickedLink] = useState("");
  const [isPanelActive, setIsPanelActive] = useState(false);

  return (
    <LinkContext.Provider value={{ clickedLink, setClickedLink, isPanelActive, setIsPanelActive }}>
      {children}
    </LinkContext.Provider>
  );
}

export function useLinkContext() {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error("useLinkContext must be used within LinkProvider");
  }

  return context;
}
