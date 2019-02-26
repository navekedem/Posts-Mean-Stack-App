import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from '../auth.service';

@Component({
  templateUrl: "./signUp.component.html",
  styleUrls: ["./signUp.component.css"]
})
export class SignUpComponent {

  isLoading = false;

  constructor(public authService: AuthService){

  }


  onSignup(signupForm: NgForm) {
    if(signupForm.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signupForm.value.email , signupForm.value.password);
  }


}
