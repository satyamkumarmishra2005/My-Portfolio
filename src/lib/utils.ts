// Utility functions
import { type ClassValue, clsx } from "clsx";

/**
 * Combines class names using clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
