import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login-component/login.component';
import { ReservComponent } from './Components/adrive/reserv-component/reserv.component';
import { loginGuard } from './app.guard';
import { LogsComponent } from './Components/adrive/logs-component/logs.component';
import { TechCarReservComponent } from './Components/tech-drive/tech-car-reserv-component/tech-car-reserv.component';
import { TechCarLogsComponent } from './Components/tech-drive/tech-car-logs-component/tech-car-logs.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'adrive', component: ReservComponent, canActivate: [loginGuard] },
    { path: 'logs', component: LogsComponent, canActivate: [loginGuard] },
    { path: 'orders', component: TechCarReservComponent, canActivate: [loginGuard] },
    { path: 'order-logs', component: TechCarLogsComponent, canActivate: [loginGuard] }
];



