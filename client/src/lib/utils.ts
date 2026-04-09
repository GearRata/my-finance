import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, noDecimals = true) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    ...(noDecimals && { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  }).format(value);
}
