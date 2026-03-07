"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Home, 
  Calendar, 
  HeartPulse, 
  Banknote, 
  ShieldAlert, 
  Upload, 
  Loader2,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

export default function ServiceUserForm() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [files, setFiles] = useState({
    idVerification: null,
    tenancyAgreement: null,
    benefitLetter: null,
    riskAssessment: null,
  });

  const handleFileChange = (e, field) => {
    if (e.target.files?.[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Processing service user intake...");

    // Logic for Supabase upload and DB insert would go here
    setTimeout(() => {
      toast.success("Service user profile created successfully!", { id: toastId });
      setLoading(false);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
      <Card className="max-w-5xl mx-auto border-[#e1dbd2] bg-[#fbf8f2] shadow-sm">
        <CardHeader className="border-b border-[#e1dbd2] mb-6 bg-[#123d2b] text-[#f7f2e9] rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Service User Intake Form
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* --- SECTION 1: PERSONAL DETAILS --- */}
            <section className="space-y-4">
              <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
                <User className="w-4 h-4" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Service Username</Label>
                  <Input placeholder="Full Name" className="bg-[#e1dbd2] border-none" required />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" className="bg-[#e1dbd2] border-none" required />
                </div>
                <div className="space-y-2">
                  <Label>NI Number</Label>
                  <Input placeholder="QQ 12 34 56 C" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="email@example.com" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="07123 456789" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <Input placeholder="Name & Number" className="bg-[#e1dbd2] border-none" />
                </div>
              </div>
            </section>

            <Separator className="bg-[#e1dbd2]" />

            {/* --- SECTION 2: PLACEMENT & HOUSING --- */}
            <section className="space-y-4">
              <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
                <Home className="w-4 h-4" /> Placement Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Property Name</Label>
                  <Input placeholder="Assigned Property" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Room Number</Label>
                  <Input placeholder="Room #" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Street Number</Label>
                  <Input placeholder="Street #" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Move-in Date</Label>
                  <Input type="date" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Move-out Date (Optional)</Label>
                  <Input type="date" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="moved-out">Moved Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Previous Address</Label>
                <Textarea placeholder="Full previous address..." className="bg-[#e1dbd2] border-none resize-none" rows={2} />
              </div>
            </section>

            <Separator className="bg-[#e1dbd2]" />

            {/* --- SECTION 3: HEALTH & SUPPORT --- */}
            <section className="space-y-4">
              <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
                <HeartPulse className="w-4 h-4" /> Health & Support Network
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Doctor Name</Label>
                  <Input className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Hospital</Label>
                  <Input className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Key Worker</Label>
                  <Input className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Social Worker</Label>
                  <Input className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Need</Label>
                  <Input className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Support Level</Label>
                  <Select>
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input placeholder="None" className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <Input placeholder="List conditions" className="bg-[#e1dbd2] border-none" />
                </div>
              </div>
            </section>

            <Separator className="bg-[#e1dbd2]" />

            {/* --- SECTION 4: FINANCIALS --- */}
            <section className="space-y-4">
              <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
                <Banknote className="w-4 h-4" /> Rent & Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Benefit Type</Label>
                  <Input placeholder="UC, ESA, etc." className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Claim Reference</Label>
                  <Input className="bg-[#e1dbd2] border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Rent Cycle</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Rent (£)</Label>
                  <Input type="number" className="bg-[#e1dbd2] border-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#e6f2ec] p-4 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-[#15573c]">Weekly Eligible Rent</Label>
                  <Input type="number" className="bg-white border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#15573c]">Service Charge</Label>
                  <Input type="number" className="bg-white border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#15573c]">Shortfall</Label>
                  <Input type="number" className="bg-white border-none" />
                </div>
              </div>
            </section>

            <Separator className="bg-[#e1dbd2]" />

            {/* --- SECTION 5: DOCUMENT VAULT --- */}
            <section className="space-y-4">
              <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Document Vault
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "ID Verification", field: "idVerification" },
                  { label: "Tenancy Agreement", field: "tenancyAgreement" },
                  { label: "Benefit Letter", field: "benefitLetter" },
                  { label: "Risk Assessment", field: "riskAssessment" },
                ].map((doc) => (
                  <div key={doc.field} className="space-y-2">
                    <Label className="text-[11px] font-bold text-[#123d2b] uppercase">{doc.label}</Label>
                    <div className="relative">
                      <Input 
                        type="file" 
                        className="hidden" 
                        id={doc.field} 
                        onChange={(e) => handleFileChange(e, doc.field)} 
                      />
                      <Label 
                        htmlFor={doc.field} 
                        className="flex flex-col items-center justify-center p-4 bg-[#f7f2e9] border-2 border-dashed border-[#e1dbd2] rounded-lg cursor-pointer hover:border-[#1f6b4a] transition-all text-center min-h-[100px]"
                      >
                        <Upload className="w-5 h-5 mb-2 text-[#1f6b4a]" />
                        <span className="text-xs font-medium text-[#123d2b] line-clamp-1 px-2">
                          {files[doc.field] ? files[doc.field].name : "Select File"}
                        </span>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-8 flex justify-end gap-4">
              <Button type="button" variant="outline" className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white px-10">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Complete Intake"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}