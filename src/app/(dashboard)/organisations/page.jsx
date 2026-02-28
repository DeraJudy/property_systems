"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Building2, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const orgs = [
  {
    id: 1,
    name: "Kenley Housing Group",
    type: "Parent",
    status: "Active",
    children: 3,
    users: 24,
    properties: 18,
  },
  {
    id: 2,
    name: "South London Care Ltd",
    type: "Child",
    parent: "Kenley Housing Group",
    status: "Active",
    children: 0,
    users: 8,
    properties: 6,
  },
  {
    id: 3,
    name: "Croydon Support Services",
    type: "Child",
    parent: "Kenley Housing Group",
    status: "Active",
    children: 0,
    users: 12,
    properties: 9,
  },
  {
    id: 4,
    name: "Bromley Homes CIC",
    type: "Child",
    parent: "Kenley Housing Group",
    status: "Onboarding",
    children: 0,
    users: 4,
    properties: 3,
  },
  {
    id: 5,
    name: "Thames Valley Housing",
    type: "Parent",
    status: "Active",
    children: 1,
    users: 15,
    properties: 12,
  },
  {
    id: 6,
    name: "Riverside Support Ltd",
    type: "Child",
    parent: "Thames Valley Housing",
    status: "Inactive",
    children: 0,
    users: 2,
    properties: 0,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function OrganisationsPage() {
  return (
    <div className="space-y-6 ">
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
            <h1 className="text-2xl font-bold foreground-text">
              Organisations
            </h1>
            <p className="text-sm muted-foreground-text">
              Manage parent and child organisations
            </p>
          </div>
          <Button className="primary">
            <Plus className="mr-2 h-4 w-4" />
            Create Organisation
          </Button>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text" />
            <Input placeholder="Search organisations..." className="pl-9" />
          </div>

          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="child">Child</SelectItem>
            </SelectContent>
          </Select>
          
        </motion.div>


      </motion.div>

      
    </div>
  );
}
