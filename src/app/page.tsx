export const dynamic = "force-dynamic";

import ClientHome from "./client-home";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const now = new Date();

  // Current time in Chicago
  const chicagoTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "America/Chicago",
    })
  );

  // Midnight Chicago time
  const startOfToday = new Date(chicagoTime);
  startOfToday.setHours(0, 0, 0, 0);

  // Debug logs
  console.log("NOW:", now.toISOString());
  console.log("CHICAGO:", chicagoTime.toString());
  console.log(
    "START OF TODAY:",
    startOfToday.toString()
  );

  // Leaderboard scores (today only)
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