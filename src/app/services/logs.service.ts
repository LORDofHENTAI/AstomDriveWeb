import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { HttpClient } from "@angular/common/http";
import { TokenModel } from "../models/token";
import { Observable } from "rxjs";
import { LogsModel } from "../models/logs-model/logs";

@Injectable({
    providedIn: "root"
})
export class LogsService {
    constructor(
        private http: HttpClient
    ) { }
    getLogsURL = environment.apiUrl + '/GetLogs/'
    getOrderLogsURL = environment.apiUrl + '/GetOrderLogs/'

    GetLogs(data: TokenModel): Observable<LogsModel[]> {
        return this.http.post<LogsModel[]>(this.getLogsURL, data)
    }
    GetOrderLogs(data: TokenModel): Observable<LogsModel[]> {
        return this.http.post<LogsModel[]>(this.getOrderLogsURL, data)
    }
}