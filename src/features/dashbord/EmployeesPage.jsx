// "use client"

// import { useEffect, useState } from "react";
// import DataTableHeader from "@/components/dashboard/DataTableHeader";
// import StatusBadge from "@/components/dashboard/StatusBadge";
// import { Card } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { motion } from "framer-motion";
// import { ChevronRight, AlertTriangle, Shield, GraduationCap, FileCheck } from "lucide-react";

// const employees = [
//   { id: 1, name: "Sarah Mitchell", role: "Support Worker", org: "Kenley Housing Group", status: "Employed", dbs: "Valid", rightToWork: "Valid", safeguarding: "Valid", training: 92, contractExpiry: "2026-09-15", lastActive: "2 hours ago" },
//   { id: 2, name: "James Okonkwo", role: "Property Manager", org: "South London Care Ltd", status: "Employed", dbs: "Expiring", rightToWork: "Valid", safeguarding: "Valid", training: 78, contractExpiry: "2026-06-30", lastActive: "1 day ago" },
//   { id: 3, name: "Maria Garcia", role: "Finance Officer", org: "Kenley Housing Group", status: "Employed", dbs: "Valid", rightToWork: "Valid", safeguarding: "Expiring", training: 85, contractExpiry: "2027-01-10", lastActive: "3 hours ago" },
//   { id: 4, name: "David Chen", role: "Senior Support Worker", org: "Croydon Support Services", status: "On Leave", dbs: "Valid", rightToWork: "Valid", safeguarding: "Valid", training: 100, contractExpiry: "2026-12-01", lastActive: "5 days ago" },
//   { id: 5, name: "Priya Sharma", role: "Team Leader", org: "Kenley Housing Group", status: "Employed", dbs: "Valid", rightToWork: "Expiring", safeguarding: "Valid", training: 95, contractExpiry: "2027-03-20", lastActive: "30 min ago" },
//   { id: 6, name: "Tom Williams", role: "Night Support Worker", org: "Bromley Homes CIC", status: "Suspended", dbs: "Non-Compliant", rightToWork: "Valid", safeguarding: "Non-Compliant", training: 45, contractExpiry: "2026-04-01", lastActive: "2 weeks ago" },
// ];

// const complianceKpis = [
//   { label: "Total Employees", value: "86", icon: "👥" },
//   { label: "DBS Compliant", value: "94%", icon: "🛡️" },
//   { label: "Training Complete", value: "87%", icon: "🎓" },
//   { label: "Contracts Expiring (30d)", value: "4", icon: "⚠️" },
// ];

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// const EmployeesPage = () => {


//   return(
//     <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
//       <motion.div variants={item}>
//         <DataTableHeader
//           title="Employees"
//           subtitle="Manage HR profiles, compliance, and workforce operations"
//           searchPlaceholder="Search employees..."
//           addLabel="Add Employee"
//           onAdd={() => {}}
//           filters={[
//             { label: "Status", options: [{ value: "employed", label: "Employed" }, { value: "on-leave", label: "On Leave" }, { value: "suspended", label: "Suspended" }] },
//             { label: "Role", options: [{ value: "support-worker", label: "Support Worker" }, { value: "property-manager", label: "Property Manager" }, { value: "finance", label: "Finance" }] },
//           ]}
//         />
//       </motion.div>

//       <motion.div variants={item} className="grid gap-4 grid-cols-2 md:grid-cols-4">
//         {complianceKpis.map((k) => (
//           <Card key={k.label} className="p-4 shadow-card">
//             <p className="text-2xl mb-1">{k.icon}</p>
//             <p className="text-xl font-bold text-foreground">{k.value}</p>
//             <p className="text-xs text-muted-foreground">{k.label}</p>
//           </Card>
//         ))}
//       </motion.div>

//       <motion.div variants={item}>
//         <Tabs defaultValue="all" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="all">All Employees</TabsTrigger>
//             <TabsTrigger value="compliance">Compliance Issues</TabsTrigger>
//             <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
//           </TabsList>
//           <TabsContent value="all">
//             <Card className="shadow-card overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Employee</TableHead>
//                     <TableHead className="hidden md:table-cell">Role</TableHead>
//                     {/* <TableHead className="hidden lg:table-cell">Organisation</TableHead> */}
//                     <TableHead>Status</TableHead>
//                     <TableHead className="hidden sm:table-cell">DBS</TableHead>
//                     <TableHead className="hidden md:table-cell">Safeguarding</TableHead>
//                     <TableHead className="hidden lg:table-cell">Training</TableHead>
//                     <TableHead className="hidden xl:table-cell">Last Active</TableHead>
//                     <TableHead className="w-10" />
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {employees.map((e) => (
//                     <TableRow key={e.id} className="cursor-pointer hover:bg-accent/30">
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
//                             {e.name.split(" ").map(n => n[0]).join("")}
//                           </div>
//                           <span className="font-medium text-foreground">{e.name}</span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{e.role}</TableCell>
//                       {/* <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{e.org}</TableCell> */}
//                       <TableCell><StatusBadge status={e.status} /></TableCell>
//                       <TableCell className="hidden sm:table-cell"><StatusBadge status={e.dbs === "Valid" ? "Compliant" : e.dbs} /></TableCell>
//                       <TableCell className="hidden md:table-cell"><StatusBadge status={e.safeguarding === "Valid" ? "Compliant" : e.safeguarding} /></TableCell>
//                       <TableCell className="hidden lg:table-cell">
//                         <div className="flex items-center gap-2">
//                           <Progress value={e.training} className="h-2 w-16" />
//                           <span className="text-xs text-muted-foreground">{e.training}%</span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{e.lastActive}</TableCell>
//                       <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Card>
//           </TabsContent>
//           <TabsContent value="compliance">
//             <Card className="shadow-card p-6">
//               <div className="space-y-4">
//                 {employees.filter(e => e.dbs !== "Valid" || e.safeguarding !== "Valid" || e.training < 80).map(e => (
//                   <div key={e.id} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-accent/30 transition-colors">
//                     <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
//                     <div className="flex-1">
//                       <p className="font-medium text-foreground">{e.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {e.dbs !== "Valid" && `DBS: ${e.dbs}. `}
//                         {e.safeguarding !== "Valid" && `Safeguarding: ${e.safeguarding}. `}
//                         {e.training < 80 && `Training: ${e.training}%.`}
//                       </p>
//                     </div>
//                     <StatusBadge status="Action Required" />
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           </TabsContent>
//           <TabsContent value="expiring">
//             <Card className="shadow-card p-6">
//               <div className="space-y-4">
//                 {employees.filter(e => new Date(e.contractExpiry) < new Date("2026-07-01")).map(e => (
//                   <div key={e.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
//                     <FileCheck className="h-5 w-5 text-warning shrink-0" />
//                     <div className="flex-1">
//                       <p className="font-medium text-foreground">{e.name}</p>
//                       <p className="text-sm text-muted-foreground">Contract expires: {e.contractExpiry}</p>
//                     </div>
//                     <StatusBadge status="Expiring" />
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </motion.div>
//     </motion.div>
//   );
    
// };

// export default EmployeesPage;


"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTableHeader from "@/components/dashboard/DataTableHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  AlertTriangle, 
  Shield, 
  GraduationCap, 
  FileCheck, 
  MoreHorizontal, 
  Edit, 
  UserX, 
  Trash2 
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

const initialEmployees = [
  { id: 1, name: "Sarah Mitchell", role: "Support Worker", org: "Kenley Housing Group", status: "Employed", dbs: "Valid", rightToWork: "Valid", training: 92, contractExpiry: "2026-09-15", lastActive: "2 hours ago" },
  { id: 2, name: "James Okonkwo", role: "Property Manager", org: "South London Care Ltd", status: "Employed", dbs: "Expiring", rightToWork: "Valid", training: 78, contractExpiry: "2026-06-30", lastActive: "1 day ago" },
  { id: 3, name: "Maria Garcia", role: "Finance Officer", org: "Kenley Housing Group", status: "Employed", dbs: "Valid", rightToWork: "Valid", training: 85, contractExpiry: "2027-01-10", lastActive: "3 hours ago" },
  { id: 4, name: "David Chen", role: "Senior Support Worker", org: "Croydon Support Services", status: "On Leave", dbs: "Valid", rightToWork: "Valid", training: 100, contractExpiry: "2026-12-01", lastActive: "5 days ago" },
  { id: 5, name: "Priya Sharma", role: "Team Leader", org: "Kenley Housing Group", status: "Employed", dbs: "Valid", rightToWork: "Expiring", training: 95, contractExpiry: "2027-03-20", lastActive: "30 min ago" },
  { id: 6, name: "Tom Williams", role: "Night Support Worker", org: "Bromley Homes CIC", status: "Suspended", dbs: "Non-Compliant", rightToWork: "Valid", training: 45, contractExpiry: "2026-04-01", lastActive: "2 weeks ago" },
];

const complianceKpis = [
  { label: "Total Employees", value: "86", icon: "👥" },
  { label: "DBS Compliant", value: "94%", icon: "🛡️" },
  { label: "Training Complete", value: "87%", icon: "🎓" },
  { label: "Contracts Expiring (30d)", value: "4", icon: "⚠️" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const EmployeesPage = () => {
  const [employeeList, setEmployeeList] = useState(initialEmployees);
  const router = useRouter();

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployeeList(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleDeactivate = (id, e) => {
    e.stopPropagation();
    setEmployeeList(prev => prev.map(emp => 
      emp.id === id ? { ...emp, status: "Inactive" } : emp
    ));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <DataTableHeader
          title="Employees"
          subtitle="Manage HR profiles, compliance, and workforce operations"
          searchPlaceholder="Search employees..."
          addLabel="Add Employee"
          onAdd={() => {}}
          filters={[
            { label: "Status", options: [{ value: "employed", label: "Employed" }, { value: "on-leave", label: "On Leave" }, { value: "suspended", label: "Suspended" }] },
            { label: "Role", options: [{ value: "support-worker", label: "Support Worker" }, { value: "property-manager", label: "Property Manager" }, { value: "finance", label: "Finance" }] },
          ]}
        />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {complianceKpis.map((k) => (
          <Card key={k.label} className="p-4 shadow-card">
            <p className="text-2xl mb-1">{k.icon}</p>
            <p className="text-xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Employees</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Issues</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card className="shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">DBS</TableHead>
                    <TableHead className="hidden lg:table-cell">Training</TableHead>
                    <TableHead className="hidden xl:table-cell">Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeList.map((e) => (
                    <TableRow 
                      key={e.id} 
                      className="cursor-pointer hover:bg-accent/30"
                      onClick={() => router.push(`/hrList/${e.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                            {e.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-medium text-foreground">{e.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{e.role}</TableCell>
                      <TableCell><StatusBadge status={e.status} /></TableCell>
                      <TableCell className="hidden sm:table-cell"><StatusBadge status={e.dbs === "Valid" ? "Compliant" : e.dbs} /></TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={e.training} className="h-2 w-16" />
                          <span className="text-xs text-muted-foreground">{e.training}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{e.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(ev) => ev.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(ev) => { ev.stopPropagation(); router.push(`/hrList/${e.id}/edit`); }}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(ev) => handleDeactivate(e.id, ev)}>
                              <UserX className="mr-2 h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={(ev) => handleDelete(e.id, ev)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="compliance">
            <Card className="shadow-card p-6">
              <div className="space-y-4">
                {employeeList.filter(e => e.dbs !== "Valid" || e.training < 80).map(e => (
                  <div key={e.id} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => router.push(`/hrList/${e.id}`)}>
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{e.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {e.dbs !== "Valid" && `DBS: ${e.dbs}. `}
                        {e.training < 80 && `Training: ${e.training}%.`}
                      </p>
                    </div>
                    <StatusBadge status="Action Required" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="expiring">
            <Card className="shadow-card p-6">
              <div className="space-y-4">
                {employeeList.filter(e => new Date(e.contractExpiry) < new Date("2026-07-01")).map(e => (
                  <div key={e.id} className="flex items-center gap-4 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/30" onClick={() => router.push(`/dashboard/employees/${e.id}`)}>
                    <FileCheck className="h-5 w-5 text-warning shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{e.name}</p>
                      <p className="text-sm text-muted-foreground">Contract expires: {e.contractExpiry}</p>
                    </div>
                    <StatusBadge status="Expiring" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default EmployeesPage;