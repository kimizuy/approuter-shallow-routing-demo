"use client";

import { useRouter } from "next/navigation";
import { Color, ColorProvider, useColor } from "./use-color-context";

export function ShallowRoutingDemo() {
  const router = useRouter();

  return (
    <ColorProvider>
      <main className="flex min-h-screen flex-col items-center gap-16 p-24">
        <h1 className="text-4xl font-bold">
          Next.js App Router + Shallow Routing Demo
        </h1>
        <div className="flex gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={router.back}
          >
            Go Back
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={router.forward}
          >
            Go Forward
          </button>
        </div>
        <RedBludYellow />
      </main>
    </ColorProvider>
  );
}

function RedBludYellow() {
  const { color, count, setColor, setCount } = useColor();

  const handleColorClick = (c: Color) => {
    const isSameColor = c === color;
    if (isSameColor) return;
    setColor(c);
    setCount((current) => current + 1);
  };

  return (
    <div className="flex flex-row space-x-4">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleColorClick("RED");
        }}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleColorClick("BLUE");
        }}
      />
      <button
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleColorClick("YELLOW");
        }}
      />
      <div
        className={`w-24 h-24 ${
          color === "RED"
            ? "bg-red-500"
            : color === "BLUE"
            ? "bg-blue-500"
            : "bg-yellow-500"
        } grid place-items-center text-white font-bold text-2xl`}
      >
        {count}
      </div>
    </div>
  );
}
