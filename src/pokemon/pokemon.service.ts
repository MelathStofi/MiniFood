import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PokemonDetailsResponse,
  PokemonListItem,
  PokemonNamesResponse,
  PokemonSearchResponse,
  PokemonTypeItem,
  PokemonTypeResponse,
} from './pokemon.model';

type PokemonTypeApiResponse = {
  id: number;
  name: string;
  pokemon: Array<{
    slot: number;
    pokemon: PokemonListItem;
  }>;
};

type PokemonDetailsApiResponse = {
  id: number;
  name: string;
  types: PokemonTypeItem[];
};

type PokemonListApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

@Injectable()
export class PokemonService {
  private readonly baseUrl: string = 'https://pokeapi.co/api/v2';
  private readonly pokemonNamesCacheTtlMs: number = 1000 * 60 * 60;
  private cachedPokemonNames: PokemonListItem[] | null = null;
  private cachedPokemonNamesAt: number | null = null;

  private async fetchJson<T>(url: string): Promise<T> {
    const response: Response = await fetch(url);

    if (!response.ok) {
      throw new InternalServerErrorException(`Failed to fetch: ${url}`);
    }

    return (await response.json()) as T;
  }

  async fetchPokemonTypes(): Promise<PokemonListItem[]> {
    const data: PokemonListApiResponse =
      await this.fetchJson<PokemonListApiResponse>(`${this.baseUrl}/type`);

    return data.results.filter(
      (type: PokemonListItem) =>
        type.name !== 'unknown' && type.name !== 'shadow',
    );
  }

  async fetchPokemonsByType(typeName: string): Promise<PokemonTypeResponse> {
    const data: PokemonTypeApiResponse =
      await this.fetchJson<PokemonTypeApiResponse>(
        `${this.baseUrl}/type/${typeName}`,
      );

    return {
      id: data.id,
      name: data.name,
      pokemons: data.pokemon.map((item) => item.pokemon),
    };
  }

  async fetchPokemonDetails(nameOrId: string): Promise<PokemonDetailsResponse> {
    const data: PokemonDetailsApiResponse =
      await this.fetchJson<PokemonDetailsApiResponse>(
        `${this.baseUrl}/pokemon/${nameOrId}`,
      );

    return {
      id: data.id,
      name: data.name,
      types: data.types,
    };
  }

  private isPokemonNamesCacheValid(): boolean {
    if (
      this.cachedPokemonNames === null ||
      this.cachedPokemonNamesAt === null
    ) {
      return false;
    }

    const now: number = Date.now();
    return now - this.cachedPokemonNamesAt < this.pokemonNamesCacheTtlMs;
  }

  async fetchAllPokemonNames(): Promise<PokemonNamesResponse> {
    if (this.isPokemonNamesCacheValid()) {
      return {
        count: this.cachedPokemonNames?.length ?? 0,
        results: this.cachedPokemonNames ?? [],
      };
    }

    const data: PokemonListApiResponse =
      await this.fetchJson<PokemonListApiResponse>(
        `${this.baseUrl}/pokemon?limit=1302`,
      );

    this.cachedPokemonNames = data.results;
    this.cachedPokemonNamesAt = Date.now();

    return {
      count: data.count,
      results: data.results,
    };
  }

  async searchPokemons(query: string): Promise<PokemonSearchResponse> {
    const normalizedQuery: string = query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return {
        query,
        count: 0,
        results: [],
      };
    }

    const allPokemons: PokemonListItem[] = (await this.fetchAllPokemonNames())
      .results;

    const results: PokemonListItem[] = allPokemons.filter(
      (pokemon: PokemonListItem) =>
        pokemon.name.toLowerCase().includes(normalizedQuery),
    );

    return {
      query,
      count: results.length,
      results,
    };
  }
}
