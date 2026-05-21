"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface PokemonCardProps {
  name: string;
  id: string;
  isCaught: boolean;
  onToggleCatch: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export function PokemonCard({
  name,
  id,
  isCaught,
  onToggleCatch,
}: PokemonCardProps) {
  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  const fallbackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const officialArtUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const pokeballUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png`;

  const [imgSrc, setImgSrc] = useState(gifUrl);
  const [errorCount, setErrorCount] = useState(0);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setTypes(data.types.map((t: any) => t.type.name));
      })
      .catch(() => {
        if (isMounted) setTypes(["normal"]);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleError = () => {
    if (errorCount === 0) {
      setImgSrc(fallbackImageUrl);
      setErrorCount(1);
    } else if (errorCount === 1) {
      setImgSrc(officialArtUrl);
      setErrorCount(2);
    } else {
      setImgSrc(pokeballUrl);
    }
  };

  const color1 = types.length > 0 ? TYPE_COLORS[types[0]] : "#334155";
  const color2 = types.length > 1 ? TYPE_COLORS[types[1]] : color1;
  const gradientBackground = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;

  return (
    <Link
      href={`/?id=${id}`}
      className="group rounded-xl p-3 flex flex-col items-center justify-between transition-all active:scale-95 h-28 relative overflow-hidden w-full border-2 border-slate-900/40 hover:border-white/80 shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
      style={{ background: gradientBackground }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-0"></div>

      <svg
        className="absolute -right-4 -bottom-4 w-24 h-24 text-white/20 group-hover:rotate-45 transition-transform duration-700 z-0"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </svg>

      <div className="flex justify-between w-full items-start z-10 relative">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-black text-white bg-black/40 px-2 py-0.5 rounded border border-black/20 backdrop-blur-sm">
            #{id.padStart(3, "0")}
          </span>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleCatch();
            }}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-inner ${
              isCaught
                ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] opacity-100 scale-110 border border-red-300"
                : "bg-slate-800/80 opacity-60 hover:opacity-100 scale-100 border border-slate-500"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-3 h-3 ${
                isCaught ? "text-white" : "text-slate-400"
              }`}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
        </div>
        <span className="text-[11px] font-black text-white capitalize tracking-tight truncate pl-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mt-0.5">
          {name.replace(/-/g, " ")}
        </span>
      </div>

      <div className="flex-grow flex items-end justify-center pb-1 z-10 w-full relative">
        <img
          src={imgSrc}
          alt={name}
          className={`max-h-14 w-auto object-contain transition-all duration-300 group-hover:scale-110 ${
            isCaught
              ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              : "drop-shadow-[0_5px_5px_rgba(0,0,0,0.6)]"
          }`}
          loading="lazy"
          onError={handleError}
        />
      </div>
    </Link>
  );
}
