
"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Info, Loader2 } from "lucide-react";
import { getCountries, getBanksForCountry, getBranchesForCity, Bank, Branch } from "@/lib/data";
import { BranchList } from "./branch-list";

const formSchema = z.object({
  country: z.string().min(1, "Please select a country."),
  bank: z.string().min(1, "Please select a bank."),
  city: z.string().min(1, "Please select a city."),
});

export function FindSwiftCodeFormContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[] | null>(null);

  const countries = useMemo(() => getCountries(), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      bank: "",
      city: "",
    },
  });

  const selectedCountry = form.watch("country");
  const selectedBank = form.watch("bank");

  useEffect(() => {
    form.resetField("bank", { keepError: false });
    form.resetField("city", { keepError: false });
    if (selectedCountry) {
      const countryBanks = getBanksForCountry(selectedCountry);
      setBanks(countryBanks);
      setCities([]);
    } else {
      setBanks([]);
      setCities([]);
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    form.resetField("city", { keepError: false });
     if (selectedBank && selectedCountry) {
        const bankData = banks.find(b => b.id === selectedBank);
        if (bankData) {
            setCities(bankData.cities);
        } else {
            setCities([]);
        }
    } else {
        setCities([]);
    }
  }, [selectedBank, selectedCountry, banks, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setBranches(null);
    // Simulate API call
    setTimeout(() => {
      const foundBranches = getBranchesForCity(
        values.bank,
        values.city
      );
      setBranches(foundBranches);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div>
      {branches ? (
         <div className="p-6">
          <BranchList branches={branches} />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBank}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 pb-6 pt-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Find SWIFT code
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <Info className="h-4 w-4" />
                <p>
                  We respect your privacy. Your bank details are neither stored
                  nor viewed by us.
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      )}
    </div>
  );
}
