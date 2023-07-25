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

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('http://localhost:3000/heroes')
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(heroId: number): Observable<Hero> {
    return this.http.get<Hero>(`http://localhost:3000/heroes/${heroId}`)
  }

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
}
