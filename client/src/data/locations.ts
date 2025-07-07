// Geographic data for dynamic location selection
export interface Country {
  code: string;
  name: string;
  states: State[];
}

export interface State {
  code: string;
  name: string;
  cities: string[];
}

export const countries: Country[] = [
  {
    code: "US",
    name: "United States",
    states: [
      {
        code: "AL",
        name: "Alabama",
        cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Hoover", "Dothan", "Auburn", "Decatur", "Madison"]
      },
      {
        code: "AK",
        name: "Alaska",
        cities: ["Anchorage", "Juneau", "Fairbanks", "Sitka", "Ketchikan", "Wasilla", "Kenai", "Kodiak", "Bethel", "Palmer"]
      },
      {
        code: "AZ",
        name: "Arizona",
        cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe", "Peoria", "Surprise"]
      },
      {
        code: "AR",
        name: "Arkansas",
        cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "North Little Rock", "Conway", "Rogers", "Pine Bluff", "Bentonville"]
      },
      {
        code: "CA",
        name: "California",
        cities: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim", "Santa Ana", "Riverside", "Stockton", "Irvine", "Chula Vista"]
      },
      {
        code: "CO",
        name: "Colorado",
        cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Centennial"]
      },
      {
        code: "CT",
        name: "Connecticut",
        cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury", "Norwalk", "Danbury", "New Britain", "West Hartford", "Greenwich"]
      },
      {
        code: "DE",
        name: "Delaware",
        cities: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna", "Milford", "Seaford", "Georgetown", "Elsmere", "New Castle"]
      },
      {
        code: "FL",
        name: "Florida",
        cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral", "Pembroke Pines", "Hollywood", "Gainesville", "Miramar", "Coral Springs"]
      },
      {
        code: "GA",
        name: "Georgia",
        cities: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens", "Sandy Springs", "Roswell", "Macon", "Johns Creek", "Albany"]
      },
      {
        code: "HI",
        name: "Hawaii",
        cities: ["Honolulu", "East Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu", "Kaneohe", "Kailua-Kona", "Kahului", "Mililani"]
      },
      {
        code: "ID",
        name: "Idaho",
        cities: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Caldwell", "Coeur d'Alene", "Twin Falls", "Lewiston", "Post Falls"]
      },
      {
        code: "IL",
        name: "Illinois",
        cities: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield", "Peoria", "Elgin", "Waukegan", "Cicero"]
      },
      {
        code: "IN",
        name: "Indiana",
        cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Fishers", "Bloomington", "Hammond", "Gary", "Muncie"]
      },
      {
        code: "IA",
        name: "Iowa",
        cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Waterloo", "Iowa City", "Council Bluffs", "Ames", "West Des Moines", "Dubuque"]
      },
      {
        code: "KS",
        name: "Kansas",
        cities: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence", "Shawnee", "Manhattan", "Lenexa", "Salina"]
      },
      {
        code: "KY",
        name: "Kentucky",
        cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington", "Richmond", "Georgetown", "Florence", "Hopkinsville", "Nicholasville"]
      },
      {
        code: "LA",
        name: "Louisiana",
        cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Kenner", "Bossier City", "Monroe", "Alexandria", "Houma"]
      },
      {
        code: "ME",
        name: "Maine",
        cities: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn", "Biddeford", "Sanford", "Saco", "Westbrook", "Augusta"]
      },
      {
        code: "MD",
        name: "Maryland",
        cities: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Hagerstown", "Annapolis", "College Park", "Salisbury", "Laurel"]
      },
      {
        code: "MA",
        name: "Massachusetts",
        cities: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford", "Brockton", "Quincy", "Lynn", "Fall River"]
      },
      {
        code: "MI",
        name: "Michigan",
        cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing", "Flint", "Dearborn", "Livonia", "Westland"]
      },
      {
        code: "MN",
        name: "Minnesota",
        cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington", "Brooklyn Park", "Plymouth", "St. Cloud", "Eagan", "Woodbury"]
      },
      {
        code: "MS",
        name: "Mississippi",
        cities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian", "Tupelo", "Greenville", "Olive Branch", "Horn Lake"]
      },
      {
        code: "MO",
        name: "Missouri",
        cities: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence", "Lee's Summit", "O'Fallon", "St. Joseph", "St. Charles", "St. Peters"]
      },
      {
        code: "MT",
        name: "Montana",
        cities: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena", "Kalispell", "Havre", "Anaconda", "Miles City"]
      },
      {
        code: "NE",
        name: "Nebraska",
        cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont", "Hastings", "Norfolk", "North Platte", "Papillion"]
      },
      {
        code: "NV",
        name: "Nevada",
        cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City", "Fernley", "Elko", "Mesquite", "Boulder City"]
      },
      {
        code: "NH",
        name: "New Hampshire",
        cities: ["Manchester", "Nashua", "Concord", "Dover", "Rochester", "Keene", "Portsmouth", "Goffstown", "Londonderry", "Derry"]
      },
      {
        code: "NJ",
        name: "New Jersey",
        cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Woodbridge", "Lakewood", "Toms River", "Hamilton", "Trenton"]
      },
      {
        code: "NM",
        name: "New Mexico",
        cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington", "Clovis", "Hobbs", "Alamogordo", "Carlsbad"]
      },
      {
        code: "NY",
        name: "New York",
        cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"]
      },
      {
        code: "NC",
        name: "North Carolina",
        cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington", "High Point", "Concord"]
      },
      {
        code: "ND",
        name: "North Dakota",
        cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Williston", "Dickinson", "Mandan", "Jamestown", "Wahpeton"]
      },
      {
        code: "OH",
        name: "Ohio",
        cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain"]
      },
      {
        code: "OK",
        name: "Oklahoma",
        cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton", "Edmond", "Moore", "Midwest City", "Enid", "Stillwater"]
      },
      {
        code: "OR",
        name: "Oregon",
        cities: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Beaverton", "Bend", "Medford", "Springfield", "Corvallis"]
      },
      {
        code: "PA",
        name: "Pennsylvania",
        cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster", "Levittown", "Harrisburg"]
      },
      {
        code: "RI",
        name: "Rhode Island",
        cities: ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence", "Woonsocket", "Newport", "Central Falls", "Westerly", "North Providence"]
      },
      {
        code: "SC",
        name: "South Carolina",
        cities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill", "Greenville", "Summerville", "Sumter", "Hilton Head Island", "Spartanburg"]
      },
      {
        code: "SD",
        name: "South Dakota",
        cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown", "Mitchell", "Yankton", "Pierre", "Huron", "Vermillion"]
      },
      {
        code: "TN",
        name: "Tennessee",
        cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Franklin", "Jackson", "Johnson City", "Bartlett"]
      },
      {
        code: "TX",
        name: "Texas",
        cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo", "Lubbock", "Garland", "Irving", "Amarillo", "Grand Prairie"]
      },
      {
        code: "UT",
        name: "Utah",
        cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton", "Taylorsville"]
      },
      {
        code: "VT",
        name: "Vermont",
        cities: ["Burlington", "Essex", "South Burlington", "Colchester", "Rutland", "Montpelier", "Winooski", "St. Albans", "Newport", "Vergennes"]
      },
      {
        code: "VA",
        name: "Virginia",
        cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Hampton", "Portsmouth", "Suffolk", "Roanoke"]
      },
      {
        code: "WA",
        name: "Washington",
        cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton", "Yakima", "Federal Way"]
      },
      {
        code: "WV",
        name: "West Virginia",
        cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling", "Martinsburg", "Fairmont", "Beckley", "Clarksburg", "Lewisburg"]
      },
      {
        code: "WI",
        name: "Wisconsin",
        cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Eau Claire", "Oshkosh", "Janesville"]
      },
      {
        code: "WY",
        name: "Wyoming",
        cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan", "Green River", "Evanston", "Riverton", "Jackson"]
      }
    ]
  },
  {
    code: "CA",
    name: "Canada",
    states: [
      {
        code: "AB",
        name: "Alberta",
        cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat", "Grande Prairie", "Airdrie", "Spruce Grove", "Okotoks", "Lloydminster"]
      },
      {
        code: "BC",
        name: "British Columbia",
        cities: ["Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna", "Saanich", "Delta", "Langley"]
      },
      {
        code: "MB",
        name: "Manitoba",
        cities: ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie", "Winkler", "Selkirk", "Morden", "Dauphin", "The Pas"]
      },
      {
        code: "NB",
        name: "New Brunswick",
        cities: ["Saint John", "Moncton", "Fredericton", "Dieppe", "Riverview", "Edmundston", "Miramichi", "Bathurst", "Campbellton", "Sackville"]
      },
      {
        code: "NL",
        name: "Newfoundland and Labrador",
        cities: ["St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South", "Grand Falls-Windsor", "Paradise", "Happy Valley-Goose Bay", "Gander", "Carbonear", "Stephenville"]
      },
      {
        code: "NT",
        name: "Northwest Territories",
        cities: ["Yellowknife", "Hay River", "Inuvik", "Fort Smith", "Behchokǫ̀", "Tuktoyaktuk", "Norman Wells", "Aklavik", "Fort Simpson", "Tsiigehtchic"]
      },
      {
        code: "NS",
        name: "Nova Scotia",
        cities: ["Halifax", "Sydney", "Dartmouth", "Truro", "New Glasgow", "Glace Bay", "Kentville", "Amherst", "Yarmouth", "Bridgewater"]
      },
      {
        code: "NU",
        name: "Nunavut",
        cities: ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake", "Igloolik", "Pangnirtung", "Pond Inlet", "Kugluktuk", "Cape Dorset", "Gjoa Haven"]
      },
      {
        code: "ON",
        name: "Ontario",
        cities: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Kitchener", "Windsor", "Richmond Hill", "Oakville", "Burlington", "Oshawa", "Barrie"]
      },
      {
        code: "PE",
        name: "Prince Edward Island",
        cities: ["Charlottetown", "Summerside", "Stratford", "Cornwall", "Montague", "Kensington", "Souris", "Alberton", "Georgetown", "Tignish"]
      },
      {
        code: "QC",
        name: "Quebec",
        cities: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Lévis", "Trois-Rivières", "Terrebonne", "Saint-Jean-sur-Richelieu", "Repentigny", "Boucherville", "Saint-Jérôme", "Châteauguay"]
      },
      {
        code: "SK",
        name: "Saskatchewan",
        cities: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current", "Yorkton", "North Battleford", "Estevan", "Weyburn", "Lloydminster"]
      },
      {
        code: "YT",
        name: "Yukon",
        cities: ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction", "Mayo", "Carmacks", "Faro", "Teslin", "Old Crow", "Beaver Creek"]
      }
    ]
  }
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

export function getStateByCode(countryCode: string, stateCode: string): State | undefined {
  const country = getCountryByCode(countryCode);
  return country?.states.find(state => state.code === stateCode);
}

export function getCitiesByState(countryCode: string, stateCode: string): string[] {
  const state = getStateByCode(countryCode, stateCode);
  return state?.cities || [];
}