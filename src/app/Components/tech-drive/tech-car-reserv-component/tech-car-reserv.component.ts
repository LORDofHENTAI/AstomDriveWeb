import { Component, OnInit } from "@angular/core";
import { MaterialModule } from "../../../material.module";
import { CommonModule, formatDate } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { TechCarReservService } from "../../../services/tech-car-reserv.service";
import { TechCarReservModel } from "../../../models/tech-car-reserv-models/tech-car-reserv";
import { Router } from "@angular/router";
import { TokenModel } from "../../../models/token";
import { MatDialog } from "@angular/material/dialog";
import { AddTechCarReservDialogComponent } from "./add-tech-car-reserv-dialog-component/add-tech-car-reserv-dialog.component";

@Component({
    selector: 'app-tech-car-reserv',
    templateUrl: './tech-car-reserv.component.html',
    styleUrl: './tech-car-reserv.component.scss',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule]
})
export class TechCarReservComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private techCarService: TechCarReservService,
        private router: Router,
        private dialog: MatDialog
    ) { }
    selectedDate: Date = new Date
    admin: boolean = false
    tableHeader: string[] = ['Дата', 'Время', 'Тип доставки', 'Адрес загрузки', 'Адрес выгрузки', 'Характеристики товара', 'Примечания', 'Действие']
    reservList: TechCarReservModel[] = []

    ngOnInit(): void {
        this.admin = this.tokenService.getIsAdmin() == 1 ? true : false
        this.GetOrders()
    }

    GetOrders() {
        this.techCarService.GetTechReserv(new TokenModel(this.tokenService.getToken(), 0, formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US'))).subscribe({
            next: result => {
                this.reservList = result
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }

    DeleteOrder(element: number) {
        this.techCarService.DeteleTechReserv(new TokenModel(this.tokenService.getToken(), element, '')).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Успешно удалено')
                        this.GetOrders()
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Перелогиньтесь')
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar()
                        break
                    case 'NULL':
                        this.snackBarService.openRedSnackBar('запись не найдена')
                        break
                }
            },
            error: error => {
                console.log(error);
            }
        })
    }

    openAddDialog() {
        let curTime = new Date
        let textCurTime = Number(formatDate(curTime, 'H', 'en-US'))
        if (8 <= textCurTime && textCurTime <= 17) {
            const dialogRef = this.dialog.open(AddTechCarReservDialogComponent, {
                width: '600px',
                maxWidth: 'none',
                height: '550px'
            });
            dialogRef.afterClosed().subscribe(result => {
                this.GetOrders()
            });
        } else
            this.snackBarService.openRedSnackBar('Доступно с 8:00 - 17:00')
    }

    openUpdateDialog(element: TechCarReservModel) {
        const dialogRef = this.dialog.open(AddTechCarReservDialogComponent, {
            width: '600px',
            maxWidth: 'none',
            height: '550px',
            data: element
        },

        );
        dialogRef.afterClosed().subscribe(result => {
            this.GetOrders()
        });
    }

    GoToOrdersLogs() {
        this.router.navigate(['/order-logs/'])
    }

    GoToADrive() {
        this.router.navigate(['/adrive/'])
    }

    Logout() {
        this.tokenService.deleteCookie()
        this.router.navigate(['/login/'])
    }
}