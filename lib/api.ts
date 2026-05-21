export async function getPokemonList(limit: number, offset: number) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    { cache: "force-cache" }
  );
  return res.json();
}

export async function getPokemonDetail(id: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    cache: "force-cache",
  });
  return res.json();
}

export async function getPokemonSpecies(id: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, {
    cache: "force-cache",
  });
  return res.json();
}

export async function getEvolutionChainWithIds(
  speciesUrl: string
): Promise<{ name: string; id: string }[]> {
  const speciesRes = await fetch(speciesUrl, { cache: "force-cache" });
  const speciesData = await speciesRes.json();
  const chainUrl = speciesData.evolution_chain.url;

  const chainRes = await fetch(chainUrl, { cache: "force-cache" });
  const chainData = await chainRes.json();

  let list: { name: string; id: string }[] = [];
  let current = chainData.chain;

  while (current) {
    const urlParts = current.species.url.split("/");
    const id = urlParts[urlParts.length - 2];
    list.push({ name: current.species.name, id: id });
    current = current.evolves_to[0];
  }
  return list;
}
