"use client";

import React, { useState, useEffect } from "react"; // ✅ Added useEffect
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Play,
  Edit3,
  Trash2,
  Loader2,
  CheckCircle2,
  Briefcase,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  // --- STATE MANAGEMENT ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kwsDocs, setKwsDocs] = useState([]);
  const [kwsName, setKwsName] = useState("");
  const [docUrl, setDocUrl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingMedia, setViewingMedia] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // --- 1. FETCH ON LOAD ---
  useEffect(() => {
    fetchKWSDocuments();
  }, []);

  // --- HANDLERS ---
  const closeModal = async () => {
    // 1. CLEANUP BUCKET: Delete files if they were uploaded but not "Finalized"
    // We only do this if editingId is null (new entry)
    // or if the URLs in state are different from the original ones.
    try {
      const filesToRemove = [];

      if (docUrl) {
        const docPath = docUrl.split("/").pop();
        filesToRemove.push(`${id}/${docPath}`);
      }

      if (mediaUrl) {
        const mediaPath = mediaUrl.split("/").pop();
        filesToRemove.push(`${id}/${mediaPath}`);
      }

      if (filesToRemove.length > 0 && !editingId) {
        await supabase.storage.from("kws_documents").remove(filesToRemove);
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }

    // 2. RESET STATES
    setIsUploadModalOpen(false);
    setEditingId(null);
    setKwsName("");
    setDocUrl(null);
    setMediaUrl(null);
    setIsUploadingDoc(false);
    setIsUploadingMedia(false);
  };

  const fetchKWSDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("kws_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch Error:", error);
        toast.error(error.message);
        return [];
      }

      // Ensure we map the correct URLs for the table display
      const cleanedData = (data || []).map((item) => ({
        ...item,
        file_url: item.file_url || item.doc_url || item.media_url,
      }));

      setKwsDocs(cleanedData); // ✅ Fixed: Now matches state variable
      return cleanedData;
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Something went wrong while fetching documents");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleImmediateUpload = async (file, type) => {
    if (!file) return;

    if (type === "doc") setIsUploadingDoc(true);
    else setIsUploadingMedia(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName; // ✅ Removed ID as requested

      const { data, error: uploadError } = await supabase.storage
        .from("kws_documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("kws_documents").getPublicUrl(filePath);

      if (type === "doc") setDocUrl(publicUrl);
      else setMediaUrl(publicUrl);

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploadingDoc(false);
      setIsUploadingMedia(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      const filesToDelete = [];
      // ✅ Fixed: Extract filename correctly from the end of the URL
      if (docToDelete.doc_url) {
        const parts = docToDelete.doc_url.split("/");
        filesToDelete.push(parts[parts.length - 1]);
      }
      if (docToDelete.media_url) {
        const parts = docToDelete.media_url.split("/");
        filesToDelete.push(parts[parts.length - 1]);
      }

      if (filesToDelete.length > 0) {
        await supabase.storage.from("kws_documents").remove(filesToDelete);
      }

      const { error: dbError } = await supabase
        .from("kws_documents")
        .delete()
        .eq("id", docToDelete.id);
      if (dbError) throw dbError;

      toast.success("Deleted successfully");
      setDocToDelete(null);
      fetchKWSDocuments();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Deletion failed");
    }
  };

  const handleEditClick = (doc) => {
    setEditingId(doc.id);
    setKwsName(doc.kws_name);
    setDocUrl(doc.doc_url);
    setMediaUrl(doc.media_url);
    setIsUploadModalOpen(true);
  };

  const finalizeAuditEntry = async () => {
    // 1. Validate
    if (!kwsName.trim()) {
      toast.error("Enter KWS name");
      return;
    }

    if (!docUrl && !mediaUrl) {
      toast.error("Upload at least one file");
      return;
    }

    try {
      // REQUIRED FIELD LOGIC
      const fileUrl = docUrl || mediaUrl;

      const payload = {
        kws_name: kwsName,
        file_url: fileUrl, // ✅ Required column
        doc_url: docUrl,
        media_url: mediaUrl,
        file_name: kwsName,
        original_name: kwsName,
      };

      let response;

      if (editingId) {
        // ✅ Update existing record
        response = await supabase
          .from("kws_documents")
          .update(payload)
          .eq("id", editingId);
      } else {
        // ✅ Insert new record
        response = await supabase.from("kws_documents").insert(payload);
      }

      if (response.error) {
        console.error("Supabase Error:", response.error);
        toast.error(response.error.message);
        return;
      }

      toast.success(editingId ? "Changes saved" : "Audit log saved");

      // Reset state and close modal
      setEditingId(null);
      setKwsName("");
      setDocUrl(null);
      setMediaUrl(null);
      setIsUploadModalOpen(false);

      fetchKWSDocuments();
    } catch (err) {
      console.error("Critical Error:", err);
      toast.error("Something went wrong");
    }
  };

  // --- HELPERS ---
  const openDocument = (url) => {
    if (!url) return;
    const isOffice = url.toLowerCase().match(/\.(doc|docx)$/);
    if (isOffice) {
      window.open(
        `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
        "_blank",
      );
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="p-6">
      <Card className="border-[#e1dbd2]">
        <CardHeader className="flex flex-row items-center justify-between bg-white border-b p-6">
          <CardTitle className="text-lg font-bold text-[#123d2b]">
            Key Working Sessions
          </CardTitle>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-[#123d2b] hover:bg-[#1f6b4a] gap-2"
          >
            <Plus className="w-4 h-4" /> New KWS Entry
          </Button>
        </CardHeader>

        <section className="p-6">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin h-8 w-8 text-[#123d2b]" />
            </div>
          ) : (
            <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-500">
                      Title
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-500">
                      Attachment
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-500">
                      Video
                    </th>
                    <th className="p-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kwsDocs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-8 text-center text-slate-400"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    kwsDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="p-4 font-bold text-sm text-[#123d2b]">
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
                        <td className="p-4 text-right flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500"
                            onClick={() => handleEditClick(doc)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-red-600 bg-red-50"
                            onClick={() => {
                              setDocToDelete(doc);
                              setDeleteConfirmText("");
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Card>

      {/* MODALS (UPLOAD, VIEWER, DELETE) REMAIN THE SAME AS YOUR ORIGINAL CODE */}
      {/* ... keeping the Dialog sections from your code below ... */}

      {/* UPLOAD/EDIT MODAL */}
      <Dialog
        open={isUploadModalOpen}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent className="sm:max-w-112.5">
          <DialogHeader>
            <DialogTitle className="text-[#123d2b] font-black flex gap-2">
              <Briefcase className="w-5 h-5" />{" "}
              {editingId ? "EDIT SESSION" : "NEW SESSION RECORD"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Session Name
              </label>
              <Input
                value={kwsName}
                onChange={(e) => setKwsName(e.target.value)}
                placeholder="e.g. Tenancy Support"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border-2 border-dashed p-4 rounded-xl text-center ${docUrl ? "bg-emerald-50 border-emerald-200" : "bg-slate-50"}`}
              >
                <p className="text-[10px] font-black mb-2 uppercase">
                  Document
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="doc-up"
                  accept=".pdf,.doc,.docx" // ✅ Restricts to PDF and Word documents
                  onChange={(e) =>
                    handleImmediateUpload(e.target.files[0], "doc")
                  }
                />
                <label
                  htmlFor="doc-up"
                  className="cursor-pointer text-xs font-bold text-blue-600 underline"
                >
                  Upload File
                </label>
                {isUploadingDoc && (
                  <Loader2 className="animate-spin h-4 w-4 mx-auto mt-2" />
                )}
                {docUrl && (
                  <CheckCircle2 className="text-emerald-500 mx-auto mt-2 h-4 w-4" />
                )}
              </div>
              <div
                className={`border-2 border-dashed p-4 rounded-xl text-center ${mediaUrl ? "bg-emerald-50 border-emerald-200" : "bg-slate-50"}`}
              >
                <p className="text-[10px] font-black mb-2 uppercase">Media</p>
                <input
                  type="file"
                  className="hidden"
                  id="med-up"
                  accept="image/*,video/*" // ✅ This limits selection to images and videos
                  onChange={(e) =>
                    handleImmediateUpload(e.target.files[0], "media")
                  }
                />
                <label
                  htmlFor="med-up"
                  className="cursor-pointer text-xs font-bold text-blue-600 underline"
                >
                  Upload Media
                </label>
                {isUploadingMedia && (
                  <Loader2 className="animate-spin h-4 w-4 mx-auto mt-2" />
                )}
                {mediaUrl && (
                  <CheckCircle2 className="text-emerald-500 mx-auto mt-2 h-4 w-4" />
                )}
              </div>
            </div>
            <Button
              onClick={finalizeAuditEntry}
              disabled={!kwsName || (!docUrl && !mediaUrl)}
              className="w-full bg-[#123d2b] h-12 text-sm font-bold"
            >
              {editingId ? "Update Session Info" : "Save Session Record"}
            </Button>
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
  );
};

export default Page;
