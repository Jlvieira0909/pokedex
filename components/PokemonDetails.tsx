"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PokemonDetail, PokemonSpecies } from "../types/pokemon";

interface PokemonDetailsProps {
  data: PokemonDetail;
  species: PokemonSpecies | null;
  evolutionListWithIds: { name: string; id: string }[] | null;
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

export function PokemonDetails({
  data,
  species,
  evolutionListWithIds,
}: PokemonDetailsProps) {
  const [isShiny, setIsShiny] = useState(false);
  const [isCaught, setIsCaught] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const defaultImageUrl = data.sprites.other["official-artwork"].front_default;
  const shinyImageUrl =
    data.sprites.other["official-artwork"].front_shiny || defaultImageUrl;
  const imageUrl = isShiny ? shinyImageUrl : defaultImageUrl;

  const heightInMeters = (data.height / 10).toFixed(1);
  const weightInKg = (data.weight / 10).toFixed(1);

  useEffect(() => {
    setIsShiny(false);

    if (data.cries && data.cries.latest) {
      const audio = new Audio(data.cries.latest);
      audio.volume = 0.3;
      audioRef.current = audio;
      audio.play().catch(() => {});
    }

    const checkCaught = () => {
      const saved = localStorage.getItem("caughtPokemons");
      if (saved) {
        const caughtList = JSON.parse(saved);
        setIsCaught(caughtList.includes(String(data.id)));
      } else {
        setIsCaught(false);
      }
    };

    checkCaught();

    window.addEventListener("catch-update", checkCaught);
    return () => window.removeEventListener("catch-update", checkCaught);
  }, [data.id, data.cries]);

  const playCry = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else if (data.cries && data.cries.latest) {
      const audio = new Audio(data.cries.latest);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const getFlavorText = () => {
    if (!species || !species.flavor_text_entries) return "";
    const englishEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    if (!englishEntry) return "";
    return englishEntry.flavor_text.replace(/[\n\f\r]/g, " ");
  };

  const applyFilter = (filterType: string, value: string) => {
    window.dispatchEvent(
      new CustomEvent("apply-filter", { detail: { type: filterType, value } })
    );
  };

  const varieties = species?.varieties.filter((v) => !v.is_default) || [];
  const flavorText = getFlavorText();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      key={data.id}
      className="w-full flex flex-col text-slate-100 font-mono"
    >
      <div className="relative w-full h-48 shrink-0 border-b border-slate-800 bg-[url('/battle-bg.png')] bg-cover bg-center bg-no-repeat bg-sky-900 rounded-lg shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.img
            key={imageUrl}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            src={imageUrl}
            alt={`${data.name} ${isShiny ? "Shiny" : ""}`}
            className={`h-44 w-44 object-contain z-10 transition-all duration-300 ${
              isShiny
                ? "scale-105 brightness-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                : "drop-shadow-2xl"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col p-5 w-full bg-slate-900/90 rounded-b-lg relative overflow-hidden">
        <svg
          className="absolute top-10 -right-20 w-80 h-80 text-white/5 pointer-events-none z-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>

        <div className="flex justify-between items-end mb-4 gap-2 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-black capitalize text-white drop-shadow-md">
                {data.name}
              </h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={playCry}
                className="w-7 h-7 flex items-center justify-center bg-sky-500 rounded-full border border-sky-300 shadow-[0_2px_0_#0284c7] hover:bg-sky-400 group ml-1"
                title="Play Cry"
              >
                <svg
                  className="w-3.5 h-3.5 text-white drop-shadow-sm group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsShiny(!isShiny)}
                className={`w-7 h-7 flex items-center justify-center rounded-full border shadow-[0_2px_0_rgba(0,0,0,0.3)] transition-all group ${
                  isShiny
                    ? "bg-yellow-400 border-yellow-200 shadow-[0_2px_0_#ca8a04] hover:bg-yellow-300"
                    : "bg-slate-700 border-slate-500 hover:bg-slate-600"
                }`}
                title="Toggle Shiny"
              >
                <svg
                  className={`w-3.5 h-3.5 drop-shadow-sm group-hover:scale-110 transition-transform ${
                    isShiny ? "text-white" : "text-slate-400"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </motion.button>
              <AnimatePresence>
                {isCaught && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="ml-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 border border-red-500/50 rounded-md shadow-[inset_0_0_8px_rgba(239,68,68,0.3)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.44-1.73-2.01-3-3.88-3s-3.44 1.27-3.88 3H4.06C4.55 7.05 7.92 4 12 4zm0 16c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.88 3s3.44-1.27 3.88-3h4.06c-.49 3.95-3.86 7-7.94 7zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                    <span className="text-[9px] font-black text-red-400 tracking-wider uppercase">
                      Caught
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-slate-400 font-bold text-sm mt-1">
              NO. {String(data.id).padStart(3, "0")}
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {data.types.map((t) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={t.type.name}
                onClick={() => applyFilter("type", t.type.name)}
                className="cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.1)] px-2.5 py-0.5 rounded-sm border border-black/50 flex items-center gap-1 text-[11px] font-black uppercase text-white"
                style={{
                  backgroundColor: TYPE_COLORS[t.type.name] || "#475569",
                }}
                title={`Filtrar por tipo ${t.type.name}`}
              >
                <TypeIcon type={t.type.name} /> {t.type.name}
              </motion.div>
            ))}
          </div>
        </div>

        {flavorText && (
          <div className="mb-6 relative z-10">
            <div className="bg-[#0f172a] border border-[#334155] p-3.5 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none z-10"></div>
              <p className="text-green-400/90 font-mono text-xs leading-relaxed relative z-20 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)] group-hover:text-green-300 transition-colors">
                {flavorText}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl mb-6 text-xs border border-slate-700/50 shadow-inner relative z-10">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 mb-1 font-bold tracking-widest">
              HEIGHT
            </span>
            <span className="font-bold text-lg text-white">
              {heightInMeters} m
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-700/50">
            <span className="text-slate-400 mb-1 font-bold tracking-widest">
              WEIGHT
            </span>
            <span className="font-bold text-lg text-white">
              {weightInKg} kg
            </span>
          </div>
        </div>

        {evolutionListWithIds && evolutionListWithIds.length > 1 && (
          <div className="mb-6 relative z-10">
            <h3 className="text-slate-400 font-bold text-xs mb-3 flex items-center gap-2 tracking-widest">
              EVOLUTION LINE
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {evolutionListWithIds.map((pokemon, i) => {
                const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`;

                return (
                  <div
                    key={pokemon.name}
                    className="flex items-center gap-2 shrink-0"
                  >
                    {pokemon.name === data.name ? (
                      <div
                        className={`px-2 py-1 rounded-lg text-xs capitalize font-bold border shadow-sm flex items-center gap-2 bg-sky-600 border-sky-400 text-white shadow-[0_0_10px_#38bdf8]`}
                      >
                        <img
                          src={gifUrl}
                          alt={pokemon.name}
                          className="h-6 w-6 object-contain"
                        />
                        <div>
                          <p className="text-white/70 text-[9px]">
                            #{pokemon.id.padStart(3, "0")}
                          </p>
                          <p>{pokemon.name}</p>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/?id=${pokemon.name}`}
                        className="px-2 py-1 rounded-lg text-xs capitalize font-bold border shadow-sm flex items-center gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
                      >
                        <img
                          src={gifUrl}
                          alt={pokemon.name}
                          className="h-6 w-6 object-contain"
                        />
                        <div>
                          <p className="text-slate-400 text-[9px]">
                            #{pokemon.id.padStart(3, "0")}
                          </p>
                          <p>{pokemon.name}</p>
                        </div>
                      </Link>
                    )}
                    {i < evolutionListWithIds.length - 1 && (
                      <span className="text-slate-500 text-xs">▶</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {varieties.length > 0 && (
          <div className="mb-6 relative z-10">
            <h3 className="text-slate-400 font-bold text-xs mb-3 tracking-widest">
              VARIANTS / FORMS
            </h3>
            <div className="flex flex-wrap gap-2">
              {varieties.map((v) => (
                <div
                  key={v.pokemon.name}
                  className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] capitalize text-slate-300 font-bold shadow-sm"
                >
                  {v.pokemon.name.replace(`${data.name}-`, "")}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 relative z-10">
          <h3 className="text-slate-400 font-bold text-xs mb-4 tracking-widest">
            BASE STATS
          </h3>
          <div className="flex flex-col gap-3">
            {data.stats.map((s, index) => (
              <div key={s.stat.name} className="flex items-center text-xs">
                <span className="w-14 text-slate-400 font-bold uppercase">
                  {s.stat.name.replace("special-", "sp.")}
                </span>
                <span className="w-8 text-right mr-3 font-bold text-white">
                  {s.base_stat}
                </span>
                <div className="flex-grow h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.base_stat / 255) * 100}%` }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: index * 0.1,
                    }}
                    className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.game_indices && data.game_indices.length > 0 && (
          <div className="mb-4 relative z-10">
            <h3 className="text-slate-400 font-bold text-xs mb-3 tracking-widest">
              APPEARANCES
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar px-1 pt-1">
              {data.game_indices.map((g) => {
                const baseColor = VERSION_COLORS[g.version.name] || "#94a3b8";
                return (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    key={g.version.name}
                    onClick={() => applyFilter("game", g.version.name)}
                    className="cursor-pointer w-28 h-40 shrink-0 rounded-t-xl rounded-b shadow-[4px_4px_10px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden group border-t-[3px] border-l-[3px] border-white/30 border-r-[4px] border-b-[4px] border-black/40 z-10"
                    style={{ backgroundColor: baseColor }}
                    title={`Filtrar jogos da geração ${g.version.name}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/40 mix-blend-overlay pointer-events-none z-0"></div>

                    <div className="w-full h-5 flex flex-col justify-end px-3 pb-1 gap-[2px] opacity-60 mix-blend-multiply z-0">
                      <div className="w-full h-[2px] bg-black/60 rounded-full border-b border-white/40"></div>
                      <div className="w-full h-[2px] bg-black/60 rounded-full border-b border-white/40"></div>
                      <div className="w-full h-[2px] bg-black/60 rounded-full border-b border-white/40"></div>
                    </div>

                    <div className="w-16 h-2.5 mx-auto mt-1 rounded-full border border-black/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center bg-black/5 z-0">
                      <div className="text-[4px] font-sans font-black text-black/40 tracking-widest uppercase mt-[1px]">
                        Cartridge
                      </div>
                    </div>

                    <div className="flex-grow mx-2 mt-2 mb-2 bg-white rounded-[4px] border-2 border-black/80 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col z-10">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none transform -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>

                      <div className="w-full flex-grow relative bg-slate-100 flex items-center justify-center overflow-hidden p-[1px]">
                        <img
                          src={`/games/${g.version.name}.jpg`}
                          alt={g.version.name}
                          className="w-full h-full object-cover rounded-[1px] shadow-inner"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      <div className="h-4 bg-gradient-to-b from-slate-100 to-slate-300 w-full flex items-center justify-center border-t border-black/30 z-20 shrink-0">
                        <span className="text-[7px] font-black uppercase text-slate-800 tracking-tight leading-none truncate px-1 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                          {g.version.name.replace(/-/g, " ")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
