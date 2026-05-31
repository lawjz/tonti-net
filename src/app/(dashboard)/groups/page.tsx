"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, PlusCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Group = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  frequency: string;
  maxMembers: number;
  _count?: { members: number };
};

const currencyFormatter = new Intl.NumberFormat("fr-FR");

export default function GroupsListPage() {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await fetch("/api/groups");

        if (!response.ok) {
          throw new Error("Erreur de chargement");
        }

        const data = (await response.json()) as Group[];
        setGroups(data);
      } catch {
        toast.error("Impossible de charger les groupes.");
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Mes groupes de tontine
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualisez toutes les tontines dont vous faites partie.
          </p>
        </div>
        <Button asChild className="bg-green-600 text-white hover:bg-green-700">
          <Link href="/groups/new">
            <PlusCircle className="size-4" aria-hidden="true" />
            Créer un groupe
          </Link>
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Liste des groupes</CardTitle>
          <CardDescription>
            Montant, nombre de membres et statut de chaque tontine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <div className="h-14 animate-pulse rounded-lg bg-muted" />
              <div className="h-14 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 size-10 text-green-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Aucun groupe trouvé</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Vous n&apos;avez pas encore rejoint ou créé de groupe de tontine.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Nom du groupe</th>
                    <th className="px-4 py-3 font-medium">Montant</th>
                    <th className="px-4 py-3 font-medium">Membres</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {groups.map((group) => {
                    const memberCount = group._count?.members ?? 0;
                    const isFull = memberCount >= group.maxMembers;

                    return (
                      <tr
                        key={group.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={`/groups/${group.id}`}
                            className="font-semibold hover:text-green-700"
                          >
                            {group.name}
                          </Link>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {group.description || "Aucune description"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold">
                            {currencyFormatter.format(group.amount)} FCFA
                          </p>
                          <p className="text-xs capitalize text-muted-foreground">
                            {group.frequency}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          {memberCount} / {group.maxMembers}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                            {isFull ? "Complet" : "Actif"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/groups/${group.id}`}>
                              Détails
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
