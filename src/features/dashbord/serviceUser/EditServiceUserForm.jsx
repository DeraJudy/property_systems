// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// // Import your original form component, but we will pass "initialData" to it.
// import ServiceUserTabsForm from "@/features/dashbord/serviceUser/ServiceUserForm";

// export default function EditServiceUserForm() {
//   const { id } = useParams();
//   const router = useRouter();
//   const supabase = createClient();
//   const [initialData, setInitialData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data, error } = await supabase
//         .from("service_users")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         toast.error("Could not find user");
//         router.push("/service-users");
//       } else {
//         setInitialData(data);
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, [id, supabase, router]);

//   if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

//   // We render your existing form, but pass the mode and data as props
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6 text-[#123d2b]">Edit Service User Profile</h1>
//       <ServiceUserTabsForm isEdit={true} existingData={initialData} userId={id} />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { createClient } from "@/lib/superbase/clientUtils";
// import { toast } from "sonner";
// import { Loader2, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ServiceUserForm from "@/features/dashbord/serviceUser/ServiceUserForm";

// export default function EditServiceUserPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const supabase = createClient();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("service_users")
//           .select("*")
//           .eq("id", id)
//           .single();

//         if (error) throw error;
//         setUserData(data);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         toast.error("Could not find the requested service user.");
//         router.push("/service-users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id, supabase, router]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
//         <Loader2 className="animate-spin h-10 w-10 text-[#1f6b4a]" />
//         <p className="text-[#123d2b] font-medium animate-pulse">Loading Saved Data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6 bg-[#fbf8f2] min-h-screen">
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" onClick={() => router.back()} className="text-[#123d2b]">
//           <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Editing
//         </Button>
//       </div>

//       {/* We pass the fetched data into your existing form component */}
//       <ServiceUserForm initialData={userData} isEdit={true} />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  User,
  HeartPulse,
  Banknote,
  ShieldAlert,
  Upload,
  Loader2,
  MapPin,
  ClipboardCheck,
  Briefcase,
  ShieldCheck,
  ArrowLeft, Phone, Plus, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/superbase/clientUtils";

const AFRICAN_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "Ethiopia",
  "South Africa",
  "Uganda",
  "Other African",
];
const ASIAN_COUNTRIES = [
  "India",
  "Pakistan",
  "Bangladesh",
  "China",
  "Philippines",
  "Vietnam",
  "Other Asian",
];
const CARIBBEAN_COUNTRIES = [
  "Jamaica",
  "Trinidad and Tobago",
  "Barbados",
  "Grenada",
  "St Lucia",
  "Other Caribbean",
];

export default function EditServiceUserForm() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("key-info");

  // --- DROP DOWN DATA STATES ---
  const [organisations, setOrganisations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [approvedByList, setApprovedByList] = useState([]);
  const [assignedToList, setAssignedToList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentUser, setCurrentUser] = useState("Loading...");

  // --- MASTER FORM STATE ---
  // We use snake_case here so it perfectly matches our SQL columns.
  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    surname: "",
    dob: "",
    age: "",
    gender: "",
    ni_number: "",
    contact_no: "",
    email: "",
    organisation_id: "",
    ethnic_group: "",
    ethnic_origin: "",
    approved_by: "",
    assigned_to: "",
    nhs_number: "",
    social_worker: "",
    social_worker_num: "",
    physical_health_history: "",
    mental_health_history: "",
    allergies: "",
    medication_details: "",
    is_smoker: "",
    benefit_type: "",
    benefit_amount: "",
    benefit_frequency: "monthly",
    payer: "",
    secondary_income: "",
    is_employed: false,
    employer_name: "",
    job_title: "",
    contracted_hours: "",
    work_address: "",
    forensic_background: "",
    probation_details: "",
    risk_from_others: false,
    interview_precautions: "",
    property_id: "",
    assigned_room: "",
    previous_address: "",
  });

  const [files, setFiles] = useState({
    idVerification: null,
    tenancyAgreement: null,
    benefitLetter: null,
    riskAssessment: null,
    avatarImage: null,
  });

  // Keep track of existing URLs from DB
  const [existingUrls, setExistingUrls] = useState({});

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    setMounted(true);
    const initializeData = async () => {
      setLoading(true);
      // Fetch dropdown dependencies first
      await Promise.all([
        fetchOrganisations(),
        fetchProperties(),
        fetchStaff(),
        getActiveUser(),
      ]);

      // Then fetch the actual User Record
      if (id) {
        await fetchUserRecord();
      }
      setLoading(false);
    };

    initializeData();
  }, [id]);

  const fetchUserRecord = async () => {
    try {
      const { data, error } = await supabase
        .from("service_users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        // Map nulls back to empty strings for controlled inputs
        const sanitizedData = { ...data };
        Object.keys(sanitizedData).forEach((key) => {
          if (sanitizedData[key] === null) sanitizedData[key] = "";
        });

        setFormData(sanitizedData);

        // Save existing document URLs for reference
        setExistingUrls({
          avatar: data.avatar_url,
          id_verification: data.id_verification_url,
          tenancy: data.tenancy_agreement_url,
          benefit: data.benefit_letter_url,
          risk: data.risk_assessment_url,
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    }
  };

  // Update property details when formData.property_id changes (loaded from DB)
  useEffect(() => {
    if (properties.length > 0 && formData.property_id) {
      const prop = properties.find((p) => p.id === formData.property_id);
      setSelectedProperty(prop);
    }
  }, [formData.property_id, properties]);

  const getActiveUser = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      setCurrentUser("Guest User");
      return;
    }
    const metadataName =
      user.user_metadata?.full_name || user.user_metadata?.name;
    if (metadataName) {
      setCurrentUser(metadataName);
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (profile) setCurrentUser(profile.full_name);
    }
  };

  const fetchOrganisations = async () => {
    const { data } = await supabase
      .from("organisations")
      .select("id, name")
      .order("name", { ascending: true });
    if (data) setOrganisations(data);
  };

  const fetchProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("id, property_name, address, rooms");
    if (data) setProperties(data);
  };

  const fetchStaff = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role, status");
    if (data) {
      setApprovedByList(
        data.filter((u) => u.role === "admin" || u.role === "hr"),
      );
      setAssignedToList(
        data.filter((u) => u.role !== "finance" && u.status !== "pending"),
      );
    }
  };

  // Document Helpers
  const addDocument = () => {
    setCustomDocuments([
      ...customDocuments,
      { id: Date.now(), name: "", file: null },
    ]);
  };

   // Dynamic Documents State
    const [customDocuments, setCustomDocuments] = useState([
      { id: Date.now(), name: "", file: null },
    ]);

    const removeDocument = (id) => {
    if (customDocuments.length > 1) {
      setCustomDocuments(customDocuments.filter((doc) => doc.id !== id));
    }
  };

  const updateDocument = (index, field, value) => {
    const newDocs = [...customDocuments];
    newDocs[index][field] = value;
    setCustomDocuments(newDocs);
  };
  

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();

      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust if birthday hasn't happened yet this year
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      // Only update if the age is a valid positive number
      if (calculatedAge >= 0) {
        setFormData((prev) => ({ ...prev, age: calculatedAge.toString() }));
      }
    }
  }, [formData.dob]);

  // --- UPDATED INPUT HANDLER ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // 1. NHS Number Format (3-3-4: 485 777 3456)
    if (name === "nhs_number") {
      const digits = value.replace(/\D/g, ""); // Remove non-digits
      if (digits.length <= 3) {
        formattedValue = digits;
      } else if (digits.length <= 6) {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
      }
    }

    // 2. National Insurance Number Format (Keep existing)
    if (name === "ni_number") {
      const caps = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const match = caps.match(/^([A-Z]{2})?(\d{2})?(\d{2})?(\d{2})?([A-Z])?$/);
      if (match) {
        formattedValue = [match[1], match[2], match[3], match[4], match[5]]
          .filter(Boolean)
          .join(" ");
      } else {
        formattedValue = caps;
      }
    }

    // 3. Contact Number Format (Keep existing)
    if (name === "contact_no") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 5) {
        formattedValue = digits;
      } else if (digits.length <= 8) {
        formattedValue = `${digits.slice(0, 5)} ${digits.slice(5)}`;
      } else {
        formattedValue = `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e, field) => {
    if (e.target.files?.[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const getEthnicOrigins = () => {
    switch (formData.ethnic_group) {
      case "asian":
      case "asian-british":
        return ASIAN_COUNTRIES;
      case "african":
      case "black-british":
        return AFRICAN_COUNTRIES;
      case "caribbean":
        return CARIBBEAN_COUNTRIES;
      case "white":
        return ["British", "Irish", "European", "Other White"];
      case "mixed":
        return ["Mixed White & Black", "Mixed White & Asian", "Other Mixed"];
      default:
        return ["Please select a group first"];
    }
  };

  // Helper function to upload files to Supabase Storage
  const uploadFile = async (file, bucket) => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Updating profile...");

    try {
      // 1. Only upload NEW files if they were selected
      const [avatarUrl, idUrl, tenancyUrl, benefitUrl, riskUrl] =
        await Promise.all([
          files.avatarImage
            ? uploadFile(files.avatarImage, "avatars")
            : Promise.resolve(existingUrls.avatar),
          files.idVerification
            ? uploadFile(files.idVerification, "service_user_docs")
            : Promise.resolve(existingUrls.id_verification),
          files.tenancyAgreement
            ? uploadFile(files.tenancyAgreement, "service_user_docs")
            : Promise.resolve(existingUrls.tenancy),
          files.benefitLetter
            ? uploadFile(files.benefitLetter, "service_user_docs")
            : Promise.resolve(existingUrls.benefit),
          files.riskAssessment
            ? uploadFile(files.riskAssessment, "service_user_docs")
            : Promise.resolve(existingUrls.risk),
        ]);

      const payload = {
        ...formData,
        updated_at: new Date(),
        avatar_url: avatarUrl,
        id_verification_url: idUrl,
        tenancy_agreement_url: tenancyUrl,
        benefit_letter_url: benefitUrl,
        risk_assessment_url: riskUrl,
      };

      // Clean payload (convert "" to null)
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") payload[key] = null;
      });

      const { error } = await supabase
        .from("service_users")
        .update(payload)
        .eq("id", id);

      if (error) throw error;

      toast.success("Profile updated successfully!", { id: toastId });
      router.push("/service-users"); // Redirect back
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f5f0e6]">
        <Loader2 className="animate-spin h-12 w-12 text-[#1f6b4a] mb-4" />
        <p className="text-[#123d2b] font-medium">
          Retrieving database records...
        </p>
      </div>
    );

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-[#123d2b]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>

      <Card className="max-w-6xl mx-auto border-[#e1dbd2] bg-[#fbf8f2] shadow-lg overflow-hidden">
        <CardHeader className="bg-[#123d2b] text-[#f7f2e9] p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" />
                Service User Intake
              </CardTitle>
              <p className="text-[#f7f2e9]/70 text-sm mt-1">
                Complete the comprehensive profile for registration.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                Internal Reference
              </p>
              <p className="font-mono font-bold text-sm">REF-2026-0042</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start rounded-none bg-[#f1ede4] border-b border-[#e1dbd2] h-auto p-0 flex-wrap mb-6">
                {[
                  { id: "key-info", label: "Key Information", icon: User },
                  // {
                  //   id: "medical",
                  //   label: "Medical & Health",
                  //   icon: HeartPulse,
                  // },
                  // { id: "financial", label: "Financials", icon: Banknote },
                  // { id: "employment", label: "Employment", icon: Briefcase },
                  // { id: "risk", label: "Risk & Forensic", icon: ShieldAlert },
                  // { id: "address", label: "Address History", icon: MapPin },
                  { id: "contact", label: "Contact Information", icon: Phone },
                  { id: "documents", label: "Documents", icon: ClipboardCheck },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-[#fbf8f2] data-[state=active]:text-[#1f6b4a] rounded-none py-4 px-5 border-r border-[#e1dbd2] flex gap-2"
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="p-6 md:p-10">
                {/* --- TAB 1: KEY INFO --- */}

                <TabsContent value="key-info" className="space-y-8 mt-0">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-32 h-32 rounded-full bg-[#e1dbd2] flex items-center justify-center border-2 border-[#1f6b4a]/30 overflow-hidden relative">
                        {files.avatarImage ? (
                          <img
                            src={URL.createObjectURL(files.avatarImage)}
                            className="w-full h-full object-cover"
                          />
                        ) : existingUrls.avatar ? (
                          <img
                            src={existingUrls.avatar}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-[#123d2b]/20" />
                        )}
                      </div>
                      <Label
                        htmlFor="avatarImage"
                        className="cursor-pointer text-[10px] font-bold uppercase bg-[#1f6b4a] text-white px-3 py-1 rounded"
                      >
                        {existingUrls.avatar ? "Change Photo" : "Upload Photo"}
                      </Label>
                      <Input
                        type="file"
                        id="avatarImage"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "avatarImage")}
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Select
                          value={formData.title}
                          onValueChange={(val) =>
                            handleSelectChange("title", val)
                          }
                        >
                          <SelectTrigger className="bg-[#e1dbd2] border-none">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mr">Mr</SelectItem>
                            <SelectItem value="mrs">Mrs</SelectItem>
                            <SelectItem value="ms">Ms</SelectItem>
                            <SelectItem value="mx">Mx</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="bg-[#e1dbd2] border-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Surname</Label>
                        <Input
                          name="surname"
                          value={formData.surname}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="bg-[#e1dbd2] border-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          name="dob"
                          type="date"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="bg-[#e1dbd2] border-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Age (Auto-calculated)</Label>
                        <Input
                          name="age"
                          type="number"
                          value={formData.age}
                          readOnly // Make it read-only since it's automatic
                          placeholder="0"
                          className="bg-[#d1ccc4] border-none cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(val) =>
                            handleSelectChange("gender", val)
                          }
                        >
                          <SelectTrigger className="bg-[#e1dbd2] border-none">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#e1dbd2]" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#f1ede4]/50 p-6 rounded-lg border border-[#e1dbd2]">
                    {/* National Insurance Number Input */}
                    <div className="space-y-2">
                      <Label>NI Number</Label>
                      <Input
                        name="ni_number"
                        placeholder="QQ 12 34 56 C"
                        value={formData.ni_number}
                        onChange={handleInputChange}
                        maxLength={13} // Account for spaces
                        className="uppercase"
                      />
                    </div>

                    {/* Contact Number Input */}
                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input
                        name="contact_no"
                        placeholder="07123 456 789"
                        value={formData.contact_no}
                        onChange={handleInputChange}
                        maxLength={13} // Account for spaces
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Organisation</Label>
                      <Select
                        value={formData.organisation_id}
                        onValueChange={(val) =>
                          handleSelectChange("organisation_id", val)
                        }
                      >
                        <SelectTrigger className="bg-[#e1dbd2] border-none">
                          <SelectValue placeholder="Select Organisation" />
                        </SelectTrigger>
                        <SelectContent>
                          {organisations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Ethnic Origin Group</Label>
                      <Select
                        value={formData.ethnic_group}
                        onValueChange={(val) =>
                          handleSelectChange("ethnic_group", val)
                        }
                      >
                        <SelectTrigger className="bg-[#e1dbd2] border-none">
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="asian-british">
                            Asian British
                          </SelectItem>
                          <SelectItem value="african">African</SelectItem>
                          <SelectItem value="black-british">
                            Black British
                          </SelectItem>
                          <SelectItem value="caribbean">Caribbean</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="white">White</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Ethnic Origin</Label>
                      <Select
                        disabled={!formData.ethnic_group}
                        value={formData.ethnic_origin}
                        onValueChange={(val) =>
                          handleSelectChange("ethnic_origin", val)
                        }
                      >
                        <SelectTrigger className="bg-[#e1dbd2] border-none">
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {getEthnicOrigins().map((origin) => (
                            <SelectItem
                              key={origin}
                              value={origin.toLowerCase()}
                            >
                              {origin}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Address */}
                  <section className=" p-6 rounded-lg border border-[#e1dbd2]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Property Name</Label>
                        <Select
                          value={formData.property_id} // Added value prop to show stored data
                          onValueChange={(val) => {
                            handleSelectChange("property_id", val);
                            setSelectedProperty(
                              properties.find((p) => p.id === val),
                            );
                          }}
                        >
                          <SelectTrigger className="bg-[#e1dbd2] border-none">
                            <SelectValue placeholder="Select Property" />
                          </SelectTrigger>
                          <SelectContent>
                            {properties.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.property_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Street Address</Label>
                        <Input
                          className="bg-[#f1ede4] border-none font-semibold text-[#123d2b]"
                          value={selectedProperty?.address || ""}
                          readOnly
                          placeholder="Auto-populated"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Assigned Room</Label>
                        <Select
                          disabled={!selectedProperty}
                          value={formData.assigned_room}
                          onValueChange={(val) =>
                            handleSelectChange("assigned_room", val)
                          }
                        >
                          <SelectTrigger className="bg-[#e1dbd2] border-none">
                            <SelectValue
                              placeholder={
                                selectedProperty
                                  ? "Select a Room"
                                  : "Select property first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProperty?.rooms > 0 ? (
                              Array.from(
                                { length: selectedProperty.rooms },
                                (_, i) => (
                                  <SelectItem
                                    key={i + 1}
                                    value={`room-${i + 1}`}
                                  >
                                    Room {i + 1}
                                  </SelectItem>
                                ),
                              )
                            ) : (
                              <SelectItem value="none" disabled>
                                No rooms available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Previous Residency Address</Label>
                        <Textarea
                          name="previous_address"
                          value={formData.previous_address}
                          onChange={handleInputChange}
                          placeholder="Full details of last known address..."
                          className="bg-[#e1dbd2] border-none"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="bg-[#f1ede4] p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 border border-[#e1dbd2]">
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <Label className="text-[10px] font-bold uppercase text-[#123d2b]/60">
                          Created By
                        </Label>
                        <p className="text-sm font-semibold text-[#123d2b]">
                          {currentUser}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Approved By</Label>
                        <Select
                          value={formData.approved_by}
                          onValueChange={(val) =>
                            handleSelectChange("approved_by", val)
                          }
                        >
                          <SelectTrigger className="bg-[#e1dbd2] border-none h-8 text-xs">
                            <SelectValue placeholder="Select Admin/HR" />
                          </SelectTrigger>
                          <SelectContent>
                            {approvedByList.map((staff) => (
                              <SelectItem
                                key={staff.full_name}
                                value={staff.full_name}
                              >
                                {staff.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Assigned To</Label>
                        <Select
                          value={formData.assigned_to}
                          onValueChange={(val) =>
                            handleSelectChange("assigned_to", val)
                          }
                        >
                          <SelectTrigger className="bg-[#e1dbd2] border-none h-8 text-xs">
                            <SelectValue placeholder="Select Staff" />
                          </SelectTrigger>
                          <SelectContent>
                            {assignedToList.map((staff) => (
                              <SelectItem
                                key={staff.full_name}
                                value={staff.full_name}
                              >
                                {staff.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* --- TAB 2: MEDICAL --- */}
                {/* <TabsContent value="medical" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                  <Label>NHS Number</Label>
                  <Input
                    name="nhs_number"
                    value={formData.nhs_number}
                    onChange={handleInputChange}
                    placeholder="485 777 3456"
                    maxLength={12} // 10 digits + 2 spaces
                    className="bg-[#e1dbd2] border-none"
                  />
                </div>
                    <div className="space-y-2">
                      <Label>Social Worker</Label>
                      <Input
                        name="social_worker"
                        value={formData.social_worker}
                        onChange={handleInputChange}
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Social Worker Number</Label>
                      <Input
                        name="social_worker_num"
                        value={formData.social_worker_num}
                        onChange={handleInputChange}
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Physical Health History</Label>
                      <Textarea
                        name="physical_health_history"
                        value={formData.physical_health_history}
                        onChange={handleInputChange}
                        placeholder="Details of chronic conditions, surgeries..."
                        className="bg-[#e1dbd2] border-none h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mental Health History</Label>
                      <Textarea
                        name="mental_health_history"
                        value={formData.mental_health_history}
                        onChange={handleInputChange}
                        placeholder="Diagnoses, previous support..."
                        className="bg-[#e1dbd2] border-none h-24"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Allergies</Label>
                      <Input
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        placeholder="Nuts, Penicillin, etc."
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Medication or Treatment Details</Label>
                      <Input
                        name="medication_details"
                        value={formData.medication_details}
                        onChange={handleInputChange}
                        placeholder="Current prescriptions and dosage"
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                  </div>

                  <Field
                    orientation="horizontal"
                    className="max-w-md bg-[#f1ede4]/30 p-4 rounded-lg border border-[#e1dbd2] flex items-center justify-between"
                  >
                    <FieldContent className="flex-1">
                      <FieldLabel className="text-[#123d2b] font-bold">
                        Smoker Status
                      </FieldLabel>
                      <FieldDescription className="text-[#123d2b]/70">
                        Does the service user smoke or use tobacco?
                      </FieldDescription>
                    </FieldContent>
                    <div className="ml-4 w-30">
                      <Select
                        value={formData.is_smoker}
                        onValueChange={(val) =>
                          handleSelectChange("is_smoker", val)
                        }
                      >
                        <SelectTrigger className="bg-[#e1dbd2] border-none h-9 text-sm font-semibold text-[#123d2b]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Field>
                </TabsContent> */}

                {/* --- TAB 3: FINANCIALS --- */}
                {/* <TabsContent value="financial" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Benefit Type</Label>
                      <Input
                        name="benefit_type"
                        value={formData.benefit_type}
                        onChange={handleInputChange}
                        placeholder="Universal Credit / PIP"
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        name="benefit_amount"
                        type="number"
                        value={formData.benefit_amount}
                        onChange={handleInputChange}
                        placeholder="£ 0.00"
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={formData.benefit_frequency}
                        onValueChange={(val) =>
                          handleSelectChange("benefit_frequency", val)
                        }
                      >
                        <SelectTrigger className="bg-[#e1dbd2] border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="fortnightly">
                            Fortnightly
                          </SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payer</Label>
                      <Input
                        name="payer"
                        value={formData.payer}
                        onChange={handleInputChange}
                        placeholder="DWP / Local Council"
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Secondary Income Details</Label>
                      <Input
                        name="secondary_income"
                        value={formData.secondary_income}
                        onChange={handleInputChange}
                        placeholder="Grants, family support, etc."
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                  </div>
                </TabsContent> */}

                {/* --- TAB 4: EMPLOYMENT --- */}
                {/* <TabsContent value="employment" className="space-y-6 mt-0">
                  <div className="space-y-2 max-w-xs">
                <Label className="text-lg font-semibold">Currently Employed?</Label>
                <Select 
                  value={formData.is_employed ? "true" : "false"} 
                  onValueChange={(val) => handleSwitchChange("is_employed", val === "true")}
                >
                  <SelectTrigger className="bg-[#e1dbd2] border-none">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes, Currently Employed</SelectItem>
                    <SelectItem value="false">No, Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Employer Name</Label>
                      <Input
                        name="employer_name"
                        value={formData.employer_name}
                        onChange={handleInputChange}
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleInputChange}
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contracted Hours (Weekly)</Label>
                      <Input
                        name="contracted_hours"
                        type="number"
                        value={formData.contracted_hours}
                        onChange={handleInputChange}
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Work Address</Label>
                      <Input
                        name="work_address"
                        value={formData.work_address}
                        onChange={handleInputChange}
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                  </div>
                </TabsContent> */}

                {/* --- TAB 5: RISK --- */}
                {/* <TabsContent value="risk" className="space-y-6 mt-0">
                  <div className="bg-[#fff1f1] border border-red-100 p-6 rounded-lg">
                    <h4 className="text-red-800 font-bold mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" /> Safety & Background
                    </h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Forensic Background</Label>
                        <Textarea
                          name="forensic_background"
                          value={formData.forensic_background}
                          onChange={handleInputChange}
                          placeholder="Details of previous convictions..."
                          className="bg-white border-red-100 h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Probation Office Details</Label>
                        <Input
                          name="probation_details"
                          value={formData.probation_details}
                          onChange={handleInputChange}
                          placeholder="Officer name and contact info"
                          className="bg-white border-red-100"
                        />
                      </div>
                      <Separator className="bg-red-100" />
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.risk_from_others}
                            onCheckedChange={(val) =>
                              handleSwitchChange("risk_from_others", val)
                            }
                          />
                          <Label className="font-bold">
                            Applicant is at risk of harm from others?
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label>Interview Precautions</Label>
                          <Textarea
                            name="interview_precautions"
                            value={formData.interview_precautions}
                            onChange={handleInputChange}
                            placeholder="Precautions taken when interviewing..."
                            className="bg-white border-red-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent> */}

                {/* --- TAB 6: ADDRESS --- */}
                {/* <TabsContent value="address" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                  <Label>Property Name</Label>
                  <Select
                    value={formData.property_id} // Added value prop to show stored data
                    onValueChange={(val) => {
                      handleSelectChange("property_id", val);
                      setSelectedProperty(properties.find((p) => p.id === val));
                    }}
                  >
                    <SelectTrigger className="bg-[#e1dbd2] border-none">
                      <SelectValue placeholder="Select Property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.property_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input
                        className="bg-[#f1ede4] border-none font-semibold text-[#123d2b]"
                        value={selectedProperty?.address || ""}
                        readOnly
                        placeholder="Auto-populated"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned Room</Label>
                      <Select
                        disabled={!selectedProperty}
                        value={formData.assigned_room}
                        onValueChange={(val) =>
                          handleSelectChange("assigned_room", val)
                        }
                      >
                        <SelectTrigger className="bg-[#e1dbd2] border-none">
                          <SelectValue
                            placeholder={
                              selectedProperty
                                ? "Select a Room"
                                : "Select property first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProperty?.rooms > 0 ? (
                            Array.from(
                              { length: selectedProperty.rooms },
                              (_, i) => (
                                <SelectItem key={i + 1} value={`room-${i + 1}`}>
                                  Room {i + 1}
                                </SelectItem>
                              ),
                            )
                          ) : (
                            <SelectItem value="none" disabled>
                              No rooms available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Previous Residency Address</Label>
                      <Textarea
                        name="previous_address"
                        value={formData.previous_address}
                        onChange={handleInputChange}
                        placeholder="Full details of last known address..."
                        className="bg-[#e1dbd2] border-none"
                      />
                    </div>
                  </div>
                </TabsContent> */}

                {/* --- TAB 7: DOCUMENTS --- */}
                {/* <TabsContent value="documents" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "ID Verification", field: "idVerification" },
                      { label: "Tenancy Agreement", field: "tenancyAgreement" },
                      { label: "Benefit Letter", field: "benefitLetter" },
                      { label: "Risk Assessment", field: "riskAssessment" },
                    ].map((doc) => (
                      <div
                        key={doc.field}
                        className="p-4 border border-[#e1dbd2] bg-white rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Upload className="w-4 h-4 text-[#123d2b]" />
                          <div>
                            <p className="text-sm font-bold">{doc.label}</p>
                            <p className="text-[10px] text-gray-400">
                              {files[doc.field]
                                ? files[doc.field].name
                                : "UPLOAD REQUIRED"}
                            </p>
                          </div>
                        </div>
                        <Label
                          htmlFor={doc.field}
                          className="cursor-pointer bg-[#123d2b] text-white px-3 py-1.5 rounded text-[11px]"
                        >
                          {files[doc.field] ? "Replace" : "Select File"}
                        </Label>
                        <Input
                          type="file"
                          className="hidden"
                          id={doc.field}
                          onChange={(e) => handleFileChange(e, doc.field)}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent> */}

                <TabsContent value="contact" className="space-y-6 mt-0">
                  <div className="bg-[#f1ede4]/50 p-6 rounded-lg border border-[#e1dbd2]">
                    <h3 className="text-[#123d2b] font-bold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" /> Next of Kin Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          name="nok_name"
                          value={formData.nok_name}
                          onChange={handleInputChange}
                          className="bg-[#e1dbd2] border-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Select
                          value={formData.nok_relationship}
                          onValueChange={(val) =>
                            handleSelectChange("nok_relationship", val)
                          }
                        >
                          <SelectTrigger className="bg-[#e1dbd2] border-none">
                            <SelectValue placeholder="Select Relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          name="nok_phone"
                          value={formData.nok_phone}
                          onChange={handleInputChange}
                          className="bg-[#e1dbd2] border-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input
                          name="nok_email"
                          type="email"
                          value={formData.nok_email}
                          onChange={handleInputChange}
                          className="bg-[#e1dbd2] border-none"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Postal Address</Label>
                        <Textarea
                          name="nok_address"
                          value={formData.nok_address}
                          onChange={handleInputChange}
                          className="bg-[#e1dbd2] border-none h-20"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* --- TAB 7: DOCUMENTS (FIX 3: SHOW EXISTING) --- */}
                <TabsContent value="documents" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: "ID Verification",
                        field: "idVerification",
                        dbKey: "id_verification",
                      },
                      {
                        label: "Tenancy Agreement",
                        field: "tenancyAgreement",
                        dbKey: "tenancy",
                      },
                      {
                        label: "Benefit Letter",
                        field: "benefitLetter",
                        dbKey: "benefit",
                      },
                      {
                        label: "Risk Assessment",
                        field: "riskAssessment",
                        dbKey: "risk",
                      },
                    ].map((doc) => (
                      <div
                        key={doc.field}
                        className="p-4 border border-[#e1dbd2] bg-white rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Upload className="w-4 h-4 text-[#123d2b]" />
                          <div>
                            <p className="text-sm font-bold">{doc.label}</p>
                            <p className="text-[10px]">
                              {files[doc.field] ? (
                                <span className="text-green-600 font-bold">
                                  NEW: {files[doc.field].name}
                                </span>
                              ) : existingUrls[doc.dbKey] ? (
                                <a
                                  href={existingUrls[doc.dbKey]}
                                  target="_blank"
                                  className="text-blue-500 underline"
                                >
                                  View Existing File
                                </a>
                              ) : (
                                <span className="text-red-400">
                                  NO FILE STORED
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Label
                          htmlFor={doc.field}
                          className="cursor-pointer bg-[#123d2b] text-white px-3 py-1.5 rounded text-[11px]"
                        >
                          {existingUrls[doc.dbKey] ? "Replace" : "Upload"}
                        </Label>
                        <Input
                          type="file"
                          className="hidden"
                          id={doc.field}
                          onChange={(e) => handleFileChange(e, doc.field)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#1f6b4a] font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Additional Documents
                      </h3>
                      <Button
                        type="button"
                        onClick={addDocument}
                        className="bg-[#1f6b4a] h-8 w-8 p-0 rounded-full"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    {customDocuments.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-[#e1dbd2] bg-[#f7f2e9]/50 relative"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeDocument(doc.id)}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-100 text-red-600 border border-red-200 hover:bg-red-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>

                        <div className="space-y-2">
                          <Label>Document Name</Label>
                          <Input
                            placeholder="e.g. Identity Proof"
                            className="bg-[#e1dbd2] border-none"
                            value={doc.name}
                            onChange={(e) =>
                              updateDocument(index, "name", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>File</Label>
                          <Input
                            type="file"
                            className="hidden"
                            id={`f-${doc.id}`}
                            onChange={(e) =>
                              updateDocument(index, "file", e.target.files[0])
                            }
                          />
                          <Label
                            htmlFor={`f-${doc.id}`}
                            className="flex items-center gap-2 bg-[#e8e1d6] px-4 py-2 rounded-md cursor-pointer text-xs h-10 truncate"
                          >
                            <Upload className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                              {doc.file ? doc.file.name : "Choose File"}
                            </span>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>

                </TabsContent>
              </div>

              {/* --- SUBMIT FOOTER --- */}
              <div className="p-6 bg-[#f1ede4] border-t border-[#e1dbd2] flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#123d2b] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> DATA ENCRYPTION ACTIVE
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#1f6b4a] hover:bg-[#123d2b] text-white px-10"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </div>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
