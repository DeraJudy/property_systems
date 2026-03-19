"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/superbase/client";
import { Building2, Home, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewOrganisation() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function getDetails() {
      // Get Org Details
      const { data: orgData } = await supabase.from("organisations").select("*").eq("id", id).single();
      setOrg(orgData);

      // Get Properties and count tenants (Assuming a 'tenants' table linked to 'properties')
      const { data: propData } = await supabase
        .from("properties")
        .select(`*, tenants(count)`)
        .eq("organisation_id", id);
      setProperties(propData || []);
    }
    getDetails();
  }, [id]);

  if (!org) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <Link href="/organisations">
        <Button variant="ghost" className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
      </Link>

      <div className="flex items-center gap-4 border-b pb-6">
        <div className="h-16 w-16 rounded-xl bg-[#e6f2ec] flex items-center justify-center">
          <Building2 className="h-8 w-8 text-[#1f6b4a]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#123d2b]">{org.name}</h1>
          <span className="text-sm font-medium px-2 py-1 rounded bg-slate-100">{org.status}</span>
        </div>
      </div>

      <h2 className="text-xl font-bold flex items-center gap-2"><Home className="h-5 w-5" /> Assigned Properties</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map(prop => (
          <Card key={prop.id} className="p-4 border-[#e1dbd2]">
            <h3 className="font-bold text-[#123d2b]">{prop.name}</h3>
            <p className="text-sm text-muted-foreground">{prop.address || "No address provided"}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-[#1f6b4a]">
              <Users className="mr-2 h-4 w-4" /> 
              {prop.tenants?.[0]?.count || 0} Tenants
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}