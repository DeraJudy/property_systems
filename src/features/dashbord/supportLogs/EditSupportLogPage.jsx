"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  ArrowLeft, FileText, UserCircle, Paperclip, Loader2, Save 
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const EditSupportLogPage = () => {
  const router = useRouter();
  const params = useParams();
 const logId = params.logId || params.id; // Assuming the route is /support-logs/[logId]/edit

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showFollowUpDate, setShowFollowUpDate] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Static list of support workers
  const supportWorkers = [
    "Omar",
    "Megan",
    "Adnan",
    "Abdul",
    "Jamie",
    "Jermaine"
  ];

  const [formData, setFormData] = useState({
    service_user_name: "",
    support_worker_name: "",
    session_type: "",
    session_mode: "",
    session_date: "",
    duration: "",
    notes: "",
    follow_up_date: null,
    file_path: null, 
    file_url: null,
  });

  useEffect(() => {
  // Only fetch if logId is actually present in the URL
  if (logId) {
    fetchLogData();
  } else {
    // If no ID, stop the loading spinner so we don't see a blank screen
    setFetching(false);
    toast.error("No Log ID found in URL");
  }
}, [logId]);

const fetchLogData = async () => {
  setFetching(true); // Ensure fetching is true when starting
  try {
    const { data, error } = await supabase
      .from("support_logs")
      .select("*")
      .eq("id", logId)
      .single();

    if (error) throw error;

    if (data) {
      setFormData({
        ...data,
        // Ensure date is formatted correctly for the <input type="date" />
        session_date: data.session_date ? data.session_date.split('T')[0] : "",
        follow_up_date: data.follow_up_date ? data.follow_up_date.split('T')[0] : null,
      });
      if (data.follow_up_date) setShowFollowUpDate(true);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    toast.error("Log not found or database error");
  } finally {
    setFetching(false); // This MUST run to hide the loading spinner
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

  const handleUpdate = async () => {
  setLoading(true);
  try {
    let uploadedFilePath = formData.file_path;
    let publicUrl = formData.file_url;

    if (selectedFile) {
      // ... (your existing file upload logic)
    }

    // DESTRICTURING: Remove columns that Supabase shouldn't manually update
    // We remove 'id' because it's the primary key
    // We remove 'created_at' and 'updated_at' because the DB handles them
    const { id, created_at, updated_at, ...updateData } = formData;

    const { error: updateError } = await supabase
      .from("support_logs")
      .update({
        ...updateData,
        file_path: uploadedFilePath,
        file_url: publicUrl,
        // Remove 'updated_at: new Date()' from here
      })
      .eq("id", logId);

    if (updateError) throw updateError;

    toast.success("Support log updated successfully");
    router.back();
  } catch (error) {
    console.error("Full Update Error:", error);
    toast.error(`Update failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#123d2b]" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-foreground">Edit Support Log</h1>
          <p className="text-sm text-muted-foreground">Modify the details of this session</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-card p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Service User</Label>
              <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-md border border-input text-sm font-semibold text-[#123d2b]">
                <UserCircle className="w-4 h-4" /> {formData.service_user_name}
              </div>
            </div>

            <div>
  <Label>Support Worker</Label>
  <Select 
    // Ensure this value is never undefined/null or Select won't show the label
    value={formData.support_worker_name || ""} 
    onValueChange={(val) => setFormData(prev => ({...prev, support_worker_name: val}))}
  >
    <SelectTrigger className="mt-1">
      <SelectValue placeholder="Select worker">
        {formData.support_worker_name}
      </SelectValue>
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
              <Select 
                value={formData.session_type}
                onValueChange={(val) => setFormData({...formData, session_type: val})}
              >
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
              <Select 
                value={formData.session_mode}
                onValueChange={(val) => setFormData({...formData, session_mode: val})}
              >
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
                type="date" 
                value={formData.session_date}
                onChange={(e) => setFormData({...formData, session_date: e.target.value})}
              />
            </div>

            <div>
              <Label>Duration (HH:MM)</Label>
              <Select 
                value={formData.duration}
                onValueChange={(val) => setFormData({...formData, duration: val})}
              >
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
                <Checkbox 
                  id="followup" 
                  checked={showFollowUpDate}
                  onCheckedChange={(checked) => setShowFollowUpDate(checked)} 
                />
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
                      value={formData.follow_up_date || ""}
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
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
            />
          </div>

          <div>
            <Label>Update Attachment (Current file will be kept if empty)</Label>
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
                {selectedFile ? selectedFile.name : (formData.file_url ? "Update document" : "Click to upload document")}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={handleUpdate} 
              disabled={loading} 
              className="bg-[#123d2b] hover:bg-[#1f6b4a] text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Update Changes
            </Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EditSupportLogPage;