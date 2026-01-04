"use client";

import { createContext, useContext, useRef } from "react";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";

const AnimationContext = createContext<AnimationContextType>({
  isReady: false,
  hasAnimated: false,
  setHasAnimated: () => {},
});

export const useAnimationReady = () => useContext(AnimationContext);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <html lang="en">
      <body>
        <main ref={contentRef} className="main_content">
          {/* <Navbar /> */}
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
