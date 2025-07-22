"use client";

import { useState } from "react";
import type { Branch } from "@/lib/data";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Copy, Info } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";

interface BranchListProps {
  branches: Branch[];
  onSearchAgain: () => void;
}

export function BranchList({ branches, onSearchAgain }: BranchListProps) {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The SWIFT code has been copied.",
    });
  };

  if (selectedBranch) {
     return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">SWIFT Code</p>
          <div className="flex items-center justify-between bg-[#F1F5F9] p-3 rounded-md mt-1">
            <p className="text-2xl font-bold text-primary">{selectedBranch.swiftCode.toUpperCase()}</p>
            <Button variant="outline" size="sm" onClick={() => handleCopy(selectedBranch.swiftCode)} className="text-[#727272]">
              <Copy className="mr-2" />
              Copy Code
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Bank Branch Name</p>
          <p className="font-semibold mt-1 text-[#212121]">{`${selectedBranch.bankName.toUpperCase()} - ${(selectedBranch.branch || "Main Branch").toUpperCase()}`}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">City</p>
          <p className="font-semibold mt-1 text-[#212121]">{selectedBranch.city.toUpperCase()}</p>
        </div>
         <div>
          <p className="text-sm text-muted-foreground">Country</p>
          <p className="font-semibold mt-1 text-[#212121]">{selectedBranch.countryName.toUpperCase()}</p>
        </div>
        <CardFooter className="px-0 pt-6 pb-6">
          <div className="flex flex-col w-full gap-4">
             <Button variant="outline" onClick={onSearchAgain} className="w-full text-[#5E5E5E] bg-white">
               Search Again
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4" />
              <p>
                We respect your privacy. Your bank details are neither stored
                nor viewed by us.
              </p>
            </div>
          </div>
        </CardFooter>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8 py-10 border border-dashed rounded-lg">
        <p>No branches found for the selected criteria.</p>
        <p className="text-sm">Please try a different city or bank.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Select Bank Branch</h2>
      {branches.map((branch) => (
        <Card 
          key={branch.swiftCode} 
          className="shadow-sm transition-shadow hover:shadow-lg cursor-pointer bg-slate-100"
          onClick={() => setSelectedBranch(branch)}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">{branch.swiftCode}</p>
              <p className="text-sm text-muted-foreground mt-1">{branch.address}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
