"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  person: {
    id: string;
    name: string;
    score?: number;
  };
  actorId: string;
  onClose: () => void;
  onVote: () => void | Promise<void>;
};

export function VoteSheet({
  person,
  actorId,
  onClose,
  onVote,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  async function castVote(points: number) {
    if (!actorId) {
      alert("Choose your identity first 😈");
      return;
    }

    if (actorId === person.id) {
      alert("No self-chudding allowed.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actorId,
          targetId: person.id,
          points,
          reason,
        }),
      });

      if (!res.ok) {
        throw new Error("Vote failed");
      }

      await onVote();
    } catch (err) {
      console.error(err);
      alert("Something broke while casting chud 😭");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent className="bg-zinc-950 border-zinc-800 text-white">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold text-white">
            Vote on {person.name}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Positive Votes */}
          <div>
            <h3 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
              Add Chud 😈
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={loading}
                onClick={() => castVote(1)}
                className="h-16 text-lg"
              >
                +1
              </Button>

              <Button
                disabled={loading}
                onClick={() => castVote(2)}
                className="h-16 text-lg"
              >
                +2
              </Button>

              <Button
                disabled={loading}
                onClick={() => castVote(5)}
                className="h-16 text-lg bg-red-700 hover:bg-red-600"
              >
                +5 🚨
              </Button>

              <Button
                disabled={loading}
                onClick={() => castVote(10)}
                className="h-16 text-lg bg-red-900 hover:bg-red-800"
              >
                +10 ☢️
              </Button>
            </div>
          </div>

          {/* Negative Votes */}
          <div>
            <h3 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
              Redemption 😇
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={loading}
                variant="secondary"
                onClick={() => castVote(-1)}
                className="h-16 text-lg"
              >
                -1 ⭐
              </Button>

              <Button
                disabled={loading}
                variant="secondary"
                onClick={() => castVote(-2)}
                className="h-16 text-lg"
              >
                -2 🙏
              </Button>

              <Button
                disabled={loading}
                variant="secondary"
                onClick={() => castVote(-5)}
                className="h-16 text-lg"
              >
                -5 👼
              </Button>

              <Button
                disabled={loading}
                variant="secondary"
                onClick={() => castVote(-10)}
                className="h-16 text-lg"
              >
                -10 🕊️
              </Button>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
              Reason (optional)
            </h3>

            <Textarea
              placeholder="Why are they being chudded?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-zinc-900 border-zinc-700 min-h-[120px]"
            />
          </div>

          {/* Cancel */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full mt-6"
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}