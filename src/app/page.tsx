export const dynamic = "force-dynamic";

import ClientHome from "./client-home";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Calculate midnight in America/Chicago
  const now = new Date();

  const centralDate = new Date(
    now.toLocaleString("en-US", {
      timeZone: "America/Chicago",
    })
  );

  centralDate.setHours(0, 0, 0, 0);

  const people = await prisma.person.findMany({
    include: {
      votesReceived: {
        where: {
          createdAt: {
            gte: centralDate,
          },
        },
      },
    },
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

  return <ClientHome people={rankings} />;
}