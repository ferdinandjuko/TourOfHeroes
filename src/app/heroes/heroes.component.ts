import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, HeroDetailComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  selectedHero?: Hero;
  heroes$: Observable<Hero[]> | undefined;
  heroForm!: FormGroup;

  constructor(private heroService: HeroService,
    private messageService: MessageService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getHeroes();
    this.heroForm = this.formBuilder.group({
      name: [null, Validators.required]
    }, {updateon: 'blur'})
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`)
  }

  getHeroes(): void {
    this.heroes$ = this.heroService.getHeroes();
  }

  add(): void {
    this.heroService.addHero(this.heroForm.value).pipe(
      tap(() => window.location.reload())
      ).subscribe();
       // Faites défiler l'écran vers le bas de la page après le rechargement
       window.scrollTo(0, document.body.scrollHeight);
  }

  
  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).pipe(
      tap(() => window.location.reload())
    ).subscribe();

  }

}
