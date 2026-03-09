
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, RefreshCw, Plus } from "lucide-react";

const DataTableHeader = ({
  title,
  subtitle,
  searchPlaceholder = "Search...",
  onAdd,
  addLabel = "Add New",
  filters = [],
  showExport = true,
  showRefresh = true,
}) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {showRefresh && (
          <Button variant="outline" size="icon" className="shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        {showExport && (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />Export
          </Button>
        )}
        {/* {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />{addLabel}
          </Button>
        )} */}
      </div>
    </div>
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={searchPlaceholder} className="pl-9" />
      </div>
      {filters.map((f, i) => (
        <Select key={i} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[160px]">
            {i === 0 && <Filter className="mr-2 h-4 w-4" />}
            <SelectValue placeholder={f.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {f.label}</SelectItem>
            {f.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  </div>
);

export default DataTableHeader;
