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
  Edit,
  Upload,
  ShieldAlert,
  Home,
  Clock,
  Copy,
  Play,
  Video,
  Fingerprint,
  ImageIcon,
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
import SignatureCanvas from "react-signature-canvas";
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

  const [logToDelete, setLogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sigCanvas = React.useRef(null); // Ref for the signature canvas
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signingContext, setSigningContext] = useState(null);

  // -For Deleting All from Support Logs and KWS Tables-
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteAllTarget, setDeleteAllTarget] = useState(""); // "logs" or "kws"

  // Helper to clear canvas
  const clearSignature = () => sigCanvas.current?.clear();

  const [sessionDate, setSessionDate] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });

  // Save signature logic
  const saveSignature = async () => {
    if (sigCanvas.current.isEmpty()) {
      return toast.error("Please provide a signature first");
    }

    const signatureData = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    try {
      const targetTable =
        signingContext.table === "support"
          ? "support_logs"
          : "kws_finalized_records";

      const column =
        signingContext.type === "user"
          ? "service_user_signature"
          : "support_worker_signature";

      const { error } = await supabase
        .from(targetTable)
        .update({ [column]: signatureData })
        .eq("id", signingContext.logId);

      if (error) throw error;

      toast.success("Signature saved successfully");
      setIsSignatureModalOpen(false);

      // Clear the canvas for next time
      clearSignature();

      // Refresh the table data
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save signature");
    }
  };

  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' = youngest first, 'asc' = oldest first
  const [sortConfig, setSortConfig] = useState({
    key: "session_date",
    direction: "desc",
  });

  const toggleSortOrder = () => {
    setSortConfig((prev) => ({
      key: "session_date",
      direction:
        prev.key === "session_date" && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const sortedLogs = [...logs].sort((a, b) => {
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";

    // Date sorting logic
    if (sortConfig.key === "session_date") {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Alphabetical sorting logic (Staff & Type)
    aValue = aValue.toString().toLowerCase();
    bValue = bValue.toString().toLowerCase();

    if (sortConfig.direction === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

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

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isDoc = type === "about_file";
    const isProfile = type === "profile_image";

    // Loading states
    if (isDoc) setIsUploadingDoc(true);
    if (isProfile) setLoading(true); // Or use a specific profile loading state

    try {
      // 1. Generate Path: UUID / category / timestamp_filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${type}.${fileExt}`;
      const filePath = `${id}/${type}/${fileName}`;

      // 2. Upload to Storage (Using the correct bucket)
      const { error: uploadError } = await supabase.storage
        .from("service-user-intake-docs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: urlData } = supabase.storage
        .from("service-user-intake-docs")
        .getPublicUrl(filePath);

      // 4. Update Database
      // map the 'type' to the actual database column name
      const dbField = isProfile ? "profile_image_url" : "about_file_url";

      const { error: dbError } = await supabase
        .from("service_user_intake")
        .update({ [dbField]: urlData.publicUrl })
        .eq("id", id);

      if (dbError) throw dbError;

      // 5. Update Local State
      setUserData({ ...userData, [dbField]: urlData.publicUrl });
      toast.success(
        `${isProfile ? "Profile photo" : "About document"} updated!`,
      );
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploadingDoc(false);
      setLoading(false);
    }
  };

  const handleKWSFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Determine if this is a KWS upload or a Profile upload
    const isKWS = type === "doc" || type === "media";
    const isProfile = type === "profile_image";
    const isAbout = type === "about_file";

    // 1. Set Loading States
    if (type === "doc") setIsUploadingDoc(true);
    if (type === "media") setIsUploadingMedia(true);
    if (isProfile || isAbout) setLoading(true);

    try {
      // 2. Select the correct bucket and path
      // KWS files go to 'kws-attachments', others go to 'service-user-intake-docs'
      const bucket = isKWS ? "kws-attachments" : "service-user-intake-docs";
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${type}.${fileExt}`;
      const filePath = `${id}/${type}/${fileName}`;

      // 3. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // 5. Route the result based on the type
      if (isKWS) {
        // For KWS, we just update the local URL state
        // This URL is saved to the DB later when finalizeKWS() is called
        if (type === "doc") setDocUrl(urlData.publicUrl);
        if (type === "media") setMediaUrl(urlData.publicUrl);
        toast.success(`${type === "doc" ? "Document" : "Media"} uploaded!`);
      } else {
        // For Profile/About, update the 'service_user_intake' table immediately
        const dbField = isProfile ? "profile_image_url" : "about_file_url";

        const { error: dbError } = await supabase
          .from("service_user_intake")
          .update({ [dbField]: urlData.publicUrl })
          .eq("id", id);

        if (dbError) throw dbError;

        setUserData({ ...userData, [dbField]: urlData.publicUrl });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploadingDoc(false);
      setIsUploadingMedia(false);
      setLoading(false);
    }
  };

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

  // This function now handles both single URL fields (like about_file_url) and array fields
  // (like additional_documents)
  // const handleDeleteItem = async (field, itemToDelete = null) => {
  //   // itemToDelete is only needed for arrays (additional_documents, etc.)
  //   const isArray = Array.isArray(userData[field]);

  //   try {
  //     // 1. Determine the storage path
  //     let storagePath = "";
  //     if (isArray && itemToDelete) {
  //       storagePath = itemToDelete.file_path;
  //     } else {
  //       // For single fields like about_file_url, we need to extract path from URL
  //       // or ensure you're storing about_file_path in your DB
  //       const url = userData[field];
  //       storagePath = url.split("/service-user-intake-docs/")[1];
  //     }

  //     // 2. Remove from Supabase Storage
  //     if (storagePath) {
  //       await supabase.storage
  //         .from("service-user-intake-docs")
  //         .remove([storagePath]);
  //     }

  //     // 3. Update Database
  //     let newValue;
  //     if (isArray) {
  //       newValue = userData[field].filter(
  //         (doc) => doc.url !== itemToDelete.url,
  //       );
  //     } else {
  //       newValue = null; // Clear the single field
  //     }

  //     const { error } = await supabase
  //       .from("service_user_intake")
  //       .update({ [field]: newValue })
  //       .eq("id", id);

  //     if (error) throw error;

  //     setUserData({ ...userData, [field]: newValue });
  //     toast.success("Item deleted successfully");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete item");
  //   }
  // };

  const handleDeleteItem = async (field, docToDelete) => {
  // 1. Physical Confirmation
  const confirm = window.confirm(`Are you sure you want to delete "${docToDelete.name || 'this document'}"?`);
  if (!confirm) return;

  try {
    const bucketName = "service-user-intake-docs";
    
    // 2. Extract the correct path for Supabase Storage
    // Ensure docToDelete.file_path is the relative path (e.g., "folder/file.pdf")
    const filePath = docToDelete.file_path || docToDelete.path;

    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) {
        console.error("Storage Error:", storageError);
        // We continue to DB update even if storage fails to keep UI in sync, 
        // or you can return here if you want strict deletion.
      }
    }

    // 3. Update the Database
    let updatedData;
    if (field === "independence_passport") {
      updatedData = null; // Reset single object
    } else {
      // Filter out the item from the array (Onboarding/Additional)
      updatedData = userData[field].filter((item) => item.file_path !== filePath);
    }

    const { error: dbError } = await supabase
      .from("service_user_intake")
      .update({ [field]: updatedData })
      .eq("id", id);

    if (dbError) throw dbError;

    // 4. Update Local State for instant UI feedback
    setUserData((prev) => ({
      ...prev,
      [field]: updatedData,
    }));

    toast.success("Document deleted successfully");
  } catch (err) {
    console.error("Delete operation failed:", err);
    toast.error("Failed to delete the document");
  }
};

  // --- Add this near your other delete functions (approx. line 270) ---
  const handleConfirmDeleteAll = async () => {
    if (deleteConfirmText !== "DELETE ALL") {
      return toast.error("Please type DELETE ALL to confirm");
    }

    setIsDeleting(true);
    try {
      if (deleteAllTarget === "logs") {
        // 1. Clear Support Log Storage
        const logPaths = logs.map((l) => l.file_path).filter(Boolean);
        if (logPaths.length > 0) {
          await supabase.storage.from("support_documents").remove(logPaths);
        }
        // 2. Clear Database
        const { error } = await supabase
          .from("support_logs")
          .delete()
          .eq("service_user_id", id);
        if (error) throw error;
        toast.success("All support logs deleted");
      } else {
        // 3. Clear KWS Storage
        const kwsPaths = kwsDocs
          .flatMap((d) => [d.doc_storage_path, d.media_storage_path])
          .filter(Boolean);
        if (kwsPaths.length > 0) {
          await supabase.storage.from("kws-attachments").remove(kwsPaths);
        }
        // 4. Clear Database
        const { error } = await supabase
          .from("kws_finalized_records")
          .delete()
          .eq("service_user_id", id);
        if (error) throw error;
        toast.success("All KWS records deleted");
      }

      setIsDeleteAllModalOpen(false);
      setDeleteConfirmText("");
      fetchAllData(); // Refresh UI
    } catch (err) {
      console.error(err);
      toast.error("Bulk deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Helper: Document Link Card ---
  const DocCard = ({ title, url, onDelete }) => {
    if (!url) return null;

    return (
      <div className="flex items-center justify-between p-4 bg-white border border-black rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#e6f2ec] rounded-lg text-black">
            <FileText size={18} />
          </div>
          <span className="text-sm font-bold text-[#123d2b] truncate max-w-40">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDocument(url)}
            className="p-2 text-black hover:bg-[#e6f2ec] rounded-lg border border-transparent hover:border-black/10"
          >
            <ExternalLink size={16} />
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
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
            className="text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
          <Link href={`/service-users/${id}/edit`}>
            <Button variant="outline" className="border-black text-black">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
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
              <h1 className="text-3xl mt-10 text-black font-bold uppercase">
                {userData.service_user_name}
              </h1>

              <div className="flex items-center gap-2 text-slate-500">
                <Home className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-tight">
                  {userData?.property_name || "No Property Assigned"}
                </span>
              </div>
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

              {userData?.profile_image_url && (
                <button
                  onClick={() => handleDeleteItem("profile_image_url")}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg z-10"
                >
                  <Trash2 size={12} />
                </button>
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
            <TabsTrigger
              value="Independence_passport"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Independence Passport
            </TabsTrigger>
            <TabsTrigger
              value="onboarding"
              className="data-[state=active]:bg-[#FFFDD0] data-[state=active]:text-black"
            >
              Onboarding
            </TabsTrigger>
            <TabsTrigger
              value="kws"
              className="data-[state=active]:bg-[#FFFDD0] data-[state=active]:text-black"
            >
              Key Working Session
            </TabsTrigger>
          </TabsList>

          {/* ABOUT TAB */}
          <TabsContent value="about">
            <Card className="border border-black shadow-sm bg-[#FFFDD0]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText className="h-4 w-4 text-black" /> About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData?.about_file_url ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-[11px] text-slate-500 font-medium italic">
                      "Primary record for service user intake and background."
                    </p>
                    <div className="flex gap-2 w-full">
                      <Button
                        className="flex-1 bg-black hover:bg-[#1f6b4a] font-bold text-xs py-5"
                        onClick={() => openDocument(userData.about_file_url)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> VIEW ABOUT
                      </Button>
                      <Button
                        variant="destructive"
                        className="px-4"
                        onClick={() => handleDeleteItem("about_file_url")}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
                      <div className="bg-black text-white text-[10px] font-black py-3 rounded-lg text-center cursor-pointer hover:bg-[#123d2b] transition-colors">
                        UPLOAD NOW
                      </div>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: SUPPORT LOGS */}
          <TabsContent value="logs">
            <Card className="border border-black shadow-sm bg-[#FFFDD0]">
              <CardHeader className="border-b border-[#e1dbd2]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-black uppercase tracking-widest">
                  <ClipboardList className="w-4 h-4" /> Session History
                </CardTitle>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {logs.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-9"
                        onClick={() => {
                          setDeleteAllTarget("logs");
                          setIsDeleteAllModalOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete All Logs
                      </Button>
                    )}
                    {/* Existing Add Support Log Button... */}
                  </div>

                  {/* DEDICATED SORTING SELECT */}
                  <div className="flex items-center gap-2 bg-[#fcfcfc] border border-[#e1dbd2] rounded-lg px-3 py-1 shadow-sm">
                    <Label className="text-[10px] font-black text-gray-400 uppercase whitespace-nowrap">
                      Sort By
                    </Label>
                    <select
                      className="bg-transparent text-xs font-bold text-[#123d2b] outline-none cursor-pointer py-1"
                      value={`${sortConfig.key}-${sortConfig.direction}`}
                      onChange={(e) => {
                        const [key, direction] = e.target.value.split("-");
                        setSortConfig({ key, direction });
                      }}
                    >
                      <option value="session_date-desc">
                        Date: Newest to Oldest
                      </option>
                      <option value="session_date-asc">
                        Date: Oldest to Newest
                      </option>
                      <option value="support_worker_name-asc">
                        Staff: A to Z
                      </option>
                      <option value="support_worker_name-desc">
                        Staff: Z to A
                      </option>
                      <option value="session_type-asc">Type: A to Z</option>
                      <option value="session_type-desc">Type: Z to A</option>
                    </select>
                  </div>

                  <Link href={`/service-users/${id}/add`}>
                    <Button
                      variant="outline"
                      className="border-[#1f6b4a] text-black hover:bg-[#1f6b4a] hover:text-white h-9"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Support Log
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {logs.length > 0 ? (
                  <div className="overflow-hidden border border-[#e1dbd2] rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#fcfcfc] border-b border-[#e1dbd2] text-[#123d2b]/60 uppercase text-[10px] font-black tracking-widest">
                          {/* <th className="py-4 px-4">Date </th> */}
                          {/* Replace the existing <th>Date</th> with this */}
                          <th
                            className="py-4 px-4 cursor-pointer hover:text-black transition-colors"
                            onClick={toggleSortOrder}
                          >
                            <div className="flex items-center gap-1">
                              Date {sortOrder === "asc" ? "↑" : "↓"}
                              <span className="text-[8px] opacity-50 ml-1">
                                ({sortOrder === "asc" ? "Oldest" : "Youngest"})
                              </span>
                            </div>
                          </th>

                          <th className="py-4 px-4">Staff</th>
                          <th className="py-4 px-4">Type</th>
                          <th className="py-4 px-4">Duration</th>
                          <th className="py-4 px-4">Notes</th>
                          <th className="py-4 px-4">Attachment</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f7f2e9]">
                        {sortedLogs.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-[#f1f8f5]/50 transition-colors group cursor-pointer"
                            onClick={() => setSelectedLog(log)}
                          >
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-bold  text-black">
                                {new Date(
                                  log.session_date,
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-black font-bold">
                              {log.support_worker_name}
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase border-[#123d2b]/20 text-black"
                              >
                                {log.session_type}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 font-mono text-xs  text-black">
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
                                <div className="flex items-center gap-1 text-[10px] font-black  text-black uppercase bg-[#f1f8f5] px-2 py-1 rounded w-fit">
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
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-black"
                                  onClick={() =>
                                    router.push(
                                      `/service-users/${log.id}/editSupport`,
                                    )
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
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
            <Card className="border border-black shadow-sm bg-[#FFFDD0]">
              <CardHeader>
                {/* Example for Document Section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-black flex items-center gap-2">
                    <FileText size={20} /> Additional Documents
                  </h3>
                  <Button
                    onClick={() => {
                      setUploadTargetField("additional_documents");
                      setIsUploadModalsOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-[#1f6b4a] text-black hover:bg-[#e6f2ec]"
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
                    onDelete={() =>
                      handleDeleteItem("additional_documents", doc)
                    }
                  />
                )) || (
                  <p className="col-span-2 text-center py-6 italic text-gray-400">
                    No documents found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Independence_passport TAB */}
          <TabsContent value="Independence_passport">
            <Card className="border border-black shadow-sm bg-[#FFFDD0]">
              <CardHeader>
                {/* Example for Independence Passport Section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-black flex items-center gap-2">
                    <FileText size={20} /> Independence Passport
                  </h3>
                  <Button
                    onClick={() => {
                      setUploadTargetField("Independence_passport");
                      setIsUploadModalsOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-[#1f6b4a] text-black hover:bg-[#e6f2ec]"
                  >
                    <Plus size={16} className="mr-1" /> Add Document
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.Independence_passport?.map((doc, i) => (
                  <DocCard
                    key={i}
                    title={doc.name || `Independence Passport Doc ${i + 1}`}
                    url={doc.url}
                    onDelete={() =>
                      handleDeleteItem("Independence_passport", doc)
                    }
                  />
                )) || (
                  <p className="col-span-2 text-center py-6 italic text-gray-400">
                    Independence Passport documents.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONBOARDING TAB */}
          <TabsContent value="onboarding">
            <Card className="border border-black shadow-sm bg-[#FFFDD0]">
              <CardHeader>
                {/* Example for Onboarding Section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-black flex items-center gap-2">
                    <FileText size={20} /> Onboarding Documents
                  </h3>
                  <Button
                    onClick={() => {
                      setUploadTargetField("onboarding_documents");
                      setIsUploadModalsOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-[#1f6b4a] text-black hover:bg-[#e6f2ec]"
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
                    onDelete={() =>
                      handleDeleteItem("onboarding_documents", doc)
                    }
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
            <div className="border border-black shadow-sm bg-[#FFFDD0] p-8 rounded-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    Key Working Sessions
                  </h2>
                  <p className="text-sm text-gray-500">
                    Audit trail of session evidence and documents
                  </p>
                </div>
                <div className="flex gap-2">
                  {kwsDocs.length > 0 && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDeleteAllTarget("kws");
                        setIsDeleteAllModalOpen(true);
                      }}
                    >
                      <Trash2 size={20} className="mr-2" /> Delete All Sessions
                    </Button>
                  )}
                  {/* Existing New Session Record Button... */}

                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className=" text-white"
                  >
                    <Plus size={20} className="mr-2" /> New Session Record
                  </Button>
                </div>
              </div>

              <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                {/* --- KWS Table Layout (Around Line 750) --- */}
                <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#fcfcfc] border-b border-[#e1dbd2]">
                      <tr>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-black">
                          Title
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-black">
                          Attachment
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-black text-center">
                          Media
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-black text-center">
                          Service User Sign
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-black text-center">
                          Support Worker Sign
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-black text-right">
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
                          <td className="p-4 text-sm font-bold text-black">
                            {doc.kws_name}
                          </td>

                          <td className="p-4">
                            {doc.doc_url && (
                              <Button
                                variant="ghost"
                                className="h-7 text-[10px] font-black bg-[#f1f8f5] text-black"
                                onClick={() => openDocument(doc.doc_url)}
                              >
                                <FileText className="w-3.5 h-3.5 mr-1" /> VIEW
                                DOC
                              </Button>
                            )}
                          </td>

                          <td className="p-4 text-center">
                            {doc.media_url && (
                              <div
                                className="relative h-10 w-16 mx-auto bg-black rounded cursor-pointer overflow-hidden group/media"
                                onClick={() => setViewingMedia(doc.media_url)}
                              >
                                <Play className="absolute inset-0 m-auto text-white w-3 h-3 fill-white z-10" />
                                <video
                                  src={doc.media_url}
                                  className="object-cover w-full h-full opacity-60"
                                />
                              </div>
                            )}
                          </td>

                          {/* Service User Signature Column */}
                          <td className="p-4 text-center">
                            {doc.service_user_signature ? (
                              <div className="relative inline-block group/sig">
                                <img
                                  src={doc.service_user_signature}
                                  alt="Sign"
                                  className="h-8 border bg-white rounded mx-auto cursor-pointer hover:border-blue-400 transition-all"
                                />
                                <button
                                  onClick={() => {
                                    setSigningContext({
                                      logId: doc.id,
                                      type: "user",
                                      table: "kws",
                                    });
                                    setIsSignatureModalOpen(true);
                                  }}
                                  className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover/sig:opacity-100 transition-opacity shadow-lg"
                                  title="Edit Signature"
                                >
                                  <Edit size={10} />
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[10px] h-7 border-dashed border-black/30"
                                onClick={() => {
                                  setSigningContext({
                                    logId: doc.id,
                                    type: "user",
                                    table: "kws",
                                  });
                                  setIsSignatureModalOpen(true);
                                }}
                              >
                                Sign
                              </Button>
                            )}
                          </td>

                          {/* Support Worker Signature Column */}
                          <td className="p-4 text-center">
                            {doc.support_worker_signature ? (
                              <div className="relative inline-block group/sig">
                                <img
                                  src={doc.support_worker_signature}
                                  alt="Sign"
                                  className="h-8 border bg-white rounded mx-auto cursor-pointer hover:border-blue-400 transition-all"
                                />
                                <button
                                  onClick={() => {
                                    setSigningContext({
                                      logId: doc.id,
                                      type: "worker",
                                      table: "kws",
                                    });
                                    setIsSignatureModalOpen(true);
                                  }}
                                  className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover/sig:opacity-100 transition-opacity shadow-lg"
                                  title="Edit Signature"
                                >
                                  <Edit size={10} />
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[10px] h-7 border-dashed border-black/30"
                                onClick={() => {
                                  setSigningContext({
                                    logId: doc.id,
                                    type: "worker",
                                    table: "kws",
                                  });
                                  setIsSignatureModalOpen(true);
                                }}
                              >
                                Sign
                              </Button>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-black"
                                onClick={() => {
                                  setEditingId(doc.id);
                                  setKwsName(doc.kws_name);
                                  setDocUrl(doc.doc_url);
                                  setMediaUrl(doc.media_url);
                                  setIsUploadModalOpen(true);
                                }}
                              >
                                <Edit size={15} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500"
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
              <DialogTitle className="text-xl font-bold text-blCK">
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
              {/* <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div> */}
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
                    onChange={(e) => handleKWSFileUpload(e, "doc")}
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
                    onChange={(e) => handleKWSFileUpload(e, "media")}
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
          <DialogContent className="fixed left-[50%] top-[50%] z-100 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border-[#e1dbd2] bg-[#fdfbf7] p-6 shadow-2xl duration-200">
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
          <DialogContent className="sm:max-w-125 border-[#e1dbd2] rounded-xl flex flex-col max-h-[90vh]">
            <DialogHeader className="border-b border-[#f7f2e9] pb-4 shrink-0">
              <DialogTitle className="text-[#123d2b] flex items-center gap-2">
                <ClipboardList className="h-5 w-5" /> Support Log Details
              </DialogTitle>
            </DialogHeader>

            {/* SCROLLABLE AREA START */}
            <div className="py-6 space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {selectedLog && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[10px] font-black uppercase text-gray-400">
                        Date & Time
                      </Label>
                      <p className="text-sm font-bold text-[#123d2b]">
                        {new Date(
                          selectedLog.session_date,
                        ).toLocaleDateString()}
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
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-[10px] font-black uppercase text-gray-400 block">
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
                    </div>
                    {/* Notes will wrap and expand this container, which is now scrollable */}
                    <p className="text-sm text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                      "
                      {selectedLog.notes ||
                        "No notes provided for this session."}
                      "
                    </p>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f7f2e9]">
            <div>
              <Label className="text-[10px] text-gray-400 uppercase font-bold">User Sign</Label>
              <div className="h-20 border rounded bg-white flex items-center justify-center mt-1">
                {selectedLog.service_user_signature ? (
                  <img src={selectedLog.service_user_signature} className="h-full object-contain" alt="User Sign" />
                ) : (
                  <span className="text-xs text-gray-300 italic">Pending</span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-gray-400 uppercase font-bold">Worker Sign</Label>
              <div className="h-20 border rounded bg-white flex items-center justify-center mt-1">
                {selectedLog.support_worker_signature ? (
                  <img src={selectedLog.support_worker_signature} className="h-full object-contain" alt="Worker Sign" />
                ) : (
                  <span className="text-xs text-gray-300 italic">Pending</span>
                )}
              </div>
            </div>
          </div> */}

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
                </>
              )}
            </div>
            {/* SCROLLABLE AREA END */}

            <DialogFooter className="border-t border-[#f7f2e9] pt-4 shrink-0">
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

        {/* SIGNATURE DRAWING MODAL */}
        <Dialog
          open={isSignatureModalOpen}
          onOpenChange={setIsSignatureModalOpen}
        >
          <DialogContent className="sm:max-w-md bg-[#fdfbf7]">
            <DialogHeader>
              <DialogTitle className="text-black flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {signingContext?.type === "user"
                  ? "Service User Signature"
                  : "Support Worker Signature"}
              </DialogTitle>
              <DialogDescription>
                Please draw your signature in the box below.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  width: 445,
                  height: 200,
                  className: "signature-canvas cursor-crosshair",
                }}
              />
            </div>

            <div className="flex justify-between items-center gap-3">
              <Button
                variant="ghost"
                onClick={clearSignature}
                className="text-gray-500 text-xs"
              >
                Clear Canvas
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsSignatureModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#123d2b] hover:bg-[#1f6b4a]"
                  onClick={saveSignature}
                >
                  Confirm & Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete All Modal - from Support Logs and KWS Records */}
        <Dialog
          open={isDeleteAllModalOpen}
          onOpenChange={setIsDeleteAllModalOpen}
        >
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center gap-2 font-black">
                <ShieldAlert className="w-5 h-5" /> DANGER: DELETE ALL RECORDS
              </DialogTitle>
              <DialogDescription className="font-bold text-black/80">
                This will permanently delete ALL{" "}
                {deleteAllTarget === "logs" ? "Support Logs" : "KWS Records"}{" "}
                and their attached files for this resident.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <Label className="text-[10px] uppercase font-black text-red-600 mb-2 block">
                Type "DELETE ALL" to confirm
              </Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE ALL"
                className="border-red-200 focus:ring-red-500"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteAllModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeleteAll}
                disabled={deleteConfirmText !== "DELETE ALL" || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Permanently Delete Everything"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}