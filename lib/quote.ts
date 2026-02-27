import { z } from "zod";
import { siteTypeSchema } from "./schemas";

export type SiteType = z.infer<typeof siteTypeSchema>;

export type QuoteOptions = {
  blog: boolean;
  paiement: boolean;
  espaceMembre: boolean;
  maintenance: boolean;
};

const pricing = {
  baseCents: {
    vitrine: 80000,
    ecommerce: 160000,
    "sur-mesure": 220000,
  } satisfies Record<SiteType, number>,
  perPageCents: 12000,
  optionsCents: {
    blog: 25000,
    paiement: 45000,
    espaceMembre: 60000,
    maintenance: 20000,
  } satisfies Record<keyof QuoteOptions, number>,
} as const;

export function computeEstimateCents(params: { siteType: SiteType; pageCount: number; options: QuoteOptions }) {
  const base = pricing.baseCents[params.siteType];
  const pages = Math.max(0, params.pageCount - 1) * pricing.perPageCents;

  const options = (Object.entries(params.options) as Array<[keyof QuoteOptions, boolean]>)
    .filter(([, enabled]) => enabled)
    .reduce((sum, [key]) => sum + pricing.optionsCents[key], 0);

  return base + pages + options;
}

export function formatEurosFromCents(cents: number) {
  const euros = (cents / 100).toFixed(0);
  return `${euros} €`;
}
