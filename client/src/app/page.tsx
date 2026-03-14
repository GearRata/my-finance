import { Button } from "@/components/ui/button";
import Link from "next/link";
import Threads from "@/components/Threads";

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Threads amplitude={3} distance={0} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 p-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
          Welcome to your Finance Tracker
        </h1>
        <p className="text-muted-foreground text-lg max-w-[600px] md:text-xl">
          Manage your expenses, set goals, and take control of your financial
          future starting today.
        </p>
        <div className="mt-4 flex gap-4">
          <Link href="/register">
            <Button
              size="lg"
              className="px-10 h-12 text-lg shadow-lg hover:scale-105 transition-transform"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
