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
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Veuillez renseigner l'email du membre" },
        { status: 400 },
      );
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Groupe introuvable" }, { status: 404 });
    }

    const requesterIsMember = group.members.some(
      (member: { userId: string }) => member.userId === session.user.id,
    );

    if (!requesterIsMember) {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    if (group.members.length >= group.maxMembers) {
      return NextResponse.json(
        { error: "Ce groupe a deja atteint le nombre maximum de membres" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun utilisateur n'existe avec cet email" },
        { status: 404 },
      );
    }

    const alreadyMember = group.members.some(
      (member: { userId: string }) => member.userId === user.id,
    );

    if (alreadyMember) {
      return NextResponse.json(
        { error: "Cet utilisateur est deja membre du groupe" },
        { status: 400 },
      );
    }

    const nextOrder =
      Math.max(0, ...group.members.map((member: { order: number }) => member.order)) +
      1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const member = await prisma.$transaction(async (tx: any) => {
      const createdMember = await tx.member.create({
        data: {
          userId: user.id,
          groupId: group.id,
          order: nextOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await tx.round.updateMany({
        where: {
          groupId: group.id,
          roundNumber: nextOrder,
        },
        data: {
          recipientId: createdMember.id,
        },
      });

      return createdMember;
    });

    return NextResponse.json(member, { status: 201 });
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
