import { RegisterForm } from "@/features/auth/components/register-form";
import Image from "next/image";
import logo from "../../../../public/assets/images/Register_logo.jpg";

export default function RegisterPage() {
  return (
    <div className="grid w-full min-h-svh lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={logo}
          alt="logo"
          loading="eager"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          style={{ maxWidth: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
