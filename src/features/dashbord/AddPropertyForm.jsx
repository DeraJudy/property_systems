// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/superbase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Upload,
//   Home,
//   ShieldCheck,
//   FileText,
//   Plus,
//   Trash2,
//   Loader2,
//   ImageIcon,
//   ArrowLeft,
//   Building2,
//   MapPin,
//   ClipboardCheck,
//   Wrench,
//   Calendar,
//   AlertCircle,
//   Clock,
//   Paperclip,
// } from "lucide-react";
// import { toast } from "sonner";
// import PageBanner from "@/components/dashboard/PageBanner";

// // 1. Helper: Sanitize file names
// const sanitizeFileName = (file) => {
//   const extension = file.name.split(".").pop();
//   const name = file.name
//     .split(".")
//     .shift()
//     .replace(/[^a-z0-9]/gi, "_")
//     .toLowerCase();
//   return `${Date.now()}_${name}.${extension}`;
// };

// // 2. Helper: Fast Image Compression
// const compressImage = (file) => {
//   return new Promise((resolve) => {
//     if (file.size < 500000) return resolve(file);
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event) => {
//       const img = new Image();
//       img.src = event.target.result;
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const MAX_WIDTH = 1000;
//         let width = img.width;
//         let height = img.height;
//         if (width > MAX_WIDTH) {
//           height *= MAX_WIDTH / width;
//           width = MAX_WIDTH;
//         }
//         canvas.width = width;
//         canvas.height = height;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, width, height);
//         canvas.toBlob(
//           (blob) => {
//             resolve(new File([blob], file.name, { type: "image/jpeg" }));
//           },
//           "image/jpeg",
//           0.7,
//         );
//       };
//     };
//   });
// };

// export default function AddPropertyForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [organisations, setOrganisations] = useState([]);
//   const [certificates, setCertificates] = useState([]);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [maintenanceLogs, setMaintenanceLogs] = useState([]);

//   const [formData, setFormData] = useState({
//     propertyName: "",
//     address: "",
//     city: "",
//     postcode: "",
//     organisationId: "",
//     manager: "",
//     status: "Active",
//     rooms: "",
//     rent: "",
//     propertyImage: null,
//     leaseFile: null,
//     floorPlanFile: null,
//     insuranceFile: null,
//   });

//   // Fetch Organisations on mount
//   useEffect(() => {
//     async function fetchOrgs() {
//       const { data, error } = await supabase
//         .from("organisations")
//         .select("id, name")
//         .eq("status", "Active");

//       if (error) {
//         console.error("Error fetching orgs:", error);
//       } else {
//         setOrganisations(data || []);
//       }
//     }
//     fetchOrgs();
//     setCertificates([
//       { id: crypto.randomUUID(), type: "", expiry: "", file: null },
//     ]);
//   }, []);

//   const addCertificate = () => {
//     setCertificates([
//       ...certificates,
//       { id: crypto.randomUUID(), type: "", expiry: "", file: null },
//     ]);
//   };

//   const removeCertificate = (id) => {
//     if (certificates.length > 1) {
//       setCertificates(certificates.filter((cert) => cert.id !== id));
//     }
//   };

//   // Maintenance Log Handlers
//   const addMaintenanceLog = () => {
//     setMaintenanceLogs([
//       ...maintenanceLogs,
//       {
//         id: crypto.randomUUID(),
//         workType: "",
//         area: "",
//         jobNumber: "",
//         description: "",
//         priority: "Normal",
//         startDate: "",
//         dueDate: "",
//         completedDate: "",
//         assignedToOrgId: "",
//         status: "New",
//         estimate: "",
//         actual: "",
//         comments: "",
//         attachment: null,
//       },
//     ]);
//   };

//   const removeMaintenanceLog = (id) => {
//     setMaintenanceLogs(maintenanceLogs.filter((log) => log.id !== id));
//   };

//   const handleStaticFile = (e, field) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, [field]: file }));
//       if (field === "propertyImage") {
//         if (imagePreview) URL.revokeObjectURL(imagePreview);
//         setImagePreview(URL.createObjectURL(file));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!formData.organisationId)
//       return toast.error("Please select an organisation");

//     setLoading(true);
//     const toastId = toast.loading("Processing and uploading all files...");

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) throw new Error("Please log in.");

//       const uploadFile = async (file, folder) => {
//         if (!file) return null;
//         const cleanPath = `${folder}/${sanitizeFileName(file)}`;
//         const { data, error } = await supabase.storage
//           .from("property-documents")
//           .upload(cleanPath, file);
//         if (error) throw error;
//         return data.path;
//       };

//       // 1. Image Compression
//       let finalImage = formData.propertyImage;
//       if (finalImage && finalImage.type.startsWith("image/")) {
//         finalImage = await compressImage(finalImage);
//       }

//       // 2. Parallel Uploads
//       const [imageUrl, leaseUrl, floorUrl, insuranceUrl] = await Promise.all([
//         uploadFile(finalImage, "property-images"),
//         uploadFile(formData.leaseFile, "lease"),
//         uploadFile(formData.floorPlanFile, "floorplans"),
//         uploadFile(formData.insuranceFile, "insurance"),
//       ]);

//       // 3. Find the selected organisation name to match your DB's text column
//       const selectedOrg = organisations.find(
//         (o) => o.id === formData.organisationId,
//       );

//       // 4. Insert Property Record
//       const { data: property, error: propertyError } = await supabase
//         .from("properties")
//         .insert({
//           property_name: formData.propertyName,
//           address: formData.address,
//           city: formData.city,
//           postcode: formData.postcode,
//           organisation: selectedOrg ? selectedOrg.name : null, // Fixed to match 'organisation' text column
//           manager: user.email,
//           status: formData.status,
//           rooms: parseInt(formData.rooms) || 0,
//           rent: parseFloat(formData.rent) || 0,
//           image_url: imageUrl,
//           lease_url: leaseUrl,
//           floor_plan_url: floorUrl,
//           insurance_url: insuranceUrl,
//           created_by: user.id,
//         })
//         .select()
//         .single();

//       if (propertyError) throw propertyError;

//       // 5. Upload Certificates
//       if (certificates.length > 0) {
//         const certTasks = certificates.map(async (cert) => {
//           if (!cert.file) return;
//           const filePath = await uploadFile(cert.file, "certificates");
//           return supabase.from("property_certificates").insert({
//             property_id: property.id,
//             certificate_type: cert.type,
//             expiry_date: cert.expiry,
//             document_url: filePath,
//           });
//         });
//         await Promise.all(certTasks);
//       }

//       // 5. Upload Maintenance Logs (New Logic)
//       if (maintenanceLogs.length > 0) {
//         const logTasks = maintenanceLogs.map(async (log) => {
//           let attachmentUrl = null;
//           if (log.attachment) {
//             attachmentUrl = await uploadFile(log.attachment, "maintenance");
//           }
//           return supabase.from("maintenance_logs").insert({
//             property_id: property.id,
//             work_type: log.workType,
//             area: log.area,
//             job_number: log.jobNumber,
//             description: log.description,
//             priority: log.priority,
//             start_date: log.startDate || null,
//             due_date: log.dueDate || null,
//             completed_date: log.completedDate || null,
//             assigned_to: log.assignedToOrgId,
//             status: log.status,
//             estimate_pounds: parseFloat(log.estimate) || 0,
//             actual_pounds: parseFloat(log.actual) || 0,
//             comments: log.comments,
//             attachment_url: attachmentUrl,
//           });
//         });
//         await Promise.all(logTasks);
//       }

//       toast.success("Property and documents saved!", { id: toastId });
//       router.push("/properties");
//       router.refresh();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Upload failed", { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 md:p-8 bg-transparent">


//       {/* Navigation Header */}
//       <div className=" mx-auto mb-6 flex items-center justify-between">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="text-black hover:bg-[#e1dbd2] transition-all flex items-center gap-2 px-4 group"
//         >
//           <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
//           <span className="font-semibold">Back to Dashboard</span>
//         </Button>
//         <div className="hidden md:flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-[#e1dbd2]">
//           <ShieldCheck className="w-3.5 h-3.5" /> Secure Data Entry
//         </div>
//       </div>

//       <PageBanner
//         title="Properties"
//         subtitle="Manage housing properties and performance"
//         category="addProperty"
//       />

//       <Card className="mx-auto border-[#e1dbd2] shadow-2xl 
//       bg-[#FFFDD0] backdrop-blur-sm overflow-hidden">
//         {/* Modern Gradient Header */}
//         <CardHeader className="bg-[#FFFDD0] text-black p-6 md:p-10">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
//                 <div className="p-2 bg-black rounded-lg">
//                   <Home className="w-6 h-6 text-[#FFFDD0]" />
//                 </div>
//                 Property Onboarding
//               </CardTitle>
//               <p className="text-black/70 mt-2 text-sm md:text-base opacity-90">
//                 Register a new asset and upload compliance documentation.
//               </p>
//             </div>
//             <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 backdrop-blur-md">
//               <span className="text-[10px] uppercase font-bold text-black/70 block mb-1">Status</span>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//                 <span className="text-sm font-mono font-bold tracking-tight">SYSTEM ONLINE</span>
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-6 md:p-10">
//           <form onSubmit={handleSubmit} className="space-y-10">
//             <Tabs defaultValue="basic" className="w-full">
//               <TabsList className="bg-[#e8e1d6] p-1 border border-[#e1dbd2] overflow-x-auto justify-start h-auto h-auto mb-8">
//                 {[
//                   { value: "basic", label: "Identity", icon: FileText },
//                   { value: "details", label: "Financials", icon: Building2 },
//                   { value: "compliance", label: "Compliance", icon: ClipboardCheck },
//                   { value: "maintenance", label: "Maintenance", icon: Wrench },
//                 ].map((tab) => (
//                   <TabsTrigger 
//                     key={tab.value}
//                     value={tab.value} 
//                     className="data-[state=active]:bg-[#FFFDD0] data-[state=active]:text=black py-3 rounded-lg flex items-center gap-2 transition-all font-semibold text-sm"
//                   >
//                     <tab.icon className="w-4 h-4" />
//                     {tab.label}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>

//               {/* BASIC TAB */}
//               <TabsContent value="basic" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 
//               duration-500">
//                 <div className="space-y-6">
//                   <div className="flex items-center gap-3">
//                     <div className="h-8 w-1.5 bg-black rounded-full" />
//                     <h3 className="text-black text-lg font-bold">Property Location & Image</h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <div className="md:col-span-1">
//                       <Label className="mb-3 block text-sm font-bold text-black uppercase tracking-wider">
//                         Primary Photo
//                       </Label>
//                       <div
//                         className={`relative group border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden shadow-inner
//                       ${imagePreview ? "border-transparent" : "border-[#e1dbd2] bg-[#fbf8f2] hover:border-black hover:bg-[#f1ede4]"}`}
//                         onClick={() =>
//                           document.getElementById("propertyImage").click()
//                         }
//                       >
//                         {imagePreview ? (
//                           <>
//                             <img
//                               src={imagePreview}
//                               alt="Preview"
//                               className="w-full h-full object-cover"
//                             />
//                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                               <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
//                                 <Upload className="w-4 h-4" /> Change Image
//                               </span>
//                             </div>
//                           </>
//                         ) : (
//                           <div className="text-center p-6">
//                             <div className="bg-black/10 p-4 rounded-full inline-block mb-3">
//                               <ImageIcon className="w-10 h-10 text-black" />
//                             </div>
//                             <p className="text-black font-bold text-sm">Drop property photo</p>
//                             <p className="text-gray-400 text-[10px] mt-1">PNG, JPG up to 10MB</p>
//                           </div>
//                         )}
//                       </div>
//                       <Input
//                         id="propertyImage"
//                         type="file"
//                         accept=".png,.jpg,.jpeg"
//                         className="hidden"
//                         onChange={(e) => handleStaticFile(e, "propertyImage")}
//                       />
//                     </div>

//                     <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div className="space-y-2 col-span-2">
//                         <Label className="text-black font-semibold flex items-center gap-2">
//                            <Home className="w-3.5 h-3.5" /> Property Name
//                         </Label>
//                         <Input
//                           required
//                           placeholder="e.g. Oakwood Manor"
//                           className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all"
//                           value={formData.propertyName}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               propertyName: e.target.value,
//                             })
//                           }
//                         />
//                       </div>

//                       <div className="space-y-2 col-span-2">
//                         <Label className="text-black font-semibold flex items-center gap-2">
//                            <MapPin className="w-3.5 h-3.5" /> Street Address
//                         </Label>
//                         <Input
//                           placeholder="Enter house number and street"
//                           className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all"
//                           value={formData.address}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               address: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-black font-semibold">City</Label>
//                         <Input
//                           placeholder="City"
//                           className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all"
//                           value={formData.city}
//                           onChange={(e) =>
//                             setFormData({ ...formData, city: e.target.value })
//                           }
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-black font-semibold">Postcode</Label>
//                         <Input
//                           placeholder="Postcode"
//                           className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all uppercase"
//                           value={formData.postcode}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               postcode: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* DETAILS TAB */}
//               <TabsContent value="details" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <div className="space-y-2 col-span-1 sm:col-span-2">
//                     <Label className="text-black font-semibold">Parent Organisation</Label>
//                     <Select
//                       value={formData.organisationId}
//                       onValueChange={(val) =>
//                         setFormData({ ...formData, organisationId: val })
//                       }
//                     >
//                       <SelectTrigger className="bg-[#f7f3eb] border-[#e1dbd2] h-12">
//                         <SelectValue placeholder="Select Organisation" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white border-[#e1dbd2]">
//                         {organisations.map((org) => (
//                           <SelectItem key={org.id} value={org.id}>
//                             {org.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-black font-semibold">Operational Status</Label>
//                     <Select
//                       value={formData.status}
//                       onValueChange={(val) =>
//                         setFormData({ ...formData, status: val })
//                       }
//                     >
//                       <SelectTrigger className="bg-[#f7f3eb] border-[#e1dbd2] h-12">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white border-[#e1dbd2]">
//                         <SelectItem value="Active">Active</SelectItem>
//                         <SelectItem value="Onboarding">Onboarding</SelectItem>
//                         <SelectItem value="Inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-black font-semibold">Total Capacity (Rooms)</Label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       className="bg-[#f7f3eb] border-[#e1dbd2] h-12"
//                       value={formData.rooms}
//                       onChange={(e) =>
//                         setFormData({ ...formData, rooms: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-black font-semibold">Monthly Yield (£)</Label>
//                     <Input
//                       type="number"
//                       placeholder="0.00"
//                       className="bg-[#f7f3eb] border-[#e1dbd2] h-12"
//                       value={formData.rent}
//                       onChange={(e) =>
//                         setFormData({ ...formData, rent: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* COMPLIANCE TAB */}
//               <TabsContent value="compliance" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between border-b border-[#e1dbd2] pb-4">
//                     <div className="flex items-center gap-3">
//                        <div className="h-8 w-1.5 bg-black rounded-full" />
//                        <h3 className="text-black text-lg font-bold">Safety Certificates</h3>
//                     </div>
//                     <Button
//                       type="button"
//                       onClick={addCertificate}
//                       className="bg-black hover:bg-black h-10 px-4 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-md"
//                     >
//                       <Plus className="w-4 h-4" /> Add Certificate
//                     </Button>
//                   </div>
                  
//                   <div className="grid grid-cols-1 gap-4">
//                     {certificates.map((cert, index) => (
//                       <div
//                         key={cert.id}
//                         className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border 
//                         border-[#e1dbd2] bg-white hover:border-black/40 transition-colors relative 
//                         shadow-sm"
//                       >
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           onClick={() => removeCertificate(cert.id)}
//                           className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                         <div className="space-y-2">
//                           <Label className="text-xs font-bold text-black uppercase tracking-wider">
//                             Document Type
//                           </Label>
//                           <Select
//                             value={cert.type}
//                             onValueChange={(val) => {
//                               const n = [...certificates];
//                               n[index].type = val;
//                               setCertificates(n);
//                             }}
//                           >
//                             <SelectTrigger className="bg-[#f7f3eb] border-none h-11">
//                               <SelectValue placeholder="Select Type" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white border-[#e1dbd2]">
//                               <SelectItem value="gas">Gas Safety (CP12)</SelectItem>
//                               <SelectItem value="fire">Fire Risk Assessment</SelectItem>
//                               <SelectItem value="epc">EPC Certificate</SelectItem>
//                               <SelectItem value="elec">Electrical (EICR)</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <Label className="text-xs font-bold text-black uppercase tracking-wider">Expiry Date</Label>
//                           <Input
//                             type="date"
//                             className="bg-[#f7f3eb] border-none h-11"
//                             value={cert.expiry}
//                             onChange={(e) => {
//                               const n = [...certificates];
//                               n[index].expiry = e.target.value;
//                               setCertificates(n);
//                             }}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label className="text-xs font-bold text-black uppercase tracking-wider">
//                             Upload Scan
//                           </Label>
//                           <Input
//                             type="file"
//                             className="hidden"
//                             accept=".pdf,.doc,.docx"
//                             id={`f-${cert.id}`}
//                             onChange={(e) => {
//                               const n = [...certificates];
//                               n[index].file = e.target.files[0];
//                               setCertificates(n);
//                             }}
//                           />
//                           <Label
//                             htmlFor={`f-${cert.id}`}
//                             className="flex items-center gap-3 bg-[#e8e1d6]/50 hover:bg-[#e8e1d6] px-4 py-2.5 
//                             rounded-xl cursor-pointer text-xs font-semibold text-black border 
//                             border-[#d1c9bd] transition-all h-11"
//                           >
//                             <Upload className="w-4 h-4 shrink-0 opacity-60" />
//                             <span className="truncate">
//                               {cert.file ? cert.file.name : "Select PDF/Word"}
//                             </span>
//                           </Label>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-[#e6f2ec]/60 p-8 rounded-3xl border border-black/10 backdrop-blur-sm">
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//                     {["leaseFile", "floorPlanFile", "insuranceFile"].map(
//                       (f) => (
//                         <div key={f} className="space-y-3">
//                           <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
//                             {f
//                               .replace("File", "")
//                               .replace("floorPlan", "floor plan")}
//                           </Label>
//                           <Input
//                             type="file"
//                             className="hidden"
//                             accept=".pdf,.doc,.docx"
//                             id={f}
//                             onChange={(e) => handleStaticFile(e, f)}
//                           />
//                           <Label
//                             htmlFor={f}
//                             className="flex flex-col items-center justify-center gap-3 bg-white px-6 py-8 
//                             rounded-2xl cursor-pointer border-2 border-dashed border-[#d1c9bd] 
//                             hover:border-black hover:bg-white transition-all shadow-sm group"
//                           >
//                             <div className="p-3 bg-[#f7f3eb] rounded-full group-hover:scale-110 transition-transform">
//                               <Upload className="w-5 h-5 text-black" />
//                             </div>
//                             <div className="text-center">
//                                <p className="text-xs font-bold text-black">
//                                  {formData[f] ? "Replace File" : "Upload Document"}
//                                </p>
//                                {formData[f] && (
//                                  <p className="text-[10px] truncate w-32 text-black font-medium mt-1">
//                                    {formData[f].name}
//                                  </p>
//                                )}
//                             </div>
//                           </Label>
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* MAINTENANCE TAB - NEW & BEAUTIFIED */}
//               <TabsContent value="maintenance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
//                 <div className="flex items-center justify-between border-b border-[#e1dbd2] pb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-8 w-1.5 bg-black rounded-full" />
//                     <h3 className="text-black text-lg font-bold">Maintenance Logs</h3>
//                   </div>
//                   <Button
//                     type="button"
//                     onClick={addMaintenanceLog}
//                     className="bg-black hover:bg-black h-10 px-6 rounded-full flex items-center gap-2 font-bold shadow-md transition-all active:scale-95"
//                   >
//                     <Plus className="w-4 h-4" /> Add Maintenance Log
//                   </Button>
//                 </div>

//                 <div className="space-y-6">
//                   {maintenanceLogs.length === 0 ? (
//                     <div className="text-center py-12 bg-[#fbf8f2] rounded-3xl border-2 border-dashed border-[#e1dbd2]">
//                       <Wrench className="w-12 h-12 text-black mx-auto opacity-20 mb-4" />
//                       <p className="text-black font-semibold">No maintenance logs added yet.</p>
//                       <p className="text-gray-400 text-sm">Click the button above to log a new repair or task.</p>
//                     </div>
//                   ) : (
//                     maintenanceLogs.map((log, index) => (
//                       <div
//                         key={log.id}
//                         className="p-6 md:p-8 rounded-3xl border border-[#e1dbd2] bg-white shadow-sm relative 
//                         space-y-6 animate-in zoom-in-95 duration-300"
//                       >
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           onClick={() => removeMaintenanceLog(log.id)}
//                           className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full bg-red-50 text-red-500 
//                           hover:bg-red-500 hover:text-white transition-all shadow-sm"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </Button>

//                         {/* Top Row: Type, Area, Job # */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider">
//                               Work Type
//                             </Label>
//                             <Select 
//                               value={log.workType} 
//                               onValueChange={(v) => {
//                                 const n = [...maintenanceLogs]; n[index].workType = v; setMaintenanceLogs(n);
//                               }}
//                             >
//                               <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
//                                 <SelectValue placeholder="Select Type" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Building">Building</SelectItem>
//                                 <SelectItem value="Electrical">Electrical</SelectItem>
//                                 <SelectItem value="Plumbing">Plumbing</SelectItem>
//                                 <SelectItem value="Other">Other</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider">Area</Label>
//                             <Select 
//                               value={log.area} 
//                               onValueChange={(v) => {
//                                 const n = [...maintenanceLogs]; n[index].area = v; setMaintenanceLogs(n);
//                               }}
//                             >
//                               <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
//                                 <SelectValue placeholder="Select Area" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Kitchen">Kitchen</SelectItem>
//                                 <SelectItem value="Bedroom">Bedroom</SelectItem>
//                                 <SelectItem value="Garden">Garden</SelectItem>
//                                 <SelectItem value="Bathroom">Bathroom</SelectItem>
//                                 <SelectItem value="Common">Common</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider">Job Number</Label>
//                             <Input 
//                               placeholder="#0000"
//                               className="bg-[#f7f3eb] h-11 border-none" 
//                               value={log.jobNumber}
//                               onChange={(e) => {
//                                 const n = [...maintenanceLogs]; n[index].jobNumber = e.target.value; setMaintenanceLogs(n);
//                               }}
//                             />
//                           </div>
//                         </div>

//                         {/* Description */}
//                         <div className="space-y-2">
//                           <Label className="text-xs font-bold text-black uppercase tracking-wider">Description</Label>
//                           <Input 
//                             placeholder="Describe the issue or required work..."
//                             className="bg-[#f7f3eb] h-11 border-none" 
//                             value={log.description}
//                             onChange={(e) => {
//                               const n = [...maintenanceLogs]; n[index].description = e.target.value; setMaintenanceLogs(n);
//                             }}
//                           />
//                         </div>

//                         {/* Priority Tab (Segmented Control style) */}
//                         <div className="space-y-3">
//                           <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
//                             <AlertCircle className="w-3 h-3" /> Priority Level
//                           </Label>
//                           <div className="flex flex-wrap gap-2">
//                             {["Normal", "Low", "Medium", "High", "Urgent"].map((p) => (
//                               <button
//                                 key={p}
//                                 type="button"
//                                 onClick={() => {
//                                   const n = [...maintenanceLogs]; n[index].priority = p; setMaintenanceLogs(n);
//                                 }}
//                                 className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
//                                   log.priority === p 
//                                   ? "bg-black text-white border-black shadow-md" 
//                                   : "bg-[#f7f3eb] text-black border-[#e1dbd2] hover:bg-[#e1dbd2]"
//                                 }`}
//                               >
//                                 {p}
//                               </button>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Dates Row */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2"><Calendar className="w-3 h-3"/> Start Date</Label>
//                             <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.startDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].startDate=e.target.value; setMaintenanceLogs(n);}}/>
//                           </div>
//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2"><Clock className="w-3 h-3"/> Due Date</Label>
//                             <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.dueDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].dueDate=e.target.value; setMaintenanceLogs(n);}}/>
//                           </div>
//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Completed Date</Label>
//                             <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.completedDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].completedDate=e.target.value; setMaintenanceLogs(n);}}/>
//                           </div>
//                         </div>

//                         {/* Assignment & Status */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider">Assigned To (Organisation)</Label>
//                             <Select 
//                               value={log.assignedToOrgId} 
//                               onValueChange={(v) => {
//                                 const n = [...maintenanceLogs]; n[index].assignedToOrgId = v; setMaintenanceLogs(n);
//                               }}
//                             >
//                               <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
//                                 <SelectValue placeholder="Select Organisation" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {organisations.map((org) => (
//                                   <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </div>
//                           <div className="space-y-2">
//                             <Label className="text-xs font-bold text-black uppercase tracking-wider">Current Status</Label>
//                             <Select 
//                               value={log.status} 
//                               onValueChange={(v) => {
//                                 const n = [...maintenanceLogs]; n[index].status = v; setMaintenanceLogs(n);
//                               }}
//                             >
//                               <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {[ "New", "Approved", "Archived", "Cancelled", "Complete", "In Progress", "Quote", "Reported", "Requires Attention" ].map(s => (
//                                   <SelectItem key={s} value={s}>{s}</SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         </div>

//                         {/* Financials */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#fbf8f2] rounded-2xl border border-[#e1dbd2]">
//                            <div className="space-y-2">
//                               <Label className="text-xs font-bold text-black ">ESTIMATE (£)</Label>
//                               <Input type="number" placeholder="0.00" className="bg-white border-[#e1dbd2]" value={log.estimate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].estimate=e.target.value; setMaintenanceLogs(n);}} />
//                            </div>
//                            <div className="space-y-2">
//                               <Label className="text-xs font-bold text-black ">ACTUAL COST (£)</Label>
//                               <Input type="number" placeholder="0.00" className="bg-white border-[#e1dbd2]" value={log.actual} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].actual=e.target.value; setMaintenanceLogs(n);}} />
//                            </div>
//                         </div>

//                         {/* Comments & Attachments */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                            <div className="space-y-2">
//                               <Label className="text-xs font-bold text-black ">Comments</Label>
//                               <Input 
//                                 placeholder="Add any extra notes..." 
//                                 className="bg-[#f7f3eb] h-11 border-none" 
//                                 value={log.comments} 
//                                 onChange={(e)=>{const n=[...maintenanceLogs]; n[index].comments=e.target.value; setMaintenanceLogs(n);}}
//                               />
//                            </div>
//                            <div className="space-y-2">
//                               <Label className="text-xs font-bold text-black uppercase tracking-wider">Attachments</Label>
//                               <div className="flex items-center gap-2">
//                                 <Input 
//                                   type="file" 
//                                   id={`attach-${log.id}`} 
//                                   className="hidden" 
//                                   onChange={(e)=>{const n=[...maintenanceLogs]; n[index].attachment=e.target.files[0]; setMaintenanceLogs(n);}}
//                                 />
//                                 <Label 
//                                   htmlFor={`attach-${log.id}`} 
//                                   className="flex-1 flex items-center justify-center gap-2 bg-[#e8e1d6] h-11 rounded-xl 
//                                   cursor-pointer text-xs font-bold text-black hover:bg-[#d1c9bd] transition-all border 
//                                   border-[#c5beaf]"
//                                 >
//                                   <Paperclip className="w-4 h-4" />
//                                   {log.attachment ? log.attachment.name : "Attach Invoice/Photo"}
//                                 </Label>
//                               </div>
//                            </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//             </Tabs>

//             <Separator className="bg-[#e1dbd2]" />

//             <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full md:flex-1 bg-black py-8 text-lg font-bold shadow-xl hover:bg-black 
//                 transition-all hover:scale-[1.01] active:scale-[0.99] rounded-2xl"
//               >
//                 {loading ? (
//                   <div className="flex items-center gap-3">
//                     <Loader2 className="h-6 w-6 animate-spin" />
//                     <span>Processing Data...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3">
//                     <Home className="w-6 h-6" />
//                     <span>Save Property Profile</span>
//                   </div>
//                 )}
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 type="button" 
//                 className="w-full md:w-auto px-10 py-8 text-gray-400 font-bold hover:text-red-500"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="max-w-5xl mx-auto mt-8 text-center">
//         <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
//           Internal Asset Management System
//         </p>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/superbase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Home,
  ShieldCheck,
  FileText,
  Plus,
  Trash2,
  Loader2,
  ImageIcon,
  ArrowLeft,
  Building2,
  MapPin,
  ClipboardCheck,
  Wrench,
  Calendar,
  AlertCircle,
  Clock,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import PageBanner from "@/components/dashboard/PageBanner";

// 1. Helper: Sanitize file names
const sanitizeFileName = (file) => {
  const extension = file.name.split(".").pop();
  const name = file.name
    .split(".")
    .shift()
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  return `${Date.now()}_${name}.${extension}`;
};

// 2. Helper: Fast Image Compression
const compressImage = (file) => {
  return new Promise((resolve) => {
    if (file.size < 500000) return resolve(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.7,
        );
      };
    };
  });
};

export default function AddPropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);

  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    postcode: "",
    organisationId: "",
    manager: "",
    status: "Active",
    rooms: "",
    rent: "",
    propertyImage: null,
    leaseFile: null,
    insuranceFile: null,
  });

  // Fetch Organisations on mount
  useEffect(() => {
    async function fetchOrgs() {
      const { data, error } = await supabase
        .from("organisations")
        .select("id, name")
        .eq("status", "Active");

      if (error) {
        console.error("Error fetching orgs:", error);
      } else {
        setOrganisations(data || []);
      }
    }
    fetchOrgs();
    setCertificates([
      { id: crypto.randomUUID(), type: "", expiry: "", file: null },
    ]);
  }, []);

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      { id: crypto.randomUUID(), type: "", expiry: "", file: null },
    ]);
  };

  const removeCertificate = (id) => {
    if (certificates.length > 1) {
      setCertificates(certificates.filter((cert) => cert.id !== id));
    }
  };

  // Maintenance Log Handlers
  const addMaintenanceLog = () => {
    setMaintenanceLogs([
      ...maintenanceLogs,
      {
        id: crypto.randomUUID(),
        workType: "",
        area: "",
        jobNumber: "",
        description: "",
        priority: "Normal",
        startDate: "",
        dueDate: "",
        completedDate: "",
        assignedToOrgId: "",
        status: "New",
        estimate: "",
        actual: "",
        comments: "",
        attachment: null,
      },
    ]);
  };

  const removeMaintenanceLog = (id) => {
    setMaintenanceLogs(maintenanceLogs.filter((log) => log.id !== id));
  };

  const handleStaticFile = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      if (field === "propertyImage") {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!formData.organisationId) return toast.error("Please select an organisation");

    setLoading(true);
    const toastId = toast.loading("Processing and uploading all files...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in.");

      // Updated to save with User ID in path
      const uploadFile = async (file, folder) => {
        if (!file) return null;
        const cleanPath = `${user.id}/${folder}/${sanitizeFileName(file)}`;
        const { data, error } = await supabase.storage
          .from("property-documents")
          .upload(cleanPath, file);
        if (error) throw error;
        return data.path;
      };

      // 1. Image Compression
      let finalImage = formData.propertyImage;
      if (finalImage && finalImage.type.startsWith("image/")) {
        finalImage = await compressImage(finalImage);
      }

      // 2. Parallel Uploads (Removed Floor Plan)
      const [imageUrl, leaseUrl, insuranceUrl] = await Promise.all([
        uploadFile(finalImage, "property-images"),
        uploadFile(formData.leaseFile, "lease"),
        uploadFile(formData.insuranceFile, "insurance"),
      ]);

      // 3. Find the selected organisation
      const selectedOrg = organisations.find((o) => o.id === formData.organisationId);

      // 4. Insert Property Record
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          property_name: formData.propertyName,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          organisation: selectedOrg ? selectedOrg.name : null,
          manager: user.email,
          status: formData.status,
          rooms: parseInt(formData.rooms) || 0,
          rent: parseFloat(formData.rent) || 0,
          image_url: imageUrl,
          lease_url: leaseUrl,
          insurance_url: insuranceUrl, // floor_plan_url removed
          created_by: user.id,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // 5. Upload Certificates
      if (certificates.length > 0) {
        const certTasks = certificates.map(async (cert) => {
          if (!cert.file) return;
          const filePath = await uploadFile(cert.file, "certificates");
          return supabase.from("property_certificates").insert({
            property_id: property.id,
            certificate_type: cert.type,
            expiry_date: cert.expiry,
            document_url: filePath,
          });
        });
        await Promise.all(certTasks);
      }

      // 5. Upload Maintenance Logs (New Logic)
      if (maintenanceLogs.length > 0) {
        const logTasks = maintenanceLogs.map(async (log) => {
          let attachmentUrl = null;
          if (log.attachment) {
            attachmentUrl = await uploadFile(log.attachment, "maintenance");
          }
          return supabase.from("maintenance_logs").insert({
            property_id: property.id,
            work_type: log.workType,
            area: log.area,
            job_number: log.jobNumber,
            description: log.description,
            priority: log.priority,
            start_date: log.startDate || null,
            due_date: log.dueDate || null,
            completed_date: log.completedDate || null,
            assigned_to: log.assignedToOrgId,
            status: log.status,
            estimate_pounds: parseFloat(log.estimate) || 0,
            actual_pounds: parseFloat(log.actual) || 0,
            comments: log.comments,
            attachment_url: attachmentUrl,
          });
        });
        await Promise.all(logTasks);
      }

      toast.success("Property and documents saved!", { id: toastId });
      router.push("/properties");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-transparent">


      {/* Navigation Header */}
      <div className=" mx-auto mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-black hover:bg-[#e1dbd2] transition-all flex items-center gap-2 px-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-semibold">Back to Dashboard</span>
        </Button>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-[#e1dbd2]">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Data Entry
        </div>
      </div>

      <PageBanner
        title="Properties"
        subtitle="Manage housing properties and performance"
        category="addProperty"
      />

      <Card className="mx-auto border-[#e1dbd2] shadow-2xl 
      bg-[#FFFDD0] backdrop-blur-sm overflow-hidden">
        {/* Modern Gradient Header */}
        <CardHeader className="bg-[#FFFDD0] text-black p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Home className="w-6 h-6 text-[#FFFDD0]" />
                </div>
                Property Onboarding
              </CardTitle>
              <p className="text-black/70 mt-2 text-sm md:text-base opacity-90">
                Register a new asset and upload compliance documentation.
              </p>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-black/70 block mb-1">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-mono font-bold tracking-tight">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="bg-[#e8e1d6] p-1 border border-[#e1dbd2] overflow-x-auto justify-start h-auto mb-8">
                {[
                  { value: "basic", label: "Identity", icon: FileText },
                  { value: "details", label: "Financials", icon: Building2 },
                  { value: "compliance", label: "Compliance", icon: ClipboardCheck },
                  // { value: "maintenance", label: "Maintenance", icon: Wrench },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="data-[state=active]:bg-[#FFFDD0] data-[state=active]:text=black py-3 rounded-lg flex items-center gap-2 transition-all font-semibold text-sm"
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* BASIC TAB */}
              <TabsContent value="basic" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 
              duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-black rounded-full" />
                    <h3 className="text-black text-lg font-bold">Property Location & Image</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                      <Label className="mb-3 block text-sm font-bold text-black uppercase tracking-wider">
                        Primary Photo
                      </Label>
                      <div
                        className={`relative group border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden shadow-inner
                      ${imagePreview ? "border-transparent" : "border-[#e1dbd2] bg-[#fbf8f2] hover:border-black hover:bg-[#f1ede4]"}`}
                        onClick={() =>
                          document.getElementById("propertyImage").click()
                        }
                      >
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Change Image
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-6">
                            <div className="bg-black/10 p-4 rounded-full inline-block mb-3">
                              <ImageIcon className="w-10 h-10 text-black" />
                            </div>
                            <p className="text-black font-bold text-sm">Drop property photo</p>
                            <p className="text-gray-400 text-[10px] mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </div>
                      <Input
                        id="propertyImage"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => handleStaticFile(e, "propertyImage")}
                      />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2 col-span-2">
                        <Label className="text-black font-semibold flex items-center gap-2">
                           <Home className="w-3.5 h-3.5" /> Property Name
                        </Label>
                        <Input
                          required
                          placeholder="e.g. Oakwood Manor"
                          className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all"
                          value={formData.propertyName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-black font-semibold flex items-center gap-2">
                           <MapPin className="w-3.5 h-3.5" /> Street Address
                        </Label>
                        <Input
                          placeholder="Enter house number and street"
                          className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-semibold">City</Label>
                        <Input
                          placeholder="City"
                          className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-semibold">Postcode</Label>
                        <Input
                          placeholder="Postcode"
                          className="bg-[#f7f3eb] border-[#e1dbd2] focus:ring-2 focus:ring-black focus:bg-white h-12 transition-all uppercase"
                          value={formData.postcode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postcode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* DETAILS TAB */}
              <TabsContent value="details" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <Label className="text-black font-semibold">Parent Organisation</Label>
                    <Select
                      value={formData.organisationId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, organisationId: val })
                      }
                    >
                      <SelectTrigger className="bg-[#f7f3eb] border-[#e1dbd2] h-12">
                        <SelectValue placeholder="Select Organisation" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#e1dbd2]">
                        {organisations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-black font-semibold">Operational Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) =>
                        setFormData({ ...formData, status: val })
                      }
                    >
                      <SelectTrigger className="bg-[#f7f3eb] border-[#e1dbd2] h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#e1dbd2]">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-black font-semibold">Total Capacity (Rooms)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-[#f7f3eb] border-[#e1dbd2] h-12"
                      value={formData.rooms}
                      onChange={(e) =>
                        setFormData({ ...formData, rooms: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-black font-semibold">Monthly Yield (£)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-[#f7f3eb] border-[#e1dbd2] h-12"
                      value={formData.rent}
                      onChange={(e) =>
                        setFormData({ ...formData, rent: e.target.value })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              {/* COMPLIANCE TAB */}
              <TabsContent value="compliance" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#e1dbd2] pb-4">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-1.5 bg-black rounded-full" />
                       <h3 className="text-black text-lg font-bold">Safety Certificates</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addCertificate}
                      className="bg-black hover:bg-black h-10 px-4 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Certificate
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {certificates.map((cert, index) => (
                      <div
                        key={cert.id}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border 
                        border-[#e1dbd2] bg-white hover:border-black/40 transition-colors relative 
                        shadow-sm"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeCertificate(cert.id)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-black uppercase tracking-wider">
                            Document Type
                          </Label>
                          <Select
              value={cert.type}
              onValueChange={(val) => {
                const n = [...certificates];
                n[index].type = val;
                setCertificates(n);
              }}
            >
              <SelectTrigger className="...">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="EPC">EPC</SelectItem>
                <SelectItem value="EICR">EICR</SelectItem>
                <SelectItem value="Emergency Lights">Emergency lights certificate</SelectItem>
                <SelectItem value="Fire Alarms">Fire alarms certificate</SelectItem>
                <SelectItem value="Gas Safety">Gas safety certificate</SelectItem>
                <SelectItem value="PAT">PAT</SelectItem>
                <SelectItem value="FRA">FRA</SelectItem>
                <SelectItem value="Asbestos Survey">Asbestos Survey</SelectItem>
                <SelectItem value="Legionella">Legionella Risk Assessment</SelectItem>
              </SelectContent>
            </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-black uppercase tracking-wider">Expiry Date</Label>
                          <Input
                            type="date"
                            className="bg-[#f7f3eb] border-none h-11"
                            value={cert.expiry}
                            onChange={(e) => {
                              const n = [...certificates];
                              n[index].expiry = e.target.value;
                              setCertificates(n);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-black uppercase tracking-wider">
                            Upload Scan
                          </Label>
                          <Input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            id={`f-${cert.id}`}
                            onChange={(e) => {
                              const n = [...certificates];
                              n[index].file = e.target.files[0];
                              setCertificates(n);
                            }}
                          />
                          <Label
                            htmlFor={`f-${cert.id}`}
                            className="flex items-center gap-3 bg-[#e8e1d6]/50 hover:bg-[#e8e1d6] px-4 py-2.5 
                            rounded-xl cursor-pointer text-xs font-semibold text-black border 
                            border-[#d1c9bd] transition-all h-11"
                          >
                            <Upload className="w-4 h-4 shrink-0 opacity-60" />
                            <span className="truncate">
                              {cert.file ? cert.file.name : "Select PDF/Word"}
                            </span>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#e6f2ec]/60 p-8 rounded-3xl border border-black/10 backdrop-blur-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {["leaseFile", "insuranceFile"].map(
                      (f) => (
                        <div key={f} className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                            {f.replace("File", "")}
                          </Label>
                          <Input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            id={f}
                            onChange={(e) => handleStaticFile(e, f)}
                          />
                          <Label
                            htmlFor={f}
                            className="flex flex-col items-center justify-center gap-3 bg-white px-6 py-8 
                            rounded-2xl cursor-pointer border-2 border-dashed border-[#d1c9bd] 
                            hover:border-black hover:bg-white transition-all shadow-sm group"
                          >
                            <div className="p-3 bg-[#f7f3eb] rounded-full group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-black" />
                            </div>
                            <div className="text-center">
                               <p className="text-xs font-bold text-black">
                                 {formData[f] ? "Replace File" : "Upload Document"}
                               </p>
                               {formData[f] && (
                                 <p className="text-[10px] truncate w-32 text-black font-medium mt-1">
                                   {formData[f].name}
                                 </p>
                               )}
                            </div>
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* MAINTENANCE TAB - NEW & BEAUTIFIED */}
              <TabsContent value="maintenance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between border-b border-[#e1dbd2] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-black rounded-full" />
                    <h3 className="text-black text-lg font-bold">Maintenance Logs</h3>
                  </div>
                  <Button
                    type="button"
                    onClick={addMaintenanceLog}
                    className="bg-black hover:bg-black h-10 px-6 rounded-full flex items-center gap-2 font-bold shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Maintenance Log
                  </Button>
                </div>

                <div className="space-y-6">
                  {maintenanceLogs.length === 0 ? (
                    <div className="text-center py-12 bg-[#fbf8f2] rounded-3xl border-2 border-dashed border-[#e1dbd2]">
                      <Wrench className="w-12 h-12 text-black mx-auto opacity-20 mb-4" />
                      <p className="text-black font-semibold">No maintenance logs added yet.</p>
                      <p className="text-gray-400 text-sm">Click the button above to log a new repair or task.</p>
                    </div>
                  ) : (
                    maintenanceLogs.map((log, index) => (
                      <div
                        key={log.id}
                        className="p-6 md:p-8 rounded-3xl border border-[#e1dbd2] bg-white shadow-sm relative 
                        space-y-6 animate-in zoom-in-95 duration-300"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeMaintenanceLog(log.id)}
                          className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full bg-red-50 text-red-500 
                          hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>

                        {/* Top Row: Type, Area, Job # */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider">
                              Work Type
                            </Label>
                            <Select 
                              value={log.workType} 
                              onValueChange={(v) => {
                                const n = [...maintenanceLogs]; n[index].workType = v; setMaintenanceLogs(n);
                              }}
                            >
                              <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Building">Building</SelectItem>
                                <SelectItem value="Electrical">Electrical</SelectItem>
                                <SelectItem value="Plumbing">Plumbing</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider">Area</Label>
                            <Select 
                              value={log.area} 
                              onValueChange={(v) => {
                                const n = [...maintenanceLogs]; n[index].area = v; setMaintenanceLogs(n);
                              }}
                            >
                              <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
                                <SelectValue placeholder="Select Area" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Kitchen">Kitchen</SelectItem>
                                <SelectItem value="Bedroom">Bedroom</SelectItem>
                                <SelectItem value="Garden">Garden</SelectItem>
                                <SelectItem value="Bathroom">Bathroom</SelectItem>
                                <SelectItem value="Common">Common</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider">Job Number</Label>
                            <Input 
                              placeholder="#0000"
                              className="bg-[#f7f3eb] h-11 border-none" 
                              value={log.jobNumber}
                              onChange={(e) => {
                                const n = [...maintenanceLogs]; n[index].jobNumber = e.target.value; setMaintenanceLogs(n);
                              }}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-black uppercase tracking-wider">Description</Label>
                          <Input 
                            placeholder="Describe the issue or required work..."
                            className="bg-[#f7f3eb] h-11 border-none" 
                            value={log.description}
                            onChange={(e) => {
                              const n = [...maintenanceLogs]; n[index].description = e.target.value; setMaintenanceLogs(n);
                            }}
                          />
                        </div>

                        {/* Priority Tab (Segmented Control style) */}
                        <div className="space-y-3">
                          <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" /> Priority Level
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {["Normal", "Low", "Medium", "High", "Urgent"].map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => {
                                  const n = [...maintenanceLogs]; n[index].priority = p; setMaintenanceLogs(n);
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                  log.priority === p 
                                  ? "bg-black text-white border-black shadow-md" 
                                  : "bg-[#f7f3eb] text-black border-[#e1dbd2] hover:bg-[#e1dbd2]"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dates Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2"><Calendar className="w-3 h-3"/> Start Date</Label>
                            <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.startDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].startDate=e.target.value; setMaintenanceLogs(n);}}/>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2"><Clock className="w-3 h-3"/> Due Date</Label>
                            <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.dueDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].dueDate=e.target.value; setMaintenanceLogs(n);}}/>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Completed Date</Label>
                            <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.completedDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].completedDate=e.target.value; setMaintenanceLogs(n);}}/>
                          </div>
                        </div>

                        {/* Assignment & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider">Assigned To (Organisation)</Label>
                            <Select 
                              value={log.assignedToOrgId} 
                              onValueChange={(v) => {
                                const n = [...maintenanceLogs]; n[index].assignedToOrgId = v; setMaintenanceLogs(n);
                              }}
                            >
                              <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
                                <SelectValue placeholder="Select Organisation" />
                              </SelectTrigger>
                              <SelectContent>
                                {organisations.map((org) => (
                                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-black uppercase tracking-wider">Current Status</Label>
                            <Select 
                              value={log.status} 
                              onValueChange={(v) => {
                                const n = [...maintenanceLogs]; n[index].status = v; setMaintenanceLogs(n);
                              }}
                            >
                              <SelectTrigger className="bg-[#f7f3eb] h-11 border-none">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[ "New", "Approved", "Archived", "Cancelled", "Complete", "In Progress", "Quote", "Reported", "Requires Attention" ].map(s => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Financials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#fbf8f2] rounded-2xl border border-[#e1dbd2]">
                           <div className="space-y-2">
                              <Label className="text-xs font-bold text-black ">ESTIMATE (£)</Label>
                              <Input type="number" placeholder="0.00" className="bg-white border-[#e1dbd2]" value={log.estimate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].estimate=e.target.value; setMaintenanceLogs(n);}} />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-xs font-bold text-black ">ACTUAL COST (£)</Label>
                              <Input type="number" placeholder="0.00" className="bg-white border-[#e1dbd2]" value={log.actual} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].actual=e.target.value; setMaintenanceLogs(n);}} />
                           </div>
                        </div>

                        {/* Comments & Attachments */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label className="text-xs font-bold text-black ">Comments</Label>
                              <Input 
                                placeholder="Add any extra notes..." 
                                className="bg-[#f7f3eb] h-11 border-none" 
                                value={log.comments} 
                                onChange={(e)=>{const n=[...maintenanceLogs]; n[index].comments=e.target.value; setMaintenanceLogs(n);}}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-xs font-bold text-black uppercase tracking-wider">Attachments</Label>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="file" 
                                  id={`attach-${log.id}`} 
                                  className="hidden" 
                                  onChange={(e)=>{const n=[...maintenanceLogs]; n[index].attachment=e.target.files[0]; setMaintenanceLogs(n);}}
                                />
                                <Label 
                                  htmlFor={`attach-${log.id}`} 
                                  className="flex-1 flex items-center justify-center gap-2 bg-[#e8e1d6] h-11 rounded-xl 
                                  cursor-pointer text-xs font-bold text-black hover:bg-[#d1c9bd] transition-all border 
                                  border-[#c5beaf]"
                                >
                                  <Paperclip className="w-4 h-4" />
                                  {log.attachment ? log.attachment.name : "Attach Invoice/Photo"}
                                </Label>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

            </Tabs>

            <Separator className="bg-[#e1dbd2]" />

            <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:flex-1 bg-black py-8 text-lg font-bold shadow-xl hover:bg-black 
                transition-all hover:scale-[1.01] active:scale-[0.99] rounded-2xl"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Processing Data...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6" />
                    <span>Save Property Profile</span>
                  </div>
                )}
              </Button>
              <Button 
                variant="ghost" 
                type="button" 
                className="w-full md:w-auto px-10 py-8 text-gray-400 font-bold hover:text-red-500"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-5xl mx-auto mt-8 text-center">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          Internal Asset Management System
        </p>
      </div>
    </div>
  );
}


