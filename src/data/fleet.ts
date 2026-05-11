export type CarCategory = "SUV" | "Sedan" | "Supercar" | "Convertible";

export interface CarColor {
  name: string;
  hex: string;
}

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  zeroToHundred: string;
  topSpeed: number;
  seats: number;
  pricePerDay: number;
  colors: CarColor[];
  image: string;
  description: string;
}

export const fleetData: Car[] = [
  {
    id: "porsche-911-carrera",
    name: "Porsche 911 Carrera",
    category: "Supercar",
    zeroToHundred: "3.6s",
    topSpeed: 308,
    seats: 4,
    pricePerDay: 8500,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "GT Silver", hex: "#c0c0c0" },
      { name: "Guards Red", hex: "#cc0000" },
      { name: "Racing Yellow", hex: "#f5d300" },
    ],
    image: "/images/fleet/porsche-911-carrera.jpg",
    description:
      "The iconic 911 Carrera delivers an unmatched blend of everyday usability and track-ready performance. Its rear-mounted twin-turbo flat-six produces 379 hp, channelled through lightning-fast PDK transmission for a driving experience that defines the sports-car genre.",
  },
  {
    id: "lamborghini-huracan-evo",
    name: "Lamborghini Huracán EVO",
    category: "Supercar",
    zeroToHundred: "2.9s",
    topSpeed: 325,
    seats: 2,
    pricePerDay: 15000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Arancio Borealis", hex: "#ff5c00" },
      { name: "Verde Mantis", hex: "#66cc33" },
      { name: "Bianco Monocerus", hex: "#f4f4f4" },
    ],
    image: "/images/fleet/lamborghini-huracan-evo.jpg",
    description:
      "Raw, visceral, and unmistakably Lamborghini. The Huracán EVO pairs a naturally aspirated 5.2-litre V10 producing 640 hp with rear-wheel steering and predictive logic to create a supercar that feels alive. Every drive through Marrakesh becomes an event.",
  },
  {
    id: "ferrari-f8-tributo",
    name: "Ferrari F8 Tributo",
    category: "Supercar",
    zeroToHundred: "2.9s",
    topSpeed: 340,
    seats: 2,
    pricePerDay: 16000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Rosso Corsa", hex: "#d40000" },
      { name: "Giallo Modena", hex: "#ffd700" },
      { name: "Blu Corsa", hex: "#003da5" },
    ],
    image: "/images/fleet/ferrari-f8-tributo.jpg",
    description:
      "A tribute to the most powerful V8 in Ferrari history. The F8 Tributo delivers 710 hp from its 3.9-litre twin-turbo engine while maintaining the surgical precision and emotional soundtrack that only Maranello can produce. Pure automotive artistry.",
  },
  {
    id: "mclaren-720s",
    name: "McLaren 720S",
    category: "Supercar",
    zeroToHundred: "2.8s",
    topSpeed: 341,
    seats: 2,
    pricePerDay: 14000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "McLaren Orange", hex: "#ff6600" },
      { name: "Silica White", hex: "#e8e8e8" },
      { name: "Aztec Gold", hex: "#c39e5c" },
    ],
    image: "/images/fleet/mclaren-720s.jpg",
    description:
      "Engineered with Formula 1 DNA, the 720S is a masterpiece of aerodynamic efficiency. Its 4.0-litre twin-turbo V8 generates 710 hp, while the carbon-fibre Monocage II chassis delivers a power-to-weight ratio that embarrasses cars twice its price.",
  },
  {
    id: "mercedes-amg-gt",
    name: "Mercedes AMG GT",
    category: "Supercar",
    zeroToHundred: "3.2s",
    topSpeed: 318,
    seats: 2,
    pricePerDay: 9500,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "AMG Solarbeam", hex: "#f5c800" },
      { name: "Brilliant Blue Magno", hex: "#1c3f6e" },
      { name: "Designo Selenite Grey", hex: "#7c7d80" },
    ],
    image: "/images/fleet/mercedes-amg-gt.jpg",
    description:
      "Handcrafted in Affalterbach, the AMG GT embodies the philosophy of one man, one engine. Its front-mid-mounted 4.0-litre biturbo V8 delivers 523 hp with a guttural growl that echoes through the medina walls. Brute force wrapped in breathtaking design.",
  },
  {
    id: "bmw-m8-competition",
    name: "BMW M8 Competition",
    category: "Sedan",
    zeroToHundred: "3.2s",
    topSpeed: 305,
    seats: 4,
    pricePerDay: 7000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Brands Hatch Grey", hex: "#5a5a5a" },
      { name: "Marina Bay Blue", hex: "#003f72" },
      { name: "Motegi Red", hex: "#8b0000" },
    ],
    image: "/images/fleet/bmw-m8-competition.jpg",
    description:
      "The M8 Competition Grand Coupé is BMW's ultimate statement — a four-door powerhouse delivering 625 hp from its S63 twin-turbo V8. xDrive all-wheel drive and adaptive M suspension ensure this grand tourer devours Moroccan highways with effortless authority.",
  },
  {
    id: "mercedes-s-class",
    name: "Mercedes S-Class",
    category: "Sedan",
    zeroToHundred: "4.9s",
    topSpeed: 250,
    seats: 5,
    pricePerDay: 6000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Obsidian Black", hex: "#1c1c1c" },
      { name: "Cirrus Silver", hex: "#c4c9cf" },
      { name: "Nautical Blue", hex: "#1a3c61" },
    ],
    image: "/images/fleet/mercedes-s-class.jpg",
    description:
      "The benchmark of automotive luxury. The S-Class cocoons its passengers in hand-stitched Nappa leather, 4D surround sound, and ambient lighting that transforms every journey into a first-class experience. MBUX with augmented reality navigation guides you through Marrakesh in unparalleled comfort.",
  },
  {
    id: "audi-rs7-sportback",
    name: "Audi RS7 Sportback",
    category: "Sedan",
    zeroToHundred: "3.6s",
    topSpeed: 305,
    seats: 5,
    pricePerDay: 6500,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Nardo Grey", hex: "#808080" },
      { name: "Tango Red", hex: "#c0392b" },
      { name: "Glacier White", hex: "#f0f0f0" },
    ],
    image: "/images/fleet/audi-rs7-sportback.jpg",
    description:
      "A wolf in designer clothing. The RS7 Sportback hides a savage 591 hp 4.0-litre twin-turbo V8 beneath its elegantly sculpted fastback silhouette. Quattro all-wheel drive and rear-axle steering deliver supercar agility with the practicality of a five-seat grand tourer.",
  },
  {
    id: "range-rover-autobiography",
    name: "Range Rover Autobiography",
    category: "SUV",
    zeroToHundred: "5.4s",
    topSpeed: 250,
    seats: 5,
    pricePerDay: 7500,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Fuji White", hex: "#f2f2f0" },
      { name: "Carpathian Grey", hex: "#4a4a4a" },
      { name: "Byron Blue", hex: "#1b3a5c" },
    ],
    image: "/images/fleet/range-rover-autobiography.jpg",
    description:
      "The definitive luxury SUV commands every road — and the spaces between them. Semi-aniline leather, executive rear seats with power recline, and adaptive air suspension that reads the terrain ahead. From the Atlas Mountains to the palm-lined boulevards, nothing rivals its presence.",
  },
  {
    id: "bentley-bentayga",
    name: "Bentley Bentayga",
    category: "SUV",
    zeroToHundred: "3.9s",
    topSpeed: 306,
    seats: 5,
    pricePerDay: 12000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Glacier White", hex: "#f5f5f5" },
      { name: "Dark Sapphire", hex: "#0f1f3d" },
      { name: "St James Red", hex: "#6b1a2a" },
    ],
    image: "/images/fleet/bentley-bentayga.jpg",
    description:
      "Crafted in Crewe with meticulous attention to detail, the Bentayga is the world's most luxurious SUV. Its 4.0-litre V8 produces 542 hp, while the cabin — finished in hand-cross-stitched leather and open-pore veneer — offers a sanctuary from the outside world.",
  },
  {
    id: "porsche-cayenne-turbo-gt",
    name: "Porsche Cayenne Turbo GT",
    category: "SUV",
    zeroToHundred: "3.3s",
    topSpeed: 300,
    seats: 4,
    pricePerDay: 9000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Arctic Grey", hex: "#b0b0b0" },
      { name: "White", hex: "#ffffff" },
      { name: "Carmine Red", hex: "#960018" },
    ],
    image: "/images/fleet/porsche-cayenne-turbo-gt.jpg",
    description:
      "The fastest Cayenne ever built. With 640 hp from its twin-turbo V8, the Turbo GT demolishes the Nürburgring SUV record and redefines what a performance SUV can achieve. Titanium exhaust, carbon roof, and track-tuned suspension — wrapped in an unmistakable silhouette.",
  },
  {
    id: "rolls-royce-dawn",
    name: "Rolls-Royce Dawn",
    category: "Convertible",
    zeroToHundred: "4.9s",
    topSpeed: 250,
    seats: 4,
    pricePerDay: 18000,
    colors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "English White", hex: "#f5f0e8" },
      { name: "Salamanca Blue", hex: "#1c2951" },
      { name: "Jubilee Silver", hex: "#d0d0d0" },
    ],
    image: "/images/fleet/rolls-royce-dawn.jpg",
    description:
      "The most social of Rolls-Royces, the Dawn invites you to embrace the Marrakesh sun. Its 6.6-litre twin-turbo V12 whispers 563 hp through a silken ZF transmission, while the six-layer roof retracts in near silence. An open-air palace on wheels — nothing less.",
  },
];
