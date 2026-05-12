"use client";

import { use } from "react";
import Link from "next/link";
import { getBlogPost, blogPosts } from "@/data/blog";
import ShareButtons from "@/components/ui/ShareButtons";

const categoryColors: Record<string, string> = {
  Travel: "bg-blue-100 text-blue-700",
  Cars: "bg-orange-100 text-[#ff5c00]",
  Tips: "bg-green-100 text-green-700",
  Routes: "bg-purple-100 text-purple-700",
};

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trimStart();

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-10 mb-4 font-bebas text-2xl tracking-wide text-[#0a0a0a]">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*\s*(.*)$/);
      if (match) {
        elements.push(
          <li key={key++} className="ml-4 mb-2 text-gray-600 leading-relaxed list-disc">
            <strong className="text-[#0a0a0a]">{match[1]}</strong> {match[2]}
          </li>
        );
      }
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <li key={key++} className="ml-4 mb-2 text-gray-600 leading-relaxed list-disc">
          {trimmed.slice(2)}
        </li>
      );
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push(
        <p key={key++} className="mt-4 mb-2 font-semibold text-[#0a0a0a]">
          {trimmed.slice(2, -2)}
        </p>
      );
    } else if (trimmed.startsWith("**")) {
      const parsed = trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      elements.push(
        <p
          key={key++}
          className="mb-4 text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parsed }}
        />
      );
    } else if (trimmed === "") {
      // skip empty lines
    } else {
      elements.push(
        <p key={key++} className="mb-4 text-gray-600 leading-relaxed">
          {trimmed}
        </p>
      );
    }
  }

  return elements;
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <h1 className="font-bebas text-6xl tracking-wide text-[#0a0a0a]">
          Post Not Found
        </h1>
        <p className="mt-4 text-gray-500">
          The article you are looking for does not exist.
        </p>
        <Link
          href="/blog"
          className="mt-8 rounded bg-[#ff5c00] px-8 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#e05200]"
        >
          Back to Journal
        </Link>
      </section>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  return (
    <section className="min-h-screen bg-white pt-28 pb-20">
      <article className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0a0a0a] transition-colors mb-8"
        >
          &larr; Back to Journal
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[post.category]}`}>
            {post.category}
          </span>
          <span className="text-xs text-gray-400">
            {post.readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="font-bebas text-4xl tracking-wide text-[#0a0a0a] md:text-5xl mb-4">
          {post.title}
        </h1>

        {/* Author + date */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
          <span>By {post.author}</span>
          <span>&middot;</span>
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Orange accent line */}
        <div className="h-1 w-16 rounded bg-[#ff5c00] mb-8" />

        {/* Share */}
        <div className="mb-10">
          <ShareButtons title={post.title} />
        </div>

        {/* Content */}
        <div className="font-inter text-base">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-[#0a0a0a] p-8 md:p-10 text-center">
          <h3 className="font-bebas text-2xl tracking-wide text-white mb-2">
            Ready to Hit the Road?
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Browse our fleet and book your dream car today.
          </p>
          <Link
            href="/cars"
            className="inline-flex rounded bg-[#ff5c00] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
          >
            Explore Fleet
          </Link>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-bebas text-2xl tracking-wide text-[#0a0a0a] mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-[#f2f2f0] bg-white p-5 transition-all hover:shadow-lg hover:border-[#ff5c00]/20"
                >
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold mb-3 ${categoryColors[related.category]}`}>
                    {related.category}
                  </span>
                  <h4 className="font-bebas text-lg tracking-wide text-[#0a0a0a] group-hover:text-[#ff5c00] transition-colors mb-2">
                    {related.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
