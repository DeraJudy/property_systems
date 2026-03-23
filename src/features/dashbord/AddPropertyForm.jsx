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
  const [organisations, setOrganisations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

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
    floorPlanFile: null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!formData.organisationId) return toast.error("Please select an organisation");

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

      // 1. Image Compression
      let finalImage = formData.propertyImage;
      if (finalImage && finalImage.type.startsWith("image/")) {
        finalImage = await compressImage(finalImage);
      }

      // 2. Parallel Uploads
      const [imageUrl, leaseUrl, floorUrl, insuranceUrl] = await Promise.all([
        uploadFile(finalImage, "property-images"),
        uploadFile(formData.leaseFile, "lease"),
        uploadFile(formData.floorPlanFile, "floorplans"),
        uploadFile(formData.insuranceFile, "insurance")
      ]);

      // 3. Find the selected organisation name to match your DB's text column
      const selectedOrg = organisations.find(o => o.id === formData.organisationId);

      // 4. Insert Property Record
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          property_name: formData.propertyName,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          organisation: selectedOrg ? selectedOrg.name : null, // Fixed to match 'organisation' text column
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

      toast.success("Property and documents saved!", { id: toastId });
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
    <div className="min-h-screen p-4 md:p-8">
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
                  <Label className="mb-2 block text-sm font-medium">Property Photo</Label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2 ">
                    <Label>Organisation</Label>
                    <Select 
                      value={formData.organisationId}
                      onValueChange={(val) => setFormData({ ...formData, organisationId: val })}
                    >
                      <SelectTrigger className="bg-[#e1dbd2] border-none">
                        <SelectValue placeholder="Select Organisation" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#fbf8f2]">
                        {organisations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#fbf8f2]">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Total Rooms</Label>
                <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent (£)</Label>
                <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} />
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance Certificates</h3>
                <Button type="button" onClick={addCertificate} className="bg-[#1f6b4a] h-8 w-8 p-0 rounded-full"><Plus className="w-5 h-5" /></Button>
              </div>
              {certificates.map((cert, index) => (
                <div key={cert.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50 relative">
                   <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => removeCertificate(cert.id)} 
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-100 text-red-600 border border-red-200 hover:bg-red-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
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
                    <Label className="text-xs font-bold uppercase">{f.replace('File', '').replace('floorPlan', 'floor plan')}</Label>
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