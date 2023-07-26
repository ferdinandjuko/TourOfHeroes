import { Injectable, inject } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of, map, switchMap } from 'rxjs';
import { MessageService } from './message.service';
import { HeroesComponent } from './heroes/heroes.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  protected heroesComponent: HeroesComponent[] = [];
  

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('http://localhost:3000/heroes')
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(heroId: number): Observable<Hero> {
    return this.http.get<Hero>(`http://localhost:3000/heroes/${heroId}`)
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero, newName: string): Observable<Hero> {
    console.log('begin update hero', hero, newName, 'both');
    // return this.http.put<Hero>(`http://localhost:3000/heroes/${hero.id}`, hero, this.httpOptions)
    return this.getHero(hero.id).pipe(
      map((hero) => ({
        ...hero,
        name: newName !== hero.name ? newName : hero.name,
      })),
      switchMap(updatedHero => this.http.put<Hero>(`http://localhost:3000/heroes/${hero.id}`, updatedHero)),
      tap((newHero) => console.log('update hero', newHero)),
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** POST: add a new hero to the server */
  addHero(hero: { name: string }): Observable<Hero> {
    return this.getHeroes().pipe(
      map(heroes => [...heroes].sort((a: Hero, b: Hero)=> a.id - b.id)),
      map(sortedHeroes => sortedHeroes[sortedHeroes.length - 1]),
      map(previewHero => ({
        ...hero,
        id: previewHero.id + 1
      })),
      switchMap(newHero => this.http.post<Hero>('http://localhost:3000/heroes', newHero))
    )
  }

  /** DELETE: delete the hero from the server */
  deleteHero(heroId: number): Observable<Hero> {
    const url = `http://localhost:3000/${heroId}`;

    return this.getHero(heroId).pipe(
      switchMap(hero => this.http.delete<Hero>(`http://localhost:3000/heroes/${hero.id}`))
    )
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`http://localhost:3000/heroes/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) : 
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }


}
