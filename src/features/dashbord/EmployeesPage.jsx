// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import DataTableHeader from "@/components/dashboard/DataTableHeader";
// import StatusBadge from "@/components/dashboard/StatusBadge";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { motion } from "framer-motion";
// import {
//   AlertTriangle,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   ShieldCheck,
//   GraduationCap,
//   CalendarClock,
//   Users,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// // Import your existing supabase client
// import { supabase } from "@/lib/superbase/client";

// const container = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.04 } },
// };
// const item = {
//   hidden: { opacity: 0, y: 10 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
// };

// const EmployeesPage = () => {
//   const [employeeList, setEmployeeList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     const { data, error } = await supabase.from("profiles").select(`
//         id, 
//         full_name, 
//         role, 
//         status, 
//         email,
//         avatar_url,
//         hr_documents ( 
//           induction_status, 
//           training_score,
//           contract_expiry,
//           dbs_certificate_url
//         )
//       `);

//     if (error) {
//       console.error("Error fetching employees:", error.message);
//     } else {
//       setEmployeeList(data || []);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id, e) => {
//     e.stopPropagation();
//     if (confirm("Are you sure you want to delete this employee profile?")) {
//       const { error } = await supabase.from("profiles").delete().eq("id", id);
//       if (!error) {
//         setEmployeeList((prev) => prev.filter((emp) => emp.id !== id));
//       }
//     }
//   };

//   // KPI Calculations
//   const totalEmployees = employeeList.length;
  
//   const dbsCompliant = employeeList.filter(
//     (e) => e.hr_documents?.dbs_certificate_url
//   ).length;
  
//   const trainingComplete = employeeList.filter(
//     (e) => (e.hr_documents?.training_score || 0) >= 80
//   ).length;

//   const expiringContractsList = employeeList.filter((e) => {
//     if (!e.hr_documents?.contract_expiry) return false;
//     const expiryDate = new Date(e.hr_documents.contract_expiry);
//     const today = new Date();
//     const ninetyDaysFromNow = new Date();
//     ninetyDaysFromNow.setDate(today.getDate() + 90);
//     return expiryDate <= ninetyDaysFromNow;
//   });

//   const dbsPercent = totalEmployees ? Math.round((dbsCompliant / totalEmployees) * 100) : 0;
//   const trainingPercent = totalEmployees ? Math.round((trainingComplete / totalEmployees) * 100) : 0;
//   const expiringPercent = totalEmployees ? Math.round((expiringContractsList.length / totalEmployees) * 100) : 0;

//   if (loading)
//     return (
//       <div className="p-10 text-center text-[#6b7d74] bg-[#f5f0e6] min-h-screen">
//         Loading workforce data...
//       </div>
//     );

//   return (
//     <motion.div
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="space-y-6 p-6 bg-[#f5f0e6] min-h-screen"
//     >
//       <motion.div variants={item}>
//         <DataTableHeader
//           title="Employees"
//           subtitle="Manage HR profiles, compliance, and workforce operations"
//           searchPlaceholder="Search employees..."
//           addLabel="Add Employee"
//           onAdd={() => router.push("/hrList/new")}
//           filters={[
//             {
//               label: "Status",
//               options: [
//                 { value: "Employed", label: "Employed" },
//                 { value: "On Leave", label: "On Leave" },
//               ],
//             },
//             {
//               label: "Role",
//               options: [
//                 { value: "Support Worker", label: "Support Worker" },
//                 { value: "Manager", label: "Manager" },
//               ],
//             },
//           ]}
//         />
//       </motion.div>

//       {/* KPI Section */}
//       <motion.div
//         variants={item}
//         className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
//       >
//         <Card className="p-4 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-[#e6f2ec] rounded-lg">
//               <ShieldCheck className="h-5 w-5 text-[#15573c]" />
//             </div>
//             <div>
//               <p className="text-xl font-bold text-[#123d2b]">{dbsPercent}%</p>
//               <p className="text-xs text-[#6b7d74] font-medium">🛡️ DBS Compliant</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-[#e6f2ec] rounded-lg">
//               <GraduationCap className="h-5 w-5 text-[#15573c]" />
//             </div>
//             <div>
//               <p className="text-xl font-bold text-[#123d2b]">{trainingPercent}%</p>
//               <p className="text-xs text-[#6b7d74] font-medium">🎓 Training Complete</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-[#f59e0b20] rounded-lg">
//               <CalendarClock className="h-5 w-5 text-[#F59E0B]" />
//             </div>
//             <div>
//               <p className="text-xl font-bold text-[#123d2b]">{expiringPercent}%</p>
//               <p className="text-xs text-[#6b7d74] font-medium">⚠️ Contracts Expiring</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4 bg-[#1f6b4a] border-none shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-[#f7f2e920] rounded-lg">
//               <Users className="h-5 w-5 text-[#f7f2e9]" />
//             </div>
//             <div>
//               <p className="text-xl font-bold text-[#f7f2e9]">{totalEmployees}</p>
//               <p className="text-xs text-[#f7f2e9cc] font-medium">Total Staff</p>
//             </div>
//           </div>
//         </Card>
//       </motion.div>

//       <motion.div variants={item}>
//         <Tabs defaultValue="all" className="space-y-4">
//           <TabsList className="bg-[#ece7df] border-[#e1dbd2]">
//             <TabsTrigger value="all">All Employees</TabsTrigger>
//             <TabsTrigger value="compliance">Compliance Issues</TabsTrigger>
//             <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all">
//             <Card className="bg-[#fbf8f2] border-[#e1dbd2] overflow-hidden shadow-sm">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-[#e1dbd2] hover:bg-transparent">
//                     <TableHead className="text-[#123d2b]">Employee</TableHead>
//                     <TableHead className="text-[#123d2b]">Role</TableHead>
//                     <TableHead className="text-[#123d2b]">Status</TableHead>
//                     <TableHead className="text-[#123d2b]">Induction</TableHead>
//                     <TableHead className="text-[#123d2b]">Training</TableHead>
//                     <TableHead className="text-right text-[#123d2b]">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {employeeList.map((e) => (
//                     <TableRow
//                       key={e.id}
//                       className="cursor-pointer border-[#e1dbd2] hover:bg-[#e6f2ec]"
//                       onClick={() => router.push(`/hrList/${e.id}`)}
//                     >
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-9 w-9 border-[#e1dbd2]">
//                             <AvatarImage src={e.avatar_url} alt={e.full_name} className="object-cover" />
//                             <AvatarFallback className="bg-[#1f6b4a] text-[#f7f2e9]">
//                               {e.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="font-medium text-[#123d2b]">{e.full_name}</p>
//                             <p className="text-xs text-[#6b7d74]">{e.email}</p>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-[#123d2b]">{e.role}</TableCell>
//                       <TableCell><StatusBadge status={e.status} /></TableCell>
//                       <TableCell>
//                         <StatusBadge status={e.hr_documents?.induction_status || "Pending"} />
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Progress value={e.hr_documents?.training_score || 0} className="h-1.5 w-12 bg-[#ece7df]" />
//                           <span className="text-xs text-[#6b7d74]">{e.hr_documents?.training_score || 0}%</span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild onClick={(ev) => ev.stopPropagation()}>
//                             <Button variant="ghost" className="h-8 w-8 p-0 text-[#123d2b]">
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="bg-[#fbf8f2] border-[#e1dbd2]">
//                             <DropdownMenuLabel className="text-[#123d2b]">Options</DropdownMenuLabel>
//                             <DropdownMenuItem 
//                               className="text-[#123d2b] hover:bg-[#e6f2ec]"
//                               onClick={(ev) => {
//                                 ev.stopPropagation();
//                                 router.push(`/hrList/${e.id}/edit`);
//                               }}
//                             >
//                               <Edit className="mr-2 h-4 w-4" /> Edit Profile
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator className="bg-[#e1dbd2]" />
//                             <DropdownMenuItem
//                               className="text-[#dc2626] hover:bg-[#dc262610]"
//                               onClick={(ev) => handleDelete(e.id, ev)}
//                             >
//                               <Trash2 className="mr-2 h-4 w-4" /> Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Card>
//           </TabsContent>

//           <TabsContent value="compliance">
//             <Card className="bg-[#fbf8f2] border-[#e1dbd2] p-6 shadow-sm">
//               <div className="space-y-4">
//                 {employeeList
//                   .filter((e) => !e.hr_documents?.dbs_certificate_url || (e.hr_documents?.training_score || 0) < 80)
//                   .map((e) => (
//                     <div
//                       key={e.id}
//                       className="flex items-center gap-4 rounded-lg border border-[#e1dbd2] p-4 hover:bg-[#e6f2ec] cursor-pointer transition-colors"
//                       onClick={() => router.push(`/hrList/${e.id}/edit`)}
//                     >
//                       <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
//                       <div className="flex-1">
//                         <p className="font-medium text-[#123d2b]">{e.full_name}</p>
//                         <p className="text-sm text-[#6b7d74]">
//                           {!e.hr_documents?.dbs_certificate_url ? "Missing DBS Certificate. " : ""}
//                           {(e.hr_documents?.training_score || 0) < 80 ? `Low training score: ${e.hr_documents?.training_score}%` : ""}
//                         </p>
//                       </div>
//                       <StatusBadge status="Action Required" />
//                     </div>
//                   ))}
//               </div>
//             </Card>
//           </TabsContent>

//           <TabsContent value="expiring">
//             <Card className="bg-[#fbf8f2] border-[#e1dbd2] p-6 shadow-sm">
//               <div className="space-y-4">
//                 {expiringContractsList.length > 0 ? (
//                   expiringContractsList.map((e) => (
//                     <div
//                       key={e.id}
//                       className="flex items-center gap-4 rounded-lg border border-[#e1dbd2] p-4 hover:bg-[#e6f2ec] cursor-pointer transition-colors"
//                       onClick={() => router.push(`/hrList/${e.id}/edit`)}
//                     >
//                       <CalendarClock className="h-5 w-5 text-[#F59E0B]" />
//                       <div className="flex-1">
//                         <p className="font-medium text-[#123d2b]">{e.full_name}</p>
//                         <p className="text-sm text-[#6b7d74]">
//                           Contract expires on: {new Date(e.hr_documents.contract_expiry).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <Button variant="outline" className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#1f6b4a] hover:text-[#f7f2e9]">
//                         Renew
//                       </Button>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-10 text-[#6b7d74]">
//                     No contracts expiring within the next 90 days.
//                   </div>
//                 )}
//               </div>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default EmployeesPage;


"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DataTableHeader from "@/components/dashboard/DataTableHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  ShieldCheck,
  GraduationCap,
  CalendarClock,
  Users,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Assuming you use sonner for feedback

// Import your existing supabase client
import { supabase } from "@/lib/superbase/client";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const EmployeesPage = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("profiles").select(`
          id, 
          full_name, 
          role, 
          status, 
          email,
          avatar_url,
          hr_documents ( 
            induction_status, 
            training_score,
            contract_expiry,
            dbs_certificate_url
          )
        `);

      if (error) throw error;
      setEmployeeList(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
      toast.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    
    if (confirm("Are you sure? This will permanently delete the employee and all their HR records.")) {
      try {
        // Delete from profiles (Assumes CASCADE delete is on in Supabase for hr_documents)
        const { error } = await supabase.from("profiles").delete().eq("id", id);
        
        if (error) throw error;

        setEmployeeList((prev) => prev.filter((emp) => emp.id !== id));
        toast.success("Employee removed successfully");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting employee: " + error.message);
      }
    }
  };

  // Memoized Filters for Performance
  const filteredEmployees = useMemo(() => {
    return employeeList.filter((emp) =>
      emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employeeList, searchQuery]);

  // KPI Calculations
  const totalEmployees = employeeList.length;
  const dbsCompliant = employeeList.filter(e => e.hr_documents?.dbs_certificate_url).length;
  const trainingComplete = employeeList.filter(e => (e.hr_documents?.training_score ?? 0) >= 80).length;

  const expiringContractsList = employeeList.filter((e) => {
    if (!e.hr_documents?.contract_expiry) return false;
    const expiryDate = new Date(e.hr_documents.contract_expiry);
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    return expiryDate <= ninetyDaysFromNow && expiryDate >= today;
  });

  const dbsPercent = totalEmployees ? Math.round((dbsCompliant / totalEmployees) * 100) : 0;
  const trainingPercent = totalEmployees ? Math.round((trainingComplete / totalEmployees) * 100) : 0;
  const expiringPercent = totalEmployees ? Math.round((expiringContractsList.length / totalEmployees) * 100) : 0;

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f0e6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f6b4a] mx-auto mb-4"></div>
          <p className="text-[#6b7d74] font-medium">Loading workforce data...</p>
        </div>
      </div>
    );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 p-6 bg-[#f5f0e6] min-h-screen"
    >
      <motion.div variants={item}>
        <DataTableHeader
          title="Employees"
          subtitle="Manage HR profiles, compliance, and workforce operations"
          searchPlaceholder="Search by name, role, or email..."
          searchValue={searchQuery}
          onSearchChange={(val) => setSearchQuery(val)}
          addLabel="Add Employee"
          onAdd={() => router.push("/hrList/new")}
        />
      </motion.div>

      {/* KPI Section */}
      <motion.div variants={item} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e6f2ec] rounded-lg">
              <ShieldCheck className="h-5 w-5 text-[#15573c]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#123d2b]">{dbsPercent}%</p>
              <p className="text-xs text-[#6b7d74] font-medium">🛡️ DBS Compliant</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e6f2ec] rounded-lg">
              <GraduationCap className="h-5 w-5 text-[#15573c]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#123d2b]">{trainingPercent}%</p>
              <p className="text-xs text-[#6b7d74] font-medium">🎓 Training Complete</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f59e0b20] rounded-lg">
              <CalendarClock className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#123d2b]">{expiringPercent}%</p>
              <p className="text-xs text-[#6b7d74] font-medium">⚠️ Contracts Expiring</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-[#1f6b4a] border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f7f2e920] rounded-lg">
              <Users className="h-5 w-5 text-[#f7f2e9]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#f7f2e9]">{totalEmployees}</p>
              <p className="text-xs text-[#f7f2e9cc] font-medium">Total Staff</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-[#ece7df] border-[#e1dbd2]">
            <TabsTrigger value="all">All Employees</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Issues</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
          </TabsList>

          {/* ALL EMPLOYEES TAB */}
          <TabsContent value="all">
            <Card className="bg-[#fbf8f2] border-[#e1dbd2] overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#e1dbd2] hover:bg-transparent">
                    <TableHead className="text-[#123d2b]">Employee</TableHead>
                    <TableHead className="text-[#123d2b]">Role</TableHead>
                    <TableHead className="text-[#123d2b]">Status</TableHead>
                    <TableHead className="text-[#123d2b]">Induction</TableHead>
                    <TableHead className="text-[#123d2b]">Training</TableHead>
                    <TableHead className="text-right text-[#123d2b]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((e) => (
                      <TableRow
                        key={e.id}
                        className="cursor-pointer border-[#e1dbd2] hover:bg-[#e6f2ec]"
                        onClick={() => router.push(`/hrList/${e.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border-[#e1dbd2]">
                              <AvatarImage src={e.avatar_url} className="object-cover" />
                              <AvatarFallback className="bg-[#1f6b4a] text-[#f7f2e9]">
                                {e.full_name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-[#123d2b]">{e.full_name}</p>
                              <p className="text-xs text-[#6b7d74]">{e.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#123d2b]">{e.role}</TableCell>
                        <TableCell><StatusBadge status={e.status} /></TableCell>
                        <TableCell>
                          <StatusBadge status={e.hr_documents?.induction_status || "Pending"} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={e.hr_documents?.training_score ?? 0} className="h-1.5 w-12 bg-[#ece7df]" />
                            <span className="text-xs text-[#6b7d74]">{e.hr_documents?.training_score ?? 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(ev) => ev.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-[#123d2b]">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#fbf8f2] border-[#e1dbd2]">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/hrList/${e.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={(ev) => handleDelete(e.id, ev)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-[#6b7d74]">
                        No employees found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* COMPLIANCE TAB */}
          <TabsContent value="compliance">
            <Card className="bg-[#fbf8f2] border-[#e1dbd2] p-6 shadow-sm">
              <div className="space-y-4">
                {employeeList.filter(e => !e.hr_documents?.dbs_certificate_url || (e.hr_documents?.training_score ?? 0) < 80).length > 0 ? (
                  employeeList
                    .filter(e => !e.hr_documents?.dbs_certificate_url || (e.hr_documents?.training_score ?? 0) < 80)
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-4 rounded-lg border border-[#e1dbd2] p-4 hover:bg-[#e6f2ec] cursor-pointer"
                        onClick={() => router.push(`/hrList/${e.id}/edit`)}
                      >
                        <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                        <div className="flex-1">
                          <p className="font-medium text-[#123d2b]">{e.full_name}</p>
                          <p className="text-sm text-[#6b7d74]">
                            {!e.hr_documents?.dbs_certificate_url && "• Missing DBS Certificate "}
                            {(e.hr_documents?.training_score ?? 0) < 80 && `• Training score is ${e.hr_documents?.training_score ?? 0}%`}
                          </p>
                        </div>
                        <StatusBadge status="Action Required" />
                      </div>
                    ))
                ) : (
                  <div className="text-center py-10 text-[#6b7d74] flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-[#1f6b4a]" />
                    <p>All employees are currently compliant.</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* EXPIRING CONTRACTS TAB */}
          <TabsContent value="expiring">
            <Card className="bg-[#fbf8f2] border-[#e1dbd2] p-6 shadow-sm">
              <div className="space-y-4">
                {expiringContractsList.length > 0 ? (
                  expiringContractsList.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center gap-4 rounded-lg border border-[#e1dbd2] p-4 hover:bg-[#e6f2ec] cursor-pointer"
                      onClick={() => router.push(`/hrList/${e.id}/edit`)}
                    >
                      <CalendarClock className="h-5 w-5 text-[#F59E0B]" />
                      <div className="flex-1">
                        <p className="font-medium text-[#123d2b]">{e.full_name}</p>
                        <p className="text-sm text-[#6b7d74]">
                          Expires: {new Date(e.hr_documents.contract_expiry).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <Button variant="outline" className="border-[#1f6b4a] text-[#1f6b4a]">Renew</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-[#6b7d74]">
                    No contracts expiring within 90 days.
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default EmployeesPage;