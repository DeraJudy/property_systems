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
import {
    Upload,
    Home,
    ShieldCheck,
    Plus,
    Trash2,
    Loader2,
    ImageIcon,
    ArrowLeft,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// --- HELPERS ---
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
    const [existingCertificates, setExistingCertificates] = useState([]);
    const [newCertificates, setNewCertificates] = useState([]);
    const [certsToDelete, setCertsToDelete] = useState([]);

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
            } catch (err) {
                toast.error("Failed to load property data");
                router.push("/properties");
            } finally {
                setFetching(false);
            }
        }
        loadData();
    }, [id, router]);

    const handleExistingCertChange = (index, field, value) => {
        const updated = [...existingCertificates];
        updated[index][field] = value;
        setExistingCertificates(updated);
    };

    const deleteStorageFile = async (path) => {
        if (!path) return;
        await supabase.storage.from("property-documents").remove([path]);
    };

    const uploadFile = async (file, folder) => {
        if (!file) return null;
        const cleanPath = `${folder}/${sanitizeFileName(file)}`;
        const { data, error } = await supabase.storage.from("property-documents").upload(cleanPath, file);
        if (error) throw error;
        return data.path;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Syncing changes...");

        try {
            const updates = {};

            // 1. MAIN FILE REPLACEMENT (Property Image, Lease, etc.)
            const fileFields = [
                { key: 'propertyImage', db: 'image_url', folder: 'property-images' },
                { key: 'leaseFile', db: 'lease_url', folder: 'lease' },
                { key: 'floorPlanFile', db: 'floor_plan_url', folder: 'floorplans' },
                { key: 'insuranceFile', db: 'insurance_url', folder: 'insurance' }
            ];

            for (const item of fileFields) {
                if (formData[item.key]) {
                    if (initialData[item.db]) await deleteStorageFile(initialData[item.db]);
                    updates[item.db] = await uploadFile(formData[item.key], item.folder);
                }
            }

            // 2. TEXT FIELDS
            updates.property_name = formData.propertyName;
            updates.address = formData.address;
            updates.city = formData.city;
            updates.postcode = formData.postcode;
            updates.status = formData.status;
            updates.rooms = parseInt(formData.rooms) || 0;
            updates.rent = parseFloat(formData.rent) || 0;

            const selectedOrg = organisations.find(o => o.id === formData.organisationId);
            if (selectedOrg) updates.organisation = selectedOrg.name;

            await supabase.from("properties").update(updates).eq("id", id);

            // 3. HANDLE DELETIONS (Bucket AND Table)
            for (const cert of certsToDelete) {
                //  Delete from Storage 
                if (cert.document_url) await deleteStorageFile(cert.document_url);

                // Delete from Database Table
                const { error: delError } = await supabase
                    .from("property_certificates")
                    .delete()
                    .eq("id", cert.id);

                if (delError) {
                    console.error("❌ Delete failed:", delError.message);
                    throw delError;
                }
            }

            // 4. UPDATE EXISTING CERTIFICATES
            for (const cert of existingCertificates) {
                const certUpdates = {
                    certificate_type: cert.certificate_type,
                    expiry_date: cert.expiry_date
                };

                if (cert.newFile) {
                    await deleteStorageFile(cert.document_url);
                    certUpdates.document_url = await uploadFile(cert.newFile, "certificates");
                }

                const { error: upError } = await supabase
                    .from("property_certificates")
                    .update(certUpdates)
                    .eq("id", cert.id); // Ensure cert.id is the UUID shown in your screenshot

                if (upError) {
                    console.error("❌ Update failed:", upError.message);
                    throw upError;
                }
            }

            // 5. NEW INSERTS
            for (const cert of newCertificates) {
                if (!cert.file) continue;
                const path = await uploadFile(cert.file, "certificates");
                await supabase.from("property_certificates").insert({
                    property_id: id,
                    certificate_type: cert.type,
                    expiry_date: cert.expiry,
                    document_url: path
                });
            }

            toast.success("All changes synced successfully!", { id: toastId });
            router.push(`/properties/${id}`);
            router.refresh();
        } catch (err) {
            toast.error(`Sync failed: ${err.message}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-[#fbf8f2]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1f6b4a]" />
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b] hover:bg-[#e1dbd2]">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>

            <Card className="max-w-4xl mx-auto border-[#e1dbd2] shadow-sm bg-white">
                <CardHeader className="border-b border-[#e1dbd2] mb-6">
                    <CardTitle className="text-[#123d2b] text-xl font-bold flex items-center gap-2">
                        <Home className="w-6 h-6" /> Edit Property: {initialData?.property_name}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* ... rest of the JSX stays the same as your provided code ... */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label className="mb-2 block text-xs font-bold uppercase tracking-tight">Main Photo</Label>
                                <div
                                    className="relative border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer overflow-hidden border-[#e1dbd2] bg-[#fbf8f2] group"
                                    onClick={() => document.getElementById('propertyImage').click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Property" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 opacity-20" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <RefreshCw className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <Input id="propertyImage" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData({ ...formData, propertyImage: file });
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }} />
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label>Property Name</Label>
                                    <Input className="bg-[#e1dbd2] border-none" value={formData.propertyName} onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Address</Label>
                                    <Input className="bg-[#e1dbd2] border-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                </div>
                                <Input className="bg-[#e1dbd2] border-none" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                <Input className="bg-[#e1dbd2] border-none" placeholder="Postcode" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} />
                            </div>
                        </div>

                        <Separator className="bg-[#e1dbd2]" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Organisation</Label>
                                <Select value={formData.organisationId} onValueChange={(v) => setFormData({ ...formData, organisationId: v })}>
                                    <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#fbf8f2]">
                                        {organisations.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger className="bg-[#e1dbd2] border-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#fbf8f2]">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Rooms</Label>
                                <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Rent (£)</Label>
                                <Input type="number" className="bg-[#e1dbd2] border-none" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} />
                            </div>
                        </div>

                        <Separator className="bg-[#e1dbd2]" />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance Certificates</h3>
                                <Button type="button" onClick={() => setNewCertificates([...newCertificates, { id: crypto.randomUUID(), type: "", expiry: "", file: null }])} className="bg-[#1f6b4a] h-8 text-xs">
                                    <Plus className="w-3 h-3 mr-1" /> Add New Row
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {existingCertificates.map((cert, idx) => (
                                    <div key={cert.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-white border border-[#e1dbd2] rounded-lg items-end shadow-sm">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Type</Label>
                                            <Select value={cert.certificate_type} onValueChange={(v) => handleExistingCertChange(idx, 'certificate_type', v)}>
                                                <SelectTrigger className="h-9 border-[#e1dbd2]"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-[#fbf8f2]">
                                                    <SelectItem value="gas">Gas Safety</SelectItem>
                                                    <SelectItem value="fire">Fire Risk</SelectItem>
                                                    <SelectItem value="epc">EPC</SelectItem>
                                                    <SelectItem value="elec">Electrical</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Expiry</Label>
                                            <Input type="date" className="h-9 border-[#e1dbd2]" value={cert.expiry_date} onChange={(e) => handleExistingCertChange(idx, 'expiry_date', e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Document</Label>
                                            <Input type="file" className="hidden" id={`up-cert-${cert.id}`} onChange={(e) => handleExistingCertChange(idx, 'newFile', e.target.files[0])} />
                                            <Label htmlFor={`up-cert-${cert.id}`} className={`flex items-center justify-center h-9 rounded-md cursor-pointer text-[10px] font-bold border-2 border-dashed transition-colors ${cert.newFile ? 'bg-orange-50 border-orange-400 text-orange-600' : 'bg-[#e6f2ec] border-transparent text-[#1f6b4a]'}`}>
                                                {cert.newFile ? "FILE CHANGED" : "REPLACE FILE"}
                                            </Label>
                                        </div>
                                        <Button type="button" variant="ghost" className="text-red-500 h-9" onClick={() => {
                                            setCertsToDelete([...certsToDelete, cert]);
                                            setExistingCertificates(existingCertificates.filter(c => c.id !== cert.id));
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {newCertificates.map((cert, idx) => (
                                <div key={cert.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border-2 border-dashed border-[#1f6b4a]/30 bg-[#f7f2e9]/40 relative">
                                    <Button type="button" variant="ghost" onClick={() => setNewCertificates(newCertificates.filter(c => c.id !== cert.id))} className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-100 text-red-600 border border-red-200"><Trash2 className="w-3 h-3" /></Button>
                                    <Select onValueChange={(v) => { const n = [...newCertificates]; n[idx].type = v; setNewCertificates(n); }}>
                                        <SelectTrigger className="bg-white border-[#e1dbd2]"><SelectValue placeholder="New Type" /></SelectTrigger>
                                        <SelectContent className="bg-[#fbf8f2]">
                                            <SelectItem value="gas">Gas Safety</SelectItem>
                                            <SelectItem value="fire">Fire Risk</SelectItem>
                                            <SelectItem value="epc">EPC</SelectItem>
                                            <SelectItem value="elec">Electrical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input type="date" className="bg-white border-[#e1dbd2]" onChange={(e) => { const n = [...newCertificates]; n[idx].expiry = e.target.value; setNewCertificates(n); }} />
                                    <div>
                                        <Input type="file" className="hidden" id={`new-cert-${cert.id}`} onChange={(e) => { const n = [...newCertificates]; n[idx].file = e.target.files[0]; setNewCertificates(n); }} />
                                        <Label htmlFor={`new-cert-${cert.id}`} className="flex items-center justify-center gap-2 bg-[#1f6b4a] text-white px-4 py-2 rounded-md cursor-pointer text-xs truncate">
                                            <Upload className="w-3 h-3" /> {cert.file ? cert.file.name : "Upload File"}
                                        </Label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#e6f2ec] p-5 rounded-lg border border-[#1f6b4a]/20">
                            <p className="text-[10px] font-bold text-[#1f6b4a] mb-4 uppercase tracking-widest italic opacity-70 text-center">New file selections here will auto-delete old files from the bucket.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {['leaseFile', 'floorPlanFile', 'insuranceFile'].map((f) => (
                                    <div key={f} className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-[#1f6b4a]">{f.replace('File', '')}</Label>
                                        <Input type="file" className="hidden" id={f} onChange={(e) => setFormData({ ...formData, [f]: e.target.files?.[0] })} />
                                        <Label htmlFor={f} className={`flex flex-col items-center gap-2 bg-white px-3 py-4 rounded-xl cursor-pointer border-2 transition-all text-xs text-center shadow-sm ${formData[f] ? 'border-orange-400 bg-orange-50' : 'border-transparent hover:border-[#1f6b4a]'}`}>
                                            <Upload className={`w-4 h-4 ${formData[f] ? 'text-orange-500' : 'text-[#1f6b4a]'}`} />
                                            <span className="font-bold text-[#123d2b] uppercase tracking-tighter">{formData[f] ? "REPLACING" : "UPDATE"}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-[#1f6b4a] py-6 text-lg shadow-xl hover:bg-[#123d2b]">
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Commit Database & Storage Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}