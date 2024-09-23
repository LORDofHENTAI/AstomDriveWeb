import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { Observable } from "rxjs";
import { CarReservListModel } from "../models/car-reserv-models/car-reserv-list";
import { TokenModel } from "../models/token";
import { Status } from "../models/status";
import { AddCarReservModel } from "../models/car-reserv-models/add-car-reserv";
import { UpdateCarReservModel } from "../models/car-reserv-models/update-car-reserv";
import { CarReservDetailsModel } from "../models/car-reserv-models/car-reserv-deatails";

@Injectable({
    providedIn: "root"
})
export class CarReservService {
    constructor(
        private http: HttpClient
    ) { }

    getReservCarListUrl = environment.apiUrl + '/GetReservCarList/'
    deleteReservUrl = environment.apiUrl + '/DeleteReserv/'
    addCarReservUrl = environment.apiUrl + '/AddCarReserv/'
    updateCarReservUrl = environment.apiUrl + '/UpdateCarReserv/'
    getReservedListUrl = environment.apiUrl + '/GetReservedList/'

    GetReservCarList(data: TokenModel): Observable<CarReservListModel[]> {
        return this.http.post<CarReservListModel[]>(this.getReservCarListUrl, data)
    }
    DeleteReserv(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.deleteReservUrl, data)
    }
    AddCarReserv(data: AddCarReservModel): Observable<Status> {
        return this.http.post<Status>(this.addCarReservUrl, data)
    }
    UpdateCarReserv(data: UpdateCarReservModel): Observable<Status> {
        return this.http.post<Status>(this.updateCarReservUrl, data)
    }
    GetReservedTimesList(data: TokenModel): Observable<CarReservDetailsModel[]> {
        return this.http.post<CarReservDetailsModel[]>(this.getReservedListUrl, data)
    }
}