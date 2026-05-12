"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blog";

const categories = ["All", "Travel", "Cars", "Tips", "Routes"] as const;

const categoryColors: Record<string, string> = {
  Travel: "bg-blue-100 text-blue-700",
  Cars: "bg-orange-100 text-[#ff5c00]",
  Tips: "bg-green-100 text-green-700",
  Routes: "bg-purple-100 text-purple-700",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  const featuredPost = blogPosts.find((p) => p.featured);
  const restPosts = filtered.filter((p) => p !== featuredPost || activeCategory !== "All");

  return (
    <section className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-bebas text-5xl tracking-wide text-[#0a0a0a] md:text-6xl">
            JOURNAL
          </h1>
          <p className="mt-2 max-w-xl text-gray-500">
            Travel guides, driving routes, and insider tips for exploring Morocco in style.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#0a0a0a] text-white"
                  : "bg-[#f2f2f0] text-[#0a0a0a]/60 hover:text-[#0a0a0a]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post (only on "All" tab) */}
        {activeCategory === "All" && featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group mb-12 block rounded-2xl overflow-hidden border border-[#f2f2f0] transition-shadow hover:shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Content */}
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[featuredPost.category]}`}>
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-gray-400">Featured</span>
                </div>
                <h2 className="font-bebas text-3xl tracking-wide text-white md:text-4xl group-hover:text-[#ff5c00] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="mt-3 max-w-2xl text-gray-400 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
                  <span>{featuredPost.author}</span>
                  <span>&middot;</span>
                  <span>{new Date(featuredPost.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  <span>&middot;</span>
                  <span>{featuredPost.readTime} min read</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#ff5c00] group-hover:gap-3 transition-all">
                  Read article &rarr;
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Posts grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(activeCategory === "All" ? restPosts.filter((p) => p !== featuredPost) : restPosts).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-[#f2f2f0] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[#ff5c00]/20"
            >
              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {post.readTime} min read
                  </span>
                </div>

                <h3 className="font-bebas text-xl tracking-wide text-[#0a0a0a] group-hover:text-[#ff5c00] transition-colors mb-3">
                  {post.title}
                </h3>

                <p className="flex-1 text-sm leading-relaxed text-gray-500 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between border-t border-[#f2f2f0] pt-4">
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="text-xs font-medium text-[#ff5c00] group-hover:translate-x-1 transition-transform">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-20">
            No posts in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
