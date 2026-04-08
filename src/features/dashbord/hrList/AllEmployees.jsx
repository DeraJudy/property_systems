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

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx"; // For spreadsheet export
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
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/superbase/client";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AllEmployees = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("employees").select("*");
    if (!error) setEmployeeList(data || []);
    setLoading(false);
  };

  const exportAllEmployees = () => {
    if (employeeList.length === 0) return;

    // 1. Create headers
    const headers = [
      "Full Name", 
      "Job Role", 
      "Email Address", 
      "Date of Birth", 
      "Start Date", 
      "DBS Number", 
      "Induction Status", 
      "Document Link"
    ];

    // 2. Map data to rows
    const dataRows = employeeList.map((e) => [
      e.full_name,
      e.job_role,
      e.contact_info,
      e.dob,
      e.start_date,
      e.dbs_number || "N/A",
      e.induction_completed_date ? "Completed" : "Incomplete",
      e.photo_id_url || "" // Raw URL for now, will turn into link below
    ]);

    // 3. Construct Worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

    // 4. Convert the "Document Link" column (Index 7 / Column H) into clickable HYPERLINKS
    employeeList.forEach((e, index) => {
      const rowIndex = index + 2; // +1 for header, +1 for 1-based indexing
      const cellAddress = `H${rowIndex}`;
      const url = e.photo_id_url;

      if (url && typeof url === 'string') {
        worksheet[cellAddress] = {
          f: `HYPERLINK("${url}", "View Photo ID")`,
          v: "View Photo ID"
        };
      } else {
        worksheet[cellAddress] = { v: "No File" };
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Directory");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, 
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }
    ];

    XLSX.writeFile(workbook, `Staff_Directory_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadEmployeeData = (employee, ev) => {
    if (ev) ev.stopPropagation();

    const docFields = [
      { label: "Proof of Address", url: employee.evidence_address_url },
      { label: "Photo ID", url: employee.photo_id_url },
      { label: "Application Form", url: employee.signed_app_url },
      { label: "Right to Work", url: employee.rtw_check_url },
      { label: "Insurance/Reg", url: employee.insurance_url },
      { label: "DBS Document", url: employee.dbs_doc_url },
      { label: "Ref 1 Document", url: employee.ref1_doc_url },
      { label: "Ref 2 Document", url: employee.ref2_doc_url },
      { label: "Induction Checklist", url: employee.induction_checklist_url },
      { label: "Training Records", url: employee.training_record_url },
      { label: "Appraisal Docs", url: employee.appraisal_doc_url },
    ];

    const rows = [
      ["--- EMPLOYEE PROFILE ---", "--- DETAILS ---"],
      ["Full Name", employee.full_name],
      ["Email", employee.contact_info],
      ["Job Role", employee.job_role],
      ["Date of Birth", employee.dob],
      ["Start Date", employee.start_date],
      ["", ""],
      ["--- COMPLIANCE ---", "--- STATUS ---"],
      ["DBS Number", employee.dbs_number || "N/A"],
      ["DBS Date", employee.dbs_completion_date || "N/A"],
      ["Induction", employee.induction_completed_date || "Pending"],
      ["", ""],
      ["--- DOCUMENT LINKS ---", "--- CLICK TO OPEN ---"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    docFields.forEach((field) => {
      const label = field.label;
      const url = field.url;
      const nextRow = XLSX.utils.decode_range(worksheet["!ref"]).e.r + 1;
      
      XLSX.utils.sheet_add_aoa(worksheet, [[label]], { origin: `A${nextRow + 1}` });

      if (url && typeof url === 'string') {
        worksheet[`B${nextRow + 1}`] = {
          f: `HYPERLINK("${url}", "View Document")`,
          v: "View Document"
        };
      } else {
        XLSX.utils.sheet_add_aoa(worksheet, [["No file uploaded"]], { origin: `B${nextRow + 1}` });
      }
    });

    worksheet["!cols"] = [{ wch: 25 }, { wch: 60 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
    XLSX.writeFile(workbook, `${employee.full_name.replace(/\s+/g, '_')}_HR_Report.xlsx`);
  };

  const complianceIssuesList = employeeList.filter(e => 
    !e.dbs_number || !e.induction_completed_date || !e.training_record_url
  );

  const expiringContractsList = employeeList.filter(e => e.last_appraisal_date === null); 
  const totalEmployees = employeeList.length;
  const dbsCompliant = employeeList.filter(e => e.dbs_number).length;
  const dbsPercent = totalEmployees ? Math.round((dbsCompliant / totalEmployees) * 100) : 0;

  // Internal Table Component
  const EmployeeTable = ({ data, onDelete, emptyMessage = "No records found." }) => {
    if (data.length === 0) return (
      <Card className="p-20 text-center text-[#6b7d74] bg-[#fbf8f2] border-[#e1dbd2]">{emptyMessage}</Card>
    );

    return (
      <Card className="bg-[#fbf8f2] border-[#e1dbd2] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-[#e1dbd2]">
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>DBS Check</TableHead>
              <TableHead>Induction</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((e) => (
              <TableRow 
                key={e.id} 
                className="hover:bg-[#e6f2ec] cursor-pointer border-[#e1dbd2]" 
                onClick={() => router.push(`/hrList/${e.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-[#e1dbd2]">
                      <AvatarFallback className="bg-[#1f6b4a] text-[#f7f2e9]">
                        {e.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-[#123d2b]">{e.full_name}</p>
                  </div>
                </TableCell>
                <TableCell className="text-[#123d2b] font-medium">{e.job_role}</TableCell>
                <TableCell>
                  <StatusBadge status={e.dbs_number ? "Valid" : "Missing"} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={e.induction_completed_date ? "Completed" : "Incomplete"} />
                </TableCell>
                <TableCell className="text-[#6b7d74] text-xs">{e.contact_info}</TableCell>
                <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={(ev) => downloadEmployeeData(e, ev)}>
                      <Download className="h-4 w-4 text-[#1f6b4a]" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(ev) => {
                        ev.stopPropagation();
                        router.push(`/hrList/${e.id}/edit`);
                      }}
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={async (ev) => {
                        ev.stopPropagation();
                        if (confirm("Delete this record?")) {
                          await supabase.from("employees").delete().eq("id", e.id);
                          onDelete();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };

  if (loading) return <div className="p-10 text-center min-h-screen">Loading...</div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 bg-[#f5f0e6] min-h-screen space-y-6">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* <DataTableHeader 
          title="Workforce Directory" 
          description="Manage employee records, compliance, and training."
        /> */}

        <div>
            <h2 className="font-black text-3xl">Employee Directory</h2>
            <p>Manage employee records, compliance, and training.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="border-[#e1dbd2] text-[#123d2b] hover:bg-[#ece7df]"
            onClick={fetchEmployees}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button 
            variant="outline" 
            className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]"
            onClick={exportAllEmployees}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Staff Data
          </Button>

          <Button 
            className="bg-[#1f6b4a] hover:bg-[#15573c] text-white"
            onClick={() => router.push("/hrList/addEmployee")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<ShieldCheck />} value={`${dbsPercent}%`} label="DBS Compliant" />
        <StatCard icon={<AlertCircle />} value={complianceIssuesList.length} label="Compliance Issues" isWarning={complianceIssuesList.length > 0} />
        <StatCard icon={<CalendarClock />} value={expiringContractsList.length} label="Expiring Docs" />
        <StatCard icon={<Users />} value={totalEmployees} label="Total Staff" isPrimary />
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-[#ece7df] border-[#e1dbd2]">
            <TabsTrigger value="all">All Staff</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Alerts</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <EmployeeTable data={employeeList} onDelete={fetchEmployees} />
          </TabsContent>

          <TabsContent value="compliance">
            <EmployeeTable data={complianceIssuesList} onDelete={fetchEmployees} emptyMessage="No compliance issues found." />
          </TabsContent>

          <TabsContent value="expiring">
            <EmployeeTable data={expiringContractsList} onDelete={fetchEmployees} emptyMessage="No expiring contracts found." />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ icon, value, label, isPrimary, isWarning }) => (
  <Card className={`p-4 border-[#e1dbd2] shadow-sm ${isPrimary ? 'bg-[#1f6b4a] text-white' : 'bg-[#fbf8f2]'}`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${isPrimary ? 'bg-[#ffffff20]' : isWarning ? 'bg-red-100' : 'bg-[#e6f2ec]'}`}>
        {React.cloneElement(icon, { size: 20, className: isPrimary ? 'text-white' : isWarning ? 'text-red-600' : 'text-[#15573c]' })}
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className={`text-xs font-medium ${isPrimary ? 'text-[#f7f2e9cc]' : 'text-[#6b7d74]'}`}>{label}</p>
      </div>
    </div>
  </Card>
);

export default AllEmployees;