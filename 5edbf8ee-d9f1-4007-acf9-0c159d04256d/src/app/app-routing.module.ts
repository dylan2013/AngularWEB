import { NgModule } from '@angular/core';
import { MainComponent } from './pages/main.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      useHash: true
  })],
  exports: [
      RouterModule
  ]
})
export class AppRoutingModule { }
