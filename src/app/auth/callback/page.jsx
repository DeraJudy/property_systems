// // "use client";

// // import { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { supabase } from "@/lib/supabase";
// // import { toast } from "sonner";

// // export default function AuthCallback() {
// //   const router = useRouter();

// //   useEffect(() => {
// //     const finishLogin = async () => {
// //       const { data, error } = await supabase.auth.getUser();

// //       if (error || !data.user) {
// //         toast.error("Authentication failed");
// //         router.push("/login");
// //         return;
// //       }

// //       const user = data.user;

// //       // check if profile exists
// //       const { data: profile } = await supabase
// //         .from("profiles")
// //         .select("id")
// //         .eq("id", user.id)
// //         .single();

// //       if (!profile) {
// //         await supabase.from("profiles").insert({
// //           id: user.id,
// //           full_name: user.user_metadata.full_name || user.email,
// //         });
// //       }

// //       toast.success("Logged in with Google 🎉");

// //       router.push("/dashboard");
// //     };

// //     finishLogin();
// //   }, [router]);

// //   return (
// //     <div className="flex h-screen items-center justify-center">
// //       Signing you in...
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// export default function AuthCallback() {
//   const router = useRouter();

//   useEffect(() => {
//     const finishLogin = async () => {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();

//       if (error || !user) {
//         toast.error("Authentication failed");
//         router.push("/login");
//         return;
//       }

//       // Check if the user exists in profiles table
//       const { data: profile, error: profileError } = await supabase
//         .from("profiles")
//         .select("id")
//         .eq("id", user.id)
//         .single();

//       // If user does NOT exist → send to register
//       if (profileError || !profile) {
//         toast("Complete your registration");

//         router.push(`/register?email=${user.email}`);
//         return;
//       }

//       // User exists → continue to dashboard
//       toast.success("Logged in with Google 🎉");

//       router.push("/dashboard");
//     };

//     finishLogin();
//   }, [router]);

//   return (
//     <div className="flex h-screen items-center justify-center">
//       Signing you in...
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Authentication failed");
        router.push("/login");
        return;
      }

      const avatar = user.user_metadata?.avatar_url;
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email;

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      // If user does NOT exist → send to register page
      if (profileError || !profile) {
        toast("Complete your registration");

        router.push(`/register?email=${user.email}`);
        return;
      }

      // Update Google profile image + name
      await supabase
        .from("profiles")
        .update({
          avatar_url: avatar,
          full_name: fullName,
        })
        .eq("id", user.id);

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