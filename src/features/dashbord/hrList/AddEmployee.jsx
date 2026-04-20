// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Plus,
//   ArrowLeft,
//   FileText,
//   Camera,
//   CheckCircle2,
//   Loader2,
//   GraduationCap,
//   History,
//   Trash2,
//   AlertTriangle,
// } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// const AddEmployeeForm = () => {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const [uploadingFields, setUploadingFields] = useState({});

//   const [formData, setFormData] = useState({
//     id: crypto.randomUUID(), // Generates the ID immediately
//     full_name: "",
//     dob: "",
//     job_role: "",
//     contact_info: "",
//     dbs_number: "",
//     dbs_completion_date: "",
//     start_date: "",
//     induction_completed_date: "",
//     last_appraisal_date: "",
//     ref1_name: "",
//     ref1_email: "",
//     ref2_name: "",
//     ref2_email: "",
//     refs_verified_by_phone: false,
//     verification_details: "",
//     evidence_address_url: "",
//     photo_id_url: "",
//     signed_app_url: "",
//     interview_notes_url: "",
//     rtw_check_url: "",
//     insurance_url: "",
//     ref1_doc_url: "",
//     ref2_doc_url: "",
//     induction_checklist_url: "",
//     training_record_url: "",
//     appraisal_doc_url: "",
//     sickness_disciplinary_urls: [],
//     qualifications: [],
//     supervisions: [],
//     other_documents: [],
//   });

// //   const handleFileUpload = async (
// //     e,
// //     fieldName,
// //     index = null,
// //     listName = null,
// //     isMultiple = false,
// //   ) => {
// //     const files = Array.from(e.target.files);
// //     if (!files.length) return;
// //     const trackKey = listName ? `${listName}-${index}` : fieldName;
// //     setUploadingFields((prev) => ({ ...prev, [trackKey]: true }));
// //     try {
// //       const uploadResults = await Promise.all(
// //         files.map(async (file) => {
// //           const fileExt = file.name.split(".").pop();
// //           const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

// //           // Ensure we have an ID to use for the folder name
// // // const folderId = formData.id || 'temp_id';

// // // // New structure: [Employee ID]/[Category]/[File]
// // // const filePath = `${folderId}/${fieldName}/${fileName}`;

// //           // Use ID as folder: 'employee-docs/UUID/interview_notes_url/1777'
// //     const filePath = `${id}/${field}/${fileName}`;

// //           const { error: uploadError } = await supabase.storage
// //             .from("employee-docs")
// //             .upload(filePath, file);
// //           if (uploadError) throw uploadError;
// //           const { data } = supabase.storage
// //             .from("employee-docs")
// //             .getPublicUrl(filePath);
// //           return data.publicUrl;
// //         }),
// //       );
// //       if (listName !== null && index !== null) {
// //         const newList = [...formData[listName]];
// //         newList[index] = { ...newList[index], url: uploadResults[0] };
// //         setFormData((prev) => ({ ...prev, [listName]: newList }));
// //       } else {
// //         setFormData((prev) => ({
// //           ...prev,
// //           [fieldName]: isMultiple
// //             ? [...(prev[fieldName] || []), ...uploadResults]
// //             : uploadResults[0],
// //         }));
// //       }
// //       toast.success("File uploaded successfully");
// //     } catch (error) {
// //       toast.error("Upload failed");
// //     } finally {
// //       setUploadingFields((prev) => ({ ...prev, [trackKey]: false }));
// //     }
// //   };

// const handleFileUpload = async (
//   e,
//   fieldName,
//   index = null,
//   listName = null,
//   isMultiple = false,
// ) => {
//   const files = Array.from(e.target.files);
//   if (!files.length) return;

//   // Use the employee's unique ID from your state
//   // IMPORTANT: Ensure your initial formData state has an 'id'
//   // (either a pre-generated UUID or one returned from a database 'insert')
//   const employeeId = formData.id;

//   if (!employeeId) {
//     toast.error("Please save employee details or wait for ID generation before uploading.");
//     return;
//   }

//   const trackKey = listName ? `${listName}-${index}` : fieldName;
//   setUploadingFields((prev) => ({ ...prev, [trackKey]: true }));

//   try {
//     const uploadResults = await Promise.all(
//       files.map(async (file) => {
//         const fileExt = file.name.split(".").pop();
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

//         // Construct the individual path: UUID / FIELD_NAME / FILENAME
//         // Example: 550e8400-e29b-41d4-a716/dbs_doc_url/1712945...png
//         const filePath = `${employeeId}/${fieldName}/${fileName}`;

//         const { error: uploadError } = await supabase.storage
//           .from("employee-docs")
//           .upload(filePath, file);

//         if (uploadError) throw uploadError;

//         const { data } = supabase.storage
//           .from("employee-docs")
//           .getPublicUrl(filePath);

//         return data.publicUrl;
//       }),
//     );

//     // State update logic...
//     if (listName !== null && index !== null) {
//       const newList = [...formData[listName]];
//       newList[index] = { ...newList[index], url: uploadResults[0] };
//       setFormData((prev) => ({ ...prev, [listName]: newList }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [fieldName]: isMultiple
//           ? [...(prev[fieldName] || []), ...uploadResults]
//           : uploadResults[0],
//       }));
//     }
//     toast.success("File uploaded successfully");
//   } catch (error) {
//     console.error("Upload error:", error);
//     toast.error("Upload failed");
//   } finally {
//     setUploadingFields((prev) => ({ ...prev, [trackKey]: false }));
//   }
// };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.full_name) {
//       return toast.error("Please enter the employee's full name.");
//     }

//     const criticalFields = [
//       "dob",
//       "job_role",
//       "contact_info",
//       "dbs_number",
//       "photo_id_url",
//       "evidence_address_url",
//     ];
//     const hasEmptyFields = criticalFields.some((field) => !formData[field]);

//     if (hasEmptyFields) {
//       setIsConfirmOpen(true);
//     } else {
//       processSave();
//     }
//   };

//   const processSave = async () => {
//     setIsSubmitting(true);
//     setIsConfirmOpen(false);

//     try {
//       // CLEANING LOGIC: Convert empty strings in date fields to NULL
//       const submissionData = { ...formData };

//       const dateFields = [
//         "dob",
//         "dbs_completion_date",
//         "start_date",
//         "induction_completed_date",
//         "last_appraisal_date",
//       ];

//       dateFields.forEach((field) => {
//         if (submissionData[field] === "") {
//           submissionData[field] = null;
//         }
//       });

//       // Also clean dates inside the supervisions array if they exist
//       if (submissionData.supervisions.length > 0) {
//         submissionData.supervisions = submissionData.supervisions.map((s) => ({
//           ...s,
//           date: s.date === "" ? null : s.date,
//         }));
//       }

//       const { error } = await supabase
//         .from("employees")
//         .insert([submissionData]);
//       if (error) throw error;

//       toast.success("Employee record saved successfully!");
//       router.push("/hrList");
//     } catch (error) {
//       console.error("Save error:", error);
//       toast.error(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const FileStatus = ({ fieldName, isUploaded, isUploading }) => (
//     <div className="flex items-center ml-2">
//       {isUploading ? (
//         <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//       ) : isUploaded ? (
//         <CheckCircle2 className="h-4 w-4 text-green-500" />
//       ) : null}
//     </div>
//   );

//   const addListEntry = (listName, schema) => {
//     setFormData((prev) => ({
//       ...prev,
//       [listName]: [...prev[listName], schema],
//     }));
//   };

//   const removeListEntry = (listName, index) => {
//     setFormData((prev) => ({
//       ...prev,
//       [listName]: prev[listName].filter((_, i) => i !== index),
//     }));
//   };

//   const updateListField = (listName, index, field, value) => {
//     const newList = [...formData[listName]];
//     newList[index][field] = value;
//     setFormData((prev) => ({ ...prev, [listName]: newList }));
//   };

//   return (
//     <div className="p-6 min-h-screen space-y-8">
//       <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
//         <AlertDialogContent className="bg-[#fbf8f2] border-[#e1dbd2]">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
//               <AlertTriangle className="h-5 w-5" /> Missing Details
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-[#123d2b]">
//               Some details or documents are currently missing. Do you want to
//               save the record anyway?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="border-[#1f6b4a] text-[#1f6b4a]">
//               No, continue editing
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={processSave}
//               className="bg-[#1f6b4a] text-white"
//             >
//               Yes, save anyway
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <div className="max-w-5xl mx-auto mb-6">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="text-[#123d2b] hover:bg-[#e1dbd2]"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//         </Button>
//       </div>

//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-[#123d2b]">
//           New Employee Enrollment
//         </h1>
//       </div>

//       {/* SECTION 1: PERSONAL DETAILS */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2]">
//           <CardTitle className="text-[#123d2b] text-lg">
//             Personal Details
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//           <div className="space-y-2">
//             <Label>Full Name</Label>
//             <Input
//               name="full_name"
//               value={formData.full_name}
//               onChange={handleInputChange}
//               className="bg-[#e1dbd2] border-none"
//               placeholder="Enter name"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Date of Birth</Label>
//             <Input
//               name="dob"
//               type="date"
//               value={formData.dob}
//               onChange={handleInputChange}
//               className="bg-[#e1dbd2] border-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Job Role</Label>
//             <Input
//               name="job_role"
//               value={formData.job_role}
//               onChange={handleInputChange}
//               className="bg-[#e1dbd2] border-none"
//               placeholder="e.g. Support Worker"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Contact Information</Label>
//             <Input
//               name="contact_info"
//               value={formData.contact_info}
//               onChange={handleInputChange}
//               className="bg-[#e1dbd2] border-none"
//               placeholder="Email or Phone"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label className="flex items-center">
//               Evidence of Address{" "}
//               <FileStatus
//                 fieldName="evidence_address_url"
//                 isUploaded={!!formData.evidence_address_url}
//                 isUploading={uploadingFields.evidence_address_url}
//               />
//             </Label>
//             <div className="flex items-center gap-2">
//               <Input
//                 type="file"
//                 accept="image/*,.pdf"
//                 onChange={(e) => handleFileUpload(e, "evidence_address_url")}
//                 className="bg-[#e1dbd2] border-none"
//               />
//               <FileText className="text-[#6b7d74]" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label className="flex items-center">
//               Photographic ID{" "}
//               <FileStatus
//                 fieldName="photo_id_url"
//                 isUploaded={!!formData.photo_id_url}
//                 isUploading={uploadingFields.photo_id_url}
//               />
//             </Label>
//             <div className="flex items-center gap-2">
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileUpload(e, "photo_id_url")}
//                 className="bg-[#e1dbd2] border-none"
//               />
//               <Camera className="text-[#6b7d74]" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* SECTION 2: STAFF FILES */}
//       {/* <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2]">
//           <CardTitle className="text-[#123d2b] text-lg">
//             Staff Files & Compliance
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6 pt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Signed Application Form{" "}
//                 <FileStatus
//                   fieldName="signed_app_url"
//                   isUploaded={!!formData.signed_app_url}
//                   isUploading={uploadingFields.signed_app_url}
//                 />
//               </Label>
//               <Input
//                 type="file"
//                 accept=".pdf,image/*"
//                 onChange={(e) => handleFileUpload(e, "signed_app_url")}
//                 className="bg-[#e1dbd2] border-none"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Interview Notes{" "}
//                 <FileStatus
//                   fieldName="interview_notes_url"
//                   isUploaded={!!formData.interview_notes_url}
//                   isUploading={uploadingFields.interview_notes_url}
//                 />
//               </Label>
//               <Input
//                 type="file"
//                 accept=".pdf,image/*"
//                 onChange={(e) => handleFileUpload(e, "interview_notes_url")}
//                 className="bg-[#e1dbd2] border-none"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Right to Work / Conduct{" "}
//                 <FileStatus
//                   fieldName="rtw_check_url"
//                   isUploaded={!!formData.rtw_check_url}
//                   isUploading={uploadingFields.rtw_check_url}
//                 />
//               </Label>
//               <Input
//                 type="file"
//                 onChange={(e) => handleFileUpload(e, "rtw_check_url")}
//                 className="bg-[#e1dbd2] border-none"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Insurance/Registration{" "}
//                 <FileStatus
//                   fieldName="insurance_url"
//                   isUploaded={!!formData.insurance_url}
//                   isUploading={uploadingFields.insurance_url}
//                 />
//               </Label>
//               <Input
//                 type="file"
//                 onChange={(e) => handleFileUpload(e, "insurance_url")}
//                 className="bg-[#e1dbd2] border-none"
//               />
//             </div>
//           </div>

//           {/* DBS TRACE RISK ASSESSMENT SECTION */}
//           {/* <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 space-y-3">
//             <h4 className="font-semibold text-[#123d2b] mb-4">DBS</h4>
//             <div className="space-y-2">
//               <Label>DBS Number</Label>
//               <Input
//                 name="dbs_number"
//                 value={formData.dbs_number}
//                 onChange={handleInputChange}
//                 className="bg-[#e1dbd2] border-none"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>DBS Completion Date</Label>
//               <Input
//                 name="dbs_completion_date"
//                 type="date"
//                 value={formData.dbs_completion_date}
//                 onChange={handleInputChange}
//                 className="bg-[#e1dbd2] border-none"
//               />
//             </div>

//             <h4 className="font-semibold text-orange-900 flex items-center gap-2 mt-8">
//               <AlertTriangle className="h-4 w-4" /> DBS Trace Risk Evaluation
//             </h4>
//             <div className="space-y-2">
//               <Label className="text-orange-800">
//                 Risk Assessment & Evaluation Evidence (Required if trace exists)
//               </Label>
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "dbs_trace_notes_url")}
//                   className="bg-white border-orange-200"
//                 />
//                 <FileStatus
//                   isUploading={uploadingFields["dbs_trace_notes_url"]}
//                   isUploaded={!!formData.dbs_trace_notes_url}
//                 />
//               </div>
//               <p className="text-xs text-orange-700 italic">
//                 Upload evidence of the appointing officer's evaluation of any
//                 trace highlighted on the DBS check.
//               </p>
//             </div>
//           </div> */}

//           {/* <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
//             <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center mb-2">
//                   <Label>Referee 1</Label>
//                   <FileStatus
//                     fieldName="ref1_doc_url"
//                     isUploaded={!!formData.ref1_doc_url}
//                     isUploading={uploadingFields.ref1_doc_url}
//                   />
//                 </div>
//                 <Input
//                   name="ref1_name"
//                   value={formData.ref1_name}
//                   placeholder="Referee 1 Name"
//                   onChange={handleInputChange}
//                   className="bg-white mb-2"
//                 />
//                 <Input
//                   name="ref1_email"
//                   value={formData.ref1_email}
//                   placeholder="Referee 1 Email"
//                   onChange={handleInputChange}
//                   className="bg-white mb-2"
//                 />
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "ref1_doc_url")}
//                   className="bg-white"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center mb-2">
//                   <Label>Referee 2</Label>
//                   <FileStatus
//                     fieldName="ref2_doc_url"
//                     isUploaded={!!formData.ref2_doc_url}
//                     isUploading={uploadingFields.ref2_doc_url}
//                   />
//                 </div>
//                 <Input
//                   name="ref2_name"
//                   value={formData.ref2_name}
//                   placeholder="Referee 2 Name"
//                   onChange={handleInputChange}
//                   className="bg-white mb-2"
//                 />
//                 <Input
//                   name="ref2_email"
//                   value={formData.ref2_email}
//                   placeholder="Referee 2 Email"
//                   onChange={handleInputChange}
//                   className="bg-white mb-2"
//                 />
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "ref2_doc_url")}
//                   className="bg-white"
//                 />
//               </div>
//             </div>
//             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="refs_verified"
//                   checked={formData.refs_verified_by_phone}
//                   onCheckedChange={(checked) =>
//                     setFormData((p) => ({
//                       ...p,
//                       refs_verified_by_phone: checked,
//                     }))
//                   }
//                 />
//                 <Label
//                   htmlFor="refs_verified"
//                   className="text-blue-900 font-medium text-sm"
//                 >
//                   References verified by follow-up telephone call
//                 </Label>
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-xs">Verification Details</Label>
//                 <Input
//                   name="verification_details"
//                   value={formData.verification_details}
//                   placeholder="e.g. Verified 12/04/2024 by [Officer Name]"
//                   onChange={handleInputChange}
//                   className="bg-white border-blue-200"
//                 />
//               </div>
//             </div>
//           </div>
//         </CardContent> */}
//       {/* </Card> */}

//       {/* SECTION 3: TRAINING */}
//       {/* <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2]">
//           <CardTitle className="text-[#123d2b] text-lg">
//             Training & Induction
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//           <div className="space-y-2">
//             <Label>Start Date</Label>
//             <Input
//               name="start_date"
//               type="date"
//               value={formData.start_date}
//               onChange={handleInputChange}
//               className="bg-[#e1dbd2] border-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Induction Completed Date</Label>
//             <Input
//               name="induction_completed_date"
//               type="date"
//               value={formData.induction_completed_date}
//               onChange={handleInputChange}
//               className="bg-[#e1dbd2] border-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label className="flex items-center">
//               Induction Checklist{" "}
//               <FileStatus
//                 fieldName="induction_checklist_url"
//                 isUploaded={!!formData.induction_checklist_url}
//                 isUploading={uploadingFields.induction_checklist_url}
//               />
//             </Label>
//             <Input
//               type="file"
//               onChange={(e) => handleFileUpload(e, "induction_checklist_url")}
//               className="bg-[#e1dbd2] border-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label className="flex items-center">
//               Training Records{" "}
//               <FileStatus
//                 fieldName="training_record_url"
//                 isUploaded={!!formData.training_record_url}
//                 isUploading={uploadingFields.training_record_url}
//               />
//             </Label>
//             <Input
//               type="file"
//               onChange={(e) => handleFileUpload(e, "training_record_url")}
//               className="bg-[#e1dbd2] border-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Last Annual Appraisal Date</Label>
//             <Input
//               name="last_appraisal_date"
//               type="date"
//               value={formData.last_appraisal_date}
//               onChange={handleInputChange}
//               className="bg-white border-[#e1dbd2]"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label className="flex items-center">
//               Appraisal Docs{" "}
//               <FileStatus
//                 isUploading={uploadingFields["appraisal_doc_url"]}
//                 isUploaded={!!formData.appraisal_doc_url}
//               />
//             </Label>
//             <Input
//               type="file"
//               onChange={(e) => handleFileUpload(e, "appraisal_doc_url")}
//               className="bg-white border-[#e1dbd2]"
//             />
//           </div>
//           <div className="space-y-2 col-span-full">
//             <Label className="flex items-center">
//               Sickness{" "}
//               <FileStatus
//                 isUploading={uploadingFields["sickness_disciplinary_urls"]}
//                 isUploaded={formData.sickness_disciplinary_urls.length > 0}
//               />
//             </Label>
//             <Input
//               type="file"
//               multiple
//               onChange={(e) =>
//                 handleFileUpload(
//                   e,
//                   "sickness_disciplinary_urls",
//                   null,
//                   null,
//                   true,
//                 )
//               }
//               className="bg-white border-[#e1dbd2]"
//             />
//           </div>
//         </CardContent>
//       </Card> */}

//       {/* Personal Documents */}
// <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm mb-6">
//   <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//     <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//       <User className="h-5 w-5" /> Personal Documents
//     </CardTitle>
//     <Button
//       variant="outline"
//       size="sm"
//       onClick={() => addListEntry("personalDocs", { name: "", url: "" })}
//       className="border-[#1f6b4a] text-[#1f6b4a]"
//     >
//       <Plus className="h-4 w-4 mr-1" /> Add
//     </Button>
//   </CardHeader>
//   <CardContent className="space-y-4 pt-6">
//     {formData.personalDocs.map((item, index) => (
//       <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md">
//         <div className="flex-1 space-y-2">
//           <Label>Document Type (e.g. Passport, ID)</Label>
//           <Input
//             value={item.name}
//             onChange={(e) => updateListField("personalDocs", index, "name", e.target.value)}
//           />
//         </div>
//         <div className="flex-1 space-y-2">
//           <Label className="flex">
//             File <FileStatus isUploading={uploadingFields[`personalDocs-${index}`]} isUploaded={!!item.url} />
//           </Label>
//           <Input type="file" onChange={(e) => handleFileUpload(e, null, index, "personalDocs")} />
//         </div>
//         <Button variant="ghost" size="icon" onClick={() => removeListEntry("personalDocs", index)} className="text-red-500">
//           <Trash2 className="h-4 w-4" />
//         </Button>
//       </div>
//     ))}
//   </CardContent>
// </Card>

// {/* Staff Records */}
// <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm mb-6">
//   <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//     <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//       <Briefcase className="h-5 w-5" /> Staff Records
//     </CardTitle>
//     <Button
//       variant="outline"
//       size="sm"
//       onClick={() => addListEntry("staffDocs", { name: "", url: "" })}
//       className="border-[#1f6b4a] text-[#1f6b4a]"
//     >
//       <Plus className="h-4 w-4 mr-1" /> Add
//     </Button>
//   </CardHeader>
//   <CardContent className="space-y-4 pt-6">
//     {formData.staffDocs.map((item, index) => (
//       <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md">
//         <div className="flex-1 space-y-2">
//           <Label>Record Title</Label>
//           <Input
//             value={item.name}
//             onChange={(e) => updateListField("staffDocs", index, "name", e.target.value)}
//           />
//         </div>
//         <div className="flex-1 space-y-2">
//           <Label className="flex">
//             Attachment <FileStatus isUploading={uploadingFields[`staffDocs-${index}`]} isUploaded={!!item.url} />
//           </Label>
//           <Input type="file" onChange={(e) => handleFileUpload(e, null, index, "staffDocs")} />
//         </div>
//         <Button variant="ghost" size="icon" onClick={() => removeListEntry("staffDocs", index)} className="text-red-500">
//           <Trash2 className="h-4 w-4" />
//         </Button>
//       </div>
//     ))}
//   </CardContent>
// </Card>

//     {/* Training Records */}
// <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm mb-6">
//   <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//     <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//       <BookOpen className="h-5 w-5" /> Training & Certificates
//     </CardTitle>
//     <Button
//       variant="outline"
//       size="sm"
//       onClick={() => addListEntry("training", { name: "", url: "" })}
//       className="border-[#1f6b4a] text-[#1f6b4a]"
//     >
//       <Plus className="h-4 w-4 mr-1" /> Add Certificate
//     </Button>
//   </CardHeader>
//   <CardContent className="space-y-4 pt-6">
//     {formData.training.map((item, index) => (
//       <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md">
//         <div className="flex-1 space-y-2">
//           <Label>Course/Certificate Name</Label>
//           <Input
//             value={item.name}
//             onChange={(e) => updateListField("training", index, "name", e.target.value)}
//           />
//         </div>
//         <div className="flex-1 space-y-2">
//           <Label className="flex">
//             Certificate File <FileStatus isUploading={uploadingFields[`training-${index}`]} isUploaded={!!item.url} />
//           </Label>
//           <Input type="file" onChange={(e) => handleFileUpload(e, null, index, "training")} />
//         </div>
//         <Button variant="ghost" size="icon" onClick={() => removeListEntry("training", index)} className="text-red-500">
//           <Trash2 className="h-4 w-4" />
//         </Button>
//       </div>
//     ))}
//   </CardContent>
// </Card>

// {/* Induction Documents */}
// <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm mb-6">
//   <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//     <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//       <ClipboardCheck className="h-5 w-5" /> Induction Records
//     </CardTitle>
//     <Button
//       variant="outline"
//       size="sm"
//       onClick={() => addListEntry("induction", { name: "", url: "" })}
//       className="border-[#1f6b4a] text-[#1f6b4a]"
//     >
//       <Plus className="h-4 w-4 mr-1" /> Add Record
//     </Button>
//   </CardHeader>
//   <CardContent className="space-y-4 pt-6">
//     {formData.induction.map((item, index) => (
//       <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md">
//         <div className="flex-1 space-y-2">
//           <Label>Document Name</Label>
//           <Input
//             value={item.name}
//             onChange={(e) => updateListField("induction", index, "name", e.target.value)}
//           />
//         </div>
//         <div className="flex-1 space-y-2">
//           <Label className="flex">
//             Signed File <FileStatus isUploading={uploadingFields[`induction-${index}`]} isUploaded={!!item.url} />
//           </Label>
//           <Input type="file" onChange={(e) => handleFileUpload(e, null, index, "induction")} />
//         </div>
//         <Button variant="ghost" size="icon" onClick={() => removeListEntry("induction", index)} className="text-red-500">
//           <Trash2 className="h-4 w-4" />
//         </Button>
//       </div>
//     ))}
//   </CardContent>
// </Card>

//       {/* QUALIFICATIONS SECTION */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//           <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//             <GraduationCap className="h-5 w-5" /> Qualifications
//           </CardTitle>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               addListEntry("qualifications", { name: "", url: "" })
//             }
//             className="border-[#1f6b4a] text-[#1f6b4a]"
//           >
//             <Plus className="h-4 w-4 mr-1" /> Add
//           </Button>
//         </CardHeader>
//         <CardContent className="space-y-4 pt-6">
//           {formData.qualifications.map((item, index) => (
//             <div
//               key={index}
//               className="flex gap-4 items-end bg-white p-3 border rounded-md"
//             >
//               <div className="flex-1 space-y-2">
//                 <Label>Qualification Name</Label>
//                 <Input
//                   value={item.name}
//                   onChange={(e) =>
//                     updateListField(
//                       "qualifications",
//                       index,
//                       "name",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//               <div className="flex-1 space-y-2">
//                 <Label className="flex">
//                   Document{" "}
//                   <FileStatus
//                     isUploading={uploadingFields[`qualifications-${index}`]}
//                     isUploaded={!!item.url}
//                   />
//                 </Label>
//                 <Input
//                   type="file"
//                   onChange={(e) =>
//                     handleFileUpload(e, null, index, "qualifications")
//                   }
//                 />
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => removeListEntry("qualifications", index)}
//                 className="text-red-500"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* SUPERVISIONS SECTION */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//           <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//             <History className="h-5 w-5" /> Supervisions
//           </CardTitle>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               addListEntry("supervisions", { date: "", type: "", url: "" })
//             }
//             className="border-[#1f6b4a] text-[#1f6b4a]"
//           >
//             <Plus className="h-4 w-4 mr-1" /> Add
//           </Button>
//         </CardHeader>
//         <CardContent className="space-y-4 pt-6">
//           {formData.supervisions.map((item, index) => (
//             <div
//               key={index}
//               className="flex gap-4 items-end bg-white p-3 border rounded-md"
//             >
//               <div className="flex-1 space-y-2">
//                 <Label>Date</Label>
//                 <Input
//                   type="date"
//                   value={item.date}
//                   onChange={(e) =>
//                     updateListField(
//                       "supervisions",
//                       index,
//                       "date",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//               <div className="flex-1 space-y-2">
//                 <Label>Type</Label>
//                 <Input
//                   value={item.type}
//                   placeholder="e.g. Monthly"
//                   onChange={(e) =>
//                     updateListField(
//                       "supervisions",
//                       index,
//                       "type",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//               <div className="flex-1 space-y-2">
//                 <Label className="flex">
//                   Notes{" "}
//                   <FileStatus
//                     isUploading={uploadingFields[`supervisions-${index}`]}
//                     isUploaded={!!item.url}
//                   />
//                 </Label>
//                 <Input
//                   type="file"
//                   onChange={(e) =>
//                     handleFileUpload(e, null, index, "supervisions")
//                   }
//                 />
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => removeListEntry("supervisions", index)}
//                 className="text-red-500"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* OTHER DOCUMENTS SECTION */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//           <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//             <FileText className="h-5 w-5" /> Other Relevant Documents
//           </CardTitle>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               addListEntry("other_documents", { name: "", url: "" })
//             }
//             className="border-[#1f6b4a] text-[#1f6b4a]"
//           >
//             <Plus className="h-4 w-4 mr-1" /> Add
//           </Button>
//         </CardHeader>
//         <CardContent className="space-y-4 pt-6">
//           {formData.other_documents.map((item, index) => (
//             <div
//               key={index}
//               className="flex gap-4 items-end bg-white p-3 border rounded-md"
//             >
//               <div className="flex-1 space-y-2">
//                 <Label>Document Title</Label>
//                 <Input
//                   value={item.name}
//                   onChange={(e) =>
//                     updateListField(
//                       "other_documents",
//                       index,
//                       "name",
//                       e.target.value,
//                     )
//                   }
//                   placeholder="e.g. Training Cert"
//                 />
//               </div>
//               <div className="flex-1 space-y-2">
//                 <Label className="flex">
//                   File{" "}
//                   <FileStatus
//                     isUploading={uploadingFields[`other_documents-${index}`]}
//                     isUploaded={!!item.url}
//                   />
//                 </Label>
//                 <Input
//                   type="file"
//                   onChange={(e) =>
//                     handleFileUpload(e, null, index, "other_documents")
//                   }
//                 />
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => removeListEntry("other_documents", index)}
//                 className="text-red-500"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       <div className="flex justify-end gap-4 pb-20">
//         <Button
//           variant="outline"
//           onClick={() => router.back()}
//           className="border-[#1f6b4a] text-[#1f6b4a]"
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           disabled={
//             isSubmitting || Object.values(uploadingFields).some(Boolean)
//           }
//           className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
//         >
//           {isSubmitting ? (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           ) : null}
//           Complete Enrollment
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default AddEmployeeForm;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Trash2,
  User,
  Briefcase,
  FileCheck,
  BookOpen,
  AlertCircle,
  GraduationCap,
  History,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AddEmployeeForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [uploadingFields, setUploadingFields] = useState({});

  const [itemToDelete, setItemToDelete] = useState(null); // { field: '', index: null, name: '' }
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. INITIAL STATE: Keys match DB and initialized as arrays to prevent .map() crashes
  const [formData, setFormData] = useState({
    id: crypto.randomUUID(),
    full_name: "",

    personal_records: [], // Personal Documents
    staff_documents: [], // Staff Records
    references_attachments: [], // Reference Document
    training_induction_records: [], // Training & Induction
    qualifications: [],
    supervisions: [],
    other_documents: [],
  });

  // Helper to calculate completion for the UI
  const getCompletionStatus = () => {
    const sections = [
      { name: "Full Name", filled: !!formData.full_name.trim() },
      { name: "Personal Docs", filled: formData.personal_records.length > 0 },
      { name: "Staff Records", filled: formData.staff_documents.length > 0 },
      {
        name: "References",
        filled: formData.references_attachments.length > 0,
      },
      {
        name: "Training",
        filled: formData.training_induction_records.length > 0,
      },
      { name: "Qualifications", filled: formData.qualifications.length > 0 },
      { name: "Supervisions", filled: formData.supervisions.length > 0 },
    ];
    const completedCount = sections.filter((s) => s.filled).length;
    return { sections, completedCount, total: sections.length };
  };

  const handleFileUpload = async (
    e,
    fieldName,
    index = null,
    listName = null,
  ) => {
    const file = e.target.files[0];
    if (!file) return;

    const trackKey = listName ? `${listName}-${index}` : fieldName;
    setUploadingFields((prev) => ({ ...prev, [trackKey]: true }));

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // UPDATED PATH LOGIC: ${employeeId}/${fieldName}/${fileName}
      const folderName = listName || fieldName;
      const filePath = `${formData.id}/${folderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("employee-docs") // Ensure your bucket is named 'documents'
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("employee-docs").getPublicUrl(filePath);

      if (listName) {
        updateListField(listName, index, "url", publicUrl);
      } else {
        setFormData((prev) => ({ ...prev, [fieldName]: publicUrl }));
      }
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploadingFields((prev) => ({ ...prev, [trackKey]: false }));
    }
  };

  const addListEntry = (field, initialValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), initialValue],
    }));
  };

  const updateListField = (field, index, key, value) => {
    setFormData((prev) => {
      const newList = [...prev[field]];
      newList[index] = { ...newList[index], [key]: value };
      return { ...prev, [field]: newList };
    });
  };

  const removeListEntry = async (field, index) => {
    const itemToRemove = formData[field][index];

    // Add a confirmation check
    if (itemToRemove.url || itemToRemove.name) {
      if (
        !confirm(
          `Are you sure you want to delete "${itemToRemove.name || "this document"}"?`,
        )
      ) {
        return;
      }
    }

    // If the item has a URL, delete it from Supabase Storage first
    if (itemToRemove.url) {
      try {
        // Extract the path from the URL
        // Example URL: .../storage/v1/object/public/employee-docs/folder/file.jpg
        // We need: folder/file.jpg
        const pathParts = itemToRemove.url.split("employee-docs/");
        const filePath = pathParts[1];

        if (filePath) {
          const { error } = await supabase.storage
            .from("employee-docs")
            .remove([filePath]);

          if (error) {
            console.error("Storage deletion error:", error);
            // We continue anyway to remove it from the form,
            // but we alert the user if it's a critical failure
          }
        }
      } catch (err) {
        console.error("Error parsing URL for deletion:", err);
      }
    }

    // Update the UI state to remove the entry
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

    toast.success("Document removed");
  };

  const triggerDeleteConfirm = (field, index) => {
    const item = formData[field][index];
    setItemToDelete({
      field,
      index,
      name: item.name || "this document",
      url: item.url,
    });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { field, index, url } = itemToDelete;

    setIsDeleting(true);
    try {
      if (url) {
        const pathParts = url.split("employee-docs/");
        const filePath = pathParts[1];
        if (filePath) {
          await supabase.storage.from("employee-docs").remove([filePath]);
        }
      }

      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
      toast.success("Document removed successfully");
    } catch (error) {
      toast.error("Failed to delete file from storage");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async () => {
    // COMPULSORY: Hard block if name is missing
    if (!formData.full_name || formData.full_name.trim() === "") {
      return toast.error("Full Name is required.");
    }

    // ALERT LOGIC: Check if other categories are empty
    const status = getCompletionStatus();
    if (status.completedCount < status.total) {
      setIsConfirmOpen(true);
    } else {
      processSave();
    }
  };

  const processSave = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("employees").insert([formData]);
      if (error) throw error;
      toast.success("Employee saved successfully");
      router.push(`/hrList/${formData.id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  const FileStatus = ({ isUploading, isUploaded }) => (
    <span className="ml-2">
      {isUploading ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      ) : isUploaded ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : null}
    </span>
  );

  const stats = getCompletionStatus();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-black">
          New Employee Enrollment
        </h1>
      </div>

      {/* Real-time Field Visibility/Completion Tracker */}
      <Card className="border-[#e1dbd2] bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">
              Form Completion
            </h3>
            <span className="text-xs font-bold text-black">
              {stats.completedCount} / {stats.total} complete
            </span>
          </div>
          <div className="flex gap-2">
            {stats.sections.map((s, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${s.filled ? "bg-black" : "bg-gray-200"}`}
                title={s.name}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
            {stats.sections.map((s, i) => (
              <span
                key={i}
                className={`text-[10px] flex items-center gap-1 ${s.filled ? "text-black font-medium" : "text-gray-400"}`}
              >
                {s.filled ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}{" "}
                {s.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Name Section */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2]">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-[#123d2b] font-bold">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Compulsory Field"
              className="bg-white border-[#e1dbd2]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Sections */}
      {[
        { id: "personal_records", title: "Personal Documents", icon: User },
        { id: "staff_documents", title: "Staff Records", icon: Briefcase },
        {
          id: "references_attachments",
          title: "Reference Document",
          icon: FileCheck,
        },
        {
          id: "training_induction_records",
          title: "Training & Induction",
          icon: BookOpen,
        },
        { id: "qualifications", title: "Qualifications", icon: GraduationCap },
        { id: "supervisions", title: "Supervisions", icon: History },
        {
          id: "other_documents",
          title: "Other Relevant Documents",
          icon: FileText,
        },
      ].map((section) => (
        <Card key={section.id} className="bg-[#fbf8f2] border-[#e1dbd2]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#e1dbd2]">
            <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
              <section.icon className="h-5 w-5" /> {section.title}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListEntry(section.id, { name: "", url: "" })}
              className="border-[#1f6b4a] text-black bg-white"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {formData[section.id]?.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-end bg-white p-3 border border-[#e1dbd2] rounded-md shadow-sm"
              >
                <div className="flex-1 space-y-2">
                  <Label>Document Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateListField(section.id, index, "name", e.target.value)
                    }
                    placeholder="e.g. Passport, Level 1 Cert"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="flex">
                    File{" "}
                    <FileStatus
                      isUploading={uploadingFields[`${section.id}-${index}`]}
                      isUploaded={!!item.url}
                    />
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.xlsx,image/*"
                    onChange={(e) =>
                      handleFileUpload(e, null, index, section.id)
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => triggerDeleteConfirm(section.id, index)} // UPDATED CALL
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end gap-4 pb-20 pt-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-[#123d2b] text-[#123d2b]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-black hover:bg-[#123d2b] px-10 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Complete Enrollment"
          )}
        </Button>
      </div>

      {/* Warning Dialog for Missing Fields */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-[#f7f2e9] border-[#e1dbd2]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#123d2b]">
              Missing Information
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              You haven't uploaded files for all sections or filled all details.
              Only the Full Name is required, but incomplete records may affect
              Safer Recruitment. Save anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#123d2b]">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={processSave}
              className="bg-black text-white"
            >
              Save Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Pop-up */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={() => !isDeleting && setItemToDelete(null)}
      >
        <AlertDialogContent className="bg-[#f7f2e9] border-[#e1dbd2]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#123d2b] flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" /> Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{itemToDelete?.name}</strong>? This will permanently
              remove the file from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-[#123d2b]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-close to handle async deletion
                handleConfirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddEmployeeForm;
