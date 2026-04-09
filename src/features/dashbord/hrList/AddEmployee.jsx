// "use client";

// import React, { useState } from 'react';
// import { useRouter, useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Plus, ArrowLeft, FileText, Camera, CheckCircle2, Loader2, ShieldAlert, 
//   UserCheck,
//   GraduationCap,
//   History,
//   Trash2,
//   PhoneCall } from 'lucide-react';
// import { supabase } from '@/lib/supabase'; 
// import { toast } from "sonner";

// const AddEmployeeForm = () => {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadingFields, setUploadingFields] = useState({}); 
  
//   const [formData, setFormData] = useState({
//     full_name: '',
//     dob: '',
//     job_role: '',
//     contact_info: '',
//     dbs_number: '',
//     dbs_completion_date: '',
//     start_date: '',
//     induction_completed_date: '',
//     last_supervision_date: '',
//     last_appraisal_date: '',
//     ref1_name: '',
//     ref1_email: '',
//     ref2_name: '',
//     ref2_email: '',
//     refs_verified_by_phone: false,
//     verification_details: '',
//     // URLs from Supabase Storage
//     evidence_address_url: '',
//     photo_id_url: '',
//     signed_app_url: '',
//     interview_notes_url: '',
//     rtw_check_url: '',
//     insurance_url: '',
//     ref1_doc_url: '',
//     ref2_doc_url: '',
//     induction_checklist_url: '',
//     training_record_url: '',
//     qualifications_urls: [],
//     supervision_notes_urls: [],
//     appraisal_doc_url: '',
//     sickness_disciplinary_urls: [],
//     // FIX: Added missing keys for dynamic lists
//     qualifications: [],
//     supervisions: [],
//     other_documents: []
//   });

//   // Updated Function to handle both static and dynamic list uploads
//   const handleFileUpload = async (e, fieldName, index = null, listName = null, isMultiple = false) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const trackKey = listName ? `${listName}-${index}` : fieldName;
//     setUploadingFields(prev => ({ ...prev, [trackKey]: true }));

//     try {
//       const uploadResults = await Promise.all(files.map(async (file) => {
//         const fileExt = file.name.split('.').pop();
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
//         const filePath = `employee-docs/${formData.full_name || 'unnamed'}/${listName || fieldName}/${fileName}`;

//         const { error: uploadError } = await supabase.storage
//           .from('employee-docs')
//           .upload(filePath, file);

//         if (uploadError) throw uploadError;

//         const { data } = supabase.storage.from('employee-docs').getPublicUrl(filePath);
//         return data.publicUrl;
//       }));

//       if (listName !== null && index !== null) {
//         // Handle dynamic list update
//         const newList = [...formData[listName]];
//         newList[index] = { ...newList[index], url: uploadResults[0] };
//         setFormData(prev => ({ ...prev, [listName]: newList }));
//       } else {
//         // Handle standard field update
//         setFormData(prev => ({
//           ...prev,
//           [fieldName]: isMultiple 
//             ? [...(prev[fieldName] || []), ...uploadResults] 
//             : uploadResults[0]
//         }));
//       }
//       toast.success("File uploaded successfully");
//     } catch (error) {
//       console.error('Upload failed:', error);
//       toast.error('Upload failed. Please check your connection.');
//     } finally {
//       setUploadingFields(prev => ({ ...prev, [trackKey]: false }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.full_name) return toast.error("Please enter the employee's name.");
    
//     setIsSubmitting(true);
//     try {
//       const { error } = await supabase
//         .from('employees')
//         .insert([formData]);

//       if (error) throw error;
//       toast.success("Employee record saved successfully!");
//       router.push("/hrList");
//     } catch (error) {
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
//     setFormData(prev => ({ ...prev, [listName]: [...prev[listName], schema] }));
//   };

//   const removeListEntry = (listName, index) => {
//     setFormData(prev => ({
//       ...prev,
//       [listName]: prev[listName].filter((_, i) => i !== index)
//     }));
//   };

//   const updateListField = (listName, index, field, value) => {
//     const newList = [...formData[listName]];
//     newList[index][field] = value;
//     setFormData(prev => ({ ...prev, [listName]: newList }));
//   };

//   return (
//     <div className="p-6 min-h-screen space-y-8 bg-[#f5f0e6]">
//         <div className="max-w-5xl mx-auto mb-6">
//           <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//           </Button>
//         </div>

//       <div className="flex justify-between items-center max-w-5xl mx-auto">
//         <h1 className="text-2xl font-bold text-[#123d2b]">New Employee Enrollment</h1>
//       </div>

//       <div className="max-w-5xl mx-auto space-y-8">
//         {/* SECTION 1: PERSONAL DETAILS */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">Personal Details</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//             <div className="space-y-2">
//               <Label>Full Name</Label>
//               <Input name="full_name" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" placeholder="Enter name" />
//             </div>
//             <div className="space-y-2">
//               <Label>Date of Birth</Label>
//               <Input name="dob" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label>Job Role</Label>
//               <Input name="job_role" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" placeholder="e.g. Support Worker" />
//             </div>
//             <div className="space-y-2">
//               <Label>Contact Information</Label>
//               <Input name="contact_info" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" placeholder="Email or Phone" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Evidence of Address <FileStatus isUploading={uploadingFields['evidence_address_url']} isUploaded={!!formData.evidence_address_url}/></Label>
//               <div className="flex items-center gap-2">
//                 <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'evidence_address_url')} className="bg-white border-[#e1dbd2]" />
//                 <FileText className="text-[#6b7d74]" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Photographic ID <FileStatus isUploading={uploadingFields['photo_id_url']} isUploaded={!!formData.photo_id_url}/></Label>
//               <div className="flex items-center gap-2">
//                 <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo_id_url')} className="bg-white border-[#e1dbd2]" />
//                 <Camera className="text-[#6b7d74]" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* SECTION 2: STAFF FILES */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">Staff Files & Compliance</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6 pt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label className="flex items-center">Signed Application Form <FileStatus isUploading={uploadingFields['signed_app_url']} isUploaded={!!formData.signed_app_url}/></Label>
//                 <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'signed_app_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">Interview Notes <FileStatus isUploading={uploadingFields['interview_notes_url']} isUploaded={!!formData.interview_notes_url}/></Label>
//                 <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'interview_notes_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label>DBS Number</Label>
//                 <Input name="dbs_number" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label>DBS Completion Date</Label>
//                 <Input name="dbs_completion_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">Right to Work / Conduct <FileStatus isUploading={uploadingFields['rtw_check_url']} isUploaded={!!formData.rtw_check_url}/></Label>
//                 <Input type="file" onChange={(e) => handleFileUpload(e, 'rtw_check_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">Insurance/Registration <FileStatus isUploading={uploadingFields['insurance_url']} isUploaded={!!formData.insurance_url}/></Label>
//                 <Input type="file" onChange={(e) => handleFileUpload(e, 'insurance_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//             </div>

//             <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
//               <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center mb-2">
//                     <Label>Referee 1</Label>
//                     <FileStatus isUploading={uploadingFields['ref1_doc_url']} isUploaded={!!formData.ref1_doc_url}/>
//                   </div>
//                   <Input name="ref1_name" placeholder="Referee 1 Name" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input name="ref1_email" placeholder="Referee 1 Email" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input type="file" onChange={(e) => handleFileUpload(e, 'ref1_doc_url')} className="bg-white" />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center mb-2">
//                     <Label>Referee 2</Label>
//                     <FileStatus isUploading={uploadingFields['ref2_doc_url']} isUploaded={!!formData.ref2_doc_url}/>
//                   </div>
//                   <Input name="ref2_name" placeholder="Referee 2 Name" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input name="ref2_email" placeholder="Referee 2 Email" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input type="file" onChange={(e) => handleFileUpload(e, 'ref2_doc_url')} className="bg-white" />
//                 </div>
//               </div>
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox 
//                     id="refs_verified" 
//                     checked={formData.refs_verified_by_phone} 
//                     onCheckedChange={(checked) => setFormData(p => ({...p, refs_verified_by_phone: checked}))}
//                   />
//                   <Label htmlFor="refs_verified" className="text-blue-900 font-medium">
//                     References verified by follow-up telephone call
//                   </Label>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Verification Details (Dated and signed by Appointing Officer)</Label>
//                   <Input 
//                     name="verification_details" 
//                     placeholder="e.g. Verified 12/04/2024 by [Officer Name]" 
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
//             <CardTitle className="text-[#123d2b] text-lg">Training & Induction</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//             <div className="space-y-2">
//               <Label>Start Date</Label>
//               <Input name="start_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label>Induction Completed Date</Label>
//               <Input name="induction_completed_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Induction Checklist <FileStatus isUploading={uploadingFields['induction_checklist_url']} isUploaded={!!formData.induction_checklist_url}/></Label>
//               <Input type="file" onChange={(e) => handleFileUpload(e, 'induction_checklist_url')} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Training Records <FileStatus isUploading={uploadingFields['training_record_url']} isUploaded={!!formData.training_record_url}/></Label>
//               <Input type="file" onChange={(e) => handleFileUpload(e, 'training_record_url')} className="bg-white border-[#e1dbd2]" />
//             </div>
//           </CardContent>
//         </Card>

//         {/* SECTION 4: QUALIFICATIONS (DYNAMIC) */}
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//             <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//               <GraduationCap className="h-5 w-5" /> Qualifications
//             </CardTitle>
//             <Button size="sm" onClick={() => addListEntry('qualifications', { name: '', url: '' })} className="bg-[#1f6b4a]">
//               <Plus className="h-4 w-4 mr-1" /> Add Qualification
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.qualifications.map((item, index) => (
//               <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm">
//                 <div className="flex-1 space-y-2">
//                   <Label>Qualification Name</Label>
//                   <Input 
//                     value={item.name} 
//                     onChange={(e) => updateListField('qualifications', index, 'name', e.target.value)}
//                     placeholder="e.g. NVQ Level 3"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex">Document <FileStatus isUploading={uploadingFields[`qualifications-${index}`]} isUploaded={!!item.url} /></Label>
//                   <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'qualifications')} />
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => removeListEntry('qualifications', index)} className="text-red-500">
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
//             <Button size="sm" onClick={() => addListEntry('supervisions', { name: '', date: '', url: '' })} className="bg-[#1f6b4a]">
//               <Plus className="h-4 w-4 mr-1" /> Add Supervision
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.supervisions.map((item, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-3 border rounded-md shadow-sm">
//                 <div className="space-y-2">
//                   <Label>Session Name</Label>
//                   <Input 
//                     value={item.name} 
//                     onChange={(e) => updateListField('supervisions', index, 'name', e.target.value)}
//                     placeholder="e.g. Monthly Review"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Date</Label>
//                   <Input 
//                     type="date"
//                     value={item.date} 
//                     onChange={(e) => updateListField('supervisions', index, 'date', e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="flex">Notes <FileStatus isUploading={uploadingFields[`supervisions-${index}`]} isUploaded={!!item.url} /></Label>
//                   <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'supervisions')} />
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => removeListEntry('supervisions', index)} className="text-red-500">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
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
//             <Button size="sm" onClick={() => addListEntry('other_documents', { name: '', url: '' })} className="bg-[#1f6b4a]">
//               <Plus className="h-4 w-4 mr-1" /> Add Document
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.other_documents.map((item, index) => (
//               <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm">
//                 <div className="flex-1 space-y-2">
//                   <Label>Document Label</Label>
//                   <Input 
//                     value={item.name} 
//                     onChange={(e) => updateListField('other_documents', index, 'name', e.target.value)}
//                     placeholder="e.g. Training Cert"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex">File <FileStatus isUploading={uploadingFields[`other_documents-${index}`]} isUploaded={!!item.url} /></Label>
//                   <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'other_documents')} />
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => removeListEntry('other_documents', index)} className="text-red-500">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <div className="flex justify-end gap-4 pb-20">
//           <Button variant="outline" onClick={() => router.back()} className="border-[#1f6b4a] text-[#1f6b4a]">Cancel</Button>
//           <Button 
//             onClick={handleSubmit} 
//             disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)} 
//             className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
//           >
//             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//             Complete Record
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEmployeeForm;


// "use client";

// import React, { useState } from 'react';
// import { useRouter, useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Plus, ArrowLeft, FileText, Camera, CheckCircle2, Loader2, ShieldAlert, 
//   UserCheck,
//   GraduationCap,
//   History,
//   Trash2,
//   PhoneCall,
//   AlertTriangle } from 'lucide-react';
// import { supabase } from '@/lib/supabase'; 
// import { toast } from "sonner";

// const AddEmployeeForm = () => {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadingFields, setUploadingFields] = useState({}); 
  
//   const [formData, setFormData] = useState({
//     full_name: '',
//     dob: '',
//     job_role: '',
//     contact_info: '',
//     dbs_number: '',
//     dbs_completion_date: '',
//     dbs_trace_notes_url: '', // New field for trace evidence
//     start_date: '',
//     induction_completed_date: '',
//     // last_supervision_date: '',
//     last_appraisal_date: '',
//     ref1_name: '',
//     ref1_email: '',
//     ref2_name: '',
//     ref2_email: '',
//     refs_verified_by_phone: false,
//     verification_details: '',
//     // URLs from Supabase Storage
//     evidence_address_url: '',
//     photo_id_url: '',
//     signed_app_url: '',
//     interview_notes_url: '',
//     rtw_check_url: '',
//     insurance_url: '',
//     ref1_doc_url: '',
//     ref2_doc_url: '',
//     induction_checklist_url: '',
//     training_record_url: '',
//     qualifications_urls: [],
//     // supervision_notes_urls: [],
//     appraisal_doc_url: '',
//     sickness_disciplinary_urls: [],
//     qualifications: [],
//     supervisions: [],
//     other_documents: []
//   });

//   const handleFileUpload = async (e, fieldName, index = null, listName = null, isMultiple = false) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const trackKey = listName ? `${listName}-${index}` : fieldName;
//     setUploadingFields(prev => ({ ...prev, [trackKey]: true }));

//     try {
//       const uploadResults = await Promise.all(files.map(async (file) => {
//         const fileExt = file.name.split('.').pop();
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
//         const filePath = `employee-docs/${formData.full_name || 'unnamed'}/${listName || fieldName}/${fileName}`;

//         const { error: uploadError } = await supabase.storage
//           .from('employee-docs')
//           .upload(filePath, file);

//         if (uploadError) throw uploadError;

//         const { data } = supabase.storage.from('employee-docs').getPublicUrl(filePath);
//         return data.publicUrl;
//       }));

//       if (listName !== null && index !== null) {
//         const newList = [...formData[listName]];
//         newList[index] = { ...newList[index], url: uploadResults[0] };
//         setFormData(prev => ({ ...prev, [listName]: newList }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           [fieldName]: isMultiple 
//             ? [...(prev[fieldName] || []), ...uploadResults] 
//             : uploadResults[0]
//         }));
//       }
//       toast.success("File uploaded successfully");
//     } catch (error) {
//       console.error('Upload failed:', error);
//       toast.error('Upload failed. Please check your connection.');
//     } finally {
//       setUploadingFields(prev => ({ ...prev, [trackKey]: false }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.full_name) return toast.error("Please enter the employee's name.");
    
//     setIsSubmitting(true);
//     try {
//       const { error } = await supabase
//         .from('employees')
//         .insert([formData]);

//       if (error) throw error;
//       toast.success("Employee record saved successfully!");
//       router.push("/hrList");
//     } catch (error) {
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
//     setFormData(prev => ({ ...prev, [listName]: [...prev[listName], schema] }));
//   };

//   const removeListEntry = (listName, index) => {
//     setFormData(prev => ({
//       ...prev,
//       [listName]: prev[listName].filter((_, i) => i !== index)
//     }));
//   };

//   const updateListField = (listName, index, field, value) => {
//     const newList = [...formData[listName]];
//     newList[index][field] = value;
//     setFormData(prev => ({ ...prev, [listName]: newList }));
//   };

//   return (
//     <div className="p-6 min-h-screen space-y-8 bg-[#f5f0e6]">
//         <div className="max-w-5xl mx-auto mb-6">
//           <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//           </Button>
//         </div>

//       <div className="flex justify-between items-center max-w-5xl mx-auto">
//         <h1 className="text-2xl font-bold text-[#123d2b]">New Employee Enrollment</h1>
//       </div>

//       <div className="max-w-5xl mx-auto space-y-8">
//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">Personal Details</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//             <div className="space-y-2">
//               <Label>Full Name</Label>
//               <Input name="full_name" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" placeholder="Enter name" />
//             </div>
//             <div className="space-y-2">
//               <Label>Date of Birth</Label>
//               <Input name="dob" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label>Job Role</Label>
//               <Input name="job_role" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" placeholder="e.g. Support Worker" />
//             </div>
//             <div className="space-y-2">
//               <Label>Contact Information</Label>
//               <Input name="contact_info" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" placeholder="Email or Phone" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Evidence of Address <FileStatus isUploading={uploadingFields['evidence_address_url']} isUploaded={!!formData.evidence_address_url}/></Label>
//               <div className="flex items-center gap-2">
//                 <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'evidence_address_url')} className="bg-white border-[#e1dbd2]" />
//                 <FileText className="text-[#6b7d74]" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Photographic ID <FileStatus isUploading={uploadingFields['photo_id_url']} isUploaded={!!formData.photo_id_url}/></Label>
//               <div className="flex items-center gap-2">
//                 <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo_id_url')} className="bg-white border-[#e1dbd2]" />
//                 <Camera className="text-[#6b7d74]" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">Staff Files & Compliance</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6 pt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label className="flex items-center">Signed Application Form <FileStatus isUploading={uploadingFields['signed_app_url']} isUploaded={!!formData.signed_app_url}/></Label>
//                 <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'signed_app_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">Interview Notes <FileStatus isUploading={uploadingFields['interview_notes_url']} isUploaded={!!formData.interview_notes_url}/></Label>
//                 <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'interview_notes_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label>DBS Number</Label>
//                 <Input name="dbs_number" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label>DBS Completion Date</Label>
//                 <Input name="dbs_completion_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">Right to Work / Conduct <FileStatus isUploading={uploadingFields['rtw_check_url']} isUploaded={!!formData.rtw_check_url}/></Label>
//                 <Input type="file" onChange={(e) => handleFileUpload(e, 'rtw_check_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center">Insurance/Registration <FileStatus isUploading={uploadingFields['insurance_url']} isUploaded={!!formData.insurance_url}/></Label>
//                 <Input type="file" onChange={(e) => handleFileUpload(e, 'insurance_url')} className="bg-white border-[#e1dbd2]" />
//               </div>
//             </div>

//             {/* DBS TRACE RISK ASSESSMENT SECTION */}
//             <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 space-y-3">
//               <h4 className="font-semibold text-orange-900 flex items-center gap-2">
//                 <AlertTriangle className="h-4 w-4" /> DBS Trace Risk Evaluation
//               </h4>
//               <div className="space-y-2">
//                 <Label className="text-orange-800">Risk Assessment & Evaluation Evidence (Required if trace exists)</Label>
//                 <div className="flex items-center gap-2">
//                   <Input 
//                     type="file" 
//                     onChange={(e) => handleFileUpload(e, 'dbs_trace_notes_url')} 
//                     className="bg-white border-orange-200" 
//                   />
//                   <FileStatus isUploading={uploadingFields['dbs_trace_notes_url']} isUploaded={!!formData.dbs_trace_notes_url} />
//                 </div>
//                 <p className="text-xs text-orange-700 italic">Upload evidence of the appointing officer's evaluation of any trace highlighted on the DBS check.</p>
//               </div>
//             </div>

//             <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
//               <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center mb-2">
//                     <Label>Referee 1</Label>
//                     <FileStatus isUploading={uploadingFields['ref1_doc_url']} isUploaded={!!formData.ref1_doc_url}/>
//                   </div>
//                   <Input name="ref1_name" placeholder="Referee 1 Name" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input name="ref1_email" placeholder="Referee 1 Email" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input type="file" onChange={(e) => handleFileUpload(e, 'ref1_doc_url')} className="bg-white" />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center mb-2">
//                     <Label>Referee 2</Label>
//                     <FileStatus isUploading={uploadingFields['ref2_doc_url']} isUploaded={!!formData.ref2_doc_url}/>
//                   </div>
//                   <Input name="ref2_name" placeholder="Referee 2 Name" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input name="ref2_email" placeholder="Referee 2 Email" onChange={handleInputChange} className="bg-white mb-2" />
//                   <Input type="file" onChange={(e) => handleFileUpload(e, 'ref2_doc_url')} className="bg-white" />
//                 </div>
//               </div>
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox 
//                     id="refs_verified" 
//                     checked={formData.refs_verified_by_phone} 
//                     onCheckedChange={(checked) => setFormData(p => ({...p, refs_verified_by_phone: checked}))}
//                   />
//                   <Label htmlFor="refs_verified" className="text-blue-900 font-medium">
//                     References verified by follow-up telephone call
//                   </Label>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Verification Details (Dated and signed by Appointing Officer)</Label>
//                   <Input 
//                     name="verification_details" 
//                     placeholder="e.g. Verified 12/04/2024 by [Officer Name]" 
//                     onChange={handleInputChange}
//                     className="bg-white border-blue-200"
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">Training & Induction</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//             <div className="space-y-2">
//               <Label>Start Date</Label>
//               <Input name="start_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label>Induction Completed Date</Label>
//               <Input name="induction_completed_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Induction Checklist <FileStatus isUploading={uploadingFields['induction_checklist_url']} isUploaded={!!formData.induction_checklist_url}/></Label>
//               <Input type="file" onChange={(e) => handleFileUpload(e, 'induction_checklist_url')} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Training Records <FileStatus isUploading={uploadingFields['training_record_url']} isUploaded={!!formData.training_record_url}/></Label>
//               <Input type="file" onChange={(e) => handleFileUpload(e, 'training_record_url')} className="bg-white border-[#e1dbd2]" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2]">
//             <CardTitle className="text-[#123d2b] text-lg">Supervision & Appraisals</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//             {/* <div className="space-y-2">
//               <Label>Last Supervision Date</Label>
//               <Input name="last_supervision_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Supervision Notes <FileStatus isUploading={uploadingFields['supervision_notes_urls']} isUploaded={formData.supervision_notes_urls.length > 0}/></Label>
//               <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'supervision_notes_urls', null, null, true)} className="bg-white border-[#e1dbd2]" />
//             </div> */}
//             <div className="space-y-2">
//               <Label>Last Annual Appraisal Date</Label>
//               <Input name="last_appraisal_date" type="date" onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2">
//               <Label className="flex items-center">Appraisal Docs <FileStatus isUploading={uploadingFields['appraisal_doc_url']} isUploaded={!!formData.appraisal_doc_url}/></Label>
//               <Input type="file" onChange={(e) => handleFileUpload(e, 'appraisal_doc_url')} className="bg-white border-[#e1dbd2]" />
//             </div>
//             <div className="space-y-2 col-span-full">
//               <Label className="flex items-center">Sickness & Disciplinary <FileStatus isUploading={uploadingFields['sickness_disciplinary_urls']} isUploaded={formData.sickness_disciplinary_urls.length > 0}/></Label>
//               <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'sickness_disciplinary_urls', null, null, true)} className="bg-white border-[#e1dbd2]" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//             <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//               <GraduationCap className="h-5 w-5" /> Qualifications
//             </CardTitle>
//             <Button size="sm" onClick={() => addListEntry('qualifications', { name: '', url: '' })} className="bg-[#1f6b4a]">
//               <Plus className="h-4 w-4 mr-1" /> Add Qualification
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.qualifications.map((item, index) => (
//               <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm">
//                 <div className="flex-1 space-y-2">
//                   <Label>Qualification Name</Label>
//                   <Input 
//                     value={item.name} 
//                     onChange={(e) => updateListField('qualifications', index, 'name', e.target.value)}
//                     placeholder="e.g. NVQ Level 3"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex">Document <FileStatus isUploading={uploadingFields[`qualifications-${index}`]} isUploaded={!!item.url} /></Label>
//                   <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'qualifications')} />
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => removeListEntry('qualifications', index)} className="text-red-500">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//             <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//               <History className="h-5 w-5" /> Supervision History
//             </CardTitle>
//             <Button size="sm" onClick={() => addListEntry('supervisions', { name: '', date: '', url: '' })} className="bg-[#1f6b4a]">
//               <Plus className="h-4 w-4 mr-1" /> Add Supervision
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.supervisions.map((item, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-3 border rounded-md shadow-sm">
//                 <div className="space-y-2">
//                   <Label>Session Name</Label>
//                   <Input 
//                     value={item.name} 
//                     onChange={(e) => updateListField('supervisions', index, 'name', e.target.value)}
//                     placeholder="e.g. Monthly Review"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Date</Label>
//                   <Input 
//                     type="date"
//                     value={item.date} 
//                     onChange={(e) => updateListField('supervisions', index, 'date', e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="flex">Notes <FileStatus isUploading={uploadingFields[`supervisions-${index}`]} isUploaded={!!item.url} /></Label>
//                   <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'supervisions')} />
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => removeListEntry('supervisions', index)} className="text-red-500">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
//             <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
//               <FileText className="h-5 w-5" /> Additional Documents
//             </CardTitle>
//             <Button size="sm" onClick={() => addListEntry('other_documents', { name: '', url: '' })} className="bg-[#1f6b4a]">
//               <Plus className="h-4 w-4 mr-1" /> Add Document
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4 pt-6">
//             {formData.other_documents.map((item, index) => (
//               <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md shadow-sm">
//                 <div className="flex-1 space-y-2">
//                   <Label>Document Label</Label>
//                   <Input 
//                     value={item.name} 
//                     onChange={(e) => updateListField('other_documents', index, 'name', e.target.value)}
//                     placeholder="e.g. Training Cert"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex">File <FileStatus isUploading={uploadingFields[`other_documents-${index}`]} isUploaded={!!item.url} /></Label>
//                   <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'other_documents')} />
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => removeListEntry('other_documents', index)} className="text-red-500">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <div className="flex justify-end gap-4 pb-20">
//           <Button variant="outline" onClick={() => router.back()} className="border-[#1f6b4a] text-[#1f6b4a]">Cancel</Button>
//           <Button 
//             onClick={handleSubmit} 
//             disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)} 
//             className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
//           >
//             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//             Complete Record
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEmployeeForm;


"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, ArrowLeft, FileText, Camera, CheckCircle2, Loader2, 
  GraduationCap, History, Trash2, AlertTriangle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase'; 
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
  
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    job_role: '',
    contact_info: '',
    dbs_number: '',
    dbs_completion_date: '',
    start_date: '',
    induction_completed_date: '',
    last_appraisal_date: '',
    ref1_name: '',
    ref1_email: '',
    ref2_name: '',
    ref2_email: '',
    refs_verified_by_phone: false,
    verification_details: '',
    evidence_address_url: '',
    photo_id_url: '',
    signed_app_url: '',
    interview_notes_url: '',
    rtw_check_url: '',
    insurance_url: '',
    ref1_doc_url: '',
    ref2_doc_url: '',
    induction_checklist_url: '',
    training_record_url: '',
    appraisal_doc_url: '',
    sickness_disciplinary_urls: [],
    qualifications: [],
    supervisions: [],
    other_documents: []
  });

  const handleFileUpload = async (e, fieldName, index = null, listName = null, isMultiple = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const trackKey = listName ? `${listName}-${index}` : fieldName;
    setUploadingFields(prev => ({ ...prev, [trackKey]: true }));
    try {
      const uploadResults = await Promise.all(files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `employee-docs/${formData.full_name || 'unnamed'}/${listName || fieldName}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('employee-docs').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('employee-docs').getPublicUrl(filePath);
        return data.publicUrl;
      }));
      if (listName !== null && index !== null) {
        const newList = [...formData[listName]];
        newList[index] = { ...newList[index], url: uploadResults[0] };
        setFormData(prev => ({ ...prev, [listName]: newList }));
      } else {
        setFormData(prev => ({
          ...prev,
          [fieldName]: isMultiple ? [...(prev[fieldName] || []), ...uploadResults] : uploadResults[0]
        }));
      }
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploadingFields(prev => ({ ...prev, [trackKey]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name) {
      return toast.error("Please enter the employee's full name.");
    }

    const criticalFields = ['dob', 'job_role', 'contact_info', 'dbs_number', 'photo_id_url', 'evidence_address_url'];
    const hasEmptyFields = criticalFields.some(field => !formData[field]);

    if (hasEmptyFields) {
      setIsConfirmOpen(true);
    } else {
      processSave();
    }
  };

  const processSave = async () => {
    setIsSubmitting(true);
    setIsConfirmOpen(false);
    
    try {
      // CLEANING LOGIC: Convert empty strings in date fields to NULL
      const submissionData = { ...formData };
      
      const dateFields = [
        'dob', 
        'dbs_completion_date', 
        'start_date', 
        'induction_completed_date', 
        'last_appraisal_date'
      ];

      dateFields.forEach(field => {
        if (submissionData[field] === '') {
          submissionData[field] = null;
        }
      });

      // Also clean dates inside the supervisions array if they exist
      if (submissionData.supervisions.length > 0) {
        submissionData.supervisions = submissionData.supervisions.map(s => ({
          ...s,
          date: s.date === '' ? null : s.date
        }));
      }

      const { error } = await supabase.from('employees').insert([submissionData]);
      if (error) throw error;
      
      toast.success("Employee record saved successfully!");
      router.push("/hrList");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileStatus = ({ fieldName, isUploaded, isUploading }) => (
    <div className="flex items-center ml-2">
      {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : 
       isUploaded ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : null}
    </div>
  );

  const addListEntry = (listName, schema) => {
    setFormData(prev => ({ ...prev, [listName]: [...prev[listName], schema] }));
  };

  const removeListEntry = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  const updateListField = (listName, index, field, value) => {
    const newList = [...formData[listName]];
    newList[index][field] = value;
    setFormData(prev => ({ ...prev, [listName]: newList }));
  };

  return (
    <div className="p-6 min-h-screen space-y-8">
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-[#fbf8f2] border-[#e1dbd2]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" /> Missing Details
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#123d2b]">
              Some details or documents are currently missing. Do you want to save the record anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1f6b4a] text-[#1f6b4a]">No, continue editing</AlertDialogCancel>
            <AlertDialogAction onClick={processSave} className="bg-[#1f6b4a] text-white">Yes, save anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-5xl mx-auto mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#123d2b]">New Employee Enrollment</h1>
      </div>

      {/* SECTION 1: PERSONAL DETAILS */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2]">
          <CardTitle className="text-[#123d2b] text-lg">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input name="full_name" value={formData.full_name} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input name="dob" type="date" value={formData.dob} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label>Job Role</Label>
            <Input name="job_role" value={formData.job_role} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" placeholder="e.g. Support Worker" />
          </div>
          <div className="space-y-2">
            <Label>Contact Information</Label>
            <Input name="contact_info" value={formData.contact_info} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" placeholder="Email or Phone" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Evidence of Address <FileStatus fieldName="evidence_address_url" isUploaded={!!formData.evidence_address_url} isUploading={uploadingFields.evidence_address_url}/></Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'evidence_address_url')} className="bg-[#e1dbd2] border-none" />
              <FileText className="text-[#6b7d74]" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Photographic ID <FileStatus fieldName="photo_id_url" isUploaded={!!formData.photo_id_url} isUploading={uploadingFields.photo_id_url}/></Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo_id_url')} className="bg-[#e1dbd2] border-none" />
              <Camera className="text-[#6b7d74]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: STAFF FILES */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2]">
          <CardTitle className="text-[#123d2b] text-lg">Staff Files & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center">Signed Application Form <FileStatus fieldName="signed_app_url" isUploaded={!!formData.signed_app_url} isUploading={uploadingFields.signed_app_url}/></Label>
              <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'signed_app_url')} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Interview Notes <FileStatus fieldName="interview_notes_url" isUploaded={!!formData.interview_notes_url} isUploading={uploadingFields.interview_notes_url}/></Label>
              <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'interview_notes_url')} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label>DBS Number</Label>
              <Input name="dbs_number" value={formData.dbs_number} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label>DBS Completion Date</Label>
              <Input name="dbs_completion_date" type="date" value={formData.dbs_completion_date} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Right to Work / Conduct <FileStatus fieldName="rtw_check_url" isUploaded={!!formData.rtw_check_url} isUploading={uploadingFields.rtw_check_url}/></Label>
              <Input type="file" onChange={(e) => handleFileUpload(e, 'rtw_check_url')} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Insurance/Registration <FileStatus fieldName="insurance_url" isUploaded={!!formData.insurance_url} isUploading={uploadingFields.insurance_url}/></Label>
              <Input type="file" onChange={(e) => handleFileUpload(e, 'insurance_url')} className="bg-[#e1dbd2] border-none" />
            </div>
          </div>

          <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
            <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>Referee 1</Label>
                  <FileStatus fieldName="ref1_doc_url" isUploaded={!!formData.ref1_doc_url} isUploading={uploadingFields.ref1_doc_url}/>
                </div>
                <Input name="ref1_name" value={formData.ref1_name} placeholder="Referee 1 Name" onChange={handleInputChange} className="bg-white mb-2" />
                <Input name="ref1_email" value={formData.ref1_email} placeholder="Referee 1 Email" onChange={handleInputChange} className="bg-white mb-2" />
                <Input type="file" onChange={(e) => handleFileUpload(e, 'ref1_doc_url')} className="bg-white" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>Referee 2</Label>
                  <FileStatus fieldName="ref2_doc_url" isUploaded={!!formData.ref2_doc_url} isUploading={uploadingFields.ref2_doc_url}/>
                </div>
                <Input name="ref2_name" value={formData.ref2_name} placeholder="Referee 2 Name" onChange={handleInputChange} className="bg-white mb-2" />
                <Input name="ref2_email" value={formData.ref2_email} placeholder="Referee 2 Email" onChange={handleInputChange} className="bg-white mb-2" />
                <Input type="file" onChange={(e) => handleFileUpload(e, 'ref2_doc_url')} className="bg-white" />
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="refs_verified" checked={formData.refs_verified_by_phone} onCheckedChange={(checked) => setFormData(p => ({...p, refs_verified_by_phone: checked}))}/>
                <Label htmlFor="refs_verified" className="text-blue-900 font-medium text-sm">References verified by follow-up telephone call</Label>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Verification Details</Label>
                <Input name="verification_details" value={formData.verification_details} placeholder="e.g. Verified 12/04/2024 by [Officer Name]" onChange={handleInputChange} className="bg-white border-blue-200" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: TRAINING */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2]">
          <CardTitle className="text-[#123d2b] text-lg">Training & Induction</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label>Induction Completed Date</Label>
            <Input name="induction_completed_date" type="date" value={formData.induction_completed_date} onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Induction Checklist <FileStatus fieldName="induction_checklist_url" isUploaded={!!formData.induction_checklist_url} isUploading={uploadingFields.induction_checklist_url}/></Label>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'induction_checklist_url')} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Training Records <FileStatus fieldName="training_record_url" isUploaded={!!formData.training_record_url} isUploading={uploadingFields.training_record_url}/></Label>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'training_record_url')} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label>Last Annual Appraisal Date</Label>
            <Input name="last_appraisal_date" type="date" value={formData.last_appraisal_date} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Appraisal Docs <FileStatus isUploading={uploadingFields['appraisal_doc_url']} isUploaded={!!formData.appraisal_doc_url}/></Label>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'appraisal_doc_url')} className="bg-white border-[#e1dbd2]" />
          </div>
        </CardContent>
      </Card>

      {/* QUALIFICATIONS SECTION */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
          <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> Qualifications
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => addListEntry('qualifications', { name: '', url: '' })} className="border-[#1f6b4a] text-[#1f6b4a]">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {formData.qualifications.map((item, index) => (
            <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md">
              <div className="flex-1 space-y-2">
                <Label>Qualification Name</Label>
                <Input value={item.name} onChange={(e) => updateListField('qualifications', index, 'name', e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="flex">Document <FileStatus isUploading={uploadingFields[`qualifications-${index}`]} isUploaded={!!item.url} /></Label>
                <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'qualifications')} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeListEntry('qualifications', index)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SUPERVISIONS SECTION */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
          <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
            <History className="h-5 w-5" /> Supervisions
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => addListEntry('supervisions', { date: '', type: '', url: '' })} className="border-[#1f6b4a] text-[#1f6b4a]">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {formData.supervisions.map((item, index) => (
            <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md">
              <div className="flex-1 space-y-2">
                <Label>Date</Label>
                <Input type="date" value={item.date} onChange={(e) => updateListField('supervisions', index, 'date', e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Type</Label>
                <Input value={item.type} placeholder="e.g. Monthly" onChange={(e) => updateListField('supervisions', index, 'type', e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="flex">Notes <FileStatus isUploading={uploadingFields[`supervisions-${index}`]} isUploaded={!!item.url} /></Label>
                <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'supervisions')} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeListEntry('supervisions', index)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* OTHER DOCUMENTS SECTION */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2] flex flex-row items-center justify-between">
          <CardTitle className="text-[#123d2b] text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" /> Other Relevant Documents
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => addListEntry('other_documents', { name: '', url: '' })} className="border-[#1f6b4a] text-[#1f6b4a]">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {formData.other_documents.map((item, index) => (
            <div key={index} className="flex gap-4 items-end bg-white p-3 border rounded-md">
              <div className="flex-1 space-y-2">
                <Label>Document Title</Label>
                <Input value={item.name} onChange={(e) => updateListField('other_documents', index, 'name', e.target.value)} placeholder="e.g. Training Cert" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="flex">File <FileStatus isUploading={uploadingFields[`other_documents-${index}`]} isUploaded={!!item.url} /></Label>
                <Input type="file" onChange={(e) => handleFileUpload(e, null, index, 'other_documents')} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeListEntry('other_documents', index)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pb-20">
        <Button variant="outline" onClick={() => router.back()} className="border-[#1f6b4a] text-[#1f6b4a]">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)} 
          className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Complete Enrollment
        </Button>
      </div>
    </div>
  );
};

export default AddEmployeeForm;