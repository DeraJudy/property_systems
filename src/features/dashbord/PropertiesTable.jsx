"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/superbase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Home,
  Users,
  BedDouble,
  Wrench,
  Filter,
  Clock,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import PageBanner from "@/components/dashboard/PageBanner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function PropertiesTable() {
  const router = useRouter();

  // --- 1. STATE ---
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isDeleting, setIsDeleting] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // --- 2. EFFECTS ---
  useEffect(() => {
    setMounted(true);
    fetchProperties();
  }, []);

  // --- 3. PERSISTENT DELETE LOGIC ---
  async function fetchProperties() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Could not load properties.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!propertyToDelete) return;

    try {
      setIsDeleting(true);

      // 1. Attempt the Supabase Delete
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyToDelete);

      if (error) {
        // Check for Foreign Key Violations (most common reason for failure)
        if (error.code === "23503") {
          throw new Error(
            "Cannot delete property: It still has linked certificates or residents.",
          );
        }
        throw error;
      }

      // 2. Update local state
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete));

      // 3. Close the modal and notify user
      setPropertyToDelete(null);
      toast.success("Property permanently deleted");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.message || "Failed to delete from database");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = (e, id) => {
    e.stopPropagation();
    router.push(`/properties/${id}/edit`);
  };

  // --- 4. CALCULATIONS ---
  const totalRooms = properties.reduce(
    (acc, p) => acc + (Number(p.rooms) || 0),
    0,
  );
  const totalOccupied = properties.reduce(
    (acc, p) => acc + (Number(p.occupied_count) || 0),
    0,
  );
  const occupancyRate =
    totalRooms > 0 ? Math.round((totalOccupied / totalRooms) * 100) : 0;
  const voidRate = 100 - occupancyRate;

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      p.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const propStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-[#FFFDD0] text-black border-emerald-200";
      case "onboarding":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "inactive":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-7xl mx-auto"
      >
        <PageBanner
          title="Properties"
          subtitle="Manage housing properties and performance"
          category="properties"
        />


        {/* <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Properties</h1>
            <p className="text-sm text-muted-foreground">Manage housing properties and performance</p>
          </div>
          <Link href="/addProperties">
            <Button className="bg-black hover:bg-[#FFFDD0] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </Link>
        </motion.div> */}

        {/* KPI Grid */}
        <motion.div
          variants={item}
          className="grid gap-4 grid-cols-2 md:grid-cols-5"
        >
          {[
            { label: "Total Properties", value: properties.length, icon: Home },
            { label: "Total Rooms", value: totalRooms, icon: BedDouble },
            { label: "Occupancy", value: `${occupancyRate}%`, icon: Users },
            { label: "Void Rate", value: `${voidRate}%`, icon: Clock },
            { label: "Maintenance", value: "0", icon: Wrench },
          ].map((kpi) => (
            <Card
              key={kpi.label}
              className="p-4 shadow-sm border-[#e1dbd2] bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
                  <kpi.icon className="h-4 w-4 text-[#FFFDD0]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-black">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <Tabs defaultValue="properties">
            <TabsList className="bg-[#e1dbd2]/50">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              {/* <TabsTrigger value="voids">Void Management</TabsTrigger> */}
            </TabsList>

            

            <TabsContent value="properties" className="mt-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-9 bg-white border-[#e1dbd2]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-[#e1dbd2]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Link href="/addProperties">
      <Button className="bg-black text-white w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" /> Add Property
      </Button>
    </Link>
              </div>

              <Card className="shadow-sm border-[#e1dbd2] overflow-hidden bg-white">
                <Table>
                  <TableHeader className="text-lg ">
                    <TableRow>
                      <TableHead className="text-black font-bold">
                        Property
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-black font-bold">
                        Address
                      </TableHead>
                      <TableHead className="text-black font-bold">
                        Status
                      </TableHead>
                      <TableHead className="hidden sm:table-cell text-black font-bold">
                        Occupancy
                      </TableHead>
                      <TableHead className="text-right text-black font-bold px-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#1f6b4a]" />
                        </TableCell>
                      </TableRow>
                    ) : filteredProperties.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-32 text-center text-muted-foreground"
                        >
                          No properties found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProperties.map((p) => (
                        <TableRow
                          key={p.id}
                          className="cursor-pointer hover:bg-[#f7f2e9]/50 transition-colors"
                          onClick={() => router.push(`/properties/${p.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFFDD0]">
                                <Home className="h-4 w-4 text-black" />
                              </div>
                              <span className="font-medium text-black">
                                {p.property_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-50">
                            {p.address}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${propStatusColor(p.status)}`}
                            >
                              {p.status || "Pending"}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={
                                  ((p.occupied_count || 0) / (p.rooms || 1)) *
                                  100
                                }
                                className="h-2 w-16"
                              />
                              <span className="text-xs text-muted-foreground">
                                {p.occupied_count || 0}/{p.rooms}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-black hover:bg-[#e6f2ec]"
                                onClick={(e) => handleEdit(e, p.id)}
                              >
                                <Pencil className="h-4 w-4 " />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPropertyToDelete(p.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* DELETE CONFIRMATION MODAL */}
      <AlertDialog
        open={!!propertyToDelete}
        onOpenChange={(open) => !open && setPropertyToDelete(null)}
      >
        <AlertDialogContent className="bg-white border-[#e1dbd2]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this property from the database. If
              other records (like certificates or residents) depend on this
              property, the delete might fail until those are removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#e1dbd2]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent modal from closing too early
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
