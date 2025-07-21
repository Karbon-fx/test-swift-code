'use server';
/**
 * @fileOverview A utility for looking up SWIFT code information using the APIVerse API.
 * 
 * - swiftLookup - A function that handles the SWIFT code lookup process.
 * - SwiftLookupInput - The input type for the swiftLookup function.
 * - SwiftLookupOutput - The return type for the swiftLookup function.
 */

import { z } from 'zod';

// Define the schema for the bank details from the API response
const BankSchema = z.object({
  bank: z.string(),
  city: z.string(),
  branch: z.string().nullable(),
  swift_code: z.string(),
  country: z.string(),
  country_code: z.string(),
});

// Define the schema for the data part of the API response
const ApiVerseDataSchema = z.object({
    count: z.number(),
    banks: z.array(BankSchema)
});

// Define the schema for the full API response
const ApiVerseResponseSchema = z.object({
  status: z.string(),
  error: z.any().nullable(),
  data: ApiVerseDataSchema.nullable(),
});

export type SwiftLookupInput = string;
export type SwiftLookupOutput = z.infer<typeof BankSchema> | null;

// The main exported function that the UI will call
export async function swiftLookup(swiftCode: SwiftLookupInput): Promise<SwiftLookupOutput> {
    // It's best practice to store API keys in environment variables
    const apiKey = process.env.APIVERSE_API_KEY;
    if (!apiKey) {
      console.error("APIVERSE_API_KEY is not set in environment variables.");
      throw new Error("API key is not configured.");
    }
    
    const url = `https://api.apiverve.com/v1/swiftlookup?swift=${swiftCode}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorText = await response.text();
        console.error(`API call failed with status ${response.status}: ${errorText}`);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      const parsedResult = ApiVerseResponseSchema.safeParse(result);
      
      if (!parsedResult.success) {
        console.error("Failed to parse API response:", parsedResult.error);
        return null;
      }
      
      const { data } = parsedResult.data;

      if (data && data.banks && data.banks.length > 0) {
        return data.banks[0]; // Return the first bank found
      }
      
      return null; // No bank found

    } catch (error) {
      console.error("Error during SWIFT lookup:", error);
      // In case of any other error (e.g., network issues), we return null
      return null;
    }
}
