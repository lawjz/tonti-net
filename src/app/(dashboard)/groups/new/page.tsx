"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [frequency, setFrequency] = React.useState("mensuelle");
  const [maxMembers, setMaxMembers] = React.useState("10");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);
    const parsedMaxMembers = Number(maxMembers);

    if (!name.trim() || !parsedAmount || !parsedMaxMembers) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (parsedAmount <= 0) {
      toast.error("Le montant de cotisation doit être supérieur à 0.");
      return;
    }

    if (parsedMaxMembers < 2) {
      toast.error("Une tontine doit avoir au moins 2 membres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          amount: parsedAmount,
          frequency,
          maxMembers: parsedMaxMembers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Création impossible");
      }

      toast.success("Groupe de tontine créé avec succès.");
      router.push(`/groups/${data.id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Créer une nouvelle tontine
        </h2>
        <p className="text-sm text-muted-foreground">
          Définissez les règles de cotisation, la fréquence et le nombre de
          participants.
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Configuration du groupe</CardTitle>
          <CardDescription>
            Ces informations seront visibles par les membres de la tontine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du groupe *</Label>
              <Input
                id="name"
                placeholder="Tontine solidaire Bamako"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Objectif du groupe, règles internes, zone géographique..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant de cotisation (FCFA) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="50000"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Fréquence *</Label>
                <select
                  id="frequency"
                  className="flex h-8 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={frequency}
                  onChange={(event) => setFrequency(event.target.value)}
                  disabled={loading}
                >
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuelle">Mensuelle</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers">Nombre maximum de membres *</Label>
              <Input
                id="maxMembers"
                type="number"
                min="2"
                step="1"
                placeholder="10"
                value={maxMembers}
                onChange={(event) => setMaxMembers(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={loading}
              >
                <Save className="size-4" aria-hidden="true" />
                {loading ? "Création..." : "Créer le groupe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
