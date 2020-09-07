import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main.component';
import { ClasslistComponent } from './classlist.component';
import { SemesterComponent } from './semester.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ClasslistComponent,
    SemesterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
