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
  Landmark,
  Building,
  MapPin,
  Globe,
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
        {result ? (
          <div className="flex-col items-start gap-4">
            <div
              className={`w-full flex items-center gap-3 p-4 rounded-md ${
                result.isValid
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {result.isValid ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <p className="text-sm font-medium">{result.message}</p>
            </div>

            {result.isValid && result.branch && (
              <Card className="w-full shadow-md mt-4">
                 <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    <span>{result.branch.branch || "Main Branch"}</span>
                  </CardTitle>
                  <CardDescription>{result.branch.bank}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between font-mono text-base bg-muted p-3 rounded-md">
                    <span className="font-semibold text-primary">{result.branch.swift_code}</span>
                     <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopy(result.branch!.swift_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-muted-foreground" />
                      <span>{result.branch.bank}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{result.branch.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span>{result.branch.country}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <SwiftCodeFormatCard />
        )}
      </CardContent>
    </>
  );
}