"use client";

import PageBanner from "@/components/dashboard/PageBanner";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      <PageBanner title="Dashboard" subtitle="Overview of Staff, Service Users, and Properties" category="dashboard" />
      
      {/* <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-gray-600">
          Dashboard Overview
        </p>
      </div> */}

    </div>
  );
}