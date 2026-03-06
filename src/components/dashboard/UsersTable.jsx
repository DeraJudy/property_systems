"use client"

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const users = [
  { id: 1, name: "John Doe", email: "john@kenley.co.uk", role: "Admin", org: "Kenley Housing Group", status: "Active", effective: "01/01/2024" },
  { id: 2, name: "Sarah Mitchell", email: "sarah@kenley.co.uk", role: "Support Staff", org: "South London Care Ltd", status: "Active", effective: "15/03/2024" },
  { id: 3, name: "Michael Brown", email: "michael@kenley.co.uk", role: "Finance", org: "Kenley Housing Group", status: "Active", effective: "01/06/2024" },
  { id: 4, name: "Emma Wilson", email: "emma@croydon.co.uk", role: "Property Manager", org: "Croydon Support Services", status: "Active", effective: "20/02/2024" },
  { id: 5, name: "David Clark", email: "david@bromley.co.uk", role: "Approver", org: "Bromley Homes CIC", status: "Pending", effective: "01/12/2024" },
  { id: 6, name: "Lisa Thompson", email: "lisa@thames.co.uk", role: "Read Only", org: "Thames Valley Housing", status: "Inactive", effective: "01/01/2023" },
];

const roleColor = (r) => {
  if (r === "Admin") return "bg-[#1f6b4a]/10 text-[#1f6b4a]";
  if (r === "Support Staff") return "bg-[#2B7FFF]/10 text-[#2B7FFF]";
  if (r === "Finance") return "bg-[#F59E0B]/10 text-[#F59E0B]";
  if (r === "Property Manager") return "bg-[#e6f2ec] text-[#15573c]";
  if (r === "Approver") return "bg-[#2FA36B]/10 text-[#2FA36B]";
  return "bg-[#ece7df] text-[#6b7d74]";
};

const statusDot = (s) => {
  if (s === "Active") return "primary";
  if (s === "Pending") return "bg-[#F59E0B]";
  return "bg-[#6b7d74]";
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };


export default function UsersTable() {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div
          variants={item}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold foreground-text">Users</h1>
            <p className="text-sm muted-foreground-text">
              Manage Support Workers and permissions
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="support">Support Staff</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="pm">Property Manager</SelectItem>
              <SelectItem value="approver">Approver</SelectItem>
              <SelectItem value="readonly">Read Only</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="px-5">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Organisation
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Effective
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="" >
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-[#e6f2ec]/30">
                    <TableCell>
                      <div className="flex items-center py-2 px-2 gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full primary text-xs font-semibold primary-foreground-text">
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium foreground-text">
                          {u.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm muted-foreground-text">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor(u.role)}`}
                      >
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm muted-foreground-text">
                      {u.org}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm muted-foreground-text">
                      {u.effective}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${statusDot(u.status)}`}
                        />
                        <span className="text-sm">{u.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </motion.div>
    );
}