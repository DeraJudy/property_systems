"use client";

import { useState } from "react";
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
import { Upload, Home, ShieldCheck, FileText, Plus, Trash2 } from "lucide-react";

export default function addPropertyForm() {
  // Main form state
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    postcode: "",
    organisation: "",
    manager: "",
    status: "Active",
    rooms: "",
    tenantName: "",
    leaseFile: null,
    floorPlanFile: null,
    insuranceFile: null,
  });

  // Dynamic Certificates state
  const [certificates, setCertificates] = useState([
    { id: Date.now(), type: "", expiry: "", file: null },
  ]);

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      { id: Date.now() + Math.random(), type: "", expiry: "", file: null },
    ]);
  };

  const removeCertificate = (id) => {
    if (certificates.length > 1) {
      setCertificates(certificates.filter((cert) => cert.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Property Data:", formData);
    console.log("Certificates:", certificates);
  };

  // Helper to handle static file uploads
  const handleStaticFile = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
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
            {/* --- Section 1: Property Details --- */}
            <div className="space-y-4">
              <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Property Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    placeholder="e.g. Oakwood Manor"
                    className="bg-[#e1dbd2] border-none focus-visible:ring-[#1f6b4a]"
                    onChange={(e) => setFormData({...formData, propertyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Street Name"
                    className="bg-[#e1dbd2] border-none"
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" className="bg-[#e1dbd2] border-none" />
                </div>
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            {/* --- Section 2: Management & Occupancy --- */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Organisation</Label>
                  <Select onValueChange={(val) => setFormData({...formData, organisation: val})}>
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue placeholder="Select Org" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fbf8f2]">
                      <SelectItem value="org1">Main Group Ltd</SelectItem>
                      <SelectItem value="org2">North Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property Manager</Label>
                  <Select onValueChange={(val) => setFormData({...formData, manager: val})}>
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue placeholder="Select Manager" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fbf8f2]">
                      <SelectItem value="m1">John Doe</SelectItem>
                      <SelectItem value="m2">Sarah Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="Active" onValueChange={(val) => setFormData({...formData, status: val})}>
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
                <div className="space-y-2"> 
                    <div className="space-y-2">
                        <Label htmlFor="rooms">Total Rooms</Label>
                        <Input id="rooms" type="number" className="bg-[#e1dbd2] border-none" />
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="rooms">Total Rooms</Label>
                  <Input id="rooms" type="number" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant Name</Label>
                  <Input id="tenant" className="bg-[#e1dbd2] border-none" />
                </div>
              </div>
            </div>

            <Separator className="bg-[#e1dbd2]" />

            {/* --- Section 3: Compliance & Documents --- */}
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
                    <Select onValueChange={(val) => {
                      const newCerts = [...certificates];
                      newCerts[index].type = val;
                      setCertificates(newCerts);
                    }}>
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
                        id={`file-cert-${cert.id}`}
                        onChange={(e) => {
                          const newCerts = [...certificates];
                          newCerts[index].file = e.target.files[0];
                          setCertificates(newCerts);
                        }}
                      />
                      <Label
                        htmlFor={`file-cert-${cert.id}`}
                        className="flex items-center justify-center gap-2 bg-[#e8e1d6] text-[#123d2b] px-4 py-2 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] text-sm truncate"
                      >
                        <Upload className="w-4 h-4 shrink-0" />
                        {cert.file ? cert.file.name : "Choose File"}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}

              {/* --- Section 4: Standard Required Documents --- */}
              <div className="bg-[#e6f2ec] p-4 rounded-lg border border-[#1f6b4a]/20 mt-6">
                <p className="text-[#15573c] text-sm font-semibold mb-4">
                  Required standard documents:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Lease Agreement */}
                  <div className="space-y-2">
                    <Label htmlFor="lease-upload" className="text-xs font-bold uppercase text-[#123d2b]">Lease Agreement</Label>
                    <div className="relative">
                      <Input type="file" className="hidden" id="lease-upload" onChange={(e) => handleStaticFile(e, 'leaseFile')} />
                      <Label htmlFor="lease-upload" className="flex items-center justify-center gap-2 bg-[#f7f2e9] text-[#123d2b] px-3 py-2 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] text-xs transition-colors">
                        <Upload className="w-3 h-3" /> {formData.leaseFile ? "Change File" : "Upload"}
                      </Label>
                    </div>
                  </div>

                  {/* Floor Plan */}
                  <div className="space-y-2">
                    <Label htmlFor="floor-upload" className="text-xs font-bold uppercase text-[#123d2b]">Floor Plan</Label>
                    <div className="relative">
                      <Input type="file" className="hidden" id="floor-upload" onChange={(e) => handleStaticFile(e, 'floorPlanFile')} />
                      <Label htmlFor="floor-upload" className="flex items-center justify-center gap-2 bg-[#f7f2e9] text-[#123d2b] px-3 py-2 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] text-xs transition-colors">
                        <Upload className="w-3 h-3" /> {formData.floorPlanFile ? "Change File" : "Upload"}
                      </Label>
                    </div>
                  </div>

                  {/* Insurance Policy */}
                  <div className="space-y-2">
                    <Label htmlFor="insurance-upload" className="text-xs font-bold uppercase text-[#123d2b]">Insurance Policy</Label>
                    <div className="relative">
                      <Input type="file" className="hidden" id="insurance-upload" onChange={(e) => handleStaticFile(e, 'insuranceFile')} />
                      <Label htmlFor="insurance-upload" className="flex items-center justify-center gap-2 bg-[#f7f2e9] text-[#123d2b] px-3 py-2 rounded-md cursor-pointer hover:bg-[#e1dbd2] border border-[#e1dbd2] text-xs transition-colors">
                        <Upload className="w-3 h-3" /> {formData.insuranceFile ? "Change File" : "Upload"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full md:w-auto bg-[#1f6b4a] hover:bg-[#123d2b] text-[#f7f2e9] px-12 py-6 text-lg shadow-lg transition-all"
              >
                Save Property Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}