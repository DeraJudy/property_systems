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
  ShieldCheck,
  ExternalLink,
  Download,
  AlertCircle
} from "lucide-react";

/* ---------------------------------------
   GET PUBLIC FILE URL
--------------------------------------- */

function getFileUrl(path) {
  if (!path) return "#";

  const { data } = supabase.storage
    .from("property-documents")
    .getPublicUrl(path);

  return data.publicUrl;
}

/* ---------------------------------------
   PAGE
--------------------------------------- */

export default function PropertyDetailsPage() {

  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPropertyData();
  }, [id]);

  /* ---------------------------------------
     FETCH DATA
  --------------------------------------- */

  async function fetchPropertyData() {

    try {

      setLoading(true);

      const { data: propData, error } = await supabase
        .from("properties")
        .select("*")
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

  /* ---------------------------------------
     LOADING
  --------------------------------------- */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fbf8f2]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1f6b4a]" />
      </div>
    );
  }

  /* ---------------------------------------
     NO PROPERTY
  --------------------------------------- */

  if (!property) {
    return (
      <div className="p-10 text-center">
        Property not found.
      </div>
    );
  }

  /* ---------------------------------------
     UI
  --------------------------------------- */

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 bg-[#fbf8f2] min-h-screen">

      {/* HEADER */}

      <Card className="p-6 flex flex-col md:flex-row md:items-center gap-4 border-[#e1dbd2] bg-white">

        <div className="p-4 bg-[#e6f2ec] rounded-xl">
          <Home className="text-[#1f6b4a] h-6 w-6" />
        </div>

        <div className="flex-1">

          <h1 className="text-2xl font-bold text-[#123d2b]">
            {property.property_name}
          </h1>

          <p className="text-muted-foreground">
            {property.address}, {property.postcode}
          </p>

        </div>

        <Badge className="bg-[#1f6b4a] text-white capitalize">
          {property.status || "Active"}
        </Badge>

      </Card>

      {/* TABS */}

      <Tabs defaultValue="overview">

        <TabsList className="bg-[#e1dbd2]/40">

          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>

          <TabsTrigger value="certificates">
            Certificates
          </TabsTrigger>

          <TabsTrigger value="documents">
            Documents
          </TabsTrigger>

        </TabsList>

        {/* OVERVIEW */}

        <TabsContent value="overview">

          <Card className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-[#e1dbd2]">

            <StatBox label="Rooms" value={property.rooms} />

            <StatBox
              label="Rent"
              value={property.rent ? `£${property.rent}` : "—"}
            />

            {/* <StatBox label="Tenant" value={property.tenant_name} /> */}

            <StatBox label="Organisation" value={property.organisation} />

          </Card>

        </TabsContent>


        {/* CERTIFICATES */}

        <TabsContent value="certificates">

          <Card className="p-6 space-y-4 border-[#e1dbd2]">

            {Array.isArray(certificates) && certificates.length > 0 ? (

              certificates.map((cert) => {

                const fileUrl = getFileUrl(cert.document_url);

                return (

                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 border rounded-lg border-[#e1dbd2]"
                  >

                    <div className="flex items-center gap-3">

                      <ShieldCheck className="text-emerald-600 h-5 w-5" />

                      <div>

                        <p className="font-semibold text-[#123d2b]">
                          {cert.certificate_type}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Expires: {cert.expiry_date}
                        </p>

                      </div>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex gap-3">

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#1f6b4a]"
                      >
                        <ExternalLink size={16} />
                        View
                      </a>

                      <a
                        href={fileUrl}
                        download
                        className="flex items-center gap-2 text-[#1f6b4a]"
                      >
                        <Download size={16} />
                        Download
                      </a>

                    </div>

                  </div>

                );

              })

            ) : (

              <EmptyState message="No certificates uploaded." />

            )}

          </Card>

        </TabsContent>


        {/* DOCUMENTS */}

        <TabsContent value="documents">

          <Card className="p-6 space-y-4 border-[#e1dbd2]">

            {property.lease_url && (
              <DocumentRow label="Lease Document" path={property.lease_url} />
            )}

            {property.floor_plan_url && (
              <DocumentRow label="Floor Plan" path={property.floor_plan_url} />
            )}

            {property.insurance_url && (
              <DocumentRow label="Insurance Document" path={property.insurance_url} />
            )}

            {!property.lease_url &&
             !property.floor_plan_url &&
             !property.insurance_url && (
              <EmptyState message="No documents uploaded." />
            )}

          </Card>

        </TabsContent>

      </Tabs>

    </div>
  );
}

/* ---------------------------------------
   DOCUMENT ROW
--------------------------------------- */

function DocumentRow({ label, path }) {

  const url = getFileUrl(path);

  return (

    <div className="flex items-center justify-between p-4 border rounded-lg border-[#e1dbd2]">

      <div className="flex items-center gap-3">
        <FileText className="text-[#1f6b4a]" />
        <span className="font-medium">{label}</span>
      </div>

      <div className="flex gap-3">

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#1f6b4a]"
        >
          <ExternalLink size={16} />
          View
        </a>

        <a
          href={url}
          download
          className="flex items-center gap-2 text-[#1f6b4a]"
        >
          <Download size={16} />
          Download
        </a>

      </div>

    </div>

  );
}

/* ---------------------------------------
   STAT BOX
--------------------------------------- */

function StatBox({ label, value }) {

  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase">{label}</p>
      <p className="text-lg font-bold text-[#123d2b]">
        {value || "—"}
      </p>
    </div>
  );

}

/* ---------------------------------------
   EMPTY STATE
--------------------------------------- */

function EmptyState({ message }) {

  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border-2 border-dashed border-[#e1dbd2] rounded-xl">
      <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
      <p className="text-sm">{message}</p>
    </div>
  );

}