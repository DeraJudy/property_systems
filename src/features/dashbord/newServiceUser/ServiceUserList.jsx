// "use client";

// import React, { useEffect, useState } from "react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import {
//   Edit,
//   Trash2,
//   Eye,
//   Search,
//   UserPlus,
//   Loader2, Plus, Filter, UserCircle, Target,
// } from "lucide-react";
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
// } from "@/components/ui/select"
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
// import { toast } from "sonner";
// import Link from "next/link";
// import { motion } from "framer-motion";

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// const supabase = createClient();

// export default function ServiceUserList() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   // --- Fetch Data ---
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("service_users_table")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setUsers(data || []);
//     } catch (err) {
//       toast.error("Error loading users: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // --- Delete Logic ---
//   const handleDelete = async (id) => {
//     // Optional: Add a confirmation dialog before proceeding
//     if (!window.confirm("Are you sure you want to delete this user and all associated files?")) return;

//     try {
//       setLoading(true);

//       const user = users.find(u => u.id === id);
//       if (!user) throw new Error("User not found");

//       const bucket = "service-user-docs";

//       /**
//        * extractPath
//        * Supabase .remove() requires the path WITHOUT the bucket name.
//        * Example: "medical/file.pdf" NOT "service-user-docs/medical/file.pdf"
//        */
//       const extractPath = (url) => {
//         if (!url || typeof url !== "string") return null;

//         try {
//           // If it's a full Supabase Public URL
//           if (url.includes(`/storage/v1/object/public/${bucket}/`)) {
//             return url.split(`/storage/v1/object/public/${bucket}/`)[1];
//           }

//           // If it's just the path stored in the DB (e.g., "medical/doc.pdf")
//           return url;
//         } catch (e) {
//           console.error("Error parsing path:", e);
//           return null;
//         }
//       };

//       // Collect all possible file fields from your database schema
//       const possibleFiles = [
//         user.profile_image,
//         user.medical_doc_url,
//         user.verification_doc_url,
//         user.document_url,
//         user.additional_doc_url,
//         user.extra_doc_url // Added to match your request
//       ];

//       // Clean the paths and filter out nulls/empty strings
//       const filesToDelete = possibleFiles
//         .map(extractPath)
//         .filter(path => path && path.length > 0);

//       console.log("Attempting to delete files:", filesToDelete);

//       // 1. Delete files from Storage first
//       if (filesToDelete.length > 0) {
//         const { data: storageData, error: storageError } = await supabase
//           .storage
//           .from(bucket)
//           .remove(filesToDelete);

//         if (storageError) {
//           console.error("Storage deletion error:", storageError);
//           // We continue to DB deletion even if storage fails,
//           // or you can throw error here depending on preference.
//         }
//       }

//       // 2. Delete user record from Database
//       const { error: dbError } = await supabase
//         .from("service_users_table")
//         .delete()
//         .eq("id", id);

//       if (dbError) throw dbError;

//       // Update local state
//       setUsers(prev => prev.filter(u => u.id !== id));
//       toast.success("User and all associated documents deleted.");

//     } catch (err) {
//       console.error("DELETE ERROR:", err);
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Filter Logic ---
//   const filteredUsers = users.filter((u) =>
//     `${u.first_name} ${u.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-[#f5f0e6] p-4 sm:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">

//         <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">Service Users</h1>
//           <p className="text-sm text-muted-foreground">Manage resident profiles, contact info, and documents</p>
//         </div>
//         <Link href="/addServiceUser">
//           <Button className="bg-[#123d2b] hover:bg-[#1f6b4a] shadow-sm">
//             <Plus className="mr-2 h-4 w-4" /> Add Service User
//           </Button>
//         </Link>
//       </motion.div>

//       <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by name or email..."
//             className="pl-9 bg-white"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <Select defaultValue="all">
//           <SelectTrigger className="w-full sm:w-40 bg-white">
//             <Filter className="mr-2 h-4 w-4" />
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="active">Active</SelectItem>
//           </SelectContent>
//         </Select>
//       </motion.div>

//         {/* Table Section */}
//         <div className="bg-white rounded-2xl border border-[#e1dbd2] shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center p-20">
//               <Loader2 className="animate-spin text-[#1f6b4a] mb-4" size={40} />
//               <p className="text-[#6b7d74]">Loading users...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-[#fbf8f2] border-b border-[#e1dbd2]">
//                   <tr>
//                     <th className="p-5 text-sm font-bold text-[#123d2b]">Name</th>
//                     <th className="p-5 text-sm font-bold text-[#123d2b]">Contact</th>
//                     <th className="p-5 text-sm font-bold text-[#123d2b]">Assigned To</th>
//                     <th className="p-5 text-sm font-bold text-[#123d2b]">Status</th>
//                     <th className="p-5 text-sm font-bold text-[#123d2b] text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#f5f0e6]">
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-[#fbf8f2] transition-colors">
//                         <td className="p-5">
//                           <div className="font-bold text-[#123d2b]">{user.first_name} {user.surname}</div>
//                           <div className="text-xs text-[#6b7d74]">{user.ni_number || "No NI"}</div>
//                         </td>
//                         <td className="p-5">
//                           <div className="text-sm text-[#123d2b]">{user.email || "N/A"}</div>
//                           <div className="text-xs text-[#6b7d74]">{user.contact_number || "No Phone"}</div>
//                         </td>
//                         <td className="p-5 text-sm text-[#123d2b]">
//                           {user.assigned_to || "Unassigned"}
//                         </td>
//                         <td className="p-5">
//                           <span className="px-3 py-1 bg-[#e6f2ec] text-[#1f6b4a] text-xs font-bold rounded-full border border-[#c3e2d1]">
//                             Active
//                           </span>
//                         </td>
//                         <td className="p-5 text-right">
//                           <div className="flex justify-end gap-2">
//                             {/* VIEW BUTTON */}
//                             <Link href={`service-users/${user.id}`}>
//                               <button className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-lg transition-all" title="View Profile">
//                                 <Eye size={18} />
//                               </button>
//                             </Link>

//                             {/* EDIT BUTTON */}
//                             <Link href={`/service-users/${user.id}/edit`}>
//                               <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit User">
//                                 <Edit size={18} />
//                               </button>
//                             </Link>

//                             {/* DELETE BUTTON */}
//                             <button
//                               onClick={() => handleDelete(user.id, `${user.first_name} ${user.surname}`)}
//                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                               title="Delete User"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="p-20 text-center text-[#6b7d74]">
//                         No service users found matching your search.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import {
//   Edit,
//   Trash2,
//   Eye,
//   Search,
//   Loader2,
//   Plus,
//   UserCircle, UserPlus
// } from "lucide-react";
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
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";;
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const supabase = createClient();

// export default function ServiceUserList() {
//   const router = useRouter();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userToDelete, setUserToDelete] = useState(null);
// const [deleteConfirmText, setDeleteConfirmText] = useState("");
// const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("service_user_intake")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setUsers(data || []);
//     } catch (err) {
//       toast.error("Failed to fetch service users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //   const handleDelete = async (user) => {
//   //   const confirm = window.confirm(`Are you sure you want to delete ${user.service_user_name}? This will also delete ALL their uploaded files.`);
//   //   if (!confirm) return;

//   //   try {
//   //     const pathsToDelete = [];
//   //     if (user.about_file_path) pathsToDelete.push(user.about_file_path);

//   //     [...user.eet_documents, ...user.onboarding_documents, ...user.additional_documents].forEach(doc => {
//   //       if (doc.file_path) pathsToDelete.push(doc.file_path);
//   //     });

//   //     if (pathsToDelete.length > 0) {
//   //       const { error: storageError } = await supabase.storage
//   //         .from("service-user-intake-docs")
//   //         .remove(pathsToDelete);
//   //       if (storageError) throw storageError;
//   //     }

//   //     const { error: dbError } = await supabase
//   //       .from("service_user_intake")
//   //       .delete()
//   //       .eq("id", user.id);

//   //     if (dbError) throw dbError;

//   //     toast.success("User deleted successfully");
//   //     fetchUsers();
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Cleanup failed.");
//   //   }
//   // };

//     const handleDelete = (user) => {
//   setUserToDelete(user);
//   setDeleteConfirmText(""); // Always reset when opening the modal
// };

// // 3. Update the execution function
// const confirmDelete = async () => {
//   // CRITICAL: Double check the text matches
//   if (deleteConfirmText !== "DELETE") {
//     return toast.error("Please type DELETE to confirm");
//   }

//   setIsDeleting(true);
//   try {
//     const pathsToDelete = [];
//     if (userToDelete.about_file_path) pathsToDelete.push(userToDelete.about_file_path);

//     // Collect paths from all document arrays
//     [
//       ...(userToDelete.eet_documents || []),
//       ...(userToDelete.onboarding_documents || []),
//       ...(userToDelete.additional_documents || [])
//     ].forEach(doc => {
//       if (doc.file_path) pathsToDelete.push(doc.file_path);
//     });

//     // Step 1: Delete from Storage first (Prevent orphans)
//     if (pathsToDelete.length > 0) {
//       const { error: storageError } = await supabase.storage
//         .from("service-user-intake-docs")
//         .remove(pathsToDelete);
//       if (storageError) console.error("Storage cleanup error:", storageError);
//     }

//     // Step 2: Delete from Database
//     const { error: dbError } = await supabase
//       .from("service_user_intake")
//       .delete()
//       .eq("id", userToDelete.id);

//     if (dbError) throw dbError;

//     toast.success(`${userToDelete.service_user_name} deleted successfully`);
//     setUserToDelete(null);
//     setDeleteConfirmText("");
//     fetchUsers(); // Refresh list
//   } catch (err) {
//     console.error(err);
//     toast.error("Deletion failed");
//   } finally {
//     setIsDeleting(false);
//   }
// };

//   const filteredUsers = users.filter(user =>
//     user.service_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return (
//     <div className="h-64 flex items-center justify-center">
//       <Loader2 className="animate-spin text-black" size={32} />
//     </div>
//   );

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto py-10 px-4">

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//          <div>
//            <h1 className="text-3xl font-bold text-black">Service Users</h1>
//            <p className="text-gray-500">Manage resident profiles and documents</p>
//          </div>
//          <Link href="/addServiceUser">
//            <Button className="bg-black">
//              <UserPlus className="mr-2 h-4 w-4" /> Add New User
//            </Button>
//          </Link>
//        </div>

//       <div className="flex justify-between items-center">
//         <div className="relative w-full max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
//           <Input
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 border-black/10 bg-white focus:ring-black"
//           />
//         </div>
//         {/* <Link href="/service-users/new">
//           <Button className="bg-white hover:bg-[#1f6b4a] text-[#fdfbf7] font-bold uppercase tracking-widest text-xs">
//             <Plus className="mr-2 h-4 w-4" /> Add User
//           </Button>
//         </Link> */}
//       </div>

//       <Card className="border-black/10 bg-[#FFFDD0]  shadow-sm overflow-hidden rounded-2xl">
//         <CardHeader className=" border-b border-black/5">
//           <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
//             <UserCircle size={18} /> Service Directory
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="">
//               <TableRow className="border-black/5 ">
//                 <TableHead className="text-black font-black uppercase text-[10px] tracking-tighter">Name</TableHead>
//                 <TableHead className="text-black font-black uppercase">Total Documents</TableHead>
//                 <TableHead className="font-bold">Property</TableHead>
//                 <TableHead className="text-black font-black uppercase text-[10px] tracking-tighter">Status</TableHead>
//                 <TableHead className="text-right text-black font-black uppercase text-[10px] tracking-tighter">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-center py-10 text-black/40 italic">
//                     No records found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <TableRow
//                     key={user.id} className="border-black/5 hover:bg-[#fdfbf7] transition-colors">
//                     <TableCell
//                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group font-bold
//                      text-black uppercase tracking-tight"
//                     onClick={() => router.push(`/service-users/${user.id}`)} // Row click navigation
//                     >
//                       {user.service_user_name}
//                     </TableCell>
//                     <TableCell>
//                        {/* <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600">
//                          {1 + user.onboarding_documents.length + user.additional_documents.length} files
//                        </span> */}

//                        <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600">
//   {
//     (user.about_file_path ? 1 : 0) +
//     (user.onboarding_documents?.length || 0) +
//     (user.additional_documents?.length || 0)
//   } files
// </span>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="bg-slate-50 font-medium">
//                         {user.property_name || "Unassigned"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <span className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-black uppercase text-black">
//                         Active
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-1">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => router.push(`/service-users/${user.id}`)}
//                           className="hover:bg-black hover:text-[#fdfbf7]"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>

//                         <Link href={`/service-users/${user.id}/edit`}>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="hover:bg-black hover:text-[#fdfbf7]"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </Link>

//                         <Button
//                            variant="ghost"
//                            size="icon"
//                            className="hover:bg-red-50"
//                            onClick={() => handleDelete(user)}
//                          >
//                            <Trash2 className="h-4 w-4 text-red-600" />
//                          </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <AlertDialog
//   open={!!userToDelete}
//   onOpenChange={(open) => {
//     if (!open) {
//       setUserToDelete(null);
//       setDeleteConfirmText("");
//     }
//   }}
// >
//   <AlertDialogContent className="bg-[#fbf8f2] border-[#e1dbd2]">
//     <AlertDialogHeader>
//       <AlertDialogTitle className="text-[#123d2b] flex items-center gap-2">
//         <Trash2 className="text-red-600" size={20} />
//         Confirm Permanent Deletion
//       </AlertDialogTitle>

//       {/* CRITICAL FIX: Added 'asChild'.
//           This prevents the <p> cannot contain <div> error
//       */}
//       <AlertDialogDescription asChild>
//         <div className="text-[#6b7d74]">
//           <p>
//             This will permanently delete <strong>{userToDelete?.service_user_name}</strong> and all associated records.
//           </p>

//           <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
//             <p className="text-red-700 text-sm font-medium mb-2">
//               To confirm, type <span className="font-bold">DELETE</span> below:
//             </p>
//             <Input
//               value={deleteConfirmText}
//               onChange={(e) => setDeleteConfirmText(e.target.value)}
//               placeholder="Type DELETE"
//               className="border-red-200 focus:ring-red-500 bg-white text-black"
//             />
//           </div>
//         </div>
//       </AlertDialogDescription>
//     </AlertDialogHeader>

//     <AlertDialogFooter>
//       <AlertDialogCancel
//         onClick={() => {
//           setUserToDelete(null);
//           setDeleteConfirmText("");
//         }}
//       >
//         Cancel
//       </AlertDialogCancel>
//       <Button
//         variant="destructive"
//         disabled={deleteConfirmText !== "DELETE" || isDeleting}
//         onClick={confirmDelete}
//         className="bg-red-600 hover:bg-red-700"
//       >
//         {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Permanently Delete"}
//       </Button>
//     </AlertDialogFooter>
//   </AlertDialogContent>
// </AlertDialog>

//     </div>
//   );
// }

// // "use client";

// // import React, { useEffect, useState } from "react";
// // import {
// //   Search, Eye, Edit, Trash2, UserPlus,
// //   Loader2, Filter,
// // } from "lucide-react";
// // import { createClient } from "@/lib/superbase/clientUtils";
// // import { toast } from "sonner";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation"; // Added for navigation
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"
// // import { Card, CardContent } from "@/components/ui/card";
// // import { motion } from "framer-motion";

// // const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// // const supabase = createClient();

// // export default function ServiceUserList() {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const router = useRouter();

// //   useEffect(() => {
// //     fetchUsers();
// //   }, []);

// //   const fetchUsers = async () => {
// //     setLoading(true);
// //     const { data, error } = await supabase
// //       .from("service_user_intake")
// //       .select("*")
// //       .order("service_user_name", { ascending: true });

// //     if (error) toast.error("Error fetching users");
// //     else setUsers(data || []);
// //     setLoading(false);
// //   };

// //   const handleDelete = async (user) => {
// //     const confirm = window.confirm(`Are you sure you want to delete ${user.service_user_name}? This will also delete ALL their uploaded files.`);
// //     if (!confirm) return;

// //     try {
// //       const pathsToDelete = [];
// //       if (user.about_file_path) pathsToDelete.push(user.about_file_path);

// //       [...user.eet_documents, ...user.onboarding_documents, ...user.additional_documents].forEach(doc => {
// //         if (doc.file_path) pathsToDelete.push(doc.file_path);
// //       });

// //       if (pathsToDelete.length > 0) {
// //         const { error: storageError } = await supabase.storage
// //           .from("service-user-intake-docs")
// //           .remove(pathsToDelete);
// //         if (storageError) throw storageError;
// //       }

// //       const { error: dbError } = await supabase
// //         .from("service_user_intake")
// //         .delete()
// //         .eq("id", user.id);

// //       if (dbError) throw dbError;

// //       toast.success("User deleted successfully");
// //       fetchUsers();
// //     } catch (err) {
// //       console.error(err);
// //       toast.error("Cleanup failed.");
// //     }
// //   };

// //   const filteredUsers = users.filter(user =>
// //     user.service_user_name.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     <div className="max-w-6xl mx-auto py-10 px-4">
// //       {/* Header Area */}
// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold text-[#123d2b]">Service Users</h1>
// //           <p className="text-gray-500">Manage resident profiles and documents</p>
// //         </div>
// //         <Link href="/addServiceUser">
// //           <Button className="bg-[#123d2b] hover:bg-[#1f6b4a]">
// //             <UserPlus className="mr-2 h-4 w-4" /> Add New User
// //           </Button>
// //         </Link>
// //       </div>

// //       {/* Search and Filters */}
// //       <motion.div variants={item} initial="hidden" animate="show" className="flex flex-col gap-3 sm:flex-row">
// //          <div className="relative flex-1">
// //           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //            <Input
// //             placeholder="Search by name..."
// //             className="pl-9 bg-white"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //         </div>
// //         <Select defaultValue="all">
// //           <SelectTrigger className="w-full sm:w-40 bg-white">
// //             <Filter className="mr-2 h-4 w-4" />
// //             <SelectValue />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">All Status</SelectItem>
// //             <SelectItem value="active">Active</SelectItem>
// //           </SelectContent>
// //         </Select>
// //       </motion.div>

// //       {/* Table Area - mt-12 adds the extra space you requested */}
// //       <Card className="border-[#e1dbd2] mt-12 shadow-sm">
// //         <CardContent className="p-0">
// //           <Table>
// //             <TableHeader className="bg-[#fbf8f2]">
// //               <TableRow>
// //                 <TableHead className="font-bold text-[#123d2b] py-4">Name</TableHead>
// //                 <TableHead className="font-bold text-[#123d2b]">Total Documents</TableHead>
// //                 <TableHead className="text-right font-bold text-[#123d2b]">Actions</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={3} className="text-center py-20">
// //                     <Loader2 className="animate-spin mx-auto text-[#123d2b]" />
// //                     <p className="text-sm text-gray-500 mt-2">Loading users...</p>
// //                   </TableCell>
// //                 </TableRow>
// //               ) : filteredUsers.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={3} className="text-center py-20 text-gray-400 italic">
// //                     No service users found matching your search.
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 filteredUsers.map((user) => (
// //                   <TableRow
// //                     key={user.id}
// //                     className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
// //                     onClick={() => router.push(`/service-users/${user.id}`)} // Row click navigation
// //                   >
// //                     <TableCell className="font-semibold text-[#123d2b] uppercase tracking-tight py-4">
// //                       {user.service_user_name}
// //                     </TableCell>
// //                     <TableCell>
// //                       <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600">
// //                         {1 + user.eet_documents.length + user.onboarding_documents.length + user.additional_documents.length} files
// //                       </span>
// //                     </TableCell>
// //                     <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
// //                       <div className="flex justify-end gap-2">
// //                         {/* VIEW BUTTON */}
// //                         <Button
// //                           variant="ghost"
// //                           size="icon"
// //                           className="hover:bg-blue-50"
// //                           onClick={() => router.push(`/service-users/${user.id}`)}
// //                         >
// //                           <Eye className="h-4 w-4 text-blue-600" />
// //                         </Button>

// //                         {/* EDIT BUTTON */}
// //                         <Link href={`/editServiceUser/${user.id}`}>
// //                           <Button variant="ghost" size="icon" className="hover:bg-amber-50">
// //                             <Edit className="h-4 w-4 text-amber-600" />
// //                           </Button>
// //                         </Link>

// //                         {/* DELETE BUTTON */}
// //                         <Button
// //                           variant="ghost"
// //                           size="icon"
// //                           className="hover:bg-red-50"
// //                           onClick={() => handleDelete(user)}
// //                         >
// //                           <Trash2 className="h-4 w-4 text-red-600" />
// //                         </Button>
// //                       </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/superbase/clientUtils";
import {
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  Plus,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageBanner from "@/components/dashboard/PageBanner";

const supabase = createClient();

export default function ServiceUserList() {
  const router = useRouter();

  // --- State Management ---
  const [serviceUsers, setServiceUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // --- Fetch Logic ---
  const fetchServiceUsers = useCallback(async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Fetch with count enabled for pagination
      let query = supabase
        .from("service_user_intake")
        .select("*", { count: "exact" });

      if (searchTerm) {
        query = query.ilike("service_user_name", `%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setServiceUsers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching service users:", error.message);
      toast.error("Failed to load service users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchServiceUsers();
  }, [fetchServiceUsers]);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Delete Logic ---
  const confirmDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      return toast.error("Please type DELETE to confirm");
    }

    setIsDeleting(true);
    try {
      const pathsToDelete = [];
      const bucketName = "service-user-intake-docs";

      // Helper to extract relative path if a full URL was stored by mistake
      const extractPath = (pathOrUrl) => {
        if (!pathOrUrl || typeof pathOrUrl !== "string") return null;
        if (pathOrUrl.includes(`/storage/v1/object/public/${bucketName}/`)) {
          return pathOrUrl.split(`${bucketName}/`)[1];
        }
        return pathOrUrl;
      };

      // 1. Capture the Profile Image (Check both possible naming conventions)
      const profilePath =
        userToDelete.profile_image || userToDelete.profile_image_path;
      if (profilePath) pathsToDelete.push(extractPath(profilePath));

      // 2. Capture the 'About' file
      if (userToDelete.about_file_path) {
        pathsToDelete.push(extractPath(userToDelete.about_file_path));
      }

      // 3. Capture all nested document arrays
      [
        ...(userToDelete.onboarding_documents || []),
        ...(userToDelete.additional_documents || []),
        // ...(userToDelete.eet_documents || [])
      ].forEach((doc) => {
        if (doc.file_path) pathsToDelete.push(extractPath(doc.file_path));
      });

      // 4. Clean and Execute Storage Deletion
      const cleanPaths = [...new Set(pathsToDelete)].filter(Boolean);

      if (cleanPaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from(bucketName)
          .remove(cleanPaths);

        if (storageError) console.error("Storage cleanup error:", storageError);
      }

      // 5. Delete from Database
      const { error: dbError } = await supabase
        .from("service_user_intake")
        .delete()
        .eq("id", userToDelete.id);

      if (dbError) throw dbError;

      toast.success(`${userToDelete.service_user_name} and all media deleted.`);
      setUserToDelete(null);
      setDeleteConfirmText("");
      fetchServiceUsers();
    } catch (err) {
      console.error(err);
      toast.error("Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-10 px-4">

      <PageBanner title="Service Users" subtitle="Manage resident profiles and documents" category="people" />
      
      {/* Header */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Service Users</h1>
          <p className="text-gray-500">
            Manage resident profiles and documents
          </p>
        </div>
        <Link href="/addServiceUser">
          <Button className="bg-black">
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </Link>
      </div> */}

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-black/10 bg-white focus:ring-black"
          />
        </div>

        <Link href="/addServiceUser">
          <Button className="bg-black">
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <Card className="border-black/10 bg-[#FFFDD0] shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-black/5">
          <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <UserCircle size={18} /> Service Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-black/5 text-lg">
                {/* <TableHead>P</TableHead> */}
                <TableHead className="text-black font-black  ">
                  Name
                </TableHead>
                <TableHead className="text-black font-black ">
                  Total Documents
                </TableHead>
                <TableHead className="text-black font-black ">
                  Property
                </TableHead>
                <TableHead className="text-black font-black  ">
                  Status
                </TableHead>
                <TableHead className="text-right text-black font-black ">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto mb-2" />
                    <span className="text-xs text-gray-400">
                      Loading data...
                    </span>
                  </TableCell>
                </TableRow>
              ) : serviceUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-black/40 italic"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                serviceUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-black/5 hover:bg-[#fdfbf7] transition-colors"
                  >
                    <TableCell
                      className="py-4 cursor-pointer group"
                      onClick={() => router.push(`/service-users/${user.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar / Initials Circle */}
                        <div className="h-10 w-10 rounded-full border border-black/5 overflow-hidden flex items-center justify-center bg-white shrink-0">
                          {user.profile_image_url ? (
                            <img
                              src={user.profile_image_url}
                              alt={user.service_user_name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // Fallback if the URL is broken/invalid
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}

                          {/* Fallback Initials (Visible if no image or if image fails) */}
                          <div
                            className={`${user.profile_image_url ? "hidden" : "flex"} h-full w-full items-center 
                            justify-center bg-black text-[#FFFDD0] text-xs font-bold`}
                          >
                            {getInitials(user.service_user_name)}
                          </div>
                        </div>

                        {/* Name and Meta */}
                        <div className="flex flex-col">
                          <span className="font-bold text-black uppercase tracking-tight leading-none mb-1">
                            {user.service_user_name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600">
                        {(user.about_file_path ? 1 : 0) +
                          (user.onboarding_documents?.length || 0) +
                          (user.additional_documents?.length || 0) +
                          (user.Independence_passport?.length || 0)}{" "}
                        files
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 font-medium"
                      >
                        {user.property_name || "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-black uppercase text-black">
                        {user.status || "Unassigned" }
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/service-users/${user.id}`)
                          }
                          className="hover:bg-black hover:text-[#fdfbf7]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link href={`/service-users/${user.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-black hover:text-[#fdfbf7]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-50"
                          onClick={() => setUserToDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/5 bg-white/50">
            <div className="text-xs text-gray-500">
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </strong>{" "}
              of <strong>{totalCount}</strong> users
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="h-8 text-xs border-black/10"
              >
                Previous
              </Button>

              <span className="text-xs font-bold text-black">
                Page {currentPage} of{" "}
                {Math.ceil(totalCount / itemsPerPage) || 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={
                  currentPage >= Math.ceil(totalCount / itemsPerPage) || loading
                }
                className="h-8 text-xs border-black/10"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent className="bg-[#fbf8f2] border-[#e1dbd2]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#123d2b] flex items-center gap-2">
              <Trash2 className="text-red-600" size={20} />
              Confirm Permanent Deletion
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-[#6b7d74] space-y-4">
                <p>
                  This will permanently delete{" "}
                  <strong>{userToDelete?.service_user_name}</strong> and all
                  associated files.
                </p>
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-red-700 text-sm font-medium mb-2">
                    Type <span className="font-bold">DELETE</span> to confirm:
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="border-red-200 focus:ring-red-500 bg-white text-black"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setUserToDelete(null);
                setDeleteConfirmText("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                "Permanently Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
