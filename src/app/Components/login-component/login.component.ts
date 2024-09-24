import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CommonModule } from '@angular/common';
import { LoginQuery } from '../../models/login-models/login-query';
import { LoginResponse } from '../../models/login-models/login-response';
import { MaterialModule } from '../../material.module';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private tokenService: TokenService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }
  isLoginUser = false;
  inputType: string = 'password'
  userForm: FormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })
  screenWidth: number
  login: string
  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.openSelectModeDialog()
    }
  }

  onClickLogin() {
    if (this.tokenService.getToken()) {
      this.openSelectModeDialog()
    } else {
      this.loginService.getLogin(new LoginQuery(this.userForm.value.login, this.userForm.value.password)).subscribe({
        next: response => {
          if (this.checkResponse(response)) {
            this.tokenService.setCookie(response);
            this.tokenService.logEvent(true);
            this.openSelectModeDialog()
          }
          else
            this.snackbarService.openRedSnackBar("Неверный логин или пароль")
        },
        error: error => {
          console.log(error);
          this.snackbarService.openRedSnackBar()
        }
      })
    }
  }

  openSelectModeDialog() {
    const dialogRef = this.dialog.open(SelectModeDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  checkResponse(response: LoginResponse): boolean {
    if (response)
      if (response.token)
        if (response.token.length > 0)
          return true;
        else return false;
      else return false;
    else return false;
  }
}

@Component({
  templateUrl: './select-mode.dialog.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [MaterialModule, CommonModule]
})
export class SelectModeDialogComponent {
  constructor(
    private router: Router
  ) { }
  goToADrive() {
    this.router.navigate(['/adrive/'])
  }
  goToTechReserv() {
    this.router.navigate(['/orders/'])
  }
}