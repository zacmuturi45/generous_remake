"use client";

import { createContext, useContext, useRef } from "react";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import { Lenisprovider } from "./Components/lenis/LenisContext";
import WipeTransition from "./Providers/TransitionProvider";
import { LinkProvider } from "./Contexts/LinkContext";

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
          <LinkProvider>
            <Lenisprovider>
              <Navbar />
              <WipeTransition>{children}</WipeTransition>
              <Footer />
            </Lenisprovider>
          </LinkProvider>
        </main>
      </body>
    </html>
  );
}
