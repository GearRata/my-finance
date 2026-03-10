import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/login-form";
export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-4xl flex-col gap-6 ">
        <LoginForm />
      </div>
    </div>
  );
}
