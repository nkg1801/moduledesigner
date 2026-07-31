import { create } from "zustand";

interface ViewportState {
  scale: number;

  x: number;
  y: number;

  setScale: (scale: number) => void;
  setPosition: (x: number, y: number) => void;
  
}

export const useViewportStore =
  create<ViewportState>((set) => ({
    scale: 1,

    x: 0,
    y: 0,

    setScale: (scale) =>
      set({ scale }),

    setPosition: (x, y) =>
      set({
        x,
        y,
      }),
  }));