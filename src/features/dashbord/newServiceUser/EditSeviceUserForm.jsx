// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   Plus,
//   Trash2,
//   Upload,
//   User,
//   Users,
//   Home,
//   CheckCircle,
//   ArrowLeft,
//   Loader2,
//   Activity
// } from "lucide-react";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";

// const supabase = createClient();

// // --- UI Components ---
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

// const NativeSelect = ({ className = "", children, ...props }) => (
//   <select
//     className={`w-full p-3 text-sm rounded-lg border border-[#e1dbd2] bg-white text-[#123d2b] focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] transition-all ${className}`}
//     {...props}
//   >
//     {children}
//   </select>
// );

// export default function EditServiceUser() {
//   const router = useRouter();
//   const { id } = useParams();
  
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [approvedByList, setApprovedByList] = useState([]);
  
//   // States for files and data
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

//   // --- Fetch All Data on Load ---
//   useEffect(() => {
//     const loadAllData = async () => {
//       try {
//         // 1. Fetch User Data
//         const { data, error } = await supabase
//           .from('service_users_table')
//           .select('*')
//           .eq('id', id)
//           .single();

//         if (error) throw error;

//         if (data) {
//           setFormData({
//             title: data.title || "",
//             first_name: data.first_name || "",
//             surname: data.surname || "",
//             dob: data.dob || "",
//             age: data.age?.toString() || "",
//             gender: data.gender || "",
//             ni_number: data.ni_number || "",
//             contact_number: data.contact_number || "",
//             email: data.email || "",
//             organisation: data.organisation || "",
//             ethnic_group: data.ethnic_group || "",
//             ethnic_origin: data.ethnic_origin || "",
//             property_name: data.property_name || "",
//             assigned_room: data.assigned_room || "",
//             street_address: data.street_address || "",
//             previous_address: data.previous_address || "",
//             assigned_to: data.assigned_to || "",
//             approved_by: data.approved_by || "",
//             nok_name: data.nok_name || "",
//             nok_relationship: data.nok_relationship || "",
//             nok_phone: data.nok_phone || "",
//             nok_email: data.nok_email || "",
//             nok_address: data.nok_address || ""
//           });

//           setFilePaths({
//             id_v: data.id_v_path,
//             benefit: data.benefit_letter_path,
//             risk: data.risk_assessment_path,
//             medical: data.medical_doc_path,
//           });

//           if (data.additional_docs) {
//             setCustomDocuments(data.additional_docs.map((doc, idx) => ({
//               id: idx,
//               name: doc.name,
//               path: doc.path,
//               fileName: doc.path ? doc.path.split('/').pop() : "Existing File"
//             })));
//           }
//         }

//         // 2. Fetch Staff List
//         const { data: staff } = await supabase.from("profiles").select("full_name, role");
//         if (staff) setApprovedByList(staff.filter(u => u.role === "admin" || u.role === "hr"));

//       } catch (err) {
//         toast.error("Failed to fetch data");
//       } finally {
//         setFetching(false);
//       }
//     };

//     loadAllData();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAutoUpload = async (file, folder, fieldKey, isCustom = false, customIndex = null) => {
//     if (!file) return;
//     try {
//       const fileExt = file.name.split('.').pop();
//       const filePath = `${folder}/${Math.random()}.${fileExt}`;
//       const { error } = await supabase.storage.from('service-user-docs').upload(filePath, file);
//       if (error) throw error;

//       if (isCustom) {
//         const newDocs = [...customDocuments];
//         newDocs[customIndex].path = filePath;
//         newDocs[customIndex].fileName = file.name;
//         setCustomDocuments(newDocs);
//       } else {
//         setFilePaths(prev => ({ ...prev, [fieldKey]: filePath }));
//       }
//       toast.success("File uploaded");
//     } catch (err) {
//       toast.error("Upload failed");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const submissionData = {
//       ...formData,
//       age: formData.age === "" ? null : parseInt(formData.age),
//       id_v_path: filePaths.id_v,
//       benefit_letter_path: filePaths.benefit,
//       risk_assessment_path: filePaths.risk,
//       medical_doc_path: filePaths.medical,
//       additional_docs: customDocuments.map(d => ({ name: d.name, path: d.path }))
//     };

//     const { error } = await supabase.from('service_users_table').update(submissionData).eq('id', id);

//     if (error) {
//       toast.error(error.message);
//     } else {
//       toast.success("User updated successfully");
//       router.push("/service-users");
//     }
//     setLoading(false);
//   };

//   if (fetching) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

//   return (
//     <div className="min-h-screen py-12 px-4 sm:px-8">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <button onClick={() => router.back()} className="flex items-center gap-2 text-[#1f6b4a] font-semibold"><ArrowLeft size={20}/> Back</button>

//         <form onSubmit={handleSubmit} className="space-y-10">
          
//           {/* 1. PERSONAL DETAILS */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
//             <div className="flex items-center gap-4 mb-8 border-b pb-4">
//               <User className="text-[#1f6b4a]" /> <h2 className="text-2xl font-bold">Personal Details</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div><Label>Title</Label><Input name="title" value={formData.title} onChange={handleInputChange} /></div>
//               <div><Label>First Name</Label><Input name="first_name" value={formData.first_name} onChange={handleInputChange} /></div>
//               <div><Label>Surname</Label><Input name="surname" value={formData.surname} onChange={handleInputChange} /></div>
//               <div><Label>DOB</Label><Input type="date" name="dob" value={formData.dob} onChange={handleInputChange} /></div>
//               <div><Label>Age</Label><Input name="age" value={formData.age} readOnly className="bg-gray-100" /></div>
//               <div><Label>Gender</Label><Input name="gender" value={formData.gender} onChange={handleInputChange} /></div>
//               <div><Label>NI Number</Label><Input name="ni_number" value={formData.ni_number} onChange={handleInputChange} /></div>
//               <div><Label>Contact</Label><Input name="contact_number" value={formData.contact_number} onChange={handleInputChange} /></div>
//               <div><Label>Email</Label><Input name="email" value={formData.email} onChange={handleInputChange} /></div>
//               <div><Label>Ethnic Group</Label><Input name="ethnic_group" value={formData.ethnic_group} onChange={handleInputChange} /></div>
//               <div><Label>Ethnic Origin</Label><Input name="ethnic_origin" value={formData.ethnic_origin} onChange={handleInputChange} /></div>
//               <div><Label>Organisation</Label><Input name="organisation" value={formData.organisation} onChange={handleInputChange} /></div>
//             </div>
//           </section>

//           {/* 2. PLACEMENT */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
//             <div className="flex items-center gap-4 mb-8 border-b pb-4">
//               <Home className="text-[#1f6b4a]" /> <h2 className="text-2xl font-bold">Placement & Residency</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div><Label>Property Name</Label><Input name="property_name" value={formData.property_name} onChange={handleInputChange} /></div>
//               <div><Label>Assigned Room</Label><Input name="assigned_room" value={formData.assigned_room} onChange={handleInputChange} /></div>
//               <div className="md:col-span-2"><Label>Street Address</Label><Input name="street_address" value={formData.street_address} onChange={handleInputChange} /></div>
//               <div className="md:col-span-2"><Label>Previous Address</Label><Input name="previous_address" value={formData.previous_address} onChange={handleInputChange} /></div>
//               <div><Label>Assigned To</Label><Input name="assigned_to" value={formData.assigned_to} onChange={handleInputChange} /></div>
//               <div><Label>Approved By</Label>
//                 <NativeSelect name="approved_by" value={formData.approved_by} onChange={handleInputChange}>
//                   <option value="">Select Staff...</option>
//                   {approvedByList.map(s => <option key={s.full_name} value={s.full_name}>{s.full_name}</option>)}
//                 </NativeSelect>
//               </div>
//             </div>
//           </section>

//           {/* 3. NEXT OF KIN */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
//             <div className="flex items-center gap-4 mb-8 border-b pb-4">
//               <Users className="text-[#1f6b4a]" /> <h2 className="text-2xl font-bold">Next of Kin</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div><Label>Full Name</Label><Input name="nok_name" value={formData.nok_name} onChange={handleInputChange} /></div>
//               <div><Label>Relationship</Label><Input name="nok_relationship" value={formData.nok_relationship} onChange={handleInputChange} /></div>
//               <div><Label>Phone</Label><Input name="nok_phone" value={formData.nok_phone} onChange={handleInputChange} /></div>
//               <div><Label>Email</Label><Input name="nok_email" value={formData.nok_email} onChange={handleInputChange} /></div>
//               <div className="md:col-span-2"><Label>Address</Label><Input name="nok_address" value={formData.nok_address} onChange={handleInputChange} /></div>
//             </div>
//           </section>

//           {/* 4. DOCUMENTS */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
//             <h2 className="text-2xl font-bold mb-6">Documents</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {['medical', 'id_v', 'benefit', 'risk'].map((key) => (
//                 <div key={key} className="p-4 border rounded-xl bg-white">
//                   <Label className="capitalize">{key.replace('_', ' ')}</Label>
//                   <input type="file" className="hidden" id={key} onChange={(e) => handleAutoUpload(e.target.files[0], 'docs', key)} />
//                   <Label htmlFor={key} className="cursor-pointer text-xs p-3 border border-dashed rounded block truncate">
//                     {filePaths[key] ? `File: ${filePaths[key].split('/').pop()}` : "Upload new file"}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* 5. ADDITIONAL DOCUMENTS */}
//           <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
//             <div className="flex justify-between mb-6">
//               <h2 className="text-2xl font-bold">Additional Documents</h2>
//               <button type="button" onClick={() => setCustomDocuments([...customDocuments, { id: Date.now(), name: '', path: null, fileName: '' }])} className="p-2 bg-[#1f6b4a] text-white rounded-full"><Plus/></button>
//             </div>
//             {customDocuments.map((doc, index) => (
//               <div key={doc.id} className="flex gap-4 mb-4 items-end bg-white p-4 rounded-xl border">
//                 <div className="flex-1"><Label>Doc Name</Label><Input value={doc.name} onChange={(e) => {
//                   const n = [...customDocuments]; n[index].name = e.target.value; setCustomDocuments(n);
//                 }}/></div>
//                 <div className="flex-1">
//                   <input type="file" className="hidden" id={`c-${doc.id}`} onChange={(e) => handleAutoUpload(e.target.files[0], 'extra', null, true, index)}/>
//                   <Label htmlFor={`c-${doc.id}`} className="cursor-pointer p-3 border rounded block truncate text-xs">{doc.fileName || "Select File"}</Label>
//                 </div>
//                 <button type="button" onClick={() => setCustomDocuments(customDocuments.filter(d => d.id !== doc.id))} className="text-red-500 mb-2"><Trash2/></button>
//               </div>
//             ))}
//           </section>

//           <div className="flex justify-end">
//             <button type="submit" disabled={loading} className="bg-[#1f6b4a] text-white px-10 py-4 rounded-xl font-bold flex gap-2">
//               {loading ? <Loader2 className="animate-spin"/> : <CheckCircle/>} Update User Profile
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, FileText, Loader2, Save, User, 
  CheckCircle2, Youtube, Instagram, Music2, ArrowLeft 
} from "lucide-react";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supabase = createClient();

const DocumentSection = ({ title, field, icon: Icon, formData, addListEntry, updateListField, removeListEntry, uploadingFields, handleFileUpload }) => (
  <Card className="bg-white border-black/10 shadow-sm mb-6">
    <CardHeader className="border-b border-black/5 flex flex-row items-center justify-between">
      <CardTitle className="text-black text-lg flex items-center gap-2 font-black uppercase tracking-widest">
        <Icon className="h-5 w-5" /> {title}
      </CardTitle>
      <Button
        variant="outline"
        size="sm"
        onClick={() => addListEntry(field)}
        className="border-black text-black hover:bg-black hover:text-white transition-all font-bold"
      >
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </CardHeader>
    <CardContent className="space-y-4 pt-6">
      {formData[field]?.map((item, index) => (
        <div key={item.id || index} className="flex gap-4 items-end bg-[#fdfbf7] p-4 border border-black/5 rounded-xl shadow-sm">
          <div className="flex-2 space-y-2">
            <Label className="text-[10px] font-black uppercase text-black/50 tracking-tighter">Document Title / Description</Label>
            <Input
              value={item.name}
              onChange={(e) => updateListField(field, index, "name", e.target.value)}
              placeholder="Enter document details here..."
              className="bg-white border-black/10 focus:ring-black w-full"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-[10px] font-black uppercase text-black/50 flex justify-between">
              File 
              {item.url && <span className="text-black flex items-center gap-1"><CheckCircle2 size={12}/> Attached</span>}
            </Label>
            <Input
              type="file"
              onChange={(e) => handleFileUpload(e, field, index)}
              disabled={uploadingFields[`${field}-${index}`]}
              className="bg-white border-black/10"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeListEntry(field, index)}
            className="text-black/40 hover:text-red-600 hover:bg-red-50 mb-1"
          >
            {uploadingFields[`${field}-${index}`] ? <Loader2 className="animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default function EditServiceUserForm() {
  const router = useRouter();
  const { id } = useParams(); // Get ID from URL
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingFields, setUploadingFields] = useState({});

  const [formData, setFormData] = useState({
    service_user_name: "",
    about_file_url: "",
    about_file_path: "",
    eet_documents: [],
    onboarding_documents: [],
    additional_documents: [],
  });

  // Fetch existing data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("service_user_intake")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            ...data,
            eet_documents: data.eet_documents || [],
            onboarding_documents: data.onboarding_documents || [],
            additional_documents: data.additional_documents || [],
          });
        }
      } catch (err) {
        toast.error("Failed to load user record");
        router.push("/service-users");
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, [id, router]);

  const addListEntry = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { id: crypto.randomUUID(), name: "", url: "", file_path: "" }],
    }));
  };

  const updateListField = (field, index, key, value) => {
    setFormData(prev => {
      const updatedList = [...prev[field]];
      updatedList[index] = { ...updatedList[index], [key]: value };
      return { ...prev, [field]: updatedList };
    });
  };

  const removeListEntry = async (field, index) => {
    const item = formData[field][index];
    if (item.file_path) {
      try {
        const { error } = await supabase.storage
          .from("service-user-intake-docs")
          .remove([item.file_path]);
        if (error) throw error;
      } catch (err) {
        toast.error("Failed to remove file from storage");
        return;
      }
    }
    const updatedList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedList });
    toast.success("Document removed");
  };


  const handleFileUpload = async (e, field, index = null) => {
  const file = e.target.files[0];
  if (!file) return;

  const uploadKey = index !== null ? `${field}-${index}` : field;
  setUploadingFields(prev => ({ ...prev, [uploadKey]: true }));

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = index !== null ? `${field}_${index}.${fileExt}` : `${field}.${fileExt}`;
    
    // PATH: always stays as /UUID/folder/file.ext
    const filePath = `${id}/${field}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("service-user-intake-docs")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("service-user-intake-docs").getPublicUrl(filePath);

    if (index !== null) {
      const updatedList = [...formData[field]];
      updatedList[index] = { ...updatedList[index], url: data.publicUrl, file_path: filePath };
      setFormData({ ...formData, [field]: updatedList });
    } else {
      setFormData({ ...formData, [`${field}_url`]: data.publicUrl, [`${field}_path`]: filePath });
    }
    toast.success("File updated");
  } catch (error) {
    toast.error("Update failed");
  } finally {
    setUploadingFields(prev => ({ ...prev, [uploadKey]: false }));
  }
};

  const handleSave = async () => {
  if (!formData.service_user_name?.trim()) {
    return toast.error("Service User Name is required.");
  }

  setLoading(true);
  try {
    // 1. Strip protected fields
    const { id: profileId, created_at, ...payload } = formData;

    // 2. Simple Update
    const { error } = await supabase
      .from("service_user_intake")
      .update(payload)
      .eq("id", id); // 'id' comes from useParams()

    if (error) throw error;
    
    toast.success("Profile updated successfully!");
    router.push("/service-users");
    
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fdfbf7]">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4 hover:bg-black/5">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-4xl font-black text-black tracking-tight">Edit Intake Record</h1>
            <p className="text-black/50 font-medium">Updating documentation for {formData.service_user_name}</p>
          </div>
          <div className="flex gap-3">
             <div className="p-3 bg-black text-white rounded-2xl">
               <User size={24} />
             </div>
          </div>
        </div>

        <Card className="mb-6 border-black/10 bg-white">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-black uppercase text-[10px] tracking-widest text-black/60">Service User Name <span className="text-red-500">*</span></Label>
              <Input 
                placeholder="Enter full name"
                value={formData.service_user_name}
                onChange={(e) => setFormData({...formData, service_user_name: e.target.value})}
                className="border-black/10 focus:ring-black h-12 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-black uppercase text-[10px] tracking-widest text-black/60">About File (Primary Doc)</Label>
              <Input 
                type="file" 
                onChange={(e) => handleFileUpload(e, "about_file")} 
                disabled={uploadingFields["about_file"]} 
                className="border-black/10 focus:ring-black h-12"
              />
              {formData.about_file_url && (
                <p className="text-[10px] font-bold text-black/40">Current file is active</p>
              )}
            </div>
          </CardContent>
        </Card>

        <DocumentSection title="EET Documents" field="eet_documents" icon={FileText} {...{formData, addListEntry, updateListField, removeListEntry, uploadingFields, handleFileUpload}} />
        <DocumentSection title="Onboarding Documents" field="onboarding_documents" icon={User} {...{formData, addListEntry, updateListField, removeListEntry, uploadingFields, handleFileUpload}} />
        <DocumentSection title="Additional Documents" field="additional_documents" icon={Plus} {...{formData, addListEntry, updateListField, removeListEntry, uploadingFields, handleFileUpload}} />

        <div className="mt-10 pt-8 border-t border-black/10 flex justify-center">
          <Button 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-black text-[#fdfbf7] hover:bg-black/80 px-16 py-7 text-lg rounded-2xl shadow-xl transition-all font-black uppercase tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}