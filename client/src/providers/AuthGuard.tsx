"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkCurrentUser } from "@/features/auth/services/auth.services";
import { CircleLoader } from "react-spinners";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await checkCurrentUser();
        const user = response.data;

        if (user.has_account === 0) {
          router.push("/onboarding");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center">
        <CircleLoader color="var(--ring)" loading={isLoading} size={250} />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
