import { PokemonListResponse, PokemonDetail } from "../types/pokemon";

const API_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> {
  const res = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);

  if (!res.ok) throw new Error("Failed to fetch pokemon list");

  return res.json();
}

export async function getPokemonDetail(
  nameOrId: string | number
): Promise<PokemonDetail> {
  const res = await fetch(`${API_URL}/pokemon/${nameOrId}`);

  if (!res.ok) throw new Error("Failed to fetch pokemon details");

  return res.json();
}

export async function getPokemonSpecies(
  id: string | number
): Promise<PokemonSpecies> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`
  );
  return response.json();
}

export async function getEvolutionChain(url: string): Promise<EvolutionChain> {
  const response = await fetch(url);
  return response.json();
}
