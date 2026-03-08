// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { motion } from "framer-motion";
// import { Plus, Search, Filter, AlertTriangle, UserCircle, Target, CheckCircle2, Clock } from "lucide-react";
// import Link from "next/link";

// const serviceUsers = [
//   { id: 1, name: "James Smith", photo: "JS", property: "12 Oak Lane", room: "Room 1", status: "Active", risk: false, rent: "£600/mo" },
//   { id: 2, name: "Mary Johnson", photo: "MJ", property: "12 Oak Lane", room: "Room 2", status: "Active", risk: true, rent: "£575/mo" },
//   { id: 3, name: "Robert Williams", photo: "RW", property: "12 Oak Lane", room: "Room 4", status: "Active", risk: false, rent: "£600/mo" },
//   { id: 4, name: "Patricia Davis", photo: "PD", property: "7 Elm Road", room: "Room 3", status: "Active", risk: true, rent: "£550/mo" },
//   { id: 5, name: "Thomas Anderson", photo: "TA", property: "7 Elm Road", room: "Room 7", status: "Move Out", risk: false, rent: "£625/mo" },
//   { id: 6, name: "Jennifer Wilson", photo: "JW", property: "3 Birch Street", room: "Room 2", status: "Active", risk: false, rent: "£580/mo" },
// ];

// const supportGoals = [
//   { goal: "Maintain tenancy independently", status: "On Track", progress: 75, review: "01/04/2026", staff: "Sarah Mitchell" },
//   { goal: "Engage with mental health services", status: "In Progress", progress: 45, review: "15/03/2026", staff: "Sarah Mitchell" },
//   { goal: "Develop budgeting skills", status: "On Track", progress: 60, review: "01/04/2026", staff: "John Davies" },
//   { goal: "Reduce substance misuse", status: "At Risk", progress: 25, review: "01/03/2026", staff: "Sarah Mitchell" },
// ];

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
// const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// export default function ServiceUserTable() {
//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
//       <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">Service Users</h1>
//           <p className="text-sm text-muted-foreground">Manage residents, support plans and outcomes</p>
//         </div>
        
//         <Link href="/addServiceUser">
//           <Button><Plus className="mr-2 h-4 w-4" />Add Service User</Button>
//         </Link>
//       </motion.div>

//       <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search service users..." className="pl-9" />
//         </div>
//         <Select defaultValue="all">
//           <SelectTrigger className="w-full sm:w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
//           <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="moveout">Move Out</SelectItem></SelectContent>
//         </Select>
//       </motion.div>

//       <motion.div variants={item}>
//         <Card className="shadow-card overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead className="hidden md:table-cell">Property</TableHead>
//                 <TableHead className="hidden sm:table-cell">Room</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="hidden sm:table-cell">Rent</TableHead>
//                 <TableHead>Flags</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {serviceUsers.map((su) => (
//                 <TableRow key={su.id} className="cursor-pointer hover:bg-accent/30">
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{su.photo}</div>
//                       <span className="font-medium text-foreground">{su.name}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{su.property}</TableCell>
//                   <TableCell className="hidden sm:table-cell text-sm">{su.room}</TableCell>
//                   <TableCell><Badge variant={su.status === "Active" ? "default" : "secondary"} className="text-xs">{su.status}</Badge></TableCell>
//                   <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{su.rent}</TableCell>
//                   <TableCell>{su.risk && <AlertTriangle className="h-4 w-4 text-destructive" />}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Card>
//       </motion.div>

//       {/* Profile preview */}
//       <motion.div variants={item}>
//         <Card className="shadow-card p-6">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">JS</div>
//             <div>
//               <h2 className="text-lg font-bold text-foreground">James Smith</h2>
//               <p className="text-sm text-muted-foreground">12 Oak Lane · Room 1</p>
//             </div>
//             <Badge className="ml-auto">Active</Badge>
//           </div>

//           <Tabs defaultValue="key-info">
//             <TabsList className="flex-wrap">
//               <TabsTrigger value="key-info">Key Info</TabsTrigger>
//               <TabsTrigger value="medical">Medical</TabsTrigger>
//               <TabsTrigger value="financial">Financial</TabsTrigger>
//               <TabsTrigger value="address">Address</TabsTrigger>
//               <TabsTrigger value="contacts">Contacts</TabsTrigger>
//               <TabsTrigger value="docs">Documents</TabsTrigger>
//               <TabsTrigger value="support">Support Needs</TabsTrigger>
//               <TabsTrigger value="residency">Residency</TabsTrigger>
//               <TabsTrigger value="support-plan">Support Plan</TabsTrigger>
//             </TabsList>

//             <TabsContent value="key-info" className="mt-4">
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {[
//                   { label: "Date of Birth", value: "15/04/1988" }, { label: "NI Number", value: "AB 12 34 56 C" },
//                   { label: "Phone", value: "07700 123456" }, { label: "Email", value: "james.smith@email.com" },
//                   { label: "Key Worker", value: "Sarah Mitchell" }, { label: "Move In Date", value: "01/06/2024" },
//                 ].map((d) => (
//                   <div key={d.label} className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">{d.label}</p>
//                     <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="medical" className="mt-4">
//               <div className="grid gap-4 sm:grid-cols-2">
//                 {[
//                   { label: "GP Name", value: "Dr. Helen Carter" }, { label: "GP Surgery", value: "Croydon Medical Centre" },
//                   { label: "Allergies", value: "Penicillin" }, { label: "Conditions", value: "Asthma, Anxiety" },
//                 ].map((d) => (
//                   <div key={d.label} className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">{d.label}</p>
//                     <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="financial" className="mt-4">
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {[
//                   { label: "Benefit Type", value: "Housing Benefit" }, { label: "Claim Reference", value: "HB/2024/12345" },
//                   { label: "Weekly Eligible Rent", value: "£138.46" }, { label: "Service Charge", value: "£12.00" },
//                   { label: "Shortfall", value: "£0.00" }, { label: "Status", value: "Approved" },
//                 ].map((d) => (
//                   <div key={d.label} className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">{d.label}</p>
//                     <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="residency" className="mt-4">
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {[
//                   { label: "Property", value: "12 Oak Lane" }, { label: "Room", value: "Room 1" },
//                   { label: "Move In", value: "01/06/2024" }, { label: "Move Out", value: "—" },
//                   { label: "Rent Cycle", value: "Monthly" }, { label: "Current Rent", value: "£600/mo" },
//                 ].map((d) => (
//                   <div key={d.label} className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">{d.label}</p>
//                     <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="support-plan" className="mt-4 space-y-6">
//               {/* Risk Assessment */}
//               <Card className="p-4 border-border">
//                 <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
//                   <AlertTriangle className="h-4 w-4 text-warning" />Initial Risk Assessment
//                 </h4>
//                 <div className="grid gap-3 sm:grid-cols-2">
//                   <div className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">Risk Level</p>
//                     <p className="text-sm font-semibold text-warning">Medium</p>
//                   </div>
//                   <div className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">Last Reassessment</p>
//                     <p className="text-sm font-semibold text-foreground">01/01/2026</p>
//                   </div>
//                 </div>
//               </Card>

//               {/* Goals */}
//               <div>
//                 <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
//                   <Target className="h-4 w-4 text-primary" />Support Goals & Outcomes
//                 </h4>
//                 <div className="space-y-3">
//                   {supportGoals.map((g, i) => (
//                     <div key={i} className="rounded-lg border border-border p-4">
//                       <div className="flex items-center justify-between mb-2">
//                         <p className="text-sm font-medium text-foreground">{g.goal}</p>
//                         <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
//                           g.status === "On Track" ? "bg-primary/10 text-primary border-primary/20" :
//                           g.status === "In Progress" ? "bg-info/10 text-info border-info/20" :
//                           "bg-destructive/10 text-destructive border-destructive/20"
//                         }`}>{g.status}</span>
//                       </div>
//                       <div className="flex items-center gap-3 mb-2">
//                         <Progress value={g.progress} className="h-2 flex-1" />
//                         <span className="text-xs font-medium text-muted-foreground">{g.progress}%</span>
//                       </div>
//                       <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Review: {g.review}</span>
//                         <span className="flex items-center gap-1"><UserCircle className="h-3 w-3" />{g.staff}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Support Hours */}
//               <Card className="p-4 border-border">
//                 <h4 className="text-sm font-semibold text-foreground mb-3">Support Hours (This Month)</h4>
//                 <div className="grid gap-3 sm:grid-cols-3">
//                   <div className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">Allocated</p>
//                     <p className="text-sm font-semibold text-foreground">12 hours</p>
//                   </div>
//                   <div className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">Delivered</p>
//                     <p className="text-sm font-semibold text-primary">9 hours</p>
//                   </div>
//                   <div className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">Remaining</p>
//                     <p className="text-sm font-semibold text-foreground">3 hours</p>
//                   </div>
//                 </div>
//               </Card>

//               {/* Re-assessment History */}
//               <Card className="p-4 border-border">
//                 <h4 className="text-sm font-semibold text-foreground mb-3">Risk Re-assessment History</h4>
//                 <div className="space-y-2">
//                   {[
//                     { date: "01/01/2026", level: "Medium", notes: "Stable engagement, some substance use concerns remain" },
//                     { date: "01/07/2025", level: "High", notes: "Initial assessment — new referral from Council" },
//                   ].map((r, i) => (
//                     <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
//                       <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${r.level === "High" ? "bg-destructive" : "bg-warning"}`} />
//                       <div>
//                         <p className="text-sm text-foreground"><span className="font-medium">{r.level}</span> — {r.date}</p>
//                         <p className="text-xs text-muted-foreground">{r.notes}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             </TabsContent>

//             {["address", "contacts", "docs", "support"].map((tab) => (
//               <TabsContent key={tab} value={tab} className="mt-4">
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   {tab === "address" ? [
//                     { label: "Current Address", value: "12 Oak Lane, Room 1, Croydon CR0 1AB" },
//                     { label: "Previous Address", value: "NFA — Council Referral" },
//                   ].map((d) => (
//                     <div key={d.label} className="rounded-lg border border-border p-3">
//                       <p className="text-xs text-muted-foreground">{d.label}</p>
//                       <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                     </div>
//                   )) : tab === "contacts" ? [
//                     { label: "Emergency Contact", value: "David Smith (Brother) — 07700 654321" },
//                     { label: "Social Worker", value: "Claire Roberts — Croydon Council" },
//                   ].map((d) => (
//                     <div key={d.label} className="rounded-lg border border-border p-3">
//                       <p className="text-xs text-muted-foreground">{d.label}</p>
//                       <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                     </div>
//                   )) : tab === "support" ? [
//                     { label: "Primary Need", value: "Mental Health Support" },
//                     { label: "Secondary Need", value: "Substance Misuse Recovery" },
//                     { label: "Support Level", value: "Medium" },
//                     { label: "Key Worker", value: "Sarah Mitchell" },
//                   ].map((d) => (
//                     <div key={d.label} className="rounded-lg border border-border p-3">
//                       <p className="text-xs text-muted-foreground">{d.label}</p>
//                       <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                     </div>
//                   )) : (
//                     <div className="col-span-2 space-y-2">
//                       {["ID Verification.pdf", "Tenancy Agreement.pdf", "Benefits Letter.pdf", "Risk Assessment.pdf"].map((doc) => (
//                         <div key={doc} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/30 transition-colors cursor-pointer">
//                           <UserCircle className="h-4 w-4 text-muted-foreground" />
//                           <span className="text-sm text-foreground">{doc}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>
//         </Card>
//       </motion.div>
//     </motion.div>
//   )
// }

"use client";

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
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Plus, Search, Filter, AlertTriangle, UserCircle, Target, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const serviceUsers = [
  { id: 1, name: "James Smith", photo: "JS", property: "12 Oak Lane", room: "Room 1", status: "Active", risk: false, rent: "£600/mo" },
  { id: 2, name: "Mary Johnson", photo: "MJ", property: "12 Oak Lane", room: "Room 2", status: "Active", risk: true, rent: "£575/mo" },
  { id: 3, name: "Robert Williams", photo: "RW", property: "12 Oak Lane", room: "Room 4", status: "Active", risk: false, rent: "£600/mo" },
  { id: 4, name: "Patricia Davis", photo: "PD", property: "7 Elm Road", room: "Room 3", status: "Active", risk: true, rent: "£550/mo" },
  { id: 5, name: "Thomas Anderson", photo: "TA", property: "7 Elm Road", room: "Room 7", status: "Move Out", risk: false, rent: "£625/mo" },
  { id: 6, name: "Jennifer Wilson", photo: "JW", property: "3 Birch Street", room: "Room 2", status: "Active", risk: false, rent: "£580/mo" },
];

const supportGoals = [
  { goal: "Maintain tenancy independently", status: "On Track", progress: 75, review: "01/04/2026", staff: "Sarah Mitchell" },
  { goal: "Engage with mental health services", status: "In Progress", progress: 45, review: "15/03/2026", staff: "Sarah Mitchell" },
  { goal: "Develop budgeting skills", status: "On Track", progress: 60, review: "01/04/2026", staff: "John Davies" },
  { goal: "Reduce substance misuse", status: "At Risk", progress: 25, review: "01/03/2026", staff: "Sarah Mitchell" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ServiceUserTable() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Users</h1>
          <p className="text-sm text-muted-foreground">Manage residents, support plans and outcomes</p>
        </div>
        
        <Link href="/addServiceUser">
          <Button><Plus className="mr-2 h-4 w-4" />Add Service User</Button>
        </Link>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search service users..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="moveout">Move Out</SelectItem></SelectContent>
        </Select>
      </motion.div>

      
    </motion.div>
  )
}