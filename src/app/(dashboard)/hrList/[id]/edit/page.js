// // "use client"

// // import React, { useState, useEffect } from 'react';
// // import { useParams, useRouter } from "next/navigation";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Slider } from "@/components/ui/slider";
// // import { Button } from "@/components/ui/button";
// // import { User, ShieldCheck, FileText, Calendar, ArrowLeft } from "lucide-react";
// // import { toast } from "sonner";

// // export default function EditEmployeePage() {
// //   const params = useParams();
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);

// //   // In a real app, you would fetch this data using params.id
// //   const [formData, setFormData] = useState({
// //     name: "James Okonkwo",
// //     role: "Property Manager",
// //     org: "south-london",
// //     dbsStatus: "expiring",
// //     safeguarding: "compliant",
// //     trainingProgress: 78,
// //     employmentStatus: "employed",
// //     contractExpiry: "2026-06-30",
// //     lastActive: "2026-03-08"
// //   });

// //   const handleSave = (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     // Simulate API update
// //     setTimeout(() => {
// //       setLoading(false);
// //       toast.success("Employee record updated successfully");
// //       router.push(`/dashboard/employees/${params.id}`);
// //     }, 800);
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8 flex flex-col items-center">
// //       {/* Back Button */}
// //       <div className="w-full max-w-2xl mb-4">
// //         <Button
// //           variant="ghost"
// //           onClick={() => router.back()}
// //           className="text-[#123d2b] hover:bg-[#ece7df] gap-2"
// //         >
// //           <ArrowLeft className="w-4 h-4" /> Back to Profile
// //         </Button>
// //       </div>

// //       <Card className="w-full max-w-2xl bg-[#fbf8f2] border-[#e1dbd2] shadow-lg">
// //         <CardHeader className="border-b border-[#e1dbd2] mb-6">
// //           <CardTitle className="text-[#123d2b] text-2xl flex items-center gap-2">
// //             <User className="w-6 h-6" />
// //             Employee Management
// //           </CardTitle>
// //           <CardDescription className="text-[#6b7d74]">
// //             {/* Updating records for ID: {full_name}. Ensure all compliance documents are verified. */}
// //             Hello
// //           </CardDescription>
// //         </CardHeader>

// //         <Tabs defaultValue="basic" className="w-full px-2 md:px-6">
// //           <TabsList className="grid w-full grid-cols-3 bg-[#ece7df] rounded-lg p-1">
// //             <TabsTrigger
// //               value="basic"
// //               className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
// //             >
// //               Basic Info
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="compliance"
// //               className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
// //             >
// //               Compliance
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="contract"
// //               className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
// //             >
// //               Contract
// //             </TabsTrigger>
// //           </TabsList>

// //           {/* --- Basic Information --- */}
// //           <TabsContent value="basic" className="space-y-4 py-4">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="name" className="text-[#123d2b] font-medium">Full Name</Label>
// //                 <Input
// //                   id="name"
// //                   value={formData.name}
// //                   onChange={(e) => setFormData({...formData, name: e.target.value})}
// //                   placeholder="e.g. James Okonkwo"
// //                   className="border-[#e1dbd2] focus:ring-[#1f6b4a] bg-white"
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="role" className="text-[#123d2b] font-medium">Role</Label>
// //                 <Input
// //                   id="role"
// //                   value={formData.role}
// //                   onChange={(e) => setFormData({...formData, role: e.target.value})}
// //                   placeholder="e.g. Property Manager"
// //                   className="border-[#e1dbd2] focus:ring-[#1f6b4a] bg-white"
// //                 />
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="org" className="text-[#123d2b] font-medium">Organisation</Label>
// //               <Select
// //                 value={formData.org}
// //                 onValueChange={(val) => setFormData({...formData, org: val})}
// //               >
// //                 <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
// //                   <SelectValue placeholder="Select Organisation" />
// //                 </SelectTrigger>
// //                 <SelectContent className="bg-[#fbf8f2]">
// //                   <SelectItem value="kenley">Kenley Housing Group</SelectItem>
// //                   <SelectItem value="croydon">Croydon Support Services</SelectItem>
// //                   <SelectItem value="south-london">South London Care Ltd</SelectItem>
// //                   <SelectItem value="bromley">Bromley Homes CIC</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           </TabsContent>

// //           {/* --- Compliance & Training --- */}
// //           <TabsContent value="compliance" className="space-y-6 py-4">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label className="text-[#123d2b] font-medium flex items-center gap-2">
// //                   <ShieldCheck className="w-4 h-4" /> DBS Status
// //                 </Label>
// //                 <Select
// //                   value={formData.dbsStatus}
// //                   onValueChange={(val) => setFormData({...formData, dbsStatus: val})}
// //                 >
// //                   <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
// //                     <SelectValue placeholder="Status" />
// //                   </SelectTrigger>
// //                   <SelectContent className="bg-[#fbf8f2]">
// //                     <SelectItem value="compliant">Compliant</SelectItem>
// //                     <SelectItem value="expiring">Expiring</SelectItem>
// //                     <SelectItem value="non-compliant">Non-Compliant</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <div className="space-y-2">
// //                 <Label className="text-[#123d2b] font-medium">Safeguarding</Label>
// //                 <Select
// //                   value={formData.safeguarding}
// //                   onValueChange={(val) => setFormData({...formData, safeguarding: val})}
// //                 >
// //                   <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
// //                     <SelectValue placeholder="Status" />
// //                   </SelectTrigger>
// //                   <SelectContent className="bg-[#fbf8f2]">
// //                     <SelectItem value="compliant">Compliant</SelectItem>
// //                     <SelectItem value="expiring">Expiring</SelectItem>
// //                     <SelectItem value="non-compliant">Non-Compliant</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>

// //             <div className="space-y-4 pt-2">
// //               <div className="flex justify-between">
// //                 <Label className="text-[#123d2b] font-medium">Training Progress</Label>
// //                 <span className="text-[#1f6b4a] font-bold">{formData.trainingProgress}%</span>
// //               </div>
// //               <Slider
// //                 value={[formData.trainingProgress]}
// //                 onValueChange={(val) => setFormData({...formData, trainingProgress: val[0]})}
// //                 max={100}
// //                 step={1}
// //                 className="[&_[role=slider]]:bg-[#1f6b4a]"
// //               />
// //               <p className="text-xs text-[#6b7d74]">Manual override for mandatory module completion.</p>
// //             </div>
// //           </TabsContent>

// //           {/* --- Contract details --- */}
// //           <TabsContent value="contract" className="space-y-4 py-4">
// //             <div className="space-y-2">
// //               <Label className="text-[#123d2b] font-medium">Employment Status</Label>
// //               <Select
// //                 value={formData.employmentStatus}
// //                 onValueChange={(val) => setFormData({...formData, employmentStatus: val})}
// //               >
// //                 <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
// //                   <SelectValue placeholder="Current Status" />
// //                 </SelectTrigger>
// //                 <SelectContent className="bg-[#fbf8f2]">
// //                   <SelectItem value="employed">Employed</SelectItem>
// //                   <SelectItem value="on-leave">On Leave</SelectItem>
// //                   <SelectItem value="suspended">Suspended</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
// //               <div className="space-y-2">
// //                 <Label htmlFor="expiry" className="text-[#123d2b] font-medium flex items-center gap-2">
// //                   <Calendar className="w-4 h-4" /> Contract Expiry
// //                 </Label>
// //                 <Input
// //                   id="expiry"
// //                   type="date"
// //                   value={formData.contractExpiry}
// //                   onChange={(e) => setFormData({...formData, contractExpiry: e.target.value})}
// //                   className="border-[#e1dbd2] bg-white text-[#123d2b]"
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="last-active" className="text-[#123d2b] font-medium">Last Active Date</Label>
// //                 <Input
// //                   id="last-active"
// //                   type="date"
// //                   value={formData.lastActive}
// //                   onChange={(e) => setFormData({...formData, lastActive: e.target.value})}
// //                   className="border-[#e1dbd2] bg-white text-[#123d2b]"
// //                 />
// //               </div>
// //             </div>
// //           </TabsContent>
// //         </Tabs>

// //         <CardFooter className="flex justify-end gap-3 border-t border-[#e1dbd2] mt-6 pt-6">
// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={() => router.back()}
// //             className="border-[#e1dbd2] text-[#123d2b] hover:bg-[#ece7df]"
// //           >
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleSave}
// //             disabled={loading}
// //             className="bg-[#1f6b4a] text-[#f7f2e9] hover:bg-[#15573c] min-w-[140px]"
// //           >
// //             {loading ? "Saving..." : "Save Employee Record"}
// //           </Button>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // }

// // "use client";

// // import React, { useState, useEffect, use } from "react";
// // import { useRouter } from "next/navigation";
// // import { supabase } from "@/lib/superbase/client";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// //   CardFooter,
// // } from "@/components/ui/card";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Slider } from "@/components/ui/slider";
// // import { Button } from "@/components/ui/button";
// // import {
// //   User,
// //   ShieldCheck,
// //   FileText,
// //   Calendar,
// //   ArrowLeft,
// //   Plus,
// //   Trash2,
// //   Loader2,
// //   Upload,
// //   CheckCircle2,
// //   Camera,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// // export default function EditEmployeePage({ params }) {
// //   const resolvedParams = use(params);
// //   const employeeId = resolvedParams.id;
// //   const router = useRouter();

// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [uploading, setUploading] = useState(null);

// //   const [formData, setFormData] = useState({
// //     full_name: "",
// //     role: "",
// //     avatar_url: "", // New Field for Picture
// //     status: "Employed",
// //     induction_status: "Pending",
// //     induction_date: "",
// //     training_score: 0,
// //     contract_expiry: "",
// //     contract_url: "",
// //     dbs_check_number: "",
// //     dbs_certificate_url: "",
// //     police_check_url: "",
// //     reference_1: { name: "", email: "", url: "" },
// //     reference_2: { name: "", email: "", url: "" },
// //     additional_docs: [],
// //   });

// //   useEffect(() => {
// //     fetchEmployeeData();
// //   }, [employeeId]);

// //   const fetchEmployeeData = async () => {
// //     const { data, error } = await supabase
// //       .from("profiles")
// //       .select(`*, hr_documents (*)`)
// //       .eq("id", employeeId)
// //       .single();

// //     if (error) {
// //       toast.error("Employee not found");
// //       router.push("/hrList");
// //     } else {
// //       const hr = data.hr_documents || {};
// //       setFormData({
// //         full_name: data.full_name || "",
// //         role: data.role || "",
// //         avatar_url: data.avatar_url || "",
// //         status: data.status || "Employed",
// //         ...hr,
// //         reference_1: hr.reference_1 || { name: "", email: "", url: "" },
// //         reference_2: hr.reference_2 || { name: "", email: "", url: "" },
// //         additional_docs: hr.additional_docs || [],
// //       });
// //     }
// //     setLoading(false);
// //   };

// //   const handleFileUpload = async (e, field, isArray = false, index = null) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setUploading(field + (index ?? ""));
// //     const fileExt = file.name.split(".").pop();
// //     const fileName = `${employeeId}/${field}-${Date.now()}.${fileExt}`;

// //     // Note: Profiles/avatars could go in a different bucket,
// //     // but using 'hr-documents' for simplicity here.
// //     const { error: uploadError } = await supabase.storage
// //       .from("hr-documents")
// //       .upload(fileName, file);

// //     if (uploadError) {
// //       toast.error("Upload failed");
// //     } else {
// //       const { data } = supabase.storage
// //         .from("hr-documents")
// //         .getPublicUrl(fileName);
// //       const url = data.publicUrl;

// //       if (isArray) {
// //         const newDocs = [...formData.additional_docs];
// //         newDocs[index].url = url;
// //         setFormData({ ...formData, additional_docs: newDocs });
// //       } else if (field.startsWith("reference_")) {
// //         setFormData({ ...formData, [field]: { ...formData[field], url } });
// //       } else {
// //         setFormData({ ...formData, [field]: url });
// //       }
// //       toast.success(field === "avatar_url" ? "Photo updated" : "File uploaded");
// //     }
// //     setUploading(null);
// //   };

// //   const handleSave = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);

// //     const { error: pError } = await supabase
// //       .from("profiles")
// //       .update({
// //         full_name: formData.full_name,
// //         role: formData.role,
// //         status: formData.status,
// //         avatar_url: formData.avatar_url,
// //       })
// //       .eq("id", employeeId);

// //     const { error: hrError } = await supabase.from("hr_documents").upsert({
// //       id: employeeId,
// //       contract_url: formData.contract_url,
// //       contract_expiry: formData.contract_expiry,
// //       dbs_check_number: formData.dbs_check_number,
// //       dbs_certificate_url: formData.dbs_certificate_url,
// //       police_check_url: formData.police_check_url,
// //       induction_status: formData.induction_status,
// //       induction_date: formData.induction_date,
// //       training_score: formData.training_score,
// //       reference_1: formData.reference_1,
// //       reference_2: formData.reference_2,
// //       additional_docs: formData.additional_docs,
// //     });

// //     if (pError || hrError) toast.error("Save failed");
// //     else {
// //       toast.success("Record updated");
// //       router.push("/hrList");
// //     }
// //     setSaving(false);
// //   };

// //   if (loading)
// //     return (
// //       <div className="h-screen flex items-center justify-center bg-[#f5f0e6]">
// //         <Loader2 className="animate-spin text-[#1f6b4a]" />
// //       </div>
// //     );

// //   return (
// //     <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8 flex flex-col items-center">
// //       {/* Header Info */}
// //       <div className="w-full max-w-3xl mb-6 flex justify-between items-center">
// //         <Button
// //           variant="ghost"
// //           onClick={() => router.back()}
// //           className="text-[#123d2b] hover:bg-[#ece7df] gap-2"
// //         >
// //           <ArrowLeft className="w-4 h-4" /> Back to Profile
// //         </Button>
// //       </div>

// //       <Card className="w-full max-w-3xl bg-[#fbf8f2] border-[#e1dbd2] shadow-lg">
// //         <CardHeader className="border-b border-[#e1dbd2] pb-8">
// //           <div className="flex flex-col md:flex-row items-center gap-6">
// //             {/* PROFILE PICTURE SECTION */}
// //             <div className="relative group">
// //               <Avatar className="w-32 h-32 border-4 border-white shadow-md">
// //                 <AvatarImage
// //                   src={formData.avatar_url}
// //                   className="object-cover"
// //                 />
// //                 <AvatarFallback className="bg-[#ece7df] text-[#123d2b] text-2xl">
// //                   {formData.full_name
// //                     ?.split(" ")
// //                     .map((n) => n[0])
// //                     .join("")}
// //                 </AvatarFallback>
// //               </Avatar>
// //               <label
// //                 htmlFor="avatar-upload"
// //                 className="absolute bottom-0 right-0 p-2 bg-[#1f6b4a] rounded-full text-white cursor-pointer shadow-lg hover:bg-[#15573c] transition-colors"
// //               >
// //                 {uploading === "avatar_url" ? (
// //                   <Loader2 className="w-5 h-5 animate-spin" />
// //                 ) : (
// //                   <Camera className="w-5 h-5" />
// //                 )}
// //                 <input
// //                   type="file"
// //                   id="avatar-upload"
// //                   className="hidden"
// //                   accept="image/*"
// //                   onChange={(e) => handleFileUpload(e, "avatar_url")}
// //                 />
// //               </label>
// //             </div>

// //             <div className="text-center md:text-left space-y-1">
// //               <CardTitle className="text-[#123d2b] text-3xl">
// //                 {formData.full_name || "New Employee"}
// //               </CardTitle>
// //               <CardDescription className="text-[#6b7d74] text-lg font-medium">
// //                 Managing credentials for {formData.role || "Staff Member"}
// //               </CardDescription>
// //             </div>
// //           </div>
// //         </CardHeader>

// //         <Tabs defaultValue="basic" className="p-6">
// //           <TabsList className="grid w-full grid-cols-3 bg-[#ece7df] rounded-lg p-1 mb-8">
// //             <TabsTrigger
// //               value="basic"
// //               className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
// //             >
// //               Basic Info
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="compliance"
// //               className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
// //             >
// //               Compliance
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="docs"
// //               className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
// //             >
// //               Documents
// //             </TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="basic" className="space-y-6">
// //             <div className="grid md:grid-cols-2 gap-6">
// //               <div className="space-y-2">
// //                 <Label className="text-[#123d2b]">Full Name</Label>
// //                 <Input
// //                   className="bg-white border-[#e1dbd2] focus:ring-[#1f6b4a]"
// //                   value={formData.full_name}
// //                   onChange={(e) =>
// //                     setFormData({ ...formData, full_name: e.target.value })
// //                   }
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label className="text-[#123d2b]">Job Role</Label>
// //                 <Input
// //                   className="bg-white border-[#e1dbd2] focus:ring-[#1f6b4a]"
// //                   value={formData.role}
// //                   onChange={(e) =>
// //                     setFormData({ ...formData, role: e.target.value })
// //                   }
// //                 />
// //               </div>
// //             </div>
// //             <div className="grid md:grid-cols-2 gap-6">
// //               <div className="space-y-2">
// //                 <Label className="text-[#123d2b]">Induction Date</Label>
// //                 <Input
// //                   type="date"
// //                   className="bg-white"
// //                   value={formData.induction_date}
// //                   onChange={(e) =>
// //                     setFormData({ ...formData, induction_date: e.target.value })
// //                   }
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label className="text-[#123d2b]">Induction Status</Label>
// //                 <Select
// //                   value={formData.induction_status}
// //                   onValueChange={(v) =>
// //                     setFormData({ ...formData, induction_status: v })
// //                   }
// //                 >
// //                   <SelectTrigger className="bg-white border-[#e1dbd2]">
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent className="bg-[#fbf8f2]">
// //                     <SelectItem value="Pending">Pending</SelectItem>
// //                     <SelectItem value="Completed">Completed</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>
// //           </TabsContent>

// //           <TabsContent value="compliance" className="space-y-8">
// //             <div className="grid md:grid-cols-2 gap-6">
// //               <div className="space-y-4 p-5 border border-[#e1dbd2] rounded-xl bg-white shadow-sm">
// //                 <Label className="font-bold text-[#123d2b] flex items-center gap-2">
// //                   <ShieldCheck className="w-5 h-5 text-[#1f6b4a]" /> DBS Check
// //                 </Label>
// //                 <Input
// //                   placeholder="Certificate Number"
// //                   className="bg-[#f5f0e6]/30"
// //                   value={formData.dbs_check_number}
// //                   onChange={(e) =>
// //                     setFormData({
// //                       ...formData,
// //                       dbs_check_number: e.target.value,
// //                     })
// //                   }
// //                 />
// //                 <div className="relative">
// //                   <Input
// //                     type="file"
// //                     className="hidden"
// //                     id="dbs-file"
// //                     onChange={(e) => handleFileUpload(e, "dbs_certificate_url")}
// //                   />
// //                   <Button
// //                     asChild
// //                     variant="outline"
// //                     className="w-full border-[#e1dbd2] hover:bg-[#e6f2ec] hover:text-[#15573c]"
// //                   >
// //                     <label htmlFor="dbs-file" className="cursor-pointer">
// //                       {uploading === "dbs_certificate_url" ? (
// //                         <Loader2 className="animate-spin" />
// //                       ) : formData.dbs_certificate_url ? (
// //                         <CheckCircle2 className="text-[#2FA36B] mr-2" />
// //                       ) : (
// //                         <Upload className="mr-2 w-4 h-4" />
// //                       )}
// //                       {formData.dbs_certificate_url
// //                         ? "Change Certificate"
// //                         : "Upload Certificate"}
// //                     </label>
// //                   </Button>
// //                 </div>
// //               </div>

// //               <div className="space-y-4 p-5 border border-[#e1dbd2] rounded-xl bg-white shadow-sm flex flex-col justify-between">
// //                 <Label className="font-bold text-[#123d2b]">Police Check</Label>
// //                 <p className="text-xs text-[#6b7d74]">
// //                   Required for international staff or specific roles.
// //                 </p>
// //                 <Input
// //                   type="file"
// //                   className="hidden"
// //                   id="police-file"
// //                   onChange={(e) => handleFileUpload(e, "police_check_url")}
// //                 />
// //                 <Button
// //                   asChild
// //                   variant="outline"
// //                   className="border-[#e1dbd2] hover:bg-[#e6f2ec]"
// //                 >
// //                   <label htmlFor="police-file" className="cursor-pointer">
// //                     {formData.police_check_url ? (
// //                       <CheckCircle2 className="text-[#2FA36B] mr-2" />
// //                     ) : (
// //                       <Upload className="mr-2 w-4 h-4" />
// //                     )}
// //                     Upload Police Check
// //                   </label>
// //                 </Button>
// //               </div>
// //             </div>

// //             {/* <div className="p-6 border border-[#e1dbd2] rounded-xl bg-white shadow-sm space-y-6">
// //               <div className="flex justify-between items-center">
// //                 <Label className="text-[#123d2b] font-bold">Mandatory Training Completion</Label>
// //                 <span className="bg-[#e6f2ec] text-[#15573c] px-3 py-1 rounded-full text-sm font-bold">{formData.training_score}%</span>
// //               </div>
// //               <Slider value={[formData.training_score]} onValueChange={v => setFormData({...formData, training_score: v[0]})} max={100} className="[&_[role=slider]]:bg-[#1f6b4a]" />
// //             </div> */}

// //             <div className="p-6 border border-[#e1dbd2] rounded-xl bg-white shadow-sm space-y-6">
// //               <div className="flex justify-between items-center">
// //                 <Label className="text-[#123d2b] font-bold">
// //                   Mandatory Training Completion
// //                 </Label>
// //                 {/* Explicitly show the value from state */}
// //                 <span className="bg-[#e6f2ec] text-[#15573c] px-3 py-1 rounded-full text-sm font-bold">
// //                   {formData.training_score}%
// //                 </span>
// //               </div>
// //               <Slider
// //                 // Ensure the value is passed as an array [number]
// //                 value={[formData.training_score || 0]}
// //                 // Take the first item of the array returned by the slider
// //                 onValueChange={(value) =>
// //                   setFormData({ ...formData, training_score: value[0] })
// //                 }
// //                 max={100}
// //                 step={1}
// //                 className="[&_[role=slider]]:bg-[#1f6b4a]"
// //               />
// //             </div>
// //           </TabsContent>

// //           <TabsContent value="docs" className="space-y-8">
// //             <div className="p-5 border border-[#e1dbd2] rounded-xl bg-white shadow-sm space-y-4">
// //               <Label className="font-bold text-[#123d2b]">
// //                 Employment Contract
// //               </Label>
// //               <div className="grid md:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <span className="text-xs text-[#6b7d74]">Expiry Date</span>
// //                   <Input
// //                     type="date"
// //                     className="bg-white"
// //                     value={formData.contract_expiry}
// //                     onChange={(e) =>
// //                       setFormData({
// //                         ...formData,
// //                         contract_expiry: e.target.value,
// //                       })
// //                     }
// //                   />
// //                 </div>
// //                 <div className="flex flex-col justify-end">
// //                   <label className="cursor-pointer border-2 border-dashed border-[#e1dbd2] rounded-lg flex items-center justify-center p-3 hover:bg-[#f5f0e6] transition-colors">
// //                     <input
// //                       type="file"
// //                       className="hidden"
// //                       onChange={(e) => handleFileUpload(e, "contract_url")}
// //                     />
// //                     {formData.contract_url ? (
// //                       <CheckCircle2 className="text-[#2FA36B] mr-2" />
// //                     ) : (
// //                       <Upload className="mr-2 w-4 h-4 text-[#1f6b4a]" />
// //                     )}
// //                     <span className="text-sm">
// //                       {formData.contract_url
// //                         ? "Contract Uploaded"
// //                         : "Upload Signed PDF"}
// //                     </span>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="grid md:grid-cols-2 gap-6">
// //               {["reference_1", "reference_2"].map((ref, i) => (
// //                 <div
// //                   key={ref}
// //                   className="p-5 border border-[#e1dbd2] rounded-xl bg-white shadow-sm space-y-3"
// //                 >
// //                   <p className="font-bold text-[#123d2b] text-sm border-b pb-2 mb-2">
// //                     Reference Contact {i + 1}
// //                   </p>
// //                   <Input
// //                     placeholder="Full Name"
// //                     className="bg-[#f5f0e6]/20"
// //                     value={formData[ref].name}
// //                     onChange={(e) =>
// //                       setFormData({
// //                         ...formData,
// //                         [ref]: { ...formData[ref], name: e.target.value },
// //                       })
// //                     }
// //                   />
// //                   <Input
// //                     placeholder="Email Address"
// //                     className="bg-[#f5f0e6]/20"
// //                     value={formData[ref].email}
// //                     onChange={(e) =>
// //                       setFormData({
// //                         ...formData,
// //                         [ref]: { ...formData[ref], email: e.target.value },
// //                       })
// //                     }
// //                   />
// //                   <label className="cursor-pointer border border-[#ece7df] rounded-md flex items-center justify-center p-2 text-xs hover:bg-[#f5f0e6]">
// //                     <input
// //                       type="file"
// //                       className="hidden"
// //                       onChange={(e) => handleFileUpload(e, ref)}
// //                     />
// //                     {formData[ref].url ? (
// //                       <CheckCircle2 className="text-[#2FA36B] mr-2 w-3 h-3" />
// //                     ) : (
// //                       <Upload className="mr-2 w-3 h-3" />
// //                     )}
// //                     {formData[ref].url
// //                       ? "File Attached"
// //                       : "Attach Reference Letter"}
// //                   </label>
// //                 </div>
// //               ))}
// //             </div>

// //             <div className="space-y-4">
// //               <div className="flex justify-between items-center">
// //                 <Label className="text-[#123d2b] font-bold text-lg">
// //                   Other Verified Documents
// //                 </Label>
// //                 <Button
// //                   size="sm"
// //                   className="bg-[#1f6b4a] hover:bg-[#15573c] text-white"
// //                   onClick={() =>
// //                     setFormData({
// //                       ...formData,
// //                       additional_docs: [
// //                         ...formData.additional_docs,
// //                         { name: "", url: "" },
// //                       ],
// //                     })
// //                   }
// //                 >
// //                   <Plus className="w-4 h-4 mr-1" /> Add New
// //                 </Button>
// //               </div>
// //               {formData.additional_docs.map((doc, idx) => (
// //                 <div
// //                   key={idx}
// //                   className="flex gap-3 bg-white p-3 border border-[#e1dbd2] rounded-xl shadow-sm items-center"
// //                 >
// //                   <Input
// //                     placeholder="Document Name (e.g. Passport)"
// //                     className="flex-1 bg-white"
// //                     value={doc.name}
// //                     onChange={(e) => {
// //                       const d = [...formData.additional_docs];
// //                       d[idx].name = e.target.value;
// //                       setFormData({ ...formData, additional_docs: d });
// //                     }}
// //                   />
// //                   <label className="cursor-pointer p-2 border border-[#e1dbd2] rounded-lg hover:bg-[#f5f0e6]">
// //                     <input
// //                       type="file"
// //                       className="hidden"
// //                       onChange={(e) =>
// //                         handleFileUpload(e, "additional_docs", true, idx)
// //                       }
// //                     />
// //                     {doc.url ? (
// //                       <CheckCircle2 className="text-[#2FA36B]" />
// //                     ) : (
// //                       <Upload className="w-5 h-5 text-[#1f6b4a]" />
// //                     )}
// //                   </label>
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     onClick={() =>
// //                       setFormData({
// //                         ...formData,
// //                         additional_docs: formData.additional_docs.filter(
// //                           (_, i) => i !== idx,
// //                         ),
// //                       })
// //                     }
// //                   >
// //                     <Trash2 className="w-5 h-5 text-[#dc2626]" />
// //                   </Button>
// //                 </div>
// //               ))}
// //             </div>
// //           </TabsContent>
// //         </Tabs>

// //         <CardFooter className="border-t border-[#e1dbd2] pt-8 px-6 pb-8 gap-4">
// //           <Button
// //             variant="outline"
// //             className="border-[#e1dbd2] text-[#123d2b] hover:bg-[#ece7df]"
// //             onClick={() => router.back()}
// //           >
// //             Cancel Changes
// //           </Button>
// //           <Button
// //             onClick={handleSave}
// //             disabled={saving}
// //             className="bg-[#1f6b4a] text-[#f7f2e9] hover:bg-[#15573c] flex-1 font-bold text-lg shadow-md transition-all active:scale-[0.98]"
// //           >
// //             {saving ? (
// //               <Loader2 className="animate-spin mr-2" />
// //             ) : (
// //               "Save All Records"
// //             )}
// //           </Button>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // }


// "use client";

// import React, { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/superbase/client";
// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   ShieldCheck,
//   ArrowLeft,
//   Plus,
//   Trash2,
//   Loader2,
//   Upload,
//   CheckCircle2,
//   Camera,
//   GraduationCap,
//   AlertTriangle,
//   FileText
// } from "lucide-react";
// import { toast } from "sonner";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export default function EditEmployeePage({ params }) {
//   const resolvedParams = use(params);
//   const employeeId = resolvedParams.id;
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(null);

//   const [formData, setFormData] = useState({
//     full_name: "",
//     role: "",
//     avatar_url: "",
//     status: "Employed",
//     induction_status: "Pending",
//     induction_date: "",
//     training_score: 0,
//     contract_expiry: "",
//     contract_url: "",
//     dbs_check_number: "",
//     dbs_certificate_url: "",
//     police_check_url: "",
//     reference_1: { name: "", email: "", url: "" },
//     reference_2: { name: "", email: "", url: "" },
//     additional_docs: [],
//   });

//   useEffect(() => {
//     if (employeeId) fetchEmployeeData();
//   }, [employeeId]);

//   const fetchEmployeeData = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select(`*, hr_documents (*)`)
//         .eq("id", employeeId)
//         .single();

//       if (error) throw error;

//       const hr = data.hr_documents || {};
      
//       setFormData({
//         full_name: data.full_name || "",
//         role: data.role || "",
//         avatar_url: data.avatar_url || "",
//         status: data.status || "Employed",
//         induction_status: hr.induction_status || "Pending",
//         induction_date: hr.induction_date || "",
//         training_score: hr.training_score || 0,
//         contract_expiry: hr.contract_expiry || "",
//         contract_url: hr.contract_url || "",
//         dbs_check_number: hr.dbs_check_number || "",
//         dbs_certificate_url: hr.dbs_certificate_url || "",
//         police_check_url: hr.police_check_url || "",
//         reference_1: hr.reference_1 || { name: "", email: "", url: "" },
//         reference_2: hr.reference_2 || { name: "", email: "", url: "" },
//         additional_docs: hr.additional_docs || [],
//       });
//     } catch (err) {
//       toast.error("Employee not found");
//       router.push("/hrList");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * IMMEDIATE SYNC HELPER
//    * Saves a single field to the DB without needing the "Save" button.
//    */
//   const syncFieldToDatabase = async (field, value, isHrDoc = false) => {
//   try {
//     if (isHrDoc) {
//       // We use 'id' as the conflict target to ensure it updates existing rows
//       const { error } = await supabase
//         .from("hr_documents")
//         .upsert(
//           { id: employeeId, [field]: value }, 
//           { onConflict: 'id' } 
//         );
      
//       if (error) {
//         console.error("Supabase Error Details:", error);
//         throw error;
//       }
//     } else {
//       const { error } = await supabase
//         .from("profiles")
//         .update({ [field]: value })
//         .eq("id", employeeId);
//       if (error) throw error;
//     }
//   } catch (err) {
//     console.error("Sync error:", err);
//     toast.error(`Sync failed: ${err.message || "Check console for details"}`);
//   }
// };

//   const handleFileUpload = async (e, field, isArray = false, index = null) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(field + (index ?? ""));
//     const fileExt = file.name.split(".").pop();
//     const cleanName = `${field}-${Date.now()}.${fileExt}`;
//     const filePath = `${employeeId}/${cleanName}`;

//     try {
//       const { error: uploadError } = await supabase.storage
//         .from("hr-files")
//         .upload(filePath, file, { upsert: true });

//       if (uploadError) throw uploadError;

//       const { data } = supabase.storage.from("hr-files").getPublicUrl(filePath);
//       const url = data.publicUrl;

//       // Update State & Immediate Sync
//       setFormData((prev) => {
//         if (isArray) {
//           const newDocs = [...prev.additional_docs];
//           newDocs[index] = { ...newDocs[index], url };
//           syncFieldToDatabase("additional_docs", newDocs, true);
//           return { ...prev, additional_docs: newDocs };
//         } 
        
//         if (field.startsWith("reference_")) {
//           const updatedRef = { ...prev[field], url };
//           syncFieldToDatabase(field, updatedRef, true);
//           return { ...prev, [field]: updatedRef };
//         }

//         const isProfileField = ["avatar_url"].includes(field);
//         syncFieldToDatabase(field, url, !isProfileField);
//         return { ...prev, [field]: url };
//       });

//       toast.success("File uploaded and saved");
//     } catch (error) {
//       toast.error(error.message || "Upload failed");
//     } finally {
//       setUploading(null);
//     }
//   };

//   const handleSave = async (e) => {
//     if (e) e.preventDefault();
//     setSaving(true);

//     try {
//       const { error: pError } = await supabase
//         .from("profiles")
//         .update({
//           full_name: formData.full_name,
//           role: formData.role,
//           status: formData.status,
//           avatar_url: formData.avatar_url,
//         })
//         .eq("id", employeeId);

//       if (pError) throw pError;

//       const { error: hrError } = await supabase.from("hr_documents").upsert({
//         id: employeeId,
//         contract_url: formData.contract_url,
//         contract_expiry: formData.contract_expiry,
//         dbs_check_number: formData.dbs_check_number,
//         dbs_certificate_url: formData.dbs_certificate_url,
//         police_check_url: formData.police_check_url,
//         induction_status: formData.induction_status,
//         induction_date: formData.induction_date,
//         training_score: formData.training_score,
//         reference_1: formData.reference_1,
//         reference_2: formData.reference_2,
//         additional_docs: formData.additional_docs,
//       });

//       if (hrError) throw hrError;

//       toast.success("Profile fully updated");
//       router.push("/hrList");
//     } catch (err) {
//       toast.error("Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Metric Calculations
//   const isDbsCompliant = formData.dbs_check_number && formData.dbs_certificate_url;
  
//   const getContractStatus = () => {
//     if (!formData.contract_expiry) return { percent: 0, text: "No Contract", color: "text-[#6b7d74]", indicator: "bg-[#ece7df]" };
//     const expiryDate = new Date(formData.contract_expiry);
//     const today = new Date();
//     const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
//     const percentUsed = Math.max(0, Math.min(100, ((365 - diffDays) / 365) * 100));

//     if (diffDays < 0) return { percent: 100, text: "Expired", color: "text-[#dc2626]", indicator: "bg-[#dc2626]" };
//     if (diffDays <= 30) return { percent: Math.round(percentUsed), text: `Expiring: ${diffDays}d`, color: "text-[#F59E0B]", indicator: "bg-[#F59E0B]" };
//     return { percent: Math.round(percentUsed), text: "Active", color: "text-[#1f6b4a]", indicator: "bg-[#1f6b4a]" };
//   };

//   const contractStatus = getContractStatus();

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-[#f5f0e6]">
//       <Loader2 className="animate-spin text-[#1f6b4a] w-8 h-8" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8 flex flex-col items-center">
//       <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
//         <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#ece7df] gap-2">
//           <ArrowLeft className="w-4 h-4" /> Back to List
//         </Button>
//       </div>

//       <Card className="w-full max-w-4xl bg-[#fbf8f2] border-[#e1dbd2] shadow-lg">
//         <CardHeader className="border-b border-[#e1dbd2] pb-6">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
//             {/* Avatar & Name */}
//             <div className="flex items-center gap-6">
//               <div className="relative group">
//                 <Avatar className="w-24 h-24 border-4 border-white shadow-md">
//                   <AvatarImage src={formData.avatar_url} className="object-cover" />
//                   <AvatarFallback className="bg-[#ece7df] text-[#123d2b] text-xl">
//                     {formData.full_name?.split(" ").map(n => n[0]).join("")}
//                   </AvatarFallback>
//                 </Avatar>
//                 <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-[#1f6b4a] rounded-full text-white cursor-pointer shadow-lg hover:bg-[#15573c] transition-colors">
//                   {uploading === "avatar_url" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
//                   <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "avatar_url")} />
//                 </label>
//               </div>
//               <div className="space-y-1">
//                 <CardTitle className="text-[#123d2b] text-2xl">{formData.full_name || "New Employee"}</CardTitle>
//                 <CardDescription className="text-[#6b7d74] font-medium">{formData.role || "Staff Member"}</CardDescription>
//               </div>
//             </div>

//             {/* Top Metrics Summary */}
//             <div className="grid grid-cols-3 gap-3 w-full md:w-auto bg-white p-3 rounded-xl border border-[#e1dbd2] shadow-sm">
//               <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#f5f0e6]">
//                 <ShieldCheck className={`w-5 h-5 mb-1 ${isDbsCompliant ? 'text-[#2FA36B]' : 'text-[#dc2626]'}`} />
//                 <span className="text-xs font-bold text-[#123d2b]">{isDbsCompliant ? "100%" : "0%"}</span>
//                 <span className="text-[10px] text-[#6b7d74] uppercase tracking-wider">DBS</span>
//               </div>
//               <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#f5f0e6]">
//                 <GraduationCap className="w-5 h-5 mb-1 text-[#1f6b4a]" />
//                 <span className="text-xs font-bold text-[#123d2b]">{formData.training_score}%</span>
//                 <span className="text-[10px] text-[#6b7d74] uppercase tracking-wider">Training</span>
//               </div>
//               <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#f5f0e6]">
//                 <AlertTriangle className={`w-5 h-5 mb-1 ${contractStatus.color}`} />
//                 <span className={`text-xs font-bold ${contractStatus.color}`}>{contractStatus.percent}%</span>
//                 <span className="text-[10px] text-[#6b7d74] uppercase tracking-wider">Contract</span>
//               </div>
//             </div>

//           </div>
//         </CardHeader>

//         <Tabs defaultValue="basic" className="p-6">
//           <TabsList className="grid w-full grid-cols-4 bg-[#ece7df] rounded-lg p-1 mb-8">
//             <TabsTrigger value="basic" className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]">Info</TabsTrigger>
//             <TabsTrigger value="compliance" className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]">Compliance</TabsTrigger>
//             <TabsTrigger value="contracts" className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]">Contracts</TabsTrigger>
//             <TabsTrigger value="docs" className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]">Docs</TabsTrigger>
//           </TabsList>

//           {/* BASIC INFO TAB */}
//           <TabsContent value="basic" className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label className="text-[#123d2b]">Full Name</Label>
//                 <Input className="bg-white border-[#e1dbd2] focus:ring-[#1f6b4a]" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-[#123d2b]">Job Role</Label>
//                 <Input className="bg-white border-[#e1dbd2] focus:ring-[#1f6b4a]" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
//               </div>
//             </div>
            
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label className="text-[#123d2b]">Induction Date</Label>
//                 <Input type="date" className="bg-white border-[#e1dbd2]" value={formData.induction_date} onChange={(e) => setFormData({ ...formData, induction_date: e.target.value })} />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-[#123d2b]">Induction Status</Label>
//                 <Select value={formData.induction_status} onValueChange={(v) => setFormData({ ...formData, induction_status: v })}>
//                   <SelectTrigger className="bg-white border-[#e1dbd2]">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-[#fbf8f2]">
//                     <SelectItem value="Pending">Pending</SelectItem>
//                     <SelectItem value="Completed">Completed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </TabsContent>

//           {/* COMPLIANCE TAB */}
//           <TabsContent value="compliance" className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-4 p-5 border border-[#e1dbd2] rounded-xl bg-white shadow-sm">
//                 <div className="flex justify-between items-center">
//                   <Label className="font-bold text-[#123d2b] flex items-center gap-2">
//                     <ShieldCheck className="w-5 h-5 text-[#1f6b4a]" /> DBS Check
//                   </Label>
//                   <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDbsCompliant ? 'bg-[#e6f2ec] text-[#2FA36B]' : 'bg-[#ece7df] text-[#6b7d74]'}`}>
//                     {isDbsCompliant ? 'Compliant' : 'Incomplete'}
//                   </span>
//                 </div>
//                 <Input placeholder="Certificate Number" className="bg-[#f5f0e6]/50 border-[#e1dbd2]" value={formData.dbs_check_number} onChange={(e) => setFormData({ ...formData, dbs_check_number: e.target.value })} />
//                 <div className="relative">
//                   <Input type="file" className="hidden" id="dbs-file" onChange={(e) => handleFileUpload(e, "dbs_certificate_url")} />
//                   <Button asChild variant="outline" className="w-full border-[#e1dbd2] hover:bg-[#e6f2ec] hover:text-[#15573c]">
//                     <label htmlFor="dbs-file" className="cursor-pointer">
//                       {uploading === "dbs_certificate_url" ? <Loader2 className="animate-spin mr-2" /> : formData.dbs_certificate_url ? <CheckCircle2 className="text-[#2FA36B] mr-2" /> : <Upload className="mr-2 w-4 h-4" />}
//                       {formData.dbs_certificate_url ? "Update Certificate PDF" : "Upload Certificate"}
//                     </label>
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-4 p-5 border border-[#e1dbd2] rounded-xl bg-white shadow-sm flex flex-col justify-between">
//                 <div>
//                   <Label className="font-bold text-[#123d2b] flex items-center gap-2">
//                      Police Check
//                   </Label>
//                   <p className="text-xs text-[#6b7d74] mt-1">Required for international staff or specific roles.</p>
//                 </div>
//                 <Input type="file" className="hidden" id="police-file" onChange={(e) => handleFileUpload(e, "police_check_url")} />
//                 <Button asChild variant="outline" className="w-full border-[#e1dbd2] hover:bg-[#e6f2ec] hover:text-[#15573c]">
//                   <label htmlFor="police-file" className="cursor-pointer">
//                     {uploading === "police_check_url" ? <Loader2 className="animate-spin mr-2" /> : formData.police_check_url ? <CheckCircle2 className="text-[#2FA36B] mr-2" /> : <Upload className="mr-2 w-4 h-4" />}
//                     {formData.police_check_url ? "Update Police Check" : "Upload Police Check"}
//                   </label>
//                 </Button>
//               </div>
//             </div>

//             <div className="p-6 border border-[#e1dbd2] rounded-xl bg-white shadow-sm space-y-6">
//               <div className="flex justify-between items-center">
//                 <Label className="text-[#123d2b] font-bold flex items-center gap-2">
//                   <GraduationCap className="w-5 h-5 text-[#1f6b4a]"/> Mandatory Training Completion
//                 </Label>
//                 <span className="bg-[#e6f2ec] text-[#15573c] px-3 py-1 rounded-full text-sm font-bold">{formData.training_score}%</span>
//               </div>
//               <Slider
//                 value={[formData.training_score || 0]}
//                 onValueChange={(value) => setFormData({ ...formData, training_score: value[0] })}
//                 max={100}
//                 step={1}
//                 className="**:[[role=slider]]:bg-[#1f6b4a]"
//               />
//             </div>
//           </TabsContent>

//           {/* CONTRACTS TAB (NEW) */}
//           <TabsContent value="contracts" className="space-y-6">
//             <div className="p-6 border border-[#e1dbd2] rounded-xl bg-white shadow-sm space-y-6">
              
//               <div className="flex items-center justify-between border-b border-[#e1dbd2] pb-4">
//                 <div>
//                   <h3 className="text-lg font-bold text-[#123d2b] flex items-center gap-2">
//                     <FileText className="w-5 h-5 text-[#1f6b4a]" /> Employment Contract
//                   </h3>
//                   <p className="text-sm text-[#6b7d74]">Manage active contract dates and documents.</p>
//                 </div>
//                 <div className={`px-4 py-1.5 rounded-full text-sm font-bold bg-opacity-20 flex items-center gap-2 ${contractStatus.indicator.replace('bg-', 'bg-')}/20 ${contractStatus.color}`}>
//                    {contractStatus.text}
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8 items-center">
//                 <div className="space-y-3">
//                   <Label className="text-[#123d2b] font-semibold">Contract Expiry Date</Label>
//                   <Input type="date" className="bg-[#f5f0e6]/50 border-[#e1dbd2]" value={formData.contract_expiry} onChange={(e) => setFormData({ ...formData, contract_expiry: e.target.value })} />
                  
//                   {formData.contract_expiry && (
//                     <div className="mt-4 space-y-1">
//                       <div className="flex justify-between text-xs text-[#6b7d74] font-medium">
//                         <span>Time Elapsed</span>
//                         <span>{contractStatus.percent}%</span>
//                       </div>
//                       <Progress value={contractStatus.percent} className={`h-2 ${contractStatus.indicator}`} />
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex flex-col space-y-3 h-full justify-end">
//                   <Label className="text-[#123d2b] font-semibold">Contract Document</Label>
//                   <label className={`cursor-pointer border-2 border-dashed ${formData.contract_url ? 'border-[#2FA36B] bg-[#2FA36B]/5' : 'border-[#e1dbd2] hover:bg-[#f5f0e6]'} rounded-xl flex flex-col items-center justify-center p-6 transition-colors h-32`}>
//                     <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "contract_url")} />
//                     {uploading === "contract_url" ? (
//                        <Loader2 className="animate-spin text-[#1f6b4a] w-8 h-8 mb-2" />
//                     ) : formData.contract_url ? (
//                        <CheckCircle2 className="text-[#2FA36B] w-8 h-8 mb-2" />
//                     ) : (
//                        <Upload className="w-8 h-8 text-[#1f6b4a] mb-2" />
//                     )}
//                     <span className="text-sm font-medium text-[#123d2b]">
//                       {formData.contract_url ? "Contract Signed & Uploaded" : "Upload Signed PDF"}
//                     </span>
//                     <span className="text-xs text-[#6b7d74] mt-1">Click to {formData.contract_url ? "replace" : "browse"}</span>
//                   </label>
//                 </div>
//               </div>

//             </div>
//           </TabsContent>

//           {/* DOCUMENTS TAB */}
//           <TabsContent value="docs" className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               {["reference_1", "reference_2"].map((ref, i) => (
//                 <div key={ref} className="p-5 border border-[#e1dbd2] rounded-xl bg-white shadow-sm space-y-3">
//                   <p className="font-bold text-[#123d2b] text-sm border-b border-[#e1dbd2] pb-2 mb-2">Reference Contact {i + 1}</p>
//                   <Input placeholder="Full Name" className="bg-[#f5f0e6]/50 border-[#e1dbd2]" value={formData[ref].name} onChange={(e) => setFormData({ ...formData, [ref]: { ...formData[ref], name: e.target.value } })} />
//                   <Input placeholder="Email Address" className="bg-[#f5f0e6]/50 border-[#e1dbd2]" value={formData[ref].email} onChange={(e) => setFormData({ ...formData, [ref]: { ...formData[ref], email: e.target.value } })} />
//                   <label className="cursor-pointer border border-[#e1dbd2] rounded-md flex items-center justify-center p-2 text-xs hover:bg-[#f5f0e6] text-[#123d2b] font-medium mt-2">
//                     <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, ref)} />
//                     {uploading === ref ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : formData[ref].url ? <CheckCircle2 className="text-[#2FA36B] mr-2 w-4 h-4" /> : <Upload className="mr-2 w-4 h-4 text-[#1f6b4a]" />}
//                     {formData[ref].url ? "Letter Attached" : "Attach Reference Letter"}
//                   </label>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-4">
//               <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e1dbd2]">
//                 <Label className="text-[#123d2b] font-bold text-lg">Other Verified Documents</Label>
//                 <Button size="sm" className="bg-[#1f6b4a] hover:bg-[#15573c] text-white" onClick={() => setFormData({ ...formData, additional_docs: [...formData.additional_docs, { name: "", url: "" }] })}>
//                   <Plus className="w-4 h-4 mr-1" /> Add Custom
//                 </Button>
//               </div>
              
//               <div className="space-y-3">
//                 {formData.additional_docs.map((doc, idx) => (
//                   <div key={idx} className="flex gap-3 bg-white p-3 border border-[#e1dbd2] rounded-xl shadow-sm items-center hover:shadow-md transition-shadow">
//                     <Input placeholder="Document Name (e.g. Passport)" className="flex-1 bg-[#f5f0e6]/50 border-[#e1dbd2]" value={doc.name} onChange={(e) => {
//                       const d = [...formData.additional_docs];
//                       d[idx].name = e.target.value;
//                       setFormData({ ...formData, additional_docs: d });
//                     }} />
//                     <label className="cursor-pointer p-2.5 border border-[#e1dbd2] rounded-lg hover:bg-[#f5f0e6] transition-colors">
//                       <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "additional_docs", true, idx)} />
//                       {uploading === "additional_docs" + idx ? <Loader2 className="animate-spin w-5 h-5 text-[#1f6b4a]" /> : doc.url ? <CheckCircle2 className="text-[#2FA36B] w-5 h-5" /> : <Upload className="w-5 h-5 text-[#1f6b4a]" />}
//                     </label>
//                     <Button variant="ghost" size="icon" className="hover:bg-[#dc2626]/10" onClick={() => setFormData({ ...formData, additional_docs: formData.additional_docs.filter((_, i) => i !== idx) })}>
//                       <Trash2 className="w-5 h-5 text-[#dc2626]" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>

//         <CardFooter className="border-t border-[#e1dbd2] pt-6 px-6 pb-6 gap-4 bg-[#f5f0e6]/50 rounded-b-xl">
//           <Button variant="outline" className="border-[#e1dbd2] text-[#123d2b] hover:bg-[#ece7df] bg-white" onClick={() => router.back()}>
//             Cancel Changes
//           </Button>
//           <Button onClick={handleSave} disabled={saving} className="bg-[#1f6b4a] text-[#f7f2e9] hover:bg-[#15573c] flex-1 font-bold text-lg shadow-md transition-all active:scale-[0.98]">
//             {saving ? <Loader2 className="animate-spin mr-2" /> : "Save Profile Data"}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

import EditEmployee from '@/features/dashbord/hrList/EditEmployee'
import React from 'react'

const page = () => {
  return (
    <div>
      <EditEmployee />
    </div>
  )
}

export default page