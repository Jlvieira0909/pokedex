"use client";
import { useState, useEffect, useRef } from "react";
import { PokemonCard } from "./PokemonCard";

interface PokemonSearchListProps {
  pokemons: { name: string; url: string }[];
}

export function PokemonSearchList({ pokemons }: PokemonSearchListProps) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredPokemons = pokemons.filter((pokemon) => {
    const urlParts = pokemon.url.split("/");
    const id = urlParts[urlParts.length - 2];
    const searchLower = search.toLowerCase();
    const searchClean = searchLower.replace(/#/g, "");
    const paddedId = id.padStart(3, "0");

    return (
      pokemon.name.includes(searchLower) ||
      paddedId.includes(searchClean) ||
      id.includes(searchClean)
    );
  });

  const visiblePokemons = filteredPokemons.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(30);
  }, [search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 30);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  return (
    <div className="flex flex-col w-full relative">
      <div className="sticky top-0 z-20 bg-slate-900 pb-3 pt-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border-2 border-slate-700 text-slate-100 px-4 py-2.5 rounded-lg focus:outline-none focus:border-sky-500 font-mono text-xs shadow-inner placeholder-slate-600 transition-colors"
          />
          <svg
            className="absolute right-3 top-2 w-6 h-6 text-slate-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2">
        {visiblePokemons.map((pokemon) => {
          const urlParts = pokemon.url.split("/");
          const id = urlParts[urlParts.length - 2];
          return <PokemonCard key={pokemon.name} name={pokemon.name} id={id} />;
        })}
      </div>

      {visibleCount < filteredPokemons.length && (
        <div
          ref={observerTarget}
          className="h-10 w-full flex items-center justify-center"
        >
          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
