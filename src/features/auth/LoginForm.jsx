// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   Building2,
//   Mail,
//   Lock,
//   User,
//   ArrowRight,
//   Building,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// export default function LoginForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);

//   const [error, setError] = useState(null);

//   async function handleLogin(e) {
//     e.preventDefault();

//     const formData = new FormData(e.target);

//     const email = formData.get("email");
//     const password = formData.get("password");

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       setError(error.message);
//       return;
//     }

//     toast.success("Account Log In successfully 🎉", {
//     description: "Welcome to Kenley Property Systems",
//   });

//     router.push("/dashboard");
//   }

//   // Google log In
//   async function handleGoogleLogin() {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: `${window.location.origin}/auth/callback`,
//     },
//   });

//   if (error) {
//     toast.error("Google login failed");
//   }
// }

//   return (
//     <div className="flex min-h-screen">
//       <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-sm"
//         >
//           <Link href="/" className="mb-8 flex items-center gap-2 group">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg primary transition-transform group-hover:scale-110">
//               <Building2 className="h-5 w-5 primary-foreground-text" />
//             </div>
//             <span className="text-lg font-bold foreground-text ">
//               Kenley Property Systems
//             </span>
//           </Link>

//           <h1 className="mb-2 text-2xl font-bold foreground-text">
//             Welcome back
//           </h1>
//           <p className="mb-8 text-sm muted-foreground-text ">
//             Sign in to your account to continue
//           </p>

//           <div className="grid grid-cols-3 gap-3 mb-6">
//             {[
//               <svg key="g" className="h-4 w-4" viewBox="0 0 24 24">
//                 <path
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   fill="#EA4335"
//                 />
//               </svg>,
//               <svg
//                 key="gh"
//                 className="h-4 w-4"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
//               </svg>,
//               <svg
//                 key="a"
//                 className="h-4 w-4"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
//               </svg>,
//             ].map((icon, i) => (
//               <motion.div
//                 key={`provider-${i}`}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   variant="outline"
//                   className="w-full h-11"
//                   type="button"
//                   onClick={handleGoogleLogin}
//                 >
//                   {icon}
//                 </Button>
//               </motion.div>
//             ))}
//           </div>

//           <div className="relative mb-6">
//             <Separator />
//             <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 background px-3 text-xs muted-foreground-text ">
//               or register with email
//             </span>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="foreground-text">
//                 Email
//               </Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text " />
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="name@organisation.com"
//                   className="pl-10 h-11 
//                 focus-visible:ring-[#1F6B4A] focus-visible:border-[#1F6B4A]"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="foreground-text">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text " />
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Min. 8 characters"
//                   className="pl-10 pr-10 h-11 
//                 focus-visible:ring-[#1F6B4A] focus-visible:border-[#1F6B4A]"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 muted-foreground-text hover:text-[#123d2b] transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
//               <Button type="submit" className="w-full h-11 primary">
//                 Sign in <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </motion.div>
//           </form>

//           <p className="mt-6 text-center text-sm muted-foreground-text">
//             Don't have an account?{" "}
//             <Link
//               href="/register"
//               className="font-medium primary-text hover:underline"
//             >
//               Create account
//             </Link>
//           </p>
//         </motion.div>
//       </div>

//       <div className="hidden relative flex-1 overflow-hidden lg:flex">
//         <Image
//           src="https://res.cloudinary.com/dcfl8iot4/image/upload/v1772186411/auth-bg_kcnllx.jpg"
//           alt="Background Image"
//           fill
//           sizes="100vw"
//           className="absolute inset-0 object-cover"
//         />
//         <div className="absolute inset-0 bg-[linear-gradient(135deg,#1F6B4A,#2A8C5F,#123D2B)] opacity-85" />

//         <div className="relative flex flex-1 items-center justify-center p-12">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.3 }}
//             className="max-w-md text-[#f7f2e9]"
//           >
//             <Building2 className="mb-6 h-12 w-12" />
//             <h2 className="mb-4 text-3xl lg:text-4xl font-black">
//               Supported housing management, simplified
//             </h2>
//             <p className="mb-8 text-[#f7f2e9]/80 leading-relaxed">
//               Manage properties, service users, cases, and finances all in one
//               integrated platform designed for supported accommodation
//               providers.
//             </p>
//             <div className="grid grid-cols-2 gap-4">
//               {[
//                 { val: "2,400+", label: "Properties Managed" },
//                 { val: "98.2%", label: "Occupancy Rate" },
//                 { val: "150+", label: "Organisations" },
//                 { val: "99.9%", label: "Uptime" },
//               ].map((stat, i) => (
//                 <motion.div
//                   key={stat.label}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 + i * 0.1 }}
//                   className="rounded-lg bg-[#f7f2e9]/10 backdrop-blur-sm p-3"
//                 >
//                   <p className="text-xl font-bold">{stat.val}</p>
//                   <p className="text-xs text-[#f7f2e9]/70">{stat.label}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/superbase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Home, ShieldCheck, FileText, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * HELPER: Cleans filenames to prevent 400 errors from Supabase
 */
const sanitizeFileName = (file) => {
  const extension = file.name.split('.').pop();
  const safeBaseName = file.name
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  return `${Date.now()}-${safeBaseName}.${extension}`;
};

export default function AddPropertyForm() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    postcode: "",
    organisation: "",
    manager: "",
    status: "Active",
    rooms: "",
    rent: "",
    tenantName: "",
    leaseFile: null,
    floorPlanFile: null,
    insuranceFile: null,
  });

  // Start with an empty array or a stable ID to avoid hydration mismatch
  const [certificates, setCertificates] = useState([
    { id: "initial-cert", type: "", expiry: "", file: null },
  ]);

  // Prevent hydration mismatch by ensuring the client-specific IDs 
  // only render after the component has mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      { id: crypto.randomUUID(), type: "", expiry: "", file: null },
    ]);
  };

  const removeCertificate = (id) => {
    if (certificates.length > 1) {
      setCertificates(certificates.filter((cert) => cert.id !== id));
    }
  };

  const handleStaticFile = (e, field) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving property and uploading files...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      let leaseUrl = null;
      let floorUrl = null;
      let insuranceUrl = null;

      // --- 1. Upload Documents ---
      const uploadFile = async (file, folder) => {
        const cleanPath = `${folder}/${sanitizeFileName(file)}`;
        const { data, error } = await supabase.storage
          .from("property-documents")
          .upload(cleanPath, file);
        if (error) throw error;
        return data.path;
      };

      if (formData.leaseFile) leaseUrl = await uploadFile(formData.leaseFile, "lease");
      if (formData.floorPlanFile) floorUrl = await uploadFile(formData.floorPlanFile, "floorplans");
      if (formData.insuranceFile) insuranceUrl = await uploadFile(formData.insuranceFile, "insurance");

      // --- 2. Insert Property ---
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          property_name: formData.propertyName,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          organisation: formData.organisation,
          manager: user.email,
          status: formData.status,
          rooms: formData.rooms,
          rent: formData.rent,
          tenant_name: formData.tenantName,
          lease_url: leaseUrl,
          floor_plan_url: floorUrl,
          insurance_url: insuranceUrl,
          created_by: user.id,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // --- 3. Upload Certificates ---
      for (const cert of certificates) {
        if (cert.file && cert.type) {
          const path = await uploadFile(cert.file, "certificates");
          await supabase.from("property_certificates").insert({
            property_id: property.id,
            certificate_type: cert.type,
            expiry_date: cert.expiry,
            document_url: path,
          });
        }
      }

      toast.success("Property saved successfully!", { id: toastId });
      // Optional: Reset form or redirect
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save property", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Do not render the dynamic parts until mounted to prevent hydration errors
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
      <Card className="max-w-4xl mx-auto border-[#e1dbd2] bg-[#fbf8f2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2] mb-6">
          <CardTitle className="text-[#123d2b] text-xl md:text-2xl font-bold flex items-center gap-2">
            <Home className="w-6 h-6" />
            Property Onboarding
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Property Info */}
            <div className="space-y-4">
              <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Property Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    required
                    className="bg-[#e1dbd2] border-none"
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    className="bg-[#e1dbd2] border-none"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className="bg-[#e1dbd2] border-none" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" className="bg-[#e1dbd2] border-none" onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} />
                </div>
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            {/* Section 2: Management */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organisation</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, organisation: val })}>
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue placeholder="Select Org" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kenley Group">Kenley Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="Active" onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Onboarding">Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            {/* Section 3: Compliance */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Compliance & Documents
                </h3>
                <Button type="button" onClick={addCertificate} className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white h-8 w-8 p-0 rounded-full">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {certificates.map((cert, index) => (
                <div key={cert.id} className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50">
                  {certificates.length > 1 && (
                    <button type="button" onClick={() => removeCertificate(cert.id)} className="absolute -right-2 -top-2 bg-red-600 text-white rounded-full p-1 z-10">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="space-y-2">
                    <Label>Certificate Type</Label>
                    <Select onValueChange={(val) => {
                      const newCerts = [...certificates];
                      newCerts[index].type = val;
                      setCertificates(newCerts);
                    }}>
                      <SelectTrigger className="bg-[#e1dbd2] border-none">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gas">Gas Safety</SelectItem>
                        <SelectItem value="fire">Fire Risk Assessment</SelectItem>
                        <SelectItem value="epc">EPC</SelectItem>
                        <SelectItem value="elec">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input type="date" className="bg-[#e1dbd2] border-none" onChange={(e) => {
                      const newCerts = [...certificates];
                      newCerts[index].expiry = e.target.value;
                      setCertificates(newCerts);
                    }} />
                  </div>
                  <div className="space-y-2">
                    <Label>File</Label>
                    <div className="relative">
                      <Input type="file" className="hidden" id={`file-cert-${cert.id}`} onChange={(e) => {
                        const newCerts = [...certificates];
                        newCerts[index].file = e.target.files[0];
                        setCertificates(newCerts);
                      }} />
                      <Label htmlFor={`file-cert-${cert.id}`} className="flex flex-col items-center justify-center bg-[#e8e1d6] p-2 rounded cursor-pointer border border-[#e1dbd2] text-xs">
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="truncate max-w-25">{cert.file ? cert.file.name : "Upload"}</span>
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 4: Required Docs */}
            <div className="bg-[#e6f2ec] p-4 rounded-lg border border-[#1f6b4a]/20">
              <p className="text-[#15573c] text-sm font-semibold mb-4">Required Documents:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase">{field.replace('File', '')}</Label>
                    <Input type="file" id={field} className="hidden" onChange={(e) => handleStaticFile(e, field)} />
                    <Label htmlFor={field} className="flex flex-col items-center justify-center bg-white p-3 rounded border border-[#e1dbd2] cursor-pointer text-xs">
                      <Upload className="w-3 h-3 mb-1" />
                      <span className="truncate w-full text-center">{formData[field] ? formData[field].name : "Choose File"}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#1f6b4a] hover:bg-[#123d2b] text-white py-6">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Property Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}