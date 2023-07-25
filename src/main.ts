import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import routeConfig from './app/routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routeConfig),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(FormsModule),
    importProvidersFrom(ReactiveFormsModule),
  ]
})
.catch((err) => console.error(err));
