// "use client";

// import { useState, useEffect } from "react";
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
// import { Textarea } from "@/components/ui/textarea";
// import { 
//   User, 
//   Home, 
//   Calendar, 
//   HeartPulse, 
//   Banknote, 
//   ShieldAlert, 
//   Upload, 
//   Loader2,
//   MapPin
// } from "lucide-react";
// import { toast } from "sonner";

// export default function ServiceUserForm() {
//   const [loading, setLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const [files, setFiles] = useState({
//     idVerification: null,
//     tenancyAgreement: null,
//     benefitLetter: null,
//     riskAssessment: null,
//   });

//   const handleFileChange = (e, field) => {
//     if (e.target.files?.[0]) {
//       setFiles((prev) => ({ ...prev, [field]: e.target.files[0] }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const toastId = toast.loading("Processing service user intake...");

//     // Logic for Supabase upload and DB insert would go here
//     setTimeout(() => {
//       toast.success("Service user profile created successfully!", { id: toastId });
//       setLoading(false);
//     }, 2000);
//   };

//   if (!mounted) return null;

//   return (
//     <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
//       <Card className="max-w-5xl mx-auto border-[#e1dbd2] bg-[#fbf8f2] shadow-sm">
//         <CardHeader className="border-b border-[#e1dbd2] mb-6 bg-[#123d2b] text-[#f7f2e9] rounded-t-lg">
//           <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
//             <User className="w-6 h-6" />
//             Service User Intake Form
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-10">
            
//             {/* --- SECTION 1: PERSONAL DETAILS --- */}
//             <section className="space-y-4">
//               <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
//                 <User className="w-4 h-4" /> Personal Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Service Username</Label>
//                   <Input placeholder="Full Name" className="bg-[#e1dbd2] border-none" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Date of Birth</Label>
//                   <Input type="date" className="bg-[#e1dbd2] border-none" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>NI Number</Label>
//                   <Input placeholder="QQ 12 34 56 C" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Email Address</Label>
//                   <Input type="email" placeholder="email@example.com" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Phone Number</Label>
//                   <Input placeholder="07123 456789" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Emergency Contact</Label>
//                   <Input placeholder="Name & Number" className="bg-[#e1dbd2] border-none" />
//                 </div>
//               </div>
//             </section>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* --- SECTION 2: PLACEMENT & HOUSING --- */}
//             <section className="space-y-4">
//               <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
//                 <Home className="w-4 h-4" /> Placement Details
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Property Name</Label>
//                   <Input placeholder="Assigned Property" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Room Number</Label>
//                   <Input placeholder="Room #" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Street Number</Label>
//                   <Input placeholder="Street #" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Move-in Date</Label>
//                   <Input type="date" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Move-out Date (Optional)</Label>
//                   <Input type="date" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Status</Label>
//                   <Select defaultValue="active">
//                     <SelectTrigger className="bg-[#e1dbd2] border-none">
//                       <SelectValue placeholder="Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="moved-out">Moved Out</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>Previous Address</Label>
//                 <Textarea placeholder="Full previous address..." className="bg-[#e1dbd2] border-none resize-none" rows={2} />
//               </div>
//             </section>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* --- SECTION 3: HEALTH & SUPPORT --- */}
//             <section className="space-y-4">
//               <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
//                 <HeartPulse className="w-4 h-4" /> Health & Support Network
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Doctor Name</Label>
//                   <Input className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Hospital</Label>
//                   <Input className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Key Worker</Label>
//                   <Input className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Social Worker</Label>
//                   <Input className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Primary Need</Label>
//                   <Input className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Support Level</Label>
//                   <Select>
//                     <SelectTrigger className="bg-[#e1dbd2] border-none">
//                       <SelectValue placeholder="Select Level" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="low">Low</SelectItem>
//                       <SelectItem value="medium">Medium</SelectItem>
//                       <SelectItem value="high">High</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Allergies</Label>
//                   <Input placeholder="None" className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Medical Conditions</Label>
//                   <Input placeholder="List conditions" className="bg-[#e1dbd2] border-none" />
//                 </div>
//               </div>
//             </section>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* --- SECTION 4: FINANCIALS --- */}
//             <section className="space-y-4">
//               <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
//                 <Banknote className="w-4 h-4" /> Rent & Benefits
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="space-y-2">
//                   <Label>Benefit Type</Label>
//                   <Input placeholder="UC, ESA, etc." className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Claim Reference</Label>
//                   <Input className="bg-[#e1dbd2] border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Rent Cycle</Label>
//                   <Select defaultValue="weekly">
//                     <SelectTrigger className="bg-[#e1dbd2] border-none">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="weekly">Weekly</SelectItem>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Current Rent (£)</Label>
//                   <Input type="number" className="bg-[#e1dbd2] border-none" />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#e6f2ec] p-4 rounded-lg">
//                 <div className="space-y-2">
//                   <Label className="text-[#15573c]">Weekly Eligible Rent</Label>
//                   <Input type="number" className="bg-white border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-[#15573c]">Service Charge</Label>
//                   <Input type="number" className="bg-white border-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-[#15573c]">Shortfall</Label>
//                   <Input type="number" className="bg-white border-none" />
//                 </div>
//               </div>
//             </section>

//             <Separator className="bg-[#e1dbd2]" />

//             {/* --- SECTION 5: DOCUMENT VAULT --- */}
//             <section className="space-y-4">
//               <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2 uppercase text-sm tracking-wider">
//                 <ShieldAlert className="w-4 h-4" /> Document Vault
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {[
//                   { label: "ID Verification", field: "idVerification" },
//                   { label: "Tenancy Agreement", field: "tenancyAgreement" },
//                   { label: "Benefit Letter", field: "benefitLetter" },
//                   { label: "Risk Assessment", field: "riskAssessment" },
//                 ].map((doc) => (
//                   <div key={doc.field} className="space-y-2">
//                     <Label className="text-[11px] font-bold text-[#123d2b] uppercase">{doc.label}</Label>
//                     <div className="relative">
//                       <Input 
//                         type="file" 
//                         className="hidden" 
//                         id={doc.field} 
//                         onChange={(e) => handleFileChange(e, doc.field)} 
//                       />
//                       <Label 
//                         htmlFor={doc.field} 
//                         className="flex flex-col items-center justify-center p-4 bg-[#f7f2e9] border-2 border-dashed border-[#e1dbd2] 
//                         rounded-lg cursor-pointer hover:border-[#1f6b4a] transition-all text-center min-h-25"
//                       >
//                         <Upload className="w-5 h-5 mb-2 text-[#1f6b4a]" />
//                         <span className="text-xs font-medium text-[#123d2b] line-clamp-1 px-2">
//                           {files[doc.field] ? files[doc.field].name : "Select File"}
//                         </span>
//                       </Label>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             <div className="pt-8 flex justify-end gap-4">
//               <Button type="button" variant="outline" className="border-[#1f6b4a] text-[#1f6b4a] hover:bg-[#e6f2ec]">
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading} className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white px-10">
//                 {loading ? <Loader2 className="animate-spin mr-2" /> : "Complete Intake"}
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Home, 
  HeartPulse, 
  Banknote, 
  ShieldAlert, 
  Upload, 
  Loader2,
  MapPin,
  ClipboardCheck
} from "lucide-react";
import { toast } from "sonner";

export default function ServiceUserTabsForm() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("key-info");

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
    const toastId = toast.loading("Saving service user profile...");
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Profile successfully created!", { id: toastId });
      setLoading(false);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
      <Card className="max-w-5xl mx-auto border-[#e1dbd2] bg-[#fbf8f2] shadow-sm overflow-hidden">
        <CardHeader className="bg-[#123d2b] text-[#f7f2e9] p-6">
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Service User Intake
          </CardTitle>
          <p className="text-[#f7f2e9]/70 text-sm mt-1">Complete all sections to register a new service user.</p>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* --- TAB NAVIGATION --- */}
              <TabsList className="w-full justify-start rounded-none bg-[#f1ede4] border-b border-[#e1dbd2] h-auto p-0 flex-wrap">
                <TabsTrigger value="key-info" className="data-[state=active]:bg-[#fbf8f2] data-[state=active]:text-[#1f6b4a] rounded-none py-4 px-6 border-r border-[#e1dbd2]">
                  Key Information
                </TabsTrigger>
                <TabsTrigger value="medical" className="data-[state=active]:bg-[#fbf8f2] data-[state=active]:text-[#1f6b4a] rounded-none py-4 px-6 border-r border-[#e1dbd2]">
                  Medical History
                </TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-[#fbf8f2] data-[state=active]:text-[#1f6b4a] rounded-none py-4 px-6 border-r border-[#e1dbd2]">
                  Financials
                </TabsTrigger>
                <TabsTrigger value="address" className="data-[state=active]:bg-[#fbf8f2] data-[state=active]:text-[#1f6b4a] rounded-none py-4 px-6 border-r border-[#e1dbd2]">
                  Address History
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-[#fbf8f2] data-[state=active]:text-[#1f6b4a] rounded-none py-4 px-6">
                  Documents
                </TabsTrigger>
              </TabsList>

              <div className="p-6 md:p-8">
                {/* --- TAB 1: KEY INFORMATION --- */}
                <TabsContent value="key-info" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Service Username</Label>
                      <Input placeholder="John Doe" className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input type="date" className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>NI Number</Label>
                      <Input placeholder="QQ123456C" className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="john@example.com" className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="07123456789" className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select defaultValue="active">
                        <SelectTrigger className="bg-[#e1dbd2] border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator className="bg-[#e1dbd2]" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Key Worker</Label>
                      <Input className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Social Worker</Label>
                      <Input className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact</Label>
                      <Input placeholder="Name & Phone" className="bg-[#e1dbd2] border-none" />
                    </div>
                  </div>
                </TabsContent>

                {/* --- TAB 2: MEDICAL HISTORY --- */}
                <TabsContent value="medical" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Doctor Name</Label>
                      <Input className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hospital</Label>
                      <Input className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Allergies</Label>
                      <Textarea placeholder="List any known allergies..." className="bg-[#e1dbd2] border-none resize-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Medical Conditions</Label>
                      <Textarea placeholder="Existing medical conditions..." className="bg-[#e1dbd2] border-none resize-none" />
                    </div>
                  </div>
                  <Separator className="bg-[#e1dbd2]" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Primary Need</Label>
                      <Input className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Need</Label>
                      <Input className="bg-[#e1dbd2] border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Support Level</Label>
                      <Select>
                        <SelectTrigger className="bg-[#e1dbd2] border-none">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Support</SelectItem>
                          <SelectItem value="medium">Medium Support</SelectItem>
                          <SelectItem value="high">High Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* --- TAB 3: FINANCIALS --- */}
                <TabsContent value="financial" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Benefit Type</Label>
                      <Input placeholder="Universal Credit, etc." className="bg-[#e1dbd2] border-none" />
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
                          <SelectItem value="fortnightly">Fortnightly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="bg-[#e6f2ec] p-6 rounded-lg border border-[#1f6b4a]/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#15573c] font-bold">Weekly Eligible Rent</Label>
                      <Input type="number" className="bg-white border-none" placeholder="£ 0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#15573c] font-bold">Service Charge</Label>
                      <Input type="number" className="bg-white border-none" placeholder="£ 0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#15573c] font-bold">Shortfall</Label>
                      <Input type="number" className="bg-white border-none" placeholder="£ 0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#15573c] font-bold">Current Rent</Label>
                      <Input type="number" className="bg-white border-none" placeholder="£ 0.00" />
                    </div>
                  </div>
                </TabsContent>

                {/* --- TAB 4: ADDRESS HISTORY --- */}
                <TabsContent value="address" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h4 className="text-[#1f6b4a] font-semibold text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Current Placement
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Property Name</Label>
                        <Input className="bg-[#e1dbd2] border-none" />
                      </div>
                      <div className="space-y-2">
                        <Label>Room Number</Label>
                        <Input className="bg-[#e1dbd2] border-none" />
                      </div>
                      <div className="space-y-2">
                        <Label>Street Number</Label>
                        <Input className="bg-[#e1dbd2] border-none" />
                      </div>
                      <div className="space-y-2">
                        <Label>Move-in Date</Label>
                        <Input type="date" className="bg-[#e1dbd2] border-none" />
                      </div>
                      <div className="space-y-2">
                        <Label>Move-out Date</Label>
                        <Input type="date" className="bg-[#e1dbd2] border-none" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-[#e1dbd2]" />
                  
                  <div className="space-y-4">
                    <h4 className="text-[#1f6b4a] font-semibold text-sm">Previous Residency</h4>
                    <div className="space-y-2">
                      <Label>Previous Address</Label>
                      <Textarea placeholder="Enter full previous address details..." className="bg-[#e1dbd2] border-none resize-none" rows={3} />
                    </div>
                  </div>
                </TabsContent>

                {/* --- TAB 5: DOCUMENTS --- */}
                <TabsContent value="documents" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: "ID Verification", field: "idVerification" },
                      { label: "Tenancy Agreement", field: "tenancyAgreement" },
                      { label: "Benefit Letter", field: "benefitLetter" },
                      { label: "Risk Assessment", field: "riskAssessment" },
                    ].map((doc) => (
                      <div key={doc.field} className="p-4 border border-[#e1dbd2] bg-[#f7f2e9]/50 rounded-lg flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm font-bold text-[#123d2b]">{doc.label}</Label>
                          <p className="text-[10px] text-[#123d2b]/60 uppercase tracking-tighter">PDF, JPG, or PNG</p>
                        </div>
                        <div className="relative">
                          <Input type="file" className="hidden" id={doc.field} onChange={(e) => handleFileChange(e, doc.field)} />
                          <Label 
                            htmlFor={doc.field} 
                            className="cursor-pointer flex items-center gap-2 bg-[#1f6b4a] hover:bg-[#123d2b] text-white px-4 py-2 rounded text-xs transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            {files[doc.field] ? "Change" : "Upload"}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* File Names Display */}
                  <div className="mt-4 space-y-2">
                     {Object.entries(files).map(([key, file]) => file && (
                       <div key={key} className="text-[11px] flex items-center gap-2 text-[#1f6b4a]">
                         <ClipboardCheck className="w-3 h-3" /> {file.name}
                       </div>
                     ))}
                  </div>
                </TabsContent>
              </div>

              {/* --- FORM ACTIONS --- */}
              <div className="p-6 bg-[#f1ede4] border-t border-[#e1dbd2] flex justify-between items-center">
                <p className="text-[10px] text-[#123d2b]/50 italic">* Ensure all mandatory medical and key-worker data is entered.</p>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" className="text-[#123d2b] hover:bg-[#e1dbd2]">
                    Save Draft
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white px-8">
                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Complete Intake"}
                  </Button>
                </div>
              </div>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}