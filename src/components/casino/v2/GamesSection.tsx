import { cn } from "@/lib/utils/format";
import type { Casino } from "@/lib/types";

type GamesSectionProps = {
  games: Casino["games"];
  className?: string;
};

export function GamesSection({ games, className }: GamesSectionProps) {
  const availableGames = games.filter((g) => g.available);

  if (availableGames.length === 0) return null;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="games-section-title">
      <h2
        id="games-section-title"
        className="text-xl font-bold mb-4 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875S10.5 3.089 10.5 4.125c0 .369.128.713.349 1.003.215.283.401.604.401.959V6a.64.64 0 01-.655.643 48.39 48.39 0 01-4.163.3c.186 1.613.994 3.078 2.168 3.885A4.484 4.484 0 0112 12c.566 0 1.113-.11 1.618-.321a4.484 4.484 0 012.168-3.885A48.108 48.108 0 0118 6.643V6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12.75c1.148 0 2.278.08 3.393.237 1.037.146 1.866.966 1.866 2.013 0 3.064-2.523 5.525-5.525 5.525-3.024 0-5.525-2.523-5.525-5.525 0-1.047.83-1.867 1.866-2.013A48.424 48.424 0 0112 12.75z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12.75c-1.498 0-2.966-.185-4.376-.536a.64.64 0 01-.624-.624C6.684 10.54 6 9.148 6 7.5 6 4.462 8.462 2.25 11.25 2.25S16.5 4.462 16.5 7.5c0 1.648-.684 3.04-1.024 3.926a.64.64 0 01-.624.624A49.39 49.39 0 0112 12.75z"
          />
        </svg>
        Available Games
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableGames.map((game) => (
          <div
            key={game.slug}
            className="card-static p-4 text-center hover:border-brand-300 transition-colors"
          >
            <div className="text-sm font-medium text-foreground">{game.name}</div>
            {game.count && (
              <div className="text-xs text-text-faint mt-1">{game.count}+ games</div>
            )}
            {game.providers && game.providers.length > 0 && (
              <div className="text-xs text-text-faint mt-1">
                {game.providers.slice(0, 3).join(", ")}
                {game.providers.length > 3 && ` +${game.providers.length - 3}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
