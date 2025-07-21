
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Copy,
  Info,
} from "lucide-react";
import { swiftLookup, type SwiftLookupOutput } from "@/ai/flows/swift-lookup-flow";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  swiftCode: z
    .string()
    .trim()
    .min(1, "SWIFT code is required.")
    .refine((value) => /^[A-Z0-9]{8,11}$/.test(value.toUpperCase()), {
      message: "SWIFT code must be 8 or 11 characters and contain only uppercase letters and numbers.",
    }),
});

type ValidationResult = {
  isValid: boolean;
  message: string;
  branch?: SwiftLookupOutput;
};

function SwiftCodeFormatCard() {
  return (
    <Card className="bg-muted border-none shadow-none mt-4">
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-foreground mb-4">SWIFT code format</p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-mono text-sm text-foreground">AAAA</p>
            <p className="text-xs text-muted-foreground mt-1">Bank code</p>
          </div>
          <div>
            <p className="font-mono text-sm text-foreground">BB</p>
            <p className="text-xs text-muted-foreground mt-1">Country code</p>
          </div>
          <div>
            <p className="font-mono text-sm text-foreground">YY</p>
            <p className="text-xs text-muted-foreground mt-1">Location code</p>
          </div>
          <div>
            <p className="font-mono text-sm text-foreground">XXX</p>
            <p className="text-xs text-muted-foreground mt-1">Branch code</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export function CheckSwiftCodeFormContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      swiftCode: "",
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The SWIFT code has been copied.",
    });
  };

  const handleSearchAgain = () => {
    setResult(null);
    form.reset();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const branchDetails = await swiftLookup(values.swiftCode.toUpperCase());

      if (branchDetails) {
        setResult({
          isValid: true,
          message: "This SWIFT code is valid and found.",
          branch: branchDetails,
        });
      } else {
        setResult({
          isValid: false,
          message: "SWIFT code has a valid format, but was not found.",
        });
      }
    } catch (error) {
       console.error("Failed to check SWIFT code:", error);
       setResult({
        isValid: false,
        message: "An error occurred while checking the code. Please try again.",
      });
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to the lookup service.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (result?.isValid && result.branch) {
    const branch = result.branch;
    return (
      <div className="p-6 pt-0">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">SWIFT Code</p>
            <div className="flex items-center justify-between bg-muted p-3 rounded-md mt-1">
              <p className="text-2xl font-bold text-primary">{branch.swift_code.toUpperCase()}</p>
              <Button variant="outline" size="sm" onClick={() => handleCopy(branch.swift_code)} className="text-[#727272]">
                <Copy className="mr-2" />
                Copy Code
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bank Branch Name</p>
            <p className="font-semibold mt-1 text-[#212121]">{`${branch.bank.toUpperCase()} - ${(branch.branch || "Main Branch").toUpperCase()}`}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">City</p>
            <p className="font-semibold mt-1 text-[#212121]">{branch.city.toUpperCase()}</p>
          </div>
           <div>
            <p className="text-sm text-muted-foreground">Country</p>
            <p className="font-semibold mt-1 text-[#212121]">{branch.country.toUpperCase()}</p>
          </div>
        </div>
        <CardFooter className="px-0 pt-6 pb-0">
          <div className="flex flex-col w-full gap-4">
             <Button variant="outline" onClick={handleSearchAgain} className="w-full text-[#5E5E5E]">
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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="swiftCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SWIFT Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., CHASUS33ARP"
                      {...field}
                      autoCapitalize="characters"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Check SWIFT code
            </Button>
          </CardFooter>
        </form>
      </Form>

      <CardContent>
        {result && !result.isValid && (
          <div
            className={`w-full flex items-center gap-3 p-4 rounded-md bg-red-100 text-red-800`}
          >
            <XCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{result.message}</p>
          </div>
        )}
        {!result && <SwiftCodeFormatCard />}
      </CardContent>
      <CardFooter className="pb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>
              We respect your privacy. Your bank details are neither stored
              nor viewed by us.
            </p>
          </div>
        </CardFooter>
    </>
  );
}
