"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  MailPlus,
  ReceiptText,
} from "lucide-react";
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

type User = {
  id: string;
  name: string;
  email: string;
};

type Member = {
  id: string;
  joinedAt: string;
  order: number;
  user: User;
};

type Round = {
  id: string;
  roundNumber: number;
  scheduledAt: string;
  status: string;
  recipient: Member;
};

type Contribution = {
  id: string;
  amount: number;
  paidAt: string;
  status: string;
  member: Member;
};

type GroupDetails = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  frequency: string;
  maxMembers: number;
  members: Member[];
  rounds: Round[];
  contributions: Contribution[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR");

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const groupId = params.id;

  const [group, setGroup] = React.useState<GroupDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [newMemberEmail, setNewMemberEmail] = React.useState("");
  const [addingMember, setAddingMember] = React.useState(false);
  const [selectedMemberId, setSelectedMemberId] = React.useState("");
  const [recordingContribution, setRecordingContribution] =
    React.useState(false);

  const fetchGroupDetails = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);

      if (!response.ok) {
        throw new Error("Impossible de charger les détails du groupe");
      }

      const data = (await response.json()) as GroupDetails;
      setGroup(data);
      setSelectedMemberId((current) => current || data.members[0]?.id || "");
    } catch {
      toast.error("Erreur de récupération des informations.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  async function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newMemberEmail.trim()) {
      toast.error("Veuillez saisir l'email du membre.");
      return;
    }

    setAddingMember(true);

    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newMemberEmail.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ajout impossible");
      }

      toast.success("Membre ajouté avec succès.");
      setNewMemberEmail("");
      await fetchGroupDetails();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur serveur.");
    } finally {
      setAddingMember(false);
    }
  }

  async function handleRecordContribution(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedMemberId || !group) {
      toast.error("Veuillez sélectionner un membre.");
      return;
    }

    setRecordingContribution(true);

    try {
      const response = await fetch(`/api/groups/${groupId}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: selectedMemberId,
          amount: group.amount,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Enregistrement impossible");
      }

      toast.success("Cotisation enregistrée avec succès.");
      await fetchGroupDetails();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la cotisation.",
      );
    } finally {
      setRecordingContribution(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-9 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-lg font-semibold">Groupe introuvable</h2>
        <Button
          onClick={() => router.push("/dashboard")}
          className="mt-4 bg-green-600 text-white hover:bg-green-700"
        >
          Retour au tableau de bord
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{group.name}</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {group.frequency}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {group.description || "Aucune description renseignée."}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Montant de cotisation
          </p>
          <p className="text-2xl font-bold text-green-600">
            {currencyFormatter.format(group.amount)} FCFA
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>Membres du groupe</CardTitle>
                <CardDescription>
                  Participants et ordre de passage dans la tontine.
                </CardDescription>
              </div>
              <span className="rounded bg-muted px-2 py-1 text-xs font-bold">
                {group.members.length}/{group.maxMembers}
              </span>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                        {member.order}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {member.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      Tour {member.order}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Calendrier des tours</CardTitle>
              <CardDescription>
                Planification des bénéficiaires de la cagnotte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {group.rounds.map((round) => (
                  <div
                    key={round.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <CalendarClock
                        className="mt-0.5 size-5 text-green-600"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-semibold">
                          Tour {round.roundNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date prévue :{" "}
                          {new Date(round.scheduledAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">
                        {round.recipient.user.name}
                      </p>
                      <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-800">
                        {round.status === "completed" ? "Terminé" : "À venir"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Ajouter un membre</CardTitle>
              <CardDescription>Inviter une personne par email.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    value={newMemberEmail}
                    onChange={(event) => setNewMemberEmail(event.target.value)}
                    disabled={addingMember}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  disabled={addingMember}
                >
                  <MailPlus className="size-4" aria-hidden="true" />
                  {addingMember ? "Ajout..." : "Ajouter au groupe"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Enregistrer une cotisation</CardTitle>
              <CardDescription>Noter le paiement d&apos;un membre.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRecordContribution} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="memberSelect">Membre</Label>
                  <select
                    id="memberSelect"
                    className="flex h-8 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedMemberId}
                    onChange={(event) => setSelectedMemberId(event.target.value)}
                    disabled={recordingContribution || group.members.length === 0}
                  >
                    {group.members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.user.name} - Tour {member.order}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  disabled={recordingContribution || group.members.length === 0}
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {recordingContribution
                    ? "Enregistrement..."
                    : `Confirmer ${currencyFormatter.format(group.amount)} FCFA`}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Historique des cotisations</CardTitle>
              <CardDescription>
                Tous les versements enregistrés pour ce groupe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {group.contributions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Aucune cotisation enregistrée.
                  </div>
                ) : (
                  group.contributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between gap-4 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <ReceiptText
                          className="size-4 text-green-600"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {contribution.member.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(contribution.paidAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-green-600">
                        {currencyFormatter.format(contribution.amount)} FCFA
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
