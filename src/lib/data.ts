export interface Country {
  code: string;
  name: string;
}

export interface Bank {
  id: string;
  name: string;
  countryCode: string;
  cities: string[];
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

const countries: Country[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
];

const banks: Bank[] = [
  // US Banks
  { id: "boaa", name: "Bank of America", countryCode: "US", cities: ["New York", "Los Angeles"] },
  { id: "citi", name: "Citibank", countryCode: "US", cities: ["New York", "Chicago"] },
  { id: "jpmc", name: "JPMorgan Chase", countryCode: "US", cities: ["New York", "Houston"] },
  // Canadian Banks
  { id: "rbc", name: "Royal Bank of Canada", countryCode: "CA", cities: ["Toronto", "Vancouver"] },
  { id: "td", name: "Toronto-Dominion Bank", countryCode: "CA", cities: ["Toronto", "Montreal"] },
  // German Banks
  { id: "db", name: "Deutsche Bank", countryCode: "DE", cities: ["Frankfurt", "Berlin"] },
  { id: "cb", name: "Commerzbank", countryCode: "DE", cities: ["Frankfurt", "Hamburg"] },
];

const branches: Branch[] = [
    // Bank of America branches
    { swiftCode: "BOFAUS3N", bankName: "Bank of America", bankId: "boaa", branch: "Main Branch", city: "New York", countryCode: "US", countryName: "United States", address: "123 Wall Street, New York, NY" },
    { swiftCode: "BOFAUS6S", bankName: "Bank of America", bankId: "boaa", branch: "Downtown Branch", city: "Los Angeles", countryCode: "US", countryName: "United States", address: "456 Hollywood Blvd, Los Angeles, CA" },
    // Citibank branches
    { swiftCode: "CITIUS33", bankName: "Citibank", bankId: "citi", branch: "Head Office", city: "New York", countryCode: "US", countryName: "United States", address: "789 Park Avenue, New York, NY" },
    { swiftCode: "CITIUS33CHI", bankName: "Citibank", bankId: "citi", branch: "Windy City Branch", city: "Chicago", countryCode: "US", countryName: "United States", address: "101 Michigan Ave, Chicago, IL" },
    // JPMorgan Chase branches
    { swiftCode: "CHASUS33", bankName: "JPMorgan Chase", bankId: "jpmc", branch: "Investment Banking", city: "New York", countryCode: "US", countryName: "United States", address: "270 Park Avenue, New York, NY" },
    { swiftCode: "CHASUS33HOU", bankName: "JPMorgan Chase", bankId: "jpmc", branch: "Texas Central", city: "Houston", countryCode: "US", countryName: "United States", address: "712 Main St, Houston, TX" },
    // Royal Bank of Canada branches
    { swiftCode: "ROYCCAT2", bankName: "Royal Bank of Canada", bankId: "rbc", branch: "Toronto Main", city: "Toronto", countryCode: "CA", countryName: "Canada", address: "200 Bay Street, Toronto, ON" },
    { swiftCode: "ROYCCAT2VAN", bankName: "Royal Bank of Canada", bankId: "rbc", branch: "Pacific Central", city: "Vancouver", countryCode: "CA", countryName: "Canada", address: "1055 West Georgia St, Vancouver, BC" },
    // Toronto-Dominion Bank branches
    { swiftCode: "TDOMCATT", bankName: "Toronto-Dominion Bank", bankId: "td", branch: "TD Centre", city: "Toronto", countryCode: "CA", countryName: "Canada", address: "55 King Street West, Toronto, ON" },
    { swiftCode: "TDOMCATTMTL", bankName: "Toronto-Dominion Bank", bankId: "td", branch: "Place Ville Marie", city: "Montreal", countryCode: "CA", countryName: "Canada", address: "1 Place Ville Marie, Montreal, QC" },
    // Deutsche Bank branches
    { swiftCode: "DEUTDEFF", bankName: "Deutsche Bank", bankId: "db", branch: "Frankfurt Head Office", city: "Frankfurt", countryCode: "DE", countryName: "Germany", address: "Taunusanlage 12, Frankfurt am Main" },
    { swiftCode: "DEUTDEBB", bankName: "Deutsche Bank", bankId: "db", branch: "Berlin Branch", city: "Berlin", countryCode: "DE", countryName: "Germany", address: "Unter den Linden 13/15, Berlin" },
    // Commerzbank branches
    { swiftCode: "COBADEFF", bankName: "Commerzbank", bankId: "cb", branch: "Kaiserplatz", city: "Frankfurt", countryCode: "DE", countryName: "Germany", address: "Kaiserplatz, Frankfurt am Main" },
    { swiftCode: "COBADEHH", bankName: "Commerzbank", bankId: "cb", branch: "Hamburg Branch", city: "Hamburg", countryCode: "DE", countryName: "Germany", address: "Ness 7-9, Hamburg" },
];


export const getCountries = (): Country[] => countries;

export const getBanksForCountry = (countryCode: string): Bank[] => {
  return banks.filter((bank) => bank.countryCode === countryCode);
};

export const getBranchesForCity = (bankId: string, city: string): Branch[] => {
  return branches.filter(
    (branch) => branch.bankId === bankId && branch.city === city
  );
};
