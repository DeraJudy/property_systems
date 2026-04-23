import LoginForm from "@/features/auth/LoginForm"; // Ensure path is correct
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDD0]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}