// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/superbase/client";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { motion } from "framer-motion";

// import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

// const roleColor = (r) => {
//   if (r === "admin") return "bg-[#1f6b4a]/10 text-[#1f6b4a]";
//   if (r === "support_worker") return "bg-[#2B7FFF]/10 text-[#2B7FFF]";
//   if (r === "finance") return "bg-[#F59E0B]/10 text-[#F59E0B]";
//   if (r === "hr") return "bg-[#2FA36B]/10 text-[#2FA36B]";
//   return "bg-[#ece7df] text-[#6b7d74]";
// };

// const statusDot = (s) => {
//   if (s === "active") return "bg-green-500";
//   if (s === "pending") return "bg-[#F59E0B]";
//   return "bg-[#6b7d74]";
// };

// const container = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.05 } },
// };

// const item = {
//   hidden: { opacity: 0, y: 10 },
//   show: { opacity: 1, y: 0 },
// };

// export default function UsersTable() {
//   const [users, setUsers] = useState([]);
//   const [openMenu, setOpenMenu] = useState(null);
//   const [search, setSearch] = useState("");

//   const [statusMenu, setStatusMenu] = useState(null);
//   const [roleMenu, setRoleMenu] = useState(null);

//   const [page,setPage] = useState(1);

//   const [currentUserRole, setCurrentUserRole] = useState(null); // Track logged-in user role

//   const USERS_PER_PAGE = 8;

//   // 1. Fetch current logged-in user role
//   async function getCurrentUserRole() {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user) {
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", user.id)
//         .single();
      
//       setCurrentUserRole(profile?.role);
//     }
//   }

//   async function fetchUsers() {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error(error);
//       return;
//     }
//     setUsers(data);
//   }

//   useEffect(() => {
//     getCurrentUserRole(); // Initialize role check
//     fetchUsers();
//   }, []);

//   // Helper to check permissions
//   const canManageRoles = currentUserRole === "admin" || currentUserRole === "hr";

//   async function updateStatus(id, status) {
//     await supabase.from("profiles").update({ status }).eq("id", id);

//     fetchUsers();
//     setOpenMenu(null);
//   }

//   async function updateRole(id, role) {
//     await supabase.from("profiles").update({ role }).eq("id", id);

//     fetchUsers();
//     setOpenMenu(null);
//   }

//   const filteredUsers = users.filter(
//     (u) =>
//       u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
//       u.email?.toLowerCase().includes(search.toLowerCase()),
//   );

//    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

//   const paginatedUsers = filteredUsers.slice(
//     (page-1)*USERS_PER_PAGE,
//     page*USERS_PER_PAGE
//   )

//   return (
//     <motion.div
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="space-y-6"
//     >
//       {/* HEADER */}

//       <motion.div
//         variants={item}
//         className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
//       >
//         <div>
//           <h1 className="text-2xl font-bold foreground-text">Users</h1>

//           <p className="text-sm muted-foreground-text">
//             Manage system users and permissions
//           </p>
//         </div>

//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Add User
//         </Button>
//       </motion.div>

//       {/* SEARCH + FILTER */}

//       <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text" />

//           <Input
//             placeholder="Search users..."
//             className="pl-9"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <Select defaultValue="all">
//           <SelectTrigger className="w-full sm:w-40">
//             <Filter className="mr-2 h-4 w-4" />

//             <SelectValue placeholder="Role" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="all">All Roles</SelectItem>
//             <SelectItem value="admin">Admin</SelectItem>
//             <SelectItem value="support_worker">Support</SelectItem>
//             <SelectItem value="finance">Finance</SelectItem>
//             <SelectItem value="hr">HR</SelectItem>
//           </SelectContent>
//         </Select>
//       </motion.div>

//       {/* TABLE */}

//       <motion.div variants={item}>
//         <Card className="shadow-card overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="px-5">Name</TableHead>

//                 <TableHead className="hidden md:table-cell">Email</TableHead>

//                 <TableHead>Organsation</TableHead>

//                 <TableHead>Role</TableHead>

//                 <TableHead className="hidden sm:table-cell">Created</TableHead>

//                 <TableHead>Status</TableHead>
                
//                 <TableHead>Action</TableHead>

//                 <TableHead>Assign Role</TableHead>

                

//                 <TableHead className="w-10"></TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {filteredUsers.map((user) => (
//                 <TableRow key={user.id} className="hover:bg-[#e6f2ec]/30">
//                   {/* NAME */}

//                   <TableCell>
//                     <div className="flex items-center py-2 px-2 gap-3">
//                       {user.avatar_url ? (
//                         <img
//                           src={user.avatar_url}
//                           className="h-8 w-8 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full primary text-xs font-semibold primary-foreground-text">
//                           {initials(user.full_name)}
//                         </div>
//                       )}

//                       <span className="font-medium foreground-text">
//                         {user.full_name}
//                       </span>
//                     </div>
//                   </TableCell>

//                   {/* EMAIL */}

//                   <TableCell className="hidden md:table-cell text-sm muted-foreground-text">
//                     {user.email}
//                   </TableCell>

//                   <TableCell>
//                     <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium muted-foreground-text">
//                       Kenley Housing Group
//                     </span>
//                   </TableCell>

//                   {/* ROLE */}

//                   <TableCell>
//                     <span
//                       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor(user.role)}`}
//                     >
//                       {user.role}
//                     </span>
//                   </TableCell>

//                   {/* DATE */}

//                   <TableCell className="hidden sm:table-cell text-sm muted-foreground-text">
//                     {new Date(user.created_at).toLocaleDateString()}
//                   </TableCell>

//                   {/* STATUS */}

//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`h-2 w-2 rounded-full ${statusDot(user.status)}`}
//                       />

//                       <span className="text-sm capitalize">{user.status}</span>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     <Select
//                       onValueChange={(value) => updateStatus(user.id, value)}
//                     >
//                       <SelectTrigger className="w-30 h-8 text-xs">
//                         <SelectValue placeholder="Change" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="active">Activate</SelectItem>

//                         <SelectItem value="inactive">Deactivate</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </TableCell>

//                   {/* <TableCell>
//                     <Select
//                       onValueChange={(value) => updateRole(user.id, value)}
//                     >
//                       <SelectTrigger className="w-37.5 h-8 text-xs">
//                         <SelectValue placeholder="Assign Role" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="admin">Admin</SelectItem>

//                         <SelectItem value="hr">HR</SelectItem>

//                         <SelectItem value="finance">Finance</SelectItem>

//                         <SelectItem value="support_worker">
//                           Support Worker
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </TableCell> */}

//                   {canManageRoles && (
//                     <>
//                       <TableCell>
//                         <Select onValueChange={(value) => updateStatus(user.id, value)}>
//                           <SelectTrigger className="w-30 h-8 text-xs">
//                             <SelectValue placeholder="Change" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="active">Activate</SelectItem>
//                             <SelectItem value="inactive">Deactivate</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </TableCell>

//                       <TableCell>
//                         <Select onValueChange={(value) => updateRole(user.id, value)}>
//                           <SelectTrigger className="w-37.5 h-8 text-xs">
//                             <SelectValue placeholder="Assign Role" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="admin">Admin</SelectItem>
//                             <SelectItem value="hr">HR</SelectItem>
//                             <SelectItem value="finance">Finance</SelectItem>
//                             <SelectItem value="support_worker">Support Worker</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </TableCell>
//                     </>
//                   )}

                  
//                 </TableRow>
//               ))}
              
//             </TableBody>

//             {/* PAGINATION */}
//             {/* <div className="flex items-center justify-between px-4 py-3 border-t">
//               <p className="text-sm text-muted-foreground">
//                 Page {page} of {totalPages}
//               </p>

//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={page === 1}
//                   onClick={() => setPage(page - 1)}
//                 >
//                   Previous
//                 </Button>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={page === totalPages}
//                   onClick={() => setPage(page + 1)}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div> */}

//           </Table>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/superbase/client";

import { Card } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

// Helper functions for UI styling
const roleColor = (r) => {
  if (r === "admin") return "bg-[#1f6b4a]/10 text-[#1f6b4a]";
  if (r === "support_worker") return "bg-[#2B7FFF]/10 text-[#2B7FFF]";
  if (r === "finance") return "bg-[#F59E0B]/10 text-[#F59E0B]";
  if (r === "hr") return "bg-[#2FA36B]/10 text-[#2FA36B]";
  return "bg-[#ece7df] text-[#6b7d74]";
};

const statusDot = (s) => {
  if (s === "active") return "bg-green-500";
  if (s === "pending") return "bg-[#F59E0B]";
  return "bg-[#6b7d74]";
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all"); // State for the filter
  const [page, setPage] = useState(1);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const USERS_PER_PAGE = 8;

  async function checkUserPermissions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (!error) {
        setCurrentUserRole(profile.role);
      }
    }
    setLoading(false);
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    setUsers(data);
  }

  useEffect(() => {
    checkUserPermissions();
    fetchUsers();
  }, []);

  const canManage = currentUserRole === "admin" || currentUserRole === "hr";

  async function updateStatus(id, status) {
    await supabase.from("profiles").update({ status }).eq("id", id);
    fetchUsers();
  }

  async function updateRole(id, role) {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchUsers();
  }

  function initials(name) {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("");
  }

  // UPDATED: Combined Filter Logic (Search + Role)
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = selectedRole === "all" || u.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  if (loading) return <div className="p-8 text-center">Loading permissions...</div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* HEADER */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#123d2b]">Users</h1>
          <p className="text-sm text-muted-foreground">Manage system users and permissions</p>
        </div>
      </motion.div>

      {/* SEARCH + FILTER */}
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9 border-[#e1dbd2]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
          />
        </div>

        {/* Updated Role Select with Functionality */}
        <Select 
          value={selectedRole} 
          onValueChange={(value) => {
            setSelectedRole(value);
            setPage(1); // Reset to page 1 on filter
          }}
        >
          <SelectTrigger className="w-full sm:w-40 border-[#e1dbd2]">
            <Filter className="mr-2 h-4 w-4 text-[#1f6b4a]" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="support_worker">Support</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* TABLE */}
      <motion.div variants={item}>
        <Card className="border-[#e1dbd2] overflow-hidden bg-white">
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead className="px-5">Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead>Status</TableHead>
                {canManage && (
                  <>
                    <TableHead>Action</TableHead>
                    <TableHead>Assign Role</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[#e6f2ec]/30 border-[#e1dbd2]">
                    <TableCell>
                      <div className="flex items-center py-2 px-2 gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} className="h-8 w-8 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1f6b4a] text-xs font-semibold text-white">
                            {initials(user.full_name)}
                          </div>
                        )}
                        <span className="font-medium text-[#123d2b]">{user.full_name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {user.email || "—"}
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleColor(user.role)}`}>
                        {user.role?.replace("_", " ")}
                      </span>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusDot(user.status)}`} />
                        <span className="text-sm capitalize">{user.status}</span>
                      </div>
                    </TableCell>

                    {canManage && (
                      <>
                        <TableCell>
                          <Select onValueChange={(value) => updateStatus(user.id, value)}>
                            <SelectTrigger className="w-28 h-8 text-[10px] border-[#e1dbd2]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Activate</SelectItem>
                              <SelectItem value="inactive">Deactivate</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell>
                          <Select onValueChange={(value) => updateRole(user.id, value)}>
                            <SelectTrigger className="w-32 h-8 text-[10px] border-[#e1dbd2]">
                              <SelectValue placeholder="Set Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="support_worker">Support</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canManage ? 8 : 6} className="h-32 text-center text-muted-foreground">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e1dbd2] bg-[#fbf8f2]/50">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="border-[#e1dbd2]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="border-[#e1dbd2]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}