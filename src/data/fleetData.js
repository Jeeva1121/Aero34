// 34 Global Flagship Aircraft & Supersonic Concepts
// Authentic aerospace data for AERO 34: The Stratosphere Initiative

export const TOTAL_CARDS = 34;

export const CATEGORIES = [
  "All Fleets",
  "Supersonic",
  "Ultra Long-Haul",
  "Executive Private Jet",
  "Experimental Aerospace"
];

// High-resolution aerospace, cockpit, cabin, and stratospheric photography (9:16 vertical)
const AERO_STILLS = [
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=720&h=1280&fit=crop&q=85&auto=format", // Jet climbing above golden clouds
  "https://images.unsplash.com/photo-1519074069444-1ba4ea16e6f1?w=720&h=1280&fit=crop&q=85&auto=format", // Sleek modern airliner wing at sunrise
  "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=720&h=1280&fit=crop&q=85&auto=format", // Airplane window view over fluffy clouds
  "https://images.unsplash.com/photo-1520437358207-323b43b50729?w=720&h=1280&fit=crop&q=85&auto=format", // Private executive jet on runway at dusk
  "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=720&h=1280&fit=crop&q=85&auto=format", // High-altitude stratospheric twilight
  "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=720&h=1280&fit=crop&q=85&auto=format", // Commercial airliner cruising above white cumulus
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=720&h=1280&fit=crop&q=85&auto=format", // Modern jet engine turbine nacelle
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=720&h=1280&fit=crop&q=85&auto=format", // Glass cockpit heads-up display at night
  "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=720&h=1280&fit=crop&q=85&auto=format", // Supersonic jet banking through sunset
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=720&h=1280&fit=crop&q=85&auto=format", // Night flight over illuminated metropolis
  "https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=720&h=1280&fit=crop&q=85&auto=format", // Aircraft wing slicing through mountain fog
  "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=720&h=1280&fit=crop&q=85&auto=format", // Jet flying directly into golden sunbeam
  "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=720&h=1280&fit=crop&q=85&auto=format", // Luxury first-class cabin suite
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=720&h=1280&fit=crop&q=85&auto=format", // Minimalist aerospace titanium architecture
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=720&h=1280&fit=crop&q=85&auto=format", // High-altitude alpine flyover
  "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=720&h=1280&fit=crop&q=85&auto=format"  // Oceanic supersonic corridor
];

// High-altitude flight clips
const FLIGHT_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-in-slow-motion-42654-large.mp4"
];

export const RAW_FLEET = [
  {
    model: "Boom Overture",
    manufacturer: "Boom Supersonic",
    category: "Supersonic",
    speed: "Mach 1.7",
    altitude: "60,000 FT",
    range: "4,250 NM",
    route: "Tokyo → Seattle",
    award: "Aero Grand Prix • Commercial Supersonic",
    logline: "Sustained Mach 1.7 cruise powered by 100% Sustainable Aviation Fuel (SAF). Crossing oceans in half the standard flight time.",
    specs: "Four Symphony Turbofans • 65-80 Passengers • Carbon Composite Airframe"
  },
  {
    model: "Gulfstream G800",
    manufacturer: "Gulfstream Aerospace",
    category: "Executive Private Jet",
    speed: "Mach 0.925",
    altitude: "51,000 FT",
    range: "8,000 NM",
    route: "London → Singapore",
    award: "Design Excellence • Ultra-Long Range",
    logline: "The longest-range private jet in civil aviation. Features Gulfstream Symmetry Flight Deck with active control sidesticks.",
    specs: "Rolls-Royce Pearl 700 Engines • 16 Panoramic Windows • 100% Fresh Air Cabin"
  },
  {
    model: "Lockheed Martin X-59",
    manufacturer: "NASA / Skunk Works",
    category: "Experimental Aerospace",
    speed: "Mach 1.42",
    altitude: "55,000 FT",
    range: "3,100 NM",
    route: "Edwards AFB → Transcontinental",
    award: "Breakthrough Award • Low-Boom Tech",
    logline: "Quiet SuperSonic Technology (QueSST) designed to reduce sonic booms to a gentle 75 PLdB sonic thump over populated land.",
    specs: "General Electric F414-GE-100 • eXternal Vision System (XVS) 4K HUD"
  },
  {
    model: "Airbus A350-1000 ULR",
    manufacturer: "Airbus",
    category: "Ultra Long-Haul",
    speed: "Mach 0.89",
    altitude: "43,100 FT",
    range: "9,700 NM",
    route: "Sydney → London Nonstop",
    award: "Endurance Trophy • Project Sunrise",
    logline: "Engineered for 20+ hour nonstop flights. Cabin pressure maintained at 6,000 ft altitude with dynamic circadian LED lighting.",
    specs: "Rolls-Royce Trent XWB-97 • 53% Carbon Composite • Ultra-Quiet Cabin"
  },
  {
    model: "Bombardier Global 8000",
    manufacturer: "Bombardier Aviation",
    category: "Executive Private Jet",
    speed: "Mach 0.94",
    altitude: "51,000 FT",
    range: "8,000 NM",
    route: "New York → Hong Kong",
    award: "Speed Benchmark • Civil Aviation",
    logline: "Fastest civil aircraft since Concorde with demonstration supersonic capability (Mach 1.015 in flight tests).",
    specs: "GE Passport Engines • Smooth Flĕx Wing • Zero Gravity Seating"
  },
  {
    model: "Boeing 777-9X",
    manufacturer: "Boeing Commercial",
    category: "Ultra Long-Haul",
    speed: "Mach 0.85",
    altitude: "43,100 FT",
    range: "7,285 NM",
    route: "Doha → Los Angeles",
    award: "Aerodynamic Trophy • Folding Wingtips",
    logline: "World's largest twin-engine airliner. Equipped with commercial aviation's first folding carbon-fiber wingtips.",
    specs: "GE9X High-Bypass Turbofans • 426 Passengers • Touchscreen Cockpit"
  },
  {
    model: "Dassault Falcon 10X",
    manufacturer: "Dassault Aviation",
    category: "Executive Private Jet",
    speed: "Mach 0.925",
    altitude: "51,000 FT",
    range: "7,500 NM",
    route: "Paris → Buenos Aires",
    award: "Interior Innovation • Penthouse Cabin",
    logline: "Largest cross-section cabin in business aviation, derived from Dassault Rafale fighter fly-by-wire flight control.",
    specs: "Rolls-Royce Pearl 10X • Falcon Digital Flight Control System • Master Suite"
  },
  {
    model: "Concorde Heritage II",
    manufacturer: "Aérospatiale / BAC",
    category: "Supersonic",
    speed: "Mach 2.04",
    altitude: "60,000 FT",
    range: "3,900 NM",
    route: "Paris → New York (3h 15m)",
    award: "Legend Honour • Supersonic Pioneer",
    logline: "The golden standard of supersonic passenger flight. Ogival delta wing architecture slicing through the upper stratosphere.",
    specs: "Four Olympus 593 Turbojets • Reheat Afterburners • Droop Nose Architecture"
  },
  {
    model: "Boeing 787-10 Dreamliner",
    manufacturer: "Boeing Commercial",
    category: "Ultra Long-Haul",
    speed: "Mach 0.85",
    altitude: "41,100 FT",
    range: "6,430 NM",
    route: "Singapore → San Francisco",
    award: "Efficiency Medal • Composite Architecture",
    logline: "Electro-chromatic dimmable windows and gust-suppression systems ensuring optimal passenger comfort across global meridians.",
    specs: "GEnx-1B / Trent 1000 • 50% Composite Fuselage • 20% Reduced Emissions"
  },
  {
    model: "Virgin Galactic Delta Class",
    manufacturer: "Virgin Galactic",
    category: "Experimental Aerospace",
    speed: "Mach 3.0",
    altitude: "285,000 FT",
    range: "Suborbital",
    route: "Spaceport America → Suborbital Apogee",
    award: "Pioneer Trophy • Commercial Spaceflight",
    logline: "Suborbital spaceship carrying passengers to the edge of space for minutes of true weightlessness and panoramic Earth curvature.",
    specs: "Hybrid Rocket Motor • Feathering Wing Re-entry • 12 Large Windows"
  },
  {
    model: "HondaJet Elite II",
    manufacturer: "Honda Aircraft Company",
    category: "Executive Private Jet",
    speed: "Mach 0.72",
    altitude: "43,000 FT",
    range: "1,547 NM",
    route: "Geneva → Athens",
    award: "Aero Innovation • Over-The-Wing Nacelle",
    logline: "Patented Over-The-Wing Engine Mount (OTWEM) reducing cabin noise and maximizing aerodynamic efficiency.",
    specs: "GE Honda HF120 Turbofans • Natural Laminar Flow • Garmin G3000 Avionics"
  },
  {
    model: "Pilatus PC-24 Super Versatile",
    manufacturer: "Pilatus Aircraft",
    category: "Executive Private Jet",
    speed: "Mach 0.74",
    altitude: "45,000 FT",
    range: "2,000 NM",
    route: "Zurich → Reykjavik",
    award: "Versatility Award • Rough-Field Jet",
    logline: "The only business jet capable of operating from unpaved gravel and grass airstrips with standard pallet-sized cargo doors.",
    specs: "Williams FJ44-4A • Advanced Cockpit Environment (ACE) • Crystal Cabin"
  },
  {
    model: "Lockheed Martin SR-72 Son of Blackbird",
    manufacturer: "Lockheed Skunk Works",
    category: "Experimental Aerospace",
    speed: "Mach 6.0",
    altitude: "85,000 FT",
    range: "Hypersonic Global",
    route: "Transcontinental Mach 6",
    award: "Apex Frontier • Hypersonic Propulsion",
    logline: "Hypersonic reconnaissance and strike concept utilizing combined-cycle turbine-based scramjet propulsion.",
    specs: "Turbine-Based Combined Cycle (TBCC) • Hypersonic Heat-Resistant Tiles"
  },
  {
    model: "Airbus A380-800 Superjumbo",
    manufacturer: "Airbus",
    category: "Ultra Long-Haul",
    speed: "Mach 0.85",
    altitude: "43,000 FT",
    range: "8,000 NM",
    route: "Dubai → Auckland",
    award: "Flagship Honour • Double-Deck Architecture",
    logline: "The world's largest commercial airliner. Two full passenger decks providing onboard shower spas and lounge pavilions.",
    specs: "Engine Alliance GP7200 / Trent 900 • 550+ Seats • 80-Meter Wingspan"
  },
  {
    model: "Aerion AS2 Supersonic Business Jet",
    manufacturer: "Aerion Supersonic",
    category: "Supersonic",
    speed: "Mach 1.4",
    altitude: "57,000 FT",
    range: "4,750 NM",
    route: "Los Angeles → Tokyo",
    award: "Laminar Flow Medal • Boomless Cruise",
    logline: "Boomless cruise technology flying Mach 1.2 over land without creating a sonic boom at ground level.",
    specs: "GE Affinity Engines • Supersonic Natural Laminar Flow • Carbon Airframe"
  },
  {
    model: "Embraer Praetor 600",
    manufacturer: "Embraer Executive Jets",
    category: "Executive Private Jet",
    speed: "Mach 0.83",
    altitude: "45,000 FT",
    range: "4,018 NM",
    route: "London → New York Nonstop",
    award: "Disruptor Trophy • Full Fly-By-Wire",
    logline: "The only super-midsize business jet with full fly-by-wire flight control and active turbulence reduction technology.",
    specs: "Honeywell HTF7500E • Bossa Nova Interior • Ka-Band Satellite Connectivity"
  },
  {
    model: "Cessna Citation Longitude",
    manufacturer: "Textron Aviation",
    category: "Executive Private Jet",
    speed: "Mach 0.84",
    altitude: "45,000 FT",
    range: "3,500 NM",
    route: "Madrid → Boston",
    award: "Acoustic Excellence • Whisper Quiet",
    logline: "Boasts the lowest cabin sound levels in its category with 5,950 ft cabin altitude at FL450.",
    specs: "Honeywell HTF7700L • Garmin G5000 Integrated Avionics • Wireless Cabin Control"
  }
];

// Generate 34 full aircraft records
export const CARDS_DATA = Array.from({ length: TOTAL_CARDS }, (_, index) => {
  const base = RAW_FLEET[index % RAW_FLEET.length];
  const photoIndex = index % AERO_STILLS.length;
  const videoIndex = index % FLIGHT_VIDEOS.length;
  const tailNumber = `N${100 + index * 27}AX`;
  const flightId = `AF-${String(index + 1).padStart(2, '0')}`;

  return {
    id: index + 1,
    flightId,
    tailNumber,
    model: base.model,
    title: base.model, // Backwards compatibility with card renderer
    manufacturer: base.manufacturer,
    director: base.manufacturer, // Backwards compat
    category: base.category,
    speed: base.speed,
    altitude: base.altitude,
    range: base.range,
    duration: base.speed, // Backwards compat
    route: base.route,
    country: base.route, // Backwards compat
    award: base.award,
    logline: base.logline,
    specs: base.specs,
    cover: AERO_STILLS[photoIndex],
    video: FLIGHT_VIDEOS[videoIndex],
    timecode: `${base.speed} • ${base.altitude}`,
    reelNumber: String(index + 1).padStart(2, '0')
  };
});
