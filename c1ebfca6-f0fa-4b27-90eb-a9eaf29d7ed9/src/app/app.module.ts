import { AlertService } from './service/alert.service';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { GadgetService } from './service/gadget.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DSAService } from './service/dsa.service';
import { ConfigService } from './service/config.service';
import { MainComponent } from './pages/main.component';
import { PeriodChooserComponent } from './modal/period-chooser.component';
import { StudentPickComponent } from './pages/student-pick.component';
import { DebugComponent } from './modal/debug.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { WaitingComponent } from './modal/waiting.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SubstituteComponent } from './pages/substitute.component';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PeriodChooserComponent,
    StudentPickComponent,
    DebugComponent,
    WaitingComponent,
    SubstituteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule
  ],
  providers: [GadgetService, DSAService, ConfigService, AlertService],
  bootstrap: [AppComponent],
  entryComponents: [
    PeriodChooserComponent,
    DebugComponent,
    WaitingComponent
  ]
})
export class AppModule { }
