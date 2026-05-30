import { prisma } from "@/lib/prisma";
import ClientHome from "./client-home";

export default async function Home() {
  const people =
    await prisma.person.findMany({
      include: {
        votesReceived: true,
      },
    });

  const rankings = people
    .map((person) => ({
      id: person.id,
      name: person.name,
      score:
        person.votesReceived.reduce(
          (sum, vote) =>
            sum + vote.points,
          0
        ),
    }))
    .sort((a, b) => b.score - a.score);

  const activity =
    await prisma.vote.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        actor: true,
        target: true,
      },
    });

  return (
    <ClientHome
      people={rankings}
      activity={activity}
    />
  );
}