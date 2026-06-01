"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SUCCESS_MESSAGE =
  "Si cette adresse existe, un lien de reinitialisation vient d'etre envoye.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Veuillez renseigner votre adresse email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          redirectTo: "https://tonti-net.vercel.app/reset-password",
        }),
      });

      if (response.status === 429) {
        toast.error("Trop de tentatives. Veuillez patienter avant de reessayer.");
        return;
      }

      setSent(true);
      toast.success(SUCCESS_MESSAGE);
    } catch {
      toast.error("Impossible de traiter la demande pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
            <Image
              src="/logo.jpeg"
              alt="Logo TONTI-NET"
              width={48}
              height={48}
              className="size-12 object-contain"
              priority
            />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Mot de passe oublie
            </CardTitle>
            <CardDescription>
              Recevez un lien securise valable pendant 15 minutes.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">
              {SUCCESS_MESSAGE}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 font-semibold text-white hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <Link href="/login" className="font-semibold text-green-700 hover:underline">
            Retour a la connexion
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
