import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={[
        "rounded-lg py-2 px-4 font-medium transition disabled:opacity-50",
        className,
      ].join(" ")}
    />
  );
}
