// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   User,
//   Home,
//   Users,
//   FileText,
//   Activity,
//   Download,
//   ExternalLink,
//   Loader2,
//   Calendar,
//   Mail,
//   Phone,
//   Briefcase
// } from "lucide-react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";

// const supabase = createClient();

// // --- Helper Component for Data Rows ---
// const DataRow = ({ label, value }) => (
//   <div className="py-3 border-b border-[#e1dbd2]/50 flex justify-between items-center">
//     <span className="text-sm font-semibold text-[#6b7d74] uppercase tracking-wider">{label}</span>
//     <span className="text-[#123d2b] font-medium">{value || "N/A"}</span>
//   </div>
// );

// // --- Helper Component for Document Links ---
// const DocCard = ({ title, path }) => {
//   if (!path) return null;

//   const getPublicUrl = () => {
//     const { data } = supabase.storage.from('service-user-docs').getPublicUrl(path);
//     return data.publicUrl;
//   };

//   return (
//     <div className="flex items-center justify-between p-4 bg-white border border-[#e1dbd2] rounded-xl shadow-sm hover:shadow-md transition-all">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-[#e6f2ec] rounded-lg text-[#1f6b4a]">
//           <FileText size={20} />
//         </div>
//         <span className="font-bold text-[#123d2b]">{title}</span>
//       </div>
//       <div className="flex gap-2">
//         <a
//           href={getPublicUrl()}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-lg transition-colors"
//         >
//           <ExternalLink size={18} />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default function ViewServiceUserProfile() {
//   const router = useRouter();
//   const { id } = useParams();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('service_users_table')
//           .select('*')
//           .eq('id', id)
//           .single();

//         if (error) throw error;
//         setUserData(data);
//       } catch (err) {
//         toast.error("User not found");
//         router.push("/dashboard/service-users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id, router]);

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e6]">
//       <Loader2 className="animate-spin text-[#1f6b4a] mb-4" size={40} />
//       <p className="text-[#123d2b] font-bold">Loading Profile...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen py-12 px-4">
//       <div className="max-w-5xl mx-auto space-y-8">

//         {/* Navigation & Header */}
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-[#1f6b4a] font-bold hover:underline"
//           >
//             <ArrowLeft size={20} /> Back to List
//           </button>
//           <button
//             onClick={() => router.push(`/service-users/${id}/edit`)}
//             className="bg-[#1f6b4a] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#123d2b]"
//           >
//             Edit Profile
//           </button>
//         </div>

//         {/* Hero Header */}
//         <div className="bg-[#123d2b] text-white p-10 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div className="flex items-center gap-6">
//             <div className="w-20 h-20 bg-[#1f6b4a] rounded-2xl flex items-center justify-center text-3xl font-bold">
//               {userData.first_name[0]}{userData.surname[0]}
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold">{userData.title} {userData.first_name} {userData.surname}</h1>
//               <p className="text-[#c3e2d1] flex items-center gap-2 mt-1">
//                 <Calendar size={16} /> DOB: {userData.dob} ({userData.age} years old)
//               </p>
//             </div>
//           </div>
//           <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
//             <p className="text-xs uppercase tracking-widest text-[#c3e2d1] mb-1">NI Number</p>
//             <p className="text-xl font-mono font-bold">{userData.ni_number || "NOT PROVIDED"}</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//           {/* Left Column: Contact & Personal */}
//           <div className="md:col-span-2 space-y-8">

//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <User className="text-[#1f6b4a]" /> Personal & Contact Info
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
//                 <DataRow label="Gender" value={userData.gender} />
//                 <DataRow label="Ethnic Group" value={userData.ethnic_group} />
//                 <DataRow label="Ethnic Origin" value={userData.ethnic_origin} />
//                 <DataRow label="Organisation" value={userData.organisation} />
//                 <DataRow label="Phone" value={userData.contact_number} />
//                 <DataRow label="Email" value={userData.email} />
//               </div>
//             </section>

//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <Home className="text-[#1f6b4a]" /> Placement & Address
//               </h2>
//               <div className="space-y-2">
//                 <DataRow label="Property Name" value={userData.property_name} />
//                 <DataRow label="Assigned Room" value={userData.assigned_room} />
//                 <DataRow label="Street Address" value={userData.street_address} />
//                 <DataRow label="Previous Address" value={userData.previous_address} />
//                 <DataRow label="Keyworker (Assigned To)" value={userData.assigned_to} />
//                 <DataRow label="Approved By" value={userData.approved_by} />
//               </div>
//             </section>

//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <Users className="text-[#1f6b4a]" /> Next of Kin
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
//                 <DataRow label="Full Name" value={userData.nok_name} />
//                 <DataRow label="Relationship" value={userData.nok_relationship} />
//                 <DataRow label="Phone" value={userData.nok_phone} />
//                 <DataRow label="Email" value={userData.nok_email} />
//                 <div className="sm:col-span-2">
//                   <DataRow label="Postal Address" value={userData.nok_address} />
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Right Column: Documents */}
//           <div className="space-y-8">
//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm h-full">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <FileText className="text-[#1f6b4a]" /> Documents
//               </h2>

//               <div className="space-y-4">
//                 <p className="text-xs font-bold text-[#6b7d74] uppercase">Core Files</p>
//                 <DocCard title="Medical Document" path={userData.medical_doc_path} />
//                 <DocCard title="ID Verification" path={userData.id_v_path} />
//                 <DocCard title="Benefit Letter" path={userData.benefit_letter_path} />
//                 <DocCard title="Risk Assessment" path={userData.risk_assessment_path} />

//                 {userData.additional_docs && userData.additional_docs.length > 0 && (
//                   <>
//                     <p className="text-xs font-bold text-[#6b7d74] uppercase mt-6">Additional Documents</p>
//                     {userData.additional_docs.map((doc, idx) => (
//                       <DocCard key={idx} title={doc.name} path={doc.path} />
//                     ))}
//                   </>
//                 )}

//                 {/* Empty State for Docs */}
//                 {!userData.medical_doc_path && !userData.id_v_path && !userData.additional_docs?.length && (
//                   <div className="text-center py-10 text-[#6b7d74] italic text-sm">
//                     No documents uploaded for this user.
//                   </div>
//                 )}
//               </div>
//             </section>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Home,
  Users,
  FileText,
  Activity,
  ExternalLink,
  Loader2,
  Calendar,
  Mail,
  Phone,
  Plus,
  Trash2,
  Video,
  CheckCircle,
  Download,
  Clock,
  Fingerprint,
  MapPin,
  UserCircle,
  Hash,
  Copy,
  Edit3,
  ClipboardList,
  Play, ShieldAlert,
  Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const supabase = createClient();

// --- Helper Components ---
const DataRow = ({ label, value }) => (
  <div className="py-3 border-b border-[#e1dbd2]/50 flex justify-between items-center">
    <span className="text-sm font-semibold text-[#6b7d74] uppercase tracking-wider">
      {label}
    </span>
    <span className="text-[#123d2b] font-medium">{value || "N/A"}</span>
  </div>
);

const DocCard = ({ title, path }) => {
  if (!path) return null;
  const { data } = supabase.storage
    .from("service-user-docs")
    .getPublicUrl(path);
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-[#e1dbd2] rounded-xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e6f2ec] rounded-lg text-[#1f6b4a]">
          <FileText size={20} />
        </div>
        <span className="font-bold text-[#123d2b]">{title}</span>
      </div>
      <a
        href={data.publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-lg"
      >
        <ExternalLink size={18} />
      </a>
    </div>
  );
};

export default function ViewServiceUserProfile() {
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const [user, setUser] = useState(null);

  // Tab Content States
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [kwsDocs, setKwsDocs] = useState([]);

  // Upload States (KWS)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [kwsName, setKwsName] = useState("");
  //   const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 16));
  const [docUrl, setDocUrl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const [editingId, setEditingId] = useState(null); // Track if we are editing
  const [viewingMedia, setViewingMedia] = useState(null); // For the video player
  const [docToDelete, setDocToDelete] = useState(null); // For secure deletion
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [selectedDocFile, setSelectedDocFile] = useState(null);
const [selectedMediaFile, setSelectedMediaFile] = useState(null);


  const [existingKWSList, setExistingKWSList] = useState([]);
  const [selectedKWSId, setSelectedKWSId] = useState("");

  // Replace your existing sessionDate state with this:
  const [sessionDate, setSessionDate] = useState(() => {
    const now = new Date();
    // Adjusts to local time and formats for the input requirement
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });

  const fetchAllData = async () => {
    if (!id) return;
    try {
      setLoading(true);

      // 1. Fetch User Data
      const { data: user, error: userError } = await supabase
        .from("service_users_table")
        .select("*")
        .eq("id", id)
        .single();

      if (userError) throw userError;

      // 2. Fetch Support Logs (This was missing, causing the ReferenceError)
      const { data: supportLogs, error: logsError } = await supabase
        .from("support_logs")
        .select("*")
        .eq("service_user_id", id)
        .order("session_date", { ascending: false });

      if (logsError) console.error("Logs Error:", logsError.message);

    // const { data: kwsData, error: kwsError } = await supabase
    //   .from('kws_documents') 
    //   .select('id, kws_name, doc_url, media_url');

    // if (kwsError) console.error("Dropdown Fetch Error:", kwsError.message);
    // setExistingKWSList(kwsData || []); 

    // // 2. Fetch for Table (Records to show in UI)
    // const { data: finalizedData, error: finalizedError } = await supabase
    //   .from('kws_finalized_records') 
    //   .select('*')
    //   .eq('service_user_id', id)
    //   .order('session_date', { ascending: false });

    // if (finalizedError) console.error("Table Fetch Error:", finalizedError.message);
    // setKwsDocs(finalizedData || []);

    const { data: dropdownData, error: dropdownError } = await supabase
  .from('kws_documents')
  .select('id, kws_name, doc_url, media_url');

if (dropdownError) console.error("Dropdown Error:", dropdownError.message);

// 2. Fetch for Table
const { data: tableData, error: tableError } = await supabase
  .from('kws_finalized_records')
  .select('id, kws_name, doc_url, media_url, session_date')
  .eq('service_user_id', id);

if (tableError) console.error("Table Error:", tableError.message);

      // Update States
    //   setUserData(user); // Now 'user' is defined
    //   setLogs(supportLogs || []); // Now 'supportLogs' is defined
    //   setExistingKWSList(kws || []);
    //   setKwsDocs(kws || []);

    setUserData(user); 
setLogs(supportLogs || []); 
setExistingKWSList(dropdownData || []); // Use dropdownData instead of kws
setKwsDocs(tableData || []);

    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const handleKWSSelect = (e) => {
    const kwsId = e.target.value;
    setSelectedKWSId(kwsId);

    if (kwsId === "new") {
      setKwsName("");
      setDocUrl(null);
      setMediaUrl(null);
      return;
    }

    // Find the selected session in our list
    const selected = existingKWSList.find((k) => k.id.toString() === kwsId);
    if (selected) {
      setKwsName(selected.kws_name);
      setDocUrl(selected.doc_url);
      setMediaUrl(selected.media_url);
      // You can also sync the date if preferred:
      // setSessionDate(new Date(selected.session_date).toISOString().slice(0, 16));
    }
  };

  // 4. The updated Finalize function (Saving to a NEW table as requested)
  const finalizeKWS = async () => {
    if (!kwsName) return toast.error("Please provide a session title");

    try {
      const { error } = await supabase
        .from("kws_finalized_records") // Ensure this table exists in Supabase
        .insert([
          {
            service_user_id: id,
            kws_name: kwsName,
            session_date: sessionDate,
            doc_url: docUrl,
            media_url: mediaUrl,
            is_manual_entry: selectedKWSId === "new",
          },
        ]);

      if (error) throw error;

      toast.success("Session finalized and saved");
      setIsUploadModalOpen(false);
      // Optional: Reset local states
    } catch (err) {
      console.error(err);
      toast.error("Failed to save final record");
    }
  };

  // Helper to reset modal state correctly

  const handleFileUpload = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  const isDoc = type === 'doc';
  const setter = isDoc ? setDocUrl : setMediaUrl;
  const loadingSetter = isDoc ? setIsUploadingDoc : setIsUploadingMedia;

  try {
    loadingSetter(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("kws-attachments")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("kws-attachments").getPublicUrl(filePath);
    setter(data.publicUrl);
    toast.success(`${isDoc ? 'Document' : 'Media'} uploaded`);
  } catch (error) {
    toast.error("Upload failed");
    console.error(error);
  } finally {
    loadingSetter(false);
  }
};

  
    const confirmDelete = async () => {
  if (deleteConfirmText !== "DELETE") {
    toast.error("Please type DELETE to confirm");
    return;
  }

  try {
    // 1. Storage Cleanup (Only if it's a manual entry)
    if (docToDelete.is_manual_entry === true) {
      const filesToDelete = [];
      
      // Helper to extract the filename from the Supabase public URL
      const getFileName = (url) => {
        if (!url) return null;
        const parts = url.split("/");
        return parts[parts.length - 1];
      };

      const docFile = getFileName(docToDelete.doc_url);
      const mediaFile = getFileName(docToDelete.media_url);

      if (docFile) filesToDelete.push(docFile);
      if (mediaFile) filesToDelete.push(mediaFile);

      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("kws-attachments") // Your specific bucket ID
          .remove(filesToDelete);

        if (storageError) {
          console.error("Storage deletion error:", storageError.message);
          // We continue to DB deletion even if storage fails, 
          // or you can throw error here if storage must be deleted first.
        }
      }
    }

    // 2. Database Deletion (Always happens)
    const { error: dbError } = await supabase
      .from("kws_finalized_records") // Your specific table name
      .delete()
      .eq("id", docToDelete.id);

    if (dbError) throw dbError;

    toast.success("Record deleted successfully");
    
    // 3. Reset state and refresh UI
    setDocToDelete(null);
    setDeleteConfirmText(""); // Clear the input field
    fetchAllData(); // Refresh the table list
    
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Deletion failed");
  }
};

    const handleCloseModal = async () => {
  try {
    const filesToRemove = [];
    const getFileName = (url) => {
      if (!url || typeof url !== 'string') return null;
      const parts = url.split("/");
      return parts[parts.length - 1];
    };

    // Clean up storage if the user uploaded files but closed without saving a NEW entry
    if (selectedKWSId === "new" && !editingId) {
      const docFile = getFileName(docUrl);
      const mediaFile = getFileName(mediaUrl);

      if (docFile) filesToRemove.push(docFile);
      if (mediaFile) filesToRemove.push(mediaFile);

      if (filesToRemove.length > 0) {
        await supabase.storage
          .from("kws-attachments")
          .remove(filesToRemove);
      }
    }
  } catch (err) {
    console.error("Cleanup error during close:", err);
  } finally {
    setIsUploadModalOpen(false);
    setKwsName("");
    setDocUrl(null);
    setMediaUrl(null);
    setSelectedKWSId("new");
    setEditingId(null);
    setDeleteConfirmText("");
    
    const now = new Date();
    setSessionDate(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  }
};

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f5f0e6]">
        <Loader2 className="animate-spin text-[#1f6b4a]" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-[#123d2b] hover:bg-[#e1dbd2]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-[#123d2b] text-white p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#1f6b4a] rounded-2xl flex items-center justify-center text-3xl font-bold uppercase">
              {userData.first_name[0]}
              {userData.surname[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {userData.title} {userData.first_name} {userData.surname}
              </h1>
              <p className="text-emerald-100/70">
                NI: {userData.ni_number || "N/A"}
              </p>
            </div>
          </div>
          <Link
            href={`/service-users/${id}/edit`}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl transition-all"
          >
            Edit Profile
          </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#e8e1d6] p-1 border border-[#e1dbd2] gap-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
            >
              Support Logs
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="kws"
              className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
            >
              Key Working Session
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent
            value="overview"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#123d2b] uppercase tracking-tighter">
                <User size={20} /> Personal Details
              </h2>
              <DataRow
                label="Full Name"
                value={`${userData.first_name} ${userData.surname}`}
              />
              <DataRow label="DOB" value={userData.dob} />
              <DataRow label="Age" value={userData.age} />
              <DataRow label="Gender" value={userData.gender} />
            </div>
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#123d2b] uppercase tracking-tighter">
                <Home size={20} /> Placement
              </h2>
              <DataRow label="Property" value={userData.property_name} />
              <DataRow label="Room" value={userData.assigned_room} />
              <DataRow label="Assigned To" value={userData.assigned_to} />
            </div>
          </TabsContent>

          {/* SUPPORT LOGS TAB */}
          {/* <TabsContent value="logs">
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#123d2b]">Support History</h2>
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
              </div>
              {logs.length === 0 ? <p className="text-center py-10 text-gray-500 italic">No support logs recorded yet.</p> : (
                <div className="space-y-4">
                  {logs.map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                      <div>
                        <p className="font-bold text-[#123d2b]">{new Date(log.session_date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600 truncate max-w-md">{log.summary || "View details..."}</p>
                      </div>
                      <button className="text-[#1f6b4a] font-bold text-sm">View Log</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent> */}

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
                                    router.push(`/support-logs/edit/${log.id}`)
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

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents">
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
              <h2 className="text-2xl font-bold mb-8 text-[#123d2b]">
                Official Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocCard title="ID Verification" path={userData.id_v_path} />
                <DocCard
                  title="Medical Document"
                  path={userData.medical_doc_path}
                />
                <DocCard
                  title="Benefit Letter"
                  path={userData.benefit_letter_path}
                />
                <DocCard
                  title="Risk Assessment"
                  path={userData.risk_assessment_path}
                />
                {userData.additional_docs?.map((doc, i) => (
                  <DocCard key={i} title={doc.name} path={doc.path} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kws">
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#123d2b]">
                    Key Working Sessions
                  </h2>
                  <p className="text-sm text-gray-500">
                    Audit trail of session evidence and documents
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-[#1f6b4a] text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"
                >
                  <Plus size={20} /> New Session Record
                </button>
              </div>

              <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-4 text-[10px] uppercase font-black text-slate-400">
                        Date & Time
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500">
                        Title
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500">
                        Attachment
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">
                        Video
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kwsDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="p-4 text-sm font-bold text-slate-600">
                          {new Date(doc.session_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="p-4 text-sm font-bold text-[#123d2b]">
                          {doc.kws_name}
                        </td>
                        <td className="p-4">
                          {doc.doc_url && (
                            <Button
                              variant="ghost"
                              className="h-8 text-[10px] font-black gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-3"
                              onClick={() => openDocument(doc.doc_url)}
                            >
                              <FileText className="w-3 h-3" /> VIEW DOC
                            </Button>
                          )}
                        </td>
                        <td className="p-4">
                          {doc.media_url && (
                            <div
                              className="relative h-14 w-24 bg-slate-900 rounded overflow-hidden cursor-pointer shadow-sm ring-1 ring-slate-200"
                              onClick={() => setViewingMedia(doc.media_url)}
                            >
                              {doc.media_url.match(/\.(mp4|webm|mov|ogg)/i) ? (
                                <div className="relative h-full w-full">
                                  <video
                                    src={`${doc.media_url}#t=0.1`}
                                    className="object-cover w-full h-full opacity-60"
                                  />
                                  <Play className="absolute inset-0 m-auto text-white w-4 h-4" />
                                </div>
                              ) : (
                                <img
                                  src={doc.media_url}
                                  className="object-cover w-full h-full"
                                  alt="thumbnail"
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingId(doc.id);
                              setKwsName(doc.kws_name);
                              setDocUrl(doc.doc_url);
                              setMediaUrl(doc.media_url);
                              setIsUploadModalOpen(true);
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => setDocToDelete(doc)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* KWS UPLOAD MODAL */}
        <Dialog 
  open={isUploadModalOpen} 
  onOpenChange={(open) => {
    // Prevent closing by clicking outside or hitting ESC unless we run cleanup
    if (!open) handleCloseModal();
  }}
>
        <DialogContent className="sm:max-w-lg bg-[#fbf8f2] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#123d2b] flex items-center gap-2">
                <ClipboardList className="text-[#1f6b4a]" /> Finalize Session Record
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* 1. SELECT EXISTING KWS */}
              <div>
        <label className="text-[10px] font-black uppercase text-[#6b7d74] mb-2 block">
          Link to Existing Session (Optional)
        </label>
        <select 
          value={selectedKWSId}
          onChange={handleKWSSelect}
          className="w-full p-3 rounded-xl border border-[#e1dbd2] bg-white text-sm outline-none"
        >
          <option value="new">-- Create New Entry / Manual --</option>
          {existingKWSList.map((k) => (
            <option key={k.id} value={k.id}>{k.kws_name}</option>
          ))}
        </select>
      </div>

              <Separator className="bg-[#e1dbd2]" />

              {/* 2. TITLE */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-[#6b7d74]">
                  Session Title
                </label>
                <Input
                  value={kwsName}
                  onChange={(e) => setKwsName(e.target.value)}
                  placeholder="e.g. Monthly Progress Review"
                  className="rounded-xl border-[#e1dbd2]"
                />
              </div>

              {/* 3. DATE/TIME (Leave as is) */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-[#6b7d74]">
                  Date & Time of Record
                </label>
                <Input
                  type="datetime-local"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="rounded-xl border-[#e1dbd2]"
                />
              </div>

              {/* 4. AUTO-FETCHED ATTACHMENTS */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${docUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2]"}`}
                >
                  <FileText
                    className={`mx-auto mb-2 ${docUrl ? "text-emerald-600" : "text-gray-300"}`}
                  />
                  <p className="text-[10px] font-bold uppercase">
                    {docUrl ? "Document Attached" : "No Document"}
                  </p>
                  {docUrl && (
                    <span className="text-[9px] text-emerald-700 block mt-1">
                      Ready ✓
                    </span>
                  )}
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${mediaUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2]"}`}
                >
                  <Video
                    className={`mx-auto mb-2 ${mediaUrl ? "text-emerald-600" : "text-gray-300"}`}
                  />
                  <p className="text-[10px] font-bold uppercase">
                    {mediaUrl ? "Media Attached" : "No Media"}
                  </p>
                  {mediaUrl && (
                    <span className="text-[9px] text-emerald-700 block mt-1">
                      Ready ✓
                    </span>
                  )}
                </div>
              </div> */}

              {/* 4. ATTACHMENTS SECTION */}
<div 
  onClick={() => document.getElementById('doc-upload')?.click()}
  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/50 ${docUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2] hover:border-[#1f6b4a]"}`}
>
  <input 
    id="doc-upload" 
    type="file" 
    className="hidden" 
    accept=".pdf,.doc,.docx" 
    onChange={(e) => handleFileUpload(e, 'doc')}
  />
  {isUploadingDoc ? (
    <Loader2 className="mx-auto mb-2 animate-spin text-[#1f6b4a]" />
  ) : (
    <FileText className={`mx-auto mb-2 ${docUrl ? "text-emerald-600" : "text-gray-400"}`} />
  )}
  <p className="text-[10px] font-black uppercase tracking-widest">
    {docUrl ? "Document Linked ✓" : "Click to Upload Document"}
  </p>
  {docUrl && <span className="text-[9px] text-emerald-600 truncate block mt-1">File uploaded to storage</span>}
</div>

{/* MEDIA UPLOAD */}
<div 
  onClick={() => document.getElementById('media-upload')?.click()}
  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/50 ${mediaUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2] hover:border-[#1f6b4a]"}`}
>
  <input 
    id="media-upload" 
    type="file" 
    className="hidden" 
    accept="video/*,image/*" 
    onChange={(e) => handleFileUpload(e, 'media')}
  />
  {isUploadingMedia ? (
    <Loader2 className="mx-auto mb-2 animate-spin text-[#1f6b4a]" />
  ) : (
    <Video className={`mx-auto mb-2 ${mediaUrl ? "text-emerald-600" : "text-gray-400"}`} />
  )}
  <p className="text-[10px] font-black uppercase tracking-widest">
    {mediaUrl ? "Media Linked ✓" : "Click to Upload Media (Video/Img)"}
  </p>
</div>



              <div className="flex gap-3">
        <Button variant="outline" onClick={handleCloseModal} className="flex-1 py-6 rounded-xl font-bold">
          Cancel
        </Button>
        <Button onClick={finalizeKWS} className="flex-[2] bg-[#123d2b] hover:bg-[#1f6b4a] text-white py-6 rounded-xl font-bold">
          Save Final Record
        </Button>
      </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* MEDIA VIEWER */}
              <Dialog open={!!viewingMedia} onOpenChange={() => setViewingMedia(null)}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Media Viewer</DialogTitle>
                  </DialogHeader>
                  {viewingMedia && (
                    <div className="w-full">
                      {viewingMedia.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                        <video
                          src={viewingMedia}
                          controls
                          className="w-full rounded-lg"
                          autoPlay
                        />
                      ) : (
                        <img
                          src={viewingMedia}
                          className="w-full rounded-lg"
                          alt="Preview"
                        />
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
        
              {/* DELETE CONFIRMATION */}
              <Dialog
                open={!!docToDelete}
                onOpenChange={(open) => !open && setDocToDelete(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" /> Confirm Deletion
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm">
                      Type <span className="font-bold text-red-600">DELETE</span> to
                      confirm.
                    </p>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setDocToDelete(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={confirmDelete}
                        disabled={deleteConfirmText !== "DELETE"}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
      </div>
    </div>
  );
}
