import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Groupe introuvable" },
        { status: 404 },
      );
    }

    if (group.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Seul le créateur du groupe peut ajouter un membre" },
        { status: 403 },
      );
    }

    if (group.members.length >= group.maxMembers) {
      return NextResponse.json(
        { error: "Le groupe a atteint sa capacité maximale" },
        { status: 400 },
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec cet email sur TONTI-NET" },
        { status: 404 },
      );
    }

    const alreadyMember = group.members.some(
      (member) => member.userId === targetUser.id,
    );

    if (alreadyMember) {
      return NextResponse.json(
        { error: "Cet utilisateur est déjà membre du groupe" },
        { status: 400 },
      );
    }

    const nextOrder = group.members.length + 1;

    const newMember = await prisma.$transaction(async (tx) => {
      const member = await tx.member.create({
        data: {
          userId: targetUser.id,
          groupId: group.id,
          order: nextOrder,
        },
      });

      await tx.round.updateMany({
        where: {
          groupId: group.id,
          roundNumber: nextOrder,
        },
        data: {
          recipientId: member.id,
        },
      });

      return member;
    });

    return NextResponse.json(newMember, { status: 201 });
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
