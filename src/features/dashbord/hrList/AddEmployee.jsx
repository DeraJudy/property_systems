// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Plus, Upload, FileText, Camera } from 'lucide-react';

// const AddEmployeeForm = () => {
//   return (
//     <div className="p-6 bg-[#f5f0e6] min-h-screen space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-[#123d2b]">New Employee Enrollment</h1>
//         {/* <Button className="bg-[#2FA36B] hover:bg-[#258a5a] text-[#FAF6EE]">
//           <Plus className="mr-2 h-4 w-4" /> Save Employee Record
//         </Button> */}
//       </div>

//       {/* SECTION 1: PERSONAL DETAILS */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2]">
//           <CardTitle className="text-[#123d2b] text-lg">Personal Details</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//           <div className="space-y-2">
//             <Label>Full Name</Label>
//             <Input className="bg-[#e1dbd2] border-none" placeholder="Enter name" />
//           </div>
//           <div className="space-y-2">
//             <Label>Date of Birth</Label>
//             <Input type="date" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2">
//             <Label>Job Role</Label>
//             <Input className="bg-[#e1dbd2] border-none" placeholder="e.g. Support Worker" />
//           </div>
//           <div className="space-y-2">
//             <Label>Contact Information (Email/Phone)</Label>
//             <Input className="bg-[#e1dbd2] border-none" placeholder="Personal contact details" />
//           </div>
//           <div className="space-y-2">
//             <Label>Evidence of Current Address (Last 6 Months)</Label>
//             <div className="flex items-center gap-2">
//               <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//               <FileText className="text-[#6b7d74]" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label>Photographic ID (Passport/Driving License)</Label>
//             <div className="flex items-center gap-2">
//               <Input type="file" accept="image/*" className="bg-[#e1dbd2] border-none" />
//               <Camera className="text-[#6b7d74]" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* SECTION 2: STAFF FILES (Recruitment & Compliance) */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2]">
//           <CardTitle className="text-[#123d2b] text-lg">Staff Files & Compliance</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6 pt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label>Signed Application Form (Date of Sig)</Label>
//               <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//             </div>
//             <div className="space-y-2">
//               <Label>Interview Notes & Gap Exploration</Label>
//               <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//             </div>
//             <div className="space-y-2">
//               <Label>DBS Number</Label>
//               <Input className="bg-[#e1dbd2] border-none" />
//             </div>
//             <div className="space-y-2">
//               <Label>DBS Completion Date</Label>
//               <Input type="date" className="bg-[#e1dbd2] border-none" />
//             </div>
//             <div className="space-y-2">
//               <Label>Right to Work in UK / Certificate of Conduct</Label>
//               <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//             </div>
//             <div className="space-y-2">
//               <Label>Professional Indemnity Insurance / Registration</Label>
//               <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//             </div>
//           </div>

//           <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
//             <h4 className="font-semibold text-[#123d2b] mb-4">References (Min. 2 Required)</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Reference 1 (Last work with children)</Label>
//                 <input type="name" className="bg-white border border-[#e1dbd2] rounded px-3 
//                 py-2 w-full" placeholder="Referee Name" />
//                 <input type="email" className="bg-white border border-[#e1dbd2] rounded px-3 py-2 w-full" 
//                 placeholder="Referee Email" />
//                 <Input type="file" accept=".docx,.doc,.pdf" className="bg-white" />
//               </div>
//               <div className="space-y-2">
//                 <Label>Reference 2 (Most recent employer)</Label>
//                 <input type="name" className="bg-white border border-[#e1dbd2] rounded px-3 
//                 py-2 w-full" placeholder="Referee Name" />
//                 <input type="email" className="bg-white border border-[#e1dbd2] rounded px-3 py-2 w-full" 
//                 placeholder="Referee Email" />
//                 <Input type="file" accept=".docx,.doc,.pdf" className="bg-white" />
//               </div>
//             </div>
//             {/* <p className="text-xs text-[#6b7d74] mt-2 italic">Note: References must be verified via phone call, signed and dated.</p> */}
//           </div>
//         </CardContent>
//       </Card>

//       {/* SECTION 3: TRAINING & INDUCTION */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2]">
//           <CardTitle className="text-[#123d2b] text-lg">Training & Induction</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//           <div className="space-y-2">
//             <Label>Start Date</Label>
//             <Input type="date" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2">
//             <Label>Date Induction Completed</Label>
//             <Input type="date" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2">
//             <Label>Induction Checklist (Signed)</Label>
//             <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2">
//             <Label>Training Record & Certificates</Label>
//             <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2 col-span-full">
//             <Label>Relevant Qualifications (Copies)</Label>
//             <Input type="file" multiple accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//           </div>
//         </CardContent>
//       </Card>

//       {/* SECTION 4: SUPERVISION & APPRAISALS */}
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2]">
//           <CardTitle className="text-[#123d2b] text-lg">Supervision, Appraisals & Sickness</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//           <div className="space-y-2">
//             <Label>Last Supervision Date</Label>
//             <Input type="date" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2">
//             <Label>Supervision Notes (Upload last 3)</Label>
//             <Input type="file" multiple accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2">
//             <Label>Last Annual Appraisal Date</Label>
//             <Input type="date" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2">
//             <Label>Appraisal Documents</Label>
//             <Input type="file" accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//           </div>
//           <div className="space-y-2 col-span-full">
//             <Label>Sickness, Leave & Disciplinary Records</Label>
//             <Input type="file" multiple accept="image/*,.pdf" className="bg-[#e1dbd2] border-none" />
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex justify-end gap-4 pb-10">
//         <Button variant="outline" className="border-[#1f6b4a] text-[#1f6b4a]">Cancel</Button>
//         <Button className="bg-[#1f6b4a] text-[#f7f2e9] px-8">Complete Record</Button>
//       </div>
//     </div>
//   );
// };

// export default AddEmployeeForm;

"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, FileText, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Ensure your supabase client is initialized here

const AddEmployeeForm = () => {
    const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFields, setUploadingFields] = useState({}); // Tracks which file is currently uploading
  
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    job_role: '',
    contact_info: '',
    dbs_number: '',
    dbs_completion_date: '',
    start_date: '',
    induction_completed_date: '',
    last_supervision_date: '',
    last_appraisal_date: '',
    ref1_name: '',
    ref1_email: '',
    ref2_name: '',
    ref2_email: '',
    // URLs from Supabase Storage
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
    qualifications_urls: [],
    supervision_notes_urls: [],
    appraisal_doc_url: '',
    sickness_disciplinary_urls: []
  });

  // Instant Upload Function for slow networks
  const handleFileUpload = async (e, fieldName, isMultiple = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingFields(prev => ({ ...prev, [fieldName]: true }));

    try {
      const uploadResults = await Promise.all(files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `employee-docs/${formData.full_name || 'unnamed'}/${fieldName}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('employee-docs')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('employee-docs').getPublicUrl(filePath);
        return data.publicUrl;
      }));

      setFormData(prev => ({
        ...prev,
        [fieldName]: isMultiple 
          ? [...(prev[fieldName] || []), ...uploadResults] 
          : uploadResults[0]
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check your connection.');
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name) return alert("Please enter the employee's name.");
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('employees')
        .insert([formData]);

      if (error) throw error;
      alert("Employee record saved successfully!");
      // Optional: Redirect or reset form here
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for file feedback
  const FileStatus = ({ fieldName, isUploaded }) => (
    <div className="flex items-center ml-2">
      {uploadingFields[fieldName] ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      ) : isUploaded ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : null}
    </div>
  );

  return (
    <div className="p-6 min-h-screen space-y-8">
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
            <Input name="full_name" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input name="dob" type="date" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label>Job Role</Label>
            <Input name="job_role" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" placeholder="e.g. Support Worker" />
          </div>
          <div className="space-y-2">
            <Label>Contact Information</Label>
            <Input name="contact_info" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" placeholder="Email or Phone" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Evidence of Address <FileStatus fieldName="evidence_address_url" isUploaded={!!formData.evidence_address_url}/></Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'evidence_address_url')} className="bg-[#e1dbd2] border-none" />
              <FileText className="text-[#6b7d74]" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Photographic ID <FileStatus fieldName="photo_id_url" isUploaded={!!formData.photo_id_url}/></Label>
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
              <Label className="flex items-center">Signed Application Form <FileStatus fieldName="signed_app_url" isUploaded={!!formData.signed_app_url}/></Label>
              <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'signed_app_url')} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Interview Notes <FileStatus fieldName="interview_notes_url" isUploaded={!!formData.interview_notes_url}/></Label>
              <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'interview_notes_url')} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label>DBS Number</Label>
              <Input name="dbs_number" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label>DBS Completion Date</Label>
              <Input name="dbs_completion_date" type="date" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Right to Work / Conduct <FileStatus fieldName="rtw_check_url" isUploaded={!!formData.rtw_check_url}/></Label>
              <Input type="file" onChange={(e) => handleFileUpload(e, 'rtw_check_url')} className="bg-[#e1dbd2] border-none" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Insurance/Registration <FileStatus fieldName="insurance_url" isUploaded={!!formData.insurance_url}/></Label>
              <Input type="file" onChange={(e) => handleFileUpload(e, 'insurance_url')} className="bg-[#e1dbd2] border-none" />
            </div>
          </div>

          <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
            <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input name="ref1_name" placeholder="Referee 1 Name" onChange={handleInputChange} className="bg-white mb-2" />
                <Input name="ref1_email" placeholder="Referee 1 Email" onChange={handleInputChange} className="bg-white mb-2" />
                <Input type="file" onChange={(e) => handleFileUpload(e, 'ref1_doc_url')} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Input name="ref2_name" placeholder="Referee 2 Name" onChange={handleInputChange} className="bg-white mb-2" />
                <Input name="ref2_email" placeholder="Referee 2 Email" onChange={handleInputChange} className="bg-white mb-2" />
                <Input type="file" onChange={(e) => handleFileUpload(e, 'ref2_doc_url')} className="bg-white" />
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
            <Input name="start_date" type="date" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label>Induction Completed Date</Label>
            <Input name="induction_completed_date" type="date" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Induction Checklist <FileStatus fieldName="induction_checklist_url" isUploaded={!!formData.induction_checklist_url}/></Label>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'induction_checklist_url')} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Training Records <FileStatus fieldName="training_record_url" isUploaded={!!formData.training_record_url}/></Label>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'training_record_url')} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2 col-span-full">
            <Label className="flex items-center">Relevant Qualifications <FileStatus fieldName="qualifications_urls" isUploaded={formData.qualifications_urls.length > 0}/></Label>
            <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'qualifications_urls', true)} className="bg-[#e1dbd2] border-none" />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: SUPERVISION */}
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2]">
          <CardTitle className="text-[#123d2b] text-lg">Supervision & Appraisals</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2">
            <Label>Last Supervision Date</Label>
            <Input name="last_supervision_date" type="date" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Supervision Notes <FileStatus fieldName="supervision_notes_urls" isUploaded={formData.supervision_notes_urls.length > 0}/></Label>
            <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'supervision_notes_urls', true)} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label>Last Annual Appraisal Date</Label>
            <Input name="last_appraisal_date" type="date" onChange={handleInputChange} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">Appraisal Docs <FileStatus fieldName="appraisal_doc_url" isUploaded={!!formData.appraisal_doc_url}/></Label>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'appraisal_doc_url')} className="bg-[#e1dbd2] border-none" />
          </div>
          <div className="space-y-2 col-span-full">
            <Label className="flex items-center">Sickness & Disciplinary <FileStatus fieldName="sickness_disciplinary_urls" isUploaded={formData.sickness_disciplinary_urls.length > 0}/></Label>
            <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'sickness_disciplinary_urls', true)} className="bg-[#e1dbd2] border-none" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pb-10">
        <Button variant="outline" className="border-[#1f6b4a] text-[#1f6b4a]">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)} 
          className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Complete Record
        </Button>
      </div>
    </div>
  );
};

export default AddEmployeeForm;