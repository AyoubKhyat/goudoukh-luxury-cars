import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog";
import { BlogPostJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found | Goudoukh Luxury Cars" };
  }

  return {
    title: `${post.title} | Goudoukh Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return (
    <>
      {post && <BlogPostJsonLd post={post} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://goudoukh-luxury-cars.vercel.app" },
          { name: "Journal", url: "https://goudoukh-luxury-cars.vercel.app/blog" },
          { name: post?.title ?? slug, url: `https://goudoukh-luxury-cars.vercel.app/blog/${slug}` },
        ]}
      />
      {children}
    </>
  );
}
