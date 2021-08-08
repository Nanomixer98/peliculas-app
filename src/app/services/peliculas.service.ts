import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { tap, map, catchError } from 'rxjs/operators';
import { MovieResponse } from '../interfaces/movie-response';
import { Cast, CreditsResponse } from '../interfaces/credits-response';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl: string = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  public cargando: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  get params() {
    return {
      api_key: 'db237f3f7e5004699919fee0b7adcb73',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    }
  }

  getCartelera(): Observable<Movie[]> {

    if( this.cargando ) {
      return of([]);
    }

    this.cargando = true;

    return this.http.get<CarteleraResponse>(`${this.baseUrl}/movie/now_playing`, {
      params: this.params
    }).pipe(
      map( (res) => res.results ),
      tap( () => {
        this.carteleraPage += 1;
        this.cargando = false;
      })
    );
  }

  resetCarteleraPage() {
    this.carteleraPage = 1;
  }

  buscarPeliculas( texto: string ):Observable<Movie[]> {

    const params = {...this.params, page: '1', query: texto };

    // https://api.themoviedb.org/3/search/movie?
    return this.http.get<CarteleraResponse>(`${this.baseUrl}/search/movie` , {
      params
    }).pipe(
      map( res => res.results )
    )
  }

  getPeliculaDetalle( id: string ) {
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/${id}`, {
      params: this.params
    }).pipe(
      catchError( err => of(null) )
    );
  }

  getCast( id: string ): Observable<Cast[]> {
    return this.http.get<CreditsResponse>(`${this.baseUrl}/movie/${id}/credits`, {
      params: this.params
    }).pipe(
      map( res => res.cast ),
      catchError( err => of([]) ),
    );
  }

}
