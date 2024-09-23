import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login-component/login.component';
import { ReservComponent } from './Components/reserv-component/reserv.component';
import { loginGuard } from './app.guard';
import { LogsComponent } from './Components/logs-component/logs.component';

export const routes: Routes = [
    { path: '', redirectTo: '/reserv', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'reserv', component: ReservComponent, canActivate: [loginGuard] },
    { path: 'logs', component: LogsComponent, canActivate: [loginGuard] }
];

