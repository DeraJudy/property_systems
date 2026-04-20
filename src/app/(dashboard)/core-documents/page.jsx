// "use client";

// import { useMemo, useRef, useState, useEffect } from "react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import PageBanner from "@/components/dashboard/PageBanner";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import { Folder, FolderPlus, Upload, MoreVertical, Pencil, Trash2, Move, Download, FileText, FileImage, FileSpreadsheet, File as FileIcon, Search, ArrowLeft, Eye, Loader2 } from "lucide-react";

// const ROOT_ID = null;

// const kindFromName = (name) => {
//   const ext = name.split(".").pop()?.toLowerCase() ?? "";
//   if (["pdf"].includes(ext)) return "pdf";
//   if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
//   if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
//   if (["doc", "docx", "txt", "md"].includes(ext)) return "doc";
//   return "other";
// };

// const FileTypeIcon = ({ kind, className }) => {
//   const cls = className ?? "h-5 w-5";
//   switch (kind) {
//     case "pdf": return <FileText className={cls} />;
//     case "image": return <FileImage className={cls} />;
//     case "sheet": return <FileSpreadsheet className={cls} />;
//     case "doc": return <FileText className={cls} />;
//     default: return <FileIcon className={cls} />;
//   }
// };

// const formatBytes = (bytes) => {
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// };

// const CoreDocumentPage = () => {
//   const supabase = useRef(createClient()).current;
//   const [nodes, setNodes] = useState([]);
//   const [pathStack, setPathStack] = useState([{ id: ROOT_ID, name: "Core Documents" }]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   // Modal States
//   const [newFolderOpen, setNewFolderOpen] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleteConfirmText, setDeleteConfirmText] = useState("");
//   const [renameOpen, setRenameOpen] = useState(false);
//   const [renameTarget, setRenameTarget] = useState(null);
//   const [renameValue, setRenameValue] = useState("");
//   const [moveOpen, setMoveOpen] = useState(false);
//   const [moveTarget, setMoveTarget] = useState(null);
//   const [moveDestination, setMoveDestination] = useState("root");

//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);
//   const currentFolderId = pathStack[pathStack.length - 1].id;

//   const fetchNodes = async () => {
//     setLoading(true);
//     let query = supabase.from("coredocuments").select("*").order("type", { ascending: false }).order("name", { ascending: true });
//     if (currentFolderId === ROOT_ID) query = query.is("parent_id", null);
//     else query = query.eq("parent_id", currentFolderId);
//     const { data, error } = await query;
//     if (!error) setNodes(data || []);
//     setLoading(false);
//   };

//   useEffect(() => { fetchNodes(); }, [currentFolderId]);

//   const visibleNodes = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return nodes.filter((n) => (s ? n.name.toLowerCase().includes(s) : true));
//   }, [nodes, search]);

//   const createFolder = async () => {
//     const name = newFolderName.trim();
//     if (!name) return;
//     setActionLoading(true);
//     const { data: userData } = await supabase.auth.getUser();
//     const { error } = await supabase.from("coredocuments").insert([{ name, type: "folder", parent_id: currentFolderId, owner_id: userData?.user?.id }]);
//     if (error) toast.error("Creation failed");
//     else { toast.success("Folder created"); setNewFolderName(""); setNewFolderOpen(false); fetchNodes(); }
//     setActionLoading(false);
//   };

//   const handleFiles = async (fileList) => {
//     if (!fileList || fileList.length === 0) return;
//     setActionLoading(true);
//     const { data: userData } = await supabase.auth.getUser();
//     const userId = userData?.user?.id;

//     try {
//       for (const file of Array.from(fileList)) {
//         // Handle folder structure if webkitRelativePath is available
//         const pathParts = file.webkitRelativePath ? file.webkitRelativePath.split("/") : [];
//         let targetParentId = currentFolderId;

//         if (pathParts.length > 1) {
//           // This loop creates the necessary folder structure for "Upload Folder"
//           for (let i = 0; i < pathParts.length - 1; i++) {
//             const folderName = pathParts[i];
//             const { data: existing } = await supabase.from("coredocuments")
//               .select("id").eq("name", folderName).eq("type", "folder")
//               .eq(targetParentId ? "parent_id" : "parent_id", targetParentId).maybeSingle();

//             if (existing) {
//               targetParentId = existing.id;
//             } else {
//               const { data: created } = await supabase.from("coredocuments")
//                 .insert([{ name: folderName, type: "folder", parent_id: targetParentId, owner_id: userId }])
//                 .select().single();
//               targetParentId = created.id;
//             }
//           }
//         }

//         const cleanName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
//         const storagePath = `core/${targetParentId || "root"}/${Date.now()}-${cleanName}`;
//         await supabase.storage.from("core-assets").upload(storagePath, file);

//         await supabase.from("coredocuments").insert([{ 
//           name: file.name, type: "file", kind: kindFromName(file.name), 
//           parent_id: targetParentId, size: formatBytes(file.size), 
//           storage_path: storagePath, owner_id: userId 
//         }]);
//       }
//       toast.success("Sync complete");
//       fetchNodes();
//     } catch (err) { toast.error("Process failed"); }
//     finally { setActionLoading(false); }
//   };

//   const confirmRename = async () => {
//     if (!renameValue.trim() || !renameTarget) return;
//     setActionLoading(true);
//     const { error } = await supabase.from("coredocuments").update({ name: renameValue.trim() }).eq("id", renameTarget.id);
//     if (error) toast.error("Rename failed");
//     else { toast.success("Updated"); setRenameOpen(false); fetchNodes(); }
//     setActionLoading(false);
//   };

//   const confirmMove = async () => {
//     if (!moveTarget) return;
//     setActionLoading(true);
//     const destId = moveDestination === "root" ? null : moveDestination;
//     const { error } = await supabase.from("coredocuments").update({ parent_id: destId }).eq("id", moveTarget.id);
//     if (error) toast.error("Move failed");
//     else { toast.success("Moved"); setMoveOpen(false); fetchNodes(); }
//     setActionLoading(false);
//   };

//   const confirmDelete = async () => {
//     if (!deleteTarget || deleteConfirmText !== "DELETE") return;
//     setActionLoading(true);
//     try {
//       let files = [];
//       let ids = [deleteTarget.id];
//       if (deleteTarget.type === "folder") {
//         const { data: descendants } = await supabase.rpc('get_core_descendants', { root_id: deleteTarget.id });
//         if (descendants) {
//           files = descendants.filter(d => d.type === 'file' && d.storage_path).map(d => d.storage_path);
//           ids = [...ids, ...descendants.map(d => d.id)];
//         }
//       } else if (deleteTarget.storage_path) files = [deleteTarget.storage_path];

//       if (files.length > 0) await supabase.storage.from("core-assets").remove(files);
//       await supabase.from("coredocuments").delete().in("id", ids);
//       toast.success("Deleted");
//       setDeleteOpen(false); setDeleteConfirmText(""); fetchNodes();
//     } catch (err) { toast.error("Delete failed"); }
//     finally { setActionLoading(false); }
//   };

//   const handleView = async (node) => {
//     if (!node.storage_path) return;
//     const { data } = await supabase.storage.from("core-assets").createSignedUrl(node.storage_path, 3600);
//     if (data) window.open(data.signedUrl, "_blank");
//   };

//   return (
//     <div className="p-6">
//       <PageBanner title="Core Documents" subtitle="Centralized Compliance Files" category="compliance" />
      
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 mt-6">
//           <h1 className="text-2xl font-bold">Document Explorer</h1>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => setNewFolderOpen(true)}><FolderPlus className="mr-2 h-4 w-4" /> New Folder</Button>
//             <Button variant="outline" onClick={() => folderInputRef.current?.click()}><Folder className="mr-2 h-4 w-4" /> Upload Folder</Button>
//             <Button onClick={() => fileInputRef.current?.click()} disabled={actionLoading}>
//                 {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Upload Files
//             </Button>
//             <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
//             <input ref={folderInputRef} type="file" webkitdirectory="" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
//           </div>
//       </div>

//       <Card className="p-3 mb-4">
//         <div className="flex items-center justify-between">
//            <div className="flex items-center gap-2">
//              <Button variant="ghost" size="icon" onClick={() => setPathStack(p => p.slice(0, -1))} disabled={pathStack.length <= 1}><ArrowLeft className="h-4 w-4" /></Button>
//              <Breadcrumb>
//                 <BreadcrumbList>
//                   {pathStack.map((p, i) => (
//                     <span key={i} className="flex items-center gap-1.5">
//                       <BreadcrumbItem className="cursor-pointer" onClick={() => setPathStack(pathStack.slice(0, i+1))}>
//                         {i === pathStack.length - 1 ? <BreadcrumbPage>{p.name}</BreadcrumbPage> : <BreadcrumbLink>{p.name}</BreadcrumbLink>}
//                       </BreadcrumbItem>
//                       {i !== pathStack.length - 1 && <BreadcrumbSeparator />}
//                     </span>
//                   ))}
//                 </BreadcrumbList>
//              </Breadcrumb>
//            </div>
//            <div className="relative">
//              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//              <Input placeholder="Search documents..." className="pl-9 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
//            </div>
//         </div>
//       </Card>

//       {loading ? (
//         <div className="flex flex-col items-center py-20 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mb-4" /> Syncing...</div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {visibleNodes.map(node => (
//             <Card key={node.id} onClick={() => node.type === "folder" ? setPathStack(p => [...p, { id: node.id, name: node.name }]) : handleView(node)} 
//                   className="p-4 relative cursor-pointer hover:shadow-md transition-all group border-none bg-muted/30">
//                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
//                     <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
//                         <DropdownMenuItem onClick={() => { setRenameTarget(node); setRenameValue(node.name); setRenameOpen(true); }}><Pencil className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => { setMoveTarget(node); setMoveOpen(true); }}><Move className="mr-2 h-4 w-4" /> Move</DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => { setDeleteTarget(node); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                </div>
//                <div className="flex flex-col items-center text-center">
//                   <div className={`h-12 w-12 flex items-center justify-center rounded-xl mb-2 ${node.type === 'folder' ? 'bg-primary/10 text-primary' : 'bg-background shadow-sm'}`}>
//                     {node.type === 'folder' ? <Folder className="h-6 w-6" /> : <FileTypeIcon kind={node.kind} />}
//                   </div>
//                   <span className="text-xs font-medium truncate w-full">{node.name}</span>
//                </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Rename Dialog */}
//       <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Rename Item</DialogTitle></DialogHeader>
//           <div className="py-4 space-y-2">
//             <Label>New Name</Label>
//             <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
//             <Button onClick={confirmRename} disabled={actionLoading}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Move Dialog */}
//       <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Move Item</DialogTitle></DialogHeader>
//           <div className="py-4 space-y-2">
//             <Label>Target Folder</Label>
//             <Select value={moveDestination} onValueChange={setMoveDestination}>
//               <SelectTrigger><SelectValue /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="root">Core Documents (Root)</SelectItem>
//                 {nodes.filter(n => n.type === 'folder' && n.id !== moveTarget?.id).map(f => (
//                   <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setMoveOpen(false)}>Cancel</Button>
//             <Button onClick={confirmMove} disabled={actionLoading}>Move</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Modal */}
//       <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle><DialogDescription>This removes "{deleteTarget?.name}" and all contents permanently. Type <b>DELETE</b> to proceed.</DialogDescription></DialogHeader>
//           <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" className="border-destructive" />
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
//             <Button variant="destructive" disabled={deleteConfirmText !== 'DELETE' || actionLoading} onClick={confirmDelete}>Wipe Data</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default CoreDocumentPage;

"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/superbase/clientUtils";
import PageBanner from "@/components/dashboard/PageBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Folder, FolderPlus, Upload, MoreVertical, Pencil, Trash2, Move, FileText, FileImage, FileSpreadsheet, File as FileIcon, Search, ArrowLeft, Loader2, UploadCloud } from "lucide-react";

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

const CoreDocumentPage = () => {
  const supabase = useRef(createClient()).current;
  const [nodes, setNodes] = useState([]);
  const [pathStack, setPathStack] = useState([{ id: ROOT_ID, name: "Core Documents" }]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Modal States
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null);
  const [moveDestination, setMoveDestination] = useState("root");

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const currentFolderId = pathStack[pathStack.length - 1].id;

  const fetchNodes = async () => {
    setLoading(true);
    let query = supabase.from("coredocuments").select("*").order("type", { ascending: false }).order("name", { ascending: true });
    if (currentFolderId === ROOT_ID) query = query.is("parent_id", null);
    else query = query.eq("parent_id", currentFolderId);
    const { data, error } = await query;
    if (!error) setNodes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNodes(); }, [currentFolderId]);

  const visibleNodes = useMemo(() => {
    const s = search.trim().toLowerCase();
    return nodes.filter((n) => (s ? n.name.toLowerCase().includes(s) : true));
  }, [nodes, search]);

  // FIX: CREATE NEW FOLDER (ANTI-DUPLICATE)
  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    setActionLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    
    // Check if folder exists
    const { data: existing } = await supabase.from("coredocuments").select("id").eq("name", name).eq("type", "folder").eq(currentFolderId ? "parent_id" : "parent_id", currentFolderId).maybeSingle();

    if (existing) {
      toast.error("A folder with this name already exists here.");
    } else {
      const { error } = await supabase.from("coredocuments").insert([{ name, type: "folder", parent_id: currentFolderId, owner_id: userData?.user?.id }]);
      if (error) toast.error("Creation failed");
      else { toast.success("Folder created"); setNewFolderName(""); setNewFolderOpen(false); fetchNodes(); }
    }
    setActionLoading(false);
  };

  // FIX: UPLOAD LOGIC (ANTI-DUPLICATE + MULTI-FOLDER)
  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setActionLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    try {
      for (const file of Array.from(fileList)) {
        const pathParts = file.webkitRelativePath ? file.webkitRelativePath.split("/") : [];
        let targetParentId = currentFolderId;

        // Traverse/Create folder structure
        if (pathParts.length > 1) {
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            
            let query = supabase.from("coredocuments").select("id").eq("name", folderName).eq("type", "folder");
            if (targetParentId === null) query = query.is("parent_id", null);
            else query = query.eq("parent_id", targetParentId);
            
            const { data: existing } = await query.maybeSingle();

            if (existing) {
              targetParentId = existing.id;
            } else {
              const { data: created } = await supabase.from("coredocuments")
                .insert([{ name: folderName, type: "folder", parent_id: targetParentId, owner_id: userId }])
                .select().single();
              targetParentId = created.id;
            }
          }
        }

        // Check if file exists in the target folder
        const cleanName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
        let fileQuery = supabase.from("coredocuments").select("id").eq("name", file.name).eq("type", "file");
        if (targetParentId === null) fileQuery = fileQuery.is("parent_id", null);
        else fileQuery = fileQuery.eq("parent_id", targetParentId);
        
        const { data: existingFile } = await fileQuery.maybeSingle();

        if (existingFile) {
           console.log(`Skipping duplicate file: ${file.name}`);
           continue; 
        }

        const storagePath = `core/${targetParentId || "root"}/${Date.now()}-${cleanName}`;
        await supabase.storage.from("core-assets").upload(storagePath, file);

        await supabase.from("coredocuments").insert([{ 
          name: file.name, type: "file", kind: kindFromName(file.name), 
          parent_id: targetParentId, size: formatBytes(file.size), 
          storage_path: storagePath, owner_id: userId 
        }]);
      }
      toast.success("Sync complete");
      fetchNodes();
    } catch (err) { toast.error("Process failed"); }
    finally { setActionLoading(false); }
  };

  // DRAG AND DROP HANDLERS
  const onDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const items = e.dataTransfer.items;
    if (!items) return;

    const filesToUpload = [];
    const traverse = async (entry, path = "") => {
      if (entry.isFile) {
        const file = await new Promise((res) => entry.file(res));
        // Manually set path to simulate folder upload structure
        Object.defineProperty(file, 'webkitRelativePath', {
          value: path + file.name,
          writable: false
        });
        filesToUpload.push(file);
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise((res) => reader.readEntries(res));
        for (const child of entries) {
          await traverse(child, path + entry.name + "/");
        }
      }
    };

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) await traverse(entry);
    }

    if (filesToUpload.length > 0) handleFiles(filesToUpload);
  };

  const confirmRename = async () => {
    if (!renameValue.trim() || !renameTarget) return;
    setActionLoading(true);
    const { error } = await supabase.from("coredocuments").update({ name: renameValue.trim() }).eq("id", renameTarget.id);
    if (error) toast.error("Rename failed");
    else { toast.success("Updated"); setRenameOpen(false); fetchNodes(); }
    setActionLoading(false);
  };

  const confirmMove = async () => {
    if (!moveTarget) return;
    setActionLoading(true);
    const destId = moveDestination === "root" ? null : moveDestination;
    const { error } = await supabase.from("coredocuments").update({ parent_id: destId }).eq("id", moveTarget.id);
    if (error) toast.error("Move failed");
    else { toast.success("Moved"); setMoveOpen(false); fetchNodes(); }
    setActionLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteConfirmText !== "DELETE") return;
    setActionLoading(true);
    try {
      let files = [];
      let ids = [deleteTarget.id];
      if (deleteTarget.type === "folder") {
        const { data: descendants } = await supabase.rpc('get_core_descendants', { root_id: deleteTarget.id });
        if (descendants) {
          files = descendants.filter(d => d.type === 'file' && d.storage_path).map(d => d.storage_path);
          ids = [...ids, ...descendants.map(d => d.id)];
        }
      } else if (deleteTarget.storage_path) files = [deleteTarget.storage_path];

      if (files.length > 0) await supabase.storage.from("core-assets").remove(files);
      await supabase.from("coredocuments").delete().in("id", ids);
      toast.success("Deleted");
      setDeleteOpen(false); setDeleteConfirmText(""); fetchNodes();
    } catch (err) { toast.error("Delete failed"); }
    finally { setActionLoading(false); }
  };

  const handleView = async (node) => {
    if (!node.storage_path) return;
    const { data } = await supabase.storage.from("core-assets").createSignedUrl(node.storage_path, 3600);
    if (data) window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="p-6" onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop}>
      <PageBanner title="Core Documents" subtitle="Centralized Compliance Files" category="compliance" />
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 mt-6">
          <h1 className="text-2xl font-bold">Document Explorer</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setNewFolderOpen(true)}><FolderPlus className="mr-2 h-4 w-4" /> New Folder</Button>
            <Button variant="outline" onClick={() => folderInputRef.current?.click()}><Folder className="mr-2 h-4 w-4" /> Upload Folder</Button>
            <Button onClick={() => fileInputRef.current?.click()} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Upload Files
            </Button>
            <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
            <input ref={folderInputRef} type="file" webkitdirectory="" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
          </div>
      </div>

      <Card className="p-3 mb-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={() => setPathStack(p => p.slice(0, -1))} disabled={pathStack.length <= 1}><ArrowLeft className="h-4 w-4" /></Button>
             <Breadcrumb>
                <BreadcrumbList>
                  {pathStack.map((p, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <BreadcrumbItem className="cursor-pointer" onClick={() => setPathStack(pathStack.slice(0, i+1))}>
                        {i === pathStack.length - 1 ? <BreadcrumbPage>{p.name}</BreadcrumbPage> : <BreadcrumbLink>{p.name}</BreadcrumbLink>}
                      </BreadcrumbItem>
                      {i !== pathStack.length - 1 && <BreadcrumbSeparator />}
                    </span>
                  ))}
                </BreadcrumbList>
             </Breadcrumb>
           </div>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search documents..." className="pl-9 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
           </div>
        </div>
      </Card>

      <div className="relative min-h-100">
        <AnimatePresence>
          {isDragging && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary rounded-xl backdrop-blur-sm">
              <div className="text-center">
                <UploadCloud className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="font-bold text-primary">Drop to Sync Documents</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mb-4" /> Syncing...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {visibleNodes.map(node => (
              <Card key={node.id} onClick={() => node.type === "folder" ? setPathStack(p => [...p, { id: node.id, name: node.name }]) : handleView(node)} 
                    className="p-4 relative cursor-pointer hover:shadow-md transition-all group border-none bg-muted/30">
                 <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => { setRenameTarget(node); setRenameValue(node.name); setRenameOpen(true); }}><Pencil className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setMoveTarget(node); setMoveOpen(true); }}><Move className="mr-2 h-4 w-4" /> Move</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setDeleteTarget(node); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
                 <div className="flex flex-col items-center text-center">
                    <div className={`h-12 w-12 flex items-center justify-center rounded-xl mb-2 ${node.type === 'folder' ? 'bg-primary/10 text-primary' : 'bg-background shadow-sm'}`}>
                      {node.type === 'folder' ? <Folder className="h-6 w-6" /> : <FileTypeIcon kind={node.kind} />}
                    </div>
                    <span className="text-xs font-medium truncate w-full">{node.name}</span>
                 </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Item</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label>New Name</Label>
            <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={confirmRename} disabled={actionLoading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Move Item</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Target Folder</Label>
            <Select value={moveDestination} onValueChange={setMoveDestination}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Core Documents (Root)</SelectItem>
                {nodes.filter(n => n.type === 'folder' && n.id !== moveTarget?.id).map(f => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveOpen(false)}>Cancel</Button>
            <Button onClick={confirmMove} disabled={actionLoading}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle><DialogDescription>This removes "{deleteTarget?.name}" and all contents permanently. Type <b>DELETE</b> to proceed.</DialogDescription></DialogHeader>
          <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" className="border-destructive" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={deleteConfirmText !== 'DELETE' || actionLoading} onClick={confirmDelete}>Wipe Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Modal */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Folder</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Folder Name</Label>
            <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Enter name" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderOpen(false)}>Cancel</Button>
            <Button onClick={createFolder} disabled={actionLoading}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoreDocumentPage;