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
    vitrine: 48000,
    ecommerce: 96000,
    "sur-mesure": 132000,
  } satisfies Record<SiteType, number>,
  perPageCents: 7200,
  optionsCents: {
    blog: 15000,
    paiement: 27000,
    espaceMembre: 36000,
    maintenance: 12000,
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
