"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        toast.error("Authentication failed");
        router.push("/login");
        return;
      }

      const user = data.user;

      // check if profile exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata.full_name || user.email,
        });
      }

      toast.success("Logged in with Google 🎉");

      router.push("/dashboard");
    };

    finishLogin();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      Signing you in...
    </div>
  );
}