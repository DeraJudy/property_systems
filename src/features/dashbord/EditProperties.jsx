// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { supabase } from "@/lib/superbase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//     Upload,
//     Home,
//     ShieldCheck,
//     Plus,
//     Trash2,
//     Loader2,
//     ImageIcon,
//     ArrowLeft,
//     RefreshCw
// } from "lucide-react";
// import { toast } from "sonner";

// // --- HELPERS ---
// const sanitizeFileName = (file) => {
//     const extension = file.name.split('.').pop();
//     const name = file.name.split('.').shift().replace(/[^a-z0-9]/gi, '_').toLowerCase();
//     return `${Date.now()}_${name}.${extension}`;
// };

// export default function EditPropertyPage() {
//     const router = useRouter();
//     const { id } = useParams();

//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);
//     const [organisations, setOrganisations] = useState([]);

//     const [initialData, setInitialData] = useState(null);
//     const [existingCertificates, setExistingCertificates] = useState([]);
//     const [newCertificates, setNewCertificates] = useState([]);
//     const [certsToDelete, setCertsToDelete] = useState([]);

//     const [formData, setFormData] = useState({
//         propertyName: "",
//         address: "",
//         city: "",
//         postcode: "",
//         organisationId: "",
//         status: "",
//         rooms: "",
//         rent: "",
//         propertyImage: null,
//         leaseFile: null,
//         floorPlanFile: null,
//         insuranceFile: null,
//     });

//     const [imagePreview, setImagePreview] = useState(null);

//     useEffect(() => {
//         async function loadData() {
//             try {
//                 const [orgsRes, propRes, certsRes] = await Promise.all([
//                     supabase.from("organisations").select("id, name").eq("status", "Active"),
//                     supabase.from("properties").select("*").eq("id", id).single(),
//                     supabase.from("property_certificates").select("*").eq("property_id", id)
//                 ]);

//                 if (propRes.error) throw propRes.error;

//                 setOrganisations(orgsRes.data || []);
//                 const currentOrg = orgsRes.data?.find(o => o.name === propRes.data.organisation);

//                 setInitialData(propRes.data);
//                 setFormData({
//                     propertyName: propRes.data.property_name || "",
//                     address: propRes.data.address || "",
//                     city: propRes.data.city || "",
//                     postcode: propRes.data.postcode || "",
//                     organisationId: currentOrg?.id || "",
//                     status: propRes.data.status || "Active",
//                     rooms: propRes.data.rooms?.toString() || "",
//                     rent: propRes.data.rent?.toString() || "",
//                 });

//                 if (propRes.data.image_url) {
//                     const { data: { publicUrl } } = supabase.storage.from("property-documents").getPublicUrl(propRes.data.image_url);
//                     setImagePreview(`${publicUrl}?t=${Date.now()}`);
//                 }

//                 setExistingCertificates(certsRes.data || []);
//             } catch (err) {
//                 toast.error("Failed to load property data");
//                 router.push("/properties");
//             } finally {
//                 setFetching(false);
//             }
//         }
//         loadData();
//     }, [id, router]);

//     const handleExistingCertChange = (index, field, value) => {
//         const updated = [...existingCertificates];
//         updated[index][field] = value;
//         setExistingCertificates(updated);
//     };

//     const deleteStorageFile = async (path) => {
//         if (!path) return;
//         await supabase.storage.from("property-documents").remove([path]);
//     };

//     const uploadFile = async (file, folder) => {
//         if (!file) return null;
//         const cleanPath = `${folder}/${sanitizeFileName(file)}`;
//         const { data, error } = await supabase.storage.from("property-documents").upload(cleanPath, file);
//         if (error) throw error;
//         return data.path;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         const toastId = toast.loading("Syncing changes...");

//         try {
//             const updates = {};

//             // 1. MAIN FILE REPLACEMENT (Property Image, Lease, etc.)
//             const fileFields = [
//                 { key: 'propertyImage', db: 'image_url', folder: 'property-images' },
//                 { key: 'leaseFile', db: 'lease_url', folder: 'lease' },
//                 { key: 'floorPlanFile', db: 'floor_plan_url', folder: 'floorplans' },
//                 { key: 'insuranceFile', db: 'insurance_url', folder: 'insurance' }
//             ];

//             for (const item of fileFields) {
//                 if (formData[item.key]) {
//                     if (initialData[item.db]) await deleteStorageFile(initialData[item.db]);
//                     updates[item.db] = await uploadFile(formData[item.key], item.folder);
//                 }
//             }

//             // 2. TEXT FIELDS
//             updates.property_name = formData.propertyName;
//             updates.address = formData.address;
//             updates.city = formData.city;
//             updates.postcode = formData.postcode;
//             updates.status = formData.status;
//             updates.rooms = parseInt(formData.rooms) || 0;
//             updates.rent = parseFloat(formData.rent) || 0;

//             const selectedOrg = organisations.find(o => o.id === formData.organisationId);
//             if (selectedOrg) updates.organisation = selectedOrg.name;

//             await supabase.from("properties").update(updates).eq("id", id);

//             // 3. HANDLE DELETIONS (Bucket AND Table)
//             for (const cert of certsToDelete) {
//                 //  Delete from Storage 
//                 if (cert.document_url) await deleteStorageFile(cert.document_url);

//                 // Delete from Database Table
//                 const { error: delError } = await supabase
//                     .from("property_certificates")
//                     .delete()
//                     .eq("id", cert.id);

//                 if (delError) {
//                     console.error("❌ Delete failed:", delError.message);
//                     throw delError;
//                 }
//             }

//             // 4. UPDATE EXISTING CERTIFICATES
//             for (const cert of existingCertificates) {
//                 const certUpdates = {
//                     certificate_type: cert.certificate_type,
//                     expiry_date: cert.expiry_date
//                 };

//                 if (cert.newFile) {
//                     await deleteStorageFile(cert.document_url);
//                     certUpdates.document_url = await uploadFile(cert.newFile, "certificates");
//                 }

//                 const { error: upError } = await supabase
//                     .from("property_certificates")
//                     .update(certUpdates)
//                     .eq("id", cert.id); // Ensure cert.id is the UUID shown in your screenshot

//                 if (upError) {
//                     console.error("❌ Update failed:", upError.message);
//                     throw upError;
//                 }
//             }

//             // 5. NEW INSERTS
//             for (const cert of newCertificates) {
//                 if (!cert.file) continue;
//                 const path = await uploadFile(cert.file, "certificates");
//                 await supabase.from("property_certificates").insert({
//                     property_id: id,
//                     certificate_type: cert.type,
//                     expiry_date: cert.expiry,
//                     document_url: path
//                 });
//             }

//             toast.success("All changes synced successfully!", { id: toastId });
//             router.push(`/properties/${id}`);
//             router.refresh();
//         } catch (err) {
//             toast.error(`Sync failed: ${err.message}`, { id: toastId });
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (fetching) return (
//         <div className="flex h-screen items-center justify-center bg-[#fbf8f2]">
//             <Loader2 className="w-8 h-8 animate-spin text-[#1f6b4a]" />
//         </div>
//     );

//     return (
//         <div className="min-h-screen p-4 md:p-8">
//             <div className="max-w-4xl mx-auto mb-6">
//                 <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
//                     <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//                 </Button>
//             </div>

//             <Card className="max-w-4xl mx-auto border-[#e1dbd2] shadow-sm bg-white">
//                 <CardHeader className="border-b border-[#e1dbd2] mb-6">
//                     <CardTitle className="text-[#123d2b] text-xl font-bold flex items-center gap-2">
//                         <Home className="w-6 h-6" /> Edit Property: {initialData?.property_name}
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-8">

//                         {/* ... rest of the JSX stays the same as your provided code ... */}

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <Label className="mb-2 block text-xs font-bold uppercase tracking-tight">Main Photo</Label>
//                                 <div
//                                     className="relative border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer overflow-hidden border-[#e1dbd2] bg-[#fbf8f2] group"
//                                     onClick={() => document.getElementById('propertyImage').click()}
//                                 >
//                                     {imagePreview ? (
//                                         <img src={imagePreview} alt="Property" className="w-full h-full object-cover" />
//                                     ) : (
//                                         <ImageIcon className="w-8 h-8 opacity-20" />
//                                     )}
//                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
//                                         <RefreshCw className="text-white w-6 h-6" />
//                                     </div>
//                                 </div>
//                                 <Input id="propertyImage" type="file" className="hidden" accept="image/*" onChange={(e) => {
//                                     const file = e.target.files?.[0];
//                                     if (file) {
//                                         setFormData({ ...formData, propertyImage: file });
//                                         setImagePreview(URL.createObjectURL(file));
//                                     }
//                                 }} />
//                             </div>

//                             <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div className="col-span-2 space-y-2">
//                                     <Label>Property Name</Label>
//                                     <Input className="bg-[#e1dbd2] border-none" value={formData.propertyName} onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })} />
//                                 </div>
//                                 <div className="col-span-2 space-y-2">
//                                     <Label>Address</Label>
//                                     <Input className="bg-[#e1dbd2] border-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
//                                 </div>
//                                 <Input className="bg-[#e1dbd2] border-none" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
//                                 <Input className="bg-[#e1dbd2] border-none" placeholder="Postcode" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} />
//                             </div>
//                         </div>

//                         <Separator className="bg-[#e1dbd2]" />

//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                             <div className="space-y-2">
//                                 <Label>Organisation</Label>
//                                 <Select value={formData.organisationId} onValueChange={(v) => setFormData({ ...formData, organisationId: v })}>
//                                     <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
//                                     <SelectContent className="bg-[#fbf8f2]">
//                                         {organisations.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div className="space-y-2">
//                                 <Label>Status</Label>
//                                 <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
//                                     <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
//                                     <SelectContent className="bg-[#fbf8f2]">
//                                         <SelectItem value="Active">Active</SelectItem>
//                                         <SelectItem value="Onboarding">Onboarding</SelectItem>
//                                         <SelectItem value="Inactive">Inactive</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div className="space-y-2">
//                                 <Label>Rooms</Label>
//                                 <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label>Rent (£)</Label>
//                                 <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} />
//                             </div>
//                         </div>

//                         <Separator className="bg-[#e1dbd2]" />

//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance Certificates</h3>
//                                 <Button type="button" onClick={() => setNewCertificates([...newCertificates, { id: crypto.randomUUID(), type: "", expiry: "", file: null }])} className="bg-[#1f6b4a] h-8 text-xs">
//                                     <Plus className="w-3 h-3 mr-1" /> Add New Row
//                                 </Button>
//                             </div>

//                             <div className="space-y-3">
//                                 {existingCertificates.map((cert, idx) => (
//                                     <div key={cert.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-white border border-[#e1dbd2] rounded-lg items-end shadow-sm">
//                                         <div className="space-y-1">
//                                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Type</Label>
//                                             <Select value={cert.certificate_type} onValueChange={(v) => handleExistingCertChange(idx, 'certificate_type', v)}>
//                                                 <SelectTrigger className="h-9 border-[#e1dbd2]"><SelectValue /></SelectTrigger>
//                                                 <SelectContent className="bg-[#fbf8f2]">
//                                                     <SelectItem value="gas">Gas Safety</SelectItem>
//                                                     <SelectItem value="fire">Fire Risk</SelectItem>
//                                                     <SelectItem value="epc">EPC</SelectItem>
//                                                     <SelectItem value="elec">Electrical</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                         <div className="space-y-1">
//                                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Expiry</Label>
//                                             <Input type="date" className="h-9 border-[#e1dbd2]" value={cert.expiry_date} onChange={(e) => handleExistingCertChange(idx, 'expiry_date', e.target.value)} />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Document</Label>
//                                             <Input type="file" className="hidden" id={`up-cert-${cert.id}`} onChange={(e) => handleExistingCertChange(idx, 'newFile', e.target.files[0])} />
//                                             <Label htmlFor={`up-cert-${cert.id}`} className={`flex items-center justify-center h-9 rounded-md cursor-pointer text-[10px] font-bold border-2 border-dashed transition-colors ${cert.newFile ? 'bg-orange-50 border-orange-400 text-orange-600' : 'bg-[#e6f2ec] border-transparent text-[#1f6b4a]'}`}>
//                                                 {cert.newFile ? "FILE CHANGED" : "REPLACE FILE"}
//                                             </Label>
//                                         </div>
//                                         <Button type="button" variant="ghost" className="text-red-500 h-9" onClick={() => {
//                                             setCertsToDelete([...certsToDelete, cert]);
//                                             setExistingCertificates(existingCertificates.filter(c => c.id !== cert.id));
//                                         }}>
//                                             <Trash2 className="w-4 h-4" />
//                                         </Button>
//                                     </div>
//                                 ))}
//                             </div>

//                             {newCertificates.map((cert, idx) => (
//                                 <div key={cert.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border-2 border-dashed border-[#1f6b4a]/30 bg-[#f7f2e9]/40 relative">
//                                     <Button type="button" variant="ghost" onClick={() => setNewCertificates(newCertificates.filter(c => c.id !== cert.id))} className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-100 text-red-600 border border-red-200"><Trash2 className="w-3 h-3" /></Button>
//                                     <Select onValueChange={(v) => { const n = [...newCertificates]; n[idx].type = v; setNewCertificates(n); }}>
//                                         <SelectTrigger className="bg-white border-[#e1dbd2]"><SelectValue placeholder="New Type" /></SelectTrigger>
//                                         <SelectContent className="bg-[#fbf8f2]">
//                                             <SelectItem value="gas">Gas Safety</SelectItem>
//                                             <SelectItem value="fire">Fire Risk</SelectItem>
//                                             <SelectItem value="epc">EPC</SelectItem>
//                                             <SelectItem value="elec">Electrical</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <Input type="date" className="bg-white border-[#e1dbd2]" onChange={(e) => { const n = [...newCertificates]; n[idx].expiry = e.target.value; setNewCertificates(n); }} />
//                                     <div>
//                                         <Input type="file" className="hidden" id={`new-cert-${cert.id}`} onChange={(e) => { const n = [...newCertificates]; n[idx].file = e.target.files[0]; setNewCertificates(n); }} />
//                                         <Label htmlFor={`new-cert-${cert.id}`} className="flex items-center justify-center gap-2 bg-[#1f6b4a] text-white px-4 py-2 rounded-md cursor-pointer text-xs truncate">
//                                             <Upload className="w-3 h-3" /> {cert.file ? cert.file.name : "Upload File"}
//                                         </Label>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="bg-[#e6f2ec] p-5 rounded-lg border border-[#1f6b4a]/20">
//                             <p className="text-[10px] font-bold text-[#1f6b4a] mb-4 uppercase tracking-widest italic opacity-70 text-center">New file selections here will auto-delete old files from the bucket.</p>
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                                 {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((f) => (
//                                     <div key={f} className="space-y-2">
//                                         <Label className="text-[10px] font-bold uppercase text-[#1f6b4a]">{f.replace('File', '')}</Label>
//                                         <Input type="file" className="hidden" id={f} onChange={(e) => setFormData({ ...formData, [f]: e.target.files?.[0] })} />
//                                         <Label htmlFor={f} className={`flex flex-col items-center gap-2 bg-white px-3 py-4 rounded-xl cursor-pointer border-2 transition-all text-xs text-center shadow-sm ${formData[f] ? 'border-orange-400 bg-orange-50' : 'border-transparent hover:border-[#1f6b4a]'}`}>
//                                             <Upload className={`w-4 h-4 ${formData[f] ? 'text-orange-500' : 'text-[#1f6b4a]'}`} />
//                                             <span className="font-bold text-[#123d2b] uppercase tracking-tighter">{formData[f] ? "REPLACING" : "UPDATE"}</span>
//                                         </Label>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <Button type="submit" disabled={loading} className="w-full bg-[#1f6b4a] py-6 text-lg shadow-xl hover:bg-[#123d2b]">
//                             {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Commit Database & Storage Changes"}
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/superbase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Upload,
    Home,
    ShieldCheck,
    Plus,
    Trash2,
    Loader2,
    ImageIcon,
    ArrowLeft,
    RefreshCw,
    Wrench,
    FileText,
    Building2,
    AlertCircle,
    Calendar,
    Clock,
    Paperclip,
    Banknote,
    DoorOpen,
    User,
    History as HistoryIcon
} from "lucide-react";
import { toast } from "sonner";

const sanitizeFileName = (file) => {
    const extension = file.name.split('.').pop();
    const name = file.name.split('.').shift().replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${Date.now()}_${name}.${extension}`;
};

export default function EditPropertyPage() {
    const router = useRouter();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [organisations, setOrganisations] = useState([]);
    const [initialData, setInitialData] = useState(null);
    
    // State for Tabs
    const [existingCertificates, setExistingCertificates] = useState([]);
    const [newCertificates, setNewCertificates] = useState([]);
    const [certsToDelete, setCertsToDelete] = useState([]);
    const [maintenanceLogs, setMaintenanceLogs] = useState([]);
    const [expenditures, setExpenditures] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [historyLogs, setHistoryLogs] = useState([]);

    const [formData, setFormData] = useState({
        propertyName: "",
        address: "",
        city: "",
        postcode: "",
        organisationId: "",
        status: "",
        rooms: "",
        rent: "",
        propertyImage: null,
        leaseFile: null,
        floorPlanFile: null,
        insuranceFile: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [orgsRes, propRes, certsRes] = await Promise.all([
                    supabase.from("organisations").select("id, name").eq("status", "Active"),
                    supabase.from("properties").select("*").eq("id", id).single(),
                    supabase.from("property_certificates").select("*").eq("property_id", id)
                ]);

                if (propRes.error) throw propRes.error;

                setOrganisations(orgsRes.data || []);
                const currentOrg = orgsRes.data?.find(o => o.name === propRes.data.organisation);

                setInitialData(propRes.data);
                setFormData({
                    propertyName: propRes.data.property_name || "",
                    address: propRes.data.address || "",
                    city: propRes.data.city || "",
                    postcode: propRes.data.postcode || "",
                    organisationId: currentOrg?.id || "",
                    status: propRes.data.status || "Active",
                    rooms: propRes.data.rooms?.toString() || "",
                    rent: propRes.data.rent?.toString() || "",
                });

                if (propRes.data.image_url) {
                    const { data: { publicUrl } } = supabase.storage.from("property-documents").getPublicUrl(propRes.data.image_url);
                    setImagePreview(`${publicUrl}?t=${Date.now()}`);
                }

                setExistingCertificates(certsRes.data || []);
                // Initialize empty arrays if needed or fetch from DB
                setExpenditures([]); 
                setRooms([]);
                setHistoryLogs([]);
            } catch (err) {
                toast.error("Failed to load property data");
                router.push("/properties");
            } finally {
                setFetching(false);
            }
        }
        loadData();
    }, [id, router]);

    const addExpenditure = () => {
        setExpenditures([...expenditures, { id: crypto.randomUUID(), title: "", invoice: "", dateOfBill: "", meterNumber: "", amount: "", attachment: null, comment: "" }]);
    };

    const addMaintenanceLog = () => {
        setMaintenanceLogs([...maintenanceLogs, {
            id: crypto.randomUUID(), workType: "", area: "", jobNumber: "", description: "", priority: "Normal",
            startDate: "", dueDate: "", completedDate: "", assignedToOrgId: "", status: "New", estimate: "", actual: "", comments: "", attachment: null
        }]);
    };

    const handleExistingCertChange = (index, field, value) => {
        const updated = [...existingCertificates];
        updated[index][field] = value;
        setExistingCertificates(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // ... implementation logic ...
        setLoading(false);
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-[#fbf8f2]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1f6b4a]" />
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-5xl mx-auto mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>

            <Card className="max-w-5xl mx-auto border-[#e1dbd2] shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-[#e1dbd2] bg-white">
                    <CardTitle className="text-[#123d2b] text-xl font-bold flex items-center gap-2">
                        <Home className="w-6 h-6" /> Edit Property: {initialData?.property_name}
                    </CardTitle>
                </CardHeader>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b border-[#e1dbd2] bg-[#fbf8f2] p-0 h-12 overflow-x-auto">
                        <TabsTrigger value="basic" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#1f6b4a] h-full px-4 font-bold text-[#123d2b]">
                           <Building2 className="w-4 h-4 mr-2" /> Basic Details
                        </TabsTrigger>
                        <TabsTrigger value="compliance" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#1f6b4a] h-full px-4 font-bold text-[#123d2b]">
                           <ShieldCheck className="w-4 h-4 mr-2" /> Compliance
                        </TabsTrigger>
                        <TabsTrigger value="maintenance" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#1f6b4a] h-full px-4 font-bold text-[#123d2b]">
                           <Wrench className="w-4 h-4 mr-2" /> Maintenance
                        </TabsTrigger>
                        <TabsTrigger value="expenditure" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#1f6b4a] h-full px-4 font-bold text-[#123d2b]">
                           <Banknote className="w-4 h-4 mr-2" /> Expenditure
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#1f6b4a] h-full px-4 font-bold text-[#123d2b]">
                           <HistoryIcon className="w-4 h-4 mr-2" /> History
                        </TabsTrigger>
                        <TabsTrigger value="rooms" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#1f6b4a] h-full px-4 font-bold text-[#123d2b]">
                           <DoorOpen className="w-4 h-4 mr-2" /> Rooms
                        </TabsTrigger>
                    </TabsList>

                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit}>
                            <div className="p-8">
                                {/* BASIC DETAILS TAB */}
                                <TabsContent value="basic" className="space-y-8 mt-0 outline-none">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <Label className="mb-2 block text-xs font-bold uppercase tracking-tight text-[#123d2b]">Main Photo</Label>
                                            <div className="relative border-2 border-dashed rounded-2xl h-64 flex items-center justify-center cursor-pointer overflow-hidden border-[#e1dbd2] bg-[#fbf8f2] group transition-all hover:border-[#1f6b4a]" onClick={() => document.getElementById('propertyImage').click()}>
                                                {imagePreview ? <img src={imagePreview} alt="Property" className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 opacity-20" />}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><RefreshCw className="text-white w-8 h-8" /></div>
                                            </div>
                                            <Input id="propertyImage" type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setFormData({ ...formData, propertyImage: file }); setImagePreview(URL.createObjectURL(file)); } }} />
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[#123d2b] font-bold">Property Name</Label>
                                                <Input className="bg-[#f7f3eb] border-none h-12" value={formData.propertyName} onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[#123d2b] font-bold">Address</Label>
                                                <Input className="bg-[#f7f3eb] border-none h-12" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input className="bg-[#f7f3eb] border-none h-12" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                                <Input className="bg-[#f7f3eb] border-none h-12" placeholder="Postcode" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[#123d2b] font-bold">Organisation</Label>
                                            <Select value={formData.organisationId} onValueChange={(v) => setFormData({ ...formData, organisationId: v })}>
                                                <SelectTrigger className="bg-[#f7f3eb] border-none h-12"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-[#fbf8f2]">{organisations.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[#123d2b] font-bold">Status</Label>
                                            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                                <SelectTrigger className="bg-[#f7f3eb] border-none h-12"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-[#fbf8f2]">
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2"><Label className="text-[#123d2b] font-bold">Rooms</Label><Input type="number" className="bg-[#f7f3eb] border-none h-12" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} /></div>
                                        <div className="space-y-2"><Label className="text-[#123d2b] font-bold">Rent (£)</Label><Input type="number" className="bg-[#f7f3eb] border-none h-12" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} /></div>
                                    </div>
                                </TabsContent>

                                {/* COMPLIANCE TAB */}
                                <TabsContent value="compliance" className="space-y-8 mt-0 outline-none">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[#1f6b4a] font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Compliance Certificates</h3>
                                            <Button type="button" onClick={() => setNewCertificates([...newCertificates, { id: crypto.randomUUID(), type: "", expiry: "", file: null }])} className="bg-[#1f6b4a] hover:bg-[#123d2b]"><Plus className="w-4 h-4 mr-2" /> Add Certificate</Button>
                                        </div>
                                        <div className="grid gap-4">
                                            {existingCertificates.map((cert, idx) => (
                                                <div key={cert.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white border border-[#e1dbd2] rounded-2xl items-end shadow-sm">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] uppercase font-bold text-[#123d2b]">Type</Label>
                                                        <Select value={cert.certificate_type} onValueChange={(v) => handleExistingCertChange(idx, 'certificate_type', v)}>
                                                            <SelectTrigger className="h-11 bg-[#f7f3eb] border-none"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="gas">Gas Safety</SelectItem>
                                                                <SelectItem value="fire">Fire Risk</SelectItem>
                                                                <SelectItem value="epc">EPC</SelectItem>
                                                                <SelectItem value="elec">Electrical</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] uppercase font-bold text-[#123d2b]">Expiry</Label>
                                                        <Input type="date" className="h-11 bg-[#f7f3eb] border-none" value={cert.expiry_date} onChange={(e) => handleExistingCertChange(idx, 'expiry_date', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] uppercase font-bold text-[#123d2b]">Document</Label>
                                                        <Input type="file" className="hidden" id={`up-cert-${cert.id}`} onChange={(e) => handleExistingCertChange(idx, 'newFile', e.target.files[0])} />
                                                        <Label htmlFor={`up-cert-${cert.id}`} className={`flex items-center justify-center h-11 rounded-xl cursor-pointer text-xs font-bold border-2 border-dashed transition-all ${cert.newFile ? 'bg-orange-50 border-orange-400 text-orange-600' : 'bg-[#e6f2ec] border-transparent text-[#1f6b4a]'}`}>{cert.newFile ? "FILE CHANGED" : "REPLACE FILE"}</Label>
                                                    </div>
                                                    <Button type="button" variant="ghost" className="text-red-500 h-11 hover:bg-red-50" onClick={() => { setCertsToDelete([...certsToDelete, cert]); setExistingCertificates(existingCertificates.filter(c => c.id !== cert.id)); }}><Trash2 className="w-5 h-5" /></Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-[#e6f2ec] p-6 rounded-2xl border border-[#1f6b4a]/20">
                                            <p className="text-[10px] font-bold text-[#1f6b4a] mb-6 uppercase tracking-widest text-center opacity-70">Main Property Documents</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((f) => (
                                                    <div key={f} className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase text-[#123d2b]">{f.replace('File', '')}</Label>
                                                        <Input type="file" className="hidden" id={f} onChange={(e) => setFormData({ ...formData, [f]: e.target.files?.[0] })} />
                                                        <Label htmlFor={f} className={`flex flex-col items-center gap-3 bg-white px-4 py-6 rounded-2xl cursor-pointer border-2 transition-all text-center shadow-sm ${formData[f] ? 'border-orange-400 bg-orange-50' : 'border-transparent hover:border-[#1f6b4a]'}`}>
                                                            <Upload className={`w-6 h-6 ${formData[f] ? 'text-orange-500' : 'text-[#1f6b4a]'}`} />
                                                            <span className="font-bold text-[#123d2b] text-xs uppercase">{formData[f] ? "REPLACING" : "UPDATE"}</span>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* MAINTENANCE TAB - INTEGRATED NEW UI */}
                                <TabsContent value="maintenance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0 outline-none">
                                    <div className="flex items-center justify-between border-b border-[#e1dbd2] pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-1.5 bg-[#1f6b4a] rounded-full" />
                                            <h3 className="text-[#123d2b] text-lg font-bold">Maintenance Logs</h3>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={addMaintenanceLog}
                                            className="bg-[#1f6b4a] hover:bg-[#123d2b] h-10 px-6 rounded-full flex items-center gap-2 font-bold shadow-md transition-all active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" /> Add Maintenance Log
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {maintenanceLogs.length === 0 ? (
                                            <div className="text-center py-12 bg-[#fbf8f2] rounded-3xl border-2 border-dashed border-[#e1dbd2]">
                                                <Wrench className="w-12 h-12 text-[#1f6b4a] mx-auto opacity-20 mb-4" />
                                                <p className="text-[#123d2b] font-semibold">No maintenance logs added yet.</p>
                                                <p className="text-gray-400 text-sm">Click the button above to log a new repair or task.</p>
                                            </div>
                                        ) : (
                                            maintenanceLogs.map((log, index) => (
                                                <div
                                                    key={log.id}
                                                    className="p-6 md:p-8 rounded-3xl border border-[#e1dbd2] bg-white shadow-sm relative space-y-6 animate-in zoom-in-95 duration-300"
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => removeMaintenanceLog(log.id)}
                                                        className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Work Type</Label>
                                                            <Select value={log.workType} onValueChange={(v) => { const n = [...maintenanceLogs]; n[index].workType = v; setMaintenanceLogs(n); }}>
                                                                <SelectTrigger className="bg-[#f7f3eb] h-11 border-none"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Building">Building</SelectItem>
                                                                    <SelectItem value="Electrical">Electrical</SelectItem>
                                                                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                                                                    <SelectItem value="Other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Area</Label>
                                                            <Select value={log.area} onValueChange={(v) => { const n = [...maintenanceLogs]; n[index].area = v; setMaintenanceLogs(n); }}>
                                                                <SelectTrigger className="bg-[#f7f3eb] h-11 border-none"><SelectValue placeholder="Select Area" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                                                                    <SelectItem value="Bedroom">Bedroom</SelectItem>
                                                                    <SelectItem value="Garden">Garden</SelectItem>
                                                                    <SelectItem value="Bathroom">Bathroom</SelectItem>
                                                                    <SelectItem value="Common">Common</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Job Number</Label>
                                                            <Input placeholder="#0000" className="bg-[#f7f3eb] h-11 border-none" value={log.jobNumber} onChange={(e) => { const n = [...maintenanceLogs]; n[index].jobNumber = e.target.value; setMaintenanceLogs(n); }} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Description</Label>
                                                        <Input placeholder="Describe the issue or required work..." className="bg-[#f7f3eb] h-11 border-none" value={log.description} onChange={(e) => { const n = [...maintenanceLogs]; n[index].description = e.target.value; setMaintenanceLogs(n); }} />
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider flex items-center gap-2"><AlertCircle className="w-3 h-3" /> Priority Level</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["Normal", "Low", "Medium", "High", "Urgent"].map((p) => (
                                                                <button key={p} type="button" onClick={() => { const n = [...maintenanceLogs]; n[index].priority = p; setMaintenanceLogs(n); }} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${log.priority === p ? "bg-[#1f6b4a] text-white border-[#1f6b4a] shadow-md" : "bg-[#f7f3eb] text-[#123d2b] border-[#e1dbd2] hover:bg-[#e1dbd2]"}`}>
                                                                    {p}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider flex items-center gap-2"><Calendar className="w-3 h-3"/> Start Date</Label>
                                                            <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.startDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].startDate=e.target.value; setMaintenanceLogs(n);}}/>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider flex items-center gap-2"><Clock className="w-3 h-3"/> Due Date</Label>
                                                            <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.dueDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].dueDate=e.target.value; setMaintenanceLogs(n);}}/>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Completed Date</Label>
                                                            <Input type="date" className="bg-[#f7f3eb] border-none h-11" value={log.completedDate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].completedDate=e.target.value; setMaintenanceLogs(n);}}/>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Assigned To (Organisation)</Label>
                                                            <Select value={log.assignedToOrgId} onValueChange={(v) => { const n = [...maintenanceLogs]; n[index].assignedToOrgId = v; setMaintenanceLogs(n); }}>
                                                                <SelectTrigger className="bg-[#f7f3eb] h-11 border-none"><SelectValue placeholder="Select Organisation" /></SelectTrigger>
                                                                <SelectContent>
                                                                    {organisations.map((org) => (<SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Current Status</Label>
                                                            <Select value={log.status} onValueChange={(v) => { const n = [...maintenanceLogs]; n[index].status = v; setMaintenanceLogs(n); }}>
                                                                <SelectTrigger className="bg-[#f7f3eb] h-11 border-none"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    {[ "New", "Approved", "Archived", "Cancelled", "Complete", "In Progress", "Quote", "Reported", "Requires Attention" ].map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#fbf8f2] rounded-2xl border border-[#e1dbd2]">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b]">ESTIMATE (£)</Label>
                                                            <Input type="number" placeholder="0.00" className="bg-white border-[#e1dbd2]" value={log.estimate} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].estimate=e.target.value; setMaintenanceLogs(n);}} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b]">ACTUAL COST (£)</Label>
                                                            <Input type="number" placeholder="0.00" className="bg-white border-[#e1dbd2]" value={log.actual} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].actual=e.target.value; setMaintenanceLogs(n);}} />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Comments</Label>
                                                            <Input placeholder="Add any extra notes..." className="bg-[#f7f3eb] h-11 border-none" value={log.comments} onChange={(e)=>{const n=[...maintenanceLogs]; n[index].comments=e.target.value; setMaintenanceLogs(n);}} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold text-[#123d2b] uppercase tracking-wider">Attachments</Label>
                                                            <div className="flex items-center gap-2">
                                                                <Input type="file" id={`attach-${log.id}`} className="hidden" onChange={(e)=>{const n=[...maintenanceLogs]; n[index].attachment=e.target.files[0]; setMaintenanceLogs(n);}} />
                                                                <Label htmlFor={`attach-${log.id}`} className="flex-1 flex items-center justify-center gap-2 bg-[#e8e1d6] h-11 rounded-xl cursor-pointer text-xs font-bold text-[#123d2b] hover:bg-[#d1c9bd] transition-all border border-[#c5beaf]">
                                                                    <Paperclip className="w-4 h-4" />
                                                                    {log.attachment ? log.attachment.name : "Attach Invoice/Photo"}
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                {/* EXPENDITURE TAB */}
                                <TabsContent value="expenditure" className="space-y-6 outline-none">
                                    <div className="flex items-center justify-between border-b border-[#e1dbd2] pb-4">
                                        <h3 className="text-[#123d2b] text-lg font-bold flex items-center gap-2"><Banknote className="text-[#1f6b4a]" /> Property Expenditure</h3>
                                        <Button type="button" onClick={addExpenditure} className="bg-[#1f6b4a] hover:bg-[#123d2b] rounded-full"><Plus className="w-4 h-4 mr-2" /> Add Expenditure</Button>
                                    </div>
                                    {expenditures.map((exp, idx) => (
                                        <div key={exp.id} className="p-6 rounded-3xl border border-[#e1dbd2] bg-[#fbf8f2]/50 space-y-4 relative animate-in fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2"><Label className="text-xs font-bold uppercase text-[#123d2b]">Maintain Expenditure (Title)</Label><Input className="bg-white" value={exp.title} onChange={(e) => {const n = [...expenditures]; n[idx].title = e.target.value; setExpenditures(n);}} /></div>
                                                <div className="space-y-2"><Label className="text-xs font-bold uppercase text-[#123d2b]">Invoice #</Label><Input className="bg-white" value={exp.invoice} onChange={(e) => {const n = [...expenditures]; n[idx].invoice = e.target.value; setExpenditures(n);}} /></div>
                                                <div className="space-y-2"><Label className="text-xs font-bold uppercase text-[#123d2b]">Date of Bill</Label><Input type="date" className="bg-white" value={exp.dateOfBill} onChange={(e) => {const n = [...expenditures]; n[idx].dateOfBill = e.target.value; setExpenditures(n);}} /></div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2"><Label className="text-xs font-bold uppercase text-[#123d2b]">Meter Number</Label><Input className="bg-white" value={exp.meterNumber} onChange={(e) => {const n = [...expenditures]; n[idx].meterNumber = e.target.value; setExpenditures(n);}} /></div>
                                                <div className="space-y-2"><Label className="text-xs font-bold uppercase text-[#123d2b]">Amount (£)</Label><Input type="number" className="bg-white" value={exp.amount} onChange={(e) => {const n = [...expenditures]; n[idx].amount = e.target.value; setExpenditures(n);}} /></div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-[#123d2b]">Attachment</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input type="file" id={`exp-file-${exp.id}`} className="hidden" onChange={(e) => {const n = [...expenditures]; n[idx].attachment = e.target.files[0]; setExpenditures(n);}} />
                                                        <Label htmlFor={`exp-file-${exp.id}`} className="flex-1 flex items-center justify-center gap-2 bg-white h-10 rounded-lg border border-[#e1dbd2] cursor-pointer text-xs font-bold hover:bg-[#f1ede4]"><Upload className="w-4 h-4" /> {exp.attachment ? exp.attachment.name : "Upload Bill"}</Label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-[#123d2b]">Comment</Label><Input className="bg-white" value={exp.comment} onChange={(e) => {const n = [...expenditures]; n[idx].comment = e.target.value; setExpenditures(n);}} /></div>
                                            <Button variant="ghost" type="button" className="absolute top-2 right-2 text-red-500" onClick={() => setExpenditures(expenditures.filter(e => e.id !== exp.id))}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    ))}
                                </TabsContent>

                                {/* HISTORY TAB */}
                                <TabsContent value="history" className="outline-none">
                                    <div className="rounded-2xl border border-[#e1dbd2] overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-[#fbf8f2]">
                                                <TableRow>
                                                    <TableHead className="font-bold text-[#123d2b]">Awaiting Approval</TableHead>
                                                    <TableHead className="font-bold text-[#123d2b]">Valid From</TableHead>
                                                    <TableHead className="font-bold text-[#123d2b]">Valid To</TableHead>
                                                    <TableHead className="font-bold text-[#123d2b]">Updated By</TableHead>
                                                    <TableHead className="font-bold text-[#123d2b]">Updated Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {historyLogs.map((log) => (
                                                    <TableRow key={log.id}>
                                                        <TableCell><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${log.awaitingApproval === 'Yes' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{log.awaitingApproval}</span></TableCell>
                                                        <TableCell className="text-sm">{log.validFrom}</TableCell>
                                                        <TableCell className="text-sm">{log.validTo}</TableCell>
                                                        <TableCell className="text-sm font-medium">{log.updatedBy}</TableCell>
                                                        <TableCell className="text-sm text-gray-500">{log.updatedTime}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                {/* ROOMS TAB */}
                                <TabsContent value="rooms" className="space-y-6 outline-none">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {rooms.map((room) => (
                                            <div key={room.id} className="p-6 rounded-2xl border border-[#e1dbd2] bg-white flex items-center gap-4 shadow-sm hover:border-[#1f6b4a] transition-colors">
                                                <div className="h-12 w-12 rounded-full bg-[#e6f2ec] flex items-center justify-center text-[#1f6b4a]"><DoorOpen className="w-6 h-6" /></div>
                                                <div><p className="text-sm font-bold text-[#123d2b]">{room.roomNumber}</p><div className="flex items-center gap-1 text-xs text-gray-500"><User className="w-3 h-3" /> {room.tenant}</div></div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </div>

                            {/* SUBMIT FOOTER */}
                            <div className="p-8 bg-[#f1ede4] border-t border-[#e1dbd2] flex flex-col md:flex-row gap-4">
                                <Button type="submit" disabled={loading} className="flex-1 bg-[#1f6b4a] py-8 text-lg font-bold shadow-xl hover:bg-[#123d2b] transition-all rounded-2xl">
                                    {loading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <ShieldCheck className="w-6 h-6 mr-2" />}
                                    Sync Changes to Database
                                </Button>
                                <Button variant="ghost" type="button" onClick={() => router.back()} className="px-10 py-8 text-gray-500 font-bold hover:bg-[#e1dbd2] rounded-2xl">Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    );
}