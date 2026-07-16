import { NextRequest, NextResponse } from "next/server";

const categoryMap: Record<string, string[]> = {
  "Adventure": [
    "Queenstown, New Zealand", "Patagonia", "Banff National Park", "Interlaken", "Chamonix",
    "Moab, Utah", "Kathmandu", "Cusco", "Pokhara", "Lauterbrunnen",
    "Torres del Paine", "Mount Kilimanjaro", "Zermatt", "Whistler, British Columbia", "Innsbruck",
    "Reykjavík", "Rotorua", "Grindelwald", "Tromsø", "Cairns",
    "Chalten", "Lake Louise, Alberta", "Jackson Hole", "Wanaka"
  ],
  "Luxury": [
    "Monaco", "Dubai", "Bora Bora", "Saint Barthélemy", "Seychelles",
    "Maldives", "Lake Como", "Amalfi", "St. Moritz", "Aspen, Colorado",
    "Mykonos", "Capri", "Fiji", "Macau", "Beverly Hills",
    "Saint-Tropez", "Courchevel", "Portofino", "Gstaad", "Abu Dhabi",
    "Mustique", "Palm Beach, Florida", "Ibiza", "Cannes"
  ],
  "Beach": [
    "Maldives", "Maui", "Fiji", "Cancun", "Phuket",
    "Tulum", "Bora Bora", "Seychelles", "Palawan", "Whitsunday Islands",
    "Punta Cana", "Bali", "Mykonos", "Turks and Caicos", "Koh Samui",
    "Oahu", "Ibiza", "Boracay", "Zanzibar", "Miami Beach",
    "Amalfi Coast", "Tenerife", "Mallorca", "Langkawi"
  ],
  "Nature": [
    "Yellowstone National Park", "Yosemite National Park", "Amazon rainforest", "Galápagos Islands", "Serengeti",
    "Banff National Park", "Grand Canyon", "Fiordland National Park", "Zion National Park", "Iguazu Falls",
    "Mount Everest", "Plitvice Lakes National Park", "Svalbard", "Great Barrier Reef", "Costa Rica",
    "Lake Bled", "Cliffs of Moher", "Mount Fuji", "Zhangjiajie", "Victoria Falls",
    "Salar de Uyuni", "Milford Sound", "Rocky Mountain National Park", "Antelope Canyon"
  ],
  "Spiritual": [
    "Varanasi", "Kyoto", "Lhasa", "Jerusalem", "Vatican City",
    "Mecca", "Bodh Gaya", "Angkor Wat", "Mount Kailash", "Machu Picchu",
    "Rishikesh", "Lumbini", "Amritsar", "Tirupati", "Sedona, Arizona",
    "Lalibela", "Uluru", "Glastonbury", "Mount Sinai", "Wudang Mountains",
    "Adam's Peak", "Fatima, Portugal", "Assisi", "Mount Athos"
  ],
  "Culinary": [
    "Paris", "Tokyo", "Rome", "Lyon", "Bologna",
    "Oaxaca", "Bangkok", "San Sebastián", "Lima", "New Orleans",
    "Florence", "Naples", "Copenhagen", "Osaka", "Barcelona",
    "Charleston, South Carolina", "Taipei", "Bordeaux", "Penang", "Hanoi",
    "Marrakech", "Istanbul", "Mumbai", "Mexico City"
  ],
  "Photography": [
    "Iceland", "Santorini", "Machu Picchu", "Antelope Canyon", "Petra",
    "Venice", "Kyoto", "Salar de Uyuni", "Bagan", "Cinque Terre",
    "Yosemite National Park", "Banff National Park", "Plitvice Lakes National Park", "Faroe Islands", "Cappadocia",
    "Pamukkale", "Taj Mahal", "Havana", "Yellowstone National Park", "Angkor Wat",
    "Mount Fuji", "Chefchaouen", "Dubrovnik", "Colmar"
  ],
  "Road Trips": [
    "Route 66", "Great Ocean Road", "Amalfi Coast", "Ring Road (Iceland)", "Pacific Coast Highway",
    "Garden Route", "Wild Atlantic Way", "Icefields Parkway", "Ruta 40", "Blue Ridge Parkway",
    "Transfăgărășan", "NC500", "Overseas Highway", "Romantic Road", "Grossglockner High Alpine Road",
    "Cabot Trail", "Milford Road, New Zealand", "Atlantic Ocean Road", "Salar de Uyuni", "Dalmatian Coast",
    "Hana Highway", "Trollstigen", "Route des Grandes Alpes", "Stelvio Pass"
  ],
  "Wildlife": [
    "Serengeti National Park", "Maasai Mara", "Kruger National Park", "Okavango Delta", "Pantanal",
    "Galápagos Islands", "Bwindi Impenetrable National Park", "Ranthambore National Park", "Yellowstone National Park", "Antarctica",
    "Corcovado National Park", "Churchill, Manitoba", "Etosha National Park", "Yala National Park", "Taman Negara",
    "Ngorongoro Conservation Area", "Denali National Park", "Kangaroo Island", "Bandhavgarh National Park", "Jim Corbett National Park",
    "Chobe National Park", "Kinabatangan River", "Torres del Paine", "South Georgia"
  ],
  "Solo Travel": [
    "Reykjavík", "Copenhagen", "Amsterdam", "Singapore", "Chiang Mai",
    "Kyoto", "Lisbon", "Berlin", "Melbourne", "Taipei",
    "Stockholm", "Montreal", "Queenstown, New Zealand", "Vancouver", "Prague",
    "Auckland", "Edinburgh", "Vienna", "Helsinki", "Zurich",
    "Dublin", "Barcelona", "Munich", "Taipei"
  ],
  "Family": [
    "Orlando, Florida", "Costa Rica", "London", "Hawaii", "San Diego",
    "Tokyo", "Yellowstone National Park", "Gold Coast, Queensland", "Billund", "Paris",
    "Rome", "Bali", "Oahu", "Phuket", "Fiji",
    "Anaheim", "Cancun", "Sydney", "Singapore", "Copenhagen",
    "Vienna", "Tenerife", "Maui", "Banff National Park"
  ],
  "Business": [
    "London", "New York City", "Tokyo", "Singapore", "Hong Kong",
    "Frankfurt", "Dubai", "Shanghai", "Paris", "San Francisco",
    "Toronto", "Sydney", "Zurich", "Chicago", "Seoul",
    "Beijing", "Boston", "Amsterdam", "Geneva", "Munich",
    "Los Angeles", "Seattle", "Taipei", "Washington, D.C."
  ]
};

const SEED_KEYWORDS = [
  "popular tourist destination island",
  "historic city tourism",
  "mountain resort town",
  "famous beach destination",
];

async function fetchWithTimeout(resource: string, options: RequestInit = {}) {
  const { timeout = 4000 } = options as any;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function getDestinationData(query: string) {
  try {
    const titleSlug = query.split(" ").join("_");
    const sumRes = await fetchWithTimeout(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleSlug)}`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    const sum = await sumRes.json();
    if (!sum.title || sum.type === "disambiguation") return null;

    let lat = sum.coordinates?.lat;
    let lon = sum.coordinates?.lon;

    let weather = "N/A";
    let weatherCode = 0;
    if (lat && lon) {
      try {
        const wRes = await fetchWithTimeout(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const wData = await wRes.json();
        if (wData.current_weather) {
          weather = `${Math.round(wData.current_weather.temperature)}°C`;
          weatherCode = wData.current_weather.weathercode;
        }
      } catch (e) {
        // Silently ignore weather failures
      }
    }

    return {
      id: sum.pageid?.toString() || Math.random().toString(),
      name: sum.title,
      country: sum.description || "Global Destination",
      extract: sum.extract?.slice(0, 160) + "...",
      image: sum.thumbnail?.source?.replace(/\/\d+px-/, "/800px-") || null,
      wikiUrl: sum.content_urls?.desktop?.page,
      weather,
      weatherCode,
      lat,
      lon,
      ratings: +(4 + Math.random()).toFixed(1),
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const mockDestinations = [
    {
      id: "mock1",
      name: "Paris",
      country: "France",
      extract: "Paris is the capital and most populous city of France, known for its cafe culture and landmarks.",
      image: "https://images.unsplash.com/photo-1502602898657-3e90760b2131?w=800&q=80",
      weather: "15°C",
      weatherCode: 0,
      ratings: 4.8,
    }
  ];

  try {
    let destinations = [];
    
    if (q && categoryMap[q]) {
      // We shuffle the array so it's not always the exact same subset
      const places = categoryMap[q].sort(() => 0.5 - Math.random());
      // Limit to 24
      const selectedPlaces = places.slice(0, 24);
      
      destinations = (
        await Promise.all(selectedPlaces.map(place => getDestinationData(place)))
      ).filter(Boolean);
    } else {
      const searchQuery = q ? (q + " tourist destination") : SEED_KEYWORDS[Math.floor(Math.random() * SEED_KEYWORDS.length)];
      const searchRes = await fetchWithTimeout(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&srlimit=24&origin=*`,
        { cache: "no-store" }
      );
      if (!searchRes.ok) throw new Error("Wikipedia API failed");
      const searchData = await searchRes.json();
      const pages = searchData.query?.search || [];
      destinations = (
        await Promise.all(pages.map((p: any) => getDestinationData(p.title)))
      ).filter(Boolean);
    }

    if (destinations.length === 0) {
      return NextResponse.json(mockDestinations);
    }

    return NextResponse.json(destinations.slice(0, 24));
  } catch (error) {
    return NextResponse.json(mockDestinations);
  }
}
