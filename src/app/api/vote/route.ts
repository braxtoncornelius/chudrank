import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      actorId,
      targetId,
      points,
      reason,
      comment,
    } = body;

    if (actorId === targetId) {
      return NextResponse.json(
        { error: "No self-voting allowed" },
        { status: 400 }
      );
    }

    await prisma.vote.create({
      data: {
        actorId,
        targetId,
        points,
        reason,
        comment,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Vote failed" },
      { status: 500 }
    );
  }
}