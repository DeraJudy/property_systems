// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { 
//   ArrowLeft, 
//   User, 
//   Home, 
//   Users, 
//   FileText, 
//   Activity, 
//   Download, 
//   ExternalLink,
//   Loader2,
//   Calendar,
//   Mail,
//   Phone,
//   Briefcase
// } from "lucide-react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";

// const supabase = createClient();

// // --- Helper Component for Data Rows ---
// const DataRow = ({ label, value }) => (
//   <div className="py-3 border-b border-[#e1dbd2]/50 flex justify-between items-center">
//     <span className="text-sm font-semibold text-[#6b7d74] uppercase tracking-wider">{label}</span>
//     <span className="text-[#123d2b] font-medium">{value || "N/A"}</span>
//   </div>
// );

// // --- Helper Component for Document Links ---
// const DocCard = ({ title, path }) => {
//   if (!path) return null;
  
//   const getPublicUrl = () => {
//     const { data } = supabase.storage.from('service-user-docs').getPublicUrl(path);
//     return data.publicUrl;
//   };

//   return (
//     <div className="flex items-center justify-between p-4 bg-white border border-[#e1dbd2] rounded-xl shadow-sm hover:shadow-md transition-all">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-[#e6f2ec] rounded-lg text-[#1f6b4a]">
//           <FileText size={20} />
//         </div>
//         <span className="font-bold text-[#123d2b]">{title}</span>
//       </div>
//       <div className="flex gap-2">
//         <a 
//           href={getPublicUrl()} 
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-lg transition-colors"
//         >
//           <ExternalLink size={18} />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default function ViewServiceUserProfile() {
//   const router = useRouter();
//   const { id } = useParams();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('service_users_table')
//           .select('*')
//           .eq('id', id)
//           .single();

//         if (error) throw error;
//         setUserData(data);
//       } catch (err) {
//         toast.error("User not found");
//         router.push("/dashboard/service-users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id, router]);

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e6]">
//       <Loader2 className="animate-spin text-[#1f6b4a] mb-4" size={40} />
//       <p className="text-[#123d2b] font-bold">Loading Profile...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen py-12 px-4">
//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* Navigation & Header */}
//         <div className="flex items-center justify-between">
//           <button 
//             onClick={() => router.back()} 
//             className="flex items-center gap-2 text-[#1f6b4a] font-bold hover:underline"
//           >
//             <ArrowLeft size={20} /> Back to List
//           </button>
//           <button 
//             onClick={() => router.push(`/service-users/${id}/edit`)}
//             className="bg-[#1f6b4a] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#123d2b]"
//           >
//             Edit Profile
//           </button>
//         </div>

//         {/* Hero Header */}
//         <div className="bg-[#123d2b] text-white p-10 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div className="flex items-center gap-6">
//             <div className="w-20 h-20 bg-[#1f6b4a] rounded-2xl flex items-center justify-center text-3xl font-bold">
//               {userData.first_name[0]}{userData.surname[0]}
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold">{userData.title} {userData.first_name} {userData.surname}</h1>
//               <p className="text-[#c3e2d1] flex items-center gap-2 mt-1">
//                 <Calendar size={16} /> DOB: {userData.dob} ({userData.age} years old)
//               </p>
//             </div>
//           </div>
//           <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
//             <p className="text-xs uppercase tracking-widest text-[#c3e2d1] mb-1">NI Number</p>
//             <p className="text-xl font-mono font-bold">{userData.ni_number || "NOT PROVIDED"}</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
//           {/* Left Column: Contact & Personal */}
//           <div className="md:col-span-2 space-y-8">
            
//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <User className="text-[#1f6b4a]" /> Personal & Contact Info
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
//                 <DataRow label="Gender" value={userData.gender} />
//                 <DataRow label="Ethnic Group" value={userData.ethnic_group} />
//                 <DataRow label="Ethnic Origin" value={userData.ethnic_origin} />
//                 <DataRow label="Organisation" value={userData.organisation} />
//                 <DataRow label="Phone" value={userData.contact_number} />
//                 <DataRow label="Email" value={userData.email} />
//               </div>
//             </section>

//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <Home className="text-[#1f6b4a]" /> Placement & Address
//               </h2>
//               <div className="space-y-2">
//                 <DataRow label="Property Name" value={userData.property_name} />
//                 <DataRow label="Assigned Room" value={userData.assigned_room} />
//                 <DataRow label="Street Address" value={userData.street_address} />
//                 <DataRow label="Previous Address" value={userData.previous_address} />
//                 <DataRow label="Keyworker (Assigned To)" value={userData.assigned_to} />
//                 <DataRow label="Approved By" value={userData.approved_by} />
//               </div>
//             </section>

//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <Users className="text-[#1f6b4a]" /> Next of Kin
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
//                 <DataRow label="Full Name" value={userData.nok_name} />
//                 <DataRow label="Relationship" value={userData.nok_relationship} />
//                 <DataRow label="Phone" value={userData.nok_phone} />
//                 <DataRow label="Email" value={userData.nok_email} />
//                 <div className="sm:col-span-2">
//                   <DataRow label="Postal Address" value={userData.nok_address} />
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Right Column: Documents */}
//           <div className="space-y-8">
//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm h-full">
//               <h2 className="text-xl font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <FileText className="text-[#1f6b4a]" /> Documents
//               </h2>
              
//               <div className="space-y-4">
//                 <p className="text-xs font-bold text-[#6b7d74] uppercase">Core Files</p>
//                 <DocCard title="Medical Document" path={userData.medical_doc_path} />
//                 <DocCard title="ID Verification" path={userData.id_v_path} />
//                 <DocCard title="Benefit Letter" path={userData.benefit_letter_path} />
//                 <DocCard title="Risk Assessment" path={userData.risk_assessment_path} />

//                 {userData.additional_docs && userData.additional_docs.length > 0 && (
//                   <>
//                     <p className="text-xs font-bold text-[#6b7d74] uppercase mt-6">Additional Documents</p>
//                     {userData.additional_docs.map((doc, idx) => (
//                       <DocCard key={idx} title={doc.name} path={doc.path} />
//                     ))}
//                   </>
//                 )}

//                 {/* Empty State for Docs */}
//                 {!userData.medical_doc_path && !userData.id_v_path && !userData.additional_docs?.length && (
//                   <div className="text-center py-10 text-[#6b7d74] italic text-sm">
//                     No documents uploaded for this user.
//                   </div>
//                 )}
//               </div>
//             </section>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, User, Home, Users, FileText, Activity, 
  ExternalLink, Loader2, Calendar, Mail, Phone, 
  Plus, Trash2, Video, CheckCircle, Download, Clock,
  Fingerprint, MapPin, UserCircle, Hash
} from "lucide-react";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const supabase = createClient();

// --- Helper Components ---
const DataRow = ({ label, value }) => (
  <div className="py-3 border-b border-[#e1dbd2]/50 flex justify-between items-center">
    <span className="text-sm font-semibold text-[#6b7d74] uppercase tracking-wider">{label}</span>
    <span className="text-[#123d2b] font-medium">{value || "N/A"}</span>
  </div>
);

const DocCard = ({ title, path }) => {
  if (!path) return null;
  const { data } = supabase.storage.from('service-user-docs').getPublicUrl(path);
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-[#e1dbd2] rounded-xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e6f2ec] rounded-lg text-[#1f6b4a]"><FileText size={20} /></div>
        <span className="font-bold text-[#123d2b]">{title}</span>
      </div>
      <a href={data.publicUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-lg"><ExternalLink size={18} /></a>
    </div>
  );
};

export default function ViewServiceUserProfile() {
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tab Content States
  const [logs, setLogs] = useState([]);
  const [kwsDocs, setKwsDocs] = useState([]);
  
  // Upload States (KWS)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [kwsName, setKwsName] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 16));
  const [docUrl, setDocUrl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.from('service_users_table').select('*').eq('id', id).single();
      const { data: supportLogs } = await supabase.from('support_logs').select('*').eq('service_user_id', id).order('session_date', { ascending: false });
      const { data: kws } = await supabase.from('kws_documents').select('*').eq('service_user_id', id).order('created_at', { ascending: false });
      
      setUserData(user);
      setLogs(supportLogs || []);
      setKwsDocs(kws || []);
    } catch (err) {
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImmediateUpload = async (file, type) => {
    if (!file) return;
    type === "doc" ? setIsUploadingDoc(true) : setIsUploadingMedia(true);
    try {
      const filePath = `${id}/kws_${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('kws_documents').upload(filePath, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('kws_documents').getPublicUrl(filePath);
      type === "doc" ? setDocUrl(publicUrl) : setMediaUrl(publicUrl);
      toast.success("File uploaded temporary storage");
    } catch (err) { toast.error("Upload failed"); } finally {
      type === "doc" ? setIsUploadingDoc(false) : setIsUploadingMedia(false);
    }
  };

  const finalizeKWS = async () => {
    if (!kwsName.trim() || (!docUrl && !mediaUrl)) return toast.error("Missing name or files");
    try {
      const { error } = await supabase.from('kws_documents').insert({
        service_user_id: id,
        kws_name: kwsName,
        session_date: sessionDate,
        file_url: docUrl || mediaUrl,
        doc_url: docUrl,
        media_url: mediaUrl,
        file_name: kwsName,
      });
      if (error) throw error;
      toast.success("KWS Entry Saved");
      setIsUploadModalOpen(false);
      setKwsName(""); setDocUrl(null); setMediaUrl(null);
      fetchData();
    } catch (err) { toast.error("Failed to save record"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f5f0e6]"><Loader2 className="animate-spin text-[#1f6b4a]" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#f5f0e6] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center bg-[#123d2b] text-white p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#1f6b4a] rounded-2xl flex items-center justify-center text-3xl font-bold uppercase">
              {userData.first_name[0]}{userData.surname[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData.title} {userData.first_name} {userData.surname}</h1>
              <p className="text-emerald-100/70">NI: {userData.ni_number || "N/A"}</p>
            </div>
          </div>
            <Link href={`/service-users/${id}/edit`} className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl transition-all">
              Edit Profile
            </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#e8e1d6] p-1 border border-[#e1dbd2] gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6">Overview</TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6">Support Logs</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6">Documents</TabsTrigger>
            <TabsTrigger value="kws" className="data-[state=active]:bg-[#123d2b] data-[state=active]:text-white px-6">Key Working Session</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#123d2b] uppercase tracking-tighter"><User size={20}/> Personal Details</h2>
              <DataRow label="Full Name" value={`${userData.first_name} ${userData.surname}`} />
              <DataRow label="DOB" value={userData.dob} />
              <DataRow label="Age" value={userData.age} />
              <DataRow label="Gender" value={userData.gender} />
            </div>
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#123d2b] uppercase tracking-tighter"><Home size={20}/> Placement</h2>
              <DataRow label="Property" value={userData.property_name} />
              <DataRow label="Room" value={userData.assigned_room} />
              <DataRow label="Assigned To" value={userData.assigned_to} />
            </div>
          </TabsContent>

          {/* SUPPORT LOGS TAB */}
          <TabsContent value="logs">
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#123d2b]">Support History</h2>
                <button className="flex items-center gap-2 bg-[#1f6b4a] text-white px-4 py-2 rounded-lg text-sm font-bold"><Plus size={16}/> Add New Log</button>
              </div>
              {logs.length === 0 ? <p className="text-center py-10 text-gray-500 italic">No support logs recorded yet.</p> : (
                <div className="space-y-4">
                  {logs.map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                      <div>
                        <p className="font-bold text-[#123d2b]">{new Date(log.session_date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600 truncate max-w-md">{log.summary || "View details..."}</p>
                      </div>
                      <button className="text-[#1f6b4a] font-bold text-sm">View Log</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents">
             <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
                <h2 className="text-2xl font-bold mb-8 text-[#123d2b]">Official Files</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocCard title="ID Verification" path={userData.id_v_path} />
                  <DocCard title="Medical Document" path={userData.medical_doc_path} />
                  <DocCard title="Benefit Letter" path={userData.benefit_letter_path} />
                  <DocCard title="Risk Assessment" path={userData.risk_assessment_path} />
                  {userData.additional_docs?.map((doc, i) => (
                    <DocCard key={i} title={doc.name} path={doc.path} />
                  ))}
                </div>
             </div>
          </TabsContent>

          {/* KWS TAB */}
          <TabsContent value="kws">
            <div className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#123d2b]">Key Working Sessions</h2>
                  <p className="text-sm text-gray-500">Audit trail of session evidence and documents</p>
                </div>
                <button onClick={() => setIsUploadModalOpen(true)} className="bg-[#1f6b4a] text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"><Plus size={20}/> New Session Record</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kwsDocs.map(doc => (
                  <div key={doc.id} className="bg-white p-4 rounded-2xl border border-[#e1dbd2] shadow-sm group">
                    <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                       {doc.media_url ? <Video className="text-[#1f6b4a] opacity-40" size={40}/> : <FileText className="text-[#1f6b4a] opacity-40" size={40}/>}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button onClick={() => window.open(doc.file_url)} className="p-2 bg-white rounded-full text-[#1f6b4a]"><ExternalLink size={20}/></button>
                       </div>
                    </div>
                    <h3 className="font-bold text-[#123d2b] truncate">{doc.kws_name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock size={12}/> {new Date(doc.session_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* KWS UPLOAD MODAL */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="sm:max-w-lg bg-[#fbf8f2]">
            <DialogHeader><DialogTitle className="text-2xl font-bold text-[#123d2b]">New KWS Audit Entry</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-bold uppercase mb-2 block">Session Name / Title</label>
                <Input value={kwsName} onChange={(e) => setKwsName(e.target.value)} placeholder="e.g. Weekly Review - Room 4" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase mb-2 block">Session Date/Time</label>
                <Input type="datetime-local" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-xl p-4 text-center">
                  <input type="file" id="kws-doc" className="hidden" onChange={(e) => handleImmediateUpload(e.target.files[0], 'doc')} />
                  <label htmlFor="kws-doc" className="cursor-pointer text-xs font-bold text-[#1f6b4a]">{isUploadingDoc ? "Uploading..." : docUrl ? "Document Linked ✓" : "Upload Document"}</label>
                </div>
                <div className="border-2 border-dashed rounded-xl p-4 text-center">
                  <input type="file" id="kws-media" className="hidden" onChange={(e) => handleImmediateUpload(e.target.files[0], 'media')} />
                  <label htmlFor="kws-media" className="cursor-pointer text-xs font-bold text-[#1f6b4a]">{isUploadingMedia ? "Uploading..." : mediaUrl ? "Media Linked ✓" : "Upload Evidence/Video"}</label>
                </div>
              </div>
              <button onClick={finalizeKWS} className="w-full bg-[#123d2b] text-white py-4 rounded-xl font-bold mt-4 shadow-lg">Finalize Entry</button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}