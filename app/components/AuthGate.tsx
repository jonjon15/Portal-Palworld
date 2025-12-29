"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const isAuth = typeof window !== "undefined" ? localStorage.getItem("palworld_auth") : null;
    if (!isAuth) {
      router.push("/login");
    }
  }, [router]);
  return <>{children}</>;
}
