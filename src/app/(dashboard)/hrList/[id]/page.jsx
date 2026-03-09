// import React from 'react'

// const page = () => {
//   return (
//     <div>page</div>
//   )
// }

// export default page


"use client"

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Trash2, 
  Briefcase, 
  Clock 
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const EmployeeDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  
  // Simulated data fetch based on ID
  const employee = {
    id: params.id,
    name: "Sarah Mitchell",
    email: "s.mitchell@kenleyhousing.co.uk",
    phone: "07700 900123",
    role: "Support Worker",
    org: "Kenley Housing Group",
    status: "Employed",
    dbs: "Valid",
    training: 92,
    joinedDate: "2024-03-12",
    contractExpiry: "2026-09-15",
    lastActive: "2 hours ago"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => console.log("Deactivate")}>Deactivate</Button>
          <Button onClick={() => console.log("Edit")}>Edit Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                {employee.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{employee.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="font-normal">{employee.role}</Badge>
                  <StatusBadge status={employee.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Employment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.org}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined: {employee.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-semibold mb-6">Compliance & Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-4 rounded-xl border bg-accent/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">DBS Certificate</span>
                  <StatusBadge status={employee.dbs} />
                </div>
                <p className="text-xs text-muted-foreground">Last verified: 12 Jan 2024</p>
              </div>

              <div className="p-4 rounded-xl border bg-accent/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Training Progress</span>
                  <span className="text-sm font-bold">{employee.training}%</span>
                </div>
                <Progress value={employee.training} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">12/14 modules completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Stats */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Last Active
                </div>
                <span className="font-medium">{employee.lastActive}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" /> Contract Expiry
                </div>
                <span className="font-medium">{employee.contractExpiry}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <Button variant="destructive" className="w-full gap-2" onClick={() => router.push('/dashboard/employees')}>
              <Trash2 className="h-4 w-4" /> Terminate Employment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;