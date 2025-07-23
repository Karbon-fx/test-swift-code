
export interface Country {
  code: string;
  name: string;
}

export interface Bank {
  id: string;
  name: string;
  countryCode: string;
}

export interface Branch {
  swiftCode: string;
  bankName: string;
  bankId: string;
  branch: string;
  city: string;
  countryCode: string;
  countryName: string;
  address: string;
}

let countries: Country[] | null = null;
let branches: Branch[] | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  // In Next.js, we need the full URL for server-side fetching.
  // We can use an environment variable for the base URL.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const response = await fetch(`${baseUrl}${url}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

export const getCountries = async (): Promise<Country[]> => {
  if (countries) {
    return countries;
  }
  const countryData = await fetchJson<Record<string, string>>('/country-names.json');
  countries = Object.entries(countryData).map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name));
  return countries;
};

const getAllBranches = async (): Promise<Branch[]> => {
    if (branches) {
        return branches;
    }
    branches = await fetchJson<Branch[]>('/swift-data.json');
    return branches;
}

export const getBanksForCountry = async (countryCode: string): Promise<Bank[]> => {
  const allBranches = await getAllBranches();
  const banksForCountry = allBranches.filter(branch => branch.countryCode === countryCode);
  
  const uniqueBanks = Array.from(new Map(banksForCountry.map(branch => [branch.bankId, {
    id: branch.bankId,
    name: branch.bankName,
    countryCode: branch.countryCode,
  }])).values());

  return uniqueBanks.sort((a,b) => a.name.localeCompare(b.name));
};

export const getCitiesForBank = async (bankId: string): Promise<string[]> => {
    const allBranches = await getAllBranches();
    const branchesForBank = allBranches.filter(branch => branch.bankId === bankId);
    const uniqueCities = [...new Set(branchesForBank.map(branch => branch.city))];
    return uniqueCities.sort((a,b) => a.localeCompare(b));
}

export const getBranchesForCity = async (bankId: string, city: string): Promise<Branch[]> => {
  const allBranches = await getAllBranches();
  return allBranches.filter(
    (branch) => branch.bankId === bankId && branch.city === city
  );
};

export const getBranchBySwiftCode = async (swiftCode: string): Promise<Branch | undefined> => {
  const allBranches = await getAllBranches();
  return allBranches.find(
    (branch) => branch.swiftCode.toUpperCase() === swiftCode.toUpperCase()
  );
};
