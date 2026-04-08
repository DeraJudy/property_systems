
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { 
//   ArrowLeft, 
//   Mail, 
//   Phone, 
//   Calendar, 
//   Building2, 
//   ShieldCheck, 
//   Trash2, 
//   Briefcase, 
//   Clock,
//   FileText,
//   AlertCircle,
//   Camera
// } from "lucide-react";
// import StatusBadge from "@/components/dashboard/StatusBadge";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { supabase } from "@/lib/superbase/client";

// const EmployeeDetailPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEmployeeDetails = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("profiles")
//         .select(`
//           *,
//           hr_documents (*)
//         `)
//         .eq("id", params.id)
//         .single();

//       if (!error) {
//         setEmployee(data);
//       }
//       setLoading(false);
//     };

//     if (params.id) fetchEmployeeDetails();
//   }, [params.id]);

//   if (loading) return (
//     <div className="p-10 text-center text-[#6b7d74] bg-[#f5f0e6] min-h-screen">
//       Loading employee profile...
//     </div>
//   );

//   if (!employee) return (
//     <div className="p-10 text-center text-[#dc2626] bg-[#f5f0e6] min-h-screen">
//       Employee not found.
//     </div>
//   );

//   const initials = employee.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

//   return (
//     <div className="min-h-screen bg-[#f5f0e6] pb-10">
//       <div className="max-w-5xl mx-auto p-6 space-y-6">
        
//         {/* Navigation Bar */}
//         <div className="flex items-center justify-between">
//           <Button 
//             variant="ghost" 
//             onClick={() => router.back()} 
//             className="gap-2 text-[#123d2b] hover:bg-[#e6f2ec]"
//           >
//             <ArrowLeft className="h-4 w-4" /> Back to Employees
//           </Button>
//           <div className="flex gap-2">
//             <Button 
//               className="bg-[#1f6b4a] text-[#f7f2e9] hover:bg-[#15573c]"
//               onClick={() => router.push(`/hrList/${employee.id}/edit`)}
//             >
//               Edit Profile
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Main Content Area */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="p-8 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8">
                
//                 {/* Profile Picture Display Section */}
//                 <div className="relative group">
//                   <Avatar className="h-32 w-32 border-4 border-[#f5f0e6] shadow-xl">
//                     <AvatarImage 
//                       src={employee.avatar_url} 
//                       alt={employee.full_name} 
//                       className="object-cover"
//                     />
//                     <AvatarFallback className="bg-[#1f6b4a] text-[#f7f2e9] text-4xl font-bold">
//                       {initials}
//                     </AvatarFallback>
//                   </Avatar>
//                   {/* Subtle edit overlay on hover */}
//                   <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
//                     <Camera className="text-white h-6 w-6" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <h1 className="text-3xl font-bold tracking-tight text-[#123d2b]">
//                     {employee.full_name}
//                   </h1>
//                   <div className="flex flex-wrap items-center gap-2">
//                     <Badge className="bg-[#e8e1d6] text-[#123d2b] hover:bg-[#e8e1d6] font-semibold px-3">
//                       {employee.role}
//                     </Badge>
//                     <StatusBadge status={employee.status} />
//                   </div>
//                   <p className="text-[#6b7d74] text-sm flex items-center gap-2 mt-2">
//                     <Building2 className="h-4 w-4" /> 
//                     Kenley Housing Group — Internal ID: {employee.id.slice(0, 8)}
//                   </p>
//                 </div>
//               </div>

//               <Separator className="my-8 bg-[#e1dbd2]" />

//               {/* Contact & Employment Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//                 <div className="space-y-4">
//                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6b7d74]">
//                     Contact Information
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-4 text-sm text-[#123d2b]">
//                       <div className="p-2 bg-[#e6f2ec] rounded-full">
//                         <Mail className="h-4 w-4 text-[#15573c]" />
//                       </div>
//                       <span>{employee.email}</span>
//                     </div>
                    
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6b7d74]">
//                     Employment Timeline
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-4 text-sm text-[#123d2b]">
//                       <div className="p-2 bg-[#ece7df] rounded-full">
//                         <Calendar className="h-4 w-4 text-[#6b7d74]" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-[#6b7d74]">Hire Date</p>
//                         <p className="font-medium">{employee.created_at ? new Date(employee.created_at).toLocaleDateString('en-GB') : 'Pending'}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* Compliance Section */}
//             <Card className="p-8 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//               <h3 className="text-lg font-bold text-[#123d2b] mb-6 flex items-center gap-2">
//                 <ShieldCheck className="h-5 w-5 text-[#1f6b4a]" /> 
//                 Compliance Verification
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div className="p-5 rounded-2xl border border-[#e1dbd2] bg-[#f5f0e6]/40 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-semibold text-[#123d2b]">DBS Status</span>
//                     <StatusBadge status={employee.hr_documents?.dbs_certificate_url ? "Valid" : "Action Required"} />
//                   </div>
//                   <p className="text-xs text-[#6b7d74] leading-relaxed">
//                     {employee.hr_documents?.dbs_certificate_url 
//                       ? "Certificate has been verified and stored in the secure vault." 
//                       : "Employee has not yet uploaded a valid DBS certificate."}
//                   </p>
//                 </div>

//                 <div className="p-5 rounded-2xl border border-[#e1dbd2] bg-[#f5f0e6]/40 space-y-4">
//                   <div className="flex justify-between items-end">
//                     <div>
//                       <p className="text-xs text-[#6b7d74] font-bold uppercase tracking-wider">Training Score</p>
//                       <p className="text-2xl font-black text-[#1f6b4a]">
//                         {employee.hr_documents?.training_score || 0}%
//                       </p>
//                     </div>
//                     <span className="text-[10px] font-bold text-[#15573c] bg-[#e6f2ec] px-2 py-1 rounded">
//                       { (employee.hr_documents?.training_score || 0) >= 80 ? "PASSED" : "FAILED" }
//                     </span>
//                   </div>
//                   <Progress 
//                     value={employee.hr_documents?.training_score || 0} 
//                     className="h-2 bg-[#ece7df]" 
//                   />
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Sidebar Area */}
//           <div className="space-y-6">
//             <Card className="p-6 bg-[#fbf8f2] border-[#e1dbd2] shadow-sm">
//               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6b7d74] mb-6">
//                 Critical Dates
//               </h3>
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-3 text-[#6b7d74]">
//                     <Clock className="h-4 w-4" /> 
//                     <span>Last Login</span>
//                   </div>
//                   <span className="font-semibold text-[#123d2b]">Active Now</span>
//                 </div>
                
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-3 text-[#6b7d74]">
//                     <Briefcase className="h-4 w-4" /> 
//                     <span>Contract End</span>
//                   </div>
//                   <span className={`font-bold ${!employee.hr_documents?.contract_expiry ? 'text-[#dc2626]' : 'text-[#123d2b]'}`}>
//                     {employee.hr_documents?.contract_expiry 
//                       ? new Date(employee.hr_documents.contract_expiry).toLocaleDateString('en-GB') 
//                       : "Unset"}
//                   </span>
//                 </div>

//                 {!employee.hr_documents?.contract_expiry && (
//                   <div className="flex gap-3 p-4 rounded-xl bg-[#f59e0b15] border border-[#f59e0b30]">
//                     <AlertCircle className="h-5 w-5 text-[#f59e0b] shrink-0" />
//                     <p className="text-[11px] text-[#3b2a00] leading-normal font-medium">
//                       Missing contract expiry date. This may affect compliance reporting.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <Separator className="my-6 bg-[#e1dbd2]" />
              
//               <Button 
//                 variant="destructive" 
//                 className="w-full h-11 bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-sm font-bold" 
//                 onClick={() => router.push('/dashboard/employees')}
//               >
//                 Terminate Employment
//               </Button>
//             </Card>

//             <Card className="p-6 bg-[#123d2b] border-none shadow-lg">
//               <div className="flex items-start gap-3">
//                 <FileText className="h-5 w-5 text-[#f7f2e9] opacity-50" />
//                 <div>
//                   <p className="text-[#f7f2e9] text-[10px] font-black uppercase tracking-widest mb-2">Audit Status</p>
//                   <p className="text-[#f7f2e9]/80 text-sm italic leading-relaxed">
//                     "This profile is currently compliant with Kenley Housing Group workforce standards."
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDetailPage;


import EmployeeDetailView from '@/features/dashbord/hrList/EmployeeDetailView'
import React from 'react'

const page = () => {
  return (
    <div>
      <EmployeeDetailView/>

    </div>
  )
}

export default page