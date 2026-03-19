"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/superbase/client";
import { toast } from "sonner";
import { 
  Plus, Search, Building2, Filter, Loader2, 
  Home, Trash2, Pencil, Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddOrganisationModal from "./AddOrganisationModal";
import Link from "next/link";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function OrganisationsPage() {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchOrganisations();
  }, []);

  async function fetchOrganisations() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organisations")
        .select(`*, properties(count)`) 
        .order("name");

      if (error) throw error;
      setOrganisations(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load organisations");
    } finally {
      setLoading(false);
    }
  }

  // Improved Search and Filter Logic
  const filteredOrgs = organisations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleDelete(id) {
    try {
      const { error } = await supabase
        .from("organisations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Organisation deleted");
      fetchOrganisations();
    } catch (error) {
      toast.error("Delete failed. Check if properties are linked.");
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Onboarding": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Inactive": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-50 text-slate-500";
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 p-4 md:p-0">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        
        <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#123d2b]">Organisations</h1>
            <p className="text-sm text-muted-foreground">Manage parent and child organisations</p>
          </div>
          <AddOrganisationModal onOrganisationAdded={fetchOrganisations} />
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search organisations..." 
              className="pl-9 bg-white border-[#e1dbd2] focus-visible:ring-[#1f6b4a]" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-[#e1dbd2]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Onboarding">Onboarding</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-[#e1dbd2] shadow-sm overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-[#fbf8f2]">
                <TableRow>
                  <TableHead className="font-bold text-[#123d2b]">Organisation</TableHead>
                  <TableHead className="font-bold text-center text-[#123d2b]">Properties</TableHead>
                  <TableHead className="font-bold text-[#123d2b]">Status</TableHead>
                  <TableHead className="text-right text-[#123d2b] px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto text-[#1f6b4a]" />
                    </TableCell>
                  </TableRow>
                ) : filteredOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No organisations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrgs.map((org) => (
                    <TableRow key={org.id} className="hover:bg-[#f7f2e9]/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-[#e6f2ec] flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-[#1f6b4a]" />
                          </div>
                          <span className="font-medium text-[#123d2b]">{org.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        {org.properties?.[0]?.count || 0}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(org.status)}`}>
                          {org.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <div className="flex justify-end gap-1">
                          <Link href={`/organisations/${org.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1f6b4a]">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/organisations/${org.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          {/* Alert Dialog for Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white border-[#e1dbd2]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#123d2b]">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete <strong>{org.name}</strong>. This action cannot be undone and may fail if properties are still linked.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-[#e1dbd2]">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(org.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete Organisation
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}