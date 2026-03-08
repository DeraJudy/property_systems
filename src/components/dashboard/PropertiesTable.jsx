// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/superbase/client"; 
// import { toast } from "sonner";
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
// import {
//   Plus,
//   Search,
//   Home,
//   MapPin,
//   Users,
//   BedDouble,
//   ShieldCheck,
//   Wrench,
//   FileText,
//   Filter,
//   Clock,
//   AlertTriangle,
//   PoundSterling,
// } from "lucide-react";
// import Link from "next/link";

// const properties = [
//   {
//     id: 1,
//     name: "12 Oak Lane",
//     address: "Croydon, CR0 1AB",
//     status: "Active",
//     rooms: 8,
//     occupied: 7,
//     approval: "Approved",
//     certs: 3,
//     maintenance: 1,
//   },
//   {
//     id: 2,
//     name: "7 Elm Road",
//     address: "Bromley, BR1 2CD",
//     status: "Active",
//     rooms: 12,
//     occupied: 11,
//     approval: "Approved",
//     certs: 2,
//     maintenance: 3,
//   },
//   {
//     id: 3,
//     name: "45 Cedar Avenue",
//     address: "Lewisham, SE13 5EF",
//     status: "Onboarding",
//     rooms: 6,
//     occupied: 0,
//     approval: "Pending",
//     certs: 1,
//     maintenance: 0,
//   },
//   {
//     id: 4,
//     name: "3 Birch Street",
//     address: "Greenwich, SE10 8GH",
//     status: "Active",
//     rooms: 10,
//     occupied: 9,
//     approval: "Approved",
//     certs: 4,
//     maintenance: 2,
//   },
//   {
//     id: 5,
//     name: "22 Willow Close",
//     address: "Sutton, SM1 4IJ",
//     status: "Decommissioning",
//     rooms: 5,
//     occupied: 2,
//     approval: "Approved",
//     certs: 1,
//     maintenance: 0,
//   },
//   {
//     id: 6,
//     name: "9 Maple Drive",
//     address: "Lambeth, SW2 3KL",
//     status: "Inactive",
//     rooms: 4,
//     occupied: 0,
//     approval: "N/A",
//     certs: 0,
//     maintenance: 0,
//   },
// ];

// const voids = [
//   {
//     id: 1,
//     property: "12 Oak Lane",
//     room: "Room 3",
//     startDate: "15/01/2026",
//     endDate: "—",
//     reason: "Move out",
//     targetRelet: "15/02/2026",
//     actualRelet: "—",
//     loss: "£975",
//     referral: "REF-004",
//     days: 48,
//   },
//   {
//     id: 2,
//     property: "7 Elm Road",
//     room: "Room 8",
//     startDate: "01/02/2026",
//     endDate: "25/02/2026",
//     reason: "Maintenance",
//     targetRelet: "28/02/2026",
//     actualRelet: "25/02/2026",
//     loss: "£460",
//     referral: "—",
//     days: 24,
//   },
//   {
//     id: 3,
//     property: "22 Willow Close",
//     room: "Room 3",
//     startDate: "10/12/2025",
//     endDate: "—",
//     reason: "Safeguarding",
//     targetRelet: "10/01/2026",
//     actualRelet: "—",
//     loss: "£1,650",
//     referral: "—",
//     days: 84,
//   },
//   {
//     id: 4,
//     property: "3 Birch Street",
//     room: "Room 6",
//     startDate: "20/02/2026",
//     endDate: "—",
//     reason: "Eviction",
//     targetRelet: "20/03/2026",
//     actualRelet: "—",
//     loss: "£240",
//     referral: "REF-001",
//     days: 12,
//   },
// ];

// const rooms = [
//   {
//     id: 1,
//     number: "Room 1",
//     floor: "Ground",
//     status: "Occupied",
//     tenant: "James Smith",
//     rent: "£600/mo",
//   },
//   {
//     id: 2,
//     number: "Room 2",
//     floor: "Ground",
//     status: "Occupied",
//     tenant: "Mary Johnson",
//     rent: "£575/mo",
//   },
//   {
//     id: 3,
//     number: "Room 3",
//     floor: "First",
//     status: "Void",
//     tenant: "—",
//     rent: "£625/mo",
//   },
//   {
//     id: 4,
//     number: "Room 4",
//     floor: "First",
//     status: "Occupied",
//     tenant: "Robert Williams",
//     rent: "£600/mo",
//   },
//   {
//     id: 5,
//     number: "Room 5",
//     floor: "Second",
//     status: "Maintenance",
//     tenant: "—",
//     rent: "£550/mo",
//   },
// ];

// const propStatusColor = (s) => {
//   if (s === "Active") return "bg-primary/10 text-primary border-primary/20";
//   if (s === "Onboarding") return "bg-warning/10 text-warning border-warning/20";
//   if (s === "Decommissioning") return "bg-destructive/10 text-destructive border-destructive/20";
//   return "bg-muted text-muted-foreground border-border";
// };

// const container = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.04 } },
// };
// const item = {
//   hidden: { opacity: 0, y: 10 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
// };

// const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   // Fetch data on mount
//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   async function fetchProperties() {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("properties")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setProperties(data || []);
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Could not load properties from database.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // --- KPI Calculations ---
//   const totalRooms = properties.reduce((acc, p) => acc + (Number(p.rooms) || 0), 0);
//   // Assuming 'occupied_count' is a column, otherwise default to 0
//   const totalOccupied = properties.reduce((acc, p) => acc + (Number(p.occupied_count) || 0), 0);
//   const occupancyRate = totalRooms > 0 ? Math.round((totalOccupied / totalRooms) * 100) : 0;
//   const voidRate = 100 - occupancyRate;

//   // --- Filter Logic ---
//   const filteredProperties = properties.filter((p) => {
//     const matchesSearch = p.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          p.address?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();
//     return matchesSearch && matchesStatus;
//   });

//   const propStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
//       case "onboarding": return "bg-blue-100 text-blue-700 border-blue-200";
//       case "inactive": return "bg-slate-100 text-slate-700 border-slate-200";
//       case "decom": return "bg-red-100 text-red-700 border-red-200";
//       default: return "bg-amber-100 text-amber-700 border-amber-200";
//     }
//   };

// export default function PropertiesTable() {

  
//   return (
//     // <div className="space-y-6">
//     //    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
//     //   <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//     //     <div>
//     //       <h1 className="text-2xl font-bold text-foreground">Properties</h1>
//     //       <p className="text-sm text-muted-foreground">Manage housing properties, rooms and void performance</p>
//     //     </div>
//     //     {/* <Button><Plus className="mr-2 h-4 w-4" />Add Property</Button> */}
//     //     <Link href="/addProperties">
//     //       <Button><Plus className="mr-2 h-4 w-4" />Add Property</Button>
//     //     </Link>
//     //   </motion.div>

//     //   <motion.div variants={item} className="grid gap-4 grid-cols-2 md:grid-cols-5">
//     //     {[
//     //       { label: "Total Properties", value: "6", icon: Home },
//     //       { label: "Total Rooms", value: "45", icon: BedDouble },
//     //       { label: "Occupancy", value: "87%", icon: Users },
//     //       { label: "Void Rate", value: "8.9%", icon: Clock },
//     //       { label: "Maintenance", value: "6", icon: Wrench },
//     //     ].map((kpi) => (
//     //       <Card key={kpi.label} className="p-4 shadow-card">
//     //         <div className="flex items-center gap-3">
//     //           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
//     //             <kpi.icon className="h-4 w-4 text-accent-foreground" />
//     //           </div>
//     //           <div>
//     //             <p className="text-xl font-bold text-foreground">{kpi.value}</p>
//     //             <p className="text-xs text-muted-foreground">{kpi.label}</p>
//     //           </div>
//     //         </div>
//     //       </Card>
//     //     ))}
//     //   </motion.div>

//     //   <motion.div variants={item}>
//     //     <Tabs defaultValue="properties">
//     //       <TabsList className="flex-wrap">
//     //         <TabsTrigger value="properties">Properties</TabsTrigger>
//     //         <TabsTrigger value="voids">Void Management</TabsTrigger>
//     //       </TabsList>

//     //       <TabsContent value="properties" className="mt-4 space-y-4">
//     //         <div className="flex flex-col gap-3 sm:flex-row">
//     //           <div className="relative flex-1">
//     //             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//     //             <Input placeholder="Search properties..." className="pl-9" />
//     //           </div>
//     //           <Select defaultValue="all">
//     //             <SelectTrigger className="w-full sm:w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
//     //             <SelectContent>
//     //               <SelectItem value="all">All Status</SelectItem>
//     //               <SelectItem value="active">Active</SelectItem>
//     //               <SelectItem value="onboarding">Onboarding</SelectItem>
//     //               <SelectItem value="decom">Decommissioning</SelectItem>
//     //               <SelectItem value="inactive">Inactive</SelectItem>
//     //             </SelectContent>
//     //           </Select>
//     //         </div>
//     //         <Card className="shadow-card overflow-hidden">
//     //           <Table>
//     //             <TableHeader>
//     //               <TableRow>
//     //                 <TableHead>Property</TableHead>
//     //                 <TableHead className="hidden md:table-cell">Address</TableHead>
//     //                 <TableHead>Status</TableHead>
//     //                 <TableHead className="hidden sm:table-cell">Occupancy</TableHead>
//     //                 <TableHead className="hidden lg:table-cell">Approval</TableHead>
//     //                 <TableHead className="hidden lg:table-cell">Certs</TableHead>
//     //                 <TableHead className="hidden lg:table-cell">Maintenance</TableHead>
//     //               </TableRow>
//     //             </TableHeader>
//     //             <TableBody>
//     //               {properties.map((p) => (
//     //                 <TableRow key={p.id} className="cursor-pointer hover:bg-accent/30">
//     //                   <TableCell>
//     //                     <div className="flex items-center gap-3">
//     //                       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
//     //                         <Home className="h-4 w-4 text-accent-foreground" />
//     //                       </div>
//     //                       <span className="font-medium text-foreground">{p.name}</span>
//     //                     </div>
//     //                   </TableCell>
//     //                   <TableCell className="hidden md:table-cell">
//     //                     <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{p.address}</div>
//     //                   </TableCell>
//     //                   <TableCell><span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${propStatusColor(p.status)}`}>{p.status}</span></TableCell>
//     //                   <TableCell className="hidden sm:table-cell">
//     //                     <div className="flex items-center gap-2">
//     //                       <Progress value={(p.occupied / p.rooms) * 100} className="h-2 w-16" />
//     //                       <span className="text-xs text-muted-foreground">{p.occupied}/{p.rooms}</span>
//     //                     </div>
//     //                   </TableCell>
//     //                   <TableCell className="hidden lg:table-cell"><Badge variant={p.approval === "Approved" ? "default" : p.approval === "Pending" ? "secondary" : "outline"} className="text-xs">{p.approval}</Badge></TableCell>
//     //                   <TableCell className="hidden lg:table-cell text-sm">{p.certs}</TableCell>
//     //                   <TableCell className="hidden lg:table-cell text-sm">{p.maintenance}</TableCell>
//     //                 </TableRow>
//     //               ))}
//     //             </TableBody>
//     //           </Table>
//     //         </Card>
//     //       </TabsContent>

//     //       <TabsContent value="voids" className="mt-4 space-y-4">
//     //         <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
//     //           {[
//     //             { label: "Active Voids", value: "3", icon: Clock },
//     //             { label: "Avg. Turnaround", value: "28 days", icon: AlertTriangle },
//     //             { label: "Total Loss (MTD)", value: "£2,865", icon: PoundSterling },
//     //             { label: "Re-let This Month", value: "1", icon: Home },
//     //           ].map((kpi) => (
//     //             <Card key={kpi.label} className="p-4 shadow-card">
//     //               <div className="flex items-center gap-3">
//     //                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
//     //                   <kpi.icon className="h-4 w-4 text-accent-foreground" />
//     //                 </div>
//     //                 <div>
//     //                   <p className="text-xl font-bold text-foreground">{kpi.value}</p>
//     //                   <p className="text-xs text-muted-foreground">{kpi.label}</p>
//     //                 </div>
//     //               </div>
//     //             </Card>
//     //           ))}
//     //         </div>

//     //         <Card className="shadow-card overflow-hidden">
//     //           <Table>
//     //             <TableHeader>
//     //               <TableRow>
//     //                 <TableHead>Property</TableHead>
//     //                 <TableHead>Room</TableHead>
//     //                 <TableHead className="hidden sm:table-cell">Reason</TableHead>
//     //                 <TableHead className="hidden md:table-cell">Void Start</TableHead>
//     //                 <TableHead>Days</TableHead>
//     //                 <TableHead className="hidden md:table-cell">Loss</TableHead>
//     //                 <TableHead className="hidden lg:table-cell">Referral</TableHead>
//     //                 <TableHead>Target Re-let</TableHead>
//     //               </TableRow>
//     //             </TableHeader>
//     //             <TableBody>
//     //               {voids.map((v) => (
//     //                 <TableRow key={v.id} className="cursor-pointer hover:bg-accent/30">
//     //                   <TableCell className="font-medium text-foreground">{v.property}</TableCell>
//     //                   <TableCell className="text-sm text-muted-foreground">{v.room}</TableCell>
//     //                   <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-xs">{v.reason}</Badge></TableCell>
//     //                   <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{v.startDate}</TableCell>
//     //                   <TableCell>
//     //                     <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
//     //                       v.days > 60 ? "bg-destructive/10 text-destructive border-destructive/20" :
//     //                       v.days > 30 ? "bg-warning/10 text-warning border-warning/20" :
//     //                       "bg-primary/10 text-primary border-primary/20"
//     //                     }`}>{v.days}d</span>
//     //                   </TableCell>
//     //                   <TableCell className="hidden md:table-cell text-sm font-medium text-destructive">{v.loss}</TableCell>
//     //                   <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{v.referral}</TableCell>
//     //                   <TableCell className={`text-sm ${v.targetRelet < "04/03/2026" && v.actualRelet === "—" ? "text-destructive font-medium" : "text-muted-foreground"}`}>{v.targetRelet}</TableCell>
//     //                 </TableRow>
//     //               ))}
//     //             </TableBody>
//     //           </Table>
//     //         </Card>
//     //       </TabsContent>
//     //     </Tabs>
//     //   </motion.div>

//     const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   // Fetch data on mount
//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   async function fetchProperties() {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("properties")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setProperties(data || []);
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Could not load properties from database.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // --- KPI Calculations ---
//   const totalRooms = properties.reduce((acc, p) => acc + (Number(p.rooms) || 0), 0);
//   // Assuming 'occupied_count' is a column, otherwise default to 0
//   const totalOccupied = properties.reduce((acc, p) => acc + (Number(p.occupied_count) || 0), 0);
//   const occupancyRate = totalRooms > 0 ? Math.round((totalOccupied / totalRooms) * 100) : 0;
//   const voidRate = 100 - occupancyRate;

//   // --- Filter Logic ---
//   const filteredProperties = properties.filter((p) => {
//     const matchesSearch = p.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          p.address?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();
//     return matchesSearch && matchesStatus;
//   });

//   const propStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
//       case "onboarding": return "bg-blue-100 text-blue-700 border-blue-200";
//       case "inactive": return "bg-slate-100 text-slate-700 border-slate-200";
//       case "decom": return "bg-red-100 text-red-700 border-red-200";
//       default: return "bg-amber-100 text-amber-700 border-amber-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
//       <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
        
//         {/* HEADER */}
//         <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-[#123d2b]">Properties</h1>
//             <p className="text-sm text-muted-foreground">Manage housing properties, rooms and void performance</p>
//           </div>
//           <Link href="/addProperties">
//             <Button className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white">
//               <Plus className="mr-2 h-4 w-4" /> Add Property
//             </Button>
//           </Link>
//         </motion.div>

//         {/* KPI CARDS */}
//         <motion.div variants={item} className="grid gap-4 grid-cols-2 md:grid-cols-5">
//           {[
//             { label: "Total Properties", value: properties.length, icon: Home },
//             { label: "Total Rooms", value: totalRooms, icon: BedDouble },
//             { label: "Occupancy", value: `${occupancyRate}%`, icon: Users },
//             { label: "Void Rate", value: `${voidRate}%`, icon: Clock },
//             { label: "Maintenance", value: "0", icon: Wrench },
//           ].map((kpi) => (
//             <Card key={kpi.label} className="p-4 shadow-sm border-[#e1dbd2]">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e6f2ec]">
//                   <kpi.icon className="h-4 w-4 text-[#1f6b4a]" />
//                 </div>
//                 <div>
//                   <p className="text-xl font-bold text-[#123d2b]">{kpi.value}</p>
//                   <p className="text-xs text-muted-foreground">{kpi.label}</p>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </motion.div>

//         <motion.div variants={item}>
//           <Tabs defaultValue="properties">
//             <TabsList className="bg-[#e1dbd2]/50">
//               <TabsTrigger value="properties">Properties</TabsTrigger>
//               <TabsTrigger value="voids">Void Management</TabsTrigger>
//             </TabsList>

//             <TabsContent value="properties" className="mt-4 space-y-4">
//               {/* FILTERS */}
//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search properties..." 
//                     className="pl-9 bg-white border-[#e1dbd2]" 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-full sm:w-40 bg-white border-[#e1dbd2]">
//                     <Filter className="mr-2 h-4 w-4" />
//                     <SelectValue placeholder="All Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="onboarding">Onboarding</SelectItem>
//                     <SelectItem value="decom">Decommissioning</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* TABLE */}
//               <Card className="shadow-sm border-[#e1dbd2] overflow-hidden bg-white">
//                 <Table>
//                   <TableHeader className="bg-[#fbf8f2]">
//                     <TableRow>
//                       <TableHead className="text-[#123d2b] font-bold">Property</TableHead>
//                       <TableHead className="hidden md:table-cell text-[#123d2b] font-bold">Address</TableHead>
//                       <TableHead className="text-[#123d2b] font-bold">Status</TableHead>
//                       <TableHead className="hidden sm:table-cell text-[#123d2b] font-bold">Occupancy</TableHead>
//                       <TableHead className="hidden lg:table-cell text-[#123d2b] font-bold">Approval</TableHead>
//                       <TableHead className="hidden lg:table-cell text-[#123d2b] font-bold">Certs</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={6} className="h-32 text-center">
//                           <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#1f6b4a]" />
//                           <p className="text-xs text-muted-foreground mt-2">Fetching your properties...</p>
//                         </TableCell>
//                       </TableRow>
//                     ) : filteredProperties.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
//                           No properties found matching your criteria.
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       filteredProperties.map((p) => (
//                         <TableRow key={p.id} className="cursor-pointer hover:bg-[#f7f2e9]/50 transition-colors">
//                           <TableCell>
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f0e6]">
//                                 <Home className="h-4 w-4 text-[#1f6b4a]" />
//                               </div>
//                               <span className="font-medium text-[#123d2b]">{p.property_name}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell className="hidden md:table-cell">
//                             <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                               <MapPin className="h-3 w-3" />
//                               {p.address}, {p.postcode}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${propStatusColor(p.status)}`}>
//                               {p.status || "Pending"}
//                             </span>
//                           </TableCell>
//                           <TableCell className="hidden sm:table-cell">
//                             <div className="flex items-center gap-2">
//                               <Progress value={((p.occupied_count || 0) / (p.rooms || 1)) * 100} className="h-2 w-16" />
//                               <span className="text-xs text-muted-foreground">{p.occupied_count || 0}/{p.rooms}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell className="hidden lg:table-cell">
//                             <Badge variant="outline" className="text-xs border-[#e1dbd2]">
//                               {p.approval_status || "Pending"}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="hidden lg:table-cell text-sm">
//                             <Badge className="bg-[#e6f2ec] text-[#1f6b4a] hover:bg-[#e6f2ec]">Active</Badge>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </Card>
//             </TabsContent>

//             {/* VOID MANAGEMENT CONTENT (Keep static or similar logic) */}
//             <TabsContent value="voids" className="mt-4">
//                <div className="p-8 text-center border-2 border-dashed border-[#e1dbd2] rounded-lg">
//                  <p className="text-muted-foreground">Void Management analytics tracking coming soon.</p>
//                </div>
//             </TabsContent>
//           </Tabs>
//         </motion.div>
//       </motion.div>
//     </div>

//       {/* Property detail preview */}
//       {/* <motion.div variants={item}>
//         <Card className="shadow-card p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
//               <Home className="h-5 w-5 text-accent-foreground" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-foreground">12 Oak Lane</h2>
//               <p className="text-sm text-muted-foreground">Croydon, CR0 1AB</p>
//             </div>
//             <Badge className="ml-auto">Active</Badge>
//           </div>
//           <Tabs defaultValue="rooms">
//             <TabsList>
//               <TabsTrigger value="overview">Overview</TabsTrigger>
//               <TabsTrigger value="rooms">Rooms</TabsTrigger>
//               <TabsTrigger value="certs">Certificates</TabsTrigger>
//               <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
//               <TabsTrigger value="docs">Documents</TabsTrigger>
//             </TabsList>
//             <TabsContent value="rooms" className="mt-4">
//               <Table>
//                 <TableHeader><TableRow><TableHead>Room</TableHead><TableHead>Floor</TableHead><TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Tenant</TableHead><TableHead className="hidden sm:table-cell">Rent</TableHead></TableRow></TableHeader>
//                 <TableBody>
//                   {rooms.map((r) => (
//                     <TableRow key={r.id}>
//                       <TableCell className="font-medium">{r.number}</TableCell>
//                       <TableCell className="text-sm text-muted-foreground">{r.floor}</TableCell>
//                       <TableCell><Badge variant={r.status === "Occupied" ? "default" : r.status === "Void" ? "secondary" : "destructive"} className="text-xs">{r.status}</Badge></TableCell>
//                       <TableCell className="hidden sm:table-cell text-sm">{r.tenant}</TableCell>
//                       <TableCell className="hidden sm:table-cell text-sm">{r.rent}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TabsContent>
//             <TabsContent value="overview" className="mt-4">
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {[{ label: "Total Rooms", value: "8" }, { label: "Occupied", value: "7" }, { label: "Void", value: "1" }, { label: "Monthly Revenue", value: "£4,550" }, { label: "Property Manager", value: "Emma Wilson" }, { label: "Organisation", value: "Croydon Support Services" }].map((d) => (
//                   <div key={d.label} className="rounded-lg border border-border p-3">
//                     <p className="text-xs text-muted-foreground">{d.label}</p>
//                     <p className="text-sm font-semibold text-foreground">{d.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>
//             <TabsContent value="certs" className="mt-4">
//               <div className="space-y-3">
//                 {[{ name: "Gas Safety Certificate", expires: "15/03/2026", status: "Valid" }, { name: "Fire Risk Assessment", expires: "01/02/2026", status: "Expiring Soon" }, { name: "EPC Rating", expires: "20/08/2027", status: "Valid" }].map((c) => (
//                   <div key={c.name} className="flex items-center justify-between rounded-lg border border-border p-3">
//                     <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /><div><p className="text-sm font-medium text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">Expires: {c.expires}</p></div></div>
//                     <Badge variant={c.status === "Valid" ? "default" : "secondary"}>{c.status}</Badge>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>
//             <TabsContent value="maintenance" className="mt-4">
//               <div className="flex items-center gap-3 rounded-lg border border-border p-4">
//                 <Wrench className="h-5 w-5 text-warning" />
//                 <div><p className="text-sm font-medium text-foreground">Boiler repair — Room 5</p><p className="text-xs text-muted-foreground">Reported 2 days ago · Assigned to: Dave Plumbing Ltd</p></div>
//                 <Badge variant="secondary" className="ml-auto">In Progress</Badge>
//               </div>
//             </TabsContent>
//             <TabsContent value="docs" className="mt-4">
//               <div className="space-y-2">
//                 {["Lease Agreement.pdf", "Floor Plan.dwg", "Insurance Policy.pdf"].map((doc) => (
//                   <div key={doc} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/30 transition-colors cursor-pointer">
//                     <FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-foreground">{doc}</span>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </Card>
//       </motion.div> */}
//     // </motion.div>


//     // </div>
//   );
// }


"use client";

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
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Home,
  MapPin,
  Users,
  BedDouble,
  Wrench,
  Filter,
  Clock,
  Loader2, // Added for the loading state
} from "lucide-react";
import Link from "next/link";

// Animation Config
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function PropertiesTable() {
  // 1. Hooks (Must be inside the function)
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 2. Data Fetching
  useEffect(() => {
    fetchProperties();
  }, []);

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
      console.error("Error:", error);
      toast.error("Could not load properties from database.");
    } finally {
      setLoading(false);
    }
  }

  // 3. Logic & Helper Functions
  const totalRooms = properties.reduce((acc, p) => acc + (Number(p.rooms) || 0), 0);
  const totalOccupied = properties.reduce((acc, p) => acc + (Number(p.occupied_count) || 0), 0);
  const occupancyRate = totalRooms > 0 ? Math.round((totalOccupied / totalRooms) * 100) : 0;
  const voidRate = 100 - occupancyRate;

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const propStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "onboarding": return "bg-blue-100 text-blue-700 border-blue-200";
      case "inactive": return "bg-slate-100 text-slate-700 border-slate-200";
      case "decom": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  // 4. Render
  return (
    <div className="min-h-screen bg-[#f5f0e6] p-4 md:p-8">
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="space-y-6 max-w-7xl mx-auto"
      >
        
        {/* HEADER */}
        <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#123d2b]">Properties</h1>
            <p className="text-sm text-muted-foreground">Manage housing properties, rooms and void performance</p>
          </div>
          <Link href="/addProperties">
            <Button className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </Link>
        </motion.div>

        {/* KPI CARDS */}
        <motion.div variants={item} className="grid gap-4 grid-cols-2 md:grid-cols-5">
          {[
            { label: "Total Properties", value: properties.length, icon: Home },
            { label: "Total Rooms", value: totalRooms, icon: BedDouble },
            { label: "Occupancy", value: `${occupancyRate}%`, icon: Users },
            { label: "Void Rate", value: `${voidRate}%`, icon: Clock },
            { label: "Maintenance", value: "0", icon: Wrench },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-4 shadow-sm border-[#e1dbd2]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e6f2ec]">
                  <kpi.icon className="h-4 w-4 text-[#1f6b4a]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#123d2b]">{kpi.value}</p>
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
              <TabsTrigger value="voids">Void Management</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-4 space-y-4">
              {/* FILTERS */}
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
                    <SelectItem value="decom">Decommissioning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TABLE */}
              <Card className="shadow-sm border-[#e1dbd2] overflow-hidden bg-white">
                <Table>
                  <TableHeader className="bg-[#fbf8f2]">
                    <TableRow>
                      <TableHead className="text-[#123d2b] font-bold">Property</TableHead>
                      <TableHead className="hidden md:table-cell text-[#123d2b] font-bold">Address</TableHead>
                      <TableHead className="text-[#123d2b] font-bold">Status</TableHead>
                      <TableHead className="hidden sm:table-cell text-[#123d2b] font-bold">Occupancy</TableHead>
                      <TableHead className="hidden lg:table-cell text-[#123d2b] font-bold">Approval</TableHead>
                      <TableHead className="hidden lg:table-cell text-[#123d2b] font-bold">Certs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#1f6b4a]" />
                          <p className="text-xs text-muted-foreground mt-2">Fetching your properties...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredProperties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No properties found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProperties.map((p) => (
                        <TableRow key={p.id} className="cursor-pointer hover:bg-[#f7f2e9]/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f0e6]">
                                <Home className="h-4 w-4 text-[#1f6b4a]" />
                              </div>
                              <span className="font-medium text-[#123d2b]">{p.property_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {p.address}, {p.postcode}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${propStatusColor(p.status)}`}>
                              {p.status || "Pending"}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              <Progress value={((p.occupied_count || 0) / (p.rooms || 1)) * 100} className="h-2 w-16" />
                              <span className="text-xs text-muted-foreground">{p.occupied_count || 0}/{p.rooms}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="text-xs border-[#e1dbd2]">
                              {p.approval_status || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">
                            <Badge className="bg-[#e6f2ec] text-[#1f6b4a] hover:bg-[#e6f2ec]">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="voids" className="mt-4">
               <div className="p-8 text-center border-2 border-dashed border-[#e1dbd2] rounded-lg">
                 <p className="text-muted-foreground">Void Management analytics tracking coming soon.</p>
               </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}