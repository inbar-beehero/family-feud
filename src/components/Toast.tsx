import type { ToastType } from "@/types";

interface ToastProps {
  msg: string;
  type: ToastType;
}

export function Toast({ msg, type }: ToastProps) {
  const bg =
    type === "ok"
      ? "bg-green-600"
      : type === "err"
        ? "bg-red-600"
        : "bg-blue-600";
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-bold text-lg animate-bounce ${bg}`}
    >
      {msg}
    </div>
  );
}
