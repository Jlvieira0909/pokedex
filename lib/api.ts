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
): Promise<{ name: string; id: string; evoDetails: string | null }[]> {
  const speciesRes = await fetch(speciesUrl, { cache: "force-cache" });
  const speciesData = await speciesRes.json();
  const chainUrl = speciesData.evolution_chain.url;

  const chainRes = await fetch(chainUrl, { cache: "force-cache" });
  const chainData = await chainRes.json();

  let list: { name: string; id: string; evoDetails: string | null }[] = [];
  let current = chainData.chain;
  let nextDetail = null;

  while (current) {
    const urlParts = current.species.url.split("/");
    const id = urlParts[urlParts.length - 2];

    list.push({ name: current.species.name, id: id, evoDetails: nextDetail });

    if (current.evolves_to && current.evolves_to.length > 0) {
      const details = current.evolves_to[0].evolution_details[0];
      if (details) {
        if (details.trigger.name === "level-up") {
          if (details.min_level) nextDetail = `Lvl ${details.min_level}`;
          else if (details.min_happiness) nextDetail = `Friendship`;
          else if (details.location) nextDetail = `Location`;
          else nextDetail = `Level Up`;
        } else if (details.trigger.name === "use-item") {
          nextDetail = details.item.name.replace("-", " ");
        } else if (details.trigger.name === "trade") {
          if (details.held_item)
            nextDetail = `Trade w/ ${details.held_item.name.replace("-", " ")}`;
          else nextDetail = `Trade`;
        } else {
          nextDetail = `Special`;
        }
      } else {
        nextDetail = null;
      }
      current = current.evolves_to[0];
    } else {
      current = null;
    }
  }
  return list;
}
