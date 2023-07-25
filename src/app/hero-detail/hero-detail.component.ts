import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { HeroesComponent } from '../heroes/heroes.component';
import { Location } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit{
  @Input() hero$!: Observable<Hero>;
  route: ActivatedRoute = inject(ActivatedRoute);
  heroService = inject(HeroService);
  heroesComponent: HeroesComponent | undefined;
  heroName = new FormGroup({
    namehero: new FormControl('')
  })
  constructor(
    private location: Location
  ) {
    // const heroesId = Number(this.route.snapshot.params['id']);
    // this.heroesComponent = this.heroService.getHero(heroesId);
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hero$ = this.heroService.getHero(id);
  }

  oninputheroname(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value) {
      // Votre logique ici
      console.log(inputElement.value);
    }
  }

  onSaveHero(event: Event): void {
    event.preventDefault();
    const newname = document.getElementById('hero-name') as HTMLInputElement;
    const heroNewName = newname.value;
    
    //console.log('fuck',this.heroName.value.namehero);
    if(this.hero$) {
      this.hero$.pipe(
        switchMap((hero) => this.heroService.updateHero(hero, heroNewName))
      ).
      subscribe((updatedHero) => {
         // Mettez à jour votre modèle avec le héros mis à jour si nécessaire
         console.log('Hero mis à jour :', updatedHero);
        // console.log(heroNewName)
        // this.goBack();
      });
      // this.heroService.updateHero(this.hero$);
    }
  }

  goBack(): void {  
    this.location.back();
  }
}
