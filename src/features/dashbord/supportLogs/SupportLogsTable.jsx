"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/superbase/clientUtils";
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
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, UserCircle, Target, 
  Edit3, Trash2, Calendar, User, Loader2, Mail, Phone 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const SupportLogsTable = () => {
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
          <h1 className="text-2xl font-bold text-foreground">Support Logs</h1>
          <p className="text-sm text-muted-foreground">
            Manage support logs and documents
          </p>
        </div>
        <Link href="/addSupportLogs">
          <Button className="bg-[#123d2b] hover:bg-[#1f6b4a] shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Support Log
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default SupportLogsTable;
