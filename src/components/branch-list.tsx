"use client";

import type { Branch } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Landmark, Building, MapPin, Globe } from "lucide-react";

interface BranchListProps {
  branches: Branch[];
}

export function BranchList({ branches }: BranchListProps) {
  if (branches.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8 py-10 border border-dashed rounded-lg">
        <p>No branches found for the selected criteria.</p>
        <p className="text-sm">Please try a different city or bank.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold tracking-tight">Branches Found</h2>
      {branches.map((branch) => (
        <Card key={branch.swiftCode} className="shadow-md transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              <span>{branch.branch}</span>
            </CardTitle>
            <CardDescription>{branch.address}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="font-mono text-base bg-muted p-3 rounded-md text-center">
              <span className="font-semibold text-primary">{branch.swiftCode}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-muted-foreground" />
                <span>{branch.bankName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{branch.city}</span>
              </div>
               <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span>{branch.countryName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
