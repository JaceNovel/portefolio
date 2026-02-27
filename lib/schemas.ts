import { z } from "zod";

export const auditRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  websiteUrl: z.string().trim().url().max(500),
  description: z.string().trim().min(10).max(4000),
  rgpd: z.boolean(),
  hp: z.string().optional().default(""),
});

export const siteTypeSchema = z.enum(["vitrine", "ecommerce", "sur-mesure"]);

export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  siteType: siteTypeSchema,
  pageCount: z.number().int().min(1).max(50),
  options: z.object({
    blog: z.boolean().default(false),
    paiement: z.boolean().default(false),
    espaceMembre: z.boolean().default(false),
    maintenance: z.boolean().default(false),
  }),
  rgpd: z.boolean(),
  hp: z.string().optional().default(""),
});

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40).optional().or(z.literal("")),
  requestType: z.string().trim().min(2).max(80),
  budget: z.string().trim().min(1).max(80),
  description: z.string().trim().min(10).max(4000),
  rgpd: z.boolean(),
  hp: z.string().optional().default(""),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});

export const clientLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});

export const clientResetPasswordSchema = z.object({
  password: z.string().min(8).max(200),
});

export const webDesignRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40).optional().or(z.literal("")),
  websiteType: z.enum(["business", "ecommerce", "custom"]),
  pageCount: z.number().int().min(1).max(50),
  options: z.object({
    blog: z.boolean().default(false),
    paymentGateway: z.boolean().default(false),
    adminPanel: z.boolean().default(false),
    seoOptimization: z.boolean().default(false),
  }),
  branding: z.object({
    primaryColor: z.string().trim().min(1).max(30),
    secondaryColor: z.string().trim().min(1).max(30),
    logoFileName: z.string().trim().max(200).optional().or(z.literal("")),
    logoDataUrl: z.string().trim().max(900000).optional().or(z.literal("")),
  }),
  stack: z.string().trim().min(1).max(60),
  message: z.string().trim().min(0).max(4000),
  estimate: z.object({
    min: z.number().int().min(0).max(5000),
    max: z.number().int().min(0).max(5000),
  }),
  rgpd: z.boolean(),
  hp: z.string().optional().default(""),
});

export const blogPostInputSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().min(20).max(200000),
  published: z.boolean().default(false),
});

export const clientMessageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const adminCreateClientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
});

export const adminCreateProjectSchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(2000),
  progress: z.number().int().min(0).max(100).default(0),
});

export const adminAddProjectFileSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  url: z.string().trim().url().max(2000),
});

export const webProjectSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(2000),
  imageUrl: z.string().trim().url().max(2000),
  siteUrl: z.string().trim().url().max(2000),
  stack: z.string().trim().min(3).max(400),
  result: z.string().trim().min(3).max(800),
});
