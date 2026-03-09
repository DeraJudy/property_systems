import { cn } from "@/lib/utils";

const statusStyles = {
  active: "bg-primary/10 text-primary border-primary/20",
  inactive: "bg-muted text-muted-foreground border-border",
  onboarding: "bg-warning/10 text-warning border-warning/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-primary/10 text-primary border-primary/20",
  declined: "bg-destructive/10 text-destructive border-destructive/20",
  new: "bg-info/10 text-info border-info/20",
  assigned: "bg-accent text-accent-foreground border-accent",
  "in progress": "bg-warning/10 text-warning border-warning/20",
  escalated: "bg-destructive/10 text-destructive border-destructive/20",
  resolved: "bg-primary/10 text-primary border-primary/20",
  posted: "bg-primary/10 text-primary border-primary/20",
  staged: "bg-warning/10 text-warning border-warning/20",
  unmatched: "bg-destructive/10 text-destructive border-destructive/20",
  low: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  compliant: "bg-primary/10 text-primary border-primary/20",
  "non-compliant": "bg-destructive/10 text-destructive border-destructive/20",
  expiring: "bg-warning/10 text-warning border-warning/20",
  decommissioning: "bg-warning/10 text-warning border-warning/20",
  employed: "bg-primary/10 text-primary border-primary/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  "on leave": "bg-warning/10 text-warning border-warning/20",
  open: "bg-info/10 text-info border-info/20",
  closed: "bg-muted text-muted-foreground border-border",
  draft: "bg-muted text-muted-foreground border-border",
  published: "bg-primary/10 text-primary border-primary/20",
  archived: "bg-muted text-muted-foreground border-border",
};

const StatusBadge = ({ status, className }) => {
  const key = status.toLowerCase();
  const style = statusStyles[key] || "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
