// "use client"

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { ArrowLeft, Save, User, Mail, Phone, Building2, Briefcase } from "lucide-react";
// import { toast } from "sonner"; // Or your preferred toast library

// const EditEmployeePage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   // Simulated initial state - In production, fetch this via useEffect
//   const [formData, setFormData] = useState({
//     name: "Sarah Mitchell",
//     email: "s.mitchell@kenleyhousing.co.uk",
//     phone: "07700 900123",
//     role: "Support Worker",
//     org: "Kenley Housing Group",
//     status: "Employed",
//     contractExpiry: "2026-09-15"
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Simulate API Call
//     setTimeout(() => {
//       setLoading(false);
//       toast.success("Employee profile updated successfully");
//       router.push(`/hrList/${params.id}`);
//     }, 1000);
//   };

//   return (
//     <div className="max-w-3xl mx-auto space-y-6 pb-10">
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2">
//           <ArrowLeft className="h-4 w-4" /> Cancel
//         </Button>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <Card className="shadow-md">
//           <CardHeader>
//             <CardTitle className="text-2xl">Edit Employee Profile</CardTitle>
//             <CardDescription>
//               Update the personal and professional details for employee ID: {params.id}
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent className="space-y-6">
//             {/* Personal Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2 text-primary font-semibold">
//                 <User className="h-4 w-4" />
//                 <span>Personal Information</span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input 
//                     id="name" 
//                     name="name" 
//                     value={formData.name} 
//                     onChange={handleChange} 
//                     required 
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input 
//                     id="email" 
//                     name="email" 
//                     type="email" 
//                     value={formData.email} 
//                     onChange={handleChange} 
//                     required 
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input 
//                     id="phone" 
//                     name="phone" 
//                     value={formData.phone} 
//                     onChange={handleChange} 
//                   />
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Professional Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2 text-primary font-semibold">
//                 <Briefcase className="h-4 w-4" />
//                 <span>Work & Compliance</span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="role">Job Role</Label>
//                   <Input 
//                     id="role" 
//                     name="role" 
//                     value={formData.role} 
//                     onChange={handleChange} 
//                     required 
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="org">Organisation</Label>
//                   <Input 
//                     id="org" 
//                     name="org" 
//                     value={formData.org} 
//                     onChange={handleChange} 
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="status">Employment Status</Label>
//                   <Select 
//                     value={formData.status} 
//                     onValueChange={(v) => handleSelectChange("status", v)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Employed">Employed</SelectItem>
//                       <SelectItem value="On Leave">On Leave</SelectItem>
//                       <SelectItem value="Suspended">Suspended</SelectItem>
//                       <SelectItem value="Inactive">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="contractExpiry">Contract Expiry Date</Label>
//                   <Input 
//                     id="contractExpiry" 
//                     name="contractExpiry" 
//                     type="date" 
//                     value={formData.contractExpiry} 
//                     onChange={handleChange} 
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardContent>

//           <CardFooter className="flex justify-end gap-3 bg-muted/50 p-6 rounded-b-lg">
//             <Button variant="outline" type="button" onClick={() => router.back()}>
//               Discard Changes
//             </Button>
//             <Button type="submit" disabled={loading} className="gap-2">
//               <Save className="h-4 w-4" />
//               {loading ? "Saving..." : "Save Changes"}
//             </Button>
//           </CardFooter>
//         </Card>
//       </form>
//     </div>
//   );
// };

// export default EditEmployeePage;


"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, FileText, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch this data using params.id
  const [formData, setFormData] = useState({
    name: "James Okonkwo",
    role: "Property Manager",
    org: "south-london",
    dbsStatus: "expiring",
    safeguarding: "compliant",
    trainingProgress: 78,
    employmentStatus: "employed",
    contractExpiry: "2026-06-30",
    lastActive: "2026-03-08"
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API update
    setTimeout(() => {
      setLoading(false);
      toast.success("Employee record updated successfully");
      router.push(`/dashboard/employees/${params.id}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-[#123d2b] hover:bg-[#ece7df] gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Button>
      </div>

      <Card className="w-full max-w-2xl bg-[#fbf8f2] border-[#e1dbd2] shadow-lg">
        <CardHeader className="border-b border-[#e1dbd2] mb-6">
          <CardTitle className="text-[#123d2b] text-2xl flex items-center gap-2">
            <User className="w-6 h-6" />
            Employee Management
          </CardTitle>
          <CardDescription className="text-[#6b7d74]">
            Updating records for ID: {params.id}. Ensure all compliance documents are verified.
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="basic" className="w-full px-2 md:px-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#ece7df] rounded-lg p-1">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="contract" 
              className="data-[state=active]:bg-[#1f6b4a] data-[state=active]:text-[#f7f2e9] text-[#123d2b]"
            >
              Contract
            </TabsTrigger>
          </TabsList>

          {/* --- Basic Information --- */}
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#123d2b] font-medium">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. James Okonkwo" 
                  className="border-[#e1dbd2] focus:ring-[#1f6b4a] bg-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[#123d2b] font-medium">Role</Label>
                <Input 
                  id="role" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="e.g. Property Manager" 
                  className="border-[#e1dbd2] focus:ring-[#1f6b4a] bg-white" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org" className="text-[#123d2b] font-medium">Organisation</Label>
              <Select 
                value={formData.org} 
                onValueChange={(val) => setFormData({...formData, org: val})}
              >
                <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
                  <SelectValue placeholder="Select Organisation" />
                </SelectTrigger>
                <SelectContent className="bg-[#fbf8f2]">
                  <SelectItem value="kenley">Kenley Housing Group</SelectItem>
                  <SelectItem value="croydon">Croydon Support Services</SelectItem>
                  <SelectItem value="south-london">South London Care Ltd</SelectItem>
                  <SelectItem value="bromley">Bromley Homes CIC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* --- Compliance & Training --- */}
          <TabsContent value="compliance" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#123d2b] font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> DBS Status
                </Label>
                <Select 
                  value={formData.dbsStatus}
                  onValueChange={(val) => setFormData({...formData, dbsStatus: val})}
                >
                  <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#fbf8f2]">
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#123d2b] font-medium">Safeguarding</Label>
                <Select 
                  value={formData.safeguarding}
                  onValueChange={(val) => setFormData({...formData, safeguarding: val})}
                >
                  <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#fbf8f2]">
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between">
                <Label className="text-[#123d2b] font-medium">Training Progress</Label>
                <span className="text-[#1f6b4a] font-bold">{formData.trainingProgress}%</span>
              </div>
              <Slider 
                value={[formData.trainingProgress]} 
                onValueChange={(val) => setFormData({...formData, trainingProgress: val[0]})}
                max={100} 
                step={1} 
                className="[&_[role=slider]]:bg-[#1f6b4a]" 
              />
              <p className="text-xs text-[#6b7d74]">Manual override for mandatory module completion.</p>
            </div>
          </TabsContent>

          {/* --- Contract details --- */}
          <TabsContent value="contract" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#123d2b] font-medium">Employment Status</Label>
              <Select 
                value={formData.employmentStatus}
                onValueChange={(val) => setFormData({...formData, employmentStatus: val})}
              >
                <SelectTrigger className="border-[#e1dbd2] bg-white text-[#123d2b]">
                  <SelectValue placeholder="Current Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#fbf8f2]">
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-[#123d2b] font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Contract Expiry
                </Label>
                <Input 
                  id="expiry" 
                  type="date" 
                  value={formData.contractExpiry}
                  onChange={(e) => setFormData({...formData, contractExpiry: e.target.value})}
                  className="border-[#e1dbd2] bg-white text-[#123d2b]" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-active" className="text-[#123d2b] font-medium">Last Active Date</Label>
                <Input 
                  id="last-active" 
                  type="date" 
                  value={formData.lastActive}
                  onChange={(e) => setFormData({...formData, lastActive: e.target.value})}
                  className="border-[#e1dbd2] bg-white text-[#123d2b]" 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-end gap-3 border-t border-[#e1dbd2] mt-6 pt-6">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => router.back()}
            className="border-[#e1dbd2] text-[#123d2b] hover:bg-[#ece7df]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#1f6b4a] text-[#f7f2e9] hover:bg-[#15573c] min-w-[140px]"
          >
            {loading ? "Saving..." : "Save Employee Record"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}