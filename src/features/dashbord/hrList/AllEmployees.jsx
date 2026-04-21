

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
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
  Loader2, Search
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

import PageBanner from "@/components/dashboard/PageBanner";

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

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("employees").select("*");
    if (!error) setEmployeeList(data || []);
    setLoading(false);
  };

  // --- Search Filtering Logic ---
const filteredEmployees = employeeList.filter((employee) => {
  const searchLower = searchTerm.toLowerCase();
  return (
    employee.full_name?.toLowerCase().includes(searchLower) ||
    employee.job_role?.toLowerCase().includes(searchLower) ||
    employee.email_address?.toLowerCase().includes(searchLower)
  );
});

  const getAllFiles = async (folder) => {
  // 🚨 HARD GUARD (this fixes your error)
  if (!folder || typeof folder !== "string" || folder.trim() === "") {
    throw new Error("Invalid folder path passed to Supabase");
  }

  const { data, error } = await supabase.storage
    .from("employee-docs")
    .list(folder);

  if (error) throw error;

  let files = [];

  for (const item of data) {
    const fullPath = `${folder}/${item.name}`;

    if (item.metadata) {
      files.push(fullPath);
    } else {
      const nested = await getAllFiles(fullPath);
      files = files.concat(nested);
    }
  }

  return files;
};

  const getAllFilesFlat = async (folderName) => {
  const { data, error } = await supabase.storage
    .from("employee-docs")
    .list("", {
      limit: 1000
    });

  if (error) throw error;

  // 🔥 filter EVERYTHING under folder
  return data
    .map(item => item.name)
    .filter(name => name.startsWith(folderName + "/"));
};


const handleDeleteEmployee = async () => {
  if (deleteConfirmation !== "DELETE" || !employeeToDelete) return;

  setIsDeleting(true);
  try {
    // 1. Collect all storage paths
    const pathsToDelete = [];

    // Fields that contain URLs
    const storageFields = [
      "evidence_address_url",
      "photo_id_url",
      "signed_app_url",
      "rtw_check_url",
      "insurance_url",
      "dbs_doc_url",
      "ref1_doc_url",
      "ref2_doc_url",
      "induction_checklist_url",
      "training_record_url",
      "appraisal_doc_url"
    ];

    // Function to extract relative path from a full Supabase URL
    const getCleanPath = (url) => {
      if (!url) return null;
      try {
        // If it's a full URL, split it to get the path after the bucket name
        if (url.includes("/employee-docs/")) {
          const path = url.split("/employee-docs/")[1];
          return decodeURIComponent(path); // Fixes spaces/special chars
        }
        // If it's already a relative path, just decode it
        return decodeURIComponent(url);
      } catch (e) {
        return null;
      }
    };

    // Process Single Fields
    storageFields.forEach((field) => {
      const path = getCleanPath(employeeToDelete[field]);
      if (path) pathsToDelete.push(path);
    });

    // Process Array Fields (Qualifications, Supervisions, etc.)
    [
      ...(employeeToDelete.qualifications || []),
      ...(employeeToDelete.supervisions || []),
      ...(employeeToDelete.other_documents || [])
    ].forEach(doc => {
      const path = getCleanPath(doc.file_path || doc.url);
      if (path) pathsToDelete.push(path);
    });

    // 2. Storage Cleanup (Must happen before DB delete)
    if (pathsToDelete.length > 0) {
      console.log("Attempting to delete files:", pathsToDelete);
      
      const { error: storageError } = await supabase.storage
        .from("employee-docs")
        .remove(pathsToDelete);
        
      if (storageError) {
        console.error("Storage cleanup warning:", storageError.message);
        // We continue anyway so the DB record can be removed
      }
    }

    // 3. Database Delete
    const { error: dbError } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeToDelete.id);

    if (dbError) throw dbError;

    // UI Updates
    toast.success("Employee and all associated files removed");
    setEmployeeToDelete(null);
    setDeleteConfirmation("");
    setIsDeleteDialogOpen(false);
    
    // Refresh the table
    if (typeof fetchEmployees === "function") {
      fetchEmployees();
    }

  } catch (err) {
    console.error("Deletion Error:", err);
    toast.error("Could not complete deletion");
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
  
  const handleDownloadAll = async (employee) => {
  const toastId = toast.loading(`Preparing documents for ${employee.full_name}...`);
  
  try {
    const zip = new JSZip();
    const folder = zip.folder(`${employee.full_name}_Documents`);
    const spreadsheetData = [];

    // 1. List all files in the employee's storage folder
    // Based on your AddEmployee.jsx code, path is: employeeId/category/filename
    const { data: categories, error: listError } = await supabase
      .storage
      .from("employee-docs")
      .list(employee.id.toString());

    if (listError) throw listError;

    // 2. Loop through categories (Staff Documents, Qualifications, etc.)
    for (const cat of categories) {
      const { data: files } = await supabase
        .storage
        .from("employee-docs")
        .list(`${employee.id}/${cat.name}`);

      if (files) {
        for (const file of files) {
          const filePath = `${employee.id}/${cat.name}/${file.name}`;
          
          // Download file blob
          const { data: blob, error: downloadError } = await supabase
            .storage
            .from("employee-docs")
            .download(filePath);

          if (blob) {
            // Add to ZIP folder
            folder.file(`${cat.name}/${file.name}`, blob);

            // Get Public URL for the spreadsheet
            const { data: urlData } = supabase
              .storage
              .from("employee-docs")
              .getPublicUrl(filePath);

            spreadsheetData.push({
              Category: cat.name,
              FileName: file.name,
              OnlineViewLink: urlData.publicUrl
            });
          }
        }
      }
    }

    // 3. Create the Spreadsheet
    const ws = XLSX.utils.json_to_sheet(spreadsheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Document Links");
    
    // Convert workbook to buffer
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    folder.file("Document_Index_Links.xlsx", excelBuffer);

    // 4. Generate and save the ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${employee.full_name}_All_Docs.zip`);
    
    toast.success("Download complete!", { id: toastId });
  } catch (error) {
    console.error("Error generating bundle:", error);
    toast.error("Failed to bundle documents.", { id: toastId });
  }
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
    <Card className="bg-[#FFFDD0]  border-[#e1dbd2] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Arranged Header: Only Name and Actions */}
            <TableHead className="font-bold text-black">Employee</TableHead>
            <TableHead className="text-right font-bold text-[#123d2b]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((e) => (
            <TableRow key={e.id} className="hover:bg-[#e6f2ec] cursor-pointer" onClick={() => router.push(`/hrList/${e.id}`)}>
              <TableCell className="font-medium text-black">{e.full_name}</TableCell>
              
              <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                <div className="flex justify-end gap-1">
                  {/* <Button variant="ghost" size="sm" onClick={(ev) => downloadEmployeeData(e, ev)}>
                    <Download className="h-4 w-4" />
                  </Button> */}
                  <Button 
  variant="outline" 
  size="sm" 
  onClick={(ev) => {
    ev.stopPropagation(); // Prevents the row click (navigation) from firing
    handleDownloadAll(e);  // Passes the employee object 'e'
  }}
  className="flex items-center gap-2 border-[#123d2b] text-[#123d2b] hover:bg-[#123d2b] hover:text-white"
>
  <Download className="h-4 w-4" />
</Button>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/hrList/${e.id}/edit`)}>
                    <Edit className="h-4 w-4 text-black " />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEmployeeToDelete(e); setIsDeleteDialogOpen(true); }}>
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

  if (loading) return <div className="p-10 text-center">Loading Workforce...</div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 min-h-screen space-y-6 ">

      <PageBanner title="Workforce Directory" subtitle="Manage employee records and compliance" category="hr" />

      <div className="flex justify-between items-center">
        {/* <div>
          <h2 className="font-black text-3xl text-black">Workforce Directory</h2>
          <p className="text-[#6b7d74]">Manage employee records and compliance</p>
        </div> */}
        <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-black/10 bg-white focus:ring-black"
                  />
                </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchEmployees}><RefreshCw className="mr-2 h-4 w-4 bg-[#FFFDD0] " /> Refresh</Button>
          <Button variant="outline" onClick={exportAllEmployees}><FileSpreadsheet className="mr-2 h-4 w-4 bg-[#FFFDD0] " /> Export</Button>
          <Button className="bg-black text-white hover:bg-[#123d2b]" onClick={() => router.push("/hrList/addEmployee")}><Plus className="mr-2 h-4 w-4" /> Add New Employee</Button>
        </div>
      </div>


      <Tabs defaultValue="all">
        <TabsList className="bg-[#ece7df]">
          <TabsTrigger className="bg-[#FFFDD0]" value="all">All Staff</TabsTrigger>
          {/* <TabsTrigger value="compliance">Compliance</TabsTrigger> */}
        </TabsList>
        <TabsContent value="all">
  {/* Pass the filtered list here instead of employeeList */}
  <EmployeeTable 
    data={filteredEmployees} 
    emptyMessage={searchTerm ? `No employees found matching "${searchTerm}"` : "No records found."} 
  />
</TabsContent>
        {/* <TabsContent value="all"><EmployeeTable data={employeeList} /></TabsContent> */}
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