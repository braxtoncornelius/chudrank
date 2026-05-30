type Person = {
  id: string;
  name: string;
};

type Props = {
  people: Person[];
  actorId: string;
  setActorId: (
    id: string
  ) => void;
};

export function IdentityPicker({
  people,
  actorId,
  setActorId,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-400">
        Switch User
      </span>

      <select
        value={actorId}
        onChange={(e) =>
          setActorId(e.target.value)
        }
        className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
      >
        <option value="">
          Select user
        </option>

        {people.map((person) => (
          <option
            key={person.id}
            value={person.id}
          >
            {person.name}
          </option>
        ))}
      </select>
    </div>
  );
}