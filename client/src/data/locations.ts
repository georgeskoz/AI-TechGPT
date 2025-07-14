export interface Country {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
  country: string;
}

export interface City {
  name: string;
  province: string;
  country: string;
}

export const countries: Country[] = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" }
];

export const provinces: Province[] = [
  // Canadian Provinces and Territories
  { code: "AB", name: "Alberta", country: "CA" },
  { code: "BC", name: "British Columbia", country: "CA" },
  { code: "MB", name: "Manitoba", country: "CA" },
  { code: "NB", name: "New Brunswick", country: "CA" },
  { code: "NL", name: "Newfoundland and Labrador", country: "CA" },
  { code: "NS", name: "Nova Scotia", country: "CA" },
  { code: "ON", name: "Ontario", country: "CA" },
  { code: "PE", name: "Prince Edward Island", country: "CA" },
  { code: "QC", name: "Quebec", country: "CA" },
  { code: "SK", name: "Saskatchewan", country: "CA" },
  { code: "NT", name: "Northwest Territories", country: "CA" },
  { code: "NU", name: "Nunavut", country: "CA" },
  { code: "YT", name: "Yukon", country: "CA" },
  
  // US States
  { code: "AL", name: "Alabama", country: "US" },
  { code: "AK", name: "Alaska", country: "US" },
  { code: "AZ", name: "Arizona", country: "US" },
  { code: "AR", name: "Arkansas", country: "US" },
  { code: "CA", name: "California", country: "US" },
  { code: "CO", name: "Colorado", country: "US" },
  { code: "CT", name: "Connecticut", country: "US" },
  { code: "DE", name: "Delaware", country: "US" },
  { code: "FL", name: "Florida", country: "US" },
  { code: "GA", name: "Georgia", country: "US" },
  { code: "HI", name: "Hawaii", country: "US" },
  { code: "ID", name: "Idaho", country: "US" },
  { code: "IL", name: "Illinois", country: "US" },
  { code: "IN", name: "Indiana", country: "US" },
  { code: "IA", name: "Iowa", country: "US" },
  { code: "KS", name: "Kansas", country: "US" },
  { code: "KY", name: "Kentucky", country: "US" },
  { code: "LA", name: "Louisiana", country: "US" },
  { code: "ME", name: "Maine", country: "US" },
  { code: "MD", name: "Maryland", country: "US" },
  { code: "MA", name: "Massachusetts", country: "US" },
  { code: "MI", name: "Michigan", country: "US" },
  { code: "MN", name: "Minnesota", country: "US" },
  { code: "MS", name: "Mississippi", country: "US" },
  { code: "MO", name: "Missouri", country: "US" },
  { code: "MT", name: "Montana", country: "US" },
  { code: "NE", name: "Nebraska", country: "US" },
  { code: "NV", name: "Nevada", country: "US" },
  { code: "NH", name: "New Hampshire", country: "US" },
  { code: "NJ", name: "New Jersey", country: "US" },
  { code: "NM", name: "New Mexico", country: "US" },
  { code: "NY", name: "New York", country: "US" },
  { code: "NC", name: "North Carolina", country: "US" },
  { code: "ND", name: "North Dakota", country: "US" },
  { code: "OH", name: "Ohio", country: "US" },
  { code: "OK", name: "Oklahoma", country: "US" },
  { code: "OR", name: "Oregon", country: "US" },
  { code: "PA", name: "Pennsylvania", country: "US" },
  { code: "RI", name: "Rhode Island", country: "US" },
  { code: "SC", name: "South Carolina", country: "US" },
  { code: "SD", name: "South Dakota", country: "US" },
  { code: "TN", name: "Tennessee", country: "US" },
  { code: "TX", name: "Texas", country: "US" },
  { code: "UT", name: "Utah", country: "US" },
  { code: "VT", name: "Vermont", country: "US" },
  { code: "VA", name: "Virginia", country: "US" },
  { code: "WA", name: "Washington", country: "US" },
  { code: "WV", name: "West Virginia", country: "US" },
  { code: "WI", name: "Wisconsin", country: "US" },
  { code: "WY", name: "Wyoming", country: "US" },
  { code: "DC", name: "District of Columbia", country: "US" }
];

export const cities: City[] = [
  // Major Canadian Cities
  { name: "Toronto", province: "ON", country: "CA" },
  { name: "Montreal", province: "QC", country: "CA" },
  { name: "Vancouver", province: "BC", country: "CA" },
  { name: "Calgary", province: "AB", country: "CA" },
  { name: "Edmonton", province: "AB", country: "CA" },
  { name: "Ottawa", province: "ON", country: "CA" },
  { name: "Winnipeg", province: "MB", country: "CA" },
  { name: "Quebec City", province: "QC", country: "CA" },
  { name: "Hamilton", province: "ON", country: "CA" },
  { name: "Kitchener", province: "ON", country: "CA" },
  { name: "London", province: "ON", country: "CA" },
  { name: "Victoria", province: "BC", country: "CA" },
  { name: "Halifax", province: "NS", country: "CA" },
  { name: "Oshawa", province: "ON", country: "CA" },
  { name: "Windsor", province: "ON", country: "CA" },
  { name: "Saskatoon", province: "SK", country: "CA" },
  { name: "St. Catharines", province: "ON", country: "CA" },
  { name: "Regina", province: "SK", country: "CA" },
  { name: "Sherbrooke", province: "QC", country: "CA" },
  { name: "Kelowna", province: "BC", country: "CA" },
  { name: "Barrie", province: "ON", country: "CA" },
  { name: "Guelph", province: "ON", country: "CA" },
  { name: "Kanata", province: "ON", country: "CA" },
  { name: "Abbotsford", province: "BC", country: "CA" },
  { name: "Trois-Rivières", province: "QC", country: "CA" },
  { name: "Kingston", province: "ON", country: "CA" },
  { name: "Milton", province: "ON", country: "CA" },
  { name: "Moncton", province: "NB", country: "CA" },
  { name: "White Rock", province: "BC", country: "CA" },
  { name: "Nanaimo", province: "BC", country: "CA" },
  { name: "Brantford", province: "ON", country: "CA" },
  { name: "Chicoutimi", province: "QC", country: "CA" },
  { name: "Red Deer", province: "AB", country: "CA" },
  { name: "Kamloops", province: "BC", country: "CA" },
  { name: "Lethbridge", province: "AB", country: "CA" },
  { name: "Sudbury", province: "ON", country: "CA" },
  { name: "Gatineau", province: "QC", country: "CA" },
  { name: "Burnaby", province: "BC", country: "CA" },
  { name: "Richmond", province: "BC", country: "CA" },
  { name: "Laval", province: "QC", country: "CA" },
  { name: "Markham", province: "ON", country: "CA" },
  { name: "Vaughan", province: "ON", country: "CA" },
  { name: "Mississauga", province: "ON", country: "CA" },
  { name: "Brampton", province: "ON", country: "CA" },
  
  // Major US Cities
  { name: "New York", province: "NY", country: "US" },
  { name: "Los Angeles", province: "CA", country: "US" },
  { name: "Chicago", province: "IL", country: "US" },
  { name: "Houston", province: "TX", country: "US" },
  { name: "Phoenix", province: "AZ", country: "US" },
  { name: "Philadelphia", province: "PA", country: "US" },
  { name: "San Antonio", province: "TX", country: "US" },
  { name: "San Diego", province: "CA", country: "US" },
  { name: "Dallas", province: "TX", country: "US" },
  { name: "San Jose", province: "CA", country: "US" },
  { name: "Austin", province: "TX", country: "US" },
  { name: "Jacksonville", province: "FL", country: "US" },
  { name: "Fort Worth", province: "TX", country: "US" },
  { name: "Columbus", province: "OH", country: "US" },
  { name: "Charlotte", province: "NC", country: "US" },
  { name: "San Francisco", province: "CA", country: "US" },
  { name: "Indianapolis", province: "IN", country: "US" },
  { name: "Seattle", province: "WA", country: "US" },
  { name: "Denver", province: "CO", country: "US" },
  { name: "Washington", province: "DC", country: "US" },
  { name: "Boston", province: "MA", country: "US" },
  { name: "El Paso", province: "TX", country: "US" },
  { name: "Detroit", province: "MI", country: "US" },
  { name: "Nashville", province: "TN", country: "US" },
  { name: "Portland", province: "OR", country: "US" },
  { name: "Memphis", province: "TN", country: "US" },
  { name: "Oklahoma City", province: "OK", country: "US" },
  { name: "Las Vegas", province: "NV", country: "US" },
  { name: "Louisville", province: "KY", country: "US" },
  { name: "Baltimore", province: "MD", country: "US" },
  { name: "Milwaukee", province: "WI", country: "US" },
  { name: "Albuquerque", province: "NM", country: "US" },
  { name: "Tucson", province: "AZ", country: "US" },
  { name: "Fresno", province: "CA", country: "US" },
  { name: "Sacramento", province: "CA", country: "US" },
  { name: "Mesa", province: "AZ", country: "US" },
  { name: "Kansas City", province: "MO", country: "US" },
  { name: "Atlanta", province: "GA", country: "US" },
  { name: "Long Beach", province: "CA", country: "US" },
  { name: "Colorado Springs", province: "CO", country: "US" },
  { name: "Raleigh", province: "NC", country: "US" },
  { name: "Miami", province: "FL", country: "US" },
  { name: "Virginia Beach", province: "VA", country: "US" },
  { name: "Omaha", province: "NE", country: "US" },
  { name: "Oakland", province: "CA", country: "US" },
  { name: "Minneapolis", province: "MN", country: "US" },
  { name: "Tulsa", province: "OK", country: "US" },
  { name: "Arlington", province: "TX", country: "US" },
  { name: "Tampa", province: "FL", country: "US" },
  { name: "New Orleans", province: "LA", country: "US" },
  { name: "Wichita", province: "KS", country: "US" },
  { name: "Cleveland", province: "OH", country: "US" },
  { name: "Bakersfield", province: "CA", country: "US" },
  { name: "Aurora", province: "CO", country: "US" },
  { name: "Anaheim", province: "CA", country: "US" },
  { name: "Honolulu", province: "HI", country: "US" },
  { name: "Santa Ana", province: "CA", country: "US" },
  { name: "Corpus Christi", province: "TX", country: "US" },
  { name: "Riverside", province: "CA", country: "US" },
  { name: "Lexington", province: "KY", country: "US" },
  { name: "Stockton", province: "CA", country: "US" },
  { name: "St. Louis", province: "MO", country: "US" },
  { name: "Saint Paul", province: "MN", country: "US" },
  { name: "Henderson", province: "NV", country: "US" },
  { name: "Pittsburgh", province: "PA", country: "US" },
  { name: "Cincinnati", province: "OH", country: "US" },
  { name: "Anchorage", province: "AK", country: "US" },
  { name: "Greensboro", province: "NC", country: "US" },
  { name: "Plano", province: "TX", country: "US" },
  { name: "Newark", province: "NJ", country: "US" },
  { name: "Lincoln", province: "NE", country: "US" },
  { name: "Toledo", province: "OH", country: "US" },
  { name: "Orlando", province: "FL", country: "US" },
  { name: "Chula Vista", province: "CA", country: "US" },
  { name: "Jersey City", province: "NJ", country: "US" },
  { name: "Chandler", province: "AZ", country: "US" },
  { name: "Fort Wayne", province: "IN", country: "US" },
  { name: "Buffalo", province: "NY", country: "US" },
  { name: "Durham", province: "NC", country: "US" },
  { name: "St. Petersburg", province: "FL", country: "US" },
  { name: "Laredo", province: "TX", country: "US" },
  { name: "Irvine", province: "CA", country: "US" },
  { name: "Madison", province: "WI", country: "US" },
  { name: "Norfolk", province: "VA", country: "US" },
  { name: "Lubbock", province: "TX", country: "US" },
  { name: "Gilbert", province: "AZ", country: "US" },
  { name: "Winston-Salem", province: "NC", country: "US" },
  { name: "Glendale", province: "AZ", country: "US" },
  { name: "Reno", province: "NV", country: "US" },
  { name: "Hialeah", province: "FL", country: "US" },
  { name: "Garland", province: "TX", country: "US" },
  { name: "Chesapeake", province: "VA", country: "US" },
  { name: "Irving", province: "TX", country: "US" },
  { name: "North Las Vegas", province: "NV", country: "US" },
  { name: "Scottsdale", province: "AZ", country: "US" },
  { name: "Baton Rouge", province: "LA", country: "US" },
  { name: "Fremont", province: "CA", country: "US" },
  { name: "Richmond", province: "VA", country: "US" },
  { name: "Boise", province: "ID", country: "US" },
  { name: "San Bernardino", province: "CA", country: "US" }
];

export const getProvincesByCountry = (countryCode: string): Province[] => {
  return provinces.filter(province => province.country === countryCode);
};

export const getCitiesByProvince = (provinceCode: string, countryCode: string): City[] => {
  return cities.filter(city => city.province === provinceCode && city.country === countryCode);
};

export const getCitiesByState = (stateCode: string, countryCode: string): City[] => {
  return cities.filter(city => city.province === stateCode && city.country === countryCode);
};

export const getCountryName = (countryCode: string): string => {
  return countries.find(country => country.code === countryCode)?.name || "";
};

export const getCountryByCode = (countryCode: string): Country | undefined => {
  return countries.find(country => country.code === countryCode);
};

export const getProvinceName = (provinceCode: string, countryCode: string): string => {
  return provinces.find(province => province.code === provinceCode && province.country === countryCode)?.name || "";
};

export const canadianProvinces = provinces.filter(province => province.country === "CA");
export const usStates = provinces.filter(province => province.country === "US");