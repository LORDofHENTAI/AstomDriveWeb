import { Component } from "@angular/core";
import { MaterialModule } from "../../../material.module";
import { CommonModule, formatDate } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LogsModel } from "../../../models/logs-model/logs";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { CarReservService } from "../../../services/car-reserv.service";
import { Router } from "@angular/router";
import { TokenModel } from "../../../models/token";
import { LogsService } from "../../../services/logs.service";
import { environment } from "../../../environment";
import { HttpClient } from "@angular/common/http";
import saveAs from "file-saver";

@Component({
    selector: 'app-tech-car-logs',
    templateUrl: './tech-car-logs.component.html',
    styleUrl: './tech-car-logs.component.scss',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule]
})
export class TechCarLogsComponent {
    constructor(
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private logsService: LogsService,
        private router: Router,
        private http: HttpClient
    ) { }
    selectedDate: Date = new Date
    logsList: LogsModel[]
    ngOnInit(): void {
        this.getLogs()
    }
    getLogs() {
        this.logsService.GetOrderLogs(new TokenModel(this.tokenService.getToken(), 0, formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US'))).subscribe({
            next: result => {
                this.logsList = result
            },
            error: error => {
                {
                    console.log(error);
                    this.snackBarService.openRedSnackBar()
                }
            }
        })
    }
    Back() {
        this.router.navigate(['/orders/'])
    }
    Logout() {
        this.tokenService.deleteCookie()
        this.router.navigate(['/login/'])
    }
    goToAdrive() {
        this.router.navigate(['/adrive/'])
    }
    getDocumentacion() {
        this.http.get(environment.apiUrl + '/GetDocumentation/', { responseType: 'blob' }).subscribe({
            next: result => {
                saveAs(result, 'Документация')
            },
            error: error => {
                console.log(error)
                this.snackBarService.openRedSnackBar()
            }
        })
    }
}