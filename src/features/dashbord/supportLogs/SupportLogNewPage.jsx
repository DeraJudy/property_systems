import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Paperclip } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const SupportLogNewPage = () => (
  <DashboardLayout>
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={item} className="flex items-center gap-4">
        <Link to="/dashboard/support-logs"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent"><FileText className="h-5 w-5 text-accent-foreground" /></div>
        <div><h1 className="text-2xl font-bold text-foreground">New Support Log</h1><p className="text-sm text-muted-foreground">Record a support session</p></div>
      </motion.div>
      <motion.div variants={item}>
        <Card className="shadow-card p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Service User</Label><Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select resident" /></SelectTrigger><SelectContent><SelectItem value="1">James Smith</SelectItem><SelectItem value="2">Mary Johnson</SelectItem><SelectItem value="3">Robert Williams</SelectItem></SelectContent></Select></div>
            <div><Label>Staff Member</Label><Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select staff" /></SelectTrigger><SelectContent><SelectItem value="sarah">Sarah Mitchell</SelectItem><SelectItem value="john">John Davies</SelectItem></SelectContent></Select></div>
            <div><Label>Session Type</Label><Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="1to1">1:1 Session</SelectItem><SelectItem value="welfare">Welfare Check</SelectItem><SelectItem value="risk">Risk Assessment</SelectItem><SelectItem value="moveout">Move-Out Preparation</SelectItem><SelectItem value="incident">Incident Report</SelectItem></SelectContent></Select></div>
            <div><Label>Session Date</Label><Input className="mt-1" type="date" /></div>
            <div><Label>Risk Level</Label><Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
            <div className="flex items-end gap-2 pb-1"><Checkbox id="followup" /><Label htmlFor="followup" className="text-sm">Follow-up required</Label></div>
          </div>
          <div><Label>Session Notes</Label><Textarea className="mt-1" rows={5} placeholder="Record session details..." /></div>
          <div><Label>Attachments</Label><div className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground cursor-pointer hover:bg-accent/30 transition-colors"><Paperclip className="h-4 w-4" /> Drop files here or click to upload</div></div>
          <div><Label>Digital Signature</Label><div className="mt-1 flex items-center justify-center rounded-lg border border-dashed border-border p-6 h-24 text-sm text-muted-foreground">Tap or click to sign</div></div>
          <div className="flex gap-3 pt-2"><Button>Save Log</Button><Link to="/dashboard/support-logs"><Button variant="outline">Cancel</Button></Link></div>
        </Card>
      </motion.div>
    </motion.div>
  </DashboardLayout>
);

export default SupportLogNewPage;
