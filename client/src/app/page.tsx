import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to your Finance Tracker
      </h1>
      <p className="text-muted-foreground text-lg max-w-[600px]">
        Manage your expenses, set goals, and take control of your financial
        future starting today.
      </p>

      <div className="mt-4 flex gap-4">
        <Link href="/register">
          <Button size="lg" className="px-8">
            Get Started
          </Button>
        </Link>
        {/* <Link href="/">
          <Button size="lg" className="px-8">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button size="lg" className="px-8">
            Register
          </Button>
        </Link> */}
      </div>
    </div>
  );
}
