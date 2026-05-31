import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// This safely extracts the Prisma Transaction client type without needing the Prisma namespace
type TransactionClient = Parameters<typeof prisma.$transaction>[0];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const memberId = typeof body.memberId === "string" ? body.memberId : "";
    const amount = Number(body.amount);

    if (!memberId || !amount) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Le montant doit être supérieur à 0" },
        { status: 400 },
      );
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Groupe introuvable" }, { status: 404 });
    }

    const requesterIsMember = group.members.some(
      (member: { userId: string }) => member.userId === session.user.id,
    );

    if (!requesterIsMember) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const targetMember = group.members.find(
      (member: { id: string; userId: string; order: number }) => member.id === memberId,
    );

    if (!targetMember) {
      return NextResponse.json(
        { error: "Ce membre n'appartient pas au groupe" },
        { status: 400 },
      );
    }

    // Using the custom TransactionClient type here
    const contribution = await prisma.$transaction(
      async (tx: TransactionClient) => {
        const createdContribution = await tx.contribution.create({
          data: {
            amount,
            memberId,
            groupId: group.id,
            status: "paid",
          },
          include: {
            member: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        await tx.round.updateMany({
          where: {
            groupId: group.id,
            roundNumber: targetMember.order,
          },
          data: {
            status: "completed",
          },
        });

        return createdContribution;
      },
    );

    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) || "Erreur serveur" },
      { status: 500 },
    );
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : null;
}