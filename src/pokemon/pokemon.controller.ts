import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import {
  PokemonDetailsResponse,
  PokemonListItem,
  PokemonNamesResponse,
  PokemonSearchResponse,
  PokemonTypeResponse,
} from './pokemon.model';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('types')
  fetchPokemonTypes(): Promise<PokemonListItem[]> {
    return this.pokemonService.fetchPokemonTypes();
  }

  @Get('types/:typeName')
  fetchPokemonsByType(
    @Param('typeName') typeName: string,
  ): Promise<PokemonTypeResponse> {
    return this.pokemonService.fetchPokemonsByType(typeName);
  }

  @Get('search')
  searchPokemons(@Query('q') query: string): Promise<PokemonSearchResponse> {
    return this.pokemonService.searchPokemons(query);
  }

  @Get('names')
  fetchAllPokemonNames(): Promise<PokemonNamesResponse> {
    return this.pokemonService.fetchAllPokemonNames();
  }

  @Get(':nameOrId')
  fetchPokemonDetails(
    @Param('nameOrId') nameOrId: string,
  ): Promise<PokemonDetailsResponse> {
    return this.pokemonService.fetchPokemonDetails(nameOrId);
  }
}
