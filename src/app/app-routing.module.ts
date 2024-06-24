import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleComponent } from './title-component/title-component.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  /*{path: '', component: TitleComponent},*/
  {path: '', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
