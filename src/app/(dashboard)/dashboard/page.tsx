"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, PlusCircle, Users, WalletCards } from "lucide-react";
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
  rounds?: { scheduledAt: string; status: string }[];
  _count?: { members: number };
};

const currencyFormatter = new Intl.NumberFormat("fr-FR");

export default function DashboardPage() {
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
        toast.error("Impossible de récupérer vos tontines.");
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  const monthlyContributions = groups.reduce((total, group) => {
    return total + group.amount * (group.frequency === "hebdomadaire" ? 4 : 1);
  }, 0);

  const nextRound = groups
    .flatMap((group) =>
      (group.rounds || []).map((round) => ({
        groupName: group.name,
        scheduledAt: round.scheduledAt,
        status: round.status,
      })),
    )
    .filter((round) => round.status !== "completed")
    .sort(
      (first, second) =>
        new Date(first.scheduledAt).getTime() -
        new Date(second.scheduledAt).getTime(),
    )[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Tableau de bord
          </h2>
          <p className="text-muted-foreground">
            Aperçu de vos groupes, cotisations et prochains tours.
          </p>
        </div>
        <Button asChild className="bg-green-600 text-white hover:bg-green-700">
          <Link href="/groups/new">
            <PlusCircle className="size-4" aria-hidden="true" />
            Créer un groupe
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Nombre de groupes"
          value={loading ? "..." : String(groups.length)}
          description="Tontines dont vous êtes membre"
          icon={Users}
        />
        <StatCard
          title="Cotisations du mois"
          value={
            loading
              ? "..."
              : `${currencyFormatter.format(monthlyContributions)} FCFA`
          }
          description="Estimation selon la fréquence"
          icon={WalletCards}
          highlight
        />
        <StatCard
          title="Prochain tour"
          value={
            loading
              ? "..."
              : nextRound
                ? new Date(nextRound.scheduledAt).toLocaleDateString("fr-FR")
                : "Aucun"
          }
          description={nextRound ? nextRound.groupName : "Aucun tour planifié"}
          icon={CalendarClock}
        />
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Mes groupes de tontine</CardTitle>
          <CardDescription>
            Tous les groupes auxquels vous participez actuellement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : groups.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold">{group.name}</h3>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {group.description || "Aucune description"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end sm:text-right">
                    <div>
                      <p className="font-semibold">
                        {currencyFormatter.format(group.amount)} FCFA
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {group.frequency}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      {group._count?.members ?? 0}/{group.maxMembers} membres
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  highlight,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Users;
  highlight?: boolean;
}) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-5 text-green-600" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div
          className={
            highlight
              ? "text-2xl font-bold text-green-600"
              : "text-2xl font-bold"
          }
        >
          {value}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="mb-4 size-10 text-green-600" aria-hidden="true" />
      <h3 className="text-lg font-semibold">Aucun groupe de tontine</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Vous n&apos;êtes membre d&apos;aucune tontine pour le moment.
      </p>
      <Button asChild className="mt-4 bg-green-600 text-white hover:bg-green-700">
        <Link href="/groups/new">Créer un groupe</Link>
      </Button>
    </div>
  );
}
