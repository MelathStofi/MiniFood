export interface PokemonTypeSummary {
  name: string;
  url: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonTypeItem {
  slot: number;
  type: PokemonTypeSummary;
}

export interface PokemonTypeResponse {
  id: number;
  name: string;
  pokemons: PokemonListItem[];
}

export interface PokemonDetailsResponse {
  id: number;
  name: string;
  types: PokemonTypeItem[];
}

export interface PokemonSearchResponse {
  query: string;
  count: number;
  results: PokemonListItem[];
}

export interface PokemonNamesResponse {
  count: number;
  results: PokemonListItem[];
}
