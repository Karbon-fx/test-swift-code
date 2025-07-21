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
import { getBranchBySwiftCode, Branch } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  swiftCode: z
    .string()
    .trim()
    .refine((value) => value.length === 8 || value.length === 11, {
      message: "SWIFT code must be 8 or 11 characters long.",
    })
    .refine((value) => /^[A-Z0-9]{8,11}$/.test(value), {
      message: "SWIFT code must contain only uppercase letters and numbers.",
    }),
});

type ValidationResult = {
  isValid: boolean;
  message: string;
  branch?: Branch;
};

export function CheckSwiftCodeForm() {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      const branch = getBranchBySwiftCode(values.swiftCode);

      if (branch) {
        setResult({
          isValid: true,
          message: "This SWIFT code is valid and found in our database.",
          branch: branch,
        });
      } else {
        setResult({
          isValid: false,
          message: "SWIFT code has a valid format, but was not found.",
        });
      }
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Check SWIFT Code</CardTitle>
        <CardDescription>
          Enter a SWIFT/BIC code to check its validity and get details.
        </CardDescription>
      </CardHeader>
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
                      placeholder="e.g., CITIUS33"
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
              Check Code
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardFooter className="flex-col items-start gap-4">
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
            <Card className="w-full shadow-md">
               <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  <span>{result.branch.branch}</span>
                </CardTitle>
                <CardDescription>{result.branch.address}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between font-mono text-base bg-muted p-3 rounded-md">
                  <span className="font-semibold text-primary">{result.branch.swiftCode}</span>
                   <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(result.branch!.swiftCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-muted-foreground" />
                    <span>{result.branch.bankName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{result.branch.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>{result.branch.countryName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
