// "use client";

// import { useMemo, useRef, useState, useEffect } from "react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import PageBanner from "@/components/dashboard/PageBanner";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import {
//   Folder,
//   FolderPlus,
//   Upload,
//   MoreVertical,
//   Pencil,
//   Trash2,
//   Move,
//   Download,
//   FileText,
//   FileImage,
//   FileSpreadsheet,
//   File as FileIcon,
//   LayoutGrid,
//   List as ListIcon,
//   Search,
//   ChevronRight,
//   UploadCloud,
//   Home as HomeIcon,
//   ArrowLeft,
// } from "lucide-react";

// const ROOT_ID = null; // Supabase uses null for top-level parent_id

// const kindFromName = (name) => {
//   const ext = name.split(".").pop()?.toLowerCase() ?? "";
//   if (["pdf"].includes(ext)) return "pdf";
//   if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
//     return "image";
//   if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
//   if (["doc", "docx", "txt", "md"].includes(ext)) return "doc";
//   return "other";
// };

// const FileTypeIcon = ({ kind, className }) => {
//   const cls = className ?? "h-5 w-5";
//   switch (kind) {
//     case "pdf":
//       return <FileText className={cls} />;
//     case "image":
//       return <FileImage className={cls} />;
//     case "sheet":
//       return <FileSpreadsheet className={cls} />;
//     case "doc":
//       return <FileText className={cls} />;
//     default:
//       return <FileIcon className={cls} />;
//   }
// };

// const formatBytes = (bytes) => {
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// };

// const PreMigrationPage = () => {
//   const supabase = useRef(createClient()).current;

//   const [nodes, setNodes] = useState([]);
//   const [pathStack, setPathStack] = useState([
//     { id: ROOT_ID, name: "Pre-migration" },
//   ]);
//   const [view, setView] = useState("grid");
//   const [search, setSearch] = useState("");
//   const [selectedId, setSelectedId] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Dialog states
//   const [newFolderOpen, setNewFolderOpen] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [renameOpen, setRenameOpen] = useState(false);
//   const [renameTarget, setRenameTarget] = useState(null);
//   const [renameValue, setRenameValue] = useState("");
//   const [moveOpen, setMoveOpen] = useState(false);
//   const [moveTarget, setMoveTarget] = useState(null);
//   const [moveDestination, setMoveDestination] = useState(ROOT_ID);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);
  
//   const currentFolderId = pathStack[pathStack.length - 1].id;

//   const [deleteConfirmText, setDeleteConfirmText] = useState("");

//   // --- Fetch Data ---
//   const fetchNodes = async () => {
//     setLoading(true);
//     let query = supabase
//       .from("files")
//       .select("*")
//       .order("type", { ascending: false }) // Folders first
//       .order("name", { ascending: true });

//     if (currentFolderId === ROOT_ID) {
//       query = query.is("parent_id", null);
//     } else {
//       query = query.eq("parent_id", currentFolderId);
//     }

//     const { data, error } = await query;

//     if (error) {
//       toast.error("Failed to load files");
//     } else {
//       setNodes(data);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchNodes();
//   }, [currentFolderId]);

//   const visibleNodes = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return nodes.filter((n) => (s ? n.name.toLowerCase().includes(s) : true));
//   }, [nodes, search]);

//   const allFolders = useMemo(() => {
//     // We only fetch current folder's nodes, so for "Move", we might need a separate fetch or recursive list
//     // For this UI, we'll allow moving to Root or any sibling folder currently in view
//     return [
//       { id: ROOT_ID, name: "Pre-migration" },
//       ...nodes.filter((n) => n.type === "folder"),
//     ];
//   }, [nodes]);

//   // --- Actions ---
//   const enterFolder = (node) => {
//     setPathStack((p) => [...p, { id: node.id, name: node.name }]);
//     setSelectedId(null);
//   };

//   const goToCrumb = (idx) => {
//     setPathStack((p) => p.slice(0, idx + 1));
//     setSelectedId(null);
//   };

//   const goBack = () => {
//     if (pathStack.length > 1) setPathStack((p) => p.slice(0, -1));
//     setSelectedId(null);
//   };

//   const createFolder = async () => {
//     const name = newFolderName.trim();
//     if (!name) return;

//     const { data: userData } = await supabase.auth.getUser(); // Get user ID

//   const { data, error } = await supabase
//     .from("files")
//     .insert([
//       {
//         name,
//         type: "folder",
//         parent_id: currentFolderId,
//         owner_id: userData?.user?.id, // MUST include this for RLS
//       },
//     ])
//     .select();

//     if (error) {
//       toast.error("Could not create folder");
//     } else {
//       setNodes((prev) => [...data, ...prev]);
//       setNewFolderName("");
//       setNewFolderOpen(false);
//       toast.success(`Folder "${name}" created`);
//     }
//   };

//   const handleFiles = async (fileList) => {
//   if (!fileList || fileList.length === 0) return;

//   const filesArray = Array.from(fileList);
//   const { data: userData } = await supabase.auth.getUser();
//   const userId = userData?.user?.id;

//   setLoading(true);

//   try {
//     for (const file of filesArray) {
//       const relativePath = file.webkitRelativePath; // e.g., "Documents/Invoices/file.pdf"
//       let targetParentId = currentFolderId;

//       // 1. If it's a folder upload, recreate the folder structure in the DB
//       if (relativePath && relativePath.includes("/")) {
//         const pathParts = relativePath.split("/"); 
//         const fileName = pathParts.pop(); // The actual file
//         const foldersInPath = pathParts; // The folder names: ["Documents", "Invoices"]

//         // Traverse/Create folders sequentially
//         for (const folderName of foldersInPath) {
//           // Check if folder already exists in this specific level to avoid duplicates
//           const { data: existingFolder } = await supabase
//             .from("files")
//             .select("id")
//             .eq("name", folderName)
//             .eq("type", "folder")
//             .is("parent_id", targetParentId === ROOT_ID ? null : targetParentId)
//             .single();

//           if (existingFolder) {
//             targetParentId = existingFolder.id;
//           } else {
//             // Create the new folder node
//             const { data: newFolder, error: folderErr } = await supabase
//               .from("files")
//               .insert([{
//                 name: folderName,
//                 type: "folder",
//                 parent_id: targetParentId,
//                 owner_id: userId
//               }])
//               .select()
//               .single();

//             if (folderErr) throw folderErr;
//             targetParentId = newFolder.id;
//           }
//         }
//       }

//       // 2. Prepare Storage Path
//       const cleanFileName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
//       const storagePath = `${targetParentId || "root"}/${Date.now()}-${cleanFileName}`;

//       // 3. Upload to Supabase Storage
//       const { error: storageError } = await supabase.storage
//         .from("migration-assets")
//         .upload(storagePath, file);

//       if (storageError) throw storageError;

//       // 4. Register File in DB under the correct targetParentId
//       const { error: dbError } = await supabase
//         .from("files")
//         .insert([{
//           name: file.name,
//           type: "file",
//           kind: kindFromName(file.name),
//           parent_id: targetParentId,
//           size: formatBytes(file.size),
//           storage_path: storagePath,
//           owner_id: userId,
//         }]);

//       if (dbError) throw dbError;
//     }

//     toast.success("Folder structure uploaded successfully");
//     fetchNodes(); // Refresh the UI to show the new folder/files
//   } catch (err) {
//     console.error(err);
//     toast.error(`Upload failed: ${err.message}`);
//   } finally {
//     setLoading(false);
//   }
// };

//   const onDrop = async (e) => {
//   e.preventDefault();
//   setIsDragging(false);

//   const items = e.dataTransfer.items;
//   if (!items) return;

//   const filesToUpload = [];

//   // Recursive function to get all files from dropped entries
//   const traverseEntry = async (entry, path = "") => {
//     if (entry.isFile) {
//       const file = await new Promise((resolve) => entry.file(resolve));
//       // Manually set webkitRelativePath so the upload logic knows the structure
//       Object.defineProperty(file, 'webkitRelativePath', {
//         value: path + file.name,
//       });
//       filesToUpload.push(file);
//     } else if (entry.isDirectory) {
//       const dirReader = entry.createReader();
//       const entries = await new Promise((resolve) => dirReader.readEntries(resolve));
//       for (const childEntry of entries) {
//         await traverseEntry(childEntry, path + entry.name + "/");
//       }
//     }
//   };

//   // Process all dropped items
//   for (let i = 0; i < items.length; i++) {
//     const entry = items[i].webkitGetAsEntry();
//     if (entry) {
//       await traverseEntry(entry);
//     }
//   }

//   if (filesToUpload.length > 0) {
//     handleFiles(filesToUpload);
//   }
// };

//   const confirmRename = async () => {
//     if (!renameTarget) return;
//     const name = renameValue.trim();

//     const { error } = await supabase
//       .from("files")
//       .update({ name })
//       .eq("id", renameTarget.id);

//     if (error) {
//       toast.error("Rename failed");
//     } else {
//       setNodes(
//         nodes.map((n) => (n.id === renameTarget.id ? { ...n, name } : n)),
//       );
//       setRenameOpen(false);
//       toast.success("Renamed successfully");
//     }
//   };

//   const confirmMove = async () => {
//     if (!moveTarget) return;

//     const { error } = await supabase
//       .from("files")
//       .update({
//         parent_id: moveDestination === "root" ? null : moveDestination,
//       })
//       .eq("id", moveTarget.id);

//     if (error) {
//       toast.error("Move failed");
//     } else {
//       setNodes(nodes.filter((n) => n.id !== moveTarget.id));
//       setMoveOpen(false);
//       toast.success("Item moved");
//     }
//   };

//   const confirmDelete = async () => {
//   if (!deleteTarget || deleteConfirmText !== "DELETE") return;
//   setLoading(true);

//   try {
//     let filesToDelete = [];
//     let recordIdsToDelete = [deleteTarget.id];

//     if (deleteTarget.type === "folder") {
//       // 1. Recursively find all children (files and subfolders)
//       // Note: This matches the "Proper Delete" protocol to prevent orphaned files
//       const { data: descendants, error: fetchErr } = await supabase
//         .rpc('get_all_descendants', { root_id: deleteTarget.id });

//       if (fetchErr) throw fetchErr;

//       if (descendants) {
//         filesToDelete = descendants
//           .filter(d => d.type === 'file' && d.storage_path)
//           .map(d => d.storage_path);
        
//         recordIdsToDelete = [...recordIdsToDelete, ...descendants.map(d => d.id)];
//       }
//     } else if (deleteTarget.storage_path) {
//       filesToDelete = [deleteTarget.storage_path];
//     }

//     // 2. Physical Storage Cleanup (The "Firewall" step)
//     if (filesToDelete.length > 0) {
//       const { error: storageErr } = await supabase.storage
//         .from("migration-assets")
//         .remove(filesToDelete);
      
//       if (storageErr) console.error("Storage cleanup partial failure:", storageErr);
//     }

//     // 3. Database Cleanup
//     // We use in() to catch all collected IDs at once
//     const { error: dbErr } = await supabase
//       .from("files")
//       .delete()
//       .in("id", recordIdsToDelete);

//     if (dbErr) throw dbErr;

//     setNodes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
//     toast.success("Cleanup complete");
//     setDeleteOpen(false);
//     setDeleteConfirmText("");
//   } catch (err) {
//     toast.error(`Operation failed: ${err.message}`);
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleDownload = async (node) => {
//     if (!node.storage_path) return;
//     const { data, error } = await supabase.storage
//       .from("migration-assets")
//       .createSignedUrl(node.storage_path, 60);

//     if (error) toast.error("Download failed");
//     else window.open(data.signedUrl, "_blank");
//   };

//   const itemMenu = (node) => (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-8 w-8 opacity-70 hover:opacity-100"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <MoreVertical className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
//         {node.type === "file" && (
//           <>
//             <DropdownMenuItem onClick={() => handleDownload(node)}>
//               <Download className="mr-2 h-4 w-4" /> Download
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//           </>
//         )}
//         <DropdownMenuItem
//           onClick={() => {
//             setRenameTarget(node);
//             setRenameValue(node.name);
//             setRenameOpen(true);
//           }}
//         >
//           <Pencil className="mr-2 h-4 w-4" /> Rename
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() => {
//             setMoveTarget(node);
//             setMoveOpen(true);
//           }}
//         >
//           <Move className="mr-2 h-4 w-4" /> Move
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//           className="text-destructive focus:text-destructive"
//           onClick={() => {
//             setDeleteTarget(node);
//             setDeleteOpen(true);
//           }}
//         >
//           <Trash2 className="mr-2 h-4 w-4" /> Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );

//   return (
//     <div>
//       <PageBanner
//         title="Pre-migration"
//         subtitle="Stage and organise legacy data before importing into Kenley"
//         category="compliance"
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="space-y-5"
//       >
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground">
//               Pre-migration File Explorer
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               Organise files via Supabase Cloud Storage.
//             </p>
//           </div>
//           <div className="flex flex-wrap items-center gap-2">
//   <Button variant="outline" onClick={() => setNewFolderOpen(true)}>
//     <FolderPlus className="mr-2 h-4 w-4" /> New Folder
//   </Button>
  
//   {/* Folder Upload Button */}
//   <Button variant="outline" onClick={() => folderInputRef.current?.click()}>
//     <Folder className="mr-2 h-4 w-4" /> Upload Folder
//   </Button>

//   <Button onClick={() => fileInputRef.current?.click()}>
//     <Upload className="mr-2 h-4 w-4" /> Upload Files
//   </Button>

//   {/* Standard File Input */}
//   <input
//     ref={fileInputRef}
//     type="file"
//     multiple
//     hidden
//     onChange={(e) => {
//       handleFiles(e.target.files);
//       e.target.value = "";
//     }}
//   />

//   {/* Folder Input - Note the webkitdirectory attribute */}
//   <input
//     ref={folderInputRef}
//     type="file"
//     webkitdirectory="true"
//     multiple
//     hidden
//     onChange={(e) => {
//       handleFiles(e.target.files);
//       e.target.value = "";
//     }}
//   />
// </div>

//         </div>

//         <Card className="p-3 shadow-card">
//           <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-center gap-2 min-w-0">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 shrink-0"
//                 onClick={goBack}
//                 disabled={pathStack.length <= 1}
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>
//               <Breadcrumb className="min-w-0">
//                 <BreadcrumbList>
//                   {pathStack.map((p, i) => {
//                     const isLast = i === pathStack.length - 1;
//                     return (
//                       <span
//                         key={p.id || "root"}
//                         className="flex items-center gap-1.5"
//                       >
//                         <BreadcrumbItem>
//                           {isLast ? (
//                             <BreadcrumbPage className="flex items-center gap-1.5 truncate max-w-[200px]">
//                               {i === 0 && <HomeIcon className="h-3.5 w-3.5" />}
//                               {p.name}
//                             </BreadcrumbPage>
//                           ) : (
//                             <BreadcrumbLink
//                               onClick={() => goToCrumb(i)}
//                               className="flex items-center gap-1.5 cursor-pointer truncate max-w-[160px]"
//                             >
//                               {i === 0 && <HomeIcon className="h-3.5 w-3.5" />}
//                               {p.name}
//                             </BreadcrumbLink>
//                           )}
//                         </BreadcrumbItem>
//                         {!isLast && <BreadcrumbSeparator />}
//                       </span>
//                     );
//                   })}
//                 </BreadcrumbList>
//               </Breadcrumb>
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="relative flex-1 lg:w-72">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   placeholder="Search current folder..."
//                   className="pl-9 h-9"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>
//               <div className="flex items-center rounded-md border border-border p-0.5">
//                 <Button
//                   variant={view === "grid" ? "default" : "ghost"}
//                   size="icon"
//                   className="h-8 w-8"
//                   onClick={() => setView("grid")}
//                 >
//                   <LayoutGrid className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant={view === "list" ? "default" : "ghost"}
//                   size="icon"
//                   className="h-8 w-8"
//                   onClick={() => setView("list")}
//                 >
//                   <ListIcon className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <div
//           onDragOver={(e) => {
//             e.preventDefault();
//             setIsDragging(true);
//           }}
//           onDragLeave={() => setIsDragging(false)}
//           onDrop={onDrop}
//           className="relative min-h-[300px]"
//         >
//           <AnimatePresence>
//             {isDragging && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-sm pointer-events-none"
//               >
//                 <div className="text-center">
//                   <UploadCloud className="h-10 w-10 text-primary mx-auto mb-2" />
//                   <p className="text-sm font-semibold text-foreground">
//                     Drop files to upload to Supabase
//                   </p>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {loading ? (
//             <div className="flex items-center justify-center py-20">
//               <p className="text-muted-foreground animate-pulse">
//                 Connecting to Supabase...
//               </p>
//             </div>
//           ) : visibleNodes.length === 0 ? (
//             <Card className="shadow-card">
//               <div className="flex flex-col items-center justify-center text-center px-6 py-16">
//                 <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-semibold">Folder is empty</h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Start by uploading files or creating subfolders.
//                 </p>
//               </div>
//             </Card>
//           ) : view === "grid" ? (
//             <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
//               {visibleNodes.map((node) => (
//                 // Find this in your Grid view map
//                 <Card
//                   key={node.id}
//                   onClick={() => {
//                     setSelectedId(node.id);
//                     if (node.type === "folder") {
//                       enterFolder(node);
//                     }
//                   }}
//                   className={`group relative p-4 cursor-pointer transition-all hover:-translate-y-0.5 ${
//                     selectedId === node.id
//                       ? "ring-2 ring-primary border-primary"
//                       : "shadow-card"
//                   }`}
//                 >
//                   <div className="absolute top-1.5 right-1.5">
//                     {itemMenu(node)}
//                   </div>
//                   <div className="flex flex-col items-center text-center pt-2">
//                     <div
//                       className={`flex h-14 w-14 items-center justify-center rounded-xl mb-3 ${node.type === "folder" ? "bg-primary/10 text-primary" : "bg-muted text-foreground/70"}`}
//                     >
//                       {node.type === "folder" ? (
//                         <Folder className="h-7 w-7" />
//                       ) : (
//                         <FileTypeIcon kind={node.kind} className="h-7 w-7" />
//                       )}
//                     </div>
//                     <p className="text-xs font-medium text-foreground truncate w-full px-1">
//                       {node.name}
//                     </p>
//                     <p className="text-[10px] text-muted-foreground mt-0.5">
//                       {node.type === "folder" ? "Folder" : node.size}
//                     </p>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <Card className="shadow-card overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead className="w-28">Type</TableHead>
//                     <TableHead className="w-28">Size</TableHead>
//                     <TableHead className="w-12"></TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {visibleNodes.map((node) => (
//                     // Find this in your TableBody map
// <TableRow
//   key={node.id}
//   onClick={() => {
//     setSelectedId(node.id);
//     if (node.type === "folder") {
//       enterFolder(node);
//     }
//   }}
//   className={`cursor-pointer ${selectedId === node.id ? "bg-primary/5" : ""}`}
// >
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           {node.type === "folder" ? (
//                             <Folder className="h-4 w-4 text-primary" />
//                           ) : (
//                             <FileTypeIcon
//                               kind={node.kind}
//                               className="h-4 w-4"
//                             />
//                           )}
//                           <span className="text-sm font-medium">
//                             {node.name}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant="outline"
//                           className="text-[10px] uppercase"
//                         >
//                           {node.type}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-sm text-muted-foreground">
//                         {node.type === "folder" ? "—" : node.size}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {itemMenu(node)}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Card>
//           )}
//         </div>
//       </motion.div>

//       {/* Dialogs: Create Folder */}
//       <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create new folder</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-2 py-4">
//             <Label>Folder name</Label>
//             <Input
//               value={newFolderName}
//               onChange={(e) => setNewFolderName(e.target.value)}
//               autoFocus
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setNewFolderOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={createFolder}>Create</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Dialogs: Rename */}
//       <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Rename Item</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-2 py-4">
//             <Label>New name</Label>
//             <Input
//               value={renameValue}
//               onChange={(e) => setRenameValue(e.target.value)}
//               autoFocus
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setRenameOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={confirmRename}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Dialogs: Move */}
//       <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Move Item</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-2 py-4">
//             <Label>Destination</Label>
//             <Select value={moveDestination} onValueChange={setMoveDestination}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {allFolders
//                   .filter((f) => f.id !== moveTarget?.id)
//                   .map((f) => (
//                     <SelectItem key={f.id || "root"} value={f.id || "root"}>
//                       {f.name}
//                     </SelectItem>
//                   ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setMoveOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={confirmMove}>Move</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Dialogs: Delete */}
//     <Dialog open={deleteOpen} onOpenChange={(open) => {
//   setDeleteOpen(open);
//   if (!open) setDeleteConfirmText(""); // Reset when closed
// }}>
//   <DialogContent>
//     <DialogHeader>
//       <DialogTitle>Delete "{deleteTarget?.name}"?</DialogTitle>
//       <DialogDescription>
//         {deleteTarget?.type === "folder"
//           ? "This will permanently remove this folder, all subfolders, and every file inside from Supabase storage and the database."
//           : "This will permanently remove this file from storage and the database."}
//       </DialogDescription>
//     </DialogHeader>
    
//     <div className="py-4 space-y-2">
//       <Label className="text-destructive">Type <b>DELETE</b> to confirm</Label>
//       <Input 
//         value={deleteConfirmText}
//         onChange={(e) => setDeleteConfirmText(e.target.value)}
//         placeholder="DELETE"
//         className="border-destructive/50 focus-visible:ring-destructive"
//       />
//     </div>

//     <DialogFooter>
//       <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={loading}>
//         Cancel
//       </Button>
//       <Button 
//         variant="destructive" 
//         onClick={confirmDelete} 
//         disabled={loading || deleteConfirmText !== "DELETE"}
//       >
//         {loading ? "Wiping Data..." : "Permanently Delete"}
//       </Button>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>


//     </div>
//   );
// };

// export default PreMigrationPage;


"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/superbase/clientUtils";
import PageBanner from "@/components/dashboard/PageBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Folder,
  FolderPlus,
  Upload,
  MoreVertical,
  Pencil,
  Trash2,
  Move,
  Download,
  FileText,
  FileImage,
  FileSpreadsheet,
  File as FileIcon,
  LayoutGrid,
  List as ListIcon,
  Search,
  UploadCloud,
  Home as HomeIcon,
  ArrowLeft,
  Eye,
  Loader2,
} from "lucide-react";

const ROOT_ID = null;

const kindFromName = (name) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  if (["doc", "docx", "txt", "md"].includes(ext)) return "doc";
  return "other";
};

const FileTypeIcon = ({ kind, className }) => {
  const cls = className ?? "h-5 w-5";
  switch (kind) {
    case "pdf": return <FileText className={cls} />;
    case "image": return <FileImage className={cls} />;
    case "sheet": return <FileSpreadsheet className={cls} />;
    case "doc": return <FileText className={cls} />;
    default: return <FileIcon className={cls} />;
  }
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const PreMigrationPage = () => {
  const supabase = useRef(createClient()).current;

  const [nodes, setNodes] = useState([]);
  const [pathStack, setPathStack] = useState([{ id: ROOT_ID, name: "Pre-migration" }]);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null);
  const [moveDestination, setMoveDestination] = useState(ROOT_ID);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const currentFolderId = pathStack[pathStack.length - 1].id;

  const fetchNodes = async () => {
    setLoading(true);
    let query = supabase
      .from("files")
      .select("*")
      .order("type", { ascending: false })
      .order("name", { ascending: true });

    if (currentFolderId === ROOT_ID) {
      query = query.is("parent_id", null);
    } else {
      query = query.eq("parent_id", currentFolderId);
    }

    const { data, error } = await query;
    if (error) toast.error("Failed to load files");
    else setNodes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNodes();
  }, [currentFolderId]);

  const visibleNodes = useMemo(() => {
    const s = search.trim().toLowerCase();
    return nodes.filter((n) => (s ? n.name.toLowerCase().includes(s) : true));
  }, [nodes, search]);

  const allFolders = useMemo(() => [
    { id: ROOT_ID, name: "Pre-migration" },
    ...nodes.filter((n) => n.type === "folder"),
  ], [nodes]);

  const enterFolder = (node) => {
    setPathStack((p) => [...p, { id: node.id, name: node.name }]);
    setSelectedId(null);
  };

  const goToCrumb = (idx) => {
    setPathStack((p) => p.slice(0, idx + 1));
    setSelectedId(null);
  };

  const goBack = () => {
    if (pathStack.length > 1) setPathStack((p) => p.slice(0, -1));
    setSelectedId(null);
  };

  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    setActionLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("files")
      .insert([{
        name,
        type: "folder",
        parent_id: currentFolderId,
        owner_id: userData?.user?.id,
      }]);

    if (error) toast.error("Could not create folder");
    else {
      toast.success(`Folder "${name}" created`);
      setNewFolderName("");
      setNewFolderOpen(false);
      fetchNodes(); // Refresh
    }
    setActionLoading(false);
  };

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setActionLoading(true);
    const filesArray = Array.from(fileList);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    try {
      for (const file of filesArray) {
        const relativePath = file.webkitRelativePath;
        let targetParentId = currentFolderId;

        if (relativePath && relativePath.includes("/")) {
          const pathParts = relativePath.split("/");
          pathParts.pop(); // remove file name
          for (const folderName of pathParts) {
            const { data: existingFolder } = await supabase
              .from("files")
              .select("id")
              .eq("name", folderName)
              .eq("type", "folder")
              .is("parent_id", targetParentId)
              .single();

            if (existingFolder) targetParentId = existingFolder.id;
            else {
              const { data: newFolder } = await supabase
                .from("files")
                .insert([{ name: folderName, type: "folder", parent_id: targetParentId, owner_id: userId }])
                .select().single();
              targetParentId = newFolder.id;
            }
          }
        }

        const cleanFileName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
        const storagePath = `${targetParentId || "root"}/${Date.now()}-${cleanFileName}`;
        
        await supabase.storage.from("migration-assets").upload(storagePath, file);
        await supabase.from("files").insert([{
          name: file.name,
          type: "file",
          kind: kindFromName(file.name),
          parent_id: targetParentId,
          size: formatBytes(file.size),
          storage_path: storagePath,
          owner_id: userId,
        }]);
      }
      toast.success("Upload complete");
      fetchNodes();
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const items = e.dataTransfer.items;
    if (!items) return;

    const filesToUpload = [];
    const traverseEntry = async (entry, path = "") => {
      if (entry.isFile) {
        const file = await new Promise((res) => entry.file(res));
        Object.defineProperty(file, 'webkitRelativePath', { value: path + file.name });
        filesToUpload.push(file);
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const entries = await new Promise((res) => dirReader.readEntries(res));
        for (const child of entries) await traverseEntry(child, path + entry.name + "/");
      }
    };

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) await traverseEntry(entry);
    }
    if (filesToUpload.length > 0) handleFiles(filesToUpload);
  };

  const confirmRename = async () => {
    if (!renameTarget) return;
    setActionLoading(true);
    const { error } = await supabase.from("files").update({ name: renameValue }).eq("id", renameTarget.id);
    if (error) toast.error("Rename failed");
    else {
      toast.success("Renamed");
      setRenameOpen(false);
      fetchNodes();
    }
    setActionLoading(false);
  };

  const confirmMove = async () => {
    if (!moveTarget) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("files")
      .update({ parent_id: moveDestination === "root" ? null : moveDestination })
      .eq("id", moveTarget.id);

    if (error) toast.error("Move failed");
    else {
      toast.success("Item moved");
      setMoveOpen(false);
      fetchNodes();
    }
    setActionLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteConfirmText !== "DELETE") return;
    setActionLoading(true);
    try {
      let filesToDelete = [];
      let recordIdsToDelete = [deleteTarget.id];

      if (deleteTarget.type === "folder") {
        const { data: descendants } = await supabase.rpc('get_all_descendants', { root_id: deleteTarget.id });
        if (descendants) {
          filesToDelete = descendants.filter(d => d.type === 'file' && d.storage_path).map(d => d.storage_path);
          recordIdsToDelete = [...recordIdsToDelete, ...descendants.map(d => d.id)];
        }
      } else if (deleteTarget.storage_path) {
        filesToDelete = [deleteTarget.storage_path];
      }

      if (filesToDelete.length > 0) await supabase.storage.from("migration-assets").remove(filesToDelete);
      await supabase.from("files").delete().in("id", recordIdsToDelete);

      toast.success("Cleanup complete");
      setDeleteOpen(false);
      setDeleteConfirmText("");
      fetchNodes();
    } catch (err) {
      toast.error(`Operation failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (node) => {
    if (!node.storage_path) return;
    try {
      const { data, error } = await supabase.storage.from("migration-assets").download(node.storage_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = node.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const handleView = async (node) => {
    if (!node.storage_path) return;
    const { data } = await supabase.storage.from("migration-assets").createSignedUrl(node.storage_path, 60);
    if (data) window.open(data.signedUrl, "_blank");
  };

  const itemMenu = (node) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {node.type === "file" && (
          <>
            <DropdownMenuItem onClick={() => handleView(node)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload(node)}>
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => { setRenameTarget(node); setRenameValue(node.name); setRenameOpen(true); }}>
          <Pencil className="mr-2 h-4 w-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setMoveTarget(node); setMoveOpen(true); }}>
          <Move className="mr-2 h-4 w-4" /> Move
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { setDeleteTarget(node); setDeleteOpen(true); }}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div>
      <PageBanner title="Pre-migration" subtitle="Stage and organise legacy data" category="compliance" />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pre-migration File Explorer</h1>
            <p className="text-sm text-muted-foreground">Upload, organise and review files prior to migration cutover.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setNewFolderOpen(true)} disabled={actionLoading}>
              <FolderPlus className="mr-2 h-4 w-4" /> New Folder
            </Button>
            <Button variant="outline" onClick={() => folderInputRef.current?.click()} disabled={actionLoading}>
              <Folder className="mr-2 h-4 w-4" /> Upload Folder
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {actionLoading ? "Processing..." : "Upload Files"}
            </Button>
            <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
            <input ref={folderInputRef} type="file" webkitdirectory="true" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
          </div>
        </div>

        <Card className="p-3 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={goBack} disabled={pathStack.length <= 1}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Breadcrumb className="min-w-0">
                <BreadcrumbList>
                  {pathStack.map((p, i) => (
                    <span key={p.id || "root"} className="flex items-center gap-1.5">
                      <BreadcrumbItem>
                        {i === pathStack.length - 1 ? (
                          <BreadcrumbPage className="flex items-center gap-1.5 truncate max-w-[200px]">
                            {i === 0 && <HomeIcon className="h-3.5 w-3.5" />}{p.name}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink onClick={() => goToCrumb(i)} className="flex items-center gap-1.5 cursor-pointer truncate max-w-[160px]">
                            {i === 0 && <HomeIcon className="h-3.5 w-3.5" />}{p.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {i !== pathStack.length - 1 && <BreadcrumbSeparator />}
                    </span>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search current folder..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex items-center rounded-md border p-0.5">
                <Button variant={view === "grid" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}><LayoutGrid className="h-4 w-4" /></Button>
                <Button variant={view === "list" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("list")}><ListIcon className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </Card>

        <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop} className="relative min-h-[400px]">
          <AnimatePresence>
            {isDragging && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-sm pointer-events-none">
                <div className="text-center">
                  <UploadCloud className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Drop to upload to Supabase</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Syncing with storage...</p>
            </div>
          ) : visibleNodes.length === 0 ? (
            <Card className="flex flex-col items-center justify-center text-center px-6 py-20 shadow-card">
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Folder is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">Start by uploading files or folders here.</p>
            </Card>
          ) : view === "grid" ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {visibleNodes.map((node) => (
                <Card key={node.id} onClick={() => { setSelectedId(node.id); if (node.type === "folder") enterFolder(node); }} className={`group relative p-4 cursor-pointer transition-all hover:shadow-md ${selectedId === node.id ? "ring-2 ring-primary border-primary" : "shadow-card"}`}>
                  <div className="absolute top-1 right-1">{itemMenu(node)}</div>
                  <div className="flex flex-col items-center text-center pt-2">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl mb-3 ${node.type === "folder" ? "bg-primary/10 text-primary" : "bg-muted text-foreground/70"}`}>
                      {node.type === "folder" ? <Folder className="h-7 w-7" /> : <FileTypeIcon kind={node.kind} className="h-7 w-7" />}
                    </div>
                    <p className="text-xs font-medium truncate w-full px-1">{node.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{node.type === "folder" ? "Folder" : node.size}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead className="w-28">Type</TableHead><TableHead className="w-28">Size</TableHead><TableHead className="w-12"></TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {visibleNodes.map((node) => (
                    <TableRow key={node.id} onClick={() => { setSelectedId(node.id); if (node.type === "folder") enterFolder(node); }} className={`cursor-pointer ${selectedId === node.id ? "bg-primary/5" : ""}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {node.type === "folder" ? <Folder className="h-4 w-4 text-primary" /> : <FileTypeIcon kind={node.kind} className="h-4 w-4" />}
                          <span className="text-sm font-medium">{node.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] uppercase font-mono">{node.type}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{node.type === "folder" ? "—" : node.size}</TableCell>
                      <TableCell className="text-right">{itemMenu(node)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Dialogs */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create new folder</DialogTitle></DialogHeader>
          <div className="space-y-2 py-4"><Label>Folder name</Label><Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={createFolder} disabled={actionLoading}>{actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Item</DialogTitle></DialogHeader>
          <div className="space-y-2 py-4"><Label>New name</Label><Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={confirmRename} disabled={actionLoading}>{actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Move Item</DialogTitle></DialogHeader>
          <div className="space-y-2 py-4">
            <Label>Destination</Label>
            <Select value={moveDestination} onValueChange={setMoveDestination}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{allFolders.filter(f => f.id !== moveTarget?.id).map(f => <SelectItem key={f.id || "root"} value={f.id || "root"}>{f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={confirmMove} disabled={actionLoading}>{actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleteConfirmText(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{deleteTarget?.name}"?</DialogTitle>
            <DialogDescription>{deleteTarget?.type === "folder" ? "Permanently removes this folder and all contents." : "Permanently removes this file from storage."}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label className="text-destructive font-semibold">Type DELETE to confirm</Label>
            <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" className="border-destructive/50" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading || deleteConfirmText !== "DELETE"}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {actionLoading ? "Wiping Data..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreMigrationPage;