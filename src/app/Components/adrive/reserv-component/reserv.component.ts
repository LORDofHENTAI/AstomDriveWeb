import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, formatDate, Time } from "@angular/common";
import { CarReservListModel } from "../../../models/car-reserv-models/car-reserv-list";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { CarReservService } from "../../../services/car-reserv.service";
import { TokenModel } from "../../../models/token";
import { MatDialog } from "@angular/material/dialog";
import { AddReservDialogComponent } from "./add-reserv-dialog-component/add-reserv-dialog.component";
import { CarReservDetailsModel } from "../../../models/car-reserv-models/car-reserv-deatails";
import { Route, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment";
import saveAs from "file-saver";


export interface inputDialogData {
    selectedRow: CarReservListModel,
    AllRows: CarReservListModel[],
    myRoute?: CarReservListModel[]
}
@Component({
    selector: 'app-reserv',
    templateUrl: './reserv.component.html',
    styleUrl: './reserv.component.scss',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule]
})
export class ReservComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private carReservService: CarReservService,
        private router: Router,
        private http: HttpClient
    ) { }
    readonly dialog = inject(MatDialog);
    selectedDate: Date = new Date
    tableHeader: string[] = ['Время', 'Дата', 'Пользователь', 'Выезд из', 'Прибытие в', 'Действия']
    reservList: CarReservListModel[]
    login: string
    admin: boolean
    selectedRow: number = 0
    ngOnInit(): void {
        this.GetReservCar()
        this.login = this.tokenService.getLogin()
        this.admin = this.tokenService.getIsAdmin() == 1 ? true : false
    }

    GetReservCar() {
        this.carReservService.GetReservCarList(new TokenModel(this.tokenService.getToken(), 0, formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US'))).subscribe({
            next: result => {
                this.reservList = result
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    checkRowSpan(element: any): number {
        let count = this.reservList.filter(x => x.listId == element)
        return count.length
    }
    showAction(element: CarReservListModel): boolean {
        if (element.user && (element.user == this.login || this.admin)) {
            let i = this.reservList.filter(x => x.listId == element.listId)
            if (element.reservTime == i[0].reservTime)
                return true
            else
                return false
        }
        else
            return false
    }
    DeleteReserv(id: number) {
        this.carReservService.DeleteReserv(new TokenModel(this.tokenService.getToken(), id)).subscribe({
            next: result => {
                this.GetReservCar()
            },
            error: error => {
                console.log(error);
            }
        })
    }
    inputData: inputDialogData
    openAddDialog(element: CarReservListModel) {
        this.inputData = { selectedRow: element, AllRows: this.reservList }
        const dialogRef = this.dialog.open(AddReservDialogComponent, {
            data: this.inputData,
            width: '1000px',
            maxWidth: 'none',
            height: '510px'
        });
        dialogRef.afterClosed().subscribe(result => {
            this.GetReservCar()
        });
    }
    // openUpdateDialog(element: CarReservListModel) {
    //     let myRoute = this.reservList.filter(x => x.listId == element.listId)
    //     this.inputData = { selectedRow: element, AllRows: this.reservList, myRoute: myRoute }
    //     const dialogRef = this.dialog.open(AddReservDialogComponent, {
    //         data: this.inputData,
    //         width: '1000px',
    //         maxWidth: 'none',
    //         height: '510px'
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //         this.GetReservCar()
    //     });
    // }
    openAgreeDialog(element: number) {
        const dialogRef = this.dialog.open(AgreeDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result == true)
                this.DeleteReserv(element)
        });
    }
    goToLogs() {
        this.router.navigate(['/logs/'])
    }
    Logout() {
        this.tokenService.deleteCookie()
        this.router.navigate(['/login/'])
    }
    goToTechReserv() {
        this.router.navigate(['/orders/'])
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

@Component({
    templateUrl: './agree-dialog.component.html',
    styleUrl: './reserv.component.scss',
    standalone: true,
    imports: [CommonModule, MaterialModule]
})
export class AgreeDialogComponent {

}

