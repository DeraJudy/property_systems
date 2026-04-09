// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { motion } from "framer-motion";
// import {
//   Loader2, ArrowLeft, Edit, Mail, Phone, Calendar,
//   MapPin, HeartPulse, Banknote, ShieldAlert, FileText,
//   UserCircle, Briefcase, ExternalLink, Hash, Fingerprint
// } from "lucide-react";
// import Link from "next/link";

// const fadeInUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.4 }
// };

// export default function ViewServiceUser() {
//   const { id } = useParams();
//   const router = useRouter();
//   const supabase = createClient();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUserDetails();
//   }, [id]);

//   const fetchUserDetails = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("service_users")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (error) throw error;
//       setUser(data);
//     } catch (error) {
//       console.error("Error:", error);
//       router.push("/service-users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTitle = (title) => {
//     if (!title) return "";
//     return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
//   };

//   if (loading) {
//     return (
//       <div className="flex h-[80vh] items-center justify-center">
//         <Loader2 className="animate-spin h-10 w-10 text-[#1f6b4a]" />
//       </div>
//     );
//   }

//   const DataField = ({ label, value, icon: Icon, fullWidth = false }) => (
//     <div className={`space-y-1.5 ${fullWidth ? 'col-span-full' : ''}`}>
//       <div className="flex items-center gap-1.5 text-[#123d2b]/60">
//         {Icon && <Icon className="w-3.5 h-3.5" />}
//         <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
//       </div>
//       <p className="text-sm font-semibold text-[#123d2b] leading-snug">
//         {value || <span className="text-muted-foreground font-normal italic">Not recorded</span>}
//       </p>
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 bg-[#fbf8f2] min-h-screen"
//     >
//       {/* Top Navigation Bar */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#f1ede4]">
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
//         </Button>
//         <Link href={`/service-users/${id}/edit`}>
//           <Button className="bg-[#1f6b4a] hover:bg-[#123d2b] shadow-lg shadow-green-900/10 transition-all">
//             <Edit className="mr-2 h-4 w-4" /> Edit Profile
//           </Button>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//         {/* Profile Sidebar (Left) */}
//         <motion.div {...fadeInUp} className="lg:col-span-4 xl:col-span-3 space-y-6">
//           <Card className="border-[#e1dbd2] shadow-xl overflow-hidden sticky top-8">
//             <div className="h-32 bg-linear-to-br from-[#123d2b] to-[#1f6b4a]" />
//             <CardContent className="pt-0 -mt-16 flex flex-col items-center text-center px-6 pb-8">
//               <Avatar className="h-32 w-32 border-8 border-[#fbf8f2] shadow-2xl">
//                 <AvatarImage src={user.avatar_url} />
//                 <AvatarFallback className="bg-[#123d2b] text-white text-3xl font-serif">
//                   {user.first_name?.[0]}{user.surname?.[0]}
//                 </AvatarFallback>
//               </Avatar>
//               <h2 className="mt-6 text-2xl font-black text-[#123d2b] tracking-tight">
//                 {formatTitle(user.title)} {user.first_name} {user.surname}
//               </h2>
//               <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
//                 <Fingerprint className="w-3 h-3" />
//                 <span className="text-xs font-mono uppercase tracking-tighter">{user.ni_number || "NO NI RECORDED"}</span>
//               </div>

//               <div className="mt-6 flex flex-wrap gap-2 justify-center">
//                 <Badge className={user.is_employed ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
//                   {user.is_employed ? "Currently Employed" : "Unemployed"}
//                 </Badge>
//                 {user.is_smoker === "yes" && (
//                   <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border border-orange-200">Smoker</Badge>
//                 )}
//               </div>

//               <div className="w-full mt-8 space-y-4 pt-6 border-t border-[#e1dbd2]/50">
//                 <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
//                   <div className="bg-white p-2 rounded-full shadow-sm"><Mail className="w-4 h-4 text-[#1f6b4a]" /></div>
//                   <span className="truncate font-medium">{user.email || "No email"}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
//                   <div className="bg-white p-2 rounded-full shadow-sm"><Phone className="w-4 h-4 text-[#1f6b4a]" /></div>
//                   <span className="font-medium">{user.contact_no || "No phone"}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
//                   <div className="bg-white p-2 rounded-full shadow-sm"><MapPin className="w-4 h-4 text-[#1f6b4a]" /></div>
//                   <span className="font-medium">Room: {user.assigned_room || "TBD"}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Details Section (Right) */}
//         <div className="lg:col-span-8 xl:col-span-9 space-y-8">

//           {/* Information Sections Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* Demographic */}
//             <motion.div {...fadeInUp}>
//               <Card className="h-full border-[#e1dbd2] hover:shadow-md transition-shadow">
//                 <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
//                   <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
//                     <UserCircle className="w-4 h-4" /> Personal Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-2 gap-6 pt-6">
//                   <DataField label="Birth Date" value={user.dob} icon={Calendar} />
//                   <DataField label="Age" value={`${user.age} Years`} />
//                   <DataField label="Gender" value={user.gender} />
//                   <DataField label="NHS Number" value={user.nhs_number} icon={Hash} />
//                   <DataField label="Ethnicity" value={user.ethnic_group} fullWidth />
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Financial */}
//             <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
//               <Card className="h-full border-[#e1dbd2] hover:shadow-md transition-shadow">
//                 <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
//                   <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
//                     <Banknote className="w-4 h-4" /> Financial Profile
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6 pt-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <DataField label="Benefit Type" value={user.benefit_type} />
//                     <DataField label="Payment" value={user.benefit_amount ? `£${user.benefit_amount} / ${user.benefit_frequency}` : null} />
//                   </div>
//                   <Separator className="bg-[#e1dbd2]/50" />
//                   <div className="grid grid-cols-2 gap-4">
//                     <DataField label="Employer" value={user.employer_name} icon={Briefcase} />
//                     <DataField label="Job Title" value={user.job_title} />
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Medical Section */}
//           <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
//             <Card className="border-[#e1dbd2] hover:shadow-md transition-shadow">
//               <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
//                 <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
//                   <HeartPulse className="w-4 h-4" /> Medical & Health History
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#e1dbd2]/50">
//                   <div className="p-6 space-y-6">
//                     <DataField label="Reported Allergies" value={user.allergies} fullWidth />
//                     <DataField label="Active Medications" value={user.medication_details} fullWidth />
//                   </div>
//                   <div className="p-6 space-y-6 bg-[#f1ede4]/10">
//                     <div className="space-y-1">
//                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Health Summaries</span>
//                       <div className="mt-4 space-y-4">
//                         <div className="bg-white p-4 rounded-lg border border-[#e1dbd2]/50 shadow-sm">
//                           <p className="text-[9px] font-black text-[#1f6b4a] uppercase mb-1">Physical Health</p>
//                           <p className="text-xs text-[#123d2b] leading-relaxed">{user.physical_health_history || "No physical health records provided."}</p>
//                         </div>
//                         <div className="bg-white p-4 rounded-lg border border-[#e1dbd2]/50 shadow-sm">
//                           <p className="text-[9px] font-black text-[#1f6b4a] uppercase mb-1">Mental Health</p>
//                           <p className="text-xs text-[#123d2b] leading-relaxed">{user.mental_health_history || "No mental health records provided."}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Forensic & Risk Section */}
//           <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
//             <Card className="border-[#e1dbd2] bg-white border-l-4 border-l-[#123d2b]">
//               <CardHeader className="bg-[#f1ede4]/20 border-b border-[#e1dbd2]/50">
//                 <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
//                   <ShieldAlert className="w-4 h-4" /> Risk & Forensic Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-6">
//                 <DataField label="Forensic Background" value={user.forensic_background} />
//                 <DataField label="Probation Details" value={user.probation_details} />
//                 <DataField label="Risk Assessments" value={user.risk_from_others} />
//                 <DataField label="Safety Precautions" value={user.interview_precautions} />
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Documents Section */}
//           <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
//             <Card className="border-[#e1dbd2] shadow-sm">
//               <CardHeader className="bg-[#123d2b] border-b border-[#123d2b]">
//                 <CardTitle className="text-sm font-black flex items-center gap-2 text-white uppercase tracking-widest">
//                   <FileText className="w-4 h-4" /> Compliance Documents
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//                   {[
//                     { label: "Identity Verification", url: user.id_verification_url },
//                     { label: "Tenancy Agreement", url: user.tenancy_agreement_url },
//                     { label: "Benefit Documentation", url: user.benefit_letter_url },
//                     { label: "Risk Assessment Form", url: user.risk_assessment_url },
//                   ].map((doc, idx) => (
//                     <div key={idx} className="group relative p-4 border rounded-xl bg-[#fbf8f2] hover:border-[#1f6b4a] transition-all flex flex-col gap-3">
//                       <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
//                         <FileText className="w-5 h-5 text-[#1f6b4a]" />
//                       </div>
//                       <span className="text-xs font-bold text-[#123d2b]">{doc.label}</span>
//                       {doc.url ? (
//                         <a
//                           href={doc.url}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="flex items-center justify-center gap-2 w-full mt-2 text-[10px] font-black uppercase bg-[#123d2b] text-white py-2 rounded-lg hover:bg-[#1f6b4a] transition-colors"
//                         >
//                           View File <ExternalLink className="w-3 h-3" />
//                         </a>
//                       ) : (
//                         <div className="mt-2 text-[10px] text-center font-bold text-slate-400 bg-slate-100 py-2 rounded-lg italic uppercase">
//                           No Upload
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//         </div>
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/superbase/clientUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  MapPin,
  HeartPulse,
  Banknote,
  ShieldAlert,
  FileText,
  UserCircle,
  Briefcase,
  ExternalLink,
  Hash,
  Fingerprint,
  ClipboardList,
  Home,
  Plus,
  Clock,
  Copy,
  Edit3,
  Trash2,
  Download,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function ViewServiceUser() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [kwsDocs, setKwsDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    fetchSupportLogs();
    fetchKWSDocuments();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("service_users")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error("Error:", error);
      router.push("/service-users");
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportLogs = async () => {
    setLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from("support_logs")
        .select("*")
        .eq("service_user_id", id)
        .order("session_date", { ascending: false });

      if (error) {
        // IMPROVED LOGGING:
        console.error(
          "Supabase Error Details:",
          error.message,
          error.details,
          error.hint,
        );
        throw error;
      }
      setLogs(data || []);
    } catch (err) {
      console.error("Full Catch Error:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchKWSDocuments = async () => {
    const { data, error } = await supabase
      .from("kws_documents") // Assuming this table exists
      .select("*")
      .eq("service_user_id", id)
      .order("created_at", { ascending: false });
    if (!error) setKwsDocs(data);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${id}/${fileName}`;

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("kws_documents")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("kws_documents").getPublicUrl(filePath);

        // 3. Save reference to Database
        await supabase.from("kws_documents").insert({
          service_user_id: id,
          file_url: publicUrl,
          file_name: file.name,
        });
      }
      toast.success("Documents uploaded successfully");
      fetchKWSDocuments();
    } catch (error) {
      toast.error("Error uploading files");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (doc) => {
    if (!window.confirm(`Are you sure you want to delete "${doc.file_name}"?`))
      return;

    try {
      // 1. Extract the file path from the URL to delete from storage
      // This assumes the path structure is: bucket/folder/filename
      const urlParts = doc.file_url.split("/");
      const filePath = `${id}/${urlParts[urlParts.length - 1]}`;

      const { error: storageError } = await supabase.storage
        .from("kws_documents")
        .remove([filePath]);

      if (storageError) throw storageError;

      // 2. Delete the record from the database
      const { error: dbError } = await supabase
        .from("kws_documents")
        .delete()
        .eq("id", doc.id);

      if (dbError) throw dbError;

      toast.success("Document deleted successfully");
      fetchKWSDocuments(); // Refresh the list
    } catch (error) {
      toast.error("Error deleting document");
      console.error(error);
    }
  };

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const formatTitle = (title) => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[#1f6b4a]" />
      </div>
    );
  }

  const DataField = ({ label, value, icon: Icon, fullWidth = false }) => (
    <div className={`space-y-1.5 ${fullWidth ? "col-span-full" : ""}`}>
      <div className="flex items-center gap-1.5 text-[#123d2b]/60">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#123d2b] leading-snug">
        {value || (
          <span className="text-muted-foreground font-normal italic">
            Not recorded
          </span>
        )}
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8  min-h-screen"
    >
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-[#123d2b] hover:bg-[#f1ede4]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
        </Button>
        <div className="flex gap-3">
          <Link href={`/service-users/${id}/add`}>
            <Button
              variant="outline"
              className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#1f6b4a] hover:text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Support Log
            </Button>
          </Link>
          <Link href={`/service-users/${id}/edit`}>
            <Button className="bg-[#1f6b4a] hover:bg-[#123d2b] shadow-lg shadow-green-900/10 transition-all">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Sidebar (Left) */}
        <motion.div
          {...fadeInUp}
          className="lg:col-span-4 xl:col-span-3 space-y-6"
        >
          <Card className="border-[#e1dbd2] shadow-xl overflow-hidden sticky top-8">
            <div className="h-32 bg-linear-to-br from-[#123d2b] to-[#1f6b4a]" />
            <CardContent className="pt-0 -mt-16 flex flex-col items-center text-center px-6 pb-8">
              <Avatar className="h-32 w-32 border-8 border-[#fbf8f2] shadow-2xl">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-[#123d2b] text-white text-3xl font-serif">
                  {user.first_name?.[0]}
                  {user.surname?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-6 text-2xl font-black text-[#123d2b] tracking-tight">
                {formatTitle(user.title)} {user.first_name} {user.surname}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                <Fingerprint className="w-3 h-3" />
                <span className="text-xs font-mono uppercase tracking-tighter">
                  {user.ni_number || "NO NI RECORDED"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <Badge
                  className={
                    user.is_employed
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                  }
                >
                  {user.is_employed ? "Currently Employed" : "Unemployed"}
                </Badge>
              </div>

              <div className="w-full mt-8 space-y-4 pt-6 border-t border-[#e1dbd2]/50">
                <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Mail className="w-4 h-4 text-[#1f6b4a]" />
                  </div>
                  <span className="truncate font-medium">
                    {user.email || "No email"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Phone className="w-4 h-4 text-[#1f6b4a]" />
                  </div>
                  <span className="font-medium">
                    {user.contact_no || "No phone"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <MapPin className="w-4 h-4 text-[#1f6b4a]" />
                  </div>
                  <span className="font-medium">
                    Room: {user.assigned_room || "TBD"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details Section (Right) - TABBED INTERFACE */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-[#f1ede4] p-1 border border-[#e1dbd2]">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="medical"
                className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white"
              >
                Health & Risk
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white"
              >
                Support Logs
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="kws"
                className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white"
              >
                Key Working Session
              </TabsTrigger>
            </TabsList>

            {/* TAB: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div {...fadeInUp}>
                  <Card className="h-full border-[#e1dbd2]">
                    <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                      <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                        <UserCircle className="w-4 h-4" /> Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6 pt-6">
                      <DataField
                        label="Birth Date"
                        value={user.dob}
                        icon={Calendar}
                      />
                      <DataField label="Age" value={`${user.age} Years`} />
                      <DataField label="Gender" value={user.gender} />
                      <DataField
                        label="NHS Number"
                        value={user.nhs_number}
                        icon={Hash}
                      />
                      <DataField
                        label="Ethnicity"
                        value={user.ethnic_group}
                        fullWidth
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                  <Card className="h-full border-[#e1dbd2]">
                    <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                      <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                        <Banknote className="w-4 h-4" /> Financial Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <DataField
                          label="Benefit Type"
                          value={user.benefit_type}
                        />
                        <DataField
                          label="Payment"
                          value={
                            user.benefit_amount
                              ? `£${user.benefit_amount} / ${user.benefit_frequency}`
                              : null
                          }
                        />
                      </div>
                      <Separator className="bg-[#e1dbd2]/50" />
                      <div className="grid grid-cols-2 gap-4">
                        <DataField
                          label="Employer"
                          value={user.employer_name}
                          icon={Briefcase}
                        />
                        <DataField label="Job Title" value={user.job_title} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <Card className="border-[#e1dbd2]">
                <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                    <Home className="w-4 h-4" /> Accommodation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <DataField
                      label="Current Room"
                      value={user.assigned_room}
                    />
                    <DataField label="Move-in Date" value={user.move_in_date} />
                    <DataField label="Status" value="Resident" />
                    <DataField label="Property" value="Main House" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: MEDICAL & RISK */}
            <TabsContent value="medical" className="space-y-6">
              <motion.div {...fadeInUp}>
                <Card className="border-[#e1dbd2]">
                  <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                    <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                      <HeartPulse className="w-4 h-4" /> Medical & Health
                      History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#e1dbd2]/50">
                      <div className="p-6 space-y-6">
                        <DataField
                          label="Reported Allergies"
                          value={user.allergies}
                          fullWidth
                        />
                        <DataField
                          label="Active Medications"
                          value={user.medication_details}
                          fullWidth
                        />
                      </div>
                      <div className="p-6 space-y-6 bg-[#f1ede4]/10">
                        <div className="bg-white p-4 rounded-lg border border-[#e1dbd2]/50 shadow-sm">
                          <p className="text-[9px] font-black text-[#1f6b4a] uppercase mb-1">
                            Physical Health
                          </p>
                          <p className="text-xs text-[#123d2b] leading-relaxed">
                            {user.physical_health_history ||
                              "No physical health records provided."}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-[#e1dbd2]/50 shadow-sm">
                          <p className="text-[9px] font-black text-[#1f6b4a] uppercase mb-1">
                            Mental Health
                          </p>
                          <p className="text-xs text-[#123d2b] leading-relaxed">
                            {user.mental_health_history ||
                              "No mental health records provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Card className="border-[#e1dbd2] border-l-4 border-l-[#123d2b]">
                  <CardHeader className="bg-[#f1ede4]/20 border-b border-[#e1dbd2]/50">
                    <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                      <ShieldAlert className="w-4 h-4" /> Risk & Forensic
                      Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-6">
                    <DataField
                      label="Forensic Background"
                      value={user.forensic_background}
                    />
                    <DataField
                      label="Probation Details"
                      value={user.probation_details}
                    />
                    <DataField
                      label="Risk Assessments"
                      value={user.risk_from_others}
                    />
                    <DataField
                      label="Safety Precautions"
                      value={user.interview_precautions}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* TAB: SUPPORT LOGS (The table from the second code context) */}
            <TabsContent value="logs">
              <Card className="border-[#e1dbd2]">
                <CardHeader className="border-b border-[#e1dbd2]/50 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                    <ClipboardList className="w-4 h-4" /> Session History
                    <div className="flex gap-3">
                      <Link href={`/service-users/${id}/add`}>
                        <Button
                          variant="outline"
                          className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#1f6b4a] hover:text-white"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Support Log
                        </Button>
                      </Link>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {loadingLogs ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="animate-spin text-[#1f6b4a]" />
                    </div>
                  ) : logs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-[#e1dbd2] text-[#123d2b]/60 uppercase text-[10px] font-black tracking-widest">
                            <th className="pb-3 px-2">Date & Time</th>
                            <th className="pb-3 px-2">Staff</th>
                            <th className="pb-3 px-2">Type</th>
                            <th className="pb-3 px-2">Duration</th>
                            <th className="pb-3 px-2">Notes</th>
                            <th className="pb-3 px-2">Attachment</th>
                            <th className="pb-3 px-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e1dbd2]/30">
                          {logs.map((log) => (
                            <tr
                              key={log.id}
                              className="hover:bg-[#f1ede4]/20 transition-colors group"
                            >
                              {/* ... previous tds (Date, Staff, Type, Duration, Notes) ... */}
                              <td className="py-4 px-2 whitespace-nowrap">
                                <div className="font-bold text-[#123d2b]">
                                  {log.session_date}
                                </div>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{" "}
                                  {log.session_time || "--:--"}
                                </div>
                              </td>
                              <td className="py-4 px-2 text-[#123d2b] font-medium">
                                {log.staff_name}
                              </td>
                              <td className="py-4 px-2">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] uppercase border-[#123d2b]/20 text-[#123d2b]"
                                >
                                  {log.session_type}
                                </Badge>
                              </td>
                              <td className="py-4 px-2 font-mono text-xs text-[#123d2b]">
                                {log.duration}
                              </td>
                              <td
                                className="py-4 px-2 text-xs text-muted-foreground max-w-40 truncate"
                                title={log.notes}
                              >
                                {log.notes}
                              </td>

                              {/* NEW ATTACHMENT COLUMN */}
                              <td className="py-4 px-2">
                                {log.attachment_url ? (
                                  <a
                                    href={log.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="flex items-center gap-1 text-[10px] font-bold text-[#1f6b4a] hover:underline"
                                  >
                                    <FileText className="w-3 h-3" />
                                    VIEW
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground italic">
                                    None
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-2 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-[#123d2b] hover:bg-[#123d2b]/10"
                                    onClick={() => {
                                      navigator.clipboard.writeText(log.notes);
                                      toast.success("Notes copied");
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-[#1f6b4a] hover:bg-[#1f6b4a]/10"
                                    onClick={() =>
                                      router.push(
                                        `/support-logs/edit/${log.id}`,
                                      )
                                    }
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground italic text-sm">
                      No support logs found for this resident.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: DOCUMENTS */}
            <TabsContent value="documents">
              <Card className="border-[#e1dbd2]">
                <CardHeader className="bg-[#123d2b] border-b border-[#123d2b]">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-white uppercase tracking-widest">
                    <FileText className="w-4 h-4" /> Compliance Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Identity Verification",
                        url: user.id_verification_url,
                      },
                      {
                        label: "Tenancy Agreement",
                        url: user.tenancy_agreement_url,
                      },
                      {
                        label: "Benefit Documentation",
                        url: user.benefit_letter_url,
                      },
                      {
                        label: "Risk Assessment Form",
                        url: user.risk_assessment_url,
                      },
                    ].map((doc, idx) => (
                      <div
                        key={idx}
                        className="group relative p-4 border rounded-xl bg-[#fbf8f2] hover:border-[#1f6b4a] transition-all flex flex-col gap-3"
                      >
                        <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5 text-[#1f6b4a]" />
                        </div>
                        <span className="text-xs font-bold text-[#123d2b]">
                          {doc.label}
                        </span>
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full mt-2 text-[10px] font-black uppercase bg-[#123d2b] text-white py-2 rounded-lg hover:bg-[#1f6b4a] transition-colors"
                          >
                            View File <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <div className="mt-2 text-[10px] text-center font-bold text-slate-400 bg-slate-100 py-2 rounded-lg italic uppercase">
                            No Upload
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kws" className="space-y-6">
              <Card className="border-[#e1dbd2]">
                <CardHeader className="flex flex-row items-center justify-between bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                    <Edit3 className="w-4 h-4" /> Key Working Session Documents
                  </CardTitle>

                  {/* UPLOAD MODAL */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#1f6b4a] hover:bg-[#123d2b]">
                        <Plus className="mr-2 h-4 w-4" /> Upload Documents
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#fbf8f2] border-[#e1dbd2]">
                      <DialogHeader>
                        <DialogTitle className="text-[#123d2b]">
                          Upload KWS Files
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="border-2 border-dashed border-[#e1dbd2] rounded-lg p-8 text-center hover:border-[#1f6b4a] transition-colors">
                          <Input
                            type="file"
                            multiple
                            className="hidden"
                            id="kws-upload"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                          <label
                            htmlFor="kws-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <FileText className="w-8 h-8 text-[#1f6b4a]" />
                            <span className="text-sm font-medium text-[#123d2b]">
                              {uploading
                                ? "Uploading..."
                                : "Click to select multiple files"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              PDF, Images, or Word Docs
                            </span>
                          </label>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>

                <CardContent className="pt-6">
                  {kwsDocs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {kwsDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border border-[#e1dbd2] rounded-lg bg-white hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-[#f1ede4] p-2 rounded text-[#1f6b4a]">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span
                                className="text-xs font-bold text-[#123d2b] truncate pr-2"
                                title={doc.file_name}
                              >
                                {doc.file_name}
                              </span>
                              {/* Date removed as requested */}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* VIEW BUTTON - Always opens the unique file_url for this specific document */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100"
                              onClick={() => {
                                // Check if the file is a Word document
                                const isDoc =
                                  doc.file_name
                                    .toLowerCase()
                                    .endsWith(".doc") ||
                                  doc.file_name.toLowerCase().endsWith(".docx");

                                if (isDoc) {
                                  // Use Google Docs Viewer for Office files
                                  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.file_url)}&embedded=true`;
                                  window.open(googleViewerUrl, "_blank");
                                } else {
                                  // Open PDFs and Images normally
                                  window.open(doc.file_url, "_blank");
                                }
                              }}
                              title="View Document"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>

                            {/* DOWNLOAD BUTTON - GREEN SHADE */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#1f6b4a] bg-[#f1ede4] hover:bg-[#e1dbd2] border border-[#e1dbd2]"
                              onClick={() =>
                                handleDownload(doc.file_url, doc.file_name)
                              }
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5 rotate-45" />
                            </Button>

                            {/* DELETE BUTTON - RED SHADE */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100"
                              onClick={() => handleDeleteDocument(doc)}
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground italic text-sm">
                      No KWS documents uploaded yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
