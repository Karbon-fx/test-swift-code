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
import { Loader2, CheckCircle, XCircle } from "lucide-react";

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
};

export function CheckSwiftCodeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      swiftCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    // Simulate API call for validation
    setTimeout(() => {
      // In a real app, you would make an API call to a validation service.
      // Here, we just check the format again.
      const isValid =
        (values.swiftCode.length === 8 || values.swiftCode.length === 11) &&
        /^[A-Z0-9]{8,11}$/.test(values.swiftCode);

      setResult({
        isValid,
        message: isValid
          ? "This SWIFT code has a valid format."
          : "This SWIFT code has an invalid format.",
      });
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Check SWIFT Code</CardTitle>
        <CardDescription>
          Enter a SWIFT/BIC code to check its validity.
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
        <CardFooter>
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
        </CardFooter>
      )}
    </Card>
  );
}
