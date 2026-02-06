import type { SelectHTMLAttributes } from "react";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="border rounded-lg border-gray-300 px-3 py-2 w-full outline-none focus:ring-2 focus:ring-zinc-400"
    />
  );
}
