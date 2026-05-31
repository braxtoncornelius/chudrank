"use client";

import { useEffect, useState } from "react";
import { IdentityPicker } from "@/components/identity-picker";
import { VoteSheet } from "@/components/vote-sheet";

type Person = {
  id: string;
  name: string;
  score: number;
};

type Vote = {
  id: string;
  points: number;
  reason?: string | null;
  createdAt: Date;
  actor: {
    id: string;
    name: string;
  };
  target: {
    id: string;
    name: string;
  };
};

type Props = {
  people: Person[];
  activity?: Vote[];
};

export default function ClientHome({
  people: initialPeople,
  activity = [],
}: Props) {
  const [people, setPeople] =
    useState(initialPeople);

  const [selectedPerson, setSelectedPerson] =
    useState<Person | null>(null);

  const [actorId, setActorId] =
    useState("");

  // Persist selected user
  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        "chudrank-user"
      );

    if (savedUser) {
      setActorId(savedUser);
    }
  }, []);

  useEffect(() => {
    if (actorId) {
      localStorage.setItem(
        "chudrank-user",
        actorId
      );
    }
  }, [actorId]);

  useEffect(() => {
    setPeople(initialPeople);
  }, [initialPeople]);

  const currentChud = people[0];

  function getChudStatus(score: number) {
    if (score >= 20) {
      return {
        label: "☢️ FEDERAL CHUD ☢️",
        card:
          "bg-gradient-to-r from-red-950 via-red-900 to-orange-950 border-red-500 shadow-lg shadow-red-900/50",
        text: "text-red-300",
      };
    }

    if (score >= 10) {
      return {
        label:
          "🚨 UNDER INVESTIGATION 🚨",
        card:
          "bg-gradient-to-r from-red-950 to-red-900/30 border-red-700 shadow-lg shadow-red-900/30",
        text: "text-red-300",
      };
    }

    if (score >= 5) {
      return {
        label:
          "😈 CERTIFIED CHUD 😈",
        card:
          "bg-orange-900/20 border-orange-700",
        text: "text-orange-300",
      };
    }

    if (score <= -5) {
      return {
        label:
          "😇 FAMILY HERO 😇",
        card:
          "bg-green-900/20 border-green-700",
        text: "text-green-300",
      };
    }

    return {
      label: "Neutral Civilian",
      card:
        "bg-zinc-900 border-zinc-800",
      text: "text-zinc-400",
    };
  }

  async function refreshRankings() {
    window.location.reload();
  }

  const currentUser =
    people.find(
      (p) => p.id === actorId
    )?.name ?? "Nobody";

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-display)] tracking-tight">
              ChudRank 😈
            </h1>

            <p className="text-zinc-400 mt-2">
              Logged in as{" "}
              <span className="text-white font-semibold">
                {currentUser}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
          

            <IdentityPicker
              people={people}
              actorId={actorId}
              setActorId={setActorId}
            />

            <button
              onClick={() => {
                localStorage.removeItem(
                  "chudrank-user"
                );
                setActorId("");
              }}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition"
            >
              Switch User
            </button>
          </div>
        </div>

        {/* Current Chud */}
        {currentChud && (
          <div
            className={`rounded-3xl border p-8 mb-8 transition-all ${
              getChudStatus(
                currentChud.score
              ).card
            }`}
          >
            <p className="text-zinc-400 text-sm uppercase tracking-wide mb-2">
              Current Chud 👑
            </p>

            <h2 className="text-5xl font-bold mb-4 font-[family-name:var(--font-display)]">
              {currentChud.name}
            </h2>

            <p className="text-2xl mb-3 text-zinc-300">
              {currentChud.score} points
            </p>

            <div
              className={`font-semibold text-lg ${
                getChudStatus(
                  currentChud.score
                ).text
              }`}
            >
              {
                getChudStatus(
                  currentChud.score
                ).label
              }
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-4 mb-12">
          {people.map(
            (person, index) => {
              const status =
                getChudStatus(
                  person.score
                );

              return (
                <button
                  key={person.id}
                  onClick={() =>
                    setSelectedPerson(
                      person
                    )
                  }
                  className={`w-full rounded-3xl border p-6 text-left transition hover:scale-[1.01] active:scale-[0.99] ${
                    status.card
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-3xl font-bold font-[family-name:var(--font-display)]">
                        #{index + 1}{" "}
                        {person.name}
                      </h3>

                      <p
                        className={`mt-2 font-medium ${status.text}`}
                      >
                        {
                          status.label
                        }
                      </p>
                    </div>

                    <div className="text-5xl font-bold">
                      {person.score}
                    </div>
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-4xl font-bold mb-6 font-[family-name:var(--font-display)]">
            Activity Feed 🔥
          </h2>

          <div className="space-y-4">
            {activity.length ===
              0 && (
              <div className="text-zinc-500">
                No family drama yet.
              </div>
            )}

            {activity.map(
              (vote) => (
                <div
                  key={vote.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <div className="font-bold text-xl">
                    {
                      vote.actor
                        .name
                    }{" "}
                    →{" "}
                    {
                      vote.target
                        .name
                    }
                    <span
                      className={
                        vote.points >
                        0
                          ? "text-red-400"
                          : "text-green-400"
                      }
                    >
                      {" "}
                      {vote.points >
                      0
                        ? "+"
                        : ""}
                      {
                        vote.points
                      }
                    </span>
                  </div>

                  {vote.reason && (
                    <div className="text-zinc-400 italic mt-2">
                      "
                      {
                        vote.reason
                      }
                      "
                    </div>
                  )}

                  <div className="text-xs text-zinc-500 mt-3">
                    {new Date(
                      vote.createdAt
                    ).toLocaleString()}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      {selectedPerson && (
        <VoteSheet
          person={
            selectedPerson
          }
          actorId={actorId}
          onClose={() =>
            setSelectedPerson(
              null
            )
          }
          onVote={async () => {
            setSelectedPerson(
              null
            );
            await refreshRankings();
          }}
        />
      )}
    </main>
  );
}