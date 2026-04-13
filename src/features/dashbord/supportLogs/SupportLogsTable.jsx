// "use client";

// import { useState, useEffect } from "react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { motion } from "framer-motion";
// import { 
//   Plus, Search, Filter, UserCircle, Target, 
//   Edit3, Trash2, Calendar, User, Loader2, Mail, Phone 
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { toast } from "sonner";
// import Link from "next/link";

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// const SupportLogsTable = () => {
//   return (
//     <motion.div
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="space-y-6"
//     >
//       <motion.div
//         variants={item}
//         className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
//       >
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">Support Logs</h1>
//           <p className="text-sm text-muted-foreground">
//             Manage support logs and documents
//           </p>
//         </div>
//         <Link href="/addSupportLogs">
//           <Button className="bg-[#123d2b] hover:bg-[#1f6b4a] shadow-sm">
//             <Plus className="mr-2 h-4 w-4" /> Add Support Log
//           </Button>
//         </Link>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default SupportLogsTable;


"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Search, MoreVertical, Trash2, 
  ExternalLink, Calendar, User, Download 
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SupportLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("support_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data);
    } catch (error) {
      toast.error("Error loading logs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (log) => {
    const confirmDelete = window.confirm("Are you sure? This will delete the record and the attached file forever.");
    if (!confirmDelete) return;

    try {
      // 1. DELETE FROM STORAGE FIRST (Crucial Warning Step)
      if (log.file_path) {
        const { error: storageError } = await supabase.storage
          .from("support_documents")
          .remove([log.file_path]);

        if (storageError) {
          console.error("Storage delete error:", storageError);
          // We continue anyway to try and clean the DB, or you can stop here
        }
      }

      // 2. DELETE FROM DATABASE SECOND
      const { error: dbError } = await supabase
        .from("support_logs")
        .delete()
        .eq("id", log.id);

      if (dbError) throw dbError;

      toast.success("Log and associated file deleted successfully");
      setLogs(logs.filter((item) => item.id !== log.id));
    } catch (error) {
      toast.error("Failed to delete record");
      console.error(error);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.service_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.session_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or type..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3 text-left">Service User</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Worker</th>
              <th className="px-4 py-3 text-left">File</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <AnimatePresence mode="popLayout">
              {filteredLogs.map((log) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={log.id} 
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-[#123d2b]">
                    {log.service_user_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize px-2 py-1 rounded-full bg-primary/10 text-[10px] font-bold border border-primary/20">
                      {log.session_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {log.session_date ? format(new Date(log.session_date), "dd MMM yyyy") : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {log.support_worker_name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {log.file_url ? (
                      <a 
                        href={log.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" /> View
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">No file</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive font-medium" onClick={() => handleDelete(log)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Log
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {filteredLogs.length === 0 && !loading && (
          <div className="p-8 text-center text-muted-foreground">
            No support logs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportLogsTable;