import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material.module";
import { CommonModule, formatDate } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TokenService } from "../../../../services/token.service";
import { SnackbarService } from "../../../../services/snackbar.service";
import { TechCarReservService } from "../../../../services/tech-car-reserv.service";
import { TokenModel } from "../../../../models/token";
import { TechCarReservModel } from "../../../../models/tech-car-reserv-models/tech-car-reserv";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { AddTechCarReservModel, AddTechCarReservPropModel } from "../../../../models/tech-car-reserv-models/add-tech-car-reserv";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    templateUrl: './add-tech-car-reserv-dialog.component.html',
    styleUrl: './add-tech-car-reserv-dialog.component.scss',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule],
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})
export class AddTechCarReservDialogComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private techCarReservService: TechCarReservService,
        private dialogRef: MatDialogRef<AddTechCarReservDialogComponent>,
    ) { }
    data = inject<TechCarReservModel>(MAT_DIALOG_DATA)
    times: string[] = []
    deliveryTypes: string[] = ['Сервисный центр', 'По назнач. гл. инженера', "Развоз документов"]
    carReserved: TechCarReservModel[]

    selectedDate: Date = new Date
    selectedTime: string
    dawnloadInput: string
    uploadInput: string
    parasmInput: string
    selectedType: string
    commentInput: string

    ngOnInit(): void {
        let i = 8
        while (i <= 17) {
            this.times.push(`${i}:00:00`)
            i++
        }
        this.checkTimes()
        if (this.data) {
            this.selectedDate = this.data.order_date
            this.selectedTime = this.data.order_time
            this.dawnloadInput = this.data.order_download
            this.uploadInput = this.data.order_upload
            this.parasmInput = this.data.order_good
            this.selectedType = this.data.order_type
            this.commentInput = this.data.order_note
        }
    }
    checkTimes() {
        this.techCarReservService.GetTechReserv(new TokenModel(this.tokenService.getToken(), 0, formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US'))).subscribe({
            next: result => {
                this.carReserved = result
            },
            error: error => {
                console.log(error);
            }
        })
    }
    timeChecker(element: string): boolean {
        if (this.carReserved) {
            let car = this.carReserved.find(x => x.order_time == element)
            if (car) {
                return true
            } else
                return false
        } else
            return false

    }
    createDisable(): boolean {
        if (!this.selectedDate || !this.selectedTime || !this.dawnloadInput || !this.uploadInput || !this.parasmInput || !this.selectedType || !this.commentInput || this.timeChecker(this.selectedTime)) {
            return true
        } else
            return false
    }
    addTechReservCar() {
        let techReserv = new AddTechCarReservPropModel(0, formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US'), this.selectedTime, this.dawnloadInput, this.uploadInput, this.parasmInput, this.commentInput, this.selectedType)
        this.techCarReservService.AddTechReserv(new AddTechCarReservModel(this.tokenService.getToken(), techReserv)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Заявка создана')
                        this.dialogRef.close()
                        break
                    case 'Block':
                        this.snackBarService.openRedSnackBar('Заблокированно')
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Перелогиньтесь')
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar()
                        break
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    updateTechReservCar() {
        let techReserv = new AddTechCarReservPropModel(this.data.id, formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US'), this.selectedTime, this.dawnloadInput, this.uploadInput, this.parasmInput, this.commentInput, this.selectedType)
        this.techCarReservService.UpdateTechReserv(new AddTechCarReservModel(this.tokenService.getToken(), techReserv)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Изменения сохранены')
                        this.dialogRef.close()
                        break
                    case 'Block':
                        this.snackBarService.openRedSnackBar('Заблокированно')
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Перелогиньтесь')
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar()
                        break
                }
            },
            error: error => {
                console.log(error);

            }
        })
    }
}