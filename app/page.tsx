import { PokedexFrame } from "../components/PokedexFrame";
import {
  getPokemonList,
  getPokemonDetail,
  getPokemonSpecies,
  getEvolutionChain,
} from "../lib/api";
import { PokemonDetails } from "../components/PokemonDetails";
import { PokemonSearchList } from "../components/PokemonSearchList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const data = await getPokemonList(1000, 0);

  let selectedPokemon = null;
  let evolutionData = null;
  let speciesData = null;

  if (params.id) {
    selectedPokemon = await getPokemonDetail(params.id);
    speciesData = await getPokemonSpecies(params.id);
    evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);
  }

  return (
    <main>
      <PokedexFrame
        rightScreen={
          selectedPokemon ? (
            <PokemonDetails
              data={selectedPokemon}
              evolution={evolutionData}
              species={speciesData}
            />
          ) : undefined
        }
      >
        <PokemonSearchList pokemons={data.results} />
      </PokedexFrame>
    </main>
  );
}
