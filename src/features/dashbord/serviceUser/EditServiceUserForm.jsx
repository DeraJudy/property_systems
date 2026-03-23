// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// // Import your original form component, but we will pass "initialData" to it.
// import ServiceUserTabsForm from "@/features/dashbord/serviceUser/ServiceUserForm"; 

// export default function EditServiceUserForm() {
//   const { id } = useParams();
//   const router = useRouter();
//   const supabase = createClient();
//   const [initialData, setInitialData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data, error } = await supabase
//         .from("service_users")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         toast.error("Could not find user");
//         router.push("/service-users");
//       } else {
//         setInitialData(data);
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, [id, supabase, router]);

//   if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

//   // We render your existing form, but pass the mode and data as props
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6 text-[#123d2b]">Edit Service User Profile</h1>
//       <ServiceUserTabsForm isEdit={true} existingData={initialData} userId={id} />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceUserForm from "@/features/dashbord/serviceUser/ServiceUserForm"; 

export default function EditServiceUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("service_users")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not find the requested service user.");
        router.push("/service-users");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, supabase, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-[#1f6b4a]" />
        <p className="text-[#123d2b] font-medium animate-pulse">Loading Saved Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-[#fbf8f2] min-h-screen">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Editing
        </Button>
      </div>
      
      {/* We pass the fetched data into your existing form component */}
      <ServiceUserForm initialData={userData} isEdit={true} />
    </div>
  );
}