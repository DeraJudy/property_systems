// "use client";

// import { useState, useEffect } from "react";
// import { createClient } from "@/lib/superbase/clientUtils";
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
// import { Plus, Search, Filter, AlertTriangle, UserCircle, Target, CheckCircle2, Clock } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Loader2, User, Mail, Calendar, MapPin } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link";

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// export default function ServiceUsersTable() {
//   const supabase = createClient();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 1. Fetch data on component mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       // We select the columns we need. We also order by created_at descending.
//       const { data, error } = await supabase
//         .from("service_users")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setUsers(data || []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Failed to load service users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to format dates nicely
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 gap-4">
//         <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
//         <p className="text-sm text-muted-foreground">Loading directory...</p>
//       </div>
//     );
//   }

//   return (

//     <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
//       <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">Service Users</h1>
//           <p className="text-sm text-muted-foreground">Manage residents, support plans and outcomes</p>
//         </div>
        
//         <Link href="/addServiceUser">
//           <Button><Plus className="mr-2 h-4 w-4" />Add Service User</Button>
//         </Link>
//       </motion.div>

//       <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search service users..." className="pl-9" />
//         </div>
//         <Select defaultValue="all">
//           <SelectTrigger className="w-full sm:w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
//           <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="moveout">Move Out</SelectItem></SelectContent>
//         </Select>
//       </motion.div>

//       <Card className="border-[#e1dbd2] bg-[#fbf8f2] shadow-md">
//       <CardHeader className="border-b border-[#e1dbd2] bg-[#f1ede4]/50">
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-xl font-bold text-[#123d2b] flex items-center gap-2">
//             <User className="w-5 h-5" />
//             Service User Directory
//           </CardTitle>
//           <Badge variant="outline" className="border-[#1f6b4a] text-[#1f6b4a]">
//             {users.length} Total Records
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <Table>
//           <TableHeader className="bg-[#f1ede4]">
//             <TableRow className="hover:bg-transparent">
//               <TableHead className="w-62.5 text-[#123d2b] font-bold">User</TableHead>
//               <TableHead className="text-[#123d2b] font-bold">Contact</TableHead>
//               <TableHead className="text-[#123d2b] font-bold">Status</TableHead>
//               <TableHead className="text-[#123d2b] font-bold">DOB</TableHead>
//               <TableHead className="text-[#123d2b] font-bold">Assigned To</TableHead>
//               <TableHead className="text-right text-[#123d2b] font-bold">Last Updated</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {users.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
//                   No service users found in the database.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               users.map((user) => (
//                 <TableRow key={user.id} className="hover:bg-[#f1ede4]/30 border-[#e1dbd2]">
//                   {/* USER INFO */}
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-9 w-9 border border-[#e1dbd2]">
//                         <AvatarImage src={user.avatar_url} alt={user.first_name} />
//                         <AvatarFallback className="bg-[#1f6b4a] text-white">
//                           {user.first_name?.[0]}{user.surname?.[0]}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex flex-col">
//                         <span className="font-bold text-[#123d2b]">
//                           {user.title} {user.first_name} {user.surname}
//                         </span>
//                         <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
//                           NI: {user.ni_number || "Pending"}
//                         </span>
//                       </div>
//                     </div>
//                   </TableCell>

//                   {/* CONTACT */}
//                   <TableCell>
//                     <div className="flex flex-col gap-1">
//                       <div className="flex items-center gap-1 text-xs">
//                         <Mail className="w-3 h-3 opacity-60" /> {user.email || "No Email"}
//                       </div>
//                       <div className="text-xs opacity-70">
//                         {user.contact_no || "No Phone"}
//                       </div>
//                     </div>
//                   </TableCell>

//                   {/* STATUS BADGES */}
//                   <TableCell>
//                     <div className="flex flex-col gap-1">
//                       {user.is_employed ? (
//                         <Badge className="w-fit bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px]">Employed</Badge>
//                       ) : (
//                         <Badge className="w-fit bg-gray-100 text-gray-600 hover:bg-gray-100 border-none text-[10px]">Unemployed</Badge>
//                       )}
//                       {user.is_smoker === "yes" && (
//                         <Badge variant="outline" className="w-fit text-[10px] border-orange-200 text-orange-700">Smoker</Badge>
//                       )}
//                     </div>
//                   </TableCell>

//                   {/* DOB */}
//                   <TableCell className="text-xs">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-3 h-3 opacity-60" />
//                       {formatDate(user.dob)}
//                     </div>
//                   </TableCell>

//                   {/* ASSIGNED STAFF */}
//                   <TableCell>
//                     <span className="text-xs font-medium text-[#1f6b4a]">
//                       {user.assigned_to || "Unassigned"}
//                     </span>
//                   </TableCell>

//                   {/* UPDATED TIME */}
//                   <TableCell className="text-right text-[11px] font-mono text-muted-foreground">
//                     {formatDate(user.updated_at)}
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>

      
//     </motion.div>

    
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/superbase/clientUtils";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, UserCircle, Target, 
  Edit3, Trash2, Calendar, User, Loader2, Mail, Phone 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ServiceUsersTable() {
 const [userToDelete, setUserToDelete] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceUsers, setServiceUsers] = useState([]);
  const supabase = createClient();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error("Failed to load service users");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
  if (!userToDelete) return;
  
  setIsDeleting(true);
  const toastId = toast.loading(`Deleting ${userToDelete.first_name}...`);

  try {
    // 1. EXTRACT FILE NAMES SAFELY
    // This looks at your URL and grabs just the filename at the end
    const getFileName = (url) => {
      if (!url) return null;
      const parts = url.split('/');
      return parts[parts.length - 1];
    };

    const files = [
      { bucket: "avatars", path: getFileName(userToDelete.avatar_url) },
      { bucket: "service_user_docs", path: getFileName(userToDelete.id_verification_url) },
      { bucket: "service_user_docs", path: getFileName(userToDelete.tenancy_agreement_url) },
      { bucket: "service_user_docs", path: getFileName(userToDelete.benefit_letter_url) },
      { bucket: "service_user_docs", path: getFileName(userToDelete.risk_assessment_url) },
    ].filter(f => f.path); // Only attempt if there's a file path

    // 2. DELETE FROM STORAGE (Wrapped in try/catch so it doesn't stop the whole process)
    if (files.length > 0) {
      for (const file of files) {
        console.log(`Attempting to delete ${file.path} from ${file.bucket}`);
        const { error: storageError } = await supabase.storage
          .from(file.bucket)
          .remove([file.path]);
        
        if (storageError) {
          console.warn("Storage deletion warning:", storageError.message);
          // We continue anyway so the DB record can still be deleted
        }
      }
    }

    // 3. DELETE FROM DATABASE
    const { error: dbError } = await supabase
      .from("service_users")
      .delete()
      .eq("id", userToDelete.id);

    if (dbError) throw dbError;

    // 4. SUCCESS - UPDATE UI (Changed setServiceUsers to setUsers)
    // This removes the user from the current 'users' array instantly
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    
    toast.success("User and files deleted successfully", { id: toastId });
    
  } catch (err) {
    console.error("FULL DELETE ERROR:", err);
    toast.error(`Delete failed: ${err.message}`, { id: toastId });
  } finally {
    setIsDeleting(false);
    setUserToDelete(null);
  }
};


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  // Requirement: Capitalize Mr/Mrs/Ms
  const formatTitle = (title) => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
        <p className="text-sm text-muted-foreground">Loading directory...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Users</h1>
          <p className="text-sm text-muted-foreground">Manage resident profiles, contact info, and documents</p>
        </div>
        <Link href="/addServiceUser">
          <Button className="bg-[#123d2b] hover:bg-[#1f6b4a] shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Service User
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-9 bg-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40 bg-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <Card className="border-[#e1dbd2] bg-[#fbf8f2] shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#e1dbd2] bg-[#f1ede4]/50 py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold text-[#123d2b] flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-[#1f6b4a]" /> Service User Directory
            </CardTitle>
            <Badge variant="outline" className="bg-white border-[#e1dbd2] text-[#123d2b]">
              {filteredUsers.length} total records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#f1ede4]/80">
  <TableRow>
    <TableHead className="text-[#123d2b] font-bold py-4">Service User</TableHead>
    <TableHead className="text-[#123d2b] font-bold">Contact Details</TableHead>
    <TableHead className="text-[#123d2b] font-bold">Status</TableHead>
    <TableHead className="text-[#123d2b] font-bold">Assigned To</TableHead>
    <TableHead className="text-right text-[#123d2b] font-bold pr-6">Actions</TableHead>
  </TableRow>
</TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No matching service users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[#f1ede4]/40 border-[#e1dbd2] transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-[#e1dbd2]">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-[#123d2b] text-white text-xs">
                            {user.first_name?.[0]}{user.surname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#123d2b]">
                            {formatTitle(user.title)} {user.first_name} {user.surname}
                          </span>
                          <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-medium">
                            DOB: {formatDate(user.dob)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Requirement: Contact details (Phone & Email) */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#123d2b]">
                          <Mail className="w-3 h-3 opacity-70" />
                          <span>{user.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3 opacity-70" />
                          <span>{user.contact_no || "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge className={`text-[9px] font-bold uppercase ${user.is_employed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {user.is_employed ? "Employed" : "Unemployed"}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-xs font-semibold text-[#1f6b4a]">
                      {user.assigned_to || "Unallocated"}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end items-center gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-[#123d2b]" title="View Profile">
                          <Link href={`/service-users/${user.id}`}>
                            <Target className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-600" title="Edit Profile">
                          <Link href={`/service-users/${user.id}/edit`}>
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
           key={user.id}
           variant="ghost" 
           onClick={() => setUserToDelete(user)} // TRIGGERS MODAL
         >
           <Trash2 className="w-4 h-4 text-red-500" />
         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION MODAL */}
      {/* Add this at the bottom of the return statement */}
<AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the profile for 
              <span className="font-bold"> {userToDelete?.first_name} {userToDelete?.surname}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </motion.div>
  );
}