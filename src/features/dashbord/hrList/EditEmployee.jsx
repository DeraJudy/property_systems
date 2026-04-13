
// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   ArrowLeft,
//   FileText,
//   Camera,
//   CheckCircle2,
//   Loader2,
//   Save,
//   ExternalLink,
//   Plus,
//   GraduationCap,
//   History,
//   Trash2,
//   AlertTriangle
// } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// const EditEmployeeForm = () => {
//   const router = useRouter();
//   const { id } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadingFields, setUploadingFields] = useState({});

//   const [formData, setFormData] = useState({
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
//     // URLs from Supabase Storage
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
//     dbs_trace_notes_url: "",
//     sickness_disciplinary_urls: [],
//     // Dynamic lists synced from AddEmployee
//     qualifications: [],
//     supervisions: [],
//     other_documents: [],
//   });

//   // 1. FETCH DATA: Bring out all information already stored
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("employees")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) throw error;
//     if (data) {
//       const sanitizedData = { ...data };
      
//       // FORCE these to be arrays so .map() never fails
//       sanitizedData.qualifications = Array.isArray(data.qualifications) ? data.qualifications : [];
//       sanitizedData.supervisions = Array.isArray(data.supervisions) ? data.supervisions : [];
//       sanitizedData.other_documents = Array.isArray(data.other_documents) ? data.other_documents : [];

//       // Convert other nulls to empty strings for standard inputs
//       Object.keys(sanitizedData).forEach(key => {
//         if (sanitizedData[key] === null && !['qualifications', 'supervisions', 'other_documents'].includes(key)) {
//           sanitizedData[key] = '';
//         }
//       });

//       setFormData(sanitizedData);
//     }
//   } catch (error) {
//     toast.error("Failed to load employee data");
//     router.push("/hrList");
//   } finally {
//     setLoading(false);
//   }
// };

//     if (id) fetchEmployeeData();
//   }, [id, router]);

//   const fetchEmployeeData = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("employees")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) throw error;
//       if (data) {
//         // Create a sanitized object where all null values become empty strings
//         const sanitizedData = Object.keys(data).reduce((acc, key) => {
//           // If the value is null, set it to '' (unless it's a boolean or array)
//           if (data[key] === null) {
//             acc[key] = typeof data[key] === "boolean" ? false : "";
//           } else {
//             acc[key] = data[key];
//           }
//           return acc;
//         }, {});

//         setFormData({
//           ...sanitizedData,
//           // Explicitly ensure dynamic arrays are handled
//           qualifications: data.qualifications || [],
//           supervisions: data.supervisions || [],
//           other_documents: data.other_documents || [],
//         });
//       }
//     } catch (error) {
//       toast.error("Failed to load employee data");
//       router.push("/hrList");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Synced handleFileUpload from AddEmployee with "trackKey" for dynamic lists
//   const handleFileUpload = async (
//     e,
//     fieldName,
//     index = null,
//     listName = null,
//     isMultiple = false,
//   ) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const trackKey = listName ? `${listName}-${index}` : fieldName;
//     setUploadingFields((prev) => ({ ...prev, [trackKey]: true }));

//     try {
//       const uploadResults = await Promise.all(
//         files.map(async (file) => {
//           const fileExt = file.name.split(".").pop();
//           const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
//           const filePath = `employee-docs/${formData.full_name || "unnamed"}/${listName || fieldName}/${fileName}`;

//           const { error: uploadError } = await supabase.storage
//             .from("employee-docs")
//             .upload(filePath, file);

//           if (uploadError) throw uploadError;

//           const { data } = supabase.storage
//             .from("employee-docs")
//             .getPublicUrl(filePath);
//           return data.publicUrl;
//         }),
//       );

//       if (listName !== null && index !== null) {
//         const newList = [...formData[listName]];
//         newList[index] = { ...newList[index], url: uploadResults[0] };
//         setFormData((prev) => ({ ...prev, [listName]: newList }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           [fieldName]: isMultiple
//             ? [...(prev[fieldName] || []), ...uploadResults]
//             : uploadResults[0],
//         }));
//       }
//       toast.success("File uploaded successfully");
//     } catch (error) {
//       console.error("Upload failed:", error);
//       toast.error("Upload failed.");
//     } finally {
//       setUploadingFields((prev) => ({ ...prev, [trackKey]: false }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//   setIsSubmitting(true);

//   try {
//     // 1. Create a deep copy of the data
//     const submissionData = JSON.parse(JSON.stringify(formData));

//     // 2. GLOBAL SANITIZER: Loop through every field
//     // If a field is an empty string, make it null so the DB doesn't complain
//     Object.keys(submissionData).forEach((key) => {
//       if (submissionData[key] === "") {
//         submissionData[key] = null;
//       }
//     });

//     // 3. NESTED SANITIZER: Handle dates inside dynamic arrays
//     const listFields = ['qualifications', 'supervisions', 'other_documents'];
//     listFields.forEach(listName => {
//       if (Array.isArray(submissionData[listName])) {
//         submissionData[listName] = submissionData[listName].map(item => {
//           const cleanedItem = { ...item };
//           Object.keys(cleanedItem).forEach(subKey => {
//             if (cleanedItem[subKey] === "") {
//               cleanedItem[subKey] = null;
//             }
//           });
//           return cleanedItem;
//         });
        
//         // If the list itself is empty, set it to null
//         if (submissionData[listName].length === 0) {
//           submissionData[listName] = null;
//         }
//       }
//     });

//     // 4. Update Database
//     const { error } = await supabase
//       .from('employees')
//       .update(submissionData)
//       .eq('id', id);

//     if (error) throw error;

//     toast.success("Employee record updated successfully!");
//     router.refresh();
//     router.push("/hrList");
//   } catch (error) {
//     console.error("Update failed:", error);
//     toast.error(`Update failed: ${error.message}`);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   // Helper to view and track files
//   const FileStatus = ({ isUploading, url }) => (
//     <div className="flex items-center gap-2 ml-2">
//       {isUploading ? (
//         <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//       ) : url ? (
//         <>
//           <CheckCircle2 className="h-4 w-4 text-green-500" />
//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-xs text-blue-600 hover:underline flex items-center gap-1"
//           >
//             View <ExternalLink className="h-3 w-3" />
//           </a>
//         </>
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

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#f5f0e6]">
//         <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen space-y-8 bg-[#f5f0e6]">
//       <div className="max-w-5xl mx-auto mb-6">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="text-[#123d2b] hover:bg-[#e1dbd2]"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//         </Button>
//       </div>

//       <div className="flex justify-between items-center max-w-5xl mx-auto">
//         <h1 className="text-2xl font-bold text-[#123d2b]">
//           Edit Employee Record
//         </h1>
//       </div>

//       <div className="max-w-5xl mx-auto space-y-8">
//         {/* SECTION 1: PERSONAL DETAILS */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">
//               Personal Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//             <div className="space-y-2">
//               <Label>Full Name</Label>
//               <Input
//                 name="full_name"
//                 value={formData.full_name}
//                 onChange={handleInputChange}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Date of Birth</Label>
//               <Input
//                 name="dob"
//                 type="date"
//                 value={formData.dob}
//                 onChange={handleInputChange}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Job Role</Label>
//               <Input
//                 name="job_role"
//                 value={formData.job_role}
//                 onChange={handleInputChange}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Contact Information</Label>
//               <Input
//                 name="contact_info"
//                 value={formData.contact_info}
//                 onChange={handleInputChange}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Evidence of Address{" "}
//                 <FileStatus
//                   isUploading={uploadingFields["evidence_address_url"]}
//                   url={formData.evidence_address_url}
//                 />
//               </Label>
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "evidence_address_url")}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//                 <FileText className="text-[#6b7d74]" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Photographic ID{" "}
//                 <FileStatus
//                   isUploading={uploadingFields["photo_id_url"]}
//                   url={formData.photo_id_url}
//                 />
//               </Label>
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "photo_id_url")}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//                 <Camera className="text-[#6b7d74]" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* SECTION 2: STAFF FILES & COMPLIANCE */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">
//               Staff Files & Compliance
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6 pt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label className="flex items-center">
//                   Signed Application Form{" "}
//                   <FileStatus
//                     isUploading={uploadingFields["signed_app_url"]}
//                     url={formData.signed_app_url}
//                   />
//                 </Label>
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "signed_app_url")}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">
//                   Interview Notes{" "}
//                   <FileStatus
//                     isUploading={uploadingFields["interview_notes_url"]}
//                     url={formData.interview_notes_url}
//                   />
//                 </Label>
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "interview_notes_url")}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//               </div>
//               {/* <div className="space-y-2">
//                 <Label>DBS Number</Label>
//                 <Input
//                   name="dbs_number"
//                   value={formData.dbs_number}
//                   onChange={handleInputChange}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>DBS Completion Date</Label>
//                 <Input
//                   name="dbs_completion_date"
//                   type="date"
//                   value={formData.dbs_completion_date}
//                   onChange={handleInputChange}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//               </div> */}
//               <div className="space-y-2">
//                 <Label className="flex items-center">
//                   Right to Work / Conduct{" "}
//                   <FileStatus
//                     isUploading={uploadingFields["rtw_check_url"]}
//                     url={formData.rtw_check_url}
//                   />
//                 </Label>
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "rtw_check_url")}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">
//                   Insurance/Registration{" "}
//                   <FileStatus
//                     isUploading={uploadingFields["insurance_url"]}
//                     url={formData.insurance_url}
//                   />
//                 </Label>
//                 <Input
//                   type="file"
//                   onChange={(e) => handleFileUpload(e, "insurance_url")}
//                   className="bg-white border-[#e1dbd2]"
//                 />
//               </div>
//             </div>

//             {/* DBS TRACE RISK ASSESSMENT SECTION */}
//                       <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 space-y-3">
//                         <h4 className="font-semibold text-[#123d2b] mb-4">DBS</h4>
//                         <div className="space-y-2">
//                           <Label>DBS Number</Label>
//                           <Input
//                             name="dbs_number"
//                             value={formData.dbs_number}
//                             onChange={handleInputChange}
//                             className="bg-[#e1dbd2] border-none"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>DBS Completion Date</Label>
//                           <Input
//                             name="dbs_completion_date"
//                             type="date"
//                             value={formData.dbs_completion_date}
//                             onChange={handleInputChange}
//                             className="bg-[#e1dbd2] border-none"
//                           />
//                         </div>
            
//                         <h4 className="font-semibold text-orange-900 flex items-center gap-2 mt-8">
//                           <AlertTriangle className="h-4 w-4" /> DBS Trace Risk Evaluation
//                         </h4>
//                         <div className="space-y-2">
//                           <Label className="text-orange-800">
//                             Risk Assessment & Evaluation Evidence (Required if trace exists)
//                           </Label>
//                           <div className="flex items-center gap-2">
//                             <Input
//                               type="file"
//                               onChange={(e) => handleFileUpload(e, "dbs_trace_notes_url")}
//                               className="bg-white border-orange-200"
//                             />
//                             <FileStatus
//                               isUploading={uploadingFields["dbs_trace_notes_url"]}
//                               isUploaded={!!formData.dbs_trace_notes_url}
//                             />
//                           </div>
//                           <p className="text-xs text-orange-700 italic">
//                             Upload evidence of the appointing officer's evaluation of any
//                             trace highlighted on the DBS check.
//                           </p>
//                         </div>
//                       </div>

//             <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
//               <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center mb-2">
//                     <Label>Referee 1</Label>
//                     <FileStatus
//                       isUploading={uploadingFields["ref1_doc_url"]}
//                       url={formData.ref1_doc_url}
//                     />
//                   </div>
//                   <Input
//                     name="ref1_name"
//                     value={formData.ref1_name}
//                     onChange={handleInputChange}
//                     className="bg-white mb-2"
//                   />
//                   <Input
//                     name="ref1_email"
//                     value={formData.ref1_email}
//                     onChange={handleInputChange}
//                     className="bg-white mb-2"
//                   />
//                   <Input
//                     type="file"
//                     onChange={(e) => handleFileUpload(e, "ref1_doc_url")}
//                     className="bg-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center mb-2">
//                     <Label>Referee 2</Label>
//                     <FileStatus
//                       isUploading={uploadingFields["ref2_doc_url"]}
//                       url={formData.ref2_doc_url}
//                     />
//                   </div>
//                   <Input
//                     name="ref2_name"
//                     value={formData.ref2_name}
//                     onChange={handleInputChange}
//                     className="bg-white mb-2"
//                   />
//                   <Input
//                     name="ref2_email"
//                     value={formData.ref2_email}
//                     onChange={handleInputChange}
//                     className="bg-white mb-2"
//                   />
//                   <Input
//                     type="file"
//                     onChange={(e) => handleFileUpload(e, "ref2_doc_url")}
//                     className="bg-white"
//                   />
//                 </div>
//               </div>
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="refs_verified"
//                     checked={formData.refs_verified_by_phone}
//                     onCheckedChange={(checked) =>
//                       setFormData((p) => ({
//                         ...p,
//                         refs_verified_by_phone: checked,
//                       }))
//                     }
//                   />
//                   <Label
//                     htmlFor="refs_verified"
//                     className="text-blue-900 font-medium"
//                   >
//                     References verified by follow-up telephone call
//                   </Label>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Verification Details</Label>
//                   <Input
//                     name="verification_details"
//                     value={formData.verification_details}
//                     onChange={handleInputChange}
//                     className="bg-white border-blue-200"
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* SECTION 3: TRAINING */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">
//               Training & Induction
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//             <div className="space-y-2">
//               <Label>Start Date</Label>
//               <Input
//                 name="start_date"
//                 type="date"
//                 value={formData.start_date}
//                 onChange={handleInputChange}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Induction Completed Date</Label>
//               <Input
//                 name="induction_completed_date"
//                 type="date"
//                 value={formData.induction_completed_date}
//                 onChange={handleInputChange}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Induction Checklist{" "}
//                 <FileStatus
//                   isUploading={uploadingFields["induction_checklist_url"]}
//                   url={formData.induction_checklist_url}
//                 />
//               </Label>
//               <Input
//                 type="file"
//                 onChange={(e) => handleFileUpload(e, "induction_checklist_url")}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Training Records{" "}
//                 <FileStatus
//                   isUploading={uploadingFields["training_record_url"]}
//                   url={formData.training_record_url}
//                 />
//               </Label>
//               <Input
//                 type="file"
//                 onChange={(e) => handleFileUpload(e, "training_record_url")}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Last Annual Appraisal Date</Label>
//               <Input
//                 name="last_appraisal_date"
//                 type="date"
//                 value={formData.last_appraisal_date}
//                 onChange={handleInputChange}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">
//                 Appraisal Docs{" "}
//                 <FileStatus
//                   isUploading={uploadingFields["appraisal_doc_url"]}
//                   isUploaded={!!formData.appraisal_doc_url}
//                 />
//               </Label>
//               <Input
//                 type="file"
//                 onChange={(e) => handleFileUpload(e, "appraisal_doc_url")}
//                 className="bg-white border-[#e1dbd2]"
//               />
//             </div>
//             <div className="space-y-2 col-span-full">
//               <Label className="flex items-center">Sickness <FileStatus isUploading={uploadingFields['sickness_disciplinary_urls']} isUploaded={formData.sickness_disciplinary_urls.length > 0}/></Label>
//               <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'sickness_disciplinary_urls', null, null, true)} className="bg-white border-[#e1dbd2]" />
//             </div>
//           </CardContent>
//         </Card>

//         {/* SECTION 4: QUALIFICATIONS (DYNAMIC) */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//             <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//               <GraduationCap className="h-5 w-5" /> Qualifications
//             </CardTitle>
//             <Button
//               size="sm"
//               onClick={() =>
//                 addListEntry("qualifications", { name: "", url: "" })
//               }
//               className="bg-[#1f6b4a]"
//             >
//               <Plus className="h-4 w-4 mr-1" /> Add Qualification
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.qualifications.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm"
//               >
//                 <div className="flex-1 space-y-2">
//                   <Label>Qualification Name</Label>
//                   <Input
//                     value={item.name}
//                     onChange={(e) =>
//                       updateListField(
//                         "qualifications",
//                         index,
//                         "name",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex">
//                     Document{" "}
//                     <FileStatus
//                       isUploading={uploadingFields[`qualifications-${index}`]}
//                       url={item.url}
//                     />
//                   </Label>
//                   <Input
//                     type="file"
//                     onChange={(e) =>
//                       handleFileUpload(e, null, index, "qualifications")
//                     }
//                   />
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeListEntry("qualifications", index)}
//                   className="text-red-500"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* SECTION 5: SUPERVISION HISTORY (DYNAMIC) */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//             <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//               <History className="h-5 w-5" /> Supervision History
//             </CardTitle>
//             <Button
//               size="sm"
//               onClick={() =>
//                 addListEntry("supervisions", { name: "", date: "", url: "" })
//               }
//               className="bg-[#1f6b4a]"
//             >
//               <Plus className="h-4 w-4 mr-1" /> Add Supervision
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.supervisions.map((item, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-3 border rounded-md shadow-sm"
//               >
//                 <div className="space-y-2">
//                   <Label>Session Name</Label>
//                   <Input
//                     value={item.name}
//                     onChange={(e) =>
//                       updateListField(
//                         "supervisions",
//                         index,
//                         "name",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Date</Label>
//                   <Input
//                     type="date"
//                     value={item.date}
//                     onChange={(e) =>
//                       updateListField(
//                         "supervisions",
//                         index,
//                         "date",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="flex">
//                     Notes{" "}
//                     <FileStatus
//                       isUploading={uploadingFields[`supervisions-${index}`]}
//                       url={item.url}
//                     />
//                   </Label>
//                   <Input
//                     type="file"
//                     onChange={(e) =>
//                       handleFileUpload(e, null, index, "supervisions")
//                     }
//                   />
//                 </div>
//                 <div className="flex justify-end">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeListEntry("supervisions", index)}
//                     className="text-red-500"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* SECTION 6: OTHER DOCUMENTS (DYNAMIC) */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//             <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//               <FileText className="h-5 w-5" /> Additional Documents
//             </CardTitle>
//             <Button
//               size="sm"
//               onClick={() =>
//                 addListEntry("other_documents", { name: "", url: "" })
//               }
//               className="bg-[#1f6b4a]"
//             >
//               <Plus className="h-4 w-4 mr-1" /> Add Document
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.other_documents.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm"
//               >
//                 <div className="flex-1 space-y-2">
//                   <Label>Document Label</Label>
//                   <Input
//                     value={item.name}
//                     onChange={(e) =>
//                       updateListField(
//                         "other_documents",
//                         index,
//                         "name",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex">
//                     File{" "}
//                     <FileStatus
//                       isUploading={uploadingFields[`other_documents-${index}`]}
//                       url={item.url}
//                     />
//                   </Label>
//                   <Input
//                     type="file"
//                     onChange={(e) =>
//                       handleFileUpload(e, null, index, "other_documents")
//                     }
//                   />
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeListEntry("other_documents", index)}
//                   className="text-red-500"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <div className="flex justify-end gap-4 pb-20">
//           <Button
//             variant="outline"
//             onClick={() => router.back()}
//             className="border-[#1f6b4a] text-[#1f6b4a]"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={
//               isSubmitting || Object.values(uploadingFields).some(Boolean)
//             }
//             className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
//           >
//             {isSubmitting ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Save className="mr-2 h-4 w-4" />
//             )}
//             Save Changes
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditEmployeeForm;



"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  FileText,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  ExternalLink,
  Plus,
  GraduationCap,
  History,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const EditEmployeeForm = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFields, setUploadingFields] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    job_role: "",
    contact_info: "",
    dbs_number: "",
    dbs_completion_date: "",
    start_date: "",
    induction_completed_date: "",
    last_appraisal_date: "",
    ref1_name: "",
    ref1_email: "",
    ref2_name: "",
    ref2_email: "",
    refs_verified_by_phone: false,
    verification_details: "",
    // URLs from Supabase Storage
    evidence_address_url: "",
    photo_id_url: "",
    signed_app_url: "",
    interview_notes_url: "",
    rtw_check_url: "",
    insurance_url: "",
    ref1_doc_url: "",
    ref2_doc_url: "",
    induction_checklist_url: "",
    training_record_url: "",
    appraisal_doc_url: "",
    dbs_trace_notes_url: "", // Added field
    sickness_disciplinary_urls: [],
    // Dynamic lists synced from AddEmployee
    qualifications: [],
    supervisions: [],
    other_documents: [],
  });

  // 1. FETCH DATA: Bring out all information already stored
  useEffect(() => {
    const fetchEmployeeData = async () => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data) {
      const sanitizedData = { ...data };
      
      // FORCE these to be arrays so .map() never fails
      sanitizedData.qualifications = Array.isArray(data.qualifications) ? data.qualifications : [];
      sanitizedData.supervisions = Array.isArray(data.supervisions) ? data.supervisions : [];
      sanitizedData.other_documents = Array.isArray(data.other_documents) ? data.other_documents : [];

      // Convert other nulls to empty strings for standard inputs
      Object.keys(sanitizedData).forEach(key => {
        if (sanitizedData[key] === null && !['qualifications', 'supervisions', 'other_documents'].includes(key)) {
          sanitizedData[key] = '';
        }
      });

      setFormData(sanitizedData);
    }
  } catch (error) {
    toast.error("Failed to load employee data");
    router.push("/hrList");
  } finally {
    setLoading(false);
  }
};

    if (id) fetchEmployeeData();
  }, [id, router]);

  // Synced handleFileUpload from AddEmployee with "trackKey" for dynamic lists
//   const handleFileUpload = async (
//     e,
//     fieldName,
//     index = null,
//     listName = null,
//     isMultiple = false,
//   ) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const trackKey = listName ? `${listName}-${index}` : fieldName;
//     setUploadingFields((prev) => ({ ...prev, [trackKey]: true }));

//     try {
//       const uploadResults = await Promise.all(
//         files.map(async (file) => {
//           const fileExt = file.name.split(".").pop();
//           const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
//           // Ensure we have an ID to use for the folder name
// const folderId = formData.id || 'temp_id'; 

// // New structure: [Employee ID]/[Category]/[File]
// const filePath = `${folderId}/${fieldName}/${fileName}`;

//           const { error: uploadError } = await supabase.storage
//             .from("employee-docs")
//             .upload(filePath, file);

//           if (uploadError) throw uploadError;

//           const { data } = supabase.storage
//             .from("employee-docs")
//             .getPublicUrl(filePath);
//           return data.publicUrl;
//         }),
//       );

//       if (listName !== null && index !== null) {
//         const newList = [...formData[listName]];
//         newList[index] = { ...newList[index], url: uploadResults[0] };
//         setFormData((prev) => ({ ...prev, [listName]: newList }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           [fieldName]: isMultiple
//             ? [...(prev[fieldName] || []), ...uploadResults]
//             : uploadResults[0],
//         }));
//       }
//       toast.success("File uploaded successfully");
//     } catch (error) {
//       console.error("Upload failed:", error);
//       toast.error("Upload failed.");
//     } finally {
//       setUploadingFields((prev) => ({ ...prev, [trackKey]: false }));
//     }
//   };

  const handleFileUpload = async (
  e,
  fieldName,
  index = null,
  listName = null,
  isMultiple = false,
) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  // In Edit mode, formData.id will already exist from the database
  const employeeId = formData.id;

  if (!employeeId) {
    toast.error("Employee ID missing. Cannot upload.");
    return;
  }

  const trackKey = listName ? `${listName}-${index}` : fieldName;
  setUploadingFields((prev) => ({ ...prev, [trackKey]: true }));

  try {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Uses the same structure: ID / FIELD / FILE
        const filePath = `${employeeId}/${fieldName}/${fileName}`;

        // --- OPTIONAL: OLD FILE CLEANUP ---
        // If you want to delete the previous file before uploading the new one:
        const oldUrl = listName !== null && index !== null 
          ? formData[listName][index]?.url 
          : formData[fieldName];
          
        if (oldUrl && typeof oldUrl === 'string' && oldUrl.includes('employee-docs')) {
           const oldPath = oldUrl.split('/employee-docs/')[1];
           await supabase.storage.from("employee-docs").remove([decodeURIComponent(oldPath)]);
        }
        // ----------------------------------

        const { error: uploadError } = await supabase.storage
          .from("employee-docs")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("employee-docs")
          .getPublicUrl(filePath);

        return data.publicUrl;
      }),
    );

    // State update logic (same as your Add form)
    if (listName !== null && index !== null) {
      const newList = [...formData[listName]];
      newList[index] = { ...newList[index], url: uploadResults[0] };
      setFormData((prev) => ({ ...prev, [listName]: newList }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: isMultiple
          ? [...(prev[fieldName] || []), ...uploadResults]
          : uploadResults[0],
      }));
    }
    toast.success("File updated successfully");
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Upload failed");
  } finally {
    setUploadingFields((prev) => ({ ...prev, [trackKey]: false }));
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    // 1. Create a deep copy of the data
    const submissionData = JSON.parse(JSON.stringify(formData));

    // 2. GLOBAL SANITIZER: Loop through every field
    // If a field is an empty string, make it null so the DB doesn't complain
    Object.keys(submissionData).forEach((key) => {
      if (submissionData[key] === "") {
        submissionData[key] = null;
      }
    });

    // 3. NESTED SANITIZER: Handle dates inside dynamic arrays
    const listFields = ['qualifications', 'supervisions', 'other_documents'];
    listFields.forEach(listName => {
      if (Array.isArray(submissionData[listName])) {
        submissionData[listName] = submissionData[listName].map(item => {
          const cleanedItem = { ...item };
          Object.keys(cleanedItem).forEach(subKey => {
            if (cleanedItem[subKey] === "") {
              cleanedItem[subKey] = null;
            }
          });
          return cleanedItem;
        });
        
        // If the list itself is empty, set it to null
        if (submissionData[listName].length === 0) {
          submissionData[listName] = null;
        }
      }
    });

    // 4. Update Database
    const { error } = await supabase
      .from('employees')
      .update(submissionData)
      .eq('id', id);

    if (error) throw error;

    toast.success("Employee record updated successfully!");
    router.refresh();
    router.push("/hrList");
  } catch (error) {
    console.error("Update failed:", error);
    toast.error(`Update failed: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  // Helper to view and track files
  const FileStatus = ({ isUploading, url }) => (
    <div className="flex items-center gap-2 ml-2">
      {isUploading ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      ) : url ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        </>
      ) : null}
    </div>
  );

  const addListEntry = (listName, schema) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: [...prev[listName], schema],
    }));
  };

  const removeListEntry = (listName, index) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    }));
  };

  const updateListField = (listName, index, field, value) => {
    const newList = [...formData[listName]];
    newList[index][field] = value;
    setFormData((prev) => ({ ...prev, [listName]: newList }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f0e6]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen space-y-8">
      <div className="max-w-5xl mx-auto mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-[#123d2b] hover:bg-[#e1dbd2]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#123d2b]">
          Edit Employee Record
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* SECTION 1: PERSONAL DETAILS */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2]">
            <CardTitle className="text-[#123d2b] text-lg">
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label>Job Role</Label>
              <Input
                name="job_role"
                value={formData.job_role}
                onChange={handleInputChange}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Information</Label>
              <Input
                name="contact_info"
                value={formData.contact_info}
                onChange={handleInputChange}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                Evidence of Address{" "}
                <FileStatus
                  isUploading={uploadingFields["evidence_address_url"]}
                  url={formData.evidence_address_url}
                />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "evidence_address_url")}
                  className="bg-white border-[#e1dbd2]"
                />
                <FileText className="text-[#6b7d74]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                Photographic ID{" "}
                <FileStatus
                  isUploading={uploadingFields["photo_id_url"]}
                  url={formData.photo_id_url}
                />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "photo_id_url")}
                  className="bg-white border-[#e1dbd2]"
                />
                <Camera className="text-[#6b7d74]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: STAFF FILES & COMPLIANCE */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2]">
            <CardTitle className="text-[#123d2b] text-lg">
              Staff Files & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center">
                  Signed Application Form{" "}
                  <FileStatus
                    isUploading={uploadingFields["signed_app_url"]}
                    url={formData.signed_app_url}
                  />
                </Label>
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "signed_app_url")}
                  className="bg-white border-[#e1dbd2]"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  Interview Notes{" "}
                  <FileStatus
                    isUploading={uploadingFields["interview_notes_url"]}
                    url={formData.interview_notes_url}
                  />
                </Label>
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "interview_notes_url")}
                  className="bg-white border-[#e1dbd2]"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  Right to Work / Conduct{" "}
                  <FileStatus
                    isUploading={uploadingFields["rtw_check_url"]}
                    url={formData.rtw_check_url}
                  />
                </Label>
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "rtw_check_url")}
                  className="bg-white border-[#e1dbd2]"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  Insurance/Registration{" "}
                  <FileStatus
                    isUploading={uploadingFields["insurance_url"]}
                    url={formData.insurance_url}
                  />
                </Label>
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "insurance_url")}
                  className="bg-white border-[#e1dbd2]"
                />
              </div>
            </div>

            {/* DBS TRACE RISK ASSESSMENT SECTION */}
            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 space-y-3">
              <h4 className="font-semibold text-[#123d2b] mb-4">DBS</h4>
              <div className="space-y-2">
                <Label>DBS Number</Label>
                <Input
                  name="dbs_number"
                  value={formData.dbs_number}
                  onChange={handleInputChange}
                  className="bg-white border-[#e1dbd2]"
                />
              </div>
              <div className="space-y-2">
                <Label>DBS Completion Date</Label>
                <Input
                  name="dbs_completion_date"
                  type="date"
                  value={formData.dbs_completion_date}
                  onChange={handleInputChange}
                  className="bg-white border-[#e1dbd2]"
                />
              </div>

              <h4 className="font-semibold text-orange-900 flex items-center gap-2 mt-8">
                <AlertTriangle className="h-4 w-4" /> DBS Trace Risk Evaluation
              </h4>
              <div className="space-y-2">
                <Label className="text-orange-800">
                  Risk Assessment & Evaluation Evidence (Required if trace exists)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "dbs_trace_notes_url")}
                    className="bg-white border-orange-200"
                  />
                  <FileStatus
                    isUploading={uploadingFields["dbs_trace_notes_url"]}
                    url={formData.dbs_trace_notes_url}
                  />
                </div>
                <p className="text-xs text-orange-700 italic">
                  Upload evidence of the appointing officer's evaluation of any
                  trace highlighted on the DBS check.
                </p>
              </div>
            </div>

            <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
              <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Referee 1</Label>
                    <FileStatus
                      isUploading={uploadingFields["ref1_doc_url"]}
                      url={formData.ref1_doc_url}
                    />
                  </div>
                  <Input
                    name="ref1_name"
                    value={formData.ref1_name}
                    onChange={handleInputChange}
                    className="bg-white mb-2"
                  />
                  <Input
                    name="ref1_email"
                    value={formData.ref1_email}
                    onChange={handleInputChange}
                    className="bg-white mb-2"
                  />
                  <Input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "ref1_doc_url")}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Referee 2</Label>
                    <FileStatus
                      isUploading={uploadingFields["ref2_doc_url"]}
                      url={formData.ref2_doc_url}
                    />
                  </div>
                  <Input
                    name="ref2_name"
                    value={formData.ref2_name}
                    onChange={handleInputChange}
                    className="bg-white mb-2"
                  />
                  <Input
                    name="ref2_email"
                    value={formData.ref2_email}
                    onChange={handleInputChange}
                    className="bg-white mb-2"
                  />
                  <Input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "ref2_doc_url")}
                    className="bg-white"
                  />
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="refs_verified"
                    checked={formData.refs_verified_by_phone}
                    onCheckedChange={(checked) =>
                      setFormData((p) => ({
                        ...p,
                        refs_verified_by_phone: checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="refs_verified"
                    className="text-blue-900 font-medium"
                  >
                    References verified by follow-up telephone call
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>Verification Details</Label>
                  <Input
                    name="verification_details"
                    value={formData.verification_details}
                    onChange={handleInputChange}
                    className="bg-white border-blue-200"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: TRAINING */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2]">
            <CardTitle className="text-[#123d2b] text-lg">
              Training & Induction
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label>Induction Completed Date</Label>
              <Input
                name="induction_completed_date"
                type="date"
                value={formData.induction_completed_date}
                onChange={handleInputChange}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                Induction Checklist{" "}
                <FileStatus
                  isUploading={uploadingFields["induction_checklist_url"]}
                  url={formData.induction_checklist_url}
                />
              </Label>
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, "induction_checklist_url")}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                Training Records{" "}
                <FileStatus
                  isUploading={uploadingFields["training_record_url"]}
                  url={formData.training_record_url}
                />
              </Label>
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, "training_record_url")}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Annual Appraisal Date</Label>
              <Input
                name="last_appraisal_date"
                type="date"
                value={formData.last_appraisal_date}
                onChange={handleInputChange}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                Appraisal Docs{" "}
                <FileStatus
                  isUploading={uploadingFields["appraisal_doc_url"]}
                  url={formData.appraisal_doc_url}
                />
              </Label>
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, "appraisal_doc_url")}
                className="bg-white border-[#e1dbd2]"
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label className="flex items-center">
                Sickness 
                <FileStatus 
                  isUploading={uploadingFields['sickness_disciplinary_urls']} 
                  url={formData.sickness_disciplinary_urls?.[0]}
                />
              </Label>
              <Input 
                type="file" 
                multiple 
                onChange={(e) => handleFileUpload(e, 'sickness_disciplinary_urls', null, null, true)} 
                className="bg-white border-[#e1dbd2]" 
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: QUALIFICATIONS (DYNAMIC) */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
            <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Qualifications
            </CardTitle>
            <Button
              size="sm"
              onClick={() =>
                addListEntry("qualifications", { name: "", url: "" })
              }
              className="bg-[#1f6b4a]"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Qualification
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {formData.qualifications.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm"
              >
                <div className="flex-1 space-y-2">
                  <Label>Qualification Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateListField(
                        "qualifications",
                        index,
                        "name",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="flex">
                    Document{" "}
                    <FileStatus
                      isUploading={uploadingFields[`qualifications-${index}`]}
                      url={item.url}
                    />
                  </Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(e, null, index, "qualifications")
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListEntry("qualifications", index)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SECTION 5: SUPERVISION HISTORY (DYNAMIC) */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
            <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
              <History className="h-5 w-5" /> Supervision History
            </CardTitle>
            <Button
              size="sm"
              onClick={() =>
                addListEntry("supervisions", { name: "", date: "", url: "" })
              }
              className="bg-[#1f6b4a]"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Supervision
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {formData.supervisions.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-3 border rounded-md shadow-sm"
              >
                <div className="space-y-2">
                  <Label>Session Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateListField(
                        "supervisions",
                        index,
                        "name",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      updateListField(
                        "supervisions",
                        index,
                        "date",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex">
                    Notes{" "}
                    <FileStatus
                      isUploading={uploadingFields[`supervisions-${index}`]}
                      url={item.url}
                    />
                  </Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(e, null, index, "supervisions")
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeListEntry("supervisions", index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SECTION 6: OTHER DOCUMENTS (DYNAMIC) */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
            <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" /> Additional Documents
            </CardTitle>
            <Button
              size="sm"
              onClick={() =>
                addListEntry("other_documents", { name: "", url: "" })
              }
              className="bg-[#1f6b4a]"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Document
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {formData.other_documents.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm"
              >
                <div className="flex-1 space-y-2">
                  <Label>Document Label</Label>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateListField(
                        "other_documents",
                        index,
                        "name",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="flex">
                    File{" "}
                    <FileStatus
                      isUploading={uploadingFields[`other_documents-${index}`]}
                      url={item.url}
                    />
                  </Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(e, null, index, "other_documents")
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListEntry("other_documents", index)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-20">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-[#1f6b4a] text-[#1f6b4a]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || Object.values(uploadingFields).some(Boolean)
            }
            className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeForm;