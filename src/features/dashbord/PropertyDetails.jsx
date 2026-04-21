"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/superbase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Home,
  FileText,
  ShieldCheck,
  ExternalLink,
  Download,
  AlertCircle,
  ArrowLeft,
  User
} from "lucide-react";

/**
 * Helper to get public URL with a cache-busting timestamp.
 * This ensures that if a file is replaced in storage, the browser
 * fetches the new version instead of showing the cached one.
 */
function getFileUrl(path) {
  if (!path) return null;
  const { data } = supabase.storage.from("property-documents").getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPropertyData();
  }, [id]);

  async function fetchPropertyData() {
    try {
      setLoading(true);
      
      //Fetch Property and join with profiles for the manager name
      const { data: propData, error: propError } = await supabase
        .from("properties")
        .select(`
          *,
          manager:profiles!created_by(full_name)
        `)
        .eq("id", id)
        .single();

      if (propError) throw propError;

      // 2. Fetch all certificates for this property
      const { data: certs, error: certError } = await supabase
        .from("property_certificates")
        .select("*")
        .eq("property_id", id)
        .order('expiry_date', { ascending: true }); // Show soonest to expire first

      if (certError) throw certError;

      setProperty(propData);
      setCertificates(certs || []);
    } catch (error) {
      console.error("Error fetching property details:", error.message);
    } finally {
      setLoading(false);
    }
  }
  

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center ">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold">Property not found</h2>
        <Button onClick={() => router.push("/properties")} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 min-h-screen ">
      
      {/* Navigation */}
      <Button 
        variant="ghost" 
        onClick={() => router.push("/properties")} 
        className="text-black  hover:bg-[#e1dbd2] mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>

      {/* Header Card */}
      <Card className="overflow-hidden flex flex-col md:flex-row border-[#e1dbd2] bg-[#FFFDD0] shadow-sm">
        <div className="w-full md:w-80 h-64 md:h-auto bg-[#e8e1d6] shrink-0 relative">
          {property.image_url ? (
            <img 
              src={getFileUrl(property.image_url)} 
              alt={property.property_name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Home className="h-12 w-12 text-black opacity-20" />
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-black">{property.property_name}</h1>
              <p className="text-muted-foreground">{property.address}, {property.postcode}</p>
            </div>
            <Badge className="bg-black text-white capitalize px-3 py-1">
              {property.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-[#f0ede8]">
            <StatBox label="Rooms" value={property.rooms || "0"} />
            <StatBox label="Rent" value={property.rent ? `£${property.rent}` : "—"} />
            <StatBox label="Organisation" value={property.organisation || "N/A"} />
            <StatBox label="Manager" value={property.manager?.full_name || "Unassigned"} />
          </div>
        </div>
      </Card>

      {/* Detailed Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-[#e1dbd2]/40 p-1">
          <TabsTrigger value="overview" 
          className='data-[state=active]:bg-[#FFFDD0] data-[state=active]:text=black'>
            Overview
          </TabsTrigger>
          <TabsTrigger value="certificates" className='data-[state=active]:bg-[#FFFDD0] 
          data-[state=active]:text=black'>
            Compliance
          </TabsTrigger>
          <TabsTrigger value="documents" className='data-[state=active]:bg-[#FFFDD0] 
          data-[state=active]:text=black'>
            General Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="p-6 border-[#e1dbd2] bg-[#FFFDD0]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-black uppercase text-xs tracking-wider">Location Details</h3>
                <DetailItem label="City" value={property.city} />
                <DetailItem label="Postcode" value={property.postcode} />
                <DetailItem label="Full Address" value={property.address} />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-black uppercase text-xs tracking-wider">Management</h3>
                <DetailItem label="Property Manager" value={property.manager?.full_name} />
                <DetailItem label="Organisation" value={property.organisation} />
                <DetailItem label="Current Status" value={property.status} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4 text-black">
          <Card className="p-6 space-y-4 border-[#e1dbd2] bg-[#FFFDD0]">
            <h3 className="font-bold text-black flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5" /> Safety & Compliance
            </h3>
            {certificates.length > 0 ? (
              <div className="grid gap-3">
                {certificates.map(cert => (
                  <FileRow 
                    key={cert.id} 
                    label={cert.certificate_type} 
                    subtext={`Expiry: ${cert.expiry_date || 'No date'}`} 
                    path={cert.document_url} 
                    icon={<ShieldCheck className="text-black" />} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No compliance certificates have been uploaded yet." />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="p-6 space-y-4 border-[#e1dbd2] bg-[#FFFDD0]">
            <h3 className="font-bold text-black flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5" /> Property Documents
            </h3>
            <div className="grid gap-3 text-black">
              {property.lease_url ? (
                <FileRow label="Lease Agreement" path={property.lease_url} />
              ) : null}
              {property.floor_plan_url ? (
                <FileRow label="Floor Plan" path={property.floor_plan_url} />
              ) : null}
              {property.insurance_url ? (
                <FileRow label="Insurance Document" path={property.insurance_url} />
              ) : null}
              
              {!property.lease_url && !property.floor_plan_url && !property.insurance_url && (
                <EmptyState message="No general documents available for this property." />
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* --- UI COMPONENTS --- */

function StatBox({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{label}</p>
      <p className="text-lg font-bold text-black truncate">{value}</p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="border-b border-[#f0ede8] pb-2">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-black font-semibold">{value || "—"}</p>
    </div>
  );
}

function FileRow({ label, subtext, path, icon = <FileText className="text-black" /> }) {
  const url = getFileUrl(path);

  if (!path) return null;

  return (
    <div className="flex items-center justify-between p-4 border rounded-xl border-[#e1dbd2] 
    bg-white  hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-[#f4f1ea] rounded-lg group-hover:bg-[#e6f2ec] transition-colors">
          {icon}
        </div>
        <div>
          <p className="font-bold text-[#123d2b] capitalize">{label.replace(/_/g, ' ')}</p>
          {subtext && <p className="text-xs text-muted-foreground font-medium">{subtext}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="text-black hover:text-[#123d2b] 
        hover:bg-[#e6f2ec]">
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={16} className="mr-2" /> View
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-black hover:text-[#123d2b] 
        hover:bg-[#e6f2ec]">
          <a href={url} download>
            <Download size={16} className="mr-2" /> Get
          </a>
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-12 border-2 border-dashed border-[#e1dbd2] rounded-2xl bg-[#fbf8f2]/50">
      <AlertCircle className="mx-auto h-10 w-10 text-black opacity-20 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { supabase } from "@/lib/superbase/client";
// import { toast } from "sonner";
// import { 
//   Loader2, ArrowLeft, Home, Building2, MapPin, 
//   ShieldCheck, FileText, Edit, ExternalLink, 
//   Banknote, BedDouble, Calendar, CheckCircle2,
//   Clock, AlertCircle, LayoutDashboard
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import PageBanner from "@/components/dashboard/PageBanner";

// export default function PropertyViewPage() {
//   const router = useRouter();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [property, setProperty] = useState(null);
//   const [certificates, setCertificates] = useState([]);

//   useEffect(() => {
//     async function fetchPropertyDetails() {
//       try {
//         // 1. Fetch main property data
//         const { data: propData, error: propError } = await supabase
//           .from("properties")
//           .select("*")
//           .eq("id", id)
//           .single();

//         if (propError) throw propError;
//         setProperty(propData);

//         // 2. Fetch associated certificates
//         const { data: certData } = await supabase
//           .from("property_certificates")
//           .select("*")
//           .eq("property_id", id);
        
//         setCertificates(certData || []);
//       } catch (err) {
//         toast.error("Could not load property details");
//         router.push("/properties");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchPropertyDetails();
//   }, [id, router]);

//   const openFile = (path) => {
//     if (!path) return;
//     const { data } = supabase.storage.from("property-documents").getPublicUrl(path);
//     window.open(data.publicUrl, "_blank");
//   };

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-[#FFFDD0]">
//       <Loader2 className="animate-spin w-10 h-10 text-black" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen p-4 md:p-8 bg-transparent">
//       {/* Top Navigation */}
//       <div className="mx-auto mb-6 flex items-center justify-between">
//         <Button variant="ghost" onClick={() => router.push("/properties")} className="font-bold gap-2">
//           <ArrowLeft className="h-4 w-4" /> Back to Portfolio
//         </Button>
//         <Button 
//           onClick={() => router.push(`/properties/${id}/edit`)}
//           className="bg-black text-[#FFFDD0] font-bold gap-2 rounded-xl px-6"
//         >
//           <Edit className="h-4 w-4" /> Edit Property
//         </Button>
//       </div>

//       <PageBanner 
//         title={property.property_name} 
//         subtitle={property.address} 
//         category="Property Profile" 
//       />

//       <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
//         {/* LEFT COLUMN: Image & Quick Stats */}
//         <div className="lg:col-span-1 space-y-6">
//           <Card className="border-none bg-white shadow-xl rounded-3xl overflow-hidden">
//             <div className="aspect-square relative bg-gray-100">
//               {property.image_url ? (
//                 <img 
//                   src={supabase.storage.from("property-documents").getPublicUrl(property.image_url).data.publicUrl} 
//                   alt="Property" 
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full text-gray-300">
//                   <Home className="w-16 h-16 mb-2" />
//                   <span className="font-bold uppercase text-[10px] tracking-widest">No Image</span>
//                 </div>
//               )}
//               <Badge className="absolute top-4 right-4 bg-black text-[#FFFDD0] border-none px-4 py-1 italic font-black">
//                 {property.status}
//               </Badge>
//             </div>
//             <CardContent className="p-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-[#f8f5f0] p-4 rounded-2xl border border-black/5">
//                   <p className="text-[10px] font-black uppercase opacity-40 mb-1">Total Rooms</p>
//                   <div className="flex items-center gap-2">
//                     <BedDouble className="w-4 h-4" />
//                     <span className="text-xl font-bold">{property.rooms || 0}</span>
//                   </div>
//                 </div>
//                 <div className="bg-[#f8f5f0] p-4 rounded-2xl border border-black/5">
//                   <p className="text-[10px] font-black uppercase opacity-40 mb-1">Monthly Yield</p>
//                   <div className="flex items-center gap-2">
//                     <Banknote className="w-4 h-4 text-green-600" />
//                     <span className="text-xl font-bold">£{property.rent || 0}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-none bg-black text-[#FFFDD0] rounded-3xl shadow-xl p-6">
//             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Management</h3>
//             <div className="flex items-center gap-4">
//               <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
//                 <Building2 className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm font-bold">{property.organisation || "Private Entry"}</p>
//                 <p className="text-[10px] opacity-50 uppercase font-bold tracking-wider">Assigned Provider</p>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN: Details & Documents */}
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* Detailed Info */}
//           <Card className="border-none bg-white shadow-xl rounded-3xl p-8">
//             <div className="flex items-center gap-3 mb-6">
//                <div className="p-2 bg-black rounded-lg text-white"><LayoutDashboard className="w-5 h-5" /></div>
//                <h2 className="text-xl font-black uppercase tracking-tighter italic">Property Overview</h2>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-4">
//                 <div>
//                   <Label className="text-[10px] font-black uppercase opacity-40">Street Address</Label>
//                   <p className="font-bold flex items-center gap-2 mt-1"><MapPin className="w-4 h-4 text-gray-400" /> {property.address}</p>
//                 </div>
//                 <div>
//                   <Label className="text-[10px] font-black uppercase opacity-40">City / Region</Label>
//                   <p className="font-bold mt-1">{property.city}</p>
//                 </div>
//                 <div>
//                   <Label className="text-[10px] font-black uppercase opacity-40">Postcode</Label>
//                   <p className="font-bold mt-1">{property.postcode}</p>
//                 </div>
//               </div>

              
//             </div>
//           </Card>

//           {/* Documents Section */}
//           <Card className="border-none bg-white shadow-xl rounded-3xl overflow-hidden">
//             <CardHeader className="bg-black/2 border-b border-black/5 p-8">
//               <CardTitle className="text-lg font-black uppercase italic flex items-center gap-3">
//                 <FileText className="w-5 h-5" /> Compliance & Legal Vault
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 {/* Fixed Legal Files */}
//                 <div 
//                   className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors"
//                   onClick={() => openFile(property.lease_url)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <FileText className="text-blue-600 w-5 h-5" />
//                     <div>
//                       <p className="text-sm font-black uppercase">Lease Agreement</p>
//                       <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Legal Document</p>
//                     </div>
//                   </div>
//                   <ExternalLink className="w-4 h-4 text-blue-300" />
//                 </div>

//                 <div 
//                   className="flex items-center justify-between p-4 bg-green-50/50 border border-green-100 rounded-2xl cursor-pointer hover:bg-green-50 transition-colors"
//                   onClick={() => openFile(property.insurance_url)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <ShieldCheck className="text-green-600 w-5 h-5" />
//                     <div>
//                       <p className="text-sm font-black uppercase">Insurance Policy</p>
//                       <p className="text-[10px] text-green-400 font-bold uppercase tracking-tighter">Protection</p>
//                     </div>
//                   </div>
//                   <ExternalLink className="w-4 h-4 text-green-300" />
//                 </div>
//               </div>

//               <Separator className="mb-8 opacity-10" />

//               <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Safety Certificates</h3>
//               <div className="space-y-3">
//                 {certificates.length > 0 ? (
//                   certificates.map((cert) => {
//                     const isExpired = new Date(cert.expiry_date) < new Date();
//                     return (
//                       <div 
//                         key={cert.id}
//                         className="flex items-center justify-between p-4 border border-black/5 rounded-2xl hover:border-black/20 transition-all group cursor-pointer bg-gray-50/50"
//                         onClick={() => openFile(cert.document_url)}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className={`p-2 rounded-lg ${isExpired ? 'bg-red-100' : 'bg-gray-200'}`}>
//                              {isExpired ? <AlertCircle className="w-4 h-4 text-red-600" /> : <Clock className="w-4 h-4 text-gray-600" />}
//                           </div>
//                           <div>
//                             <p className="text-sm font-bold">{cert.certificate_type}</p>
//                             <p className={`text-[10px] font-bold uppercase ${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
//                               Expires: {new Date(cert.expiry_date).toLocaleDateString()} {isExpired && "(EXPIRED)"}
//                             </p>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
//                           View <ExternalLink className="w-3 h-3 ml-2" />
//                         </Button>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="text-center py-10 border-2 border-dashed border-black/5 rounded-3xl">
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No safety certificates found</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }