import type { MetadataRoute } from "next";
import { prisma } from "../lib/prisma";

type SitemapBlogEntry = {
  slug: string;
  createdAt: Date;
};

type SitemapProjectEntry = {
  slug: string;
  createdAt: Date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/cybersecurity",
    "/web-design",
    "/audit-security",
    "/blog",
    "/contact",
    "/dashboard-admin/login",
    "/client-area/login",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [posts, projects]: [SitemapBlogEntry[], SitemapProjectEntry[]] = await Promise.all([
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, createdAt: true } }),
      prisma.webProject.findMany({ select: { slug: true, createdAt: true } }),
    ]);

    const blogRoutes = posts.map((post: SitemapBlogEntry) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const webProjectRoutes = projects.map((project: SitemapProjectEntry) => ({
      url: `${baseUrl}/web-design/${project.slug}`,
      lastModified: project.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...blogRoutes, ...webProjectRoutes];
  } catch {
    return staticRoutes;
  }
}
