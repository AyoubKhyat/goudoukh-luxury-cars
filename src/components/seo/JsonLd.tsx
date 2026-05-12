import type { Car } from "@/data/fleet";
import type { BlogPost } from "@/data/blog";

const BASE_URL = "https://goudoukh-luxury-cars.vercel.app";

interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "Goudoukh Luxury Cars",
        description:
          "Premium luxury car rental in Marrakesh, Morocco. Supercars, grand tourers, and luxury SUVs with white-glove concierge service.",
        url: BASE_URL,
        telephone: "+212600000000",
        email: "info@goudoukh.ma",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Avenue Mohammed V",
          addressLocality: "Marrakesh",
          addressCountry: "MA",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 31.6295,
          longitude: -7.9811,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday", "Tuesday", "Wednesday", "Thursday",
            "Friday", "Saturday", "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        priceRange: "$$$$",
        image: `${BASE_URL}/og-image.jpg`,
        sameAs: [],
      }}
    />
  );
}

export function CarJsonLd({ car }: { car: Car }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: car.name,
        description: car.description,
        category: car.category,
        url: `${BASE_URL}/cars/${car.id}`,
        brand: {
          "@type": "Brand",
          name: car.name.split(" ")[0],
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "MAD",
          price: car.pricePerDay,
          unitCode: "DAY",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "AutoRental",
            name: "Goudoukh Luxury Cars",
          },
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "0-100 km/h",
            value: car.zeroToHundred,
          },
          {
            "@type": "PropertyValue",
            name: "Top Speed",
            value: `${car.topSpeed} km/h`,
          },
          {
            "@type": "PropertyValue",
            name: "Seats",
            value: car.seats,
          },
        ],
      }}
    />
  );
}

export function BlogPostJsonLd({ post }: { post: BlogPost }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        url: `${BASE_URL}/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Organization",
          name: post.author,
        },
        publisher: {
          "@type": "Organization",
          name: "Goudoukh Luxury Cars",
          url: BASE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog/${post.slug}`,
        },
        articleSection: post.category,
        wordCount: post.content.split(/\s+/).length,
      }}
    />
  );
}

export function FleetPageJsonLd({ cars }: { cars: Car[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Goudoukh Luxury Cars Fleet",
        description: "Premium luxury cars available for rental in Marrakesh",
        numberOfItems: cars.length,
        itemListElement: cars.map((car, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: car.name,
            description: car.description,
            url: `${BASE_URL}/cars/${car.id}`,
            offers: {
              "@type": "Offer",
              priceCurrency: "MAD",
              price: car.pricePerDay,
              unitCode: "DAY",
            },
          },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
