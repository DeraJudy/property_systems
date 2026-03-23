"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/superbase/clientUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  Loader2, ArrowLeft, Edit, Mail, Phone, Calendar, 
  MapPin, HeartPulse, Banknote, ShieldAlert, FileText, 
  UserCircle, Briefcase, ExternalLink, Hash, Fingerprint
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function ViewServiceUser() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("service_users")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error("Error:", error);
      router.push("/service-users");
    } finally {
      setLoading(false);
    }
  };

  const formatTitle = (title) => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[#1f6b4a]" />
      </div>
    );
  }

  const DataField = ({ label, value, icon: Icon, fullWidth = false }) => (
    <div className={`space-y-1.5 ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="flex items-center gap-1.5 text-[#123d2b]/60">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[#123d2b] leading-snug">
        {value || <span className="text-muted-foreground font-normal italic">Not recorded</span>}
      </p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 bg-[#fbf8f2] min-h-screen"
    >
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#f1ede4]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
        </Button>
        <Link href={`/service-users/${id}/edit`}>
          <Button className="bg-[#1f6b4a] hover:bg-[#123d2b] shadow-lg shadow-green-900/10 transition-all">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Sidebar (Left) */}
        <motion.div {...fadeInUp} className="lg:col-span-4 xl:col-span-3 space-y-6">
          <Card className="border-[#e1dbd2] shadow-xl overflow-hidden sticky top-8">
            <div className="h-32 bg-linear-to-br from-[#123d2b] to-[#1f6b4a]" />
            <CardContent className="pt-0 -mt-16 flex flex-col items-center text-center px-6 pb-8">
              <Avatar className="h-32 w-32 border-8 border-[#fbf8f2] shadow-2xl">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-[#123d2b] text-white text-3xl font-serif">
                  {user.first_name?.[0]}{user.surname?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-6 text-2xl font-black text-[#123d2b] tracking-tight">
                {formatTitle(user.title)} {user.first_name} {user.surname}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                <Fingerprint className="w-3 h-3" />
                <span className="text-xs font-mono uppercase tracking-tighter">{user.ni_number || "NO NI RECORDED"}</span>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <Badge className={user.is_employed ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
                  {user.is_employed ? "Currently Employed" : "Unemployed"}
                </Badge>
                {user.is_smoker === "yes" && (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border border-orange-200">Smoker</Badge>
                )}
              </div>

              <div className="w-full mt-8 space-y-4 pt-6 border-t border-[#e1dbd2]/50">
                <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
                  <div className="bg-white p-2 rounded-full shadow-sm"><Mail className="w-4 h-4 text-[#1f6b4a]" /></div>
                  <span className="truncate font-medium">{user.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
                  <div className="bg-white p-2 rounded-full shadow-sm"><Phone className="w-4 h-4 text-[#1f6b4a]" /></div>
                  <span className="font-medium">{user.contact_no || "No phone"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#123d2b] justify-start bg-[#f1ede4]/30 p-2 rounded-md">
                  <div className="bg-white p-2 rounded-full shadow-sm"><MapPin className="w-4 h-4 text-[#1f6b4a]" /></div>
                  <span className="font-medium">Room: {user.assigned_room || "TBD"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details Section (Right) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          
          {/* Information Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Demographic */}
            <motion.div {...fadeInUp}>
              <Card className="h-full border-[#e1dbd2] hover:shadow-md transition-shadow">
                <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                    <UserCircle className="w-4 h-4" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6 pt-6">
                  <DataField label="Birth Date" value={user.dob} icon={Calendar} />
                  <DataField label="Age" value={`${user.age} Years`} />
                  <DataField label="Gender" value={user.gender} />
                  <DataField label="NHS Number" value={user.nhs_number} icon={Hash} />
                  <DataField label="Ethnicity" value={user.ethnic_group} fullWidth />
                </CardContent>
              </Card>
            </motion.div>

            {/* Financial */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="h-full border-[#e1dbd2] hover:shadow-md transition-shadow">
                <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                    <Banknote className="w-4 h-4" /> Financial Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <DataField label="Benefit Type" value={user.benefit_type} />
                    <DataField label="Payment" value={user.benefit_amount ? `£${user.benefit_amount} / ${user.benefit_frequency}` : null} />
                  </div>
                  <Separator className="bg-[#e1dbd2]/50" />
                  <div className="grid grid-cols-2 gap-4">
                    <DataField label="Employer" value={user.employer_name} icon={Briefcase} />
                    <DataField label="Job Title" value={user.job_title} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Medical Section */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card className="border-[#e1dbd2] hover:shadow-md transition-shadow">
              <CardHeader className="bg-[#f1ede4]/30 border-b border-[#e1dbd2]/50">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                  <HeartPulse className="w-4 h-4" /> Medical & Health History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#e1dbd2]/50">
                  <div className="p-6 space-y-6">
                    <DataField label="Reported Allergies" value={user.allergies} fullWidth />
                    <DataField label="Active Medications" value={user.medication_details} fullWidth />
                  </div>
                  <div className="p-6 space-y-6 bg-[#f1ede4]/10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Health Summaries</span>
                      <div className="mt-4 space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-[#e1dbd2]/50 shadow-sm">
                          <p className="text-[9px] font-black text-[#1f6b4a] uppercase mb-1">Physical Health</p>
                          <p className="text-xs text-[#123d2b] leading-relaxed">{user.physical_health_history || "No physical health records provided."}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-[#e1dbd2]/50 shadow-sm">
                          <p className="text-[9px] font-black text-[#1f6b4a] uppercase mb-1">Mental Health</p>
                          <p className="text-xs text-[#123d2b] leading-relaxed">{user.mental_health_history || "No mental health records provided."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Forensic & Risk Section */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="border-[#e1dbd2] bg-white border-l-4 border-l-[#123d2b]">
              <CardHeader className="bg-[#f1ede4]/20 border-b border-[#e1dbd2]/50">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-[#123d2b] uppercase tracking-widest">
                  <ShieldAlert className="w-4 h-4" /> Risk & Forensic Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-6">
                <DataField label="Forensic Background" value={user.forensic_background} />
                <DataField label="Probation Details" value={user.probation_details} />
                <DataField label="Risk Assessments" value={user.risk_from_others} />
                <DataField label="Safety Precautions" value={user.interview_precautions} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents Section */}
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
            <Card className="border-[#e1dbd2] shadow-sm">
              <CardHeader className="bg-[#123d2b] border-b border-[#123d2b]">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-white uppercase tracking-widest">
                  <FileText className="w-4 h-4" /> Compliance Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: "Identity Verification", url: user.id_verification_url },
                    { label: "Tenancy Agreement", url: user.tenancy_agreement_url },
                    { label: "Benefit Documentation", url: user.benefit_letter_url },
                    { label: "Risk Assessment Form", url: user.risk_assessment_url },
                  ].map((doc, idx) => (
                    <div key={idx} className="group relative p-4 border rounded-xl bg-[#fbf8f2] hover:border-[#1f6b4a] transition-all flex flex-col gap-3">
                      <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-[#1f6b4a]" />
                      </div>
                      <span className="text-xs font-bold text-[#123d2b]">{doc.label}</span>
                      {doc.url ? (
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center justify-center gap-2 w-full mt-2 text-[10px] font-black uppercase bg-[#123d2b] text-white py-2 rounded-lg hover:bg-[#1f6b4a] transition-colors"
                        >
                          View File <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <div className="mt-2 text-[10px] text-center font-bold text-slate-400 bg-slate-100 py-2 rounded-lg italic uppercase">
                          No Upload
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}