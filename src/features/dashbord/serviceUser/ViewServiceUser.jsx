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
  Loader2, ArrowLeft, Edit, Mail, Phone, Calendar, MapPin,
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
  Video, Image as ImageIcon, Eye, CheckCircle2, AlertCircle
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

  // Upload States
  const [uploading, setUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [docToDelete, setDocToDelete] = useState(null);
const [deleteConfirmText, setDeleteConfirmText] = useState("");
  

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

  // const handleFileUpload = async (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   setUploading(true);
  //   try {
  //     for (const file of files) {
  //       const fileExt = file.name.split(".").pop();
  //       const fileName = `${Math.random()}.${fileExt}`;
  //       const filePath = `${id}/${fileName}`;

  //       // 1. Upload to Supabase Storage
  //       const { error: uploadError } = await supabase.storage
  //         .from("kws_documents")
  //         .upload(filePath, file);

  //       if (uploadError) throw uploadError;

  //       // 2. Get Public URL
  //       const {
  //         data: { publicUrl },
  //       } = supabase.storage.from("kws_documents").getPublicUrl(filePath);

  //       // 3. Save reference to Database
  //       await supabase.from("kws_documents").insert({
  //         service_user_id: id,
  //         file_url: publicUrl,
  //         file_name: file.name,
  //       });
  //     }
  //     toast.success("Documents uploaded successfully");
  //     fetchKWSDocuments();
  //   } catch (error) {
  //     toast.error("Error uploading files");
  //     console.error(error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleFileUpload = async () => {
    if (!selectedFile || !docTitle.trim()) {
      toast.error("Please provide both a title and a file");
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("kws_documents").upload(filePath, selectedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("kws_documents").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("kws_documents").insert({
        service_user_id: id,
        file_url: publicUrl,
        file_name: docTitle.trim(), // We use the custom title here
        original_name: selectedFile.name,
      });

      if (dbError) throw dbError;

      toast.success("Document added to audit trail");
      setDocTitle("");
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      fetchKWSDocuments();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 2. Add this helper function to handle icons
// const getFileIcon = (fileName) => {
//   const ext = fileName.toLowerCase().split('.').pop();
//   if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return <Video className="w-4 h-4" />;
//   if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon className="w-4 h-4" />; // Import Image as ImageIcon
//   return <FileText className="w-4 h-4" />;
// };

  const LiveThumbnail = ({ doc }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix for hydration: only start "live" features once mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const ext = doc.original_name?.toLowerCase().split('.').pop() || doc.file_url.split('.').pop();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  const isVideo = ['mp4', 'webm', 'mov', 'ogg'].includes(ext);
  const isDoc = ['pdf', 'doc', 'docx'].includes(ext);

  return (
    <div 
      className="relative aspect-video w-full bg-slate-900 overflow-hidden rounded-xl shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group/thumb"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* VIDEO PREVIEW */}
      {isVideo && mounted && (
        <div className="w-full h-full">
          <video
            src={doc.file_url}
            muted
            playsInline
            loop
            autoPlay={isHovered}
            className={`object-cover w-full h-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
          />
          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* IMAGE PREVIEW - Focused/Shorter View */}
      {isImage && (
        <div className="w-full h-full overflow-hidden">
           <img 
            src={doc.file_url} 
            alt={doc.file_name} 
            // object-cover handles the "shorter" view by cropping to the aspect-video container
            className={`object-cover w-full h-full transition-transform duration-[3000ms] ease-out ${isHovered ? 'scale-110' : 'scale-100'}`} 
          />
        </div>
      )}

      {/* DOCUMENT PREVIEW - Auto Scroll */}
      {isDoc && (
        <div className="w-full h-full bg-[#f8f5f0] relative flex justify-center pt-4 overflow-hidden">
          <div 
            className={`w-[75%] h-[200%] bg-white shadow-2xl border border-slate-200 p-4 transition-transform duration-[2500ms] ease-in-out ${isHovered ? '-translate-y-1/2' : 'translate-y-0'}`}
          >
            <div className="space-y-3">
              <div className="h-2 w-full bg-slate-100 rounded" />
              <div className="h-2 w-[90%] bg-slate-100 rounded" />
              <div className="h-2 w-[40%] bg-slate-100 rounded" />
              <div className="h-32 w-full bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
                 <FileText className="w-8 h-8 text-[#1f6b4a]/20" />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded" />
              <div className="h-2 w-[70%] bg-slate-100 rounded" />
            </div>
          </div>
          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
              <div className="bg-white p-3 rounded-full shadow-xl">
                 <FileText className="w-6 h-6 text-[#1f6b4a]" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* OVERLAY */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
           <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
              <div className="h-2 w-2 rounded-full bg-white" />
           </div>
           <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Preview</span>
        </div>
      </div>
    </div>
  );
};

  // 3. Update the Delete Logic to be triggered from the modal
const confirmDelete = async () => {
  if (deleteConfirmText !== "DELETE") {
    toast.error("Please type DELETE to confirm");
    return;
  }

  try {
    const urlParts = docToDelete.file_url.split("/");
    const filePath = `${id}/${urlParts[urlParts.length - 1]}`;

    await supabase.storage.from("kws_documents").remove([filePath]);
    await supabase.from("kws_documents").delete().eq("id", docToDelete.id);

    toast.success("Document permanently deleted");
    setDocToDelete(null);
    setDeleteConfirmText("");
    fetchKWSDocuments();
  } catch (error) {
    toast.error("Deletion failed");
  }
};

  // const handleDeleteDocument = async (doc) => {
  //   if (!window.confirm(`Are you sure you want to delete "${doc.file_name}"?`))
  //     return;

  //   try {
  //     // 1. Extract the file path from the URL to delete from storage
  //     // This assumes the path structure is: bucket/folder/filename
  //     const urlParts = doc.file_url.split("/");
  //     const filePath = `${id}/${urlParts[urlParts.length - 1]}`;

  //     const { error: storageError } = await supabase.storage
  //       .from("kws_documents")
  //       .remove([filePath]);

  //     if (storageError) throw storageError;

  //     // 2. Delete the record from the database
  //     const { error: dbError } = await supabase
  //       .from("kws_documents")
  //       .delete()
  //       .eq("id", doc.id);

  //     if (dbError) throw dbError;

  //     toast.success("Document deleted successfully");
  //     fetchKWSDocuments(); // Refresh the list
  //   } catch (error) {
  //     toast.error("Error deleting document");
  //     console.error(error);
  //   }
  // };

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
                <CardHeader className="flex flex-row items-center justify-between bg-white border-b p-6">
                  <div>
                    <CardTitle className="text-lg font-bold text-[#123d2b]">Key Working Sessions</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Evidence-based audit log
                    </p>
                  </div>

                  <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#123d2b] hover:bg-black transition-all">
                        <Plus className="mr-2 h-4 w-4" /> New Session Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Upload KWS Evidence</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground">Document Title</label>
                          <Input 
                            placeholder="e.g., Financial Stability Workshop" 
                            value={docTitle}
                            onChange={(e) => setDocTitle(e.target.value)}
                          />
                        </div>
                        
                        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                          <Input 
                            type="file" 
                            id="kws-file" 
                            className="hidden" 
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                          />
                          <label htmlFor="kws-file" className="cursor-pointer space-y-2 block">
                            <FileText className="w-8 h-8 mx-auto text-slate-400" />
                            <p className="text-xs font-medium">
                              {selectedFile ? selectedFile.name : "Select audit file (Image, Video, or PDF)"}
                            </p>
                          </label>
                        </div>

                        <Button 
                          className="w-full bg-[#1f6b4a]" 
                          disabled={uploading || !selectedFile || !docTitle}
                          onClick={handleFileUpload}
                        >
                          {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : "Finalize Upload"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>

                <CardContent className="p-6">
                  {kwsDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-10 mt-6">
  {kwsDocs.map((doc) => (
    <div key={doc.id} className="group relative flex flex-col gap-4">
      {/* Spacing is handled by the 'gap-10' in the parent grid */}
      <div 
        className="cursor-pointer"
        onClick={() => window.open(doc.file_url, '_blank')}
      >
        <LiveThumbnail doc={doc} />
      </div>

      <div className="flex gap-3 px-1">
        <div className="flex-shrink-0">
          <div className="h-9 w-9 rounded-lg bg-[#123d2b] flex items-center justify-center text-white text-[10px] font-black shadow-inner">
            {doc.file_name.substring(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm font-bold text-[#123d2b] line-clamp-2 leading-tight tracking-tight group-hover:text-[#1f6b4a] transition-colors">
            {doc.file_name}
          </h4>
          <p className="text-[10px] font-bold text-[#1f6b4a] mt-1 flex items-center gap-1 uppercase tracking-tighter opacity-70">
            <ShieldAlert className="w-3 h-3" /> Audit Verified
          </p>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 bg-white/90 backdrop-blur hover:bg-red-600 hover:text-white text-red-600 rounded-full shadow-xl border border-red-100 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setDocToDelete(doc);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  ))}
</div>
                  ) : (
                    <div className="text-center py-20 flex flex-col items-center opacity-40">
                      <FileText className="w-12 h-12 mb-4" />
                      <p className="text-sm font-serif">No session records found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* SECURE DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
        <DialogContent className="bg-white border-[#e1dbd2]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-[#123d2b]">
              You are about to delete <span className="font-bold">"{docToDelete?.file_name}"</span>. This cannot be undone.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground">
                Type <span className="text-red-600">DELETE</span> to confirm
              </label>
              <Input 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="border-red-200 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setDocToDelete(null)}>Cancel</Button>
              <Button 
                variant="destructive" className="flex-1 bg-red-600"
                onClick={confirmDelete}
                disabled={deleteConfirmText !== "DELETE"}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
