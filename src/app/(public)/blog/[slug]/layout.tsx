import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog";

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

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
