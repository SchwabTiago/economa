import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="border-gray-300 border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-zinc-400"
    />
  );
}
