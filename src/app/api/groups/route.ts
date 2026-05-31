import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_FREQUENCIES = new Set(["hebdomadaire", "mensuelle"]);

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        rounds: {
          select: {
            scheduledAt: true,
            status: true,
          },
          orderBy: {
            scheduledAt: "asc",
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) || "Erreur serveur" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
    const amount = Number(body.amount);
    const frequency = String(body.frequency || "");
    const maxMembers = Number(body.maxMembers);

    if (!name || !amount || !frequency || !maxMembers) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Le montant doit être supérieur à 0" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(maxMembers) || maxMembers < 2) {
      return NextResponse.json(
        { error: "Le groupe doit accepter au moins 2 membres" },
        { status: 400 },
      );
    }

    if (!ALLOWED_FREQUENCIES.has(frequency)) {
      return NextResponse.json(
        { error: "Fréquence invalide" },
        { status: 400 },
      );
    }

    const group = await prisma.$transaction(async (tx) => {
      const createdGroup = await tx.group.create({
        data: {
          name,
          description,
          amount,
          frequency,
          maxMembers,
          ownerId: session.user.id,
        },
      });

      const ownerMember = await tx.member.create({
        data: {
          userId: session.user.id,
          groupId: createdGroup.id,
          order: 1,
        },
      });

      const today = new Date();
      const rounds = Array.from({ length: maxMembers }, (_, index) => {
        const scheduledAt = new Date(today);

        if (frequency === "hebdomadaire") {
          scheduledAt.setDate(today.getDate() + index * 7);
        } else {
          scheduledAt.setMonth(today.getMonth() + index);
        }

        return {
          roundNumber: index + 1,
          scheduledAt,
          groupId: createdGroup.id,
          recipientId: ownerMember.id,
          status: "upcoming",
        };
      });

      await tx.round.createMany({ data: rounds });

      return createdGroup;
    });

    return NextResponse.json(group, { status: 201 });
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
