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
        <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
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
              <Home className="h-12 w-12 text-[#1f6b4a] opacity-20" />
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-black">{property.property_name}</h1>
              <p className="text-muted-foreground">{property.address}, {property.postcode}</p>
            </div>
            <Badge className="bg-[#1f6b4a] text-white capitalize px-3 py-1">
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificates">Compliance</TabsTrigger>
          <TabsTrigger value="documents">General Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="p-6 border-[#e1dbd2] bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-[#1f6b4a] uppercase text-xs tracking-wider">Location Details</h3>
                <DetailItem label="City" value={property.city} />
                <DetailItem label="Postcode" value={property.postcode} />
                <DetailItem label="Full Address" value={property.address} />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-[#1f6b4a] uppercase text-xs tracking-wider">Management</h3>
                <DetailItem label="Property Manager" value={property.manager?.full_name} />
                <DetailItem label="Organisation" value={property.organisation} />
                <DetailItem label="Current Status" value={property.status} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          <Card className="p-6 space-y-4 border-[#e1dbd2] bg-white">
            <h3 className="font-bold text-[#1f6b4a] flex items-center gap-2 mb-2">
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
                    icon={<ShieldCheck className="text-emerald-600" />} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No compliance certificates have been uploaded yet." />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="p-6 space-y-4 border-[#e1dbd2] bg-white">
            <h3 className="font-bold text-[#1f6b4a] flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5" /> Property Documents
            </h3>
            <div className="grid gap-3">
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

function FileRow({ label, subtext, path, icon = <FileText className="text-[#1f6b4a]" /> }) {
  const url = getFileUrl(path);

  if (!path) return null;

  return (
    <div className="flex items-center justify-between p-4 border rounded-xl border-[#e1dbd2] bg-white hover:border-[#1f6b4a] hover:shadow-md transition-all group">
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
        <Button variant="ghost" size="sm" asChild className="text-[#1f6b4a] hover:text-[#123d2b] hover:bg-[#e6f2ec]">
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={16} className="mr-2" /> View
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-[#1f6b4a] hover:text-[#123d2b] hover:bg-[#e6f2ec]">
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
      <AlertCircle className="mx-auto h-10 w-10 text-[#1f6b4a] opacity-20 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}