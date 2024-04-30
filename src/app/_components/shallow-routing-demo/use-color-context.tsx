"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

export type Color = "RED" | "BLUE" | "YELLOW";
interface ColorContextType {
  color: Color;
  count: number;
  setColor: Dispatch<SetStateAction<Color>>;
  setCount: Dispatch<SetStateAction<number>>;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return context;
};

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [color, setColor] = useState<Color>("RED");
  const [count, setCount] = useState<number>(0);

  useEffect(function setupPopStateListener() {
    const handlePopState = (event: PopStateEvent): void => {
      if (event.state?.color) {
        setColor(event.state.color);
        setCount(event.state.count);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(
    function pushColorStateIfNeeded() {
      const isInitialRender = !window.history.state?.color;
      if (isInitialRender) {
        window.history.replaceState({ color, count }, "", pathname);
        return;
      }
      const isBrowserAction = window.history.state?.color === color;
      if (isBrowserAction) return;
      window.history.pushState({ color, count }, "", pathname);
    },
    [color, count, pathname]
  );

  return (
    <ColorContext.Provider
      value={{
        color,
        count,
        setColor,
        setCount,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};
