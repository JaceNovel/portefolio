import { Resend } from "resend";
import { getServerEnv } from "./env";

function getResend() {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) return null;
  return { client: new Resend(env.RESEND_API_KEY), from: env.RESEND_FROM };
}

export async function sendAuditReceiptEmail(params: { to: string; name: string; websiteUrl: string }) {
  const resend = getResend();
  if (!resend) return;

  await resend.client.emails.send({
    from: resend.from,
    to: params.to,
    subject: "Demande d’audit sécurité reçue",
    text: `Bonjour ${params.name},\n\nVotre demande d’audit sécurité a bien été reçue pour: ${params.websiteUrl}.\n\nJe reviens vers vous rapidement.\n\n— Jonadab AMAH`,
  });
}

export async function sendQuoteReceiptEmail(params: { to: string; name: string; estimateEuros: string }) {
  const resend = getResend();
  if (!resend) return;

  await resend.client.emails.send({
    from: resend.from,
    to: params.to,
    subject: "Demande de devis reçue",
    text: `Bonjour ${params.name},\n\nVotre demande de devis a bien été reçue. Estimation: ${params.estimateEuros}.\n\nJe reviens vers vous rapidement.\n\n— Jonadab AMAH`,
  });
}

export async function sendClientAccessEmail(params: { to: string; name: string; tempPassword: string; loginUrl: string }) {
  const resend = getResend();
  if (!resend) return;

  await resend.client.emails.send({
    from: resend.from,
    to: params.to,
    subject: "Accès à votre espace client",
    text: `Bonjour ${params.name},\n\nVotre projet a été validé. Voici vos accès à l’espace client :\n\nLien: ${params.loginUrl}\nEmail: ${params.to}\nMot de passe temporaire: ${params.tempPassword}\n\nPour des raisons de sécurité, vous devrez changer ce mot de passe lors de votre première connexion.\n\n— Jonadab AMAH`,
  });
}
