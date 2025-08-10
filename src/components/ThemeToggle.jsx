

import { Moon } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <button
      className={cn(
        "fixed max-sm:hidden top-5 right-5 z-50 p-2 rounded-full transition-colors duration-300",
        "focus:outline-hidden"
      )}
    >
      <Moon className="h-6 w-6 text-blue-300" />
    </button>
  );
};

