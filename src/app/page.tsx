export const dynamic = "force-dynamic";

import ClientHome from "./client-home";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const now = new Date();

  // Get today's date in America/Chicago
  const chicagoDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  // Create midnight Chicago time (CDT/CST handled correctly)
  const startOfToday = new Date(
    `${chicagoDate}T00:00:00-05:00`
  );

  console.log("NOW:", now.toISOString());
  console.log(
    "START OF TODAY:",
    startOfToday.toISOString()
  );

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

  console.log(
    "TODAY'S VOTES:",
    activity.length
  );

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