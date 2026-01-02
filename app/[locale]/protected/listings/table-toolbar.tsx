"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusFilter } from "@/lib/types/database";

import { Plus, X } from "lucide-react";

interface TableToolbarProps {
  total: number;
  search: string;
  status: StatusFilter | "all";
  featured: "all" | "true" | "false";
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onFeaturedChange: (v: "all" | "true" | "false") => void;
  onReset: () => void;
}
export function TableToolbar({
  total,
  search,
  status,
  featured,
  onSearchChange,
  onStatusChange,
  onFeaturedChange,
  onReset,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          Listings
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({total})
          </span>
        </h2>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search code or title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 min-w-[280px] sm:w-full md:w-[280px] xl:w-[360px]"
        />
        {/* status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* feature */}
        <Select value={featured} onValueChange={onFeaturedChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">On</SelectItem>
            <SelectItem value="false">Off</SelectItem>
          </SelectContent>
        </Select>

        {(search || status !== "all") && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button size="sm" className="h-9 gap-1">
          <Plus className="h-4 w-4" />
          New Listing
        </Button>
      </div>
    </div>
  );
}
