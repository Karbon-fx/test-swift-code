
export interface Country {
  code: string;
  name: string;
}

// Represents a unique bank within a country
export interface Bank {
  name: string;
  countryCode: string;
}

// Represents a full record from swift-data.json
export interface SwiftRecord {
  country_iso_code2: string;
  bank_name_with_branch: string;
  city: string;
  bic: string;
}

// Represents the data structure for the branch list
export interface Branch {
  swiftCode: string;
  bankName: string; // The bank name part
  branch: string; // The branch part
  address: string; // Combination of bank and city for display
  city: string;
  countryName: string;
}


let countryList: Record<string, string> | null = null;
let swiftData: SwiftRecord[] | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  // In Next.js, we need the full URL for server-side fetching.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      cache: 'force-cache', // Cache the large JSON files
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

const getCountryList = async (): Promise<Record<string, string>> => {
    if (countryList) {
        return countryList;
    }
    countryList = await fetchJson<Record<string, string>>('/country-names.json');
    return countryList;
}

const getSwiftData = async (): Promise<SwiftRecord[]> => {
    if (swiftData) {
        return swiftData;
    }
    swiftData = await fetchJson<SwiftRecord[]>('/swift-data.json');
    return swiftData;
}


export const getCountries = async (): Promise<Country[]> => {
  const allSwiftData = await getSwiftData();
  const allCountries = await getCountryList();
  
  const uniqueCountryCodes = [...new Set(allSwiftData.map(record => record.country_iso_code2))];
  
  const countries = uniqueCountryCodes
    .map(code => ({
      code: code,
      name: allCountries[code] || code, // Fallback to code if name not found
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
    
  return countries;
};

export const getBanksForCountry = async (countryCode: string): Promise<Bank[]> => {
  if (!countryCode) return [];
  const allSwiftData = await getSwiftData();

  const banksForCountry = allSwiftData.filter(
    record => record.country_iso_code2 === countryCode
  );
  
  // Extract the main bank name before the first hyphen or comma, assuming that's the separator
  const uniqueBankNames = [...new Set(banksForCountry.map(record => {
      const bankName = record.bank_name_with_branch.split(/ - |,/)[0].trim();
      return bankName;
  }))];

  return uniqueBankNames
    .map(name => ({ name, countryCode }))
    .sort((a,b) => a.name.localeCompare(b.name));
};


export const getCitiesForBank = async (countryCode: string, bankName: string): Promise<string[]> => {
  if (!countryCode || !bankName) return [];
  const allSwiftData = await getSwiftData();
  
  const cities = allSwiftData
    .filter(record => 
        record.country_iso_code2 === countryCode && 
        record.bank_name_with_branch.toUpperCase().startsWith(bankName.toUpperCase())
    )
    .map(record => record.city);

  return [...new Set(cities)].sort((a,b) => a.localeCompare(b));
}

export const getBranchesForCity = async (countryCode: string, bankName: string, city: string): Promise<Branch[]> => {
  if (!countryCode || !bankName || !city) return [];
  const allSwiftData = await getSwiftData();
  const allCountries = await getCountryList();

  const filteredRecords = allSwiftData.filter(
    (record) =>
      record.country_iso_code2 === countryCode &&
      record.bank_name_with_branch.toUpperCase().startsWith(bankName.toUpperCase()) &&
      record.city.toUpperCase() === city.toUpperCase()
  );

  return filteredRecords.map(record => {
    // Attempt to split bank name and branch
    const parts = record.bank_name_with_branch.split(/ - |,/);
    const mainBankName = parts[0]?.trim() || record.bank_name_with_branch;
    const branchName = parts.length > 1 ? parts.slice(1).join(', ').trim() : 'Main Branch';
    
    return {
        swiftCode: record.bic,
        bankName: mainBankName,
        branch: branchName,
        address: `${mainBankName}, ${record.city}`,
        city: record.city,
        countryName: allCountries[record.country_iso_code2] || record.country_iso_code2,
    };
  });
};
