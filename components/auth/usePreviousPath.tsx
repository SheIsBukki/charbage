"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function usePreviousPath() {
  const pathname = usePathname();

  useEffect(() => {
    const current = sessionStorage.getItem("currentPath");

    if (current !== pathname) {
      sessionStorage.setItem("prevPath", current || "/");
      sessionStorage.setItem("currentPath", pathname);
    }
  }, [pathname]);

  return {
    current: pathname,
    previous:
      typeof window !== "undefined" ? sessionStorage.getItem("prevPath") : null,
  };
}
