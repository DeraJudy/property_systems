"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/superbase/clientUtils";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  UserPlus,
  Loader2, Plus, Filter, UserCircle, Target, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const supabase = createClient();

export default function ServiceUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Fetch Data ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_users_table")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast.error("Error loading users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Delete Logic ---
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const { error } = await supabase
        .from("service_users_table")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("User deleted successfully");
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  // --- Filter Logic ---
  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f0e6] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Users</h1>
          <p className="text-sm text-muted-foreground">Manage resident profiles, contact info, and documents</p>
        </div>
        <Link href="/addServiceUser">
          <Button className="bg-[#123d2b] hover:bg-[#1f6b4a] shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Service User
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-9 bg-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40 bg-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>



        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-[#e1dbd2] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin text-[#1f6b4a] mb-4" size={40} />
              <p className="text-[#6b7d74]">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fbf8f2] border-b border-[#e1dbd2]">
                  <tr>
                    <th className="p-5 text-sm font-bold text-[#123d2b]">Name</th>
                    <th className="p-5 text-sm font-bold text-[#123d2b]">Contact</th>
                    <th className="p-5 text-sm font-bold text-[#123d2b]">Assigned To</th>
                    <th className="p-5 text-sm font-bold text-[#123d2b]">Status</th>
                    <th className="p-5 text-sm font-bold text-[#123d2b] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f0e6]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#fbf8f2] transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-[#123d2b]">{user.first_name} {user.surname}</div>
                          <div className="text-xs text-[#6b7d74]">{user.ni_number || "No NI"}</div>
                        </td>
                        <td className="p-5">
                          <div className="text-sm text-[#123d2b]">{user.email || "N/A"}</div>
                          <div className="text-xs text-[#6b7d74]">{user.contact_number || "No Phone"}</div>
                        </td>
                        <td className="p-5 text-sm text-[#123d2b]">
                          {user.assigned_to || "Unassigned"}
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1 bg-[#e6f2ec] text-[#1f6b4a] text-xs font-bold rounded-full border border-[#c3e2d1]">
                            Active
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            {/* VIEW BUTTON */}
                            <Link href={`service-users/${user.id}`}>
                              <button className="p-2 text-[#1f6b4a] hover:bg-[#e6f2ec] rounded-lg transition-all" title="View Profile">
                                <Eye size={18} />
                              </button>
                            </Link>

                            {/* EDIT BUTTON */}
                            <Link href={`/service-users/${user.id}/edit`}>
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit User">
                                <Edit size={18} />
                              </button>
                            </Link>

                            {/* DELETE BUTTON */}
                            <button 
                              onClick={() => handleDelete(user.id, `${user.first_name} ${user.surname}`)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-20 text-center text-[#6b7d74]">
                        No service users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}