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
  Loader2, Plus, Trash2, UploadCloud, ExternalLink, AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import Link from "next/link";

const EmployeeDetailView = () => {
  const router = useRouter();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ fieldName: "", title: "", docName: "", file: null });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted || loading) return (
    <div className="p-20 text-center font-medium font-sans">
      <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-[#1f6b4a]" />
      Loading Employee Profile...
    </div>
  );

  const DocumentList = ({ title, fieldName, icon: Icon }) => (
    <Card className="border-[#e1dbd2] shadow-sm">
      <CardHeader className="border-b border-[#f7f2e9] flex flex-row items-center justify-between py-4">
        <CardTitle className="text-md flex items-center gap-2 text-[#123d2b]">
          <Icon className="h-5 w-5" /> {title}
        </CardTitle>
        <Button 
          size="sm" 
          onClick={() => openUploadModal(fieldName, title)}
          className="bg-black text-white hover:bg-[#123d2b] h-8 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" /> ADD DOCUMENT
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employee[fieldName]?.length > 0 ? (
            employee[fieldName].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#e1dbd2] rounded-lg shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-5 w-5 text-[#1f6b4a] shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Verified File</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1f6b4a] hover:underline bg-[#f1f8f5] px-2 py-1 rounded"
                  >
                    VIEW <ExternalLink className="h-3 w-3" />
                  </a>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeDocument(fieldName, i)} 
                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-[#e1dbd2] rounded-xl text-gray-400">
               <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
               <p className="text-xs font-medium italic">No documents found in this category</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 min-h-screen font-sans ">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={() => router.back()} className="text-black hover:bg-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Safer Recruitment
        </Button>
                  <Link href={`/service-users/${id}/edit`}>
                    <Button onClick={() => router.push(`/hrList/${id}/edit`)} className="bg-black text-white hover:bg-[#123d2b] px-6">
            Edit Employee
          </Button>
                  </Link>
                </div>

        {/* HEADER */}
        <div className="bg-[#f5f0e6] text-black p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <h1 className="text-3xl font-bold text-black">{employee.full_name}</h1>
                      {/* <p className="text-emerald-100/70 flex items-center gap-2 mt-1">
                        <Calendar size={14} /> Registered: {new Date(userData.created_at).toLocaleDateString()}
                      </p> */}
                    </div>
                  </div>
                  <Badge className=" text-white px-4 py-2 text-lg">Active Employee</Badge>
                </div>
        

        <Tabs defaultValue="personal_records" className="w-full">
          {/* <TabsList className="bg-white border-[#e1dbd2] p-1 h-12 shadow-sm overflow-x-auto justify-start md:justify-center">
            {[
              { id: "personal_records", label: "Personal" },
              { id: "staff_documents", label: "Staff Records" },
              { id: "references_attachments", label: "References" },
              { id: "training_induction_records", label: "Training" },
              { id: "qualifications", label: "Qualifications" },
              { id: "supervisions", label: "Supervisions" },
              { id: "other_documents", label: "Miscellaneous" }
            ].map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="px-4 text-xs font-bold uppercase tracking-tight">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList> */}

          <TabsList className="bg-[#e8e1d6] p-1 border border-[#e1dbd2] overflow-x-auto justify-start h-auto">
  {[
    { id: "personal_records", label: "Personal" },
    { id: "staff_documents", label: "Staff Records" },
    { id: "references_attachments", label: "References" },
    { id: "training_induction_records", label: "Training" },
    { id: "qualifications", label: "Qualifications" },
    { id: "supervisions", label: "Supervisions" },
    { id: "other_documents", label: "Miscellaneous" }
  ].map((tab) => (
    <TabsTrigger 
      key={tab.id} 
      value={tab.id} 
      className="px-4 text-xs font-bold uppercase tracking-tight data-[state=active]:bg-black data-[state=active]:text-white"
    >
      {tab.label}
    </TabsTrigger>
  ))}
</TabsList>

          <div className="mt-6">
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

      {/* UPLOAD MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border-[#e1dbd2]">
          <DialogHeader>
            <DialogTitle className="text-black">Upload to {uploadData.title}</DialogTitle>
            <DialogDescription>
              Enter a name for this record and select the file to upload.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase">Document Name</Label>
              <Input 
                placeholder="e.g. Passport Copy 2024"
                className="border-[#e1dbd2] focus:border-[#1f6b4a] focus:ring-[#1f6b4a]"
                value={uploadData.docName}
                onChange={(e) => setUploadData({...uploadData, docName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase">File Selection</Label>
              <div className="border-2 border-dashed border-[#e1dbd2] rounded-lg p-6 text-center relative hover:bg-gray-50 transition-colors">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.xlsx,image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                />
                {uploadData.file ? (
                  <div className="flex items-center justify-center gap-2 text-[#1f6b4a] font-semibold">
                    <FileCheck className="h-5 w-5" />
                    <span className="text-sm truncate max-w-[200px]">{uploadData.file.name}</span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <UploadCloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Click or drag file to upload</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleFileUpload}
              disabled={isUploading}
              className="bg-[#1f6b4a] hover:bg-[#123d2b]"
            >
              {isUploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDetailView;