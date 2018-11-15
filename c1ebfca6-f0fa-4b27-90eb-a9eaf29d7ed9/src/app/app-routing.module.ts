import { StudentPickComponent } from './pages/student-pick.component';
import { MainComponent } from './pages/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubstituteComponent } from './pages/substitute.component';
import { CourseSelcComponent } from './pages/course-selc.component';

const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'pick/:type/:id/:period/:name', component: StudentPickComponent },
    { path: 'sub', component: SubstituteComponent },
    { path: 'course', component: CourseSelcComponent }
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
