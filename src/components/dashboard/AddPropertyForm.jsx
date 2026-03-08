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
// import { Upload, Home, ShieldCheck, FileText, Plus, Trash2, Loader2 } from "lucide-react";
// import { toast } from "sonner";

//   // Helper to sanitize file names (preventing issues with special characters in URLs)

// const sanitizeFileName = (file) => {
//   const extension = file.name.split('.').pop();
//   const name = file.name.split('.').shift().replace(/[^a-z0-9]/gi, '_').toLowerCase();
//   return `${Date.now()}_${name}.${extension}`;
// };

// /**
//  * HELPER: Cleans filenames to prevent 400 errors from Supabase
//  * Removes special characters (like apostrophes) and spaces.
//  */
// // const sanitizeFileName = (file) => {
// //   const extension = file.name.split('.').pop();
// //   const safeBaseName = file.name
// //     .split('.')[0]
// //     .replace(/[^a-z0-9]/gi, '_')
// //     .toLowerCase();
// //   return `${Date.now()}-${safeBaseName}.${extension}`;
// // };

// export default function AddPropertyForm() {
//   const router = useRouter(); // Initialize the router her

//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     propertyName: "",
//     address: "",
//     city: "",
//     postcode: "",
//     organisation: "",
//     manager: "",
//     status: "Active",
//     rooms: "",
//     rent: "",
//     tenantName: "",
//     leaseFile: null,
//     floorPlanFile: null,
//     insuranceFile: null,
//   });

//  const [certificates, setCertificates] = useState([]);

//  useEffect(() => {
//   setCertificates([
//     { id: crypto.randomUUID(), type: "", expiry: "", file: null },
//   ]);
// }, []);

//   const addCertificate = () => {
//   setCertificates([
//     ...certificates,
//     { id: crypto.randomUUID(), type: "", expiry: "", file: null },
//   ]);
// };

//   const removeCertificate = (id) => {
//     if (certificates.length > 1) {
//       setCertificates(certificates.filter((cert) => cert.id !== id));
//     }
//   };

//   const handleStaticFile = (e, field) => {
//     if (e.target.files?.[0]) {
//       setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
//     }
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (!user) throw new Error("User not logged in");

// //       let leaseUrl = null;
// //       let floorUrl = null;
// //       let insuranceUrl = null;

// //       // --- 1. Upload Lease ---
// //       if (formData.leaseFile) {
// //         const cleanPath = `lease/${sanitizeFileName(formData.leaseFile)}`;
// //         const { data, error } = await supabase.storage
// //           .from("property-documents")
// //           .upload(cleanPath, formData.leaseFile);
// //         if (error || !data) throw new Error(`Lease upload failed: ${error?.message}`);
// //         leaseUrl = data.path;
// //       }

// //       // --- 2. Upload Floor Plan ---
// //       if (formData.floorPlanFile) {
// //         const cleanPath = `floorplans/${sanitizeFileName(formData.floorPlanFile)}`;
// //         const { data, error } = await supabase.storage
// //           .from("property-documents")
// //           .upload(cleanPath, formData.floorPlanFile);
// //         if (error || !data) throw new Error(`Floor plan upload failed: ${error?.message}`);
// //         floorUrl = data.path;
// //       }

// //       // --- 3. Upload Insurance ---
// //       if (formData.insuranceFile) {
// //         const cleanPath = `insurance/${sanitizeFileName(formData.insuranceFile)}`;
// //         const { data, error } = await supabase.storage
// //           .from("property-documents")
// //           .upload(cleanPath, formData.insuranceFile);
// //         if (error || !data) throw new Error(`Insurance upload failed: ${error?.message}`);
// //         insuranceUrl = data.path;
// //       }

// //       // --- 4. Insert Property ---
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
// //           rooms: formData.rooms,
// //           rent: formData.rent,
// //           tenant_name: formData.tenantName,
// //           lease_url: leaseUrl,
// //           floor_plan_url: floorUrl,
// //           insurance_url: insuranceUrl,
// //           created_by: user.id,
// //         })
// //         .select()
// //         .single();

// //       if (propertyError) throw propertyError;

// //       // --- 5. Upload Certificates ---
// //       for (const cert of certificates) {
// //         if (!cert.file || !cert.type) continue;

// //         const cleanPath = `certificates/${sanitizeFileName(cert.file)}`;
// //         const { data, error } = await supabase.storage
// //           .from("property-documents")
// //           .upload(cleanPath, cert.file);

// //         if (!error && data) {
// //           await supabase.from("property_certificates").insert({
// //             property_id: property.id,
// //             certificate_type: cert.type,
// //             expiry_date: cert.expiry,
// //             document_url: data.path,
// //           });
// //         }
// //       }

// //       alert("Property saved successfully!");
// //     } catch (err) {
// //       console.error(err);
// //       alert(err.message || "An unexpected error occurred");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };





//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // 1. Start the loading toast
//     const toastId = toast.loading("Uploading documents and saving data...");

//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("User session expired. Please log in.");

//       let leaseUrl = null;
//       let floorUrl = null;
//       let insuranceUrl = null;

//       // --- 2. Upload Lease ---
//       if (formData.leaseFile) {
//         const cleanPath = `lease/${sanitizeFileName(formData.leaseFile)}`;
//         const { data, error } = await supabase.storage
//           .from("property-documents")
//           .upload(cleanPath, formData.leaseFile);
//         if (error || !data) throw new Error(`Lease upload failed: ${error?.message}`);
//         leaseUrl = data.path;
//       }

//       // --- 3. Upload Floor Plan ---
//       if (formData.floorPlanFile) {
//         const cleanPath = `floorplans/${sanitizeFileName(formData.floorPlanFile)}`;
//         const { data, error } = await supabase.storage
//           .from("property-documents")
//           .upload(cleanPath, formData.floorPlanFile);
//         if (error || !data) throw new Error(`Floor plan upload failed: ${error?.message}`);
//         floorUrl = data.path;
//       }

//       // --- 4. Upload Insurance ---
//       if (formData.insuranceFile) {
//         const cleanPath = `insurance/${sanitizeFileName(formData.insuranceFile)}`;
//         const { data, error } = await supabase.storage
//           .from("property-documents")
//           .upload(cleanPath, formData.insuranceFile);
//         if (error || !data) throw new Error(`Insurance upload failed: ${error?.message}`);
//         insuranceUrl = data.path;
//       }

//       // --- 5. Insert Main Property Record ---
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
//           rooms: formData.rooms,
//           rent: formData.rent,
//           tenant_name: formData.tenantName,
//           lease_url: leaseUrl,
//           floor_plan_url: floorUrl,
//           insurance_url: insuranceUrl,
//           created_by: user.id,
//         })
//         .select()
//         .single();

//       if (propertyError) throw propertyError;

//       // --- 6. Upload Dynamic Certificates ---
//       for (const cert of certificates) {
//         if (!cert.file || !cert.type) continue;

//         const cleanPath = `certificates/${sanitizeFileName(cert.file)}`;
//         const { data, error } = await supabase.storage
//           .from("property-documents")
//           .upload(cleanPath, cert.file);

//         if (error) {
//           toast.error(`Warning: Certificate ${cert.type} failed to upload.`);
//           continue; 
//         }

//         if (data) {
//           await supabase.from("property_certificates").insert({
//             property_id: property.id,
//             certificate_type: cert.type,
//             expiry_date: cert.expiry,
//             document_url: data.path,
//           });
//         }
//       }

//       // 7. Success! Replace the loading toast with success
//       toast.success("Property and documents saved successfully!", {
//         id: toastId,
//       });

//       // Optional: Reset form or redirect
//       router.push('/properties');

//     } catch (err) {
//       console.error(err);
//       // 8. Error! Replace the loading toast with the error message
//       toast.error(err.message || "An unexpected error occurred", {
//         id: toastId,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
//       <Card className="max-w-4xl mx-auto border-[#e1dbd2] bg-[#fbf8f2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2] mb-6">
//           <CardTitle className="text-[#123d2b] text-xl md:text-2xl font-bold flex items-center gap-2">
//             <Home className="w-6 h-6" />
//             Property Onboarding
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* --- Section 1: Property Information --- */}
//             <div className="space-y-4">
//               <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
//                 <FileText className="w-4 h-4" /> Property Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="propertyName">Property Name</Label>
//                   <Input
//                     id="propertyName"
//                     required
//                     placeholder="e.g. Oakwood Manor"
//                     className="bg-[#e1dbd2] border-none focus-visible:ring-[#1f6b4a]"
//                     onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address</Label>
//                   <Input
//                     id="address"
//                     placeholder="123 Street Name"
//                     className="bg-[#e1dbd2] border-none"
//                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="city">City</Label>
//                   <Input 
//                     id="city" 
//                     className="bg-[#e1dbd2] border-none" 
//                     onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="postcode">Postcode</Label>
//                   <Input 
//                     id="postcode" 
//                     className="bg-[#e1dbd2] border-none" 
//                     onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
//                   />
//                 </div>
//               </div>
//             </div>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* --- Section 2: Management & Occupancy --- */}
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Organisation</Label>
//                   <Select onValueChange={(val) => setFormData({ ...formData, organisation: val })}>
//                     <SelectTrigger className="bg-[#e1dbd2] border-none">
//                       <SelectValue placeholder="Select Org" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-[#fbf8f2]">
//                       <SelectItem value="Kenley Group">Kenley Group</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Status</Label>
//                   <Select defaultValue="Active" onValueChange={(val) => setFormData({ ...formData, status: val })}>
//                     <SelectTrigger className="bg-[#e1dbd2] border-none">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-[#fbf8f2]">
//                       <SelectItem value="Active">Active</SelectItem>
//                       <SelectItem value="Inactive">Inactive</SelectItem>
//                       <SelectItem value="Onboarding">Onboarding</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="rent">Monthly Rent (£)</Label>
//                   <Input 
//                     id="rent" 
//                     type="number" 
//                     className="bg-[#e1dbd2] border-none" 
//                     onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="rooms">Total Rooms</Label>
//                   <Input 
//                     id="rooms" 
//                     type="number" 
//                     className="bg-[#e1dbd2] border-none" 
//                     onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="tenant">Tenant Name</Label>
//                   <Input 
//                     id="tenant" 
//                     className="bg-[#e1dbd2] border-none" 
//                     onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
//                   />
//                 </div>
//               </div>
//             </div>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* --- Section 3: Compliance & Documents --- */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
//                   <ShieldCheck className="w-4 h-4" /> Compliance & Documents
//                 </h3>
//                 <Button
//                   type="button"
//                   onClick={addCertificate}
//                   className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white h-8 w-8 p-0 rounded-full"
//                 >
//                   <Plus className="w-5 h-5" />
//                 </Button>
//               </div>

//               {certificates.map((cert, index) => (
//                 <div key={cert.id} className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50 transition-all">
//                   {certificates.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeCertificate(cert.id)}
//                       className="absolute -right-2 -top-2 bg-[#dc2626] text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                   )}

//                   <div className="space-y-2">
//                     <Label>Certificate Type</Label>
//                     <Select onValueChange={(val) => {
//                       const newCerts = [...certificates];
//                       newCerts[index].type = val;
//                       setCertificates(newCerts);
//                     }}>
//                       <SelectTrigger className="bg-[#e1dbd2] border-none">
//                         <SelectValue placeholder="Select Type" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-[#fbf8f2]">
//                         <SelectItem value="gas">Gas Safety</SelectItem>
//                         <SelectItem value="fire">Fire Risk Assessment</SelectItem>
//                         <SelectItem value="epc">EPC</SelectItem>
//                         <SelectItem value="elec">Electrical</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Expiry Date</Label>
//                     <Input
//                       type="date"
//                       className="bg-[#e1dbd2] border-none w-full"
//                       onChange={(e) => {
//                         const newCerts = [...certificates];
//                         newCerts[index].expiry = e.target.value;
//                         setCertificates(newCerts);
//                       }}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Upload Certificate</Label>
//                     <div className="relative">
//                       <Input
//                         type="file"
//                         className="hidden"
//                         accept=".pdf,.doc,.docx"
//                         id={`file-cert-${cert.id}`}
//                         onChange={(e) => {
//                           const newCerts = [...certificates];
//                           newCerts[index].file = e.target.files[0];
//                           setCertificates(newCerts);
//                         }}
//                       />
//                       <Label
//                         htmlFor={`file-cert-${cert.id}`}
//                         className="flex flex-col items-center justify-center gap-1 bg-[#e8e1d6] text-[#123d2b] px-4 py-2 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] text-sm"
//                       >
//                         <div className="flex items-center gap-2">
//                           <Upload className="w-4 h-4 shrink-0" />
//                           <span>{cert.file ? "Change" : "Choose File"}</span>
//                         </div>
//                         {cert.file && (
//                           <span className="text-[10px] truncate max-w-37.5 opacity-70">
//                             {cert.file.name}
//                           </span>
//                         )}
//                       </Label>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* --- Section 4: Standard Required Documents --- */}
//               <div className="bg-[#e6f2ec] p-4 rounded-lg border border-[#1f6b4a]/20 mt-6">
//                 <p className="text-[#15573c] text-sm font-semibold mb-4">
//                   Required standard documents:
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                   {/* Lease Agreement */}
//                   <div className="space-y-2">
//                     <Label htmlFor="lease-upload" className="text-xs font-bold uppercase text-[#123d2b]">Lease Agreement</Label>
//                     <div className="relative">
//                       <Input type="file" className="hidden" accept=".pdf,.doc,.docx" id="lease-upload" onChange={(e) => handleStaticFile(e, 'leaseFile')} />
//                       <Label htmlFor="lease-upload" className="flex flex-col items-center justify-center gap-1 bg-[#f7f2e9] text-[#123d2b] px-3 py-3 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] transition-colors">
//                         <div className="flex items-center gap-2 text-xs">
//                           <Upload className="w-3 h-3" /> {formData.leaseFile ? "Change File" : "Upload"}
//                         </div>
//                         {formData.leaseFile && (
//                           <span className="text-[10px] text-[#1f6b4a] font-medium truncate w-full text-center px-2">
//                             {formData.leaseFile.name}
//                           </span>
//                         )}
//                       </Label>
//                     </div>
//                   </div>

//                   {/* Floor Plan */}
//                   <div className="space-y-2">
//                     <Label htmlFor="floor-upload" className="text-xs font-bold uppercase text-[#123d2b]">Floor Plan</Label>
//                     <div className="relative">
//                       <Input type="file" className="hidden" id="floor-upload" accept=".pdf,.doc,.docx" onChange={(e) => handleStaticFile(e, 'floorPlanFile')} />
//                       <Label htmlFor="floor-upload" className="flex flex-col items-center justify-center gap-1 bg-[#f7f2e9] text-[#123d2b] px-3 py-3 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] transition-colors">
//                         <div className="flex items-center gap-2 text-xs">
//                           <Upload className="w-3 h-3" /> {formData.floorPlanFile ? "Change File" : "Upload"}
//                         </div>
//                         {formData.floorPlanFile && (
//                           <span className="text-[10px] text-[#1f6b4a] font-medium truncate w-full text-center px-2">
//                             {formData.floorPlanFile.name}
//                           </span>
//                         )}
//                       </Label>
//                     </div>
//                   </div>

//                   {/* Insurance Policy */}
//                   <div className="space-y-2">
//                     <Label htmlFor="insurance-upload" className="text-xs font-bold uppercase text-[#123d2b]">Insurance Policy</Label>
//                     <div className="relative">
//                       <Input type="file" className="hidden" id="insurance-upload" accept=".pdf,.doc,.docx" onChange={(e) => handleStaticFile(e, 'insuranceFile')} />
//                       <Label htmlFor="insurance-upload" className="flex flex-col items-center justify-center gap-1 bg-[#f7f2e9] text-[#123d2b] px-3 py-3 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] transition-colors">
//                         <div className="flex items-center gap-2 text-xs">
//                           <Upload className="w-3 h-3" /> {formData.insuranceFile ? "Change File" : "Upload"}
//                         </div>
//                         {formData.insuranceFile && (
//                           <span className="text-[10px] text-[#1f6b4a] font-medium truncate w-full text-center px-2">
//                             {formData.insuranceFile.name}
//                           </span>
//                         )}
//                       </Label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-6">
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full md:w-auto bg-[#1f6b4a] hover:bg-[#123d2b] text-[#f7f2e9] px-12 py-6 text-lg shadow-lg transition-all"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Property Profile"
//                 )}
//               </Button>
//             </div>
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
import { Upload, Home, ShieldCheck, FileText, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Helper to sanitize file names
const sanitizeFileName = (file) => {
  const extension = file.name.split('.').pop();
  const name = file.name.split('.').shift().replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${Date.now()}_${name}.${extension}`;
};

export default function AddPropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 1. Initialize with an empty array and use useEffect to add the first cert
  // This prevents hydration mismatches with crypto.randomUUID()
  const [certificates, setCertificates] = useState([]);

  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    postcode: "",
    organisation: "",
    manager: "",
    status: "Active",
    rooms: "",
    rent: "",
    tenantName: "",
    leaseFile: null,
    floorPlanFile: null,
    insuranceFile: null,
  });

  useEffect(() => {
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

  const handleStaticFile = (e, field) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Processing upload...");

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("User session expired. Please log in.");

      // Reusable upload helper
      const uploadFile = async (file, folder) => {
        if (!file) return null;
        const cleanPath = `${folder}/${sanitizeFileName(file)}`;
        const { data, error } = await supabase.storage
          .from("property-documents")
          .upload(cleanPath, file);
        if (error) throw new Error(`${folder} upload failed: ${error.message}`);
        return data.path;
      };

      // 2. Upload Core Files in Parallel
      const [leaseUrl, floorUrl, insuranceUrl] = await Promise.all([
        uploadFile(formData.leaseFile, "lease"),
        uploadFile(formData.floorPlanFile, "floorplans"),
        uploadFile(formData.insuranceFile, "insurance")
      ]);

      // 3. Insert Main Property Record
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
          tenant_name: formData.tenantName,
          lease_url: leaseUrl,
          floor_plan_url: floorUrl,
          insurance_url: insuranceUrl,
          created_by: user.id,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // 4. Upload & Insert Dynamic Certificates
      const certTasks = certificates.map(async (cert) => {
        if (!cert.file || !cert.type) return;
        const filePath = await uploadFile(cert.file, "certificates");
        return supabase.from("property_certificates").insert({
          property_id: property.id,
          certificate_type: cert.type,
          expiry_date: cert.expiry,
          document_url: filePath,
        });
      });

      await Promise.all(certTasks);

      toast.success("Property saved successfully!", { id: toastId });
      
      // Refresh to ensure server components update, then redirect
      router.refresh();
      router.push('/properties');

    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message || "An unexpected error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
      <Card className="max-w-4xl mx-auto border-[#e1dbd2] bg-[#fbf8f2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2] mb-6">
          <CardTitle className="text-[#123d2b] text-xl md:text-2xl font-bold flex items-center gap-2">
            <Home className="w-6 h-6" />
            Property Onboarding
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Property Information */}
            <div className="space-y-4">
              <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Property Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    required
                    placeholder="e.g. Oakwood Manor"
                    className="bg-[#e1dbd2] border-none focus-visible:ring-[#1f6b4a]"
                    value={formData.propertyName}
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Street Name"
                    className="bg-[#e1dbd2] border-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    className="bg-[#e1dbd2] border-none" 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input 
                    id="postcode" 
                    className="bg-[#e1dbd2] border-none" 
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            {/* Section 2: Management & Occupancy */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Organisation</Label>
                  <Select 
                    value={formData.organisation}
                    onValueChange={(val) => setFormData({ ...formData, organisation: val })}
                  >
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue placeholder="Select Org" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fbf8f2]">
                      <SelectItem value="Kenley Group">Kenley Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fbf8f2]">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Onboarding">Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent (£)</Label>
                  <Input 
                    id="rent" 
                    type="number" 
                    className="bg-[#e1dbd2] border-none" 
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rooms">Total Rooms</Label>
                  <Input 
                    id="rooms" 
                    type="number" 
                    className="bg-[#e1dbd2] border-none" 
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant Name</Label>
                  <Input 
                    id="tenant" 
                    className="bg-[#e1dbd2] border-none" 
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  />
                </div> */}
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            {/* Section 3: Compliance & Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Compliance & Documents
                </h3>
                <Button
                  type="button"
                  onClick={addCertificate}
                  className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white h-8 w-8 p-0 rounded-full"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {certificates.map((cert, index) => (
                <div key={cert.id} className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50 transition-all">
                  {certificates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCertificate(cert.id)}
                      className="absolute -right-2 -top-2 bg-[#dc2626] text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  <div className="space-y-2">
                    <Label>Certificate Type</Label>
                    <Select 
                      value={cert.type}
                      onValueChange={(val) => {
                        const newCerts = [...certificates];
                        newCerts[index].type = val;
                        setCertificates(newCerts);
                      }}
                    >
                      <SelectTrigger className="bg-[#e1dbd2] border-none">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#fbf8f2]">
                        <SelectItem value="gas">Gas Safety</SelectItem>
                        <SelectItem value="fire">Fire Risk Assessment</SelectItem>
                        <SelectItem value="epc">EPC</SelectItem>
                        <SelectItem value="elec">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      className="bg-[#e1dbd2] border-none w-full"
                      value={cert.expiry}
                      onChange={(e) => {
                        const newCerts = [...certificates];
                        newCerts[index].expiry = e.target.value;
                        setCertificates(newCerts);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Certificate</Label>
                    <div className="relative">
                      <Input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        id={`file-cert-${cert.id}`}
                        onChange={(e) => {
                          const newCerts = [...certificates];
                          newCerts[index].file = e.target.files[0];
                          setCertificates(newCerts);
                        }}
                      />
                      <Label
                        htmlFor={`file-cert-${cert.id}`}
                        className="flex flex-col items-center justify-center gap-1 bg-[#e8e1d6] text-[#123d2b] px-4 py-2 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 shrink-0" />
                          <span>{cert.file ? "Change" : "Choose File"}</span>
                        </div>
                        {cert.file && (
                          <span className="text-[10px] truncate max-w-37.5 opacity-70">
                            {cert.file.name}
                          </span>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}

              {/* Required Documents Grid */}
              <div className="bg-[#e6f2ec] p-4 rounded-lg border border-[#1f6b4a]/20 mt-6">
                <p className="text-[#15573c] text-sm font-semibold mb-4">Required standard documents:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-xs font-bold uppercase text-[#123d2b]">
                        {field.replace(/([A-Z])/g, ' $1').replace('File', '')}
                      </Label>
                      <div className="relative">
                        <Input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          id={field} 
                          onChange={(e) => handleStaticFile(e, field)} 
                        />
                        <Label htmlFor={field} className="flex flex-col items-center justify-center gap-1 bg-[#f7f2e9] text-[#123d2b] px-3 py-3 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] transition-colors">
                          <div className="flex items-center gap-2 text-xs">
                            <Upload className="w-3 h-3" /> {formData[field] ? "Change File" : "Upload"}
                          </div>
                          {formData[field] && (
                            <span className="text-[10px] text-[#1f6b4a] font-medium truncate w-full text-center px-2">
                              {formData[field].name}
                            </span>
                          )}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-[#1f6b4a] hover:bg-[#123d2b] text-[#f7f2e9] px-12 py-6 text-lg shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Property Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}