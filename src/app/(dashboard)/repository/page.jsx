// "use client";

// import React, { useState, useEffect } from "react"; // ✅ Added useEffect
// import { useParams, useRouter } from "next/navigation";
// import {
//   Plus,
//   FileText,
//   Play,
//   Edit3,
//   Trash2,
//   Loader2,
//   CheckCircle2,
//   Briefcase,
//   ShieldAlert,
// } from "lucide-react";
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";

// const Page = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const supabase = createClient();

//   // --- STATE MANAGEMENT ---
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [kwsDocs, setKwsDocs] = useState([]);
//   const [kwsName, setKwsName] = useState("");
//   const [docUrl, setDocUrl] = useState(null);
//   const [mediaUrl, setMediaUrl] = useState(null);
//   const [isUploadingDoc, setIsUploadingDoc] = useState(false);
//   const [isUploadingMedia, setIsUploadingMedia] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [viewingMedia, setViewingMedia] = useState(null);
//   const [docToDelete, setDocToDelete] = useState(null);
//   const [deleteConfirmText, setDeleteConfirmText] = useState("");

//   // --- 1. FETCH ON LOAD ---
//   useEffect(() => {
//     fetchKWSDocuments();
//   }, []);

//   // --- HANDLERS ---
//   const closeModal = async () => {
//     // 1. CLEANUP BUCKET: Delete files if they were uploaded but not "Finalized"
//     // We only do this if editingId is null (new entry)
//     // or if the URLs in state are different from the original ones.
//     try {
//       const filesToRemove = [];

//       if (docUrl) {
//         const docPath = docUrl.split("/").pop();
//         filesToRemove.push(`${id}/${docPath}`);
//       }

//       if (mediaUrl) {
//         const mediaPath = mediaUrl.split("/").pop();
//         filesToRemove.push(`${id}/${mediaPath}`);
//       }

//       if (filesToRemove.length > 0 && !editingId) {
//         await supabase.storage.from("kws_documents").remove(filesToRemove);
//       }
//     } catch (error) {
//       console.error("Cleanup error:", error);
//     }

//     // 2. RESET STATES
//     setIsUploadModalOpen(false);
//     setEditingId(null);
//     setKwsName("");
//     setDocUrl(null);
//     setMediaUrl(null);
//     setIsUploadingDoc(false);
//     setIsUploadingMedia(false);
//   };

//   const fetchKWSDocuments = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("kws_documents")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Fetch Error:", error);
//         toast.error(error.message);
//         return [];
//       }

//       // Ensure we map the correct URLs for the table display
//       const cleanedData = (data || []).map((item) => ({
//         ...item,
//         file_url: item.file_url || item.doc_url || item.media_url,
//       }));

//       setKwsDocs(cleanedData); // ✅ Fixed: Now matches state variable
//       return cleanedData;
//     } catch (err) {
//       console.error("Unexpected Error:", err);
//       toast.error("Something went wrong while fetching documents");
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImmediateUpload = async (file, type) => {
//     if (!file) return;

//     if (type === "doc") setIsUploadingDoc(true);
//     else setIsUploadingMedia(true);

//     try {
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
//       const filePath = fileName; // ✅ Removed ID as requested

//       const { data, error: uploadError } = await supabase.storage
//         .from("kws_documents")
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const {
//         data: { publicUrl },
//       } = supabase.storage.from("kws_documents").getPublicUrl(filePath);

//       if (type === "doc") setDocUrl(publicUrl);
//       else setMediaUrl(publicUrl);

//       toast.success("File uploaded successfully");
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Failed to upload file");
//     } finally {
//       setIsUploadingDoc(false);
//       setIsUploadingMedia(false);
//     }
//   };

//   const confirmDelete = async () => {
//     if (deleteConfirmText !== "DELETE") {
//       toast.error("Please type DELETE to confirm");
//       return;
//     }

//     try {
//       const filesToDelete = [];
//       // ✅ Fixed: Extract filename correctly from the end of the URL
//       if (docToDelete.doc_url) {
//         const parts = docToDelete.doc_url.split("/");
//         filesToDelete.push(parts[parts.length - 1]);
//       }
//       if (docToDelete.media_url) {
//         const parts = docToDelete.media_url.split("/");
//         filesToDelete.push(parts[parts.length - 1]);
//       }

//       if (filesToDelete.length > 0) {
//         await supabase.storage.from("kws_documents").remove(filesToDelete);
//       }

//       const { error: dbError } = await supabase
//         .from("kws_documents")
//         .delete()
//         .eq("id", docToDelete.id);
//       if (dbError) throw dbError;

//       toast.success("Deleted successfully");
//       setDocToDelete(null);
//       fetchKWSDocuments();
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Deletion failed");
//     }
//   };

//   const handleEditClick = (doc) => {
//     setEditingId(doc.id);
//     setKwsName(doc.kws_name);
//     setDocUrl(doc.doc_url);
//     setMediaUrl(doc.media_url);
//     setIsUploadModalOpen(true);
//   };

//   const finalizeAuditEntry = async () => {
//     // 1. Validate
//     if (!kwsName.trim()) {
//       toast.error("Enter KWS name");
//       return;
//     }

//     if (!docUrl && !mediaUrl) {
//       toast.error("Upload at least one file");
//       return;
//     }

//     try {
//       // REQUIRED FIELD LOGIC
//       const fileUrl = docUrl || mediaUrl;

//       const payload = {
//         kws_name: kwsName,
//         file_url: fileUrl, // ✅ Required column
//         doc_url: docUrl,
//         media_url: mediaUrl,
//         file_name: kwsName,
//         original_name: kwsName,
//       };

//       let response;

//       if (editingId) {
//         // ✅ Update existing record
//         response = await supabase
//           .from("kws_documents")
//           .update(payload)
//           .eq("id", editingId);
//       } else {
//         // ✅ Insert new record
//         response = await supabase.from("kws_documents").insert(payload);
//       }

//       if (response.error) {
//         console.error("Supabase Error:", response.error);
//         toast.error(response.error.message);
//         return;
//       }

//       toast.success(editingId ? "Changes saved" : "Audit log saved");

//       // Reset state and close modal
//       setEditingId(null);
//       setKwsName("");
//       setDocUrl(null);
//       setMediaUrl(null);
//       setIsUploadModalOpen(false);

//       fetchKWSDocuments();
//     } catch (err) {
//       console.error("Critical Error:", err);
//       toast.error("Something went wrong");
//     }
//   };

//   // --- HELPERS ---
//   const openDocument = (url) => {
//     if (!url) return;
//     const isOffice = url.toLowerCase().match(/\.(doc|docx)$/);
//     if (isOffice) {
//       window.open(
//         `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
//         "_blank",
//       );
//     } else {
//       window.open(url, "_blank");
//     }
//   };

//   return (
//     <div className="p-6">

//         <CardHeader className="flex flex-row items-center justify-between p-6">
//           <CardTitle className="text-lg font-bold text-black">
//             Key Working Sessions
//           </CardTitle>
//           <Button
//             onClick={() => setIsUploadModalOpen(true)}
//             className="bg-black text-[#FFFDD0] hover:bg-[#FFFDD0] hover:text-black gap-2"
//           >
//             <Plus className="w-4 h-4" /> New KWS Entry
//           </Button>
//         </CardHeader>

//         <section className="p-6">
//           {loading ? (
//             <div className="flex justify-center p-12">
//               <Loader2 className="animate-spin h-8 w-8 text-black" />
//             </div>
//           ) : (
// <div className="border border-black/10 rounded-xl bg-[#FFFDD0] overflow-hidden shadow-sm">
//   <table className="w-full text-left border-collapse">
//     <thead className="bg-[#FFFDD0] border-b border-black">
//       <tr>
//         {/* Main column takes more space */}
//         <th className="p-4 w-1/2 text-[10px] font-black uppercase tracking-wider text-black">
//           Session Title
//         </th>
//         {/* Document column */}
//         <th className="p-4 text-[10px] font-black uppercase tracking-wider text-black">
//           Document
//         </th>
//         {/* Media column */}
//         <th className="p-4 text-[10px] font-black uppercase tracking-wider text-black">
//           Preview
//         </th>
//         {/* Actions column - narrow and right-aligned */}
//         <th className="p-4 w-24 text-right">Actions</th>
//       </tr>
//     </thead>
//     <tbody className="divide-y divide-black/5">
//       {kwsDocs.length === 0 ? (
//         <tr>
//           <td colSpan="4" className="p-12 text-center text-black/40 italic text-sm">
//             No records found.
//           </td>
//         </tr>
//       ) : (
//         kwsDocs.map((doc) => (
//           <tr
//             key={doc.id}
//             className="hover:bg-[#F2EDE4] transition-colors group"
//           >
//             <td className="p-4">
//               <span className="font-bold text-sm text-black">
//                 {doc.kws_name}
//               </span>
//             </td>
//             <td className="p-4">
//               {doc.doc_url && (
//                 <Button
//                   variant="ghost"
//                   className="h-8 text-[10px] font-black gap-2 bg-black text-[#FFFDD0] border border-black px-3 hover:bg-[#FFFDD0] hover:text-black transition-all"
//                   onClick={() => openDocument(doc.doc_url)}
//                 >
//                   <FileText className="w-3.5 h-3.5" /> VIEW
//                 </Button>
//               )}
//             </td>
//             <td className="p-4">
//               {doc.media_url && (
//                 <div
//                   className="relative h-10 w-16 bg-black rounded shadow-sm overflow-hidden cursor-pointer ring-1 ring-black/10 hover:ring-black transition-all"
//                   onClick={() => setViewingMedia(doc.media_url)}
//                 >
//                   {doc.media_url.match(/\.(mp4|webm|mov|ogg)/i) ? (
//                     <div className="relative h-full w-full">
//                       <video
//                         src={`${doc.media_url}#t=0.1`}
//                         className="object-cover w-full h-full opacity-60"
//                       />
//                       <Play className="absolute inset-0 m-auto text-[#FFFDD0] w-3 h-3" />
//                     </div>
//                   ) : (
//                     <img
//                       src={doc.media_url}
//                       className="object-cover w-full h-full"
//                       alt="thumbnail"
//                     />
//                   )}
//                 </div>
//               )}
//             </td>
//             <td className="p-4 text-right">
//               <div className="flex gap-1 justify-end transition-opacity">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-black hover:bg-black hover:text-[#FFFDD0]"
//                   onClick={() => handleEditClick(doc)}
//                 >
//                   <Edit3 className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 w-8 text-red-600 hover:bg-red-50"
//                   onClick={() => {
//                     setDocToDelete(doc);
//                     setDeleteConfirmText("");
//                   }}
//                 >
//                   <Trash2 className="w-3.5 h-3.5" />
//                 </Button>
//               </div>
//             </td>
//           </tr>
//         ))
//       )}
//     </tbody>
//   </table>
// </div>
//           )}
//         </section>
//       {/* </Card> */}

//       {/* MODALS (UPLOAD, VIEWER, DELETE) REMAIN THE SAME AS YOUR ORIGINAL CODE */}
//       {/* ... keeping the Dialog sections from your code below ... */}

//       {/* UPLOAD/EDIT MODAL */}
//       <Dialog
//         open={isUploadModalOpen}
//         onOpenChange={(open) => !open && closeModal()}
//       >
//         <DialogContent className="sm:max-w-112.5">
//           <DialogHeader>
//             <DialogTitle className="text-[#123d2b] font-black flex gap-2">
//               <Briefcase className="w-5 h-5" />{" "}
//               {editingId ? "EDIT SESSION" : "NEW SESSION RECORD"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 pt-4">
//             <div className="space-y-1">
//               <label className="text-[10px] font-black uppercase text-slate-400">
//                 Session Name
//               </label>
//               <Input
//                 value={kwsName}
//                 onChange={(e) => setKwsName(e.target.value)}
//                 placeholder="e.g. Tenancy Support"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div
//                 className={`border-2 border-dashed p-4 rounded-xl text-center ${docUrl ? "bg-emerald-50 border-emerald-200" : "bg-slate-50"}`}
//               >
//                 <p className="text-[10px] font-black mb-2 uppercase">
//                   Document
//                 </p>
//                 <input
//                   type="file"
//                   className="hidden"
//                   id="doc-up"
//                   accept=".pdf,.doc,.docx" // ✅ Restricts to PDF and Word documents
//                   onChange={(e) =>
//                     handleImmediateUpload(e.target.files[0], "doc")
//                   }
//                 />
//                 <label
//                   htmlFor="doc-up"
//                   className="cursor-pointer text-xs font-bold text-blue-600 underline"
//                 >
//                   Upload File
//                 </label>
//                 {isUploadingDoc && (
//                   <Loader2 className="animate-spin h-4 w-4 mx-auto mt-2" />
//                 )}
//                 {docUrl && (
//                   <CheckCircle2 className="text-emerald-500 mx-auto mt-2 h-4 w-4" />
//                 )}
//               </div>
//               <div
//                 className={`border-2 border-dashed p-4 rounded-xl text-center ${mediaUrl ? "bg-emerald-50 border-emerald-200" : "bg-slate-50"}`}
//               >
//                 <p className="text-[10px] font-black mb-2 uppercase">Media</p>
//                 <input
//                   type="file"
//                   className="hidden"
//                   id="med-up"
//                   accept="image/*,video/*" // ✅ This limits selection to images and videos
//                   onChange={(e) =>
//                     handleImmediateUpload(e.target.files[0], "media")
//                   }
//                 />
//                 <label
//                   htmlFor="med-up"
//                   className="cursor-pointer text-xs font-bold text-blue-600 underline"
//                 >
//                   Upload Media
//                 </label>
//                 {isUploadingMedia && (
//                   <Loader2 className="animate-spin h-4 w-4 mx-auto mt-2" />
//                 )}
//                 {mediaUrl && (
//                   <CheckCircle2 className="text-emerald-500 mx-auto mt-2 h-4 w-4" />
//                 )}
//               </div>
//             </div>
//             <Button
//               onClick={finalizeAuditEntry}
//               disabled={!kwsName || (!docUrl && !mediaUrl)}
//               className="w-full bg-[#123d2b] h-12 text-sm font-bold"
//             >
//               {editingId ? "Update Session Info" : "Save Session Record"}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* MEDIA VIEWER */}
//       <Dialog open={!!viewingMedia} onOpenChange={() => setViewingMedia(null)}>
//         <DialogContent className="max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Media Viewer</DialogTitle>
//           </DialogHeader>
//           {viewingMedia && (
//             <div className="w-full">
//               {viewingMedia.match(/\.(mp4|webm|mov|ogg)$/i) ? (
//                 <video
//                   src={viewingMedia}
//                   controls
//                   className="w-full rounded-lg"
//                   autoPlay
//                 />
//               ) : (
//                 <img
//                   src={viewingMedia}
//                   className="w-full rounded-lg"
//                   alt="Preview"
//                 />
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* DELETE CONFIRMATION */}
//       <Dialog
//         open={!!docToDelete}
//         onOpenChange={(open) => !open && setDocToDelete(null)}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-red-600 flex items-center gap-2">
//               <ShieldAlert className="w-5 h-5" /> Confirm Deletion
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <p className="text-sm">
//               Type <span className="font-bold text-red-600">DELETE</span> to
//               confirm.
//             </p>
//             <Input
//               value={deleteConfirmText}
//               onChange={(e) => setDeleteConfirmText(e.target.value)}
//               placeholder="DELETE"
//             />
//             <div className="flex gap-3">
//               <Button
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => setDocToDelete(null)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 className="flex-1"
//                 onClick={confirmDelete}
//                 disabled={deleteConfirmText !== "DELETE"}
//               >
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Page;

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  FileText,
  Edit3,
  Trash2,
  Loader2,
  CheckCircle2,
  Film,
} from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

// --- SUB-COMPONENT: BUFFERED VIDEO ---
function BufferedVideo({ src }) {
  const [videoBlob, setVideoBlob] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (!src) return;
    setVideoBlob(null);
    setDownloadProgress(0);

    const controller = new AbortController();
    
    fetch(src, { signal: controller.signal })
      .then(async (response) => {
        if (!response.body) throw new Error("ReadableStream not supported");
        
        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length') || 0;
        let receivedLength = 0;
        let chunks = [];

        while(true) {
          const {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          if (contentLength) {
            setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
          }
        }

        const blob = new Blob(chunks, { type: 'video/mp4' });
        setVideoBlob(URL.createObjectURL(blob));
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error("Video load error:", err);
      });

    return () => {
      controller.abort();
      if (videoBlob) URL.revokeObjectURL(videoBlob);
    };
  }, [src]);

  if (!videoBlob) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-black text-[#FFFDD0]">
        <Loader2 className="animate-spin mb-2" />
        <p className="text-xs font-mono">BUFFERING: {downloadProgress}%</p>
      </div>
    );
  }

  return (
    <video 
      src={videoBlob} 
      controls 
      autoPlay 
      className="w-full max-h-[85vh] outline-none"
    />
  );
}

export default function RepositoryPage() {
  const supabase = useRef(createClient()).current;
  const observerTarget = useRef(null);

  // --- DATA STATES ---
  const [kwsDocs, setKwsDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // --- FORM/UI STATES ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [kwsName, setKwsName] = useState("");
  const [docUrl, setDocUrl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [viewingMedia, setViewingMedia] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // --- PROGRESS STATES ---
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [docUploadProgress, setDocUploadProgress] = useState(0);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);

  // --- FETCH LOGIC ---
  const fetchKWSDocuments = useCallback(async (pageNum = 0, isRefresh = false) => {
    setLoading(true);
    try {
      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("kws_documents")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (isRefresh) {
        setKwsDocs(data || []);
      } else {
        setKwsDocs((prev) => {
          const existingIds = new Set(prev.map(d => d.id));
          const uniqueNew = (data || []).filter(d => !existingIds.has(d.id));
          return [...prev, ...uniqueNew];
        });
      }
      setHasMore(data?.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchKWSDocuments(page, page === 0);
  }, [page, fetchKWSDocuments]);

  // --- INFINITE SCROLL ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, loading]);

  const closeModal = () => {
    setIsUploadModalOpen(false);
    setEditingId(null);
    setKwsName("");
    setDocUrl(null);
    setMediaUrl(null);
    setIsUploadingDoc(false);
    setIsUploadingMedia(false);
    setDocUploadProgress(0);
    setMediaUploadProgress(0);
  };

  const handleImmediateUpload = async (file, type) => {
    if (!file) return;

    const isDoc = type === "doc";
    if (isDoc) {
      setIsUploadingDoc(true);
      setDocUploadProgress(0);
    } else {
      setIsUploadingMedia(true);
      setMediaUploadProgress(0);
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("kws_documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            if (isDoc) setDocUploadProgress(percent);
            else setMediaUploadProgress(percent);
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("kws_documents")
        .getPublicUrl(fileName);

      if (isDoc) setDocUrl(publicUrl);
      else setMediaUrl(publicUrl);

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      if (isDoc) setIsUploadingDoc(false);
      else setIsUploadingMedia(false);
    }
  };

  const finalizeAuditEntry = async () => {
    if (!kwsName.trim()) return toast.error("Enter KWS name");
    if (!docUrl && !mediaUrl) return toast.error("Upload at least one file");

    try {
      const payload = {
        kws_name: kwsName,
        file_url: docUrl || mediaUrl,
        doc_url: docUrl,
        media_url: mediaUrl,
        file_name: kwsName,
        original_name: kwsName,
      };

      const { error } = editingId 
        ? await supabase.from("kws_documents").update(payload).eq("id", editingId)
        : await supabase.from("kws_documents").insert(payload);

      if (error) throw error;

      toast.success(editingId ? "Changes saved" : "Audit log saved");
      closeModal();
      fetchKWSDocuments(0, true);
    } catch (err) {
      console.error("Critical Error:", err);
      toast.error("Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmText !== "DELETE") return toast.error("Type DELETE to confirm");
    try {
      const files = [];
      if (docToDelete.doc_url) files.push(docToDelete.doc_url.split("/").pop());
      if (docToDelete.media_url) files.push(docToDelete.media_url.split("/").pop());

      if (files.length > 0) await supabase.storage.from("kws_documents").remove(files);
      await supabase.from("kws_documents").delete().eq("id", docToDelete.id);

      toast.success("Deleted successfully");
      setDocToDelete(null);
      fetchKWSDocuments(0, true);
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <CardHeader className="flex flex-row items-center justify-between px-0 mb-8">
        <div>
          <CardTitle className="text-3xl font-black tracking-tight uppercase">Repository</CardTitle>
          <p className="text-sm text-slate-500 font-medium">Key Working Session Records</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="bg-black text-[#FFFDD0] gap-2 rounded-full px-6">
          <Plus className="w-5 h-5" /> New Entry
        </Button>
      </CardHeader>

      <div className="border border-black/10 rounded-2xl bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FFFDD0] border-b-2 border-black">
            <tr>
              <th className="p-5 text-[10px] font-black uppercase text-black">Title</th>
              <th className="p-5 text-[10px] font-black uppercase text-center text-black">Doc</th>
              <th className="p-5 text-[10px] font-black uppercase text-center text-black">Media</th>
              <th className="p-5 text-right font-black text-[10px] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {kwsDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-5 font-bold text-black">{doc.kws_name}</td>
                <td className="p-5 text-center">
                  {doc.doc_url && (
                    <Button variant="outline" size="sm" onClick={() => window.open(doc.doc_url, "_blank")} className="h-8 border-black text-black font-bold text-[10px]">
                      <FileText className="w-3.5 h-3.5 mr-2" /> VIEW
                    </Button>
                  )}
                </td>
                <td className="p-5 flex justify-center">
                  {doc.media_url && (
                    <div onClick={() => setViewingMedia(doc.media_url)} className="h-10 w-16 bg-black rounded flex items-center justify-center cursor-pointer overflow-hidden border border-black/10">
                      {doc.media_url.match(/\.(mp4|webm|mov|ogg)/i) ? <Film className="text-[#FFFDD0] w-5 h-5" /> : <img src={doc.media_url} className="w-full h-full object-cover" alt="thumb" />}
                    </div>
                  )}
                </td>
                <td className="p-5 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(doc.id); setKwsName(doc.kws_name); setDocUrl(doc.doc_url); setMediaUrl(doc.media_url); setIsUploadModalOpen(true); }}><Edit3 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setDocToDelete(doc)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={observerTarget} className="p-10 flex justify-center bg-slate-50 border-t border-black/5">
          {loading ? <Loader2 className="animate-spin w-5 h-5 text-slate-400" /> : <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{hasMore ? "Scroll for more" : "End of Records"}</span>}
        </div>
      </div>

      {/* --- UPLOAD MODAL --- */}
      <Dialog open={isUploadModalOpen} onOpenChange={(o) => { if(!o) closeModal(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="uppercase font-black text-xl">{editingId ? "Edit" : "New"} Session</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">Title and upload supporting documents or media.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-1">Session Name</label>
                <Input value={kwsName} onChange={(e) => setKwsName(e.target.value)} placeholder="Enter title..." className="border-black/20 focus:border-black" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* DOCUMENT UPLOAD BOX */}
              <div className="border-2 border-dashed border-black/10 p-4 rounded-xl text-center relative flex flex-col items-center justify-center min-h-[110px] bg-slate-50/50">
                <input type="file" id="d-up" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleImmediateUpload(e.target.files[0], "doc")} disabled={isUploadingDoc} />
                <label htmlFor="d-up" className={`cursor-pointer text-[10px] font-black uppercase ${isUploadingDoc ? 'text-slate-400' : 'text-blue-600'}`}>
                  {isUploadingDoc ? "Uploading..." : "Upload Doc"}
                </label>
                
                {isUploadingDoc && (
                  <div className="w-full mt-3 px-2">
                    <div className="text-[10px] font-mono font-bold mb-1">{docUploadProgress}%</div>
                    <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${docUploadProgress}%` }} />
                    </div>
                  </div>
                )}
                {docUrl && !isUploadingDoc && <CheckCircle2 className="text-emerald-500 mt-2 h-5 w-5" />}
              </div>

              {/* MEDIA UPLOAD BOX */}
              <div className="border-2 border-dashed border-black/10 p-4 rounded-xl text-center relative flex flex-col items-center justify-center min-h-[110px] bg-slate-50/50">
                <input type="file" id="m-up" className="hidden" accept="image/*,video/*" onChange={(e) => handleImmediateUpload(e.target.files[0], "media")} disabled={isUploadingMedia} />
                <label htmlFor="m-up" className={`cursor-pointer text-[10px] font-black uppercase ${isUploadingMedia ? 'text-slate-400' : 'text-blue-600'}`}>
                  {isUploadingMedia ? "Uploading..." : "Upload Media"}
                </label>

                {isUploadingMedia && (
                  <div className="w-full mt-3 px-2">
                    <div className="text-[10px] font-mono font-bold mb-1">{mediaUploadProgress}%</div>
                    <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${mediaUploadProgress}%` }} />
                    </div>
                  </div>
                )}
                {mediaUrl && !isUploadingMedia && <CheckCircle2 className="text-emerald-500 mt-2 h-5 w-5" />}
              </div>
            </div>

            <Button onClick={finalizeAuditEntry} className="w-full bg-black text-[#FFFDD0] font-black uppercase text-xs h-12 rounded-xl" disabled={isUploadingDoc || isUploadingMedia}>
              Save Session Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- PREVIEW MODAL --- */}
      <Dialog open={!!viewingMedia} onOpenChange={() => setViewingMedia(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          <DialogHeader className="sr-only"><DialogTitle>Preview</DialogTitle></DialogHeader>
          {viewingMedia && viewingMedia.match(/\.(mp4|webm|mov|ogg)/i) ? <BufferedVideo src={viewingMedia} /> : <img src={viewingMedia} className="w-full h-auto max-h-[85vh] object-contain" alt="Preview" />}
        </DialogContent>
      </Dialog>

      {/* --- DELETE MODAL --- */}
      <Dialog open={!!docToDelete} onOpenChange={() => { setDocToDelete(null); setDeleteConfirmText(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-black uppercase">Confirm Deletion</DialogTitle>
            <DialogDescription className="font-medium">This will permanently remove the record and its files.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold uppercase">Type <span className="text-red-600">DELETE</span> to confirm</p>
            <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" className="border-red-200" />
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteConfirmText !== "DELETE"} className="w-full font-black uppercase text-xs h-12">Permanently Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}