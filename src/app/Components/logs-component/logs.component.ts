import { Component, OnInit } from "@angular/core";
import { MaterialModule } from "../../material.module";
import { CommonModule, formatDate } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TokenService } from "../../services/token.service";
import { SnackbarService } from "../../services/snackbar.service";
import { LogsService } from "../../services/logs.service";
import { TokenModel } from "../../models/token";
import { LogsModel } from "../../models/logs-model/logs";
import { Router } from "@angular/router";

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrl: './logs.component.scss',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule]
})
export class LogsComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private logsService: LogsService,
        private router: Router
    ) { }
    selectedDate: Date = new Date
    logsList: LogsModel[]
    ngOnInit(): void {
        this.getLogs()
    }
    getLogs() {
        this.logsService.GetLogs(new TokenModel(this.tokenService.getToken(), 0, formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US'))).subscribe({
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
        this.router.navigate([''])
    }
}