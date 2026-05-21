"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PokemonCard } from "./PokemonCard";

interface PokemonSearchListProps {
  pokemons: { name: string; url: string }[];
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

const VERSION_COLORS: Record<string, string> = {
  red: "#EF4444",
  blue: "#3B82F6",
  yellow: "#EAB308",
  gold: "#DAA520",
  silver: "#9CA3AF",
  crystal: "#38BDF8",
  ruby: "#991B1B",
  sapphire: "#1D4ED8",
  emerald: "#15803D",
  firered: "#F87171",
  leafgreen: "#4ADE80",
  diamond: "#60A5FA",
  pearl: "#F472B6",
  platinum: "#94A3B8",
  heartgold: "#CA8A04",
  soulsilver: "#64748B",
  black: "#334155",
  white: "#D1D5DB",
  "black-2": "#1E293B",
  "white-2": "#E5E7EB",
  x: "#2563EB",
  y: "#DC2626",
  "omega-ruby": "#B91C1C",
  "alpha-sapphire": "#1E40AF",
  sun: "#F59E0B",
  moon: "#8B5CF6",
  "ultra-sun": "#D97706",
  "ultra-moon": "#7C3AED",
  sword: "#0EA5E9",
  shield: "#E11D48",
  "brilliant-diamond": "#3B82F6",
  "shining-pearl": "#EC4899",
  "legends-arceus": "#0F172A",
  scarlet: "#EA580C",
  violet: "#6D28D9",
};

const REGIONS: Record<string, [number, number]> = {
  kanto: [1, 151],
  johto: [152, 251],
  hoenn: [252, 386],
  sinnoh: [387, 493],
  unova: [494, 649],
  kalos: [650, 721],
  alola: [722, 809],
  galar: [810, 898],
  paldea: [906, 1025],
};

const GAME_REGIONS: Record<string, string> = {
  red: "kanto",
  blue: "kanto",
  yellow: "kanto",
  gold: "johto",
  silver: "johto",
  crystal: "johto",
  ruby: "hoenn",
  sapphire: "hoenn",
  emerald: "hoenn",
  firered: "kanto",
  leafgreen: "kanto",
  diamond: "sinnoh",
  pearl: "sinnoh",
  platinum: "sinnoh",
  heartgold: "johto",
  soulsilver: "johto",
  black: "unova",
  white: "unova",
  "black-2": "unova",
  "white-2": "unova",
  x: "kalos",
  y: "kalos",
  "omega-ruby": "hoenn",
  "alpha-sapphire": "hoenn",
  sun: "alola",
  moon: "alola",
  "ultra-sun": "alola",
  "ultra-moon": "alola",
  sword: "galar",
  shield: "galar",
  "brilliant-diamond": "sinnoh",
  "shining-pearl": "sinnoh",
  "legends-arceus": "sinnoh",
  scarlet: "paldea",
  violet: "paldea",
};

const TypeIcon = ({ type }: { type: string }) => {
  const paths: Record<string, string> = {
    normal:
      "M12 2a10 10 0 100 20 10 10 0 000-20zm0 16a6 6 0 110-12 6 6 0 010 12z",
    fire: "M12 2c0 0-4 4.5-4 9 0 2.2 1.8 4 4 4s4-1.8 4-4c0-4.5-4-9-4-9z",
    water:
      "M12 3L7.5 8.5C6 10 5.5 11.5 5.5 13c0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5c0-1.5-.5-3-2-4.5L12 3z",
    electric: "M13 3L4 14h7l-2 7 9-11h-7l2-7z",
    grass:
      "M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c3.49-1.04 8.71-3.26 10.34-11.7z",
    ice: "M12 2L9 7l3 3 3-3-3-5zm0 20l3-5-3-3-3 3 3 5zm-9-9l5 3 3-3-3-3-5 3zm18 0l-5-3-3 3 3 3 5-3z",
    fighting:
      "M12 2a10 10 0 100 20 10 10 0 000-20zm-2 13l-3-3 1.4-1.4 1.6 1.6 4.6-4.6L15.6 9l-5.6 6z",
    poison:
      "M12 2C8 2 8 6 8 6v5c-1 0-2 1-2 2v3h12v-3c0-1-1-2-2-2V6c0 0 0-4-4-4zm-1 9V7h2v4h-2z",
    ground: "M2 20h20v2H2v-2zm2-4h16v2H4v-2zm3-4h10v2H7v-2z",
    flying: "M12 2L4 10h16L12 2zm0 13l-8 4h16l-8-4z",
    psychic:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
    bug: "M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3 5c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3h6c1.66 0 3-1.34 3-3v-4c0-1.66-1.34-3-3-3H9zm-2 2v4H5V9h2zm10 0v4h2V9h-2z",
    rock: "M12 2L4 8l2 10h12l2-10-8-6zm0 4l4 4-4 4-4-4 4-4z",
    ghost:
      "M12 2C8.69 2 6 4.69 6 8v12l2-2 2 2 2-2 2 2 2-2 2 2V8c0-3.31-2.69-6-6-6zm-2 7a2 2 0 110-4 2 2 0 010 4zm4 0a2 2 0 110-4 2 2 0 010 4z",
    dragon: "M12 2L2 22h20L12 2zm0 5l5 13H7l5-13z",
    dark: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 18c-4.41 0-8-3.59-8-8 0-4.06 3.03-7.43 6.95-7.93A8.02 8.02 0 009 12c0 3.86 2.76 7.08 6.45 7.82A7.94 7.94 0 0112 20z",
    steel:
      "M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 6a3 3 0 110 6 3 3 0 010-6z",
    fairy: "M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-3.5 h-3.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
    >
      <path d={paths[type] || paths.normal} />
    </svg>
  );
};

export function PokemonSearchList({ pokemons }: PokemonSearchListProps) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);
  const [caughtIds, setCaughtIds] = useState<string[]>([]);
  const [showCaughtOnly, setShowCaughtOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [regionFilters, setRegionFilters] = useState<string[]>([]);
  const [gameFilters, setGameFilters] = useState<string[]>([]);
  const [validTypePokemons, setValidTypePokemons] = useState<string[]>([]);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("caughtPokemons");
    if (saved) {
      try {
        setCaughtIds(JSON.parse(saved));
      } catch (e) {}
    }

    const handleApplyFilter = (e: any) => {
      const { type, value } = e.detail;
      if (type === "type" && !typeFilters.includes(value))
        setTypeFilters((prev) => [...prev, value]);
      if (type === "region" && !regionFilters.includes(value))
        setRegionFilters((prev) => [...prev, value]);
      if (type === "game" && !gameFilters.includes(value))
        setGameFilters((prev) => [...prev, value]);
      setIsFilterOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("apply-filter", handleApplyFilter);
    return () => window.removeEventListener("apply-filter", handleApplyFilter);
  }, [typeFilters, regionFilters, gameFilters]);

  useEffect(() => {
    if (typeFilters.length > 0) {
      Promise.all(
        typeFilters.map((t) =>
          fetch(`https://pokeapi.co/api/v2/type/${t}`).then((res) => res.json())
        )
      )
        .then((results) => {
          let common = results[0].pokemon.map((p: any) => p.pokemon.name);
          for (let i = 1; i < results.length; i++) {
            const nextList = results[i].pokemon.map((p: any) => p.pokemon.name);
            common = common.filter((name: string) => nextList.includes(name));
          }
          setValidTypePokemons(common);
        })
        .catch(() => setValidTypePokemons([]));
    } else {
      setValidTypePokemons([]);
    }
  }, [typeFilters]);

  const toggleCatch = (id: string) => {
    setCaughtIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];
      localStorage.setItem("caughtPokemons", JSON.stringify(next));
      window.dispatchEvent(new Event("catch-update"));
      return next;
    });
  };

  const toggleFilter = (
    setFilterStr: React.Dispatch<React.SetStateAction<string[]>>,
    val: string
  ) => {
    setFilterStr((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const urlParts = pokemon.url.split("/");
    const idStr = urlParts[urlParts.length - 2];
    const id = parseInt(idStr);
    const searchLower = search.toLowerCase();
    const searchClean = searchLower.replace(/#/g, "");
    const paddedId = idStr.padStart(3, "0");

    const matchesSearch =
      pokemon.name.includes(searchLower) ||
      paddedId.includes(searchClean) ||
      idStr.includes(searchClean);
    const matchesCatch = showCaughtOnly ? caughtIds.includes(idStr) : true;

    let matchesType = true;
    if (typeFilters.length > 0) {
      matchesType = validTypePokemons.includes(pokemon.name);
    }

    let matchesRegion = true;
    if (regionFilters.length > 0) {
      matchesRegion = regionFilters.some(
        (r) => id >= REGIONS[r][0] && id <= REGIONS[r][1]
      );
    }

    let matchesGame = true;
    if (gameFilters.length > 0) {
      matchesGame = gameFilters.some(
        (g) =>
          id >= REGIONS[GAME_REGIONS[g]][0] && id <= REGIONS[GAME_REGIONS[g]][1]
      );
    }

    return (
      matchesSearch &&
      matchesCatch &&
      matchesType &&
      matchesRegion &&
      matchesGame
    );
  });

  const visiblePokemons = filteredPokemons.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(30);
  }, [search, showCaughtOnly, typeFilters, regionFilters, gameFilters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((prev) => prev + 30);
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget]);

  return (
    <div className="flex flex-col w-full relative">
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-50 pt-1 pb-2 pointer-events-none">
        <div className="relative pointer-events-auto flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar Pokémon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFilterOpen(true)}
                className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-600/50 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:border-sky-400 font-mono text-xs shadow-[0_8px_30px_rgba(0,0,0,0.6)] placeholder-slate-400 transition-all"
              />
              <svg
                className="absolute right-4 top-3 w-5 h-5 text-slate-400 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCaughtOnly(!showCaughtOnly)}
              className={`shrink-0 px-4 rounded-xl border flex items-center justify-center transition-all ${
                showCaughtOnly
                  ? "bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-slate-900/80 border-slate-600/50 text-slate-400 backdrop-blur-xl hover:bg-slate-800"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </motion.button>
          </div>

          <AnimatePresence>
            {(typeFilters.length > 0 ||
              regionFilters.length > 0 ||
              gameFilters.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 px-1 flex-wrap font-mono text-[10px]"
              >
                {typeFilters.map((t) => (
                  <motion.button
                    key={`active-type-${t}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => toggleFilter(setTypeFilters, t)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-600 text-white hover:bg-red-500 hover:border-red-400 transition-colors shadow-sm"
                  >
                    <span
                      className="uppercase font-black"
                      style={{ color: TYPE_COLORS[t] }}
                    >
                      {t}
                    </span>
                    <span className="text-white/50">✕</span>
                  </motion.button>
                ))}
                {regionFilters.map((r) => (
                  <motion.button
                    key={`active-region-${r}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => toggleFilter(setRegionFilters, r)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-slate-800 border-l-2 border-sky-400 text-white hover:bg-red-500 hover:border-red-400 hover:border-l-red-200 transition-colors shadow-sm"
                  >
                    <span className="uppercase font-bold text-slate-200">
                      {r}
                    </span>
                    <span className="text-white/50">✕</span>
                  </motion.button>
                ))}
                {gameFilters.map((g) => (
                  <motion.button
                    key={`active-game-${g}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => toggleFilter(setGameFilters, g)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-600 text-white hover:bg-red-500 hover:border-red-400 transition-colors shadow-sm"
                  >
                    <span
                      className="uppercase font-bold"
                      style={{ color: VERSION_COLORS[g] || "#4ade80" }}
                    >
                      {g.replace(/-/g, " ")}
                    </span>
                    <span className="text-white/50">✕</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="absolute top-[52px] left-0 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-5 font-mono z-50 max-h-80 overflow-y-auto custom-scrollbar"
              >
                <div>
                  <h3 className="text-slate-400 text-[10px] font-black tracking-widest mb-3 border-b border-slate-800 pb-1 flex items-center justify-between">
                    TIPOS
                    {typeFilters.length > 0 && (
                      <span className="text-sky-400">
                        {typeFilters.length} SELECTED
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(TYPE_COLORS).map((type) => {
                      const isActive = typeFilters.includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleFilter(setTypeFilters, type)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] uppercase font-black transition-all hover:scale-105 active:scale-95 ${
                            isActive
                              ? "shadow-[0_0_10px_rgba(255,255,255,0.4)] text-white"
                              : "text-white/80 opacity-60 hover:opacity-100"
                          }`}
                          style={{
                            backgroundColor: isActive
                              ? TYPE_COLORS[type]
                              : "transparent",
                            borderColor: TYPE_COLORS[type],
                            color: isActive ? "#fff" : TYPE_COLORS[type],
                          }}
                        >
                          <TypeIcon type={type} />
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-400 text-[10px] font-black tracking-widest mb-3 border-b border-slate-800 pb-1 flex items-center justify-between">
                    REGIÕES
                    {regionFilters.length > 0 && (
                      <span className="text-sky-400">
                        {regionFilters.length} SELECTED
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(REGIONS).map((region) => {
                      const isActive = regionFilters.includes(region);
                      return (
                        <button
                          key={region}
                          onClick={() => toggleFilter(setRegionFilters, region)}
                          className={`px-3 py-1.5 rounded-sm border-l-4 text-[10px] uppercase font-bold shadow-sm transition-all active:scale-95 ${
                            isActive
                              ? "bg-sky-600 border-sky-300 text-white shadow-[0_0_10px_rgba(2,132,199,0.5)]"
                              : "bg-slate-800 border-slate-500 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-400 text-[10px] font-black tracking-widest mb-3 border-b border-slate-800 pb-1 flex items-center justify-between">
                    JOGOS CLÁSSICOS
                    {gameFilters.length > 0 && (
                      <span className="text-sky-400">
                        {gameFilters.length} SELECTED
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "red",
                      "blue",
                      "yellow",
                      "gold",
                      "silver",
                      "crystal",
                      "ruby",
                      "sapphire",
                      "emerald",
                      "diamond",
                      "pearl",
                    ].map((game) => {
                      const isActive = gameFilters.includes(game);
                      const baseColor = VERSION_COLORS[game] || "#94a3b8";
                      return (
                        <button
                          key={game}
                          onClick={() => toggleFilter(setGameFilters, game)}
                          className={`px-3 py-1.5 rounded-t-md rounded-b-sm border-t border-l border-b-2 border-r-2 text-[10px] uppercase font-black transition-all hover:-translate-y-0.5 active:scale-95 ${
                            isActive
                              ? "text-white border-white/40 shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                              : "text-white/60 border-black/40 bg-slate-800 hover:text-white"
                          }`}
                          style={{
                            backgroundColor: isActive ? baseColor : undefined,
                          }}
                        >
                          {game}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2 -mt-1">
        {visiblePokemons.map((pokemon, i) => {
          const urlParts = pokemon.url.split("/");
          const id = urlParts[urlParts.length - 2];
          return (
            <motion.div
              key={pokemon.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ duration: 0.3 }}
            >
              <PokemonCard
                name={pokemon.name}
                id={id}
                isCaught={caughtIds.includes(id)}
                onToggleCatch={() => toggleCatch(id)}
              />
            </motion.div>
          );
        })}
      </div>

      {visibleCount < filteredPokemons.length && (
        <div
          ref={observerTarget}
          className="h-10 w-full flex items-center justify-center mt-2"
        >
          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {filteredPokemons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-40 text-slate-500 font-mono text-xs"
        >
          <p>NENHUM POKÉMON ENCONTRADO</p>
        </motion.div>
      )}
    </div>
  );
}
