// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { supabase } from "@/lib/superbase/client";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, Home, FileText, Wrench, ShieldCheck } from "lucide-react";

// export default function PropertyDetailsPage() {

//   const { id } = useParams();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProperty();
//   }, []);

//   async function fetchProperty() {

//     const { data, error } = await supabase
//       .from("properties")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (!error) setProperty(data);

//     setLoading(false);
//   }

//   if (loading)
//     return (
//       <div className="flex justify-center mt-20">
//         <Loader2 className="animate-spin" />
//       </div>
//     );

//   if (!property) return <div>Property not found</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">

//       {/* Header */}
//       <Card className="p-6 flex items-center gap-4">

//         <div className="p-3 bg-accent rounded-lg">
//           <Home />
//         </div>

//         <div>
//           <h1 className="text-xl font-bold">{property.property_name}</h1>
//           <p className="text-muted-foreground">
//             {property.address} {property.postcode}
//           </p>
//         </div>

//         <Badge className="ml-auto">{property.status}</Badge>

//       </Card>


//       {/* Tabs */}
//       <Tabs defaultValue="overview">

//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="certificates">Certificates</TabsTrigger>
//           <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
//           <TabsTrigger value="documents">Documents</TabsTrigger>
//         </TabsList>

//         {/* OVERVIEW */}
//         <TabsContent value="overview">

//           <Card className="p-6 grid grid-cols-2 gap-4">

//             <div>
//               <p className="text-sm text-muted-foreground">Total Rooms</p>
//               <p className="font-semibold">{property.rooms}</p>
//             </div>

//             <div>
//               <p className="text-sm text-muted-foreground">Occupied</p>
//               <p className="font-semibold">{property.occupied_count}</p>
//             </div>

//             <div>
//               <p className="text-sm text-muted-foreground">Status</p>
//               <p className="font-semibold">{property.status}</p>
//             </div>

//             <div>
//               <p className="text-sm text-muted-foreground">Postcode</p>
//               <p className="font-semibold">{property.postcode}</p>
//             </div>

//           </Card>

//         </TabsContent>

//         {/* CERTIFICATES */}
//         <TabsContent value="certificates">

//           <Card className="p-6 space-y-4">

//             <div className="flex items-center gap-3">
//               <ShieldCheck />
//               <span>Gas Safety Certificate</span>
//               <Badge className="ml-auto">Valid</Badge>
//             </div>

//             <div className="flex items-center gap-3">
//               <ShieldCheck />
//               <span>Fire Risk Assessment</span>
//               <Badge variant="secondary">Expiring Soon</Badge>
//             </div>

//           </Card>

//         </TabsContent>

//         {/* MAINTENANCE */}
//         <TabsContent value="maintenance">

//           <Card className="p-6 space-y-4">

//             <div className="flex items-center gap-3">
//               <Wrench />
//               <div>
//                 <p className="font-medium">Boiler repair</p>
//                 <p className="text-sm text-muted-foreground">
//                   Assigned to Dave Plumbing
//                 </p>
//               </div>
//               <Badge className="ml-auto">In Progress</Badge>
//             </div>

//           </Card>

//         </TabsContent>

//         {/* DOCUMENTS */}
//         <TabsContent value="documents">

//           <Card className="p-6 space-y-3">

//             <a
//               href="/docs/lease-agreement.pdf"
//               download
//               className="flex items-center gap-3 border p-3 rounded-lg hover:bg-muted"
//             >
//               <FileText />
//               Lease Agreement.pdf
//             </a>

//             <a
//               href="/docs/floor-plan.pdf"
//               download
//               className="flex items-center gap-3 border p-3 rounded-lg hover:bg-muted"
//             >
//               <FileText />
//               Floor Plan.pdf
//             </a>

//           </Card>

//         </TabsContent>

//       </Tabs>

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/superbase/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Home, 
  FileText, 
  Wrench, 
  ShieldCheck, 
  ExternalLink,
  AlertCircle 
} from "lucide-react";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPropertyData();
  }, [id]);

  async function fetchPropertyData() {
    try {
      setLoading(true);

      // 1. Fetch main property info
      const { data: propData, error: propError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (propError) throw propError;

      // 2. Fetch related data using exact table names found in your schema
      // I have updated these to 'property_maintenance' and 'property_documents'
      const [certs, maint, docs] = await Promise.all([
        supabase.from("property_certificates").select("*").eq("property_id", id),
        supabase.from("property_maintenance").select("*").eq("property_id", id),
        supabase.from("property_documents").select("*").eq("property_id", id),
      ]);

      // 3. Set state with fallback to empty arrays if no data exists
      setProperty({
        ...propData,
        certificates: certs.data || [],
        maintenance: maint.data || [],
        documents: docs.data || [],
      });

    } catch (error) {
      console.error("Supabase Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#fbf8f2]">
      <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
    </div>
  );

  if (!property) return <div className="p-10 text-center">Property not found. Check your ID and Table names.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 bg-[#fbf8f2] min-h-screen">
      
      {/* HEADER SECTION */}
      <Card className="p-6 flex flex-col md:flex-row md:items-center gap-4 border-[#e1dbd2] shadow-sm bg-white">
        <div className="p-4 bg-[#e6f2ec] rounded-xl">
          <Home className="text-[#1f6b4a] h-6 w-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#123d2b]">{property.property_name}</h1>
          <p className="text-muted-foreground">
            {property.address}, {property.postcode}
          </p>
        </div>
        <Badge className="w-fit bg-[#1f6b4a] px-3 py-1 capitalize">
          {property.status || "Active"}
        </Badge>
      </Card>

      {/* TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-[#e1dbd2]/40 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-4">
          <Card className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-[#e1dbd2]">
            <StatBox label="Total Rooms" value={property.rooms} />
            <StatBox label="Current Occupancy" value={property.occupied_count} />
            <StatBox label="Type" value={property.type || "HMO"} />
            <StatBox label="Postcode" value={property.postcode} />
          </Card>
        </TabsContent>

        {/* CERTIFICATES TAB */}
        <TabsContent value="certificates" className="mt-4">
          <Card className="p-6 space-y-4 border-[#e1dbd2]">
            {property.certificates.length > 0 ? (
              property.certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg border-[#e1dbd2]">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-600 h-5 w-5" />
                    <div>
                      <p className="font-semibold text-[#123d2b]">{cert.certificate_type || cert.name}</p>
                      <p className="text-xs text-muted-foreground">Expires: {cert.expiry_date}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{cert.status}</Badge>
                </div>
              ))
            ) : (
              <EmptyState message="No certificates found in 'property_certificates'." />
            )}
          </Card>
        </TabsContent>

        {/* MAINTENANCE TAB */}
        <TabsContent value="maintenance" className="mt-4">
          <Card className="p-6 space-y-4 border-[#e1dbd2]">
            {property.maintenance.length > 0 ? (
              property.maintenance.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg border-[#e1dbd2]">
                  <div className="flex items-center gap-3">
                    <Wrench className="text-blue-500 h-5 w-5" />
                    <div>
                      <p className="font-semibold text-[#123d2b]">{job.title || "Repair Task"}</p>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700">{job.status}</Badge>
                </div>
              ))
            ) : (
              <EmptyState message="No jobs found in 'property_maintenance'." />
            )}
          </Card>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents" className="mt-4">
          <Card className="p-6 space-y-3 border-[#e1dbd2]">
            {property.documents.length > 0 ? (
              property.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-xl border-[#e1dbd2]">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#1f6b4a] h-5 w-5" />
                    <span className="font-medium text-[#123d2b]">{doc.file_name}</span>
                  </div>
                  <a href={doc.file_url} target="_blank" className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-full">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))
            ) : (
              <EmptyState message="No documents found in 'property_documents'." />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// UI HELPERS
function StatBox({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-[#123d2b]">{value || "—"}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border-2 border-dashed border-[#e1dbd2] rounded-xl">
      <AlertCircle className="h-10 w-10 mb-2 opacity-10" />
      <p className="text-sm italic">{message}</p>
    </div>
  );
}