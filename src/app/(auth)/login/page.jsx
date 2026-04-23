import { Suspense } from "react";
import LoginForm from "@/features/auth/LoginForm"; // Adjust path to your file
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    // The Suspense boundary tells Next.js to skip prerendering 
    // the searchParams part and handle it on the client side.
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDD0]">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}