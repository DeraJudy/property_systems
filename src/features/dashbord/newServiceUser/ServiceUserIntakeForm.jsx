// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Plus,
//   Trash2,
//   Upload,
//   User,
//   Users,
//   Home,
//   FileText,
//   Activity,
//   CheckCircle,
//   ArrowLeft
// } from "lucide-react";
// import { createClient } from "@/lib/superbase/clientUtils"; // Double check this path
// import { toast } from "sonner";

// // Initialize Supabase Client
// const supabase = createClient();

// // --- Reusable UI Components ---
// const Label = ({ children, className = "", htmlFor }) => (
//   <label htmlFor={htmlFor} className={`block text-sm font-semibold text-[#123d2b] mb-2 ${className}`}>
//     {children}
//   </label>
// );

// const Input = ({ className = "", ...props }) => (
//   <input
//     className={`w-full p-3 text-sm rounded-lg border border-[#e1dbd2] bg-white text-[#123d2b] placeholder-[#6b7d74] focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] transition-all ${className}`}
//     {...props}
//   />
// );

// const Button = ({ children, variant = "primary", className = "", ...props }) => {
//   const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 text-sm active:scale-95";
//   const variants = {
//     primary: "bg-[#1f6b4a] text-[#f7f2e9] hover:bg-[#123d2b] shadow-md px-6 py-3",
//     outline: "border border-[#e1dbd2] text-[#123d2b] hover:bg-[#e8e1d6] px-6 py-3",
//   };
//   return (
//     <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
//       {children}
//     </button>
//   );
// };

// const NativeSelect = ({ className = "", children, ...props }) => (
//   <select
//     className={`w-full p-3 text-sm rounded-lg border border-[#e1dbd2] bg-white text-[#123d2b] focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] transition-all ${className}`}
//     {...props}
//   >
//     {children}
//   </select>
// );

// // --- Custom Select for "Approved By" ---
// const Select = ({ children, onValueChange }) => (
//   <div className="relative w-full" onChange={(e) => onValueChange(e.target.value)}>{children}</div>
// );
// const SelectTrigger = ({ children, className }) => (
//   <div className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] ${className}`}>{children}</div>
// );
// const SelectValue = ({ placeholder }) => <span className="text-[#6b7d74]">{placeholder}</span>;
// const SelectContent = ({ children }) => <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">{children}</select>;
// const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;

// export default function ServiceUserIntakeForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [approvedByList, setApprovedByList] = useState([]);
//   const [customDocuments, setCustomDocuments] = useState([]);
  
//   const [filePaths, setFilePaths] = useState({
//     id_v: null, benefit: null, risk: null, medical: null,
//   });

//   const [formData, setFormData] = useState({
//     title: "", first_name: "", surname: "", dob: "", age: "",
//     gender: "", ni_number: "", contact_number: "", email: "",
//     organisation: "", ethnic_group: "", ethnic_origin: "",
//     property_name: "", assigned_room: "", street_address: "",
//     previous_address: "", assigned_to: "", approved_by: "",
//     nok_name: "", nok_relationship: "", nok_phone: "",
//     nok_email: "", nok_address: ""
//   });

//   const allowedFileTypes = ".pdf,.doc,.docx,image/*";

//   // --- FIXED: handleSelectChange logic ---
//   const handleSelectChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // --- Helper: Automatic Upload ---
//   const handleAutoUpload = async (file, folder, fieldKey, isCustom = false, customIndex = null) => {
//     if (!file) return;

//     const promise = new Promise(async (resolve, reject) => {
//       try {
//         const fileExt = file.name.split('.').pop();
//         const fileName = `${Math.random()}.${fileExt}`;
//         const filePath = `${folder}/${fileName}`;

//         const { error: uploadError } = await supabase.storage
//           .from('service-user-docs')
//           .upload(filePath, file);

//         if (uploadError) throw uploadError;

//         if (isCustom) {
//           const newDocs = [...customDocuments];
//           newDocs[customIndex].path = filePath;
//           newDocs[customIndex].fileName = file.name;
//           setCustomDocuments(newDocs);
//         } else {
//           setFilePaths(prev => ({ ...prev, [fieldKey]: filePath }));
//         }
//         resolve(filePath);
//       } catch (err) {
//         reject(err);
//       }
//     });

//     toast.promise(promise, {
//       loading: `Uploading ${file.name}...`,
//       success: 'File uploaded successfully',
//       error: (err) => `Upload failed: ${err.message}`,
//     });
//   };

//   useEffect(() => {
//     const fetchStaff = async () => {
//       const { data } = await supabase
//         .from("profiles")
//         .select("full_name, role");
//       if (data) {
//         setApprovedByList(data.filter((u) => u.role === "admin" || u.role === "hr"));
//       }
//     };
//     fetchStaff();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDobChange = (e) => {
//     const birthDateStr = e.target.value;
//     const today = new Date();
//     const birthDate = new Date(birthDateStr);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     if (new Date(today.getFullYear(), today.getMonth(), today.getDate()) < 
//         new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
//       age--;
//     }
//     setFormData(prev => ({ ...prev, dob: birthDateStr, age: age }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Simple check for essential fields
//     if (!formData.first_name || !formData.surname) {
//         const confirmIncomplete = window.confirm("Some fields are empty. Are you sure you want to submit anyway?");
//         if (!confirmIncomplete) return;
//     }

//     setLoading(true);
//     try {
//       const { error } = await supabase
//         .from('service_users_table')
//         .insert([{
//           ...formData,
//           id_v_path: filePaths.id_v,
//           benefit_letter_path: filePaths.benefit,
//           risk_assessment_path: filePaths.risk,
//           medical_doc_path: filePaths.medical,
//           additional_docs: customDocuments.map(d => ({ name: d.name, path: d.path }))
//         }]);

//       if (error) throw error;
//       toast.success("Registration Successful!");
//       router.push("/dashboard");
//     } catch (err) {
//       toast.error(`Error saving data: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f5f0e6] py-12 px-4 sm:px-8">
//       <div className="max-w-6xl mx-auto space-y-8">
        
//         <button onClick={() => router.back()} className="flex items-center gap-2 text-[#1f6b4a] font-semibold hover:underline mb-4">
//           <ArrowLeft size={20} /> Back to previous page
//         </button>

//         <div className="bg-[#fbf8f2] p-10 rounded-2xl border border-[#e1dbd2] shadow-sm">
//           <h1 className="text-4xl font-bold text-[#123d2b]">Service User Intake Form</h1>
//         </div>

//         <form className="space-y-12" onSubmit={handleSubmit}>
          
//           {/* --- PERSONAL DETAILS --- */}
//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <div className="flex items-center gap-4 border-b border-[#e1dbd2] pb-6 mb-8">
//                 <div className="p-3 bg-[#e6f2ec] rounded-xl">
//                   <User className="text-[#1f6b4a] w-6 h-6" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-[#123d2b]">
//                   Personal Details
//                 </h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <div>
//                   <Label>Title</Label>
//                   <NativeSelect>
//                     <option>Select...</option>
//                     <option>Mr</option>
//                     <option>Mrs</option>
//                     <option>Miss</option>
//                     <option>Ms</option>
//                     <option>Dr</option>
//                   </NativeSelect>
//                 </div>
//                 <div>
//                   <Label>First Name</Label>
//                   <Input placeholder="Legal First Name" />
//                 </div>
//                 <div>
//                  <Label>Surname</Label>
//                   <Input placeholder="Legal Surname" />
//                 </div>

//                 <div>
//                   <Label>Date of Birth</Label>
//                   <Input type="date" value={formData.dob} onChange={handleDobChange} />
//                 </div>
//                 <div>
//                   <Label>Calculated Age</Label>
//                   <Input type="number" value={formData.age} readOnly className="bg-[#ece7df]/50 font-bold" />
//                 </div>

//                 <div>
//                   <Label>Gender</Label>
//                   <NativeSelect>
//                     <option>Select...</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                     <option>Non-binary</option>
//                     <option>Prefer not to say</option>
//                   </NativeSelect>
//                 </div>

//                 <div>
//                   <Label>NI Number</Label>
//                   <Input placeholder="AB123456C" className="uppercase" />
//                 </div>
//                 <div>
//                   <Label>Contact Number</Label>
//                   <Input type="tel" placeholder="07xxx xxxxxx" />
//                 </div>
//                 <div>
//                   <Label>Email Address</Label>
//                   <Input type="email" placeholder="user@email.com" />
//                </div>

//                 <div>
//                   <Label>Organisation</Label>
//                   <Input placeholder="Referring Body" />
//                 </div>
//                 <div>
//                   <Label>Ethnic Origin Group</Label>
//                   <NativeSelect>
//                     <option>Select Group...</option>
//                     <option>White</option>
//                     <option>Asian</option>
//                     <option>Black / African</option>
//                     <option>Mixed</option>
//                     <option>Other</option>
//                   </NativeSelect>
//                 </div>
//                 <div>
//                   <Label>Ethnic Origin</Label>
//                   <Input placeholder="Specific origin" />
//                 </div>
//               </div>
//             </section>

//             {/* --- PLACEMENT DETAILS (Approved By) --- */}
//             <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//               <div className="flex items-center gap-4 border-b border-[#e1dbd2] pb-6 mb-8">
//                 <div className="p-3 bg-[#e6f2ec] rounded-xl">
//                   <Home className="text-[#1f6b4a] w-6 h-6" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-[#123d2b]">
//                   Placement & Residency
//                 </h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <Label>Property Name</Label>
//                   <Input placeholder="Name of Facility" />
//                 </div>
//                 <div>
//                   <Label>Assigned Room</Label>
//                   <Input placeholder="Room # or Floor" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <Label>Street Address</Label>
//                   <Input placeholder="Full current address" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <Label>Previous Residency Address</Label>
//                   <Input placeholder="Full previous address" />
//                 </div>

//                 <div>
//                   <Label>Assigned To</Label>
//                   <Input placeholder="Keyworker Name" />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Approved By</Label>
//                   <Select
//                   value={formData.approved_by}
//                   onValueChange={(val) =>
//                     handleSelectChange("approved_by", val)
//                   }
//                 >
//                   <SelectTrigger className="bg-[#e1dbd2] border-none h-12">
//                     <SelectValue placeholder="Select Admin/HR" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {approvedByList.map((staff) => (
//                       <SelectItem key={staff.full_name} value={staff.full_name}>
//                         {staff.full_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </section>

//           {/* --- SECTION 3: NEXT OF KIN --- */}
//           <section className="mt-12 bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//             <div className="flex items-center gap-4 border-b border-[#e1dbd2] pb-6 mb-8">
//               <div className="p-3 bg-[#e6f2ec] rounded-xl">
//                 <Users className="text-[#1f6b4a] w-6 h-6" />
//               </div>
//               <h2 className="text-2xl font-bold text-[#123d2b]">Next of Kin</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <Label>Full Name</Label>
//                 <Input placeholder="Full legal name" />
//               </div>
//               <div>
//                 <Label>Relationship</Label>
//                 <Input placeholder="e.g. Spouse, Parent" />
//               </div>
//               <div>
//                 <Label>Phone Number</Label>
//                 <Input type="tel" placeholder="Primary phone" />
//               </div>
//               <div>
//                 <Label>Email Address</Label>
//                 <Input type="email" placeholder="nok@email.com" />
//               </div>
//               <div className="md:col-span-2">
//                 <Label>Postal Address</Label>
//                 <Input placeholder="NOK Residence Address" />
//               </div>
//             </div>
//           </section>

//           {/* MEDICAL UPLOAD */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//             <h2 className="text-2xl font-bold text-[#123d2b] mb-6">Medical Document</h2>
//             <div className="border-2 border-dashed border-[#e1dbd2] rounded-2xl bg-[#f7f2e9] p-12 text-center">
//               <input 
//                 type="file" 
//                 className="hidden" 
//                 id="med-file" 
//                 onChange={(e) => handleAutoUpload(e.target.files[0], 'medical', 'medical')} 
//               />
//               <Label htmlFor="med-file" className="cursor-pointer">
//                 <Upload className="w-12 h-12 text-[#1f6b4a] mx-auto mb-4" />
//                 <span className="bg-[#1f6b4a] text-white px-8 py-3 rounded-lg font-bold">Browse Medical File</span>
//                 {filePaths.medical && <p className="mt-4 text-xs italic">Uploaded: {filePaths.medical}</p>}
//               </Label>
//             </div>
//           </section>

//           {/* VERIFICATION DOCUMENTS */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//             <h2 className="text-2xl font-bold text-[#123d2b] mb-10">Verification Documents</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {['id_v', 'benefit', 'risk'].map((key) => (
//                 <div key={key} className="p-6 rounded-2xl border border-[#e1dbd2] bg-[#f5f0e6]/50 text-center">
//                   <Label className="capitalize">{key.replace('_', ' ')}</Label>
//                   <input 
//                     type="file" 
//                     className="hidden" 
//                     id={key} 
//                     onChange={(e) => handleAutoUpload(e.target.files[0], 'verification', key)} 
//                   />
//                   <Label htmlFor={key} className="cursor-pointer bg-white border p-4 rounded-xl block">
//                     <Upload className="w-4 h-4 inline mr-2 text-[#1f6b4a]" />
//                     {filePaths[key] ? "Uploaded" : "Select File"}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ADDITIONAL DOCUMENTS */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-2xl font-bold text-[#123d2b]">Additional Documents</h2>
//               <button 
//                 type="button" 
//                 onClick={() => setCustomDocuments([...customDocuments, { id: Date.now(), name: '', path: null, fileName: '' }])}
//                 className="bg-[#1f6b4a] text-white p-4 rounded-full"
//               >
//                 <Plus />
//               </button>
//             </div>
//             <div className="space-y-6">
//               {customDocuments.map((doc, index) => (
//                 <div key={doc.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end p-6 border rounded-xl bg-white">
//                   <div className="md:col-span-5">
//                     <Label>Title</Label>
//                     <Input 
//                       placeholder="Title" 
//                       onChange={(e) => {
//                         const newDocs = [...customDocuments];
//                         newDocs[index].name = e.target.value;
//                         setCustomDocuments(newDocs);
//                       }} 
//                     />
//                   </div>
//                   <div className="md:col-span-6">
//                     <input 
//                       type="file" 
//                       className="hidden" 
//                       id={`custom-${doc.id}`} 
//                       onChange={(e) => handleAutoUpload(e.target.files[0], 'additional', null, true, index)} 
//                     />
//                     <Label htmlFor={`custom-${doc.id}`} className="cursor-pointer bg-[#e8e1d6] p-4 rounded-lg block truncate">
//                       {doc.fileName || "Choose File..."}
//                     </Label>
//                   </div>
//                   <div className="md:col-span-1">
//                     <button onClick={() => setCustomDocuments(customDocuments.filter(d => d.id !== doc.id))} className="text-red-500">
//                       <Trash2 />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           <div className="flex justify-end gap-9 pt-12 border-t border-[#e1dbd2]">
//              <Button type="submit" disabled={loading} className="h-14 px-12 text-lg font-bold gap-3">
//               {loading ? "Saving..." : <><CheckCircle className="w-6 h-6" /> Complete Registration</>}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Upload,
  User,
  Users,
  Home,
  FileText,
  Activity,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { createClient } from "@/lib/superbase/clientUtils"; // Double check this path
import { toast } from "sonner";

// Initialize Supabase Client
const supabase = createClient();

// --- Reusable UI Components ---
const Label = ({ children, className = "", htmlFor }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-semibold text-[#123d2b] mb-2 ${className}`}>
    {children}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full p-3 text-sm rounded-lg border border-[#e1dbd2] bg-white text-[#123d2b] placeholder-[#6b7d74] focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] transition-all ${className}`}
    {...props}
  />
);

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 text-sm active:scale-95";
  const variants = {
    primary: "bg-[#1f6b4a] text-[#f7f2e9] hover:bg-[#123d2b] shadow-md px-6 py-3",
    outline: "border border-[#e1dbd2] text-[#123d2b] hover:bg-[#e8e1d6] px-6 py-3",
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

const NativeSelect = ({ className = "", children, ...props }) => (
  <select
    className={`w-full p-3 text-sm rounded-lg border border-[#e1dbd2] bg-white text-[#123d2b] focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] transition-all ${className}`}
    {...props}
  >
    {children}
  </select>
);

// --- Custom Select for "Approved By" ---
const Select = ({ children, onValueChange }) => (
  <div className="relative w-full" onChange={(e) => onValueChange(e.target.value)}>{children}</div>
);
const SelectTrigger = ({ children, className }) => (
  <div className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] ${className}`}>{children}</div>
);
const SelectValue = ({ placeholder }) => <span className="text-[#6b7d74]">{placeholder}</span>;
const SelectContent = ({ children }) => <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">{children}</select>;
const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;

export default function ServiceUserIntakeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [approvedByList, setApprovedByList] = useState([]);
  const [customDocuments, setCustomDocuments] = useState([]);
  
  const [filePaths, setFilePaths] = useState({
    id_v: null, benefit: null, risk: null, medical: null,
  });

  const [formData, setFormData] = useState({
    title: "", first_name: "", surname: "", dob: "", age: "",
    gender: "", ni_number: "", contact_number: "", email: "",
    organisation: "", ethnic_group: "", ethnic_origin: "",
    property_name: "", assigned_room: "", street_address: "",
    previous_address: "", assigned_to: "", approved_by: "",
    nok_name: "", nok_relationship: "", nok_phone: "",
    nok_email: "", nok_address: ""
  });

  const allowedFileTypes = ".pdf,.doc,.docx,image/*";

  // --- FIXED: handleSelectChange logic ---
  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Helper: Automatic Upload ---
  const handleAutoUpload = async (file, folder, fieldKey, isCustom = false, customIndex = null) => {
    if (!file) return;

    const promise = new Promise(async (resolve, reject) => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('service-user-docs')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        if (isCustom) {
          const newDocs = [...customDocuments];
          newDocs[customIndex].path = filePath;
          newDocs[customIndex].fileName = file.name;
          setCustomDocuments(newDocs);
        } else {
          setFilePaths(prev => ({ ...prev, [fieldKey]: filePath }));
        }
        resolve(filePath);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: `Uploading ${file.name}...`,
      success: 'File uploaded successfully',
      error: (err) => `Upload failed: ${err.message}`,
    });
  };

  useEffect(() => {
    const fetchStaff = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, role");
      if (data) {
        setApprovedByList(data.filter((u) => u.role === "admin" || u.role === "hr"));
      }
    };
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDobChange = (e) => {
    const birthDateStr = e.target.value;
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (new Date(today.getFullYear(), today.getMonth(), today.getDate()) < 
        new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
      age--;
    }
    setFormData(prev => ({ ...prev, dob: birthDateStr, age: age }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple check for essential fields
    if (!formData.first_name || !formData.surname) {
        const confirmIncomplete = window.confirm("Some fields are empty. Are you sure you want to submit anyway?");
        if (!confirmIncomplete) return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('service_users_table')
        .insert([{
          ...formData,
          id_v_path: filePaths.id_v,
          benefit_letter_path: filePaths.benefit,
          risk_assessment_path: filePaths.risk,
          medical_doc_path: filePaths.medical,
          additional_docs: customDocuments.map(d => ({ name: d.name, path: d.path }))
        }]);

      if (error) throw error;
      toast.success("Registration Successful!");
      router.push("/service-users");
    } catch (err) {
      toast.error(`Error saving data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-[#1f6b4a] font-semibold hover:underline mb-4">
          <ArrowLeft size={20} /> Back to previous page
        </button>

        <div className="bg-[#fbf8f2] p-10 rounded-2xl border border-[#e1dbd2] shadow-sm">
          <h1 className="text-4xl font-bold text-[#123d2b]">Service User Intake Form</h1>
        </div>

        <form className="space-y-12" onSubmit={handleSubmit}>
          
          {/* --- PERSONAL DETAILS --- */}
            <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
              <div className="flex items-center gap-4 border-b border-[#e1dbd2] pb-6 mb-8">
                <div className="p-3 bg-[#e6f2ec] rounded-xl">
                  <User className="text-[#1f6b4a] w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[#123d2b]">
                  Personal Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <Label>Title</Label>
                  <NativeSelect name="title" value={formData.title} onChange={handleInputChange}>
                    <option value="">Select...</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </NativeSelect>
                </div>
                <div>
                  <Label>First Name</Label>
                  <Input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Legal First Name" />
                </div>
                <div>
                 <Label>Surname</Label>
                  <Input name="surname" value={formData.surname} onChange={handleInputChange} placeholder="Legal Surname" />
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" value={formData.dob} onChange={handleDobChange} />
                </div>
                <div>
                  <Label>Calculated Age</Label>
                  <Input type="number" value={formData.age} readOnly className="bg-[#ece7df]/50 font-bold" />
                </div>

                <div>
                  <Label>Gender</Label>
                  <NativeSelect name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </NativeSelect>
                </div>

                <div>
                  <Label>NI Number</Label>
                  <Input name="ni_number" value={formData.ni_number} onChange={handleInputChange} placeholder="AB123456C" className="uppercase" />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input name="contact_number" value={formData.contact_number} onChange={handleInputChange} type="tel" placeholder="07xxx xxxxxx" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="user@email.com" />
               </div>

                <div>
                  <Label>Organisation</Label>
                  <Input name="organisation" value={formData.organisation} onChange={handleInputChange} placeholder="Referring Body" />
                </div>
                <div>
                  <Label>Ethnic Origin Group</Label>
                  <NativeSelect name="ethnic_group" value={formData.ethnic_group} onChange={handleInputChange}>
                    <option value="">Select Group...</option>
                    <option value="White">White</option>
                    <option value="Asian">Asian</option>
                    <option value="Black / African">Black / African</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Other">Other</option>
                  </NativeSelect>
                </div>
                <div>
                  <Label>Ethnic Origin</Label>
                  <Input name="ethnic_origin" value={formData.ethnic_origin} onChange={handleInputChange} placeholder="Specific origin" />
                </div>
              </div>
            </section>

            {/* --- PLACEMENT DETAILS --- */}
            <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
              <div className="flex items-center gap-4 border-b border-[#e1dbd2] pb-6 mb-8">
                <div className="p-3 bg-[#e6f2ec] rounded-xl">
                  <Home className="text-[#1f6b4a] w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[#123d2b]">
                  Placement & Residency
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label>Property Name</Label>
                  <Input name="property_name" value={formData.property_name} onChange={handleInputChange} placeholder="Name of Facility" />
                </div>
                <div>
                  <Label>Assigned Room</Label>
                  <Input name="assigned_room" value={formData.assigned_room} onChange={handleInputChange} placeholder="Room # or Floor" />
                </div>
                <div className="md:col-span-2">
                  <Label>Street Address</Label>
                  <Input name="street_address" value={formData.street_address} onChange={handleInputChange} placeholder="Full current address" />
                </div>
                <div className="md:col-span-2">
                  <Label>Previous Residency Address</Label>
                  <Input name="previous_address" value={formData.previous_address} onChange={handleInputChange} placeholder="Full previous address" />
                </div>

                <div>
                  <Label>Assigned To</Label>
                  <Input name="assigned_to" value={formData.assigned_to} onChange={handleInputChange} placeholder="Keyworker Name" />
                </div>

                <div className="space-y-2">
                  <Label>Approved By</Label>
                  <Select
                  value={formData.approved_by}
                  onValueChange={(val) =>
                    handleSelectChange("approved_by", val)
                  }
                >
                  <SelectTrigger className="bg-[#e1dbd2] border-none h-12">
                    <SelectValue placeholder={formData.approved_by || "Select Admin/HR"} />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedByList.map((staff) => (
                      <SelectItem key={staff.full_name} value={staff.full_name}>
                        {staff.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* --- NEXT OF KIN --- */}
          <section className="mt-12 bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
            <div className="flex items-center gap-4 border-b border-[#e1dbd2] pb-6 mb-8">
              <div className="p-3 bg-[#e6f2ec] rounded-xl">
                <Users className="text-[#1f6b4a] w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#123d2b]">Next of Kin</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label>Full Name</Label>
                <Input name="nok_name" value={formData.nok_name} onChange={handleInputChange} placeholder="Full legal name" />
              </div>
              <div>
                <Label>Relationship</Label>
                <Input name="nok_relationship" value={formData.nok_relationship} onChange={handleInputChange} placeholder="e.g. Spouse, Parent" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input name="nok_phone" value={formData.nok_phone} onChange={handleInputChange} type="tel" placeholder="Primary phone" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input name="nok_email" value={formData.nok_email} onChange={handleInputChange} type="email" placeholder="nok@email.com" />
              </div>
              <div className="md:col-span-2">
                <Label>Postal Address</Label>
                <Input name="nok_address" value={formData.nok_address} onChange={handleInputChange} placeholder="NOK Residence Address" />
              </div>
            </div>
          </section>

          {/* MEDICAL UPLOAD */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
            <h2 className="text-2xl font-bold text-[#123d2b] mb-6">Medical Document</h2>
            <div className="border-2 border-dashed border-[#e1dbd2] rounded-2xl bg-[#f7f2e9] p-12 text-center">
              <input 
                type="file" 
                className="hidden" 
                id="med-file" 
                onChange={(e) => handleAutoUpload(e.target.files[0], 'medical', 'medical')} 
              />
              <Label htmlFor="med-file" className="cursor-pointer">
                <Upload className="w-12 h-12 text-[#1f6b4a] mx-auto mb-4" />
                <span className="bg-[#1f6b4a] text-white px-8 py-3 rounded-lg font-bold">Browse Medical File</span>
                {filePaths.medical && <p className="mt-4 text-xs italic text-[#1f6b4a]">Uploaded: {filePaths.medical}</p>}
              </Label>
            </div>
          </section>

          {/* VERIFICATION DOCUMENTS */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
            <h2 className="text-2xl font-bold text-[#123d2b] mb-10">Verification Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['id_v', 'benefit', 'risk'].map((key) => (
                <div key={key} className="p-6 rounded-2xl border border-[#e1dbd2] bg-[#f5f0e6]/50 text-center">
                  <Label className="capitalize">{key.replace('_', ' ')}</Label>
                  <input 
                    type="file" 
                    className="hidden" 
                    id={key} 
                    onChange={(e) => handleAutoUpload(e.target.files[0], 'verification', key)} 
                  />
                  <Label htmlFor={key} className="cursor-pointer bg-white border p-4 rounded-xl block">
                    <Upload className="w-4 h-4 inline mr-2 text-[#1f6b4a]" />
                    {filePaths[key] ? "✓ Uploaded" : "Select File"}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          {/* ADDITIONAL DOCUMENTS */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#123d2b]">Additional Documents</h2>
              <button 
                type="button" 
                onClick={() => setCustomDocuments([...customDocuments, { id: Date.now(), name: '', path: null, fileName: '' }])}
                className="bg-[#1f6b4a] text-white p-4 rounded-full"
              >
                <Plus />
              </button>
            </div>
            <div className="space-y-6">
              {customDocuments.map((doc, index) => (
                <div key={doc.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end p-6 border rounded-xl bg-white">
                  <div className="md:col-span-5">
                    <Label>Title</Label>
                    <Input 
                      placeholder="Title" 
                      value={doc.name}
                      onChange={(e) => {
                        const newDocs = [...customDocuments];
                        newDocs[index].name = e.target.value;
                        setCustomDocuments(newDocs);
                      }} 
                    />
                  </div>
                  <div className="md:col-span-6">
                    <input 
                      type="file" 
                      className="hidden" 
                      id={`custom-${doc.id}`} 
                      onChange={(e) => handleAutoUpload(e.target.files[0], 'additional', null, true, index)} 
                    />
                    <Label htmlFor={`custom-${doc.id}`} className="cursor-pointer bg-[#e8e1d6] p-4 rounded-lg block truncate">
                      {doc.fileName || "Choose File..."}
                    </Label>
                  </div>
                  <div className="md:col-span-1">
                    <button type="button" onClick={() => setCustomDocuments(customDocuments.filter(d => d.id !== doc.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-9 pt-12 border-t border-[#e1dbd2]">
             <Button type="submit" disabled={loading} className="h-14 px-12 text-lg font-bold gap-3">
              {loading ? "Saving..." : <><CheckCircle className="w-6 h-6" /> Complete Registration</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}