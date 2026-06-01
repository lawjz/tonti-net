"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  PASSWORD_REQUIREMENTS,
  validatePasswordStrength,
} from "@/lib/password-policy";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      toast.error("Lien de reinitialisation invalide ou expire.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    const passwordError = validatePasswordStrength(password);

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!response.ok) {
        toast.error("Lien de reinitialisation invalide ou expire.");
        return;
      }

      toast.success("Mot de passe reinitialise avec succes.");
      router.push("/login");
    } catch {
      toast.error("Impossible de reinitialiser le mot de passe.");
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
              Nouveau mot de passe
            </CardTitle>
            <CardDescription>
              Choisissez un mot de passe robuste pour votre compte.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
              Ce lien est invalide. Demandez un nouveau lien de reinitialisation.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  {PASSWORD_REQUIREMENTS}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 font-semibold text-white hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Reinitialisation..." : "Definir le mot de passe"}
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
