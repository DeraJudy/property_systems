"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Loader2, 
  Save, 
  ExternalLink 
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

  useEffect(() => {
    if (id) fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      toast.error("Failed to load employee data");
      router.push("/hrList");
    } finally {
      setLoading(false);
    }
  };

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
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed.');
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name) return toast.error("Name is required.");
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      toast.success("Employee record updated!");
      router.refresh();
      router.push("/hrList");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Helper for file feedback and viewing current files
  const FileStatus = ({ fieldName, url }) => {
    const isUploaded = Array.isArray(url) ? url.length > 0 : !!url;
    
    return (
      <div className="flex items-center gap-2 ml-2">
        {uploadingFields[fieldName] ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        ) : isUploaded ? (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {!Array.isArray(url) && (
              <a href={url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline flex items-center">
                View <ExternalLink className="h-2 w-2 ml-0.5" />
              </a>
            )}
            {Array.isArray(url) && <span className="text-[10px] text-gray-500">({url.length} files)</span>}
          </div>
        ) : null}
      </div>
    );
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f5f0e6]">
      <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
    </div>
  );

  return (
    <div className="p-6 bg-[#f5f0e6] min-h-screen space-y-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-[#123d2b]">Edit Employee Record</h1>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)}
          className="bg-[#1f6b4a] text-[#f7f2e9]"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Update Changes
        </Button>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* SECTION 1: PERSONAL DETAILS */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2]">
            <CardTitle className="text-[#123d2b] text-lg">Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="full_name" value={formData.full_name} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input name="dob" type="date" value={formData.dob} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
            </div>
            <div className="space-y-2">
              <Label>Job Role</Label>
              <Input name="job_role" value={formData.job_role} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
            </div>
            <div className="space-y-2">
              <Label>Contact Information</Label>
              <Input name="contact_info" value={formData.contact_info} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Evidence of Address <FileStatus fieldName="evidence_address_url" url={formData.evidence_address_url}/></Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'evidence_address_url')} className="bg-white" />
                <FileText className="text-[#6b7d74]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Photographic ID <FileStatus fieldName="photo_id_url" url={formData.photo_id_url}/></Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo_id_url')} className="bg-white" />
                <Camera className="text-[#6b7d74]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: STAFF FILES & COMPLIANCE */}
        <Card className="bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <CardHeader className="border-b border-[#e1dbd2]">
            <CardTitle className="text-[#123d2b] text-lg">Staff Files & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center">Signed Application Form <FileStatus fieldName="signed_app_url" url={formData.signed_app_url}/></Label>
                <Input type="file" onChange={(e) => handleFileUpload(e, 'signed_app_url')} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">Interview Notes <FileStatus fieldName="interview_notes_url" url={formData.interview_notes_url}/></Label>
                <Input type="file" onChange={(e) => handleFileUpload(e, 'interview_notes_url')} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>DBS Number</Label>
                <Input name="dbs_number" value={formData.dbs_number || ''} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
              </div>
              <div className="space-y-2">
                <Label>DBS Completion Date</Label>
                <Input name="dbs_completion_date" type="date" value={formData.dbs_completion_date || ''} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">Right to Work / Conduct <FileStatus fieldName="rtw_check_url" url={formData.rtw_check_url}/></Label>
                <Input type="file" onChange={(e) => handleFileUpload(e, 'rtw_check_url')} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">Insurance/Registration <FileStatus fieldName="insurance_url" url={formData.insurance_url}/></Label>
                <Input type="file" onChange={(e) => handleFileUpload(e, 'insurance_url')} className="bg-white" />
              </div>
            </div>

            <div className="p-4 border border-[#e1dbd2] rounded-lg bg-[#f5f0e6]">
              <h4 className="font-semibold text-[#123d2b] mb-4">References</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center">Referee 1 <FileStatus fieldName="ref1_doc_url" url={formData.ref1_doc_url}/></Label>
                  <Input name="ref1_name" value={formData.ref1_name || ''} placeholder="Name" onChange={handleInputChange} className="bg-white mb-2" />
                  <Input name="ref1_email" value={formData.ref1_email || ''} placeholder="Email" onChange={handleInputChange} className="bg-white mb-2" />
                  <Input type="file" onChange={(e) => handleFileUpload(e, 'ref1_doc_url')} className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">Referee 2 <FileStatus fieldName="ref2_doc_url" url={formData.ref2_doc_url}/></Label>
                  <Input name="ref2_name" value={formData.ref2_name || ''} placeholder="Name" onChange={handleInputChange} className="bg-white mb-2" />
                  <Input name="ref2_email" value={formData.ref2_email || ''} placeholder="Email" onChange={handleInputChange} className="bg-white mb-2" />
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
              <Input name="start_date" type="date" value={formData.start_date || ''} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
            </div>
            <div className="space-y-2">
              <Label>Induction Completed Date</Label>
              <Input name="induction_completed_date" type="date" value={formData.induction_completed_date || ''} onChange={handleInputChange} className="bg-white border-[#e1dbd2]" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Induction Checklist <FileStatus fieldName="induction_checklist_url" url={formData.induction_checklist_url}/></Label>
              <Input type="file" onChange={(e) => handleFileUpload(e, 'induction_checklist_url')} className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">Training Records <FileStatus fieldName="training_record_url" url={formData.training_record_url}/></Label>
              <Input type="file" onChange={(e) => handleFileUpload(e, 'training_record_url')} className="bg-white" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-10">
          <Button variant="outline" onClick={() => router.back()} className="border-[#1f6b4a] text-[#1f6b4a]">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)} 
            className="bg-[#1f6b4a] text-[#f7f2e9] px-8"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Update Record
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeForm;