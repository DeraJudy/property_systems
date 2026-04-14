// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { 
//   ArrowLeft, FileText, ExternalLink, User, ShieldCheck, 
//   GraduationCap, ClipboardList, Calendar, Briefcase, 
//   AlertCircle, Info
// } from "lucide-react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { supabase } from "@/lib/supabase";

// const EmployeeDetailView = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const fetchEmployeeDetails = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("employees")
//           .select("*")
//           .eq("id", id)
//           .single();

//         if (error) throw error;
//         setEmployee(data);
//       } catch (error) {
//         console.error("Error:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchEmployeeDetails();
//   }, [id]);

//   const getFileViewUrl = (url) => {
//     if (!url) return null;
//     const lowerUrl = url.toLowerCase();
//     if (lowerUrl.endsWith(".docx") || lowerUrl.includes(".docx?")) {
//       return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
//     }
//     return url;
//   };

//   // Updated to show "Nothing found" when URL is missing
//   const DocumentRow = ({ label, url }) => (
//     <div className="flex items-center justify-between p-3 bg-white border border-[#e1dbd2] rounded-lg mb-2 shadow-sm">
//       <div className="flex items-center gap-3">
//         <FileText className={`h-5 w-5 ${url ? "text-[#1f6b4a]" : "text-gray-300"}`} />
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//       </div>
//       {url ? (
//         <a 
//           href={getFileViewUrl(url)} 
//           target="_blank" 
//           rel="noopener noreferrer" 
//           className="flex items-center gap-1 text-[11px] font-bold text-[#1f6b4a] hover:underline bg-[#f1f8f5] px-2 py-1 rounded"
//         >
//           VIEW FILE <ExternalLink className="h-3 w-3" />
//         </a>
//       ) : (
//         <span className="text-[10px] font-bold text-gray-400 italic flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
//           <AlertCircle className="h-3 w-3" /> NOTHING FOUND
//         </span>
//       )}
//     </div>
//   );

//   if (!mounted || loading) return <div className="p-20 text-center font-medium font-sans">Loading Employee Profile...</div>;
//   if (!employee) return <div className="p-20 text-center text-red-500">Employee record not found.</div>;

//   return (
//     <div className="p-6 min-h-screen font-sans">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-white">
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to HR List
//         </Button>

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-[#e1dbd2] shadow-sm gap-4">
//           <div className="flex items-center gap-5">
//             <div className="h-20 w-20 bg-[#123d2b] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
//               {employee.full_name?.charAt(0)}
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-[#123d2b]">{employee.full_name}</h1>
//               <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 font-medium">
//                 <span className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {employee.job_role || "Role not assigned"}</span>
//                 <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> Started: {employee.start_date || "No Details Recorded"}</span>
//               </div>
//             </div>
//           </div>
//           <Button onClick={() => router.push(`/hrList/${id}/edit`)} className="bg-[#1f6b4a] hover:bg-[#123d2b] px-6">
//             Edit Employee
//           </Button>
//         </div>

//         <Tabs defaultValue="profile" className="w-full">
//           <TabsList className="bg-white border-[#e1dbd2] p-1 h-12 shadow-sm">
//             <TabsTrigger value="profile" className="px-6">Personal & References</TabsTrigger>
//             <TabsTrigger value="compliance" className="px-6">Compliance Docs</TabsTrigger>
//             <TabsTrigger value="hr" className="px-6">HR & Development</TabsTrigger>
//           </TabsList>

//           {/* TAB 1: PERSONAL & REFERENCES */}
//           <TabsContent value="profile" className="mt-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card className="border-[#e1dbd2] shadow-sm bg-white">
//                 <CardHeader className="border-b border-[#f7f2e9]"><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><User className="h-5 w-5" /> Personal Details</CardTitle></CardHeader>
//                 <CardContent className="pt-4 space-y-4">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div><p className="text-gray-400 text-xs uppercase font-bold">Date of Birth</p><p className="font-semibold text-gray-800">{employee.dob || "Nothing found"}</p></div>
//                     <div><p className="text-gray-400 text-xs uppercase font-bold">Contact Info</p><p className="font-semibold text-gray-800">{employee.contact_info || "Nothing found"}</p></div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-[#e1dbd2] shadow-sm bg-white">
//                 <CardHeader className="border-b border-[#f7f2e9]"><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><ShieldCheck className="h-5 w-5" /> References & Verification</CardTitle></CardHeader>
//                 <CardContent className="pt-4 space-y-4 text-sm">
//                   <div className="flex items-center justify-between p-2 rounded bg-[#f1f8f5]">
//                     <span className="font-medium text-[#123d2b]">Phone Verification</span>
//                     <Badge className={employee.refs_verified_by_phone ? "bg-green-600 text-black" : "bg-gray-200 text-black"}>
//                       {employee.refs_verified_by_phone ? "Verified" : "Nothing found"}
//                     </Badge>
//                   </div>
//                   <div>
//                     <p className="text-gray-400 text-xs uppercase font-bold">Verification Details</p>
//                     <p className="italic text-gray-700">{employee.verification_details || "Nothing found"}</p>
//                   </div>
//                   <div className="space-y-3 mt-2">
//                     <DocumentRow label={`Ref 1: ${employee.ref1_name || "N/A"}`} url={employee.ref1_doc_url} />
//                     <DocumentRow label={`Ref 2: ${employee.ref2_name || "N/A"}`} url={employee.ref2_doc_url} />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* TAB 2: COMPLIANCE */}
//           <TabsContent value="compliance" className="mt-6">
//             <Card className="border-[#e1dbd2] shadow-sm bg-white">
//               <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
//                 <div className="space-y-2">
//                   <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Identity & Rights</h3>
//                   <DocumentRow label="Photo ID" url={employee.photo_id_url} />
//                   <DocumentRow label="Evidence of Address" url={employee.evidence_address_url} />
//                   <DocumentRow label="Right to Work Check" url={employee.rtw_check_url} />
//                   <DocumentRow label="Insurance Document" url={employee.insurance_url} />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Checks & Applications</h3>
//                   <div className="p-3 border rounded-lg bg-[#fcfcfc] flex justify-between items-center mb-2">
//                     <div className="flex flex-col">
//                       <span className="text-[10px] text-gray-400 font-bold uppercase">DBS Number</span>
//                       <span className="text-sm font-bold text-[#123d2b]">{employee.dbs_number || "Nothing found"}</span>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-[10px] text-gray-400 font-bold uppercase">Completion</span>
//                       <p className="text-xs font-medium">{employee.dbs_completion_date || "Nothing found"}</p>
//                     </div>
//                   </div>
//                   <DocumentRow label="DBS Trace Risk Assessment" url={employee.dbs_trace_notes_url} />
//                   <DocumentRow label="Signed Application Form" url={employee.signed_app_url} />
//                   <DocumentRow label="Interview Notes" url={employee.interview_notes_url} />
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* TAB 3: HR & DEVELOPMENT */}
//           <TabsContent value="hr" className="mt-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card className="bg-white border-[#e1dbd2]">
//                 <CardHeader><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><GraduationCap className="h-5 w-5"/> Professional Development</CardTitle></CardHeader>
//                 <CardContent className="space-y-4">
//                   <DocumentRow label="Induction Checklist" url={employee.induction_checklist_url} />
//                   <DocumentRow label="Training Record" url={employee.training_record_url} />
//                   <div className="mt-4">
//                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Qualifications</h4>
//                     {employee.qualifications?.length > 0 ? (
//                       employee.qualifications.map((item, idx) => (
//                         <DocumentRow key={idx} label={item.name || "Unnamed Qualification"} url={item.url} />
//                       ))
//                     ) : <p className="text-xs text-gray-400 italic">Nothing found</p>}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white border-[#e1dbd2]">
//                 <CardHeader><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><ClipboardList className="h-5 w-5"/> Performance & Records</CardTitle></CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 gap-4 mb-4">
//                     <div className="p-3 border rounded bg-[#fcfcfc]">
//                       <p className="text-[10px] text-gray-400 font-bold uppercase">Last Appraisal</p>
//                       <p className="text-sm font-medium">{employee.last_appraisal_date || "Nothing found"}</p>
//                     </div>
//                   </div>
//                   <DocumentRow label="Appraisal Document" url={employee.appraisal_doc_url} />
//                   <div>
//                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Supervision History</h4>
//                     {employee.supervisions?.length > 0 ? (
//                       employee.supervisions.map((item, idx) => (
//                         <DocumentRow key={idx} label={`${item.name || "Name Recorded"} (${item.date})`} url={item.url} />
//                       ))
//                     ) : <p className="text-xs text-gray-400 italic">Nothing found</p>}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="bg-white border-[#e1dbd2]">
//               <CardHeader><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><Info className="h-5 w-5" /> Sickness & Miscellaneous</CardTitle></CardHeader>
//               <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                    <h4 className="text-xs font-bold text-gray-400 uppercase">Sickness & Disciplinary</h4>
//                    {employee.sickness_disciplinary_urls?.length > 0 ? (
//                     employee.sickness_disciplinary_urls.map((url, idx) => (
//                       <DocumentRow key={idx} label={`Record #${idx + 1}`} url={url} />
//                     ))
//                    ) : <p className="text-xs text-gray-400 italic">Nothing found</p>}
//                 </div>
//                 <div className="space-y-2">
//                    <h4 className="text-xs font-bold text-gray-400 uppercase">Other Documents</h4>
//                    {employee.other_documents?.length > 0 ? (
//                     employee.other_documents.map((item, idx) => (
//                       <DocumentRow key={idx} label={item.name || "Misc Document"} url={item.url} />
//                     ))
//                    ) : <p className="text-xs text-gray-400 italic">Nothing found</p>}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDetailView;


"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Download, FileText, User, 
  Briefcase, FileCheck, BookOpen, GraduationCap, History, 
  Loader2, Plus, Trash2, UploadCloud, Search
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const EmployeeDetailView = () => {
  const router = useRouter();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ fieldName: "", title: "", docName: "", file: null });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const { data, error } = await supabase.from("employees").select("*").eq("id", id).single();
      if (error) throw error;
      setEmployee(data);
    } catch (error) {
      toast.error("Could not fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  const openUploadModal = (fieldName, title) => {
    setUploadData({ fieldName, title, docName: "", file: null });
    setIsModalOpen(true);
  };

  const handleFileUpload = async () => {
    const { fieldName, docName, file } = uploadData;
    if (!docName || !file) return toast.error("Please provide both a name and a file.");

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${id}/${fieldName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("employee-docs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("employee-docs")
        .getPublicUrl(filePath);

      const newDoc = { name: docName, url: publicUrl };
      const updatedList = [...(employee[fieldName] || []), newDoc];

      const { error: dbError } = await supabase
        .from("employees")
        .update({ [fieldName]: updatedList })
        .eq("id", id);

      if (dbError) throw dbError;

      setEmployee({ ...employee, [fieldName]: updatedList });
      toast.success(`${docName} added successfully`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = async (fieldName, index) => {
    if (!confirm("Delete this document permanently?")) return;
    const newList = employee[fieldName].filter((_, i) => i !== index);
    try {
      const { error } = await supabase.from("employees").update({ [fieldName]: newList }).eq("id", id);
      if (error) throw error;
      setEmployee({ ...employee, [fieldName]: newList });
      toast.success("Document removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F5F5DC]">
      <Loader2 className="h-10 w-10 animate-spin text-black" />
    </div>
  );

  const DocumentList = ({ title, fieldName, icon: Icon }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-black uppercase tracking-widest">{title}</h3>
        </div>
        <Button 
          size="sm" 
          onClick={() => openUploadModal(fieldName, title)}
          className="bg-black text-[#F5F5DC] rounded-none hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4 mr-1" /> ADD DOCUMENT
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employee[fieldName]?.length > 0 ? (
          employee[fieldName].map((doc, i) => (
            <Card key={i} className="border-black/20 bg-white rounded-none hover:border-black transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-[#F5F5DC] p-2"><FileText className="h-5 w-5" /></div>
                  <div className="max-w-[180px]">
                    <p className="text-sm font-black text-black truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Verified File</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="hover:bg-black hover:text-[#F5F5DC] rounded-none" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /></a>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeDocument(fieldName, i)} className="text-red-600 hover:bg-red-600 hover:text-white rounded-none">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-black/10 text-gray-400">
             <UploadCloud className="h-10 w-10 mb-2 opacity-20 text-black" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Archive Empty</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-6 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b-4 border-black pb-6">
          <div className="space-y-4">
            <Button variant="outline" onClick={() => router.back()} className="border-black text-black hover:bg-black hover:text-[#F5F5DC] rounded-none font-bold">
              <ArrowLeft className="h-4 w-4 mr-2" /> BACK TO DIRECTORY
            </Button>
            <h1 className="text-6xl font-black uppercase italic leading-none tracking-tighter">{employee.full_name}</h1>
          </div>
          {/* <Badge className="bg-black text-[#F5F5DC] rounded-none px-6 py-2 text-xl font-black italic">ID: {id.slice(0,8)}</Badge> */}
        </div>

        <Tabs defaultValue="personal_records" className="w-full">
          <TabsList className="bg-black p-1 rounded-none w-full flex flex-wrap h-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {[
              { id: "personal_records", label: "Personal" },
              { id: "staff_documents", label: "Staff Records" },
              { id: "references_attachments", label: "References" },
              { id: "training_induction_records", label: "Training" },
              { id: "qualifications", label: "Quals" },
              { id: "supervisions", label: "Supervisions" },
              { id: "other_documents", label: "Miscellaneous" }
            ].map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex-1 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#F5F5DC] data-[state=active]:text-black text-white rounded-none py-3">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8 bg-white/40 p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
            <TabsContent value="personal_records"><DocumentList title="Personal Documents" fieldName="personal_records" icon={User} /></TabsContent>
            <TabsContent value="staff_documents"><DocumentList title="Staff Records" fieldName="staff_documents" icon={Briefcase} /></TabsContent>
            <TabsContent value="references_attachments"><DocumentList title="Reference Documents" fieldName="references_attachments" icon={FileCheck} /></TabsContent>
            <TabsContent value="training_induction_records"><DocumentList title="Training & Induction" fieldName="training_induction_records" icon={BookOpen} /></TabsContent>
            <TabsContent value="qualifications"><DocumentList title="Professional Qualifications" fieldName="qualifications" icon={GraduationCap} /></TabsContent>
            <TabsContent value="supervisions"><DocumentList title="Supervision Records" fieldName="supervisions" icon={History} /></TabsContent>
            <TabsContent value="other_documents"><DocumentList title="Other Relevant Documents" fieldName="other_documents" icon={FileText} /></TabsContent>
          </div>
        </Tabs>
      </div>

      {/* NEW UPLOAD MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#F5F5DC] border-4 border-black rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter border-b-2 border-black pb-2">
              New Upload: {uploadData.title}
            </DialogTitle>
            <DialogDescription className="text-black font-bold text-xs uppercase pt-2">
              Fill in the metadata for the electronic filing system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Document Title</Label>
              <Input 
                placeholder="e.g. Passport Copy 2024"
                className="rounded-none border-2 border-black bg-white focus:ring-0"
                value={uploadData.docName}
                onChange={(e) => setUploadData({...uploadData, docName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Select File</Label>
              <div className="border-2 border-dashed border-black bg-white p-4 text-center relative cursor-pointer hover:bg-zinc-50 transition-colors">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                />
                {uploadData.file ? (
                  <p className="text-xs font-bold text-green-700 truncate">{uploadData.file.name}</p>
                ) : (
                  <p className="text-[10px] font-black uppercase text-gray-400">Click to browse or drop file</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="rounded-none border-black border-2 font-black uppercase text-xs"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleFileUpload}
              disabled={isUploading}
              className="rounded-none bg-black text-[#F5F5DC] hover:bg-zinc-800 font-black uppercase text-xs px-8"
            >
              {isUploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
              Begin Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDetailView;