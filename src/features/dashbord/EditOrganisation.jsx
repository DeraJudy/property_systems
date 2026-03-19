"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/superbase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditOrganisation() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchOrg() {
      const { data } = await supabase.from("organisations").select("*").eq("id", id).single();
      if (data) {
        setName(data.name);
        setStatus(data.status);
      }
    }
    fetchOrg();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("organisations")
      .update({ name, status })
      .eq("id", id);

    if (error) toast.error("Update failed");
    else {
      toast.success("Updated successfully");
      router.push("/organisations");
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Organisation</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="text-sm font-bold">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-bold">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Onboarding">Onboarding</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-[#1f6b4a]">Save Changes</Button>
      </form>
    </div>
  );
}