export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  rating: 4 | 5;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Laurent Deschamps",
    title: "CEO, Maison Deschamps",
    quote:
      "Goudoukh Luxury Cars transformed our corporate retreat in Marrakesh. The Bentley Bentayga was immaculate, and our dedicated driver knew every hidden riad and rooftop restaurant in the medina. An experience that matched the standard our clients expect.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Aisha El Fassi",
    title: "Fashion Designer",
    quote:
      "I rented the Rolls-Royce Dawn for a weekend shoot in the Agafay Desert. The car arrived spotless, on time, and the team handled every detail so I could focus on my work. The concierge service alone is worth it — they arranged permits I didn't even know I needed.",
    rating: 5,
  },
  {
    id: "testimonial-3",
    name: "James Whitfield",
    title: "Private Investor, London",
    quote:
      "Third time renting with Goudoukh Luxury Cars and the standard never drops. Took the McLaren 720S through the Atlas Mountain passes — the car was perfectly prepared, tyres fresh, and they even suggested routes I would never have found on my own. Flawless.",
    rating: 5,
  },
  {
    id: "testimonial-4",
    name: "Sofia Rinaldi",
    title: "Travel Journalist, Condé Nast",
    quote:
      "I've used premium rental services across Europe, the Gulf, and Asia. Goudoukh Luxury Cars is comfortably in the top tier. The Ferrari F8 was a dream on the N9 to Ouarzazate, and the handover process was the most seamless I've experienced anywhere.",
    rating: 5,
  },
  {
    id: "testimonial-5",
    name: "Omar Benjelloun",
    title: "Hotelier, Benjelloun Group",
    quote:
      "We recommend Goudoukh Luxury Cars to all VIP guests at our properties. The fleet is always current, the vehicles are maintained to concours standards, and their team understands discretion. A reliable partner for our most discerning clientele.",
    rating: 4,
  },
  {
    id: "testimonial-6",
    name: "Elena Voss",
    title: "Entrepreneur & Philanthropist",
    quote:
      "Rented the Range Rover Autobiography for a week exploring the south. From Marrakesh to Essaouira and back through the mountains — the car handled everything beautifully. Goudoukh Luxury Cars's 24/7 support gave us total peace of mind on every stretch of road.",
    rating: 4,
  },
];
