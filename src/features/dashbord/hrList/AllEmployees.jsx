// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import * as XLSX from "xlsx"; // For spreadsheet export
// import DataTableHeader from "@/components/dashboard/DataTableHeader";
// import StatusBadge from "@/components/dashboard/StatusBadge";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { motion } from "framer-motion";
// import {
//   ShieldCheck,
//   CalendarClock,
//   Users,
//   Trash2,
//   AlertCircle,
//   Edit,
//   Download
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/superbase/client";

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

// const AllEmployees = () => {
//   const [employeeList, setEmployeeList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     const { data, error } = await supabase.from("employees").select("*");
//     if (!error) setEmployeeList(data || []);
//     setLoading(false);
//   };

//   const downloadEmployeeData = (employee, ev) => {
//     ev.stopPropagation();

//     const docFields = [
//       { label: "Proof of Address", url: employee.evidence_address_url },
//       { label: "Photo ID", url: employee.photo_id_url },
//       { label: "Application Form", url: employee.signed_app_url },
//       { label: "Right to Work", url: employee.rtw_check_url },
//       { label: "Insurance/Reg", url: employee.insurance_url },
//       { label: "DBS Document", url: employee.dbs_doc_url },
//       { label: "Ref 1 Document", url: employee.ref1_doc_url },
//       { label: "Ref 2 Document", url: employee.ref2_doc_url },
//       { label: "Induction Checklist", url: employee.induction_checklist_url },
//       { label: "Training Records", url: employee.training_record_url },
//       { label: "Appraisal Docs", url: employee.appraisal_doc_url },
//     ];

//     const rows = [
//       ["--- EMPLOYEE PROFILE ---", "--- DETAILS ---"],
//       ["Full Name", employee.full_name],
//       ["Email", employee.contact_info],
//       ["Job Role", employee.job_role],
//       ["Date of Birth", employee.dob],
//       ["Start Date", employee.start_date],
//       ["", ""],
//       ["--- COMPLIANCE ---", "--- STATUS ---"],
//       ["DBS Number", employee.dbs_number || "N/A"],
//       ["DBS Date", employee.dbs_completion_date || "N/A"],
//       ["Induction", employee.induction_completed_date || "Pending"],
//       ["", ""],
//       ["--- DOCUMENT LINKS ---", "--- CLICK TO OPEN ---"],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(rows);

//     docFields.forEach((field) => {
//       const label = field.label;
//       const url = field.url;
//       const nextRow = XLSX.utils.decode_range(worksheet["!ref"]).e.r + 1;
      
//       XLSX.utils.sheet_add_aoa(worksheet, [[label]], { origin: `A${nextRow + 1}` });

//       if (url && typeof url === 'string') {
//         worksheet[`B${nextRow + 1}`] = {
//           f: `HYPERLINK("${url}", "View Document")`,
//           v: "View Document"
//         };
//       } else {
//         XLSX.utils.sheet_add_aoa(worksheet, [["No file uploaded"]], { origin: `B${nextRow + 1}` });
//       }
//     });

//     worksheet["!cols"] = [{ wch: 25 }, { wch: 60 }];
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
//     XLSX.writeFile(workbook, `${employee.full_name.replace(/\s+/g, '_')}_HR_Report.xlsx`);
//   };

//   const complianceIssuesList = employeeList.filter(e => 
//     !e.dbs_number || !e.induction_completed_date || !e.training_record_url
//   );

//   const expiringContractsList = employeeList.filter(e => e.last_appraisal_date === null); 
//   const totalEmployees = employeeList.length;
//   const dbsCompliant = employeeList.filter(e => e.dbs_number).length;
//   const dbsPercent = totalEmployees ? Math.round((dbsCompliant / totalEmployees) * 100) : 0;

//   // Internal Table Component
//   const EmployeeTable = ({ data, onDelete, emptyMessage = "No records found." }) => {
//     if (data.length === 0) return (
//       <Card className="p-20 text-center text-[#6b7d74] bg-[#fbf8f2] border-[#e1dbd2]">{emptyMessage}</Card>
//     );

//     return (
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] overflow-hidden shadow-sm">
//         <Table>
//           <TableHeader>
//             <TableRow className="border-[#e1dbd2]">
//               <TableHead>Employee</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>DBS Check</TableHead>
//               <TableHead>Induction</TableHead>
//               <TableHead>Email Address</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((e) => (
//               <TableRow 
//                 key={e.id} 
//                 className="hover:bg-[#e6f2ec] cursor-pointer border-[#e1dbd2]" 
//                 onClick={() => router.push(`/hrList/${e.id}`)}
//               >
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <Avatar className="h-9 w-9 border-[#e1dbd2]">
//                       <AvatarFallback className="bg-[#1f6b4a] text-[#f7f2e9]">
//                         {e.full_name?.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <p className="font-medium text-[#123d2b]">{e.full_name}</p>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-[#123d2b] font-medium">{e.job_role}</TableCell>
//                 <TableCell>
//                   <StatusBadge status={e.dbs_number ? "Valid" : "Missing"} />
//                 </TableCell>
//                 <TableCell>
//                   <StatusBadge status={e.induction_completed_date ? "Completed" : "Incomplete"} />
//                 </TableCell>
//                 <TableCell className="text-[#6b7d74] text-xs">{e.contact_info}</TableCell>
//                 <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
//                   <div className="flex justify-end gap-1">
//                     <Button variant="ghost" size="sm" onClick={(ev) => downloadEmployeeData(e, ev)}>
//                       <Download className="h-4 w-4 text-[#1f6b4a]" />
//                     </Button>
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={(ev) => {
//                         ev.stopPropagation();
//                         router.push(`/hrList/${e.id}/edit`);
//                       }}
//                     >
//                       <Edit className="h-4 w-4 text-blue-600" />
//                     </Button>
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={async (ev) => {
//                         ev.stopPropagation();
//                         if (confirm("Delete this record?")) {
//                           await supabase.from("employees").delete().eq("id", e.id);
//                           onDelete();
//                         }
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>
//     );
//   };

//   if (loading) return <div className="p-10 text-center bg-[#f5f0e6] min-h-screen">Loading...</div>;

//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="p-6 bg-[#f5f0e6] min-h-screen space-y-6">
//       <motion.div variants={item}>
//         <DataTableHeader 
//           title="Workforce Directory" 
//           description="Manage employee records, compliance, and training."
//           buttonText="Enroll New Employee"
//           onButtonClick={() => router.push("/hrList/add")}
//         />
//       </motion.div>

//       <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <StatCard icon={<ShieldCheck />} value={`${dbsPercent}%`} label="DBS Compliant" />
//         <StatCard icon={<AlertCircle />} value={complianceIssuesList.length} label="Compliance Issues" isWarning={complianceIssuesList.length > 0} />
//         <StatCard icon={<CalendarClock />} value={expiringContractsList.length} label="Expiring Docs" />
//         <StatCard icon={<Users />} value={totalEmployees} label="Total Staff" isPrimary />
//       </motion.div>

//       <motion.div variants={item}>
//         <Tabs defaultValue="all" className="space-y-4">
//           <TabsList className="bg-[#ece7df] border-[#e1dbd2]">
//             <TabsTrigger value="all">All Staff</TabsTrigger>
//             <TabsTrigger value="compliance">Compliance Alerts</TabsTrigger>
//             <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all">
//             <EmployeeTable data={employeeList} onDelete={fetchEmployees} />
//           </TabsContent>

//           <TabsContent value="compliance">
//             <EmployeeTable data={complianceIssuesList} onDelete={fetchEmployees} emptyMessage="No compliance issues found." />
//           </TabsContent>

//           <TabsContent value="expiring">
//             <EmployeeTable data={expiringContractsList} onDelete={fetchEmployees} emptyMessage="No expiring contracts found." />
//           </TabsContent>
//         </Tabs>
//       </motion.div>
//     </motion.div>
//   );
// };

// const StatCard = ({ icon, value, label, isPrimary, isWarning }) => (
//   <Card className={`p-4 border-[#e1dbd2] shadow-sm ${isPrimary ? 'bg-[#1f6b4a] text-white' : 'bg-[#fbf8f2]'}`}>
//     <div className="flex items-center gap-3">
//       <div className={`p-2 rounded-lg ${isPrimary ? 'bg-[#ffffff20]' : isWarning ? 'bg-red-100' : 'bg-[#e6f2ec]'}`}>
//         {React.cloneElement(icon, { size: 20, className: isPrimary ? 'text-white' : isWarning ? 'text-red-600' : 'text-[#15573c]' })}
//       </div>
//       <div>
//         <p className="text-xl font-bold">{value}</p>
//         <p className={`text-xs font-medium ${isPrimary ? 'text-[#f7f2e9cc]' : 'text-[#6b7d74]'}`}>{label}</p>
//       </div>
//     </div>
//   </Card>
// );

// export default AllEmployees;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import * as XLSX from "xlsx"; // For spreadsheet export
// import DataTableHeader from "@/components/dashboard/DataTableHeader";
// import StatusBadge from "@/components/dashboard/StatusBadge";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { motion } from "framer-motion";
// import {
//   ShieldCheck,
//   CalendarClock,
//   Users,
//   Trash2,
//   AlertCircle,
//   Edit,
//   Download,
//   RefreshCw,
//   Plus,
//   FileSpreadsheet
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/superbase/client";

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

// const AllEmployees = () => {
//   const [employeeList, setEmployeeList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     const { data, error } = await supabase.from("employees").select("*");
//     if (!error) setEmployeeList(data || []);
//     setLoading(false);
//   };

//   const exportAllEmployees = () => {
//     if (employeeList.length === 0) return;

//     // 1. Create headers
//     const headers = [
//       "Full Name", 
//       "Job Role", 
//       "Email Address", 
//       "Date of Birth", 
//       "Start Date", 
//       "DBS Number", 
//       "Induction Status", 
//       "Document Link"
//     ];

//     // 2. Map data to rows
//     const dataRows = employeeList.map((e) => [
//       e.full_name,
//       e.job_role,
//       e.email_address,
//       e.dob,
//       e.start_date,
//       e.dbs_number || "N/A",
//       e.induction_completed_date ? "Completed" : "Incomplete",
//       e.photo_id_url || "" // Raw URL for now, will turn into link below
//     ]);

//     // 3. Construct Worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

//     // 4. Convert the "Document Link" column (Index 7 / Column H) into clickable HYPERLINKS
//     employeeList.forEach((e, index) => {
//       const rowIndex = index + 2; // +1 for header, +1 for 1-based indexing
//       const cellAddress = `H${rowIndex}`;
//       const url = e.photo_id_url;

//       if (url && typeof url === 'string') {
//         worksheet[cellAddress] = {
//           f: `HYPERLINK("${url}", "View Photo ID")`,
//           v: "View Photo ID"
//         };
//       } else {
//         worksheet[cellAddress] = { v: "No File" };
//       }
//     });

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Directory");

//     // Set column widths
//     worksheet["!cols"] = [
//       { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, 
//       { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }
//     ];

//     XLSX.writeFile(workbook, `Staff_Directory_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const downloadEmployeeData = (employee, ev) => {
//     if (ev) ev.stopPropagation();

//     const docFields = [
//       { label: "Proof of Address", url: employee.evidence_address_url },
//       { label: "Photo ID", url: employee.photo_id_url },
//       { label: "Application Form", url: employee.signed_app_url },
//       { label: "Right to Work", url: employee.rtw_check_url },
//       { label: "Insurance/Reg", url: employee.insurance_url },
//       { label: "DBS Document", url: employee.dbs_doc_url },
//       { label: "Ref 1 Document", url: employee.ref1_doc_url },
//       { label: "Ref 2 Document", url: employee.ref2_doc_url },
//       { label: "Induction Checklist", url: employee.induction_checklist_url },
//       { label: "Training Records", url: employee.training_record_url },
//       { label: "Appraisal Docs", url: employee.appraisal_doc_url },
//     ];

//     const rows = [
//       ["--- EMPLOYEE PROFILE ---", "--- DETAILS ---"],
//       ["Full Name", employee.full_name],
//       ["Email", employee.contact_info],
//       ["Job Role", employee.job_role],
//       ["Date of Birth", employee.dob],
//       ["Start Date", employee.start_date],
//       ["", ""],
//       ["--- COMPLIANCE ---", "--- STATUS ---"],
//       ["DBS Number", employee.dbs_number || "N/A"],
//       ["DBS Date", employee.dbs_completion_date || "N/A"],
//       ["Induction", employee.induction_completed_date || "Pending"],
//       ["", ""],
//       ["--- DOCUMENT LINKS ---", "--- CLICK TO OPEN ---"],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(rows);

//     docFields.forEach((field) => {
//       const label = field.label;
//       const url = field.url;
//       const nextRow = XLSX.utils.decode_range(worksheet["!ref"]).e.r + 1;
      
//       XLSX.utils.sheet_add_aoa(worksheet, [[label]], { origin: `A${nextRow + 1}` });

//       if (url && typeof url === 'string') {
//         worksheet[`B${nextRow + 1}`] = {
//           f: `HYPERLINK("${url}", "View Document")`,
//           v: "View Document"
//         };
//       } else {
//         XLSX.utils.sheet_add_aoa(worksheet, [["No file uploaded"]], { origin: `B${nextRow + 1}` });
//       }
//     });

//     worksheet["!cols"] = [{ wch: 25 }, { wch: 60 }];
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
//     XLSX.writeFile(workbook, `${employee.full_name.replace(/\s+/g, '_')}_HR_Report.xlsx`);
//   };

//   const complianceIssuesList = employeeList.filter(e => 
//     !e.dbs_number || !e.induction_completed_date || !e.training_record_url
//   );

//   const expiringContractsList = employeeList.filter(e => e.last_appraisal_date === null); 
//   const totalEmployees = employeeList.length;
//   const dbsCompliant = employeeList.filter(e => e.dbs_number).length;
//   const dbsPercent = totalEmployees ? Math.round((dbsCompliant / totalEmployees) * 100) : 0;

//   // Internal Table Component
//   const EmployeeTable = ({ data, onDelete, emptyMessage = "No records found." }) => {
//     if (data.length === 0) return (
//       <Card className="p-20 text-center text-[#6b7d74] bg-[#fbf8f2] border-[#e1dbd2]">{emptyMessage}</Card>
//     );

//     return (
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] overflow-hidden shadow-sm">
//         <Table>
//           <TableHeader>
//             <TableRow className="border-[#e1dbd2]">
//               <TableHead>Employee</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>DBS Check</TableHead>
//               <TableHead>Induction</TableHead>
//               <TableHead>Email Address</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((e) => (
//               <TableRow 
//                 key={e.id} 
//                 className="hover:bg-[#e6f2ec] cursor-pointer border-[#e1dbd2]" 
//                 onClick={() => router.push(`/hrList/${e.id}`)}
//               >
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <Avatar className="h-9 w-9 border-[#e1dbd2]">
//                       <AvatarFallback className="bg-[#1f6b4a] text-[#f7f2e9]">
//                         {e.full_name?.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <p className="font-medium text-[#123d2b]">{e.full_name}</p>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-[#123d2b] font-medium">{e.job_role}</TableCell>
//                 <TableCell>
//                   <StatusBadge status={e.dbs_number ? "Valid" : "Missing"} />
//                 </TableCell>
//                 <TableCell>
//                   <StatusBadge status={e.induction_completed_date ? "Completed" : "Incomplete"} />
//                 </TableCell>
//                 <TableCell className="text-[#6b7d74] text-xs">{e.email_address}</TableCell>
//                 <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
//                   <div className="flex justify-end gap-1">
//                     <Button variant="ghost" size="sm" onClick={(ev) => downloadEmployeeData(e, ev)}>
//                       <Download className="h-4 w-4 text-[#1f6b4a]" />
//                     </Button>
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={(ev) => {
//                         ev.stopPropagation();
//                         router.push(`/hrList/${e.id}/edit`);
//                       }}
//                     >
//                       <Edit className="h-4 w-4 text-blue-600" />
//                     </Button>
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={async (ev) => {
//                         ev.stopPropagation();
//                         if (confirm("Delete this record?")) {
//                           await supabase.from("employees").delete().eq("id", e.id);
//                           onDelete();
//                         }
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>
//     );
//   };

//   if (loading) return <div className="p-10 text-center min-h-screen">Loading...</div>;

//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="p-6 min-h-screen space-y-6">
//       <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">

//         <div>
//             <h2 className="font-black text-3xl">Employee Directory</h2>
//             <p>Manage employee records, compliance, and training.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button 
//             variant="outline" 
//             className="border-[#e1dbd2] text-[#123d2b] hover:bg-[#ece7df]"
//             onClick={fetchEmployees}
//           >
//             <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>

//           <Button 
//             variant="outline" 
//             className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]"
//             onClick={exportAllEmployees}
//           >
//             <FileSpreadsheet className="mr-2 h-4 w-4" />
//             Export Staff Data
//           </Button>

//           <Button 
//             className="bg-[#1f6b4a] hover:bg-[#15573c] text-white"
//             onClick={() => router.push("/hrList/addEmployee")}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Add Employee
//           </Button>
//         </div>
//       </motion.div>

//       <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <StatCard icon={<ShieldCheck />} value={`${dbsPercent}%`} label="DBS Compliant" />
//         <StatCard icon={<AlertCircle />} value={complianceIssuesList.length} label="Compliance Issues" isWarning={complianceIssuesList.length > 0} />
//         <StatCard icon={<CalendarClock />} value={expiringContractsList.length} label="Expiring Docs" />
//         <StatCard icon={<Users />} value={totalEmployees} label="Total Staff" isPrimary />
//       </motion.div>

//       <motion.div variants={item}>
//         <Tabs defaultValue="all" className="space-y-4">
//           <TabsList className="bg-[#ece7df] border-[#e1dbd2]">
//             <TabsTrigger value="all">All Staff</TabsTrigger>
//             <TabsTrigger value="compliance">Compliance Alerts</TabsTrigger>
//             <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all">
//             <EmployeeTable data={employeeList} onDelete={fetchEmployees} />
//           </TabsContent>

//           <TabsContent value="compliance">
//             <EmployeeTable data={complianceIssuesList} onDelete={fetchEmployees} emptyMessage="No compliance issues found." />
//           </TabsContent>

//           <TabsContent value="expiring">
//             <EmployeeTable data={expiringContractsList} onDelete={fetchEmployees} emptyMessage="No expiring contracts found." />
//           </TabsContent>
//         </Tabs>
//       </motion.div>
//     </motion.div>
//   );
// };

// const StatCard = ({ icon, value, label, isPrimary, isWarning }) => (
//   <Card className={`p-4 border-[#e1dbd2] shadow-sm ${isPrimary ? 'bg-[#1f6b4a] text-white' : 'bg-[#fbf8f2]'}`}>
//     <div className="flex items-center gap-3">
//       <div className={`p-2 rounded-lg ${isPrimary ? 'bg-[#ffffff20]' : isWarning ? 'bg-red-100' : 'bg-[#e6f2ec]'}`}>
//         {React.cloneElement(icon, { size: 20, className: isPrimary ? 'text-white' : isWarning ? 'text-red-600' : 'text-[#15573c]' })}
//       </div>
//       <div>
//         <p className="text-xl font-bold">{value}</p>
//         <p className={`text-xs font-medium ${isPrimary ? 'text-[#f7f2e9cc]' : 'text-[#6b7d74]'}`}>{label}</p>
//       </div>
//     </div>
//   </Card>
// );

// export default AllEmployees;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import * as XLSX from "xlsx"; // For spreadsheet export
// import DataTableHeader from "@/components/dashboard/DataTableHeader";
// import StatusBadge from "@/components/dashboard/StatusBadge";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { motion } from "framer-motion";
// import {
//   ShieldCheck,
//   CalendarClock,
//   Users,
//   Trash2,
//   AlertCircle,
//   Edit,
//   Download,
//   RefreshCw,
//   Plus,
//   FileSpreadsheet,
//   Loader2
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/superbase/client";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

// const AllEmployees = () => {
//   const [employeeList, setEmployeeList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // State for Delete Modal Logic
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [employeeToDelete, setEmployeeToDelete] = useState(null);
//   const [deleteConfirmation, setDeleteConfirmation] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     const { data, error } = await supabase.from("employees").select("*");
//     if (!error) setEmployeeList(data || []);
//     setLoading(false);
//   };

//   const handleDeleteEmployee = async () => {
//     if (deleteConfirmation !== "DELETE" || !employeeToDelete) return;

//     setIsDeleting(true);
//     try {
//       // 1. Identify all file paths in storage buckets to be deleted
//       const storageFields = [
//         "evidence_address_url", "photo_id_url", "signed_app_url", 
//         "rtw_check_url", "insurance_url", "dbs_doc_url", 
//         "ref1_doc_url", "ref2_doc_url", "induction_checklist_url", 
//         "training_record_url", "appraisal_doc_url"
//       ];

//       const filesToDelete = storageFields
//         .map(field => employeeToDelete[field])
//         .filter(url => url && typeof url === 'string')
//         .map(url => {
//           // Extract the path after the bucket name (assuming 'hr_documents' is the bucket)
//           const parts = url.split("hr_documents/");
//           return parts.length > 1 ? parts[1] : null;
//         })
//         .filter(path => path !== null);

//       // 2. Delete files from Supabase Bucket
//       if (filesToDelete.length > 0) {
//         await supabase.storage.from("hr_documents").remove(filesToDelete);
//       }

//       // 3. Delete record from Database
//       const { error } = await supabase
//         .from("employees")
//         .delete()
//         .eq("id", employeeToDelete.id);

//       if (error) throw error;

//       toast.success("Employee record and files deleted successfully");
//       setIsDeleteDialogOpen(false);
//       setDeleteConfirmation("");
//       setEmployeeToDelete(null);
//       fetchEmployees();
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Failed to delete record");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const exportAllEmployees = () => {
//     if (employeeList.length === 0) return;

//     // 1. Create headers
//     const headers = [
//       "Full Name", 
//       "Job Role", 
//       "Email Address", 
//       "Date of Birth", 
//       "Start Date", 
//       "DBS Number", 
//       "Induction Status", 
//       "Document Link"
//     ];

//     // 2. Map data to rows
//     const dataRows = employeeList.map((e) => [
//       e.full_name,
//       e.job_role,
//       e.email_address,
//       e.dob,
//       e.start_date,
//       e.dbs_number || "N/A",
//       e.induction_completed_date ? "Completed" : "Incomplete",
//       e.photo_id_url || "" // Raw URL for now, will turn into link below
//     ]);

//     // 3. Construct Worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

//     // 4. Convert the "Document Link" column (Index 7 / Column H) into clickable HYPERLINKS
//     employeeList.forEach((e, index) => {
//       const rowIndex = index + 2; // +1 for header, +1 for 1-based indexing
//       const cellAddress = `H${rowIndex}`;
//       const url = e.photo_id_url;

//       if (url && typeof url === 'string') {
//         worksheet[cellAddress] = {
//           f: `HYPERLINK("${url}", "View Photo ID")`,
//           v: "View Photo ID"
//         };
//       } else {
//         worksheet[cellAddress] = { v: "No File" };
//       }
//     });

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Directory");

//     // Set column widths
//     worksheet["!cols"] = [
//       { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, 
//       { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }
//     ];

//     XLSX.writeFile(workbook, `Staff_Directory_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const downloadEmployeeData = (employee, ev) => {
//     if (ev) ev.stopPropagation();

//     const docFields = [
//       { label: "Proof of Address", url: employee.evidence_address_url },
//       { label: "Photo ID", url: employee.photo_id_url },
//       { label: "Application Form", url: employee.signed_app_url },
//       { label: "Right to Work", url: employee.rtw_check_url },
//       { label: "Insurance/Reg", url: employee.insurance_url },
//       { label: "DBS Document", url: employee.dbs_doc_url },
//       { label: "Ref 1 Document", url: employee.ref1_doc_url },
//       { label: "Ref 2 Document", url: employee.ref2_doc_url },
//       { label: "Induction Checklist", url: employee.induction_checklist_url },
//       { label: "Training Records", url: employee.training_record_url },
//       { label: "Appraisal Docs", url: employee.appraisal_doc_url },
//     ];

//     const rows = [
//       ["--- EMPLOYEE PROFILE ---", "--- DETAILS ---"],
//       ["Full Name", employee.full_name],
//       ["Email", employee.contact_info],
//       ["Job Role", employee.job_role],
//       ["Date of Birth", employee.dob],
//       ["Start Date", employee.start_date],
//       ["", ""],
//       ["--- COMPLIANCE ---", "--- STATUS ---"],
//       ["DBS Number", employee.dbs_number || "N/A"],
//       ["DBS Date", employee.dbs_completion_date || "N/A"],
//       ["Induction", employee.induction_completed_date || "Pending"],
//       ["", ""],
//       ["--- DOCUMENT LINKS ---", "--- CLICK TO OPEN ---"],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(rows);

//     docFields.forEach((field) => {
//       const label = field.label;
//       const url = field.url;
//       const nextRow = XLSX.utils.decode_range(worksheet["!ref"]).e.r + 1;
      
//       XLSX.utils.sheet_add_aoa(worksheet, [[label]], { origin: `A${nextRow + 1}` });

//       if (url && typeof url === 'string') {
//         worksheet[`B${nextRow + 1}`] = {
//           f: `HYPERLINK("${url}", "View Document")`,
//           v: "View Document"
//         };
//       } else {
//         XLSX.utils.sheet_add_aoa(worksheet, [["No file uploaded"]], { origin: `B${nextRow + 1}` });
//       }
//     });

//     worksheet["!cols"] = [{ wch: 25 }, { wch: 60 }];
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
//     XLSX.writeFile(workbook, `${employee.full_name.replace(/\s+/g, '_')}_HR_Report.xlsx`);
//   };

//   const complianceIssuesList = employeeList.filter(e => 
//     !e.dbs_number || !e.induction_completed_date || !e.training_record_url
//   );

//   const expiringContractsList = employeeList.filter(e => e.last_appraisal_date === null); 
//   const totalEmployees = employeeList.length;
//   const dbsCompliant = employeeList.filter(e => e.dbs_number).length;
//   const dbsPercent = totalEmployees ? Math.round((dbsCompliant / totalEmployees) * 100) : 0;

//   // Internal Table Component
//   const EmployeeTable = ({ data, onDelete, emptyMessage = "No records found." }) => {
//     if (data.length === 0) return (
//       <Card className="p-20 text-center text-[#6b7d74] bg-[#fbf8f2] border-[#e1dbd2]">{emptyMessage}</Card>
//     );

//     return (
//       <Card className="bg-[#fbf8f2] border-[#e1dbd2] overflow-hidden shadow-sm">
//         <Table>
//           <TableHeader>
//             <TableRow className="border-[#e1dbd2]">
//               <TableHead>Employee</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>DBS Check</TableHead>
//               <TableHead>Induction</TableHead>
//               <TableHead>Email Address</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((e) => (
//               <TableRow 
//                 key={e.id} 
//                 className="hover:bg-[#e6f2ec] cursor-pointer border-[#e1dbd2]" 
//                 onClick={() => router.push(`/hrList/${e.id}`)}
//               >
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <Avatar className="h-9 w-9 border-[#e1dbd2]">
//                       <AvatarFallback className="bg-[#1f6b4a] text-[#f7f2e9]">
//                         {e.full_name?.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <p className="font-medium text-[#123d2b]">{e.full_name}</p>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-[#123d2b] font-medium">{e.job_role}</TableCell>
//                 <TableCell>
//                   <StatusBadge status={e.dbs_number ? "Valid" : "Missing"} />
//                 </TableCell>
//                 <TableCell>
//                   <StatusBadge status={e.induction_completed_date ? "Completed" : "Incomplete"} />
//                 </TableCell>
//                 <TableCell className="text-[#6b7d74] text-xs">{e.email_address}</TableCell>
//                 <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
//                   <div className="flex justify-end gap-1">
//                     <Button variant="ghost" size="sm" onClick={(ev) => downloadEmployeeData(e, ev)}>
//                       <Download className="h-4 w-4 text-[#1f6b4a]" />
//                     </Button>
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={(ev) => {
//                         ev.stopPropagation();
//                         router.push(`/hrList/${e.id}/edit`);
//                       }}
//                     >
//                       <Edit className="h-4 w-4 text-blue-600" />
//                     </Button>
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={(ev) => {
//                         ev.stopPropagation();
//                         setEmployeeToDelete(e);
//                         setIsDeleteDialogOpen(true);
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>
//     );
//   };

//   if (loading) return <div className="p-10 text-center min-h-screen">Loading...</div>;

//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="p-6 min-h-screen space-y-6">
//       <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">

//         <div>
//             <h2 className="font-black text-3xl">Employee Directory</h2>
//             <p>Manage employee records, compliance, and training.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button 
//             variant="outline" 
//             className="border-[#e1dbd2] text-[#123d2b] hover:bg-[#ece7df]"
//             onClick={fetchEmployees}
//           >
//             <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>

//           <Button 
//             variant="outline" 
//             className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]"
//             onClick={exportAllEmployees}
//           >
//             <FileSpreadsheet className="mr-2 h-4 w-4" />
//             Export Staff Data
//           </Button>

//           <Button 
//             className="bg-[#1f6b4a] hover:bg-[#15573c] text-white"
//             onClick={() => router.push("/hrList/addEmployee")}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Add Employee
//           </Button>
//         </div>
//       </motion.div>

//       <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <StatCard icon={<ShieldCheck />} value={`${dbsPercent}%`} label="DBS Compliant" />
//         <StatCard icon={<AlertCircle />} value={complianceIssuesList.length} label="Compliance Issues" isWarning={complianceIssuesList.length > 0} />
//         <StatCard icon={<CalendarClock />} value={expiringContractsList.length} label="Expiring Docs" />
//         <StatCard icon={<Users />} value={totalEmployees} label="Total Staff" isPrimary />
//       </motion.div>

//       <motion.div variants={item}>
//         <Tabs defaultValue="all" className="space-y-4">
//           <TabsList className="bg-[#ece7df] border-[#e1dbd2]">
//             <TabsTrigger value="all">All Staff</TabsTrigger>
//             <TabsTrigger value="compliance">Compliance Alerts</TabsTrigger>
//             <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all">
//             <EmployeeTable data={employeeList} onDelete={fetchEmployees} />
//           </TabsContent>

//           <TabsContent value="compliance">
//             <EmployeeTable data={complianceIssuesList} onDelete={fetchEmployees} emptyMessage="No compliance issues found." />
//           </TabsContent>

//           <TabsContent value="expiring">
//             <EmployeeTable data={expiringContractsList} onDelete={fetchEmployees} emptyMessage="No expiring contracts found." />
//           </TabsContent>
//         </Tabs>
//       </motion.div>

//       {/* CUSTOM DELETE POPUP */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-106.25 bg-[#fbf8f2] border-[#e1dbd2]">
//           <DialogHeader>
//             <DialogTitle className="text-[#123d2b] flex items-center gap-2">
//               <AlertCircle className="text-red-600 h-5 w-5" />
//               Confirm Permanent Deletion
//             </DialogTitle>
//             <DialogDescription className="text-[#6b7d74] py-2">
//               This will permanently remove <strong>{employeeToDelete?.full_name}</strong> and delete all their associated files from the storage bucket. This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-3 py-4">
//             <p className="text-sm font-medium text-[#123d2b]">
//               Please type <span className="font-bold text-red-600">DELETE</span> to confirm:
//             </p>
//             <Input 
//               value={deleteConfirmation}
//               onChange={(e) => setDeleteConfirmation(e.target.value)}
//               placeholder="Type DELETE"
//               className="border-[#e1dbd2] focus-visible:ring-[#1f6b4a]"
//             />
//           </div>
//           <DialogFooter className="gap-2 sm:gap-0">
//             <Button 
//               variant="outline" 
//               onClick={() => {
//                 setIsDeleteDialogOpen(false);
//                 setDeleteConfirmation("");
//               }}
//               className="border-[#e1dbd2] text-[#123d2b]"
//             >
//               Cancel
//             </Button>
//             <Button 
//               disabled={deleteConfirmation !== "DELETE" || isDeleting}
//               onClick={handleDeleteEmployee}
//               className="bg-red-600 hover:bg-red-700 text-white"
//             >
//               {isDeleting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 "Delete Record"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </motion.div>
//   );
// };

// const StatCard = ({ icon, value, label, isPrimary, isWarning }) => (
//   <Card className={`p-4 border-[#e1dbd2] shadow-sm ${isPrimary ? 'bg-[#1f6b4a] text-white' : 'bg-[#fbf8f2]'}`}>
//     <div className="flex items-center gap-3">
//       <div className={`p-2 rounded-lg ${isPrimary ? 'bg-[#ffffff20]' : isWarning ? 'bg-red-100' : 'bg-[#e6f2ec]'}`}>
//         {React.cloneElement(icon, { size: 20, className: isPrimary ? 'text-white' : isWarning ? 'text-red-600' : 'text-[#15573c]' })}
//       </div>
//       <div>
//         <p className="text-xl font-bold">{value}</p>
//         <p className={`text-xs font-medium ${isPrimary ? 'text-[#f7f2e9cc]' : 'text-[#6b7d74]'}`}>{label}</p>
//       </div>
//     </div>
//   </Card>
// );

// export default AllEmployees;


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import DataTableHeader from "@/components/dashboard/DataTableHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CalendarClock,
  Users,
  Trash2,
  AlertCircle,
  Edit,
  Download,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/superbase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AllEmployees = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("employees").select("*");
    if (!error) setEmployeeList(data || []);
    setLoading(false);
  };

const handleDeleteEmployee = async () => {
  if (deleteConfirmation !== "DELETE" || !employeeToDelete) return;

  setIsDeleting(true);
  try {
    // 1. Define all columns that hold document URLs
    const storageFields = [
      "evidence_address_url", "photo_id_url", "signed_app_url", 
      "rtw_check_url", "insurance_url", "dbs_doc_url", 
      "ref1_doc_url", "ref2_doc_url", "induction_checklist_url", 
      "training_record_url", "appraisal_doc_url"
    ];

    // 2. Extract relative paths from URLs (FIXED VERSION)
    const filesToDelete = storageFields
      .map(field => employeeToDelete[field])
      .filter(url => url && typeof url === "string")
      .map(url => {
        try {
          const urlObj = new URL(url);
          const path = urlObj.pathname;

          // extract everything after /employee-docs/
          const index = path.indexOf("/employee-docs/");
          return index !== -1
            ? path.substring(index + "/employee-docs/".length)
            : null;
        } catch (err) {
          console.warn("Invalid URL:", url);
          return null;
        }
      })
      .filter(Boolean);

    console.log("FILES TO DELETE:", filesToDelete);

    // 3. Delete files from the bucket 'employee-docs'
    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("employee-docs")
        .remove(filesToDelete);
      
      if (storageError) {
        console.warn("Could not delete some files from storage:", storageError.message);
      }
    }

    // 4. Delete the database record
    const { error: dbError } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeToDelete.id);

    if (dbError) throw dbError;

    toast.success("Employee and all files deleted successfully");
    setIsDeleteDialogOpen(false);
    setDeleteConfirmation("");
    setEmployeeToDelete(null);
    fetchEmployees();
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete record from database");
  } finally {
    setIsDeleting(false);
  }
};

  // --- Spreadsheet Export Logic ---
  const exportAllEmployees = () => {
    if (employeeList.length === 0) return;
    const headers = ["Full Name", "Job Role", "Email", "DOB", "Start Date", "DBS #", "Induction", "File Link"];
    const dataRows = employeeList.map((e) => [
      e.full_name, e.job_role, e.email_address, e.dob, e.start_date, 
      e.dbs_number || "N/A", e.induction_completed_date ? "Completed" : "Incomplete", e.photo_id_url || ""
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Directory");
    XLSX.writeFile(workbook, `Staff_Directory_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadEmployeeData = (employee, ev) => {
    if (ev) ev.stopPropagation();
    const rows = [
      ["Employee", employee.full_name],
      ["Role", employee.job_role],
      ["Email", employee.email_address],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${employee.full_name}_Report.xlsx`);
  };

  // --- Stats Calculations ---
  const complianceIssuesList = employeeList.filter(e => !e.dbs_number || !e.induction_completed_date);
  const expiringContractsList = employeeList.filter(e => e.last_appraisal_date === null); 
  const totalEmployees = employeeList.length;
  const dbsCompliant = employeeList.filter(e => e.dbs_number).length;
  const dbsPercent = totalEmployees ? Math.round((dbsCompliant / totalEmployees) * 100) : 0;

  const EmployeeTable = ({ data, emptyMessage = "No records found." }) => {
    if (data.length === 0) return <Card className="p-20 text-center">{emptyMessage}</Card>;
    return (
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>DBS</TableHead>
              <TableHead>Induction</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((e) => (
              <TableRow key={e.id} className="hover:bg-[#e6f2ec] cursor-pointer" onClick={() => router.push(`/hrList/${e.id}`)}>
                <TableCell className="font-medium text-[#123d2b]">{e.full_name}</TableCell>
                <TableCell>{e.job_role}</TableCell>
                <TableCell><StatusBadge status={e.dbs_number ? "Valid" : "Missing"} /></TableCell>
                <TableCell><StatusBadge status={e.induction_completed_date ? "Completed" : "Incomplete"} /></TableCell>
                <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={(ev) => downloadEmployeeData(e, ev)}><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/hrList/${e.id}/edit`)}><Edit className="h-4 w-4 text-blue-600" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEmployeeToDelete(e); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };

  if (loading) return <div className="p-10 text-center">Loading Workforce...</div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 min-h-screen space-y-6 ">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-black text-3xl text-[#123d2b]">Workforce Directory</h2>
          <p className="text-[#6b7d74]">Manage employee records and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchEmployees}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
          <Button variant="outline" onClick={exportAllEmployees}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export</Button>
          <Button className="bg-[#1f6b4a]" onClick={() => router.push("/hrList/addEmployee")}><Plus className="mr-2 h-4 w-4" /> Add New Employee</Button>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<ShieldCheck />} value={`${dbsPercent}%`} label="DBS Compliant" />
        <StatCard icon={<AlertCircle />} value={complianceIssuesList.length} label="Compliance Issues" isWarning />
        <StatCard icon={<CalendarClock />} value={expiringContractsList.length} label="Expiring Docs" />
        <StatCard icon={<Users />} value={totalEmployees} label="Total Staff" isPrimary />
      </div> */}

      <Tabs defaultValue="all">
        <TabsList className="bg-[#ece7df]">
          <TabsTrigger value="all">All Staff</TabsTrigger>
          {/* <TabsTrigger value="compliance">Compliance</TabsTrigger> */}
        </TabsList>
        <TabsContent value="all"><EmployeeTable data={employeeList} /></TabsContent>
        {/* <TabsContent value="compliance"><EmployeeTable data={complianceIssuesList} /></TabsContent> */}
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#fbf8f2]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertCircle className="text-red-600" /> Warning</DialogTitle>
            <DialogDescription>
              Permanently delete <b>{employeeToDelete?.full_name}</b> and all their files in <b>employee-docs</b>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm">Type <span className="font-bold text-red-600">DELETE</span> to confirm:</p>
            <Input value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} placeholder="DELETE" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button disabled={deleteConfirmation !== "DELETE" || isDeleting} onClick={handleDeleteEmployee} className="bg-red-600">
              {isDeleting ? <Loader2 className="animate-spin" /> : "Confirm Deletion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

const StatCard = ({ icon, value, label, isPrimary, isWarning }) => (
  <Card className={`p-4 border-[#e1dbd2] ${isPrimary ? 'bg-[#1f6b4a] text-white' : 'bg-white'}`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded ${isWarning ? 'bg-red-100 text-red-600' : 'bg-green-50 text-[#1f6b4a]'}`}>{icon}</div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs opacity-80">{label}</p>
      </div>
    </div>
  </Card>
);

export default AllEmployees;