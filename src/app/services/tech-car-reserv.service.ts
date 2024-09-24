import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { Observable } from "rxjs";
import { TechCarReservModel } from "../models/tech-car-reserv-models/tech-car-reserv";
import { TokenModel } from "../models/token";
import { Status } from "../models/status";
import { AddTechCarReservModel } from "../models/tech-car-reserv-models/add-tech-car-reserv";

@Injectable({
    providedIn: 'root'
})
export class TechCarReservService {
    constructor(
        private http: HttpClient
    ) { }

    getTechReservURL = environment.apiUrl + '/GetTechReserv/'
    deleteTechReservURL = environment.apiUrl + '/DeleteTechReserv/'
    addTechReservURL = environment.apiUrl + '/AddTechReserv/'
    updateTechReservURL = environment.apiUrl + '/UpdateTechReserv/'

    GetTechReserv(data: TokenModel): Observable<TechCarReservModel[]> {
        return this.http.post<TechCarReservModel[]>(this.getTechReservURL, data)
    }
    DeteleTechReserv(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.deleteTechReservURL, data)
    }
    AddTechReserv(data: AddTechCarReservModel): Observable<Status> {
        console.log(data);

        return this.http.post<Status>(this.addTechReservURL, data)
    }
    UpdateTechReserv(data: AddTechCarReservModel): Observable<Status> {
        return this.http.post<Status>(this.updateTechReservURL, data)
    }
}