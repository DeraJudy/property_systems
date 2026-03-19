// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { supabase } from "@/lib/superbase/client";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Button } from "@/components/ui/button";
// // import { Separator } from "@/components/ui/separator";
// // import { Upload, Home, ShieldCheck, FileText, Plus, Trash2, Loader2, ImageIcon, X } from "lucide-react";
// // import { toast } from "sonner";

// // // Helper to sanitize file names
// // const sanitizeFileName = (file) => {
// //   const extension = file.name.split('.').pop();
// //   const name = file.name.split('.').shift().replace(/[^a-z0-9]/gi, '_').toLowerCase();
// //   return `${Date.now()}_${name}.${extension}`;
// // };

// // export default function AddPropertyForm() {
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);
// //   const [certificates, setCertificates] = useState([]);

// //   const [formData, setFormData] = useState({
// //     propertyName: "",
// //     address: "",
// //     city: "",
// //     postcode: "",
// //     organisation: "",
// //     manager: "",
// //     status: "Active",
// //     rooms: "",
// //     rent: "",
// //     tenantName: "",
// //     propertyImage: null, // New State for Image
// //     leaseFile: null,
// //     floorPlanFile: null,
// //     insuranceFile: null,
// //   });

// //   const [imagePreview, setImagePreview] = useState(null);

// //   useEffect(() => {
// //     setCertificates([
// //       { id: crypto.randomUUID(), type: "", expiry: "", file: null },
// //     ]);
// //   }, []);

// //   const addCertificate = () => {
// //     setCertificates([
// //       ...certificates,
// //       { id: crypto.randomUUID(), type: "", expiry: "", file: null },
// //     ]);
// //   };

// //   const removeCertificate = (id) => {
// //     if (certificates.length > 1) {
// //       setCertificates(certificates.filter((cert) => cert.id !== id));
// //     }
// //   };

// //   const handleStaticFile = (e, field) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       setFormData((prev) => ({ ...prev, [field]: file }));
      
// //       // Handle Image Preview logic
// //       if (field === 'propertyImage') {
// //         if (imagePreview) URL.revokeObjectURL(imagePreview);
// //         setImagePreview(URL.createObjectURL(file));
// //       }
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (loading) return;

// //     setLoading(true);
// //     const toastId = toast.loading("Creating property profile...");

// //     try {
// //       const { data: { user }, error: authError } = await supabase.auth.getUser();
// //       if (authError || !user) throw new Error("User session expired. Please log in.");

// //       // Reusable upload helper
// //       const uploadFile = async (file, folder) => {
// //         if (!file) return null;
// //         const cleanPath = `${folder}/${sanitizeFileName(file)}`;
// //         const { data, error } = await supabase.storage
// //           .from("property-documents")
// //           .upload(cleanPath, file);
// //         if (error) throw new Error(`${folder} upload failed: ${error.message}`);
// //         return data.path;
// //       };

// //       // 1. Upload Core Files & Image in Parallel
// //       const [leaseUrl, floorUrl, insuranceUrl, imageUrl] = await Promise.all([
// //         uploadFile(formData.leaseFile, "lease"),
// //         uploadFile(formData.floorPlanFile, "floorplans"),
// //         uploadFile(formData.insuranceFile, "insurance"),
// //         uploadFile(formData.propertyImage, "property-images")
// //       ]);

// //       // 2. Insert Main Property Record
// //       const { data: property, error: propertyError } = await supabase
// //         .from("properties")
// //         .insert({
// //           property_name: formData.propertyName,
// //           address: formData.address,
// //           city: formData.city,
// //           postcode: formData.postcode,
// //           organisation: formData.organisation,
// //           manager: user.email,
// //           status: formData.status,
// //           rooms: parseInt(formData.rooms) || 0,
// //           rent: parseFloat(formData.rent) || 0,
// //           tenant_name: formData.tenantName,
// //           image_url: imageUrl, // Saved Path
// //           lease_url: leaseUrl,
// //           floor_plan_url: floorUrl,
// //           insurance_url: insuranceUrl,
// //           created_by: user.id,
// //         })
// //         .select()
// //         .single();

// //       if (propertyError) throw propertyError;

// //       // 3. Upload & Insert Dynamic Certificates
// //       const certTasks = certificates.map(async (cert) => {
// //         if (!cert.file || !cert.type) return;
// //         const filePath = await uploadFile(cert.file, "certificates");
// //         return supabase.from("property_certificates").insert({
// //           property_id: property.id,
// //           certificate_type: cert.type,
// //           expiry_date: cert.expiry,
// //           document_url: filePath,
// //         });
// //       });

// //       await Promise.all(certTasks);

// //       toast.success("Property saved successfully!", { id: toastId });
// //       router.refresh();
// //       router.push('/properties');

// //     } catch (err) {
// //       console.error("Submit error:", err);
// //       toast.error(err.message || "An unexpected error occurred", { id: toastId });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen p-4 md:p-8">
// //       <Card className="max-w-4xl mx-auto border-[#e1dbd2] shadow-sm">
// //         <CardHeader className="border-b border-[#e1dbd2] mb-6">
// //           <CardTitle className="text-[#123d2b] text-xl md:text-2xl font-bold flex items-center gap-2">
// //             <Home className="w-6 h-6" />
// //             Property Onboarding
// //           </CardTitle>
// //         </CardHeader>

// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-8">
            
// //             {/* Section 1: Property Information & Image */}
// //             <div className="space-y-6">
// //               <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
// //                 <FileText className="w-4 h-4" /> Property Information
// //               </h3>
              
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 {/* Image Upload Area */}
// //                 <div className="md:col-span-1">
// //                   <Label className="mb-2 block text-sm font-medium">Property Photo</Label>
// //                   <div 
// //                     className={`relative group border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
// //                       ${imagePreview ? 'border-none' : 'border-[#e1dbd2] bg-[#fbf8f2] hover:bg-[#f7f2e9]'}`}
// //                     onClick={() => document.getElementById('propertyImage').click()}
// //                   >
// //                     {imagePreview ? (
// //                       <>
// //                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
// //                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
// //                           <p className="text-white text-xs font-bold uppercase tracking-wider">Change Photo</p>
// //                         </div>
// //                       </>
// //                     ) : (
// //                       <div className="text-center px-4">
// //                         <ImageIcon className="w-8 h-8 text-[#1f6b4a] mx-auto mb-2 opacity-50" />
// //                         <p className="text-[10px] text-[#123d2b] font-bold uppercase">Upload Image</p>
// //                       </div>
// //                     )}
// //                   </div>
// //                   <Input 
// //                     id="propertyImage" 
// //                     type="file" 
// //                     accept="image/*" 
// //                     className="hidden" 
// //                     onChange={(e) => handleStaticFile(e, 'propertyImage')} 
// //                   />
// //                 </div>

// //                 {/* Text Inputs Area */}
// //                 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <div className="space-y-2 col-span-1 sm:col-span-2">
// //                     <Label htmlFor="propertyName">Property Name</Label>
// //                     <Input
// //                       id="propertyName"
// //                       required
// //                       placeholder="e.g. Oakwood Manor"
// //                       className="bg-[#e1dbd2] border-none focus-visible:ring-[#1f6b4a]"
// //                       value={formData.propertyName}
// //                       onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="address">Address</Label>
// //                     <Input
// //                       id="address"
// //                       placeholder="123 Street Name"
// //                       className="bg-[#e1dbd2] border-none"
// //                       value={formData.address}
// //                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="city">City</Label>
// //                     <Input 
// //                       id="city" 
// //                       className="bg-[#e1dbd2] border-none" 
// //                       value={formData.city}
// //                       onChange={(e) => setFormData({ ...formData, city: e.target.value })}
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="postcode">Postcode</Label>
// //                     <Input 
// //                       id="postcode" 
// //                       className="bg-[#e1dbd2] border-none" 
// //                       value={formData.postcode}
// //                       onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <Separator className="bg-[#e1dbd2]" />

// //             {/* Section 2: Management & Occupancy */}
// //             <div className="space-y-4">
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
// //                 <div className="space-y-2">
// //                   <Label>Organisation</Label>
// //                   <Select 
// //                     value={formData.organisation}
// //                     onValueChange={(val) => setFormData({ ...formData, organisation: val })}
// //                   >
// //                     <SelectTrigger className="bg-[#e1dbd2] border-none">
// //                       <SelectValue placeholder="Select Org" />
// //                     </SelectTrigger>
// //                     <SelectContent className="bg-[#fbf8f2]">
// //                       <SelectItem value="Kenley Group">Kenley Group</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label>Status</Label>
// //                   <Select 
// //                     value={formData.status} 
// //                     onValueChange={(val) => setFormData({ ...formData, status: val })}
// //                   >
// //                     <SelectTrigger className="bg-[#e1dbd2] border-none">
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent className="bg-[#fbf8f2]">
// //                       <SelectItem value="Active">Active</SelectItem>
// //                       <SelectItem value="Inactive">Inactive</SelectItem>
// //                       <SelectItem value="Onboarding">Onboarding</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="rent">Monthly Rent (£)</Label>
// //                   <Input 
// //                     id="rent" 
// //                     type="number" 
// //                     className="bg-[#e1dbd2] border-none" 
// //                     value={formData.rent}
// //                     onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="rooms">Total Rooms</Label>
// //                   <Input 
// //                     id="rooms" 
// //                     type="number" 
// //                     className="bg-[#e1dbd2] border-none" 
// //                     value={formData.rooms}
// //                     onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <Separator className="bg-[#e1dbd2]" />

// //             {/* Section 3: Compliance & Documents */}
// //             <div className="space-y-4">
// //               <div className="flex items-center justify-between">
// //                 <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
// //                   <ShieldCheck className="w-4 h-4" /> Compliance & Certificates
// //                 </h3>
// //                 <Button
// //                   type="button"
// //                   onClick={addCertificate}
// //                   className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white h-8 w-8 p-0 rounded-full"
// //                 >
// //                   <Plus className="w-5 h-5" />
// //                 </Button>
// //               </div>

// //               {certificates.map((cert, index) => (
// //                 <div key={cert.id} className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50 transition-all">
// //                   {certificates.length > 1 && (
// //                     <button
// //                       type="button"
// //                       onClick={() => removeCertificate(cert.id)}
// //                       className="absolute -right-2 -top-2 bg-[#dc2626] text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10"
// //                     >
// //                       <Trash2 className="w-3 h-3" />
// //                     </button>
// //                   )}

// //                   <div className="space-y-2">
// //                     <Label>Certificate Type</Label>
// //                     <Select 
// //                       value={cert.type}
// //                       onValueChange={(val) => {
// //                         const newCerts = [...certificates];
// //                         newCerts[index].type = val;
// //                         setCertificates(newCerts);
// //                       }}
// //                     >
// //                       <SelectTrigger className="bg-[#e1dbd2] border-none">
// //                         <SelectValue placeholder="Select Type" />
// //                       </SelectTrigger>
// //                       <SelectContent className="bg-[#fbf8f2]">
// //                         <SelectItem value="gas">Gas Safety</SelectItem>
// //                         <SelectItem value="fire">Fire Risk Assessment</SelectItem>
// //                         <SelectItem value="epc">EPC</SelectItem>
// //                         <SelectItem value="elec">Electrical</SelectItem>
// //                       </SelectContent>
// //                     </Select>
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label>Expiry Date</Label>
// //                     <Input
// //                       type="date"
// //                       className="bg-[#e1dbd2] border-none w-full"
// //                       value={cert.expiry}
// //                       onChange={(e) => {
// //                         const newCerts = [...certificates];
// //                         newCerts[index].expiry = e.target.value;
// //                         setCertificates(newCerts);
// //                       }}
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label>Upload Certificate</Label>
// //                     <div className="relative">
// //                       <Input
// //                         type="file"
// //                         className="hidden"
// //                         accept=".pdf,.doc,.docx"
// //                         id={`file-cert-${cert.id}`}
// //                         onChange={(e) => {
// //                           const newCerts = [...certificates];
// //                           newCerts[index].file = e.target.files[0];
// //                           setCertificates(newCerts);
// //                         }}
// //                       />
// //                       <Label
// //                         htmlFor={`file-cert-${cert.id}`}
// //                         className="flex flex-col items-center justify-center gap-1 bg-[#e8e1d6] text-[#123d2b] px-4 py-2 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] text-sm"
// //                       >
// //                         <div className="flex items-center gap-2">
// //                           <Upload className="w-4 h-4 shrink-0" />
// //                           <span>{cert.file ? "Change" : "Choose File"}</span>
// //                         </div>
// //                         {cert.file && (
// //                           <span className="text-[10px] truncate max-w-[150px] opacity-70">
// //                             {cert.file.name}
// //                           </span>
// //                         )}
// //                       </Label>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}

// //               <div className="bg-[#e6f2ec] p-4 rounded-lg border border-[#1f6b4a]/20 mt-6">
// //                 <p className="text-[#15573c] text-sm font-semibold mb-4">Required Documents:</p>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// //                   {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((field) => (
// //                     <div key={field} className="space-y-2">
// //                       <Label htmlFor={field} className="text-xs font-bold uppercase text-[#123d2b]">
// //                         {field.replace(/([A-Z])/g, ' $1').replace('File', '')}
// //                       </Label>
// //                       <div className="relative">
// //                         <Input 
// //                           type="file" 
// //                           className="hidden" 
// //                           accept=".pdf,.doc,.docx"
// //                           id={field} 
// //                           onChange={(e) => handleStaticFile(e, field)} 
// //                         />
// //                         <Label htmlFor={field} className="flex flex-col items-center justify-center gap-1 bg-[#f7f2e9] text-[#123d2b] px-3 py-3 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] transition-colors">
// //                           <div className="flex items-center gap-2 text-xs">
// //                             <Upload className="w-3 h-3" /> {formData[field] ? "Change File" : "Upload"}
// //                           </div>
// //                           {formData[field] && (
// //                             <span className="text-[10px] text-[#1f6b4a] font-medium truncate w-full text-center px-2">
// //                               {formData[field].name}
// //                             </span>
// //                           )}
// //                         </Label>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="pt-6">
// //               <Button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full md:w-auto bg-[#1f6b4a] hover:bg-[#123d2b] text-[#f7f2e9] px-12 py-6 text-lg shadow-lg transition-all"
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
// //                     Saving Profile...
// //                   </>
// //                 ) : (
// //                   "Save Property Profile"
// //                 )}
// //               </Button>
// //             </div>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/superbase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Upload, Home, ShieldCheck, FileText, Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
// import { toast } from "sonner";

// // 1. Helper: Sanitize file names
// const sanitizeFileName = (file) => {
//   const extension = file.name.split('.').pop();
//   const name = file.name.split('.').shift().replace(/[^a-z0-9]/gi, '_').toLowerCase();
//   return `${Date.now()}_${name}.${extension}`;
// };

// // 2. Helper: Client-side Image Compression
// const compressImage = (file) => {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event) => {
//       const img = new Image();
//       img.src = event.target.result;
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const MAX_WIDTH = 1200;
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
        
//         canvas.toBlob((blob) => {
//           resolve(new File([blob], file.name, { type: "image/jpeg" }));
//         }, "image/jpeg", 0.8);
//       };
//     };
//   });
// };

// export default function AddPropertyForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [certificates, setCertificates] = useState([]);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formData, setFormData] = useState({
//     propertyName: "",
//     address: "",
//     city: "",
//     postcode: "",
//     organisation: "Kenley Group",
//     manager: "",
//     status: "Active",
//     rooms: "",
//     rent: "",
//     tenantName: "",
//     propertyImage: null,
//     leaseFile: null,
//     floorPlanFile: null,
//     insuranceFile: null,
//   });

//   useEffect(() => {
//     setCertificates([{ id: crypto.randomUUID(), type: "", expiry: "", file: null }]);
//   }, []);

//   const addCertificate = () => {
//     setCertificates([...certificates, { id: crypto.randomUUID(), type: "", expiry: "", file: null }]);
//   };

//   const removeCertificate = (id) => {
//     if (certificates.length > 1) {
//       setCertificates(certificates.filter((cert) => cert.id !== id));
//     }
//   };

//   const handleStaticFile = (e, field) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, [field]: file }));
//       if (field === 'propertyImage') {
//         if (imagePreview) URL.revokeObjectURL(imagePreview);
//         setImagePreview(URL.createObjectURL(file));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);
//     const toastId = toast.loading("Optimizing files and saving property...");

//     try {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();
//       if (authError || !user) throw new Error("User session expired. Please log in.");

//       const uploadFile = async (file, folder) => {
//         if (!file) return null;
//         const cleanPath = `${folder}/${sanitizeFileName(file)}`;
//         const { data, error } = await supabase.storage
//           .from("property-documents")
//           .upload(cleanPath, file);
//         if (error) throw new Error(`${folder} upload failed: ${error.message}`);
//         return data.path;
//       };

//       // OPTIMIZATION: Process Image
//       let finalImage = formData.propertyImage;
//       if (finalImage && finalImage.type.startsWith("image/")) {
//         finalImage = await compressImage(finalImage);
//       }

//       // OPTIMIZATION: Parallel Core Uploads
//       const [leaseUrl, floorUrl, insuranceUrl, imageUrl] = await Promise.all([
//         uploadFile(formData.leaseFile, "lease"),
//         uploadFile(formData.floorPlanFile, "floorplans"),
//         uploadFile(formData.insuranceFile, "insurance"),
//         uploadFile(finalImage, "property-images")
//       ]);

//       // Insert Record
//       const { data: property, error: propertyError } = await supabase
//         .from("properties")
//         .insert({
//           property_name: formData.propertyName,
//           address: formData.address,
//           city: formData.city,
//           postcode: formData.postcode,
//           organisation: formData.organisation,
//           manager: user.email,
//           status: formData.status,
//           rooms: parseInt(formData.rooms) || 0,
//           rent: parseFloat(formData.rent) || 0,
//           tenant_name: formData.tenantName,
//           image_url: imageUrl,
//           lease_url: leaseUrl,
//           floor_plan_url: floorUrl,
//           insurance_url: insuranceUrl,
//           created_by: user.id,
//         })
//         .select()
//         .single();

//       if (propertyError) throw propertyError;

//       // OPTIMIZATION: Parallel Certificate Uploads
//       const certTasks = certificates.map(async (cert) => {
//         if (!cert.file || !cert.type) return;
//         const filePath = await uploadFile(cert.file, "certificates");
//         return supabase.from("property_certificates").insert({
//           property_id: property.id,
//           certificate_type: cert.type,
//           expiry_date: cert.expiry,
//           document_url: filePath,
//         });
//       });

//       await Promise.all(certTasks);

//       toast.success("Property saved successfully!", { id: toastId });
//       router.refresh();
//       router.push('/properties');

//     } catch (err) {
//       toast.error(err.message || "An unexpected error occurred", { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 md:p-8">
//       <Card className="max-w-4xl mx-auto border-[#e1dbd2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2] mb-6">
//           <CardTitle className="text-[#123d2b] text-xl md:text-2xl font-bold flex items-center gap-2">
//             <Home className="w-6 h-6" /> Property Onboarding
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-8">
            
//             <div className="space-y-6">
//               <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
//                 <FileText className="w-4 h-4" /> Property Information
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Image Section */}
//                 <div className="md:col-span-1">
//                   <Label className="mb-2 block text-sm font-medium">Property Photo</Label>
//                   <div 
//                     className={`relative group border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
//                       ${imagePreview ? 'border-none' : 'border-[#e1dbd2] bg-[#fbf8f2] hover:bg-[#f7f2e9]'}`}
//                     onClick={() => document.getElementById('propertyImage').click()}
//                   >
//                     {imagePreview ? (
//                       <>
//                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
//                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
//                           <p className="text-white text-xs font-bold uppercase tracking-wider">Change Photo</p>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="text-center px-4">
//                         <ImageIcon className="w-8 h-8 text-[#1f6b4a] mx-auto mb-2 opacity-50" />
//                         <p className="text-[10px] text-[#123d2b] font-bold uppercase">Upload Image</p>
//                       </div>
//                     )}
//                   </div>
//                   <Input id="propertyImage" type="file" accept="image/*" className="hidden" onChange={(e) => handleStaticFile(e, 'propertyImage')} />
//                 </div>

//                 {/* Details Section */}
//                 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2 col-span-1 sm:col-span-2">
//                     <Label htmlFor="propertyName">Property Name</Label>
//                     <Input id="propertyName" required className="bg-[#e1dbd2] border-none" value={formData.propertyName} onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="address">Address</Label>
//                     <Input id="address" className="bg-[#e1dbd2] border-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="city">City</Label>
//                     <Input id="city" className="bg-[#e1dbd2] border-none" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="postcode">Postcode</Label>
//                     <Input id="postcode" className="bg-[#e1dbd2] border-none" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* Management Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="space-y-2">
//                 <Label>Organisation</Label>
//                 <Select value={formData.organisation} onValueChange={(val) => setFormData({ ...formData, organisation: val })}>
//                   <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
//                   <SelectContent className="bg-[#fbf8f2]">
//                     <SelectItem value="Kenley Group">Kenley Group</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Status</Label>
//                 <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
//                   <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
//                   <SelectContent className="bg-[#fbf8f2]">
//                     <SelectItem value="Active">Active</SelectItem>
//                     <SelectItem value="Onboarding">Onboarding</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="rooms">Total Rooms</Label>
//                 <Input id="rooms" type="number" className="bg-[#e1dbd2] border-none" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="rent">Monthly Rent (£)</Label>
//                 <Input id="rent" type="number" className="bg-[#e1dbd2] border-none" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} />
//               </div>
//             </div>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* Compliance Section */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance</h3>
//                 <Button type="button" onClick={addCertificate} className="bg-[#1f6b4a] h-8 w-8 p-0 rounded-full"><Plus className="w-5 h-5" /></Button>
//               </div>
//               {certificates.map((cert, index) => (
//                 <div key={cert.id} className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50">
//                   {certificates.length > 1 && (
//                     <button type="button" onClick={() => removeCertificate(cert.id)} className="absolute -right-2 -top-2 bg-[#dc2626] text-white rounded-full p-1"><Trash2 className="w-3 h-3" /></button>
//                   )}
//                   <div className="space-y-2">
//                     <Label>Type</Label>
//                     <Select value={cert.type} onValueChange={(val) => { const n = [...certificates]; n[index].type = val; setCertificates(n); }}>
//                       <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue placeholder="Select" /></SelectTrigger>
//                       <SelectContent className="bg-[#fbf8f2]">
//                         <SelectItem value="gas">Gas Safety</SelectItem>
//                         <SelectItem value="fire">Fire Risk</SelectItem>
//                         <SelectItem value="epc">EPC</SelectItem>
//                         <SelectItem value="elec">Electrical</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Expiry</Label>
//                     <Input type="date" className="bg-[#e1dbd2] border-none" value={cert.expiry} onChange={(e) => { const n = [...certificates]; n[index].expiry = e.target.value; setCertificates(n); }} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>File</Label>
//                     <Input type="file" className="hidden" accept=".pdf,.doc,.docx" id={`f-${cert.id}`} onChange={(e) => { const n = [...certificates]; n[index].file = e.target.files[0]; setCertificates(n); }} />
//                     <Label htmlFor={`f-${cert.id}`} className="flex items-center gap-2 bg-[#e8e1d6] px-4 py-2 rounded-md cursor-pointer text-sm">
//                       <Upload className="w-4 h-4" /> <span>{cert.file ? cert.file.name : "Choose File"}</span>
//                     </Label>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Bottom Documents */}
//             <div className="bg-[#e6f2ec] p-4 rounded-lg border border-[#1f6b4a]/20">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((f) => (
//                   <div key={f} className="space-y-2">
//                     <Label className="text-xs font-bold uppercase">{f.replace('File', '')}</Label>
//                     <Input type="file" className="hidden" accept=".pdf" id={f} onChange={(e) => handleStaticFile(e, f)} />
//                     <Label htmlFor={f} className="flex flex-col items-center gap-1 bg-[#f7f2e9] px-3 py-3 rounded-md cursor-pointer border border-[#e1dbd2]">
//                       <Upload className="w-3 h-3" /> <span className="text-xs">{formData[f] ? "Change" : "Upload"}</span>
//                       {formData[f] && <span className="text-[10px] truncate w-full text-center">{formData[f].name}</span>}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <Button type="submit" disabled={loading} className="w-full bg-[#1f6b4a] py-6 text-lg shadow-lg">
//               {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save Property Profile"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Home, ShieldCheck, FileText, Plus, Trash2, Loader2, ImageIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// 1. Helper: Sanitize file names
const sanitizeFileName = (file) => {
  const extension = file.name.split('.').pop();
  const name = file.name.split('.').shift().replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${Date.now()}_${name}.${extension}`;
};

// 2. Helper: Fast Image Compression (Lowers latency for high-res mobile photos)
const compressImage = (file) => {
  return new Promise((resolve) => {
    if (file.size < 500000) return resolve(file); // Don't compress if already small
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
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        }, "image/jpeg", 0.7);
      };
    };
  });
};

export default function AddPropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    postcode: "",
    organisation: "Kenley Group",
    manager: "",
    status: "Active",
    rooms: "",
    rent: "",
    tenantName: "",
    propertyImage: null,
    leaseFile: null,
    floorPlanFile: null,
    insuranceFile: null,
  });

  useEffect(() => {
    setCertificates([{ id: crypto.randomUUID(), type: "", expiry: "", file: null }]);
  }, []);

  const addCertificate = () => {
    setCertificates([...certificates, { id: crypto.randomUUID(), type: "", expiry: "", file: null }]);
  };

  const removeCertificate = (id) => {
    if (certificates.length > 1) {
      setCertificates(certificates.filter((cert) => cert.id !== id));
    }
  };

  const handleStaticFile = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      if (field === 'propertyImage') {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  // ... (helpers like sanitizeFileName and compressImage stay the same)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Processing and uploading all files...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in.");

      const uploadFile = async (file, folder) => {
        if (!file) return null;
        const cleanPath = `${folder}/${sanitizeFileName(file)}`;
        const { data, error } = await supabase.storage
          .from("property-documents")
          .upload(cleanPath, file);
        if (error) throw error;
        return data.path;
      };

      // 1. PRE-PROCESS & COMPRESS IMAGE
      let finalImage = formData.propertyImage;
      if (finalImage && finalImage.type.startsWith("image/")) {
        finalImage = await compressImage(finalImage);
      }

      // 2. PARALLEL UPLOAD (Fastest Way)
      // We trigger all uploads at the same time instead of one by one
      const [imageUrl, leaseUrl, floorUrl, insuranceUrl] = await Promise.all([
        uploadFile(finalImage, "property-images"),
        uploadFile(formData.leaseFile, "lease"),
        uploadFile(formData.floorPlanFile, "floorplans"),
        uploadFile(formData.insuranceFile, "insurance")
      ]);

      // 3. SAVE MAIN RECORD (Now with all URLs ready)
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          property_name: formData.propertyName,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          organisation: formData.organisation,
          manager: user.email,
          status: formData.status,
          rooms: parseInt(formData.rooms) || 0,
          rent: parseFloat(formData.rent) || 0,
          image_url: imageUrl,
          lease_url: leaseUrl,
          floor_plan_url: floorUrl,
          insurance_url: insuranceUrl,
          created_by: user.id,
        })
        .select().single();

      if (propertyError) throw propertyError;

      // 4. UPLOAD CERTIFICATES IN PARALLEL
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

      toast.success("Property and documents saved!", { id: toastId });
      
      // Navigate ONLY after everything is done to prevent data loss
      router.push('/properties');
      router.refresh();

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#fbf8f2]">
      <div className="max-w-4xl mx-auto mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto border-[#e1dbd2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2] mb-6">
          <CardTitle className="text-[#123d2b] text-xl md:text-2xl font-bold flex items-center gap-2">
            <Home className="w-6 h-6" /> Property Onboarding
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Basic Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Label className="mb-2 block text-sm font-medium">Property Photo (PNG, JPG)</Label>
                  <div 
                    className={`relative group border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
                      ${imagePreview ? 'border-none' : 'border-[#e1dbd2] bg-[#fbf8f2] hover:bg-[#f7f2e9]'}`}
                    onClick={() => document.getElementById('propertyImage').click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#1f6b4a] opacity-50" />
                    )}
                  </div>
                  <Input id="propertyImage" type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={(e) => handleStaticFile(e, 'propertyImage')} />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Property Name</Label>
                    <Input required className="bg-[#e1dbd2] border-none" value={formData.propertyName} onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Address</Label>
                    <Input className="bg-[#e1dbd2] border-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input className="bg-[#e1dbd2] border-none" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Postcode</Label>
                    <Input className="bg-[#e1dbd2] border-none" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#fbf8f2]">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Total Rooms</Label>
                <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Rent (£)</Label>
                <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} />
              </div>
              {/* <div className="space-y-2">
                <Label>Tenant Name</Label>
                <Input className="bg-[#e1dbd2] border-none" value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} />
              </div> */}
            </div>

            <Separator className="bg-[#e1dbd2]" />

            {/* Compliance Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance (PDF, DOC, DOCX)</h3>
                <Button type="button" onClick={addCertificate} className="bg-[#1f6b4a] h-8 w-8 p-0 rounded-full"><Plus className="w-5 h-5" /></Button>
              </div>
              {certificates.map((cert, index) => (
                <div key={cert.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={cert.type} onValueChange={(val) => { const n = [...certificates]; n[index].type = val; setCertificates(n); }}>
                      <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent className="bg-[#fbf8f2]">
                        <SelectItem value="gas">Gas Safety</SelectItem>
                        <SelectItem value="fire">Fire Risk</SelectItem>
                        <SelectItem value="epc">EPC</SelectItem>
                        <SelectItem value="elec">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input type="date" className="bg-[#e1dbd2] border-none" value={cert.expiry} onChange={(e) => { const n = [...certificates]; n[index].expiry = e.target.value; setCertificates(n); }} />
                  </div>
                  <div className="space-y-2">
                    <Label>File</Label>
                    <Input type="file" className="hidden" accept=".pdf,.doc,.docx" id={`f-${cert.id}`} onChange={(e) => { const n = [...certificates]; n[index].file = e.target.files[0]; setCertificates(n); }} />
                    <Label htmlFor={`f-${cert.id}`} className="flex items-center gap-2 bg-[#e8e1d6] px-4 py-2 rounded-md cursor-pointer text-xs truncate">
                      <Upload className="w-4 h-4 shrink-0" /> {cert.file ? cert.file.name : "Choose File"}
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#e6f2ec] p-4 rounded-lg border border-[#1f6b4a]/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((f) => (
                  <div key={f} className="space-y-2">
                    <Label className="text-xs font-bold uppercase">{f.replace('File', '')}</Label>
                    <Input type="file" className="hidden" accept=".pdf,.doc,.docx" id={f} onChange={(e) => handleStaticFile(e, f)} />
                    <Label htmlFor={f} className="flex flex-col items-center gap-1 bg-[#f7f2e9] px-3 py-3 rounded-md cursor-pointer border border-[#e1dbd2] text-xs">
                      <Upload className="w-3 h-3" /> {formData[f] ? "Change File" : "Upload Doc"}
                      {formData[f] && <span className="text-[10px] truncate w-full text-center text-[#1f6b4a] font-medium">{formData[f].name}</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#1f6b4a] py-6 text-lg shadow-lg hover:bg-[#123d2b]">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save Property Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}