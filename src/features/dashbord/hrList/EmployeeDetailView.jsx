"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  ExternalLink, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  ClipboardList,
  Calendar
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

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

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
      console.error("Error fetching employee:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, fileName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName || "document";
    link.click();
  };

  const DocumentRow = ({ label, url, fileName }) => {
    if (!url) return null;
    
    // Handle both single URLs and arrays of URLs
    const urls = Array.isArray(url) ? url : [url];

    return (
      <div className="flex items-center justify-between p-3 border border-[#e1dbd2] rounded-lg bg-white mb-2">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-[#1f6b4a]" />
          <span className="text-sm font-medium text-[#123d2b]">{label}</span>
        </div>
        <div className="flex gap-2">
          {urls.map((u, i) => (
            <div key={i} className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#1f6b4a] hover:bg-[#e6f2ec]"
                onClick={() => window.open(u, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> View
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#1f6b4a] hover:bg-[#e6f2ec]"
                onClick={() => handleDownload(u, `${label.replace(/\s+/g, '_')}_${i+1}`)}
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-10 text-center">Loading employee records...</div>;
  if (!employee) return <div className="p-10 text-center">Employee not found.</div>;

  return (
    <div className="p-6 bg-[#f5f0e6] min-h-screen space-y-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-[#123d2b]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workforce
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#123d2b]">{employee.full_name}</h1>
            <p className="text-[#6b7d74]">{employee.job_role} • Joined {new Date(employee.start_date).toLocaleDateString()}</p>
          </div>
          <Badge className="bg-[#1f6b4a] text-[#f7f2e9] px-4 py-1 text-md">Active Record</Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#ece7df] border-[#e1dbd2]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Staff Files & Compliance</TabsTrigger>
            <TabsTrigger value="training">Training & Supervision</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-[#fbf8f2] border-[#e1dbd2]">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Personal Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-xs text-[#6b7d74] uppercase font-bold">Date of Birth</p>
                    <p className="text-[#123d2b]">{employee.dob || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7d74] uppercase font-bold">Contact Info</p>
                    <p className="text-[#123d2b]">{employee.contact_info}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7d74] uppercase font-bold">DBS Number</p>
                    <p className="text-[#123d2b]">{employee.dbs_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7d74] uppercase font-bold">DBS Expiry/Completion</p>
                    <p className="text-[#123d2b]">{employee.dbs_completion_date || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fbf8f2] border-[#e1dbd2]">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5" /> Key Dates</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-[#6b7d74]">Last Supervision</p>
                    <p className="font-medium">{employee.last_supervision_date || "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7d74]">Last Appraisal</p>
                    <p className="font-medium">{employee.last_appraisal_date || "Pending"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents">
            <Card className="bg-[#fbf8f2] border-[#e1dbd2]">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Compliance Documents</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <DocumentRow label="Proof of Address" url={employee.evidence_address_url} />
                <DocumentRow label="Photographic ID" url={employee.photo_id_url} />
                <DocumentRow label="Signed Application Form" url={employee.signed_app_url} />
                <DocumentRow label="Right to Work / Conduct" url={employee.rtw_check_url} />
                <DocumentRow label="Insurance / Registration" url={employee.insurance_url} />
                
                <div className="mt-6 pt-6 border-t border-[#e1dbd2]">
                  <h4 className="text-sm font-bold text-[#123d2b] mb-4">Reference Verifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#f5f0e6] rounded-lg">
                      <p className="text-sm font-bold">{employee.ref1_name}</p>
                      <p className="text-xs text-[#6b7d74] mb-2">{employee.ref1_email}</p>
                      <DocumentRow label="Ref 1 Document" url={employee.ref1_doc_url} />
                    </div>
                    <div className="p-4 bg-[#f5f0e6] rounded-lg">
                      <p className="text-sm font-bold">{employee.ref2_name}</p>
                      <p className="text-xs text-[#6b7d74] mb-2">{employee.ref2_email}</p>
                      <DocumentRow label="Ref 2 Document" url={employee.ref2_doc_url} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRAINING TAB */}
          <TabsContent value="training">
            <Card className="bg-[#fbf8f2] border-[#e1dbd2]">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Professional Development</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#123d2b]">Induction & Core Training</h4>
                    <DocumentRow label="Induction Checklist" url={employee.induction_checklist_url} />
                    <DocumentRow label="Training Records" url={employee.training_record_url} />
                    <DocumentRow label="Qualifications" url={employee.qualifications_urls} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#123d2b]">Supervision & Performance</h4>
                    <DocumentRow label="Supervision Notes" url={employee.supervision_notes_urls} />
                    <DocumentRow label="Appraisal Documents" url={employee.appraisal_doc_url} />
                    <DocumentRow label="Sickness & Disciplinary" url={employee.sickness_disciplinary_urls} />
                  </div>
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