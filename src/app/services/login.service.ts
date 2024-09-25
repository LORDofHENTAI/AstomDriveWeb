import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { HttpClient } from "@angular/common/http";
import { LoginResponse } from "../models/login-models/login-response";
import { Observable } from "rxjs";
import { LoginQuery } from "../models/login-models/login-query";
@Injectable({
    providedIn: "root"
})
export class LoginService {
    private urlLogin = environment.apiUrl + '/auth/'
    private docURL = environment.apiUrl + '/GetDocumentation/'

    constructor(
        private http: HttpClient
    ) { }

    getLogin(login: LoginQuery): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.urlLogin}`, login);
    }
}