import { GadgetService } from './service/gadget.service';
import { DSAService } from './service/dsa.service';
import { PaggingService } from './service/pagging.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaggingComponent } from './pagging/pagging.component';

@NgModule({
  declarations: [
    AppComponent,
    PaggingComponent,
    AppRoutingModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [GadgetService, DSAService, PaggingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
