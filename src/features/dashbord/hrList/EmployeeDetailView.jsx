"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, ExternalLink, User, ShieldCheck, 
  GraduationCap, ClipboardList, Calendar, Briefcase, 
  AlertCircle, Info
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

const EmployeeDetailView = () => {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchEmployeeDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setEmployee(data);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEmployeeDetails();
  }, [id]);

  const getFileViewUrl = (url) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith(".docx") || lowerUrl.includes(".docx?")) {
      return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const DocumentRow = ({ label, url }) => (
    <div className="flex items-center justify-between p-3 bg-white border border-[#e1dbd2] rounded-lg mb-2 shadow-sm">
      <div className="flex items-center gap-3">
        <FileText className={`h-5 w-5 ${url ? "text-[#1f6b4a]" : "text-gray-300"}`} />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      {url ? (
        <a 
          href={getFileViewUrl(url)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-[11px] font-bold text-[#1f6b4a] hover:underline bg-[#f1f8f5] px-2 py-1 rounded"
        >
          VIEW FILE <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-[10px] font-bold text-red-500 italic flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
          <AlertCircle className="h-3 w-3" /> NOT UPLOADED
        </span>
      )}
    </div>
  );

  if (!mounted || loading) return <div className="p-20 text-center font-medium font-sans">Loading Employee Profile...</div>;
  if (!employee) return <div className="p-20 text-center text-red-500">Employee record not found.</div>;

  return (
    <div className="p-6 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to HR List
        </Button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-[#e1dbd2] shadow-sm gap-4">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 bg-[#123d2b] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
              {employee.full_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#123d2b]">{employee.full_name}</h1>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {employee.job_role || "Role not assigned"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> Started: {employee.start_date || "No Details Recorded"}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push(`/hrList/${id}/edit`)} className="bg-[#1f6b4a] hover:bg-[#123d2b] px-6">
            Edit Employee
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-white border-[#e1dbd2] p-1 h-12 shadow-sm">
            <TabsTrigger value="profile" className="px-6">Personal & References</TabsTrigger>
            <TabsTrigger value="compliance" className="px-6">Compliance Docs</TabsTrigger>
            <TabsTrigger value="hr" className="px-6">HR & Development</TabsTrigger>
          </TabsList>

          {/* TAB 1: PERSONAL & REFERENCES */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-[#e1dbd2] shadow-sm bg-white">
                <CardHeader className="border-b border-[#f7f2e9]"><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><User className="h-5 w-5" /> Personal Details</CardTitle></CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-400 text-xs uppercase font-bold">Date of Birth</p><p className="font-semibold text-gray-800">{employee.dob || "Not Provided"}</p></div>
                    <div><p className="text-gray-400 text-xs uppercase font-bold">Contact Info</p><p className="font-semibold text-gray-800">{employee.contact_info || "Not Provided"}</p></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#e1dbd2] shadow-sm bg-white">
                <CardHeader className="border-b border-[#f7f2e9]"><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><ShieldCheck className="h-5 w-5" /> References & Verification</CardTitle></CardHeader>
                <CardContent className="pt-4 space-y-4 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-[#f1f8f5]">
                    <span className="font-medium text-[#123d2b]">Phone Verification</span>
                    <Badge className={employee.refs_verified_by_phone ? "bg-green-600 text-green-900" : "bg-amber-500 text-orange-950"}>
                      {employee.refs_verified_by_phone ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold">Verification Details</p>
                    <p className="italic text-gray-700">{employee.verification_details || "No details recorded."}</p>
                  </div>
                  <div className="space-y-3 mt-2">
                    <DocumentRow label={`Ref 1: ${employee.ref1_name || "N/A"}`} url={employee.ref1_doc_url} />
                    <DocumentRow label={`Ref 2: ${employee.ref2_name || "N/A"}`} url={employee.ref2_doc_url} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: COMPLIANCE */}
          <TabsContent value="compliance" className="mt-6">
            <Card className="border-[#e1dbd2] shadow-sm bg-white">
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Identity & Rights</h3>
                  <DocumentRow label="Photo ID" url={employee.photo_id_url} />
                  <DocumentRow label="Evidence of Address" url={employee.evidence_address_url} />
                  <DocumentRow label="Right to Work Check" url={employee.rtw_check_url} />
                  <DocumentRow label="Insurance Document" url={employee.insurance_url} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Checks & Applications</h3>
                  <div className="p-3 border rounded-lg bg-[#fcfcfc] flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">DBS Number</span>
                      <span className="text-sm font-bold text-[#123d2b]">{employee.dbs_number || "Not Set"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Completion</span>
                      <p className="text-xs font-medium">{employee.dbs_completion_date || "Pending"}</p>
                    </div>
                  </div>
                  <DocumentRow label="DBS Trace Risk Assessment" url={employee.dbs_trace_notes_url} />
                  <DocumentRow label="Signed Application Form" url={employee.signed_app_url} />
                  <DocumentRow label="Interview Notes" url={employee.interview_notes_url} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: HR & DEVELOPMENT */}
          <TabsContent value="hr" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-[#e1dbd2]">
                <CardHeader><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><GraduationCap className="h-5 w-5"/> Professional Development</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <DocumentRow label="Induction Checklist" url={employee.induction_checklist_url} />
                  <DocumentRow label="Training Record" url={employee.training_record_url} />
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Qualifications</h4>
                    {employee.qualifications?.length > 0 ? (
                      employee.qualifications.map((item, idx) => (
                        <DocumentRow key={idx} label={item.name || "Unnamed Qualification"} url={item.url} />
                      ))
                    ) : <p className="text-xs text-gray-400 italic">None recorded.</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#e1dbd2]">
                <CardHeader><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><ClipboardList className="h-5 w-5"/> Performance & Records</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="p-3 border rounded bg-[#fcfcfc]">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Last Appraisal</p>
                      <p className="text-sm font-medium">{employee.last_appraisal_date || "None Recorded"}</p>
                    </div>
                  </div>
                  <DocumentRow label="Appraisal Document" url={employee.appraisal_doc_url} />
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Supervision History</h4>
                    {employee.supervisions?.length > 0 ? (
                      employee.supervisions.map((item, idx) => (
                        <DocumentRow key={idx} label={`${item.name || "Name Recorded"} (${item.date})`} url={item.url} />
                      ))
                    ) : <p className="text-xs text-gray-400 italic">None recorded.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-[#e1dbd2]">
              <CardHeader><CardTitle className="text-md flex items-center gap-2 text-[#123d2b]"><Info className="h-5 w-5" /> Sickness & Miscellaneous</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <h4 className="text-xs font-bold text-gray-400 uppercase">Sickness & Disciplinary</h4>
                   {employee.sickness_disciplinary_urls?.length > 0 ? (
                    employee.sickness_disciplinary_urls.map((url, idx) => (
                      <DocumentRow key={idx} label={`Record #${idx + 1}`} url={url} />
                    ))
                   ) : <p className="text-xs text-gray-400 italic">No records found.</p>}
                </div>
                <div className="space-y-2">
                   <h4 className="text-xs font-bold text-gray-400 uppercase">Other Documents</h4>
                   {employee.other_documents?.length > 0 ? (
                    employee.other_documents.map((item, idx) => (
                      <DocumentRow key={idx} label={item.name || "Misc Document"} url={item.url} />
                    ))
                   ) : <p className="text-xs text-gray-400 italic">No other documents.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDetailView;