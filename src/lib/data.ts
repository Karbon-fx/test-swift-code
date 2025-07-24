
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
  bankname: string;
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
// Caching for performance
const countryCache: Country[] = [];
const banksCache: Map<string, Bank[]> = new Map();
const citiesCache: Map<string, string[]> = new Map();


async function fetchJson<T>(url: string): Promise<T> {
  // In Next.js, we need the full URL for server-side fetching.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  try {
    const response = await fetch(`${baseUrl}${url}`);
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
  if (countryCache.length > 0) return countryCache;

  const allSwiftData = await getSwiftData();
  const allCountries = await getCountryList();
  
  const uniqueCountryCodes = [...new Set(allSwiftData.map(record => record.country_iso_code2))];
  
  const countries = uniqueCountryCodes
    .map(code => ({
      code: code,
      name: allCountries[code] || code, // Fallback to code if name not found
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  countryCache.push(...countries);
  return countries;
};

export const getBanksForCountry = async (countryCode: string): Promise<Bank[]> => {
  if (!countryCode) return [];
  if (banksCache.has(countryCode)) {
    return banksCache.get(countryCode)!;
  }

  const allSwiftData = await getSwiftData();

  const bankNames = allSwiftData
    .filter(record => record.country_iso_code2 === countryCode && record.bankname)
    .map(record => {
        const bankName = record.bankname.split(/ - |,/)[0].trim();
        return bankName;
    })
    .filter(Boolean);

  const uniqueBankNames = [...new Set(bankNames)];

  const banks = uniqueBankNames
    .map(name => ({ name, countryCode }))
    .sort((a,b) => a.name.localeCompare(b.name));

  banksCache.set(countryCode, banks);
  return banks;
};


export const getCitiesForBank = async (countryCode: string, bankName: string): Promise<string[]> => {
  if (!countryCode || !bankName) return [];
  const cacheKey = `${countryCode}-${bankName}`;
  if (citiesCache.has(cacheKey)) {
    return citiesCache.get(cacheKey)!;
  }

  const allSwiftData = await getSwiftData();
  
  const cities = allSwiftData
    .filter(record => 
        record.country_iso_code2 === countryCode && 
        record.bankname &&
        record.bankname.toUpperCase().startsWith(bankName.toUpperCase()) &&
        record.city
    )
    .map(record => record.city);

  const uniqueCities = [...new Set(cities)].sort((a,b) => a.localeCompare(b));
  citiesCache.set(cacheKey, uniqueCities);
  return uniqueCities;
}

export const getBranchesForCity = async (countryCode: string, bankName: string, city: string): Promise<Branch[]> => {
  if (!countryCode || !bankName || !city) return [];
  const allSwiftData = await getSwiftData();
  const allCountries = await getCountryList();

  const filteredRecords = allSwiftData.filter(
    (record) =>
      record.country_iso_code2 === countryCode &&
      record.bankname &&
      record.bankname.toUpperCase().startsWith(bankName.toUpperCase()) &&
      record.city &&
      record.city.toUpperCase() === city.toUpperCase()
  );

  return filteredRecords.map(record => {
    const parts = record.bankname.split(/ - |,/);
    const mainBankName = parts[0]?.trim() || record.bankname;
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
