export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: PokemonSprites;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  game_indices: PokemonGameIndex[];
  cries: {
    latest: string;
    legacy: string;
  };
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonSprites {
  other: {
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonSpecies {
  evolution_chain: { url: string };
  varieties: { is_default: boolean; pokemon: NamedAPIResource }[];
  flavor_text_entries: {
    flavor_text: string;
    language: NamedAPIResource;
  }[];
}

export interface EvolutionChain {
  chain: ChainLink;
}

export interface ChainLink {
  species: NamedAPIResource;
  evolves_to: ChainLink[];
}

export interface PokemonGameIndex {
  game_index: number;
  version: NamedAPIResource;
}
