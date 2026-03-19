"use client";

import { useState } from "react";
import { supabase } from "@/lib/superbase/client";
import { toast } from "sonner";
import { 
  Building2, 
  Save, 
  Loader2, 
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddOrganisationModal({ onOrganisationAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "Onboarding",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name) return toast.error("Organisation name is required");

    try {
      setLoading(true);

      const { error } = await supabase
        .from("organisations")
        .insert([{ 
          name: formData.name, 
          status: formData.status 
        }]);

      if (error) throw error;

      toast.success("Organisation created");
      setOpen(false); // Close modal
      setFormData({ name: "", status: "Onboarding" }); // Reset form
      
      if (onOrganisationAdded) onOrganisationAdded(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to create organisation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Organisation
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25 bg-white border-[#e1dbd2]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e6f2ec]">
                <Building2 className="h-5 w-5 text-[#1f6b4a]" />
              </div>
              <DialogTitle className="text-[#123d2b]">Add Organisation</DialogTitle>
            </div>
            <DialogDescription>
              Enter the details of the new management group.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#123d2b]">
                Organisation Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Kenley Group"
                className="border-[#e1dbd2] focus-visible:ring-[#1f6b4a]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#123d2b]">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({ ...formData, status: val })}
                disabled={loading}
              >
                <SelectTrigger className="border-[#e1dbd2]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-[#e1dbd2]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Organisation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}