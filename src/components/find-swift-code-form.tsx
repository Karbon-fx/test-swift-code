
"use client";

import { useState, useEffect } from "react";
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
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Info, Loader2 } from "lucide-react";
import { getCountries, getBanksForCountry, getCitiesForBank, getBranchesForCity, type Country, type Bank, type Branch } from "@/lib/data";
import { BranchList } from "./branch-list";
import { ScrollArea } from "./ui/scroll-area";

const formSchema = z.object({
  country: z.string().min(1, "Please select a country."),
  bank: z.string().min(1, "Please select a bank."),
  city: z.string().min(1, "Please select a city."),
});

export function FindSwiftCodeFormContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[] | null>(null);

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
    async function loadCountries() {
        setIsLoading(true);
        try {
            const countryList = await getCountries();
            setCountries(countryList);
        } catch (error) {
            console.error("Failed to load countries", error);
        } finally {
            setIsLoading(false);
        }
    }
    loadCountries();
  }, []);

  useEffect(() => {
    form.resetField("bank", { keepError: false });
    form.resetField("city", { keepError: false });
    setBanks([]);
    setCities([]);

    if (selectedCountry) {
        async function loadBanks() {
            setIsLoading(true);
            try {
                const countryBanks = await getBanksForCountry(selectedCountry);
                setBanks(countryBanks);
            } catch (error) {
                console.error("Failed to load banks", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadBanks();
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    form.resetField("city", { keepError: false });
    setCities([]);
    if (selectedCountry && selectedBank) {
        async function loadCities() {
            setIsLoading(true);
            try {
                const bankCities = await getCitiesForBank(selectedCountry, selectedBank);
                setCities(bankCities);
            } catch (error) {
                console.error("Failed to load cities", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadCities();
    }
  }, [selectedCountry, selectedBank, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setBranches(null);
    try {
        const foundBranches = await getBranchesForCity(
            values.country,
            values.bank,
            values.city
        );
        setBranches(foundBranches);
    } catch (error) {
        console.error("Failed to find branches", error);
    } finally {
        setIsLoading(false);
    }
  }

  const handleSearchAgain = () => {
    setBranches(null);
    form.reset();
  };

  return (
    <div>
      {branches ? (
         <div className="p-6 pt-0">
          <BranchList branches={branches} onSearchAgain={handleSearchAgain} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={countries.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="max-h-72 w-full">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry || banks.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={!selectedCountry ? "Select a country first" : (banks.length === 0 ? "No banks found" : "Select a bank")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         <ScrollArea className="max-h-72 w-full">
                          {banks.map((bank) => (
                            <SelectItem key={bank.name} value={bank.name}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBank || cities.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={!selectedBank ? "Select a bank first" : (cities.length === 0 ? "No cities found" : "Select a city")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="max-h-72 w-full">
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </ScrollArea>
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
