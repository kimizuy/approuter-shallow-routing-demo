"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

type ColorState = "RED" | "BLUE" | "YELLOW";
interface ColorContextType {
  colorState: ColorState;
  setColorState: (colorState: ColorState) => void;
}

const ColorStateContext = createContext<ColorContextType | undefined>(
  undefined
);

export const useColorState = () => {
  const context = useContext(ColorStateContext);
  if (!context) {
    throw new Error("useColorState must be used within a ColorStateProvider");
  }
  return context;
};

type EventState = { colorState: ColorState | undefined } | null;

export const ColorStateProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [colorState, setColorState] = useState<ColorState>("RED");

  useEffect(function setupPopStateListener() {
    const handlePopState = (event: PopStateEvent): void => {
      const state = event.state as EventState;
      if (!state?.colorState) return;
      setColorState(state.colorState);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(
    function pushColorStateIfNeeded() {
      const isInitialRender = !window.history.state?.colorState;
      if (isInitialRender) {
        window.history.replaceState({ colorState }, "", pathname);
        return;
      }
      const isBrowserAction = window.history.state?.colorState === colorState;
      if (isBrowserAction) return;
      window.history.pushState({ colorState }, "", pathname);
    },
    [colorState, pathname]
  );

  return (
    <ColorStateContext.Provider value={{ colorState, setColorState }}>
      {children}
    </ColorStateContext.Provider>
  );
};
