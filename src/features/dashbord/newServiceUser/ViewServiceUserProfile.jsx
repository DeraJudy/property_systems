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
//   ExternalLink,
//   Loader2,
//   Calendar,
//   Mail,
//   Phone,
//   Plus,
//   Trash2,
//   Video,
//   CheckCircle,
//   Download,
//   Clock,
//   Fingerprint,
//   MapPin,
//   UserCircle,
//   Hash,
//   Copy,
//   Edit3,
//   ClipboardList,
//   Play, ShieldAlert,
//   Image as ImageIcon,
// } from "lucide-react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { motion } from "framer-motion";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Link from "next/link";

// const supabase = createClient();

// // --- Helper Components ---
// const DataRow = ({ label, value }) => (
//   <div className="py-3 border-b border-[#e1dbd2]/50 flex justify-between items-center">
//     <span className="text-sm font-semibold text-[#6b7d74] uppercase tracking-wider">
//       {label}
//     </span>
//     <span className="text-[#123d2b] font-medium">{value || "N/A"}</span>
//   </div>
// );

// const DocCard = ({ title, path }) => {
//   if (!path) return null;
//   const { data } = supabase.storage
//     .from("service-user-docs")
//     .getPublicUrl(path);
//   return (
//     <div className="flex items-center justify-between p-4 bg-white border border-[#e1dbd2] rounded-xl shadow-sm hover:shadow-md transition-all">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-[#e6f2ec] rounded-lg text-[#1f6b4a]">
//           <FileText size={20} />
//         </div>
//         <span className="font-bold text-[#123d2b]">{title}</span>
//       </div>
//       <a
//         href={data.publicUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-lg"
//       >
//         <ExternalLink size={18} />
//       </a>
//     </div>
//   );
// };

// export default function ViewServiceUserProfile() {
//   const router = useRouter();
//   const { id } = useParams();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const supabase = createClient();
//   const [user, setUser] = useState(null);

//   // Tab Content States
//   const [logs, setLogs] = useState([]);
//   const [loadingLogs, setLoadingLogs] = useState(false);
//   const [kwsDocs, setKwsDocs] = useState([]);

//   // Upload States (KWS)
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [kwsName, setKwsName] = useState("");
//   //   const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 16));
//   const [docUrl, setDocUrl] = useState(null);
//   const [mediaUrl, setMediaUrl] = useState(null);
//   const [isUploadingDoc, setIsUploadingDoc] = useState(false);
//   const [isUploadingMedia, setIsUploadingMedia] = useState(false);

//   const [editingId, setEditingId] = useState(null); // Track if we are editing
//   const [viewingMedia, setViewingMedia] = useState(null); // For the video player
//   const [docToDelete, setDocToDelete] = useState(null); // For secure deletion
//   const [deleteConfirmText, setDeleteConfirmText] = useState("");

//   const [selectedDocFile, setSelectedDocFile] = useState(null);
// const [selectedMediaFile, setSelectedMediaFile] = useState(null);

//   const [existingKWSList, setExistingKWSList] = useState([]);
//   const [selectedKWSId, setSelectedKWSId] = useState("");

//   // Replace your existing sessionDate state with this:
//   const [sessionDate, setSessionDate] = useState(() => {
//     const now = new Date();
//     // Adjusts to local time and formats for the input requirement
//     return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
//       .toISOString()
//       .slice(0, 16);
//   });

//   const fetchAllData = async () => {
//     if (!id) return;
//     try {
//       setLoading(true);

//       // 1. Fetch User Data
//       const { data: user, error: userError } = await supabase
//         .from("service_users_table")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (userError) throw userError;

//       // 2. Fetch Support Logs (This was missing, causing the ReferenceError)
//       const { data: supportLogs, error: logsError } = await supabase
//         .from("support_logs")
//         .select("*")
//         .eq("service_user_id", id)
//         .order("session_date", { ascending: false });

//       if (logsError) console.error("Logs Error:", logsError.message);

//     // const { data: kwsData, error: kwsError } = await supabase
//     //   .from('kws_documents')
//     //   .select('id, kws_name, doc_url, media_url');

//     // if (kwsError) console.error("Dropdown Fetch Error:", kwsError.message);
//     // setExistingKWSList(kwsData || []);

//     // // 2. Fetch for Table (Records to show in UI)
//     // const { data: finalizedData, error: finalizedError } = await supabase
//     //   .from('kws_finalized_records')
//     //   .select('*')
//     //   .eq('service_user_id', id)
//     //   .order('session_date', { ascending: false });

//     // if (finalizedError) console.error("Table Fetch Error:", finalizedError.message);
//     // setKwsDocs(finalizedData || []);

//     const { data: dropdownData, error: dropdownError } = await supabase
//   .from('kws_documents')
//   .select('id, kws_name, doc_url, media_url');

// if (dropdownError) console.error("Dropdown Error:", dropdownError.message);

// // 2. Fetch for Table
// const { data: tableData, error: tableError } = await supabase
//   .from('kws_finalized_records')
//   .select('id, kws_name, doc_url, media_url, session_date')
//   .eq('service_user_id', id);

// if (tableError) console.error("Table Error:", tableError.message);

//       // Update States
//     //   setUserData(user); // Now 'user' is defined
//     //   setLogs(supportLogs || []); // Now 'supportLogs' is defined
//     //   setExistingKWSList(kws || []);
//     //   setKwsDocs(kws || []);

//     setUserData(user);
// setLogs(supportLogs || []);
// setExistingKWSList(dropdownData || []); // Use dropdownData instead of kws
// setKwsDocs(tableData || []);

//     } catch (err) {
//       console.error("Fetch Error:", err);
//       toast.error("Error loading profile data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, [id]);

//   const handleKWSSelect = (e) => {
//     const kwsId = e.target.value;
//     setSelectedKWSId(kwsId);

//     if (kwsId === "new") {
//       setKwsName("");
//       setDocUrl(null);
//       setMediaUrl(null);
//       return;
//     }

//     // Find the selected session in our list
//     const selected = existingKWSList.find((k) => k.id.toString() === kwsId);
//     if (selected) {
//       setKwsName(selected.kws_name);
//       setDocUrl(selected.doc_url);
//       setMediaUrl(selected.media_url);
//       // You can also sync the date if preferred:
//       // setSessionDate(new Date(selected.session_date).toISOString().slice(0, 16));
//     }
//   };

//   // 4. The updated Finalize function (Saving to a NEW table as requested)
//   const finalizeKWS = async () => {
//     if (!kwsName) return toast.error("Please provide a session title");

//     try {
//       const { error } = await supabase
//         .from("kws_finalized_records") // Ensure this table exists in Supabase
//         .insert([
//           {
//             service_user_id: id,
//             kws_name: kwsName,
//             session_date: sessionDate,
//             doc_url: docUrl,
//             media_url: mediaUrl,
//             is_manual_entry: selectedKWSId === "new",
//           },
//         ]);

//       if (error) throw error;

//       toast.success("Session finalized and saved");
//       setIsUploadModalOpen(false);
//       // Optional: Reset local states
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save final record");
//     }
//   };

//   // Helper to reset modal state correctly

//   const handleFileUpload = async (e, type) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const isDoc = type === 'doc';
//   const setter = isDoc ? setDocUrl : setMediaUrl;
//   const loadingSetter = isDoc ? setIsUploadingDoc : setIsUploadingMedia;

//   try {
//     loadingSetter(true);
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Math.random()}.${fileExt}`;
//     const filePath = `${id}/${fileName}`;

//     const { error: uploadError } = await supabase.storage
//       .from("kws-attachments")
//       .upload(filePath, file);

//     if (uploadError) throw uploadError;

//     const { data } = supabase.storage.from("kws-attachments").getPublicUrl(filePath);
//     setter(data.publicUrl);
//     toast.success(`${isDoc ? 'Document' : 'Media'} uploaded`);
//   } catch (error) {
//     toast.error("Upload failed");
//     console.error(error);
//   } finally {
//     loadingSetter(false);
//   }
// };

//     const confirmDelete = async () => {
//   if (deleteConfirmText !== "DELETE") {
//     toast.error("Please type DELETE to confirm");
//     return;
//   }

//   try {
//     // 1. Storage Cleanup (Only if it's a manual entry)
//     if (docToDelete.is_manual_entry === true) {
//       const filesToDelete = [];

//       // Helper to extract the filename from the Supabase public URL
//       const getFileName = (url) => {
//         if (!url) return null;
//         const parts = url.split("/");
//         return parts[parts.length - 1];
//       };

//       const docFile = getFileName(docToDelete.doc_url);
//       const mediaFile = getFileName(docToDelete.media_url);

//       if (docFile) filesToDelete.push(docFile);
//       if (mediaFile) filesToDelete.push(mediaFile);

//       if (filesToDelete.length > 0) {
//         const { error: storageError } = await supabase.storage
//           .from("kws-attachments") // Your specific bucket ID
//           .remove(filesToDelete);

//         if (storageError) {
//           console.error("Storage deletion error:", storageError.message);
//           // We continue to DB deletion even if storage fails,
//           // or you can throw error here if storage must be deleted first.
//         }
//       }
//     }

//     // 2. Database Deletion (Always happens)
//     const { error: dbError } = await supabase
//       .from("kws_finalized_records") // Your specific table name
//       .delete()
//       .eq("id", docToDelete.id);

//     if (dbError) throw dbError;

//     toast.success("Record deleted successfully");

//     // 3. Reset state and refresh UI
//     setDocToDelete(null);
//     setDeleteConfirmText(""); // Clear the input field
//     fetchAllData(); // Refresh the table list

//   } catch (error) {
//     console.error("Delete error:", error);
//     toast.error("Deletion failed");
//   }
// };

//     const handleCloseModal = async () => {
//   try {
//     const filesToRemove = [];
//     const getFileName = (url) => {
//       if (!url || typeof url !== 'string') return null;
//       const parts = url.split("/");
//       return parts[parts.length - 1];
//     };

//     // Clean up storage if the user uploaded files but closed without saving a NEW entry
//     if (selectedKWSId === "new" && !editingId) {
//       const docFile = getFileName(docUrl);
//       const mediaFile = getFileName(mediaUrl);

//       if (docFile) filesToRemove.push(docFile);
//       if (mediaFile) filesToRemove.push(mediaFile);

//       if (filesToRemove.length > 0) {
//         await supabase.storage
//           .from("kws-attachments")
//           .remove(filesToRemove);
//       }
//     }
//   } catch (err) {
//     console.error("Cleanup error during close:", err);
//   } finally {
//     setIsUploadModalOpen(false);
//     setKwsName("");
//     setDocUrl(null);
//     setMediaUrl(null);
//     setSelectedKWSId("new");
//     setEditingId(null);
//     setDeleteConfirmText("");

//     const now = new Date();
//     setSessionDate(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
//   }
// };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Loader2 className="animate-spin text-[#1f6b4a]" size={40} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen py-12 px-4">
//       <Button
//         variant="ghost"
//         onClick={() => router.back()}
//         className="text-[#123d2b] hover:bg-[#e1dbd2]"
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//       </Button>

//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Header Section */}
//         <div className="flex justify-between items-center bg-[#123d2b] text-white p-8 rounded-3xl shadow-xl">
//           <div className="flex items-center gap-6">
//             <div className="w-20 h-20 bg-[#1f6b4a] rounded-2xl flex items-center justify-center text-3xl font-bold uppercase">
//               {userData.first_name[0]}
//               {userData.surname[0]}
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold">
//                 {userData.title} {userData.first_name} {userData.surname}
//               </h1>
//               <p className="text-emerald-100/70">
//                 NI: {userData.ni_number || "N/A"}
//               </p>
//             </div>
//           </div>
//           <Link
//             href={`/service-users/${id}/edit`}
//             className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl transition-all"
//           >
//             Edit Profile
//           </Link>
//         </div>

//         <Tabs defaultValue="overview" className="space-y-6">
//           <TabsList className="bg-[#e8e1d6] p-1 border border-[#e1dbd2] gap-1">
//             <TabsTrigger
//               value="overview"
//               className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
//             >
//               Overview
//             </TabsTrigger>
//             <TabsTrigger
//               value="logs"
//               className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
//             >
//               Support Logs
//             </TabsTrigger>
//             <TabsTrigger
//               value="documents"
//               className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
//             >
//               Documents
//             </TabsTrigger>
//             <TabsTrigger
//               value="kws"
//               className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6"
//             >
//               Key Working Session
//             </TabsTrigger>
//           </TabsList>

//           {/* OVERVIEW TAB */}
//           <TabsContent
//             value="overview"
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//           >
//             <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#123d2b] uppercase tracking-tighter">
//                 <User size={20} /> Personal Details
//               </h2>
//               <DataRow
//                 label="Full Name"
//                 value={`${userData.first_name} ${userData.surname}`}
//               />
//               <DataRow label="DOB" value={userData.dob} />
//               <DataRow label="Age" value={userData.age} />
//               <DataRow label="Gender" value={userData.gender} />
//             </div>
//             <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#123d2b] uppercase tracking-tighter">
//                 <Home size={20} /> Placement
//               </h2>
//               <DataRow label="Property" value={userData.property_name} />
//               <DataRow label="Room" value={userData.assigned_room} />
//               <DataRow label="Assigned To" value={userData.assigned_to} />
//             </div>
//           </TabsContent>

//           {/* SUPPORT LOGS TAB */}
//           {/* <TabsContent value="logs">
//             <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-[#123d2b]">Support History</h2>
//                 <div className="flex gap-3">
//           <Link href={`/service-users/${id}/add`}>
//             <Button
//               variant="outline"
//               className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#1f6b4a] hover:text-white"
//             >
//               <Plus className="mr-2 h-4 w-4" /> Add Support Log
//             </Button>
//           </Link>

//         </div>
//               </div>
//               {logs.length === 0 ? <p className="text-center py-10 text-gray-500 italic">No support logs recorded yet.</p> : (
//                 <div className="space-y-4">
//                   {logs.map(log => (
//                     <div key={log.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
//                       <div>
//                         <p className="font-bold text-[#123d2b]">{new Date(log.session_date).toLocaleDateString()}</p>
//                         <p className="text-sm text-gray-600 truncate max-w-md">{log.summary || "View details..."}</p>
//                       </div>
//                       <button className="text-[#1f6b4a] font-bold text-sm">View Log</button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </TabsContent> */}

//           {/* TAB: SUPPORT LOGS (The table from the second code context) */}
//           <TabsContent value="logs">
//             <Card className="border-[#e1dbd2]">
//               <CardHeader className="border-b border-[#e1dbd2]/50 flex flex-row items-center justify-between">
//                 <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
//                   <ClipboardList className="w-4 h-4" /> Session History
//                   <div className="flex gap-3">
//                     <Link href={`/service-users/${id}/add`}>
//                       <Button
//                         variant="outline"
//                         className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#1f6b4a] hover:text-white"
//                       >
//                         <Plus className="mr-2 h-4 w-4" /> Add Support Log
//                       </Button>
//                     </Link>
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 {loadingLogs ? (
//                   <div className="flex justify-center p-8">
//                     <Loader2 className="animate-spin text-[#1f6b4a]" />
//                   </div>
//                 ) : logs.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left text-sm border-collapse">
//                       <thead>
//                         <tr className="border-b border-[#e1dbd2] text-[#123d2b]/60 uppercase text-[10px] font-black tracking-widest">
//                           <th className="pb-3 px-2">Date & Time</th>
//                           <th className="pb-3 px-2">Staff</th>
//                           <th className="pb-3 px-2">Type</th>
//                           <th className="pb-3 px-2">Duration</th>
//                           <th className="pb-3 px-2">Notes</th>
//                           <th className="pb-3 px-2">Attachment</th>
//                           <th className="pb-3 px-2 text-right">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-[#e1dbd2]/30">
//                         {logs.map((log) => (
//                           <tr
//                             key={log.id}
//                             className="hover:bg-[#f1ede4]/20 transition-colors group"
//                           >
//                             {/* ... previous tds (Date, Staff, Type, Duration, Notes) ... */}
//                             <td className="py-4 px-2 whitespace-nowrap">
//                               <div className="font-bold text-[#123d2b]">
//                                 {log.session_date}
//                               </div>
//                               <div className="text-[10px] text-muted-foreground flex items-center gap-1">
//                                 <Clock className="w-3 h-3" />{" "}
//                                 {log.session_time || "--:--"}
//                               </div>
//                             </td>
//                             <td className="py-4 px-2 text-[#123d2b] font-medium">
//                               {log.staff_name}
//                             </td>
//                             <td className="py-4 px-2">
//                               <Badge
//                                 variant="outline"
//                                 className="text-[10px] uppercase border-[#123d2b]/20 text-[#123d2b]"
//                               >
//                                 {log.session_type}
//                               </Badge>
//                             </td>
//                             <td className="py-4 px-2 font-mono text-xs text-[#123d2b]">
//                               {log.duration}
//                             </td>
//                             <td
//                               className="py-4 px-2 text-xs text-muted-foreground max-w-40 truncate"
//                               title={log.notes}
//                             >
//                               {log.notes}
//                             </td>

//                             {/* NEW ATTACHMENT COLUMN */}
//                             <td className="py-4 px-2">
//                               {log.attachment_url ? (
//                                 <a
//                                   href={log.attachment_url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   download
//                                   className="flex items-center gap-1 text-[10px] font-bold text-[#1f6b4a] hover:underline"
//                                 >
//                                   <FileText className="w-3 h-3" />
//                                   VIEW
//                                 </a>

//                               ) : (
//                                 <span className="text-[10px] text-muted-foreground italic">
//                                   None
//                                 </span>
//                               )}
//                             </td>

//                             <td className="py-4 px-2 text-right">
//                               <div className="flex justify-end gap-2">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 w-8 p-0 text-muted-foreground hover:text-[#123d2b] hover:bg-[#123d2b]/10"
//                                   onClick={() => {
//                                     navigator.clipboard.writeText(log.notes);
//                                     toast.success("Notes copied");
//                                   }}
//                                 >
//                                   <Copy className="h-4 w-4" />
//                                 </Button>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 w-8 p-0 text-muted-foreground hover:text-[#1f6b4a] hover:bg-[#1f6b4a]/10"
//                                   onClick={() =>
//                                     router.push(`/support-logs/edit/${log.id}`)
//                                   }
//                                 >
//                                   <Edit3 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-12 text-muted-foreground italic text-sm">
//                     No support logs found for this resident.
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* DOCUMENTS TAB */}
//           <TabsContent value="documents">
//             <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-2xl font-bold mb-8 text-[#123d2b]">
//                 Official Files
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DocCard title="ID Verification" path={userData.id_v_path} />
//                 <DocCard
//                   title="Medical Document"
//                   path={userData.medical_doc_path}
//                 />
//                 <DocCard
//                   title="Benefit Letter"
//                   path={userData.benefit_letter_path}
//                 />
//                 <DocCard
//                   title="Risk Assessment"
//                   path={userData.risk_assessment_path}
//                 />
//                 {userData.additional_docs?.map((doc, i) => (
//                   <DocCard key={i} title={doc.name} path={doc.path} />
//                 ))}
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="kws">
//             <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
//               <div className="flex justify-between items-center mb-8">
//                 <div>
//                   <h2 className="text-2xl font-bold text-[#123d2b]">
//                     Key Working Sessions
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Audit trail of session evidence and documents
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsUploadModalOpen(true)}
//                   className="bg-[#1f6b4a] text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"
//                 >
//                   <Plus size={20} /> New Session Record
//                 </button>
//               </div>

//               <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
//                 <table className="w-full text-left">
//                   <thead className="bg-slate-50 border-b">
//                     <tr>
//                       <th className="p-4 text-[10px] uppercase font-black text-slate-400">
//                         Date & Time
//                       </th>
//                       <th className="p-4 text-[10px] font-black uppercase text-slate-500">
//                         Title
//                       </th>
//                       <th className="p-4 text-[10px] font-black uppercase text-slate-500">
//                         Attachment
//                       </th>
//                       <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">
//                         Video
//                       </th>
//                       <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {kwsDocs.map((doc) => (
//                       <tr
//                         key={doc.id}
//                         className="hover:bg-slate-50/30 transition-colors"
//                       >
//                         <td className="p-4 text-sm font-bold text-slate-600">
//                           {new Date(doc.session_date).toLocaleDateString(
//                             "en-GB",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )}
//                         </td>
//                         <td className="p-4 text-sm font-bold text-[#123d2b]">
//                           {doc.kws_name}
//                         </td>
//                         <td className="p-4">
//                           {doc.doc_url && (
//                             <Button
//                               variant="ghost"
//                               className="h-8 text-[10px] font-black gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-3"
//                               onClick={() => openDocument(doc.doc_url)}
//                             >
//                               <FileText className="w-3 h-3" /> VIEW DOC
//                             </Button>
//                           )}
//                         </td>
//                         <td className="p-4">
//                           {doc.media_url && (
//                             <div
//                               className="relative h-14 w-24 bg-slate-900 rounded overflow-hidden cursor-pointer shadow-sm ring-1 ring-slate-200"
//                               onClick={() => setViewingMedia(doc.media_url)}
//                             >
//                               {doc.media_url.match(/\.(mp4|webm|mov|ogg)/i) ? (
//                                 <div className="relative h-full w-full">
//                                   <video
//                                     src={`${doc.media_url}#t=0.1`}
//                                     className="object-cover w-full h-full opacity-60"
//                                   />
//                                   <Play className="absolute inset-0 m-auto text-white w-4 h-4" />
//                                 </div>
//                               ) : (
//                                 <img
//                                   src={doc.media_url}
//                                   className="object-cover w-full h-full"
//                                   alt="thumbnail"
//                                 />
//                               )}
//                             </div>
//                           )}
//                         </td>
//                         <td className="p-4 text-right flex justify-end gap-2">
//                           <button
//                             onClick={() => {
//                               setEditingId(doc.id);
//                               setKwsName(doc.kws_name);
//                               setDocUrl(doc.doc_url);
//                               setMediaUrl(doc.media_url);
//                               setIsUploadModalOpen(true);
//                             }}
//                             className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
//                           >
//                             <Edit3 size={16} />
//                           </button>
//                           <button
//                             onClick={() => setDocToDelete(doc)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>

//         {/* KWS UPLOAD MODAL */}
//         <Dialog
//   open={isUploadModalOpen}
//   onOpenChange={(open) => {
//     // Prevent closing by clicking outside or hitting ESC unless we run cleanup
//     if (!open) handleCloseModal();
//   }}
// >
//         <DialogContent className="sm:max-w-lg bg-[#fbf8f2] border-none shadow-2xl">
//             <DialogHeader>
//               <DialogTitle className="text-2xl font-bold text-[#123d2b] flex items-center gap-2">
//                 <ClipboardList className="text-[#1f6b4a]" /> Finalize Session Record
//               </DialogTitle>
//             </DialogHeader>

//             <div className="space-y-6 py-4">
//               {/* 1. SELECT EXISTING KWS */}
//               <div>
//         <label className="text-[10px] font-black uppercase text-[#6b7d74] mb-2 block">
//           Link to Existing Session (Optional)
//         </label>
//         <select
//           value={selectedKWSId}
//           onChange={handleKWSSelect}
//           className="w-full p-3 rounded-xl border border-[#e1dbd2] bg-white text-sm outline-none"
//         >
//           <option value="new">-- Create New Entry / Manual --</option>
//           {existingKWSList.map((k) => (
//             <option key={k.id} value={k.id}>{k.kws_name}</option>
//           ))}
//         </select>
//       </div>

//               <Separator className="bg-[#e1dbd2]" />

//               {/* 2. TITLE */}
//               <div>
//                 <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-[#6b7d74]">
//                   Session Title
//                 </label>
//                 <Input
//                   value={kwsName}
//                   onChange={(e) => setKwsName(e.target.value)}
//                   placeholder="e.g. Monthly Progress Review"
//                   className="rounded-xl border-[#e1dbd2]"
//                 />
//               </div>

//               {/* 3. DATE/TIME (Leave as is) */}
//               <div>
//                 <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-[#6b7d74]">
//                   Date & Time of Record
//                 </label>
//                 <Input
//                   type="datetime-local"
//                   value={sessionDate}
//                   onChange={(e) => setSessionDate(e.target.value)}
//                   className="rounded-xl border-[#e1dbd2]"
//                 />
//               </div>

//               {/* 4. AUTO-FETCHED ATTACHMENTS */}
//               {/* <div className="grid grid-cols-2 gap-4">
//                 <div
//                   className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${docUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2]"}`}
//                 >
//                   <FileText
//                     className={`mx-auto mb-2 ${docUrl ? "text-emerald-600" : "text-gray-300"}`}
//                   />
//                   <p className="text-[10px] font-bold uppercase">
//                     {docUrl ? "Document Attached" : "No Document"}
//                   </p>
//                   {docUrl && (
//                     <span className="text-[9px] text-emerald-700 block mt-1">
//                       Ready ✓
//                     </span>
//                   )}
//                 </div>

//                 <div
//                   className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${mediaUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2]"}`}
//                 >
//                   <Video
//                     className={`mx-auto mb-2 ${mediaUrl ? "text-emerald-600" : "text-gray-300"}`}
//                   />
//                   <p className="text-[10px] font-bold uppercase">
//                     {mediaUrl ? "Media Attached" : "No Media"}
//                   </p>
//                   {mediaUrl && (
//                     <span className="text-[9px] text-emerald-700 block mt-1">
//                       Ready ✓
//                     </span>
//                   )}
//                 </div>
//               </div> */}

//               {/* 4. ATTACHMENTS SECTION */}
// <div
//   onClick={() => document.getElementById('doc-upload')?.click()}
//   className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/50 ${docUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2] hover:border-[#1f6b4a]"}`}
// >
//   <input
//     id="doc-upload"
//     type="file"
//     className="hidden"
//     accept=".pdf,.doc,.docx"
//     onChange={(e) => handleFileUpload(e, 'doc')}
//   />
//   {isUploadingDoc ? (
//     <Loader2 className="mx-auto mb-2 animate-spin text-[#1f6b4a]" />
//   ) : (
//     <FileText className={`mx-auto mb-2 ${docUrl ? "text-emerald-600" : "text-gray-400"}`} />
//   )}
//   <p className="text-[10px] font-black uppercase tracking-widest">
//     {docUrl ? "Document Linked ✓" : "Click to Upload Document"}
//   </p>
//   {docUrl && <span className="text-[9px] text-emerald-600 truncate block mt-1">File uploaded to storage</span>}
// </div>

// {/* MEDIA UPLOAD */}
// <div
//   onClick={() => document.getElementById('media-upload')?.click()}
//   className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/50 ${mediaUrl ? "bg-emerald-50 border-emerald-500" : "border-[#e1dbd2] hover:border-[#1f6b4a]"}`}
// >
//   <input
//     id="media-upload"
//     type="file"
//     className="hidden"
//     accept="video/*,image/*"
//     onChange={(e) => handleFileUpload(e, 'media')}
//   />
//   {isUploadingMedia ? (
//     <Loader2 className="mx-auto mb-2 animate-spin text-[#1f6b4a]" />
//   ) : (
//     <Video className={`mx-auto mb-2 ${mediaUrl ? "text-emerald-600" : "text-gray-400"}`} />
//   )}
//   <p className="text-[10px] font-black uppercase tracking-widest">
//     {mediaUrl ? "Media Linked ✓" : "Click to Upload Media (Video/Img)"}
//   </p>
// </div>

//               <div className="flex gap-3">
//         <Button variant="outline" onClick={handleCloseModal} className="flex-1 py-6 rounded-xl font-bold">
//           Cancel
//         </Button>
//         <Button onClick={finalizeKWS} className="flex-[2] bg-[#123d2b] hover:bg-[#1f6b4a] text-white py-6 rounded-xl font-bold">
//           Save Final Record
//         </Button>
//       </div>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* MEDIA VIEWER */}
//               <Dialog open={!!viewingMedia} onOpenChange={() => setViewingMedia(null)}>
//                 <DialogContent className="max-w-4xl">
//                   <DialogHeader>
//                     <DialogTitle>Media Viewer</DialogTitle>
//                   </DialogHeader>
//                   {viewingMedia && (
//                     <div className="w-full">
//                       {viewingMedia.match(/\.(mp4|webm|mov|ogg)$/i) ? (
//                         <video
//                           src={viewingMedia}
//                           controls
//                           className="w-full rounded-lg"
//                           autoPlay
//                         />
//                       ) : (
//                         <img
//                           src={viewingMedia}
//                           className="w-full rounded-lg"
//                           alt="Preview"
//                         />
//                       )}
//                     </div>
//                   )}
//                 </DialogContent>
//               </Dialog>

//               {/* DELETE CONFIRMATION */}
//               <Dialog
//                 open={!!docToDelete}
//                 onOpenChange={(open) => !open && setDocToDelete(null)}
//               >
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle className="text-red-600 flex items-center gap-2">
//                       <ShieldAlert className="w-5 h-5" /> Confirm Deletion
//                     </DialogTitle>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <p className="text-sm">
//                       Type <span className="font-bold text-red-600">DELETE</span> to
//                       confirm.
//                     </p>
//                     <Input
//                       value={deleteConfirmText}
//                       onChange={(e) => setDeleteConfirmText(e.target.value)}
//                       placeholder="DELETE"
//                     />
//                     <div className="flex gap-3">
//                       <Button
//                         variant="outline"
//                         className="flex-1"
//                         onClick={() => setDocToDelete(null)}
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         className="flex-1"
//                         onClick={confirmDelete}
//                         disabled={deleteConfirmText !== "DELETE"}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
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
  FileText,
  ExternalLink,
  Loader2,
  Calendar,
  Plus,
  Trash2,
  ClipboardList,
  Edit3,
  Upload,
  ShieldAlert,
  Clock,
  Copy,
  Play,
  Video, Fingerprint, ImageIcon 
} from "lucide-react";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const supabase = createClient();

// --- Helper: Data Display Row ---
const DataRow = ({ label, value }) => (
  <div className="py-3 border-b border-black/10 flex justify-between items-center">
    <span className="text-xs font-bold text-black/60 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-black font-semibold">{value || "N/A"}</span>
  </div>
);

const openDocument = (url) => {
  if (!url) return;

  // Get the file extension (e.g., 'docx')
  const extension = url.split(".").pop().toLowerCase();

  // Define files browsers CAN open (PDFs and Images)
  const nativeBrowsers = ["pdf", "jpg", "jpeg", "png", "webp"];

  if (nativeBrowsers.includes(extension)) {
    // Open directly in a new tab
    window.open(url, "_blank");
  } else if (
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)
  ) {
    // Route through Microsoft's Office Online Viewer
    const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
    window.open(viewerUrl, "_blank");
  } else {
    // Fallback for everything else
    window.open(url, "_blank");
  }
};

// --- Helper: Document Link Card ---
const DocCard = ({ title, url }) => {
  if (!url) return null;

  return (
    <div
      className="flex items-center justify-between p-4 bg-white border 
    border-black rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e6f2ec] rounded-lg text-black">
          <FileText size={18} />
        </div>
        <span className="text-sm font-bold text-[#123d2b] truncate max-w-50">
          {title}
        </span>
      </div>
      {/* Change from <a> to <button> to trigger the custom open logic */}
      <button
        onClick={() => openDocument(url)}
        className="p-2 text-black hover:bg-[#e6f2ec] rounded-lg"
      >
        <ExternalLink size={16} />
      </button>
    </div>
  );
};

export default function ViewServiceUserProfile() {
  const router = useRouter();
  const { id } = useParams();

  // Basic Data State
  const [userData, setUserData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [kwsDocs, setKwsDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // KWS Management State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [existingKWSList, setExistingKWSList] = useState([]);
  const [selectedKWSId, setSelectedKWSId] = useState("new");
  const [kwsName, setKwsName] = useState("");
  const [docUrl, setDocUrl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingMedia, setViewingMedia] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [isUploadModalsOpen, setIsUploadModalsOpen] = useState(false);
  const [uploadTargetField, setUploadTargetField] = useState(""); // "eet_documents", etc.
  const [newDocName, setNewDocName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [sessionDate, setSessionDate] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });

  const [logToDelete, setLogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // 1. Main Profile
      const { data: user, error: userError } = await supabase
        .from("service_user_intake")
        .select("*")
        .eq("id", id)
        .single();
      if (userError) throw userError;

      // 2. Support Logs
      const { data: supportLogs } = await supabase
        .from("support_logs")
        .select("*")
        .eq("service_user_id", id)
        .order("session_date", { ascending: false });

      // 3. KWS Dropdown options
      const { data: dropdownData } = await supabase
        .from("kws_documents")
        .select("id, kws_name, doc_url, media_url");

      // 4. KWS Table Records
      const { data: tableData } = await supabase
        .from("kws_finalized_records")
        .select("*")
        .eq("service_user_id", id)
        .order("session_date", { ascending: false });

      setUserData(user);
      setLogs(supportLogs || []);
      setExistingKWSList(dropdownData || []);
      setKwsDocs(tableData || []);
    } catch (err) {
      console.error(err);
      toast.error("Profile not found");
      router.push("/service-users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  // Add this function to handle the database deletion(Support Plan)
  const handleDeleteLog = (log) => {
    setLogToDelete(log);
    setDeleteConfirmText(""); // Reset text when opening modal
  };

  const confirmDeleteLog = async () => {
    // 1. Pattern Check: Double check the text matches "DELETE"
    if (deleteConfirmText !== "DELETE") {
      return toast.error("Please type DELETE to confirm");
    }

    setIsDeleting(true);
    try {
      // 2. Step 1: Delete from Storage first using the exact file_path from DB
      // This matches the ${id}/${fileName} structure from SupportLogNewPage
      if (logToDelete.file_path) {
        const { error: storageError } = await supabase.storage
          .from("support_documents")
          .remove([logToDelete.file_path]);

        if (storageError) {
          console.error("Storage cleanup error:", storageError.message);
          // We continue to ensure the DB record is removed even if the file is missing
        }
      }

      // 3. Step 2: Delete from Database
      const { error: dbError } = await supabase
        .from("support_logs")
        .delete()
        .eq("id", logToDelete.id);

      if (dbError) throw dbError;

      toast.success("Support log and file deleted successfully");
      setLogToDelete(null);
      setDeleteConfirmText("");
      fetchAllData(); // Refresh your table list
    } catch (err) {
      console.error(err);
      toast.error("Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- KWS LOGIC ---
  const handleKWSSelect = (e) => {
    const kwsId = e.target.value;
    setSelectedKWSId(kwsId);
    if (kwsId === "new") {
      setKwsName("");
      setDocUrl(null);
      setMediaUrl(null);
      return;
    }
    const selected = existingKWSList.find((k) => k.id.toString() === kwsId);
    if (selected) {
      setKwsName(selected.kws_name);
      setDocUrl(selected.doc_url);
      setMediaUrl(selected.media_url);
    }
  };

  // const handleFileUpload = async (e, type) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const isDoc = type === 'doc';
  //   const loadingSetter = isDoc ? setIsUploadingDoc : setIsUploadingMedia;
  //   const setter = isDoc ? setDocUrl : setMediaUrl;

  //   try {
  //     loadingSetter(true);

  //     // 1. Generate a unique filename to avoid 409 Conflict
  //     const fileExt = file.name.split('.').pop();
  //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //     const fileName = `${uniqueSuffix}.${fileExt}`;
  //     const filePath = `${id}/${fileName}`;

  //     // 2. Use 'upsert: true' if you want to allow overwriting,
  //     // but unique filenames (above) are safer for audit trails.
  //     const { error: uploadError } = await supabase.storage
  //       .from("kws-attachments")
  //       .upload(filePath, file, {
  //         cacheControl: '3600',
  //         upsert: false // Changed to true only if you want to overwrite same-named files
  //       });

  //     if (uploadError) throw uploadError;

  //     const { data } = supabase.storage
  //       .from("kws-attachments")
  //       .getPublicUrl(filePath);

  //     setter(data.publicUrl);
  //     toast.success(`${isDoc ? 'Document' : 'Media'} uploaded`);
  //   } catch (error) {
  //     console.error("Upload Error:", error);
  //     toast.error("Upload failed: " + (error.message || "Conflict detected"));
  //   } finally {
  //     loadingSetter(false);
  //   }
  // };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isDoc = type === "doc";
    const loadingSetter = isDoc ? setIsUploadingDoc : setIsUploadingMedia;
    const setter = isDoc ? setDocUrl : setMediaUrl;

    try {
      loadingSetter(true);

      // Sanitize the name: replace spaces with underscores and make lowercase
      const folderName = userData.service_user_name
        .replace(/\s+/g, "_")
        .toLowerCase();
      const fileExt = file.name.split(".").pop();
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}.${fileExt}`;

      // NEW PATH: kws-attachments/john_doe/123456789.pdf
      const filePath = `${folderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("kws-attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("kws-attachments")
        .getPublicUrl(filePath);

      setter(data.publicUrl);
      toast.success(`${isDoc ? "Document" : "Media"} uploaded`);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed");
    } finally {
      loadingSetter(false);
    }
  };

  //   const finalizeKWS = async () => {
  //   if (!kwsName) return toast.error("Please provide a session title");

  //   try {
  //     // Helper to extract path from a Supabase Public URL
  //     // This looks for everything after '/kws-attachments/'
  //     const extractPath = (url) => {
  //       if (!url) return null;
  //       const parts = url.split('/kws-attachments/');
  //       return parts.length > 1 ? parts[1] : null;
  //     };

  //     const payload = {
  //       service_user_id: id,
  //       kws_name: kwsName,
  //       session_date: sessionDate,
  //       doc_url: docUrl,
  //       media_url: mediaUrl,
  //       // We add these columns to your table to make deletion easy
  //       doc_storage_path: extractPath(docUrl),
  //       media_storage_path: extractPath(mediaUrl),
  //       is_manual_entry: selectedKWSId === "new",
  //     };

  //     const { error } = await supabase
  //       .from("kws_finalized_records")
  //       .insert([payload]);

  //     if (error) throw error;

  //     toast.success("Session finalized and saved");
  //     handleCloseModal(); // This should reset your states
  //     fetchAllData();
  //   } catch (err) {
  //     console.error("Save Error:", err);
  //     toast.error("Failed to save final record");
  //   }
  // };

  // const finalizeKWS = async () => {
  //   if (!kwsName) return toast.error("Please provide a session title");

  //   try {
  //     const extractPath = (url) => {
  //       if (!url) return null;
  //       const parts = url.split('/kws-attachments/');
  //       return parts.length > 1 ? parts[1] : null;
  //     };

  //     const payload = {
  //       service_user_id: id,
  //       kws_name: kwsName,
  //       session_date: sessionDate,
  //       doc_url: docUrl,
  //       media_url: mediaUrl,
  //       doc_storage_path: extractPath(docUrl),
  //       media_storage_path: extractPath(mediaUrl),
  //       is_manual_entry: selectedKWSId === "new",
  //     };

  //     const { error } = await supabase.from("kws_finalized_records").insert([payload]);
  //     if (error) throw error;

  //     toast.success("Session saved successfully");

  //     // CRITICAL: We DO NOT call handleCloseModal here.
  //     // We close manually to avoid the cleanup logic.
  //     setIsUploadModalOpen(false);
  //     setDocUrl(null); // Clear URLs so they aren't "orphans"
  //     setMediaUrl(null);
  //     setKwsName("");
  //     fetchAllData();
  //   } catch (err) {
  //     toast.error("Failed to save: " + err.message);
  //   }
  // };

  const finalizeKWS = async () => {
    if (!kwsName) return toast.error("Please provide a session title");

    try {
      const extractPath = (url) => {
        if (!url) return null;
        const parts = url.split("/kws-attachments/");
        return parts.length > 1 ? parts[1] : null;
      };

      const payload = {
        service_user_id: id,
        kws_name: kwsName,
        session_date: sessionDate,
        doc_url: docUrl,
        media_url: mediaUrl,
        doc_storage_path: extractPath(docUrl),
        media_storage_path: extractPath(mediaUrl),
        is_manual_entry: selectedKWSId === "new",
      };

      // --- UPDATED LOGIC START ---
      if (editingId) {
        // If editingId exists, update the specific row
        const { error } = await supabase
          .from("kws_finalized_records")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Session updated successfully");
      } else {
        // If no editingId, it's a brand new record
        const { error } = await supabase
          .from("kws_finalized_records")
          .insert([payload]);

        if (error) throw error;
        toast.success("Session saved successfully");
      }
      // --- UPDATED LOGIC END ---

      // Cleanup UI State
      setIsUploadModalOpen(false);
      setEditingId(null); // CRITICAL: Reset the ID so the next "New" entry doesn't update this one
      setDocUrl(null);
      setMediaUrl(null);
      setKwsName("");
      fetchAllData();
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to save: " + err.message);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmText !== "DELETE")
      return toast.error("Type DELETE to confirm");
    if (!docToDelete) return;

    try {
      // 1. Identify files to remove from Storage
      // We use the storage paths saved during finalizeKWS
      const filesToRemove = [];
      if (docToDelete.doc_storage_path)
        filesToRemove.push(docToDelete.doc_storage_path);
      if (docToDelete.media_storage_path)
        filesToRemove.push(docToDelete.media_storage_path);

      // This will successfully find "john_doe/file.pdf" and delete it
      await supabase.storage.from("kws-attachments").remove(filesToRemove);

      // 2. DELETE FROM STORAGE FIRST
      if (filesToRemove.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("kws-attachments")
          .remove(filesToRemove);

        if (storageError) {
          console.error("Storage cleanup failed:", storageError);
          // We continue to DB deletion so the UI stays in sync,
          // but we log the error for the admin.
        }
      }

      // 3. DELETE FROM DATABASE SECOND
      const { error: dbError } = await supabase
        .from("kws_finalized_records")
        .delete()
        .eq("id", docToDelete.id);

      if (dbError) throw dbError;

      toast.success("Record and files permanently removed");

      // Cleanup UI State
      setDocToDelete(null);
      setDeleteConfirmText("");
      fetchAllData();
    } catch (error) {
      console.error("Deletion Error:", error);
      toast.error("Failed to delete record: " + error.message);
    }
  };

  // 1. Update handleCloseModal to include auto-delete logic
  const handleCloseModal = async () => {
    // --- AUTO-DELETE ON CANCEL ---
    // If the user uploaded files but is now closing the modal WITHOUT saving (finalizing),
    // we must delete those files from storage to prevent "orphans".
    const filesToDelete = [];

    const extractPath = (url) => {
      if (!url) return null;
      const parts = url.split("/kws-attachments/");
      return parts.length > 1 ? parts[1] : null;
    };

    if (docUrl) filesToDelete.push(extractPath(docUrl));
    if (mediaUrl) filesToDelete.push(extractPath(mediaUrl));

    if (filesToDelete.length > 0) {
      try {
        await supabase.storage
          .from("kws-attachments")
          .remove(filesToDelete.filter(Boolean));
        console.log("Cleanup: Orphaned files removed from storage.");
      } catch (err) {
        console.error("Cleanup Error:", err);
      }
    }

    // --- RESET STATE ---
    setIsUploadModalOpen(false);
    setKwsName("");
    setDocUrl(null);
    setMediaUrl(null);
    setSelectedKWSId("new");
    setEditingId(null);
  };

  const handleNewDocUpload = async () => {
    if (!newDocName || !selectedFile) {
      return toast.error("Please provide both a name and a file.");
    }

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      // Path format: UUID/field/timestamp_name.ext
      const filePath = `${id}/${uploadTargetField}/${Date.now()}_${newDocName.replace(/\s+/g, "_")}.${fileExt}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("service-user-intake-docs")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("service-user-intake-docs")
        .getPublicUrl(filePath);

      // 3. Update Database (Append to existing array)
      const newEntry = {
        name: newDocName,
        url: urlData.publicUrl,
        file_path: filePath,
        uploaded_at: new Date().toISOString(),
      };

      const updatedArray = [...(userData[uploadTargetField] || []), newEntry];

      const { error: dbError } = await supabase
        .from("service_user_intake")
        .update({ [uploadTargetField]: updatedArray })
        .eq("id", id);

      if (dbError) throw dbError;

      toast.success(`${newDocName} uploaded successfully!`);

      // Refresh local state
      setUserData({ ...userData, [uploadTargetField]: updatedArray });

      // Close and Reset
      setIsUploadModalsOpen(false);
      setNewDocName("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center ">
        <Loader2 className="animate-spin text-blac" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* TOP NAV */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/service-users")}
            className="text-[#123d2b]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
          <Link href={`/service-users/${id}/edit`}>
            <Button variant="outline" className="border-black text-[#123d2b]">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </Link>
        </div>

        {/* HERO HEADER */}
        <div className="bg-[#FFFDD0]  text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            {/* <div className="w-20 h-20 bg-[#1f6b4a] rounded-2xl flex items-center justify-center text-3xl font-bold uppercase">
              {userData.service_user_name?.[0]}
            </div> */}
            <div>
              <h1 className="text-3xl text-black font-bold uppercase">
                {userData.service_user_name}
              </h1>
            </div>
          </div>

          {/* Profile Image Section */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
              {userData?.profile_image_url ? (
                <img
                  src={userData.profile_image_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition-colors cursor-pointer relative">
                  <ImageIcon className="h-8 w-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    No Photo
                  </span>
                  {/* Hidden Input for fancy upload triggering */}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, "profile_image")}
                  />
                </div>
              )}
            </div>
           
          </div>
        </div>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-[#e8e1d6] p-1 border border-[#e1dbd2] overflow-x-auto justify-start h-auto">
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-[#FFFDD0] data-[state=active]:text=black"
            >
              About Me
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-[#FFFDD0] data-[state=active]:text=black"
            >
              Support Logs
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-[#FFFDD0] data-[state=active]:text=black"
            >
              Documents
            </TabsTrigger>
            {/* <TabsTrigger
              value="eet"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              EET
            </TabsTrigger> */}
            <TabsTrigger
              value="onboarding"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Onboarding
            </TabsTrigger>
            <TabsTrigger
              value="kws"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Key Working Session
            </TabsTrigger>
          </TabsList>

          {/* ABOUT TAB */}
          <TabsContent value="about">
            <Card className="border-none shadow-sm bg-[#fdfbf7]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#1f6b4a]" /> Primary
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData?.about_file_url ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-[11px] text-slate-500 font-medium italic">
                      "Primary record for service user intake and background."
                    </p>
                    <Button
                      className="w-full bg-black hover:bg-[#1f6b4a] font-bold text-xs py-5"
                      onClick={() => openDocument(userData.about_file_url)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> VIEW ABOUT
                      DOCUMENT
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center bg-white">
                    <Upload className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 text-center">
                      No About Document Found
                    </p>
                    <label className="w-full">
                      <Input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "about_file")}
                      />
                      <div className="bg-[#1f6b4a] text-white text-[10px] font-black py-3 rounded-lg text-center cursor-pointer hover:bg-[#123d2b] transition-colors">
                        UPLOAD NOW
                      </div>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPPORT LOGS TAB */}

          {/* TAB: SUPPORT LOGS */}
          <TabsContent value="logs">
            <Card className="border-[#e1dbd2]">
              <CardHeader className="border-b border-[#e1dbd2]/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                  <ClipboardList className="w-4 h-4" /> Session History
                </CardTitle>
                <Link href={`/service-users/${id}/add`}>
                  <Button
                    variant="outline"
                    className="border-[#1f6b4a] text-black hover:bg-[#1f6b4a] hover:text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Support Log
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-6">
                {logs.length > 0 ? (
                  <div className="overflow-hidden border border-[#e1dbd2] rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#fcfcfc] border-b border-[#e1dbd2] text-[#123d2b]/60 uppercase text-[10px] font-black tracking-widest">
                          {/* <th className="py-4 px-4">Date & Time</th> */}
                          <th className="py-4 px-4">Staff</th>
                          <th className="py-4 px-4">Type</th>
                          <th className="py-4 px-4">Duration</th>
                          <th className="py-4 px-4">Notes</th>
                          <th className="py-4 px-4">Attachment</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f7f2e9]">
                        {logs.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-[#f1f8f5]/50 transition-colors group cursor-pointer"
                            onClick={() => setSelectedLog(log)} // Trigger Popup on Row Click
                          >
                            {/* <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-bold text-[#123d2b]">
                                {new Date(
                                  log.session_date,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />{" "}
                                {log.session_time || "--:--"}
                              </div>
                            </td> */}
                            <td className="py-4 px-4 text-[#123d2b] font-bold">
                              {log.support_worker_name}
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase border-[#123d2b]/20 text-[#123d2b]"
                              >
                                {log.session_type}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 font-mono text-xs text-[#123d2b]">
                              {log.duration}
                            </td>
                            <td
                              className="py-4 px-4 text-xs text-muted-foreground max-w-40 truncate"
                              title={log.notes}
                            >
                              {log.notes}
                            </td>
                            <td className="py-4 px-4">
                              {log.file_url ? (
                                <div className="flex items-center gap-1 text-[10px] font-black text-[#1f6b4a] uppercase bg-[#f1f8f5] px-2 py-1 rounded w-fit">
                                  <FileText className="w-3 h-3" /> Linked
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">
                                  None
                                </span>
                              )}
                            </td>
                            <td
                              className="py-4 px-4 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex justify-end gap-1">
                                {/* <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-500"
                                  onClick={() =>
                                    router.push(`/support-logs/${log.id}/edit`)
                                  }
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button> */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                                  onClick={() => handleDeleteLog(log)}
                                >
                                  <Trash2 className="h-4 w-4" />
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
            <Card className="border-[#e1dbd2]">
              <CardHeader>
                {/* Example for EET Section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#123d2b] flex items-center gap-2">
                    <FileText size={20} /> Additional Documents
                  </h3>
                  <Button
                    onClick={() => {
                      setUploadTargetField("additional_documents");
                      setIsUploadModalsOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]"
                  >
                    <Plus size={16} className="mr-1" /> Add Document
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.additional_documents?.map((doc, i) => (
                  <DocCard
                    key={i}
                    title={doc.name || `Document ${i + 1}`}
                    url={doc.url}
                  />
                )) || (
                  <p className="col-span-2 text-center py-6 italic text-gray-400">
                    No documents found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EET TAB */}
          <TabsContent value="eet">
            <Card className="border-[#e1dbd2]">
              <CardHeader>
                {/* Example for EET Section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#123d2b] flex items-center gap-2">
                    <FileText size={20} /> EET Documents
                  </h3>
                  <Button
                    onClick={() => {
                      setUploadTargetField("eet_documents");
                      setIsUploadModalsOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]"
                  >
                    <Plus size={16} className="mr-1" /> Add Document
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.eet_documents?.map((doc, i) => (
                  <DocCard
                    key={i}
                    title={doc.name || `EET Doc ${i + 1}`}
                    url={doc.url}
                  />
                )) || (
                  <p className="col-span-2 text-center py-6 italic text-gray-400">
                    No EET documents.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONBOARDING TAB */}
          <TabsContent value="onboarding">
            <Card className="border-[#e1dbd2]">
              <CardHeader>
                {/* Example for EET Section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#123d2b] flex items-center gap-2">
                    <FileText size={20} /> Onboarding Documents
                  </h3>
                  <Button
                    onClick={() => {
                      setUploadTargetField("onboarding_documents");
                      setIsUploadModalsOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]"
                  >
                    <Plus size={16} className="mr-1" /> Add Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.onboarding_documents?.map((doc, i) => (
                  <DocCard
                    key={i}
                    title={doc.name || `Onboarding Doc ${i + 1}`}
                    url={doc.url}
                  />
                )) || (
                  <p className="col-span-2 text-center py-6 italic text-gray-400">
                    No onboarding documents.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* KWS TAB (Integrated logic) */}
          <TabsContent value="kws">
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    Key Working Sessions
                  </h2>
                  <p className="text-sm text-gray-500">
                    Audit trail of session evidence and documents
                  </p>
                </div>
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className=" text-white"
                >
                  <Plus size={20} className="mr-2" /> New Session Record
                </Button>
              </div>

              {/* <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-4 text-[10px] uppercase font-black text-slate-400">Date & Time</th>
                      <th className="p-4 text-[10px] uppercase font-black text-slate-400">Title</th>
                      <th className="p-4 text-[10px] uppercase font-black text-slate-400">Evidence</th>
                      <th className="p-4 text-[10px] uppercase font-black text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kwsDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/30">
                        <td className="p-4 text-sm font-bold text-slate-600">{new Date(doc.session_date).toLocaleDateString("en-GB")}</td>
                        <td className="p-4 text-sm font-bold text-[#123d2b]">{doc.kws_name}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {doc.doc_url && <a href={doc.doc_url} target="_blank" className="p-1.5 bg-blue-50 text-blue-600 rounded"><FileText size={14} /></a>}
                            {doc.media_url && <button onClick={() => setViewingMedia(doc.media_url)} className="p-1.5 bg-purple-50 text-purple-600 rounded"><Video size={14} /></button>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                           <Button variant="ghost" size="sm" onClick={() => {
                             setEditingId(doc.id); setKwsName(doc.kws_name); setDocUrl(doc.doc_url); setMediaUrl(doc.media_url); setIsUploadModalOpen(true);
                           }}><Edit3 size={14}/></Button>
                           <Button variant="ghost" size="sm" onClick={() => setDocToDelete(doc)} className="text-red-500"><Trash2 size={14}/></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
              {/* </div> */}

              <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <div className="overflow-hidden border border-[#e1dbd2] rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#fcfcfc] border-b border-[#e1dbd2]">
                      <tr>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-[#123d2b]/60">
                          Date & Time
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-[#123d2b]/60">
                          Title
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-[#123d2b]/60">
                          Attachment
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-[#123d2b]/60 text-right">
                          Media
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-[#123d2b]/60 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f7f2e9]">
                      {kwsDocs.map((doc) => (
                        <tr
                          key={doc.id}
                          className="hover:bg-[#f1f8f5]/50 transition-colors group"
                        >
                          {/* DATE COLUMN */}
                          <td className="p-4 text-sm font-bold text-gray-600">
                            {new Date(doc.session_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>

                          {/* TITLE COLUMN */}
                          <td className="p-4 text-sm font-bold text-[#123d2b]">
                            {doc.kws_name}
                          </td>

                          {/* DOCUMENT VIEW BUTTON */}
                          <td className="p-4">
                            {doc.doc_url && (
                              <Button
                                variant="ghost"
                                className="h-7 text-[10px] font-black gap-2 bg-[#f1f8f5] text-[#1f6b4a] border border-[#1f6b4a]/10 px-3 hover:bg-[#1f6b4a] hover:text-white transition-all rounded-md"
                                onClick={() => openDocument(doc.doc_url)}
                              >
                                <FileText className="w-3.5 h-3.5" /> VIEW DOC
                              </Button>
                            )}
                          </td>

                          {/* VIDEO/MEDIA THUMBNAIL */}
                          <td className="p-4 text-right">
                            <div className="flex justify-end">
                              {doc.media_url && (
                                <div
                                  className="relative h-12 w-20 bg-black rounded-lg overflow-hidden cursor-pointer shadow-sm ring-1 ring-[#e1dbd2] group-hover:ring-[#1f6b4a] transition-all"
                                  onClick={() => setViewingMedia(doc.media_url)}
                                >
                                  {doc.media_url.match(
                                    /\.(mp4|webm|mov|ogg)/i,
                                  ) ? (
                                    <div className="relative h-full w-full">
                                      <video
                                        src={`${doc.media_url}#t=0.1`}
                                        className="object-cover w-full h-full opacity-70"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="text-white w-4 h-4 fill-white" />
                                      </div>
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
                            </div>
                          </td>

                          {/* ACTION BUTTONS */}
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-full"
                                onClick={() => {
                                  setEditingId(doc.id);
                                  setKwsName(doc.kws_name);
                                  setDocUrl(doc.doc_url);
                                  setMediaUrl(doc.media_url);
                                  setIsUploadModalOpen(true);
                                }}
                              >
                                <Edit3 size={15} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full"
                                onClick={() => setDocToDelete(doc)}
                              >
                                <Trash2 size={15} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* MODALS - EXACTLY AS IN COMMENTED PART */}
        {/* <Dialog open={isUploadModalOpen} onOpenChange={(open) => !open && handleCloseModal()}> */}
        <Dialog
          open={isUploadModalOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseModal(); // This catches the 'X' and clicking outside
          }}
        >
          <DialogContent className="sm:max-w-lg bg-[#fbf8f2]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#123d2b]">
                Finalize Session Record
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                  Link to Existing Session (Optional)
                </label>
                <select
                  value={selectedKWSId}
                  onChange={handleKWSSelect}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="new">-- Manual Entry --</option>
                  {existingKWSList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.kws_name}
                    </option>
                  ))}
                </select>
              </div>
              <Separator />
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                  Session Title
                </label>
                <Input
                  value={kwsName}
                  onChange={(e) => setKwsName(e.target.value)}
                  placeholder="Title"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div
                  onClick={() => document.getElementById("doc-up").click()}
                  className="border-2 border-dashed p-4 text-center cursor-pointer rounded-xl"
                >
                  <input
                    id="doc-up"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, "doc")}
                  />
                  {isUploadingDoc ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <FileText
                      className={`mx-auto ${docUrl ? "text-green-500" : ""}`}
                    />
                  )}
                  <span className="text-[10px] font-bold block mt-1 uppercase">
                    {docUrl ? "Document Linked ✓" : "Click to Upload Doc"}
                  </span>
                </div>
                <div
                  onClick={() => document.getElementById("med-up").click()}
                  className="border-2 border-dashed p-4 text-center cursor-pointer rounded-xl"
                >
                  <input
                    id="med-up"
                    type="file"
                    className="hidden"
                    accept="video/*,image/*"
                    onChange={(e) => handleFileUpload(e, "media")}
                  />
                  {isUploadingMedia ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <Video
                      className={`mx-auto ${mediaUrl ? "text-green-500" : ""}`}
                    />
                  )}
                  <span className="text-[10px] font-bold block mt-1 uppercase">
                    {mediaUrl ? "Media Linked ✓" : "Click to Upload Media"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button className="flex-2 bg-[#123d2b]" onClick={finalizeKWS}>
                  Save Final Record
                </Button>
              </div>
            </div>
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
                <ShieldAlert /> Confirm Deletion
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
              <div className="flex gap-2">
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
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* MEDIA VIEWER */}
        <Dialog
          open={!!viewingMedia}
          onOpenChange={() => setViewingMedia(null)}
        >
          <DialogContent className="max-w-3xl">
            {/* Add these two lines to fix the error */}
            <DialogHeader>
              <DialogTitle className="sr-only">Media Preview</DialogTitle>
              <DialogDescription className="sr-only">
                Viewing uploaded session evidence media.
              </DialogDescription>
            </DialogHeader>

            {viewingMedia && (
              <div className="pt-4">
                {viewingMedia.match(/\.(mp4|webm|mov)$/i) ? (
                  <video
                    src={viewingMedia}
                    controls
                    autoPlay
                    className="w-full"
                  />
                ) : (
                  <img src={viewingMedia} alt="Evidence" className="w-full" />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isUploadModalsOpen} onOpenChange={setIsUploadModalsOpen}>
          <DialogContent className="fixed left-[50%] top-[50%] z-[100] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border-[#e1dbd2] bg-[#fdfbf7] p-6 shadow-2xl duration-200">
            <DialogHeader>
              <DialogTitle className="text-[#123d2b]">
                Upload New Document
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#123d2b]">
                  Document Name
                </label>
                <Input
                  placeholder="e.g. Health Certificate"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#123d2b]">
                  Select File
                </label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="cursor-pointer"
                />
              </div>
              <Button
                onClick={handleNewDocUpload}
                disabled={isUploading}
                className="w-full bg-[#123d2b] hover:bg-[#1f6b4a]"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Start Upload"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Support */}
        <Dialog open={!!logToDelete} onOpenChange={() => setLogToDelete(null)}>
          <DialogContent className="bg-[#fdfbf7] border-[#e1dbd2]">
            <DialogHeader>
              <DialogTitle className="text-[#123d2b] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" /> Confirm
                Deletion
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                This will permanently delete the support log and its associated
                file. To confirm, please type{" "}
                <span className="font-bold text-red-600">DELETE</span> below:
              </p>
              <Input
                placeholder="Type DELETE to confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="border-[#e1dbd2] focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setLogToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteLog}
                disabled={isDeleting || deleteConfirmText !== "DELETE"}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Delete Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* SUPPORT LOG DETAIL POPUP */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="sm:max-w-[500px] border-[#e1dbd2] rounded-xl">
            <DialogHeader className="border-b border-[#f7f2e9] pb-4">
              <DialogTitle className="text-[#123d2b] flex items-center gap-2">
                <ClipboardList className="h-5 w-5" /> Support Log Details
              </DialogTitle>
            </DialogHeader>

            {selectedLog && (
              <div className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[10px] font-black uppercase text-gray-400">
                      Date & Time
                    </Label>
                    <p className="text-sm font-bold text-[#123d2b]">
                      {new Date(selectedLog.session_date).toLocaleDateString()}{" "}
                      at {selectedLog.session_time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase text-gray-400">
                      Duration
                    </Label>
                    <p className="text-sm font-bold text-[#123d2b]">
                      {selectedLog.duration}
                    </p>
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase text-gray-400">
                      Support Worker
                    </Label>
                    <p className="text-sm font-bold text-[#123d2b]">
                      {selectedLog.support_worker_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase text-gray-400">
                      Session Type
                    </Label>
                    <div>
                      <Badge className="bg-[#1f6b4a] text-white text-[10px] uppercase">
                        {selectedLog.session_type}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fcfcfc] border border-[#e1dbd2] p-4 rounded-lg">
                  <Label className="text-[10px] font-black uppercase text-gray-400 block mb-2">
                    Detailed Notes
                  </Label>
                  <button
                    onClick={() => {
                      if (selectedLog?.notes) {
                        navigator.clipboard.writeText(selectedLog.notes);
                        toast.success("Notes copied to clipboard");
                      }
                    }}
                    className="flex items-center gap-1 text-[10px] font-black text-black hover:text-[#123d2b] transition-colors uppercase"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                  <p className="text-sm text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                    "
                    {selectedLog.notes || "No notes provided for this session."}
                    "
                  </p>
                </div>

                {selectedLog.file_url && (
                  <div className="flex items-center justify-between p-3 border border-[#1f6b4a]/20 bg-[#f1f8f5] rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#1f6b4a]" />
                      <span className="text-xs font-bold text-[#123d2b]">
                        Attached Record
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#1f6b4a] hover:bg-[#123d2b] h-8 text-[10px] font-black"
                      onClick={() => openDocument(selectedLog.file_url)}
                    >
                      VIEW ATTACHMENT
                    </Button>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedLog(null)}
                className="w-full"
              >
                Close Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
