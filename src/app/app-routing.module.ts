import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleComponent } from './title-component/title-component.component';
import { LoginComponent } from './login/login.component';
import { BookingComponent } from './booking/booking.component';


const routes: Routes = [
  {path: 'booking', component: BookingComponent}, 
  {path: '', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
