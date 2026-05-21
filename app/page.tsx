import { PokedexFrame } from "../components/PokedexFrame";
import {
  getPokemonList,
  getPokemonDetail,
  getPokemonSpecies,
  getEvolutionChainWithIds,
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
  let speciesData = null;
  let evolutionListWithIds = null;

  if (params.id) {
    try {
      selectedPokemon = await getPokemonDetail(params.id);
      speciesData = await getPokemonSpecies(params.id);
      evolutionListWithIds = await getEvolutionChainWithIds(
        selectedPokemon.species.url
      );
    } catch (error) {}
  }

  return (
    <main>
      <PokedexFrame
        rightScreen={
          selectedPokemon ? (
            <PokemonDetails
              data={selectedPokemon}
              species={speciesData}
              evolutionListWithIds={evolutionListWithIds}
            />
          ) : undefined
        }
      >
        <PokemonSearchList pokemons={data.results} />
      </PokedexFrame>
    </main>
  );
}
