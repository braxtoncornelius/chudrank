export const dynamic = "force-dynamic";

import ClientHome from "./client-home";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const people = await prisma.person.findMany({
    include: {
      votesReceived: true,
    },
  });

  const rankings = people
    .map((person) => ({
      ...person,
      score: person.votesReceived.reduce(
        (sum, vote) => sum + vote.score,
        0
      ),
    }))
    .sort((a, b) => b.score - a.score);

  return <ClientHome rankings={rankings} />;
}
