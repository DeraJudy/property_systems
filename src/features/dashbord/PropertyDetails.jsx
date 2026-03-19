"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/superbase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

function getFileUrl(path) {
  if (!path) return null;
  const { data } = supabase.storage.from("property-documents").getPublicUrl(path);
  return data.publicUrl;
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
      
      // We alias the relationship to 'manager' for cleaner access
      const { data: propData, error } = await supabase
        .from("properties")
        .select(`
          *,
          manager:profiles!created_by(full_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      const { data: certs } = await supabase
        .from("property_certificates")
        .select("*")
        .eq("property_id", id);

      setProperty(propData || {});
      setCertificates(certs || []);
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

  if (!property) return <div className="p-10 text-center">Property not found.</div>;

  const propertyImageUrl = getFileUrl(property.image_url);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 bg-[#fbf8f2] min-h-screen">
      
      {/* 1. BACK BUTTON */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="text-[#123d2b] hover:bg-[#e1dbd2] mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>

      {/* 2. HEADER WITH IMAGE */}
      <Card className="overflow-hidden border-[#e1dbd2] bg-white shadow-sm flex flex-col md:flex-row">
        <div className="w-full md:w-80 h-64 md:h-auto bg-[#e8e1d6] relative shrink-0">
          {propertyImageUrl ? (
            <img 
              src={propertyImageUrl} 
              alt="Property" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Home className="h-12 w-12 text-[#1f6b4a] opacity-20" />
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#123d2b]">{property.property_name}</h1>
              <p className="text-muted-foreground">{property.address}, {property.postcode}</p>
            </div>
            <Badge className="bg-[#1f6b4a] text-white capitalize">{property.status}</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-4 border-t border-[#f0ede8]">
            {/* 3. MANAGER NAME DISPLAY */}
            <StatBox label="Rooms" value={property.rooms} />
            <StatBox label="Rent" value={property.rent ? `£${property.rent}` : "—"} />
            <StatBox label="Org" value={property.organisation} />
          </div>
        </div>
      </Card>

      {/* TABS SECTION */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-[#e1dbd2]/40">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6 border-[#e1dbd2]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
                <DetailItem label="Property Manager" value={property.manager?.full_name || "Manger"} />
                <DetailItem label="City" value={property.city} />
                <DetailItem label="Tenant" value={property.tenant_name || "Vacant"} />
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card className="p-6 space-y-4 border-[#e1dbd2]">
            {certificates.length > 0 ? (
              certificates.map(cert => (
                <FileRow 
                  key={cert.id} 
                  label={cert.certificate_type} 
                  subtext={`Expires: ${cert.expiry_date}`}
                  path={cert.document_url} 
                  icon={<ShieldCheck className="text-emerald-600" />} 
                />
              ))
            ) : <EmptyState message="No certificates uploaded." />}
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6 space-y-4 border-[#e1dbd2]">
            {property.lease_url && <FileRow label="Lease" path={property.lease_url} />}
            {property.floor_plan_url && <FileRow label="Floor Plan" path={property.floor_plan_url} />}
            {property.insurance_url && <FileRow label="Insurance" path={property.insurance_url} />}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* --- SMALL HELPER COMPONENTS --- */

function StatBox({ label, value, icon }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-lg font-bold text-[#123d2b] truncate">{value}</p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="border-b border-[#f0ede8] pb-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-[#123d2b]">{value || "—"}</p>
    </div>
  );
}

function FileRow({ label, subtext, path, icon = <FileText className="text-[#1f6b4a]" /> }) {
  const url = getFileUrl(path);
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg border-[#e1dbd2] hover:bg-white transition-all">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-semibold text-[#123d2b] capitalize">{label}</p>
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>
      </div>
      <div className="flex gap-4">
        <a href={url} target="_blank" className="text-sm font-medium text-[#1f6b4a] flex items-center gap-1"><ExternalLink size={14}/> View</a>
        <a href={url} download className="text-sm font-medium text-[#1f6b4a] flex items-center gap-1"><Download size={14}/> Get</a>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-10 border-2 border-dashed border-[#e1dbd2] rounded-xl text-muted-foreground">
      <AlertCircle className="mx-auto mb-2 opacity-20" />
      <p className="text-sm">{message}</p>
    </div>
  );
}