import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { prisma } from "./prisma";

const prismaClient = prisma || new PrismaClient();

const productionUrl = "https://tonti-net.vercel.app";

const appUrl =
  process.env.APP_URL ||
  process.env.BETTER_AUTH_URL ||
  productionUrl;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const resendFrom =
  process.env.RESEND_FROM_EMAIL ||
  "TONTI-NET <onboarding@resend.dev>";

export const auth = betterAuth({
  baseURL: appUrl,

  trustedOrigins: [
    productionUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],

  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,

    minPasswordLength: 8,
    maxPasswordLength: 128,

    resetPasswordTokenExpiresIn: 60 * 15,
    revokeSessionsOnPasswordReset: true,

    async sendResetPassword({ user, token }) {
      if (!user?.email || !resend) {
        console.warn("Reset password email not sent (missing config).");
        return;
      }

      const baseUrl = process.env.APP_URL || productionUrl;

      const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(
        token
      )}`;

      await resend.emails.send({
        from: resendFrom,
        to: user.email,
        subject: "Réinitialisation de votre mot de passe TONTI-NET",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
            <h1 style="font-size:20px">Réinitialisation du mot de passe</h1>

            <p>Bonjour ${escapeHtml(user.name || "utilisateur")},</p>

            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>

            <p>
              <a href="${resetUrl}" 
                 style="display:inline-block;background:#16a34a;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:700">
                Réinitialiser mon mot de passe
              </a>
            </p>

            <p>Ce lien expire dans 15 minutes.</p>

            <p style="color:#6b7280;font-size:12px">
              Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.
            </p>
          </div>
        `,
      });
    },
  },

  rateLimit: {
    enabled: true,
    storage: "database",

    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 5,
      },
      "/sign-up/email": {
        window: 60,
        max: 3,
      },
      "/request-password-reset": {
        window: 60,
        max: 2,
      },
    },
  },
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}