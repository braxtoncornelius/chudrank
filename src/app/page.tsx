export const dynamic = "force-dynamic";

import ClientHome from "./client-home";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Midnight in Central Time (handles CST/CDT automatically)
  const now = new Date();

  const centralNow = new Date(
    now.toLocaleString("en-US", {
      timeZone: "America/Chicago",
    })
  );

  centralNow.setHours(0, 0, 0, 0);

  const startOfToday = centralNow;

  // Leaderboard data (today only)
  const people = await prisma.person.findMany({
    include: {
      votesReceived: {
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      },
    },
  });

  // Activity feed (today only)
  const activity = await prisma.vote.findMany({
    where: {
      createdAt: {
        gte: startOfToday,
      },
    },
    include: {
      actor: true,
      target: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const rankings = people
    .map((person) => ({
      ...person,
      score: person.votesReceived.reduce(
        (sum, vote) => sum + vote.points,
        0
      ),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <ClientHome
      people={rankings}
      activity={activity}
    />
  );
}