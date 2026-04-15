// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { createClient } from "@/lib/superbase/clientUtils"; 
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { motion, AnimatePresence } from "framer-motion";
// import { ArrowLeft, FileText, Paperclip, Loader2, User, UserCircle, Clock } from "lucide-react";
// import { toast } from "sonner";

// const container = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.04 } },
// };
// const item = {
//   hidden: { opacity: 0, y: 10 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
// };

// const SupportLogNewPage = () => {
//   // const { id } = useParams(); 
//   const router = useRouter();
//   const supabase = createClient();

//   const [loading, setLoading] = useState(false);
//   const [fetchingUser, setFetchingUser] = useState(true);
//   const [showFollowUpDate, setShowFollowUpDate] = useState(false);
//   const [serviceUserName, setServiceUserName] = useState(""); 
//   const [selectedFile, setSelectedFile] = useState(null);

//   const params = useParams();
// const id = params?.id;
  
//   const [formData, setFormData] = useState({
//     session_type: "",
//     session_mode: "",
//     session_date: new Date().toISOString().split("T")[0],
//     session_time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
//     duration: "",
//     notes: "",
//     follow_up_date: "",
//     support_worker_name: "", 
//     support_worker_id: "",   
//   });

//   const formatName = (name) => {
//     if (!name) return "";
//     return name
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   useEffect(() => {
//     if (!id) return;

//     const getInitialData = async () => {
//       try {
//         const { data: { user }, error: authError } = await supabase.auth.getUser();
        
//         if (authError || !user) {
//           toast.error("Session expired. Please login again.");
//           return;
//         }

//         const rawName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0].replace(".", " ");
//         const formattedName = formatName(rawName);

//         const { data: serviceUser } = await supabase
//           // .from("service_user_table")
//           // .select("first_name, surname")
//           // .eq("id", id)
//           // .single();
//           .from("service_user_intake") // Changed from "service_user_table"
//   .select("service_user_name") // Changed to match the column in your image
//   .eq("id", id)
//   .single();

//         if (serviceUser) {
//           setServiceUserName(`${serviceUser.first_name} ${serviceUser.surname}`);
//         }

//         setFormData(prev => ({
//           ...prev,
//           support_worker_name: formattedName,
//           support_worker_id: user.id
//         }));
//       } catch (err) {
//         console.error("Initialization error:", err);
//       } finally {
//         setFetchingUser(false);
//       }
//     };

//     getInitialData();
//   }, [supabase, id]);

//   const generateDurations = () => {
//     const durations = ["00:05", "00:10", "00:15", "00:30", "00:45"];
//     for (let i = 1; i <= 24; i++) {
//       durations.push(`${i.toString().padStart(2, "0")}:00`);
//     }
//     return durations;
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const fileExtension = file.name.split('.').pop().toLowerCase();
//       if (!['pdf', 'doc', 'docx'].includes(fileExtension)) {
//         toast.error("Only PDF, DOC, and DOCX files are allowed");
//         e.target.value = null; 
//         return;
//       }
//       setSelectedFile(file);
//     }
//   };

//   const handleSave = async () => {
//     if (!formData.notes || !formData.session_type) {
//       toast.error("Please fill in the required fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       let attachmentUrl = null;

//       if (selectedFile) {
//         const fileExt = selectedFile.name.split(".").pop();
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
//         const filePath = `${id}/${fileName}`;

//         const { error: uploadError } = await supabase.storage
//           .from("support_documents") 
//           .upload(filePath, selectedFile);

//         if (uploadError) throw uploadError;

//         const { data: publicUrlData } = supabase.storage
//           .from("support_documents")
//           .getPublicUrl(filePath);
        
//         attachmentUrl = publicUrlData.publicUrl;
//       }

//       // INSERT LOGIC INCLUDING SESSION_TIME
//       const { error } = await supabase.from("support_logs").insert([
//         {
//           service_user_id: id,
//           service_user_name: serviceUserName,
//           session_type: formData.session_type,
//           session_mode: formData.session_mode,
//           session_date: formData.session_date,
//           session_time: formData.session_time, // <--- SAVING TO DB
//           duration: formData.duration,
//           notes: formData.notes,
//           staff_name: formData.support_worker_name,
//           staff_id: formData.support_worker_id,
//           follow_up_required: showFollowUpDate,
//           follow_up_date: showFollowUpDate ? formData.follow_up_date : null,
//           attachment_url: attachmentUrl, 
//         },
//       ]);

//       if (error) throw error;

//       toast.success("Support log saved successfully");
//       router.back();
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchingUser) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-[#123d2b]" />
//       </div>
//     );
//   }

//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl p-4 mx-auto">
//       <motion.div variants={item} className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" onClick={() => router.back()}>
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
//           <FileText className="h-5 w-5 text-accent-foreground" />
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">New Support Log</h1>
//           <p className="text-sm text-muted-foreground">Record a support session</p>
//         </div>
//       </motion.div>

//       <motion.div variants={item}>
//         <Card className="shadow-card p-6 space-y-6">
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <Label>Service User</Label>
//               <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-md border border-input text-sm font-semibold text-[#123d2b]">
//                 <UserCircle className="w-4 h-4" /> {serviceUserName || "Loading..."}
//               </div>
//             </div>

//             <div>
//               <Label>Support Worker</Label>
//               <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md border border-input text-sm font-medium">
//                 <User className="w-4 h-4 text-[#123d2b]" /> {formData.support_worker_name}
//               </div>
//             </div>

//             <div>
//               <Label>Session Type</Label>
//               <Select onValueChange={(val) => setFormData({...formData, session_type: val})}>
//                 <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="appointment">Appointment</SelectItem>
//                   <SelectItem value="1to1">1:1 Session</SelectItem>
//                   <SelectItem value="welfare">Welfare Check</SelectItem>
//                   <SelectItem value="support">Support</SelectItem>
//                   <SelectItem value="general">General</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Mode of Support</Label>
//               <Select onValueChange={(val) => setFormData({...formData, session_mode: val})}>
//                 <SelectTrigger className="mt-1"><SelectValue placeholder="Select mode" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="in-person">In-Person</SelectItem>
//                   <SelectItem value="phone">By Phone</SelectItem>
//                   <SelectItem value="email">Email</SelectItem>
//                   <SelectItem value="text">Text Message</SelectItem>
//                   <SelectItem value="post">By Post</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Session Date</Label>
//               <Input className="mt-1" type="date" value={formData.session_date} onChange={(e) => setFormData({...formData, session_date: e.target.value})} />
//             </div>

//             <div>
//               <Label>Session Time</Label>
//               <Input 
//                 className="mt-1" 
//                 type="time" 
//                 value={formData.session_time} 
//                 onChange={(e) => setFormData({...formData, session_time: e.target.value})} 
//               />
//             </div>

//             <div>
//               <Label>Duration (HH:MM)</Label>
//               <Select onValueChange={(val) => setFormData({...formData, duration: val})}>
//                 <SelectTrigger className="mt-1"><SelectValue placeholder="Select duration" /></SelectTrigger>
//                 <SelectContent>
//                   {generateDurations().map((time) => (
//                     <SelectItem key={time} value={time}>{time}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex flex-col justify-end pb-1">
//               <div className="flex items-center gap-2">
//                 <Checkbox id="followup" onCheckedChange={(checked) => setShowFollowUpDate(checked)} />
//                 <Label htmlFor="followup" className="text-sm cursor-pointer font-medium">Follow-up required</Label>
//               </div>
//             </div>

//             <AnimatePresence>
//               {showFollowUpDate && (
//                 <motion.div 
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="sm:col-span-2"
//                 >
//                   <div className="pt-2">
//                     <Label className="text-amber-600 font-semibold">Follow-up Date</Label>
//                     <Input 
//                       className="mt-1 border-amber-200 focus:ring-amber-500" 
//                       type="date" 
//                       onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})} 
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           <div>
//             <Label>Session Notes</Label>
//             <Textarea className="mt-1" rows={5} placeholder="Record session details..." onChange={(e) => setFormData({...formData, notes: e.target.value})} />
//           </div>

//           <div>
//             <Label>Attachments (PDF, DOC, DOCX only)</Label>
//             <div className="mt-1 relative">
//               <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" id="file-upload" />
//               <label htmlFor="file-upload" className="flex items-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground cursor-pointer hover:bg-accent/30 transition-colors">
//                 <Paperclip className="h-4 w-4" />
//                 {selectedFile ? selectedFile.name : "Click to upload document"}
//               </label>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-2">
//             <Button onClick={handleSave} disabled={loading} className="bg-[#123d2b] hover:bg-[#1f6b4a] text-white">
//               {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
//               Save Log
//             </Button>
//             <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
//           </div>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default SupportLogNewPage;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Adjust path to your supabase client
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  ArrowLeft, FileText, UserCircle, User, Paperclip, Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Framer Motion variants
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const  SupportLogNewPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Assuming the Service User ID comes from the URL

  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [serviceUserName, setServiceUserName] = useState("");
  const [showFollowUpDate, setShowFollowUpDate] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Static list of support workers
  const supportWorkers = [
    "Omar",
    "Megan",
    "Adnan",
    "Abdul",
    "Jamie",
    "Jermaine",
    "Zivile",
    "Lukhmann Ali"
  ];

  const [formData, setFormData] = useState({
    service_user_id: id,
    service_user_name: "",
    support_worker_id: "",
    support_worker_name: "",
    session_type: "",
    session_mode: "",
    session_date: new Date().toISOString().split("T")[0],
    // session_time: "",
    duration: "",
    notes: "",
    follow_up_date: null,
    file_path: null, // Critical for future deletion
    file_url: null,
  });

  useEffect(() => {
    getInitialData();
  }, [id]);

  const getInitialData = async () => {
    try {
      // 1. Get Logged in Worker Info
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const rawName = user.user_metadata?.full_name || user.email.split('@')[0];
      
      // 2. Get Service User Details from service_user_intake (as per your image)
      const { data: serviceUser, error: sError } = await supabase
        .from("service_user_intake")
        .select("service_user_name")
        .eq("id", id)
        .single();

      if (sError) throw sError;

      if (serviceUser) {
        setServiceUserName(serviceUser.service_user_name);
        setFormData(prev => ({
          ...prev,
          service_user_name: serviceUser.service_user_name,
          support_worker_name: rawName,
          support_worker_id: user.id
        }));
      }
    } catch (err) {
      console.error("Initialization error:", err);
      toast.error("Could not load user data");
    } finally {
      setFetchingUser(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const allowed = ['pdf', 'doc', 'docx'];
      if (!allowed.includes(fileExt.toLowerCase())) {
        toast.error("Invalid file type. Please upload PDF or Word docs.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const generateDurations = () => {
    const times = [];
    for (let i = 15; i <= 240; i += 15) {
      const hrs = Math.floor(i / 60);
      const mins = i % 60;
      times.push(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }
    return times;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let uploadedFilePath = null;
      let publicUrl = null;

      // 1. Handle File Upload if file exists
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${id}/${Math.random()}.${fileExt}`; // Organized by service user folder
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("support_documents")
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        uploadedFilePath = filePath;
        const { data: urlData } = supabase.storage.from("support_documents").getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      // 2. Save to support_logs table
      const { error: insertError } = await supabase
        .from("support_logs")
        .insert([{
          ...formData,
          file_path: uploadedFilePath, // Storing this makes deletion easy!
          file_url: publicUrl,
          created_at: new Date()
        }]);

      if (insertError) throw insertError;

      toast.success("Support log saved successfully");
      router.back();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl p-4 mx-auto">
      <motion.div variants={item} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <FileText className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Support Log</h1>
          <p className="text-sm text-muted-foreground">Record a support session</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-card p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Service User</Label>
              <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-md border border-input text-sm font-semibold text-[#123d2b]">
                <UserCircle className="w-4 h-4" /> {fetchingUser ? "Loading..." : serviceUserName}
              </div>
            </div>

            {/* <div>
              <Label>Support Worker</Label>
              <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md border border-input text-sm font-medium">
                <User className="w-4 h-4 text-[#123d2b]" /> {formData.support_worker_name}
              </div>
            </div> */}

            <div>
              <Label>Support Worker</Label>
              <Select onValueChange={(val) => setFormData({...formData, support_worker_name: val})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {supportWorkers.map((worker) => (
                    <SelectItem key={worker} value={worker}>
                      {worker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div>
              <Label>Session Type</Label>
              <Select onValueChange={(val) => setFormData({...formData, session_type: val})}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="1to1">1:1 Session</SelectItem>
                  <SelectItem value="welfare">Welfare Check</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Mode of Support</Label>
              <Select onValueChange={(val) => setFormData({...formData, session_mode: val})}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="phone">By Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="post">By Post</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Session Date</Label>
              <Input 
                className="mt-1" 
                type="date" 
                value={formData.session_date} 
                onChange={(e) => setFormData({...formData, session_date: e.target.value})} 
              />
            </div>

            {/* <div>
              <Label>Session Time</Label>
              <Input 
                className="mt-1" 
                type="time" 
                onChange={(e) => setFormData({...formData, session_time: e.target.value})} 
              />
            </div> */}

            <div>
              <Label>Duration (HH:MM)</Label>
              <Select onValueChange={(val) => setFormData({...formData, duration: val})}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select duration" /></SelectTrigger>
                <SelectContent>
                  {generateDurations().map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col justify-end pb-1">
              <div className="flex items-center gap-2">
                <Checkbox id="followup" onCheckedChange={(checked) => setShowFollowUpDate(checked)} />
                <Label htmlFor="followup" className="text-sm cursor-pointer font-medium">Follow-up required</Label>
              </div>
            </div>

            <AnimatePresence>
              {showFollowUpDate && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="sm:col-span-2"
                >
                  <div className="pt-2">
                    <Label className="text-amber-600 font-semibold">Follow-up Date</Label>
                    <Input 
                      className="mt-1 border-amber-200 focus:ring-amber-500" 
                      type="date" 
                      onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <Label>Session Notes</Label>
            <Textarea 
              className="mt-1" 
              rows={5} 
              placeholder="Record session details..." 
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
            />
          </div>

          <div>
            <Label>Attachments (PDF, DOC, DOCX only)</Label>
            <div className="mt-1 relative">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
                className="hidden" 
                id="file-upload" 
              />
              <label 
                htmlFor="file-upload" 
                className="flex items-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground cursor-pointer hover:bg-accent/30 transition-colors"
              >
                <Paperclip className="h-4 w-4" />
                {selectedFile ? selectedFile.name : "Click to upload document"}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={handleSave} 
              disabled={loading} 
              className="bg-[#123d2b] hover:bg-[#1f6b4a] text-white"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Log
            </Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SupportLogNewPage;