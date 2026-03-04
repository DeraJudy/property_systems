import { redirect } from "next/navigation";
import { createClient } from "@/lib/superbase/server";
import DashboardShell from "./dashboardShell";

export default async function DashboardLayout({ children }) {

  const supabase = await createClient(); 

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardShell> {children} </DashboardShell> ;
}