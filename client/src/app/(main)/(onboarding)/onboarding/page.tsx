"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createAccount } from "@/lib/services/account.services";

export default function OnboardingPage() {
  const router = useRouter();
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: account,
        balance: Number(balance),
      };
      await createAccount(payload);
      setTimeout(() => {
        toast.success("Welcome! Let's get started.", {
          position: "top-center",
        });
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-8">
      <div className="mx-auto w-full max-w-sm space-y-6 animate-fade-in-down">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome! 👋</h1>
          <p className="text-muted-foreground">
            Let's set up your first wallet or bank account to start tracking
            your finances.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="accountName">Wallet/Account Name</FieldLabel>
              <Input
                id="accountName"
                placeholder="e.g. Cash, SCB, KBank"
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="initialBalance">Initial Balance</FieldLabel>
              <Input
                id="initialBalance"
                type="number"
                placeholder="0"
                required
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </Field>

            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Setting up..." : "Finish Setup"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
