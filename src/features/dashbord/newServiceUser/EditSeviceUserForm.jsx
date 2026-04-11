"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  Upload,
  User,
  Users,
  Home,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Activity
} from "lucide-react";
import { createClient } from "@/lib/superbase/clientUtils";
import { toast } from "sonner";

const supabase = createClient();

// --- UI Components ---
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

const NativeSelect = ({ className = "", children, ...props }) => (
  <select
    className={`w-full p-3 text-sm rounded-lg border border-[#e1dbd2] bg-white text-[#123d2b] focus:outline-none focus:ring-2 focus:ring-[#1f6b4a] transition-all ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default function EditServiceUser() {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [approvedByList, setApprovedByList] = useState([]);
  
  // States for files and data
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

  // --- Fetch All Data on Load ---
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Fetch User Data
        const { data, error } = await supabase
          .from('service_users_table')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title || "",
            first_name: data.first_name || "",
            surname: data.surname || "",
            dob: data.dob || "",
            age: data.age?.toString() || "",
            gender: data.gender || "",
            ni_number: data.ni_number || "",
            contact_number: data.contact_number || "",
            email: data.email || "",
            organisation: data.organisation || "",
            ethnic_group: data.ethnic_group || "",
            ethnic_origin: data.ethnic_origin || "",
            property_name: data.property_name || "",
            assigned_room: data.assigned_room || "",
            street_address: data.street_address || "",
            previous_address: data.previous_address || "",
            assigned_to: data.assigned_to || "",
            approved_by: data.approved_by || "",
            nok_name: data.nok_name || "",
            nok_relationship: data.nok_relationship || "",
            nok_phone: data.nok_phone || "",
            nok_email: data.nok_email || "",
            nok_address: data.nok_address || ""
          });

          setFilePaths({
            id_v: data.id_v_path,
            benefit: data.benefit_letter_path,
            risk: data.risk_assessment_path,
            medical: data.medical_doc_path,
          });

          if (data.additional_docs) {
            setCustomDocuments(data.additional_docs.map((doc, idx) => ({
              id: idx,
              name: doc.name,
              path: doc.path,
              fileName: doc.path ? doc.path.split('/').pop() : "Existing File"
            })));
          }
        }

        // 2. Fetch Staff List
        const { data: staff } = await supabase.from("profiles").select("full_name, role");
        if (staff) setApprovedByList(staff.filter(u => u.role === "admin" || u.role === "hr"));

      } catch (err) {
        toast.error("Failed to fetch data");
      } finally {
        setFetching(false);
      }
    };

    loadAllData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoUpload = async (file, folder, fieldKey, isCustom = false, customIndex = null) => {
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${folder}/${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('service-user-docs').upload(filePath, file);
      if (error) throw error;

      if (isCustom) {
        const newDocs = [...customDocuments];
        newDocs[customIndex].path = filePath;
        newDocs[customIndex].fileName = file.name;
        setCustomDocuments(newDocs);
      } else {
        setFilePaths(prev => ({ ...prev, [fieldKey]: filePath }));
      }
      toast.success("File uploaded");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...formData,
      age: formData.age === "" ? null : parseInt(formData.age),
      id_v_path: filePaths.id_v,
      benefit_letter_path: filePaths.benefit,
      risk_assessment_path: filePaths.risk,
      medical_doc_path: filePaths.medical,
      additional_docs: customDocuments.map(d => ({ name: d.name, path: d.path }))
    };

    const { error } = await supabase.from('service_users_table').update(submissionData).eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("User updated successfully");
      router.push("/service-users");
    }
    setLoading(false);
  };

  if (fetching) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#1f6b4a] font-semibold"><ArrowLeft size={20}/> Back</button>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* 1. PERSONAL DETAILS */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
            <div className="flex items-center gap-4 mb-8 border-b pb-4">
              <User className="text-[#1f6b4a]" /> <h2 className="text-2xl font-bold">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><Label>Title</Label><Input name="title" value={formData.title} onChange={handleInputChange} /></div>
              <div><Label>First Name</Label><Input name="first_name" value={formData.first_name} onChange={handleInputChange} /></div>
              <div><Label>Surname</Label><Input name="surname" value={formData.surname} onChange={handleInputChange} /></div>
              <div><Label>DOB</Label><Input type="date" name="dob" value={formData.dob} onChange={handleInputChange} /></div>
              <div><Label>Age</Label><Input name="age" value={formData.age} readOnly className="bg-gray-100" /></div>
              <div><Label>Gender</Label><Input name="gender" value={formData.gender} onChange={handleInputChange} /></div>
              <div><Label>NI Number</Label><Input name="ni_number" value={formData.ni_number} onChange={handleInputChange} /></div>
              <div><Label>Contact</Label><Input name="contact_number" value={formData.contact_number} onChange={handleInputChange} /></div>
              <div><Label>Email</Label><Input name="email" value={formData.email} onChange={handleInputChange} /></div>
              <div><Label>Ethnic Group</Label><Input name="ethnic_group" value={formData.ethnic_group} onChange={handleInputChange} /></div>
              <div><Label>Ethnic Origin</Label><Input name="ethnic_origin" value={formData.ethnic_origin} onChange={handleInputChange} /></div>
              <div><Label>Organisation</Label><Input name="organisation" value={formData.organisation} onChange={handleInputChange} /></div>
            </div>
          </section>

          {/* 2. PLACEMENT */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
            <div className="flex items-center gap-4 mb-8 border-b pb-4">
              <Home className="text-[#1f6b4a]" /> <h2 className="text-2xl font-bold">Placement & Residency</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label>Property Name</Label><Input name="property_name" value={formData.property_name} onChange={handleInputChange} /></div>
              <div><Label>Assigned Room</Label><Input name="assigned_room" value={formData.assigned_room} onChange={handleInputChange} /></div>
              <div className="md:col-span-2"><Label>Street Address</Label><Input name="street_address" value={formData.street_address} onChange={handleInputChange} /></div>
              <div className="md:col-span-2"><Label>Previous Address</Label><Input name="previous_address" value={formData.previous_address} onChange={handleInputChange} /></div>
              <div><Label>Assigned To</Label><Input name="assigned_to" value={formData.assigned_to} onChange={handleInputChange} /></div>
              <div><Label>Approved By</Label>
                <NativeSelect name="approved_by" value={formData.approved_by} onChange={handleInputChange}>
                  <option value="">Select Staff...</option>
                  {approvedByList.map(s => <option key={s.full_name} value={s.full_name}>{s.full_name}</option>)}
                </NativeSelect>
              </div>
            </div>
          </section>

          {/* 3. NEXT OF KIN */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
            <div className="flex items-center gap-4 mb-8 border-b pb-4">
              <Users className="text-[#1f6b4a]" /> <h2 className="text-2xl font-bold">Next of Kin</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label>Full Name</Label><Input name="nok_name" value={formData.nok_name} onChange={handleInputChange} /></div>
              <div><Label>Relationship</Label><Input name="nok_relationship" value={formData.nok_relationship} onChange={handleInputChange} /></div>
              <div><Label>Phone</Label><Input name="nok_phone" value={formData.nok_phone} onChange={handleInputChange} /></div>
              <div><Label>Email</Label><Input name="nok_email" value={formData.nok_email} onChange={handleInputChange} /></div>
              <div className="md:col-span-2"><Label>Address</Label><Input name="nok_address" value={formData.nok_address} onChange={handleInputChange} /></div>
            </div>
          </section>

          {/* 4. DOCUMENTS */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
            <h2 className="text-2xl font-bold mb-6">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['medical', 'id_v', 'benefit', 'risk'].map((key) => (
                <div key={key} className="p-4 border rounded-xl bg-white">
                  <Label className="capitalize">{key.replace('_', ' ')}</Label>
                  <input type="file" className="hidden" id={key} onChange={(e) => handleAutoUpload(e.target.files[0], 'docs', key)} />
                  <Label htmlFor={key} className="cursor-pointer text-xs p-3 border border-dashed rounded block truncate">
                    {filePaths[key] ? `File: ${filePaths[key].split('/').pop()}` : "Upload new file"}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          {/* 5. ADDITIONAL DOCUMENTS */}
          <section className="bg-[#fbf8f2] p-8 rounded-2xl border border-[#e1dbd2]">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Additional Documents</h2>
              <button type="button" onClick={() => setCustomDocuments([...customDocuments, { id: Date.now(), name: '', path: null, fileName: '' }])} className="p-2 bg-[#1f6b4a] text-white rounded-full"><Plus/></button>
            </div>
            {customDocuments.map((doc, index) => (
              <div key={doc.id} className="flex gap-4 mb-4 items-end bg-white p-4 rounded-xl border">
                <div className="flex-1"><Label>Doc Name</Label><Input value={doc.name} onChange={(e) => {
                  const n = [...customDocuments]; n[index].name = e.target.value; setCustomDocuments(n);
                }}/></div>
                <div className="flex-1">
                  <input type="file" className="hidden" id={`c-${doc.id}`} onChange={(e) => handleAutoUpload(e.target.files[0], 'extra', null, true, index)}/>
                  <Label htmlFor={`c-${doc.id}`} className="cursor-pointer p-3 border rounded block truncate text-xs">{doc.fileName || "Select File"}</Label>
                </div>
                <button type="button" onClick={() => setCustomDocuments(customDocuments.filter(d => d.id !== doc.id))} className="text-red-500 mb-2"><Trash2/></button>
              </div>
            ))}
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-[#1f6b4a] text-white px-10 py-4 rounded-xl font-bold flex gap-2">
              {loading ? <Loader2 className="animate-spin"/> : <CheckCircle/>} Update User Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}