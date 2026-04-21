"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  Lock, 
  Unlock,
  CheckCircle2,
  XCircle
} from "lucide-react";

// The roles you provided
const roles = [
  { id: "admin", label: "Admin" },
  { id: "hr", label: "HR" },
  { id: "finance", label: "Finance" },
  { id: "support_worker", label: "Support" },
  { id: "auditor", label: "Auditor" },
];

// The pages from your Sidebar.jsx
const pages = [
  { id: "/dashboard", label: "Dashboard" },
  { id: "/users", label: "Users" },
  { id: "/properties", label: "Properties" },
  { id: "/service-users", label: "Service Users" },
  { id: "/hrList", label: "Safer Recruitment" },
  { id: "/repository", label: "Repository" },
  { id: "/pre-migration", label: "Pre-Migration" },
  { id: "/core-documents", label: "Core Documents" },
];

export default function PermissionsPage() {
  // Initial state: Everything restricted except for Admin
  const [permissions, setPermissions] = useState({
    admin: pages.map(p => p.id), // Admin has all
    hr: ["/dashboard", "/hrList", "/users"],
    finance: ["/dashboard"],
    support_worker: ["/dashboard", "/service-users", "/properties"],
    auditor: ["/dashboard", "/repository", "/core-documents"],
  });

  const togglePermission = (roleId, pageId) => {
    setPermissions((prev) => {
      const rolePermissions = prev[roleId] || [];
      const isGranted = rolePermissions.includes(pageId);
      
      return {
        ...prev,
        [roleId]: isGranted
          ? rolePermissions.filter((id) => id !== pageId)
          : [...rolePermissions, pageId],
      };
    });
  };

  const handleSave = () => {
    console.log("Saving Permissions to Database:", permissions);
    alert("Permissions updated successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Access Control Matrix
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Define which user roles can view specific sections of the platform.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-semibold uppercase text-gray-500 sticky left-0 bg-gray-50 z-10">
                  Page / Feature
                </th>
                {roles.map((role) => (
                  <th key={role.id} className="p-4 text-xs font-semibold uppercase text-gray-500 text-center">
                    {role.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">
                    {page.label}
                    <div className="text-[10px] text-gray-400 font-normal">{page.id}</div>
                  </td>
                  {roles.map((role) => {
                    const hasAccess = permissions[role.id]?.includes(page.id);
                    return (
                      <td key={`${role.id}-${page.id}`} className="p-4 text-center">
                        <button
                          onClick={() => togglePermission(role.id, page.id)}
                          disabled={role.id === "admin"} // Protect Admin role
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            hasAccess 
                              ? "bg-green-100 text-green-700 hover:bg-green-200" 
                              : "bg-red-50 text-red-400 hover:bg-red-100"
                          } ${role.id === 'admin' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {hasAccess ? (
                            <Unlock className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend / Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Active Permissions
          </h3>
          <p className="text-xs text-blue-700 mt-1">
            Roles with "Unlock" icons will see these items in their sidebar navigation and have access to the routes.
          </p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Inheritance Note
          </h3>
          <p className="text-xs text-amber-700 mt-1">
            The Admin role has hardcoded access to all pages to prevent accidental lockout.
          </p>
        </div>
      </div>
    </div>
  );
}