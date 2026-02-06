import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return <div className="bg-white rounded-2xl shadow p-5">{children}</div>;
}
