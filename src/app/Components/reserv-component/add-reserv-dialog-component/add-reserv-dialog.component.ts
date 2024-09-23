import { CommonModule, formatDate } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MaterialModule } from "../../../material.module";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CarReservService } from "../../../services/car-reserv.service";
import { TokenService } from "../../../services/token.service";
import { DialogRef } from "@angular/cdk/dialog";
import { TokenModel } from "../../../models/token";
import { CarReservDetailsModel } from "../../../models/car-reserv-models/car-reserv-deatails";
import { CarReservListModel } from "../../../models/car-reserv-models/car-reserv-list";
import { SnackbarService } from "../../../services/snackbar.service";
import { AddCarReservModel } from "../../../models/car-reserv-models/add-car-reserv";

export interface inputDialogData {
    selectedRow: CarReservListModel,
    AllRows: CarReservListModel[],
    myRoute?: CarReservListModel[]
}
export interface inputRoute {
    point: string
}
@Component({
    templateUrl: './add-reserv-dialog.component.html',
    styleUrl: './add-reserv-dialog.component.scss',
    standalone: true,
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule]
})
export class AddReservDialogComponent implements OnInit {
    constructor(
        private carReservService: CarReservService,
        private tokenService: TokenService,
        private dialogRef: MatDialogRef<AddReservDialogComponent>,
        private snackBarService: SnackbarService
    ) { }
    // inputForm: FormGroup = new FormGroup({
    //     // "Points": new FormArray([
    //     //     new FormControl('Долгиновский тракт'),
    //     //     new FormControl(''),
    //     // ]),
    //     'Time': new FormControl(''),
    //     'PointA': new FormArray([
    //         new FormControl('Долгиновский тракт')
    //     ]),
    //     'PointB': new FormArray([
    //         new FormControl('')
    //     ])
    // })
    data = inject<inputDialogData>(MAT_DIALOG_DATA)
    // time: string
    // stepStartIndex: number = 0;
    // stepEndIndex: number = 0
    // finalValue: string;
    // startId: number = 0
    // endId: number = 22
    // steps: string[] = ['qwe', 'asd', 'zxc']
    tableHeader: string[] = ['Время приезда', 'Выезд из', 'Приезд в']
    AllRows: CarReservListModel[] = []
    selectedRoute: CarReservDetailsModel[] = []

    startTime: string
    endTime: string
    pointA: string = 'Долгиновский тракт,188'
    pointB: string = ''
    selectedRow: CarReservListModel
    blockPoints: boolean = false
    ngOnInit(): void {
        this.AllRows = this.data.AllRows
        this.selectedRow = this.data.selectedRow
        this.startTime = this.selectedRow.reservTime
        if (this.data.myRoute) {
            this.data.myRoute.forEach(x => {
                this.selectedRoute.push(new CarReservDetailsModel(x.reservTime, x.pointA!, x.pointB!))
            })
        }

    }

    AddNewPoint() {
        let startId = this.AllRows.find(x => x.reservTime == this.startTime)
        let endId = this.AllRows.find(x => x.reservTime == this.endTime)
        console.log(startId?.id);
        console.log(endId?.id);
        this.AllRows.forEach(x => {
            if (x.reservTime == this.endTime || (startId?.id! <= x.id && x.id <= endId?.id!))
                x.access = 'block'
        })
        this.selectedRoute.push(new CarReservDetailsModel(this.endTime, this.pointA, this.pointB))
        this.startTime = this.endTime
        this.endTime = ''
        this.pointA = this.pointB
        this.pointB = ''
        console.log(this.AllRows);
    }
    DeletePoint() {
        let deleted = this.selectedRoute.pop()
        this.pointA = deleted?.pointA!
        this.blockPoints = false
        this.AllRows.forEach(x => {
            x.access = x.reservTime == deleted?.time ? 'true' : x.access
        })
        // if (this.selectedRoute.length == 0) {
        //     this.AllRows.forEach(x => {
        //         x.access = 'true'
        //     })
        // }
    }

    AddEndPoint() {
        this.selectedRoute.push(new CarReservDetailsModel(this.endTime, this.pointA, 'Долгиновский тракт,188'))
        this.startTime = this.endTime
        this.endTime = ''
        this.pointA = this.pointB
        this.pointB = ''
        this.blockPoints = true
    }
    BlockReserv(): boolean {
        if (this.selectedRoute.length > 0) {
            if (this.selectedRoute[this.selectedRoute.length - 1].pointB == 'Долгиновский тракт,188') {
                return false
            } else
                return true
        } else
            return true
    }
    disableRoute(): boolean {
        if (!this.pointA || !this.pointB || this.pointA == this.pointB || !this.startTime || !this.endTime || this.startTime == this.endTime || String(this.selectedRow.reservDate) == this.endTime) {
            return true
        } else {
            let startRow = this.AllRows.find(x => x.reservTime == this.startTime)
            let endRow = this.AllRows.find(x => x.reservTime == this.endTime)
            if (endRow?.access == 'block' || endRow?.access == 'false')
                return true
            return false
        }
    }
    disableEndRoute() {
        if (!this.endTime || this.selectedRoute.length < 1 || this.startTime == this.endTime || String(this.selectedRow.reservDate) == this.endTime) {
            return true
        } else {
            let startRow = this.AllRows.find(x => x.reservTime == this.startTime)
            let endRow = this.AllRows.find(x => x.reservTime == this.endTime)
            if (endRow?.access == 'block' || endRow?.access == 'false')
                return true
            return false
        }
    }
    ReservCar() {
        let endTime = this.selectedRoute[this.selectedRoute.length - 1].time
        let carReserv = new AddCarReservModel(this.tokenService.getToken(), formatDate(this.selectedRow.reservDate, 'dd.MM.yyyy', 'en-US'), `${this.selectedRow.reservTime}-${endTime}`, this.tokenService.getLogin(), this.selectedRoute)
        this.carReservService.AddCarReserv(carReserv).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Успешно забронированно')
                        this.dialogRef.close('true')
                        break;
                    case 'false':
                        this.snackBarService.openRedSnackBar('Временной промежуток заблокирован')
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar()
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Ошибка токена, перелогиньтесь!')
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    // UpdateReservCar() {
    //     let endTime = this.selectedRoute[this.selectedRoute.length - 1].time
    //     let carReserv = new AddCarReservModel(this.tokenService.getToken(), formatDate(this.selectedRow.reservDate, 'dd.MM.yyyy', 'en-US'), `${this.selectedRow.reservTime}-${endTime}`, this.tokenService.getLogin(), this.selectedRoute)
    //     this.carReservService.UpdateCarReserv(carReserv).subscribe({
    //         next: result => {
    //             switch (result.status) {
    //                 case 'true':
    //                     this.snackBarService.openSnackGreenBar('Успешно сохранено')
    //                     this.dialogRef.close('true')
    //                     break;
    //                 case 'false':
    //                     this.snackBarService.openRedSnackBar('Временной промежуток заблокирован')
    //                     break;
    //                 case 'error':
    //                     this.snackBarService.openRedSnackBar()
    //                     break;
    //                 case 'BadAuth':
    //                     this.snackBarService.openRedSnackBar('Ошибка токена, перелогиньтесь!')
    //                     break;
    //             }
    //         },
    //         error: error => {
    //             console.log(error);
    //             this.snackBarService.openRedSnackBar()
    //         }
    //     })
    // }


    // getFormsControlsPointA(): FormArray {
    //     return this.inputForm.controls["PointA"] as FormArray;
    // }
    // getFormsControlsPointB(): FormArray {
    //     return this.inputForm.controls["PointB"] as FormArray;
    // }
    // AddNewPoint() {
    //     (<FormArray>this.inputForm.controls["PointA"]).push(new FormControl(this.inputForm.controls['PointB'].value[this.inputForm.controls['PointB'].value.length - 1]));
    //     (<FormArray>this.inputForm.controls["PointB"]).push(new FormControl(''));
    // }
    // AddEndPoint() {
    //     (<FormArray>this.inputForm.controls["PointA"]).push(new FormControl(this.inputForm.controls['PointB'].value[this.inputForm.controls['PointB'].value.length - 1]));
    //     (<FormArray>this.inputForm.controls["PointB"]).push(new FormControl('Долгиновский тракт'));
    // }
    // disableB(element: number): boolean {
    //     return element != this.inputForm.controls["PointB"].value.length - 1 ? true : false
    // }
    // DeletePoint() {
    //     (<FormArray>this.inputForm.controls["PointA"]).removeAt(-1);
    //     (<FormArray>this.inputForm.controls["PointB"]).removeAt(-1);
    // }
    // carReservDetail: CarReservDetailsModel[]
    // AddReserv() {
    //     this.carReservDetail.push(new CarReservDetailsModel('', '', ''))
    // }

}