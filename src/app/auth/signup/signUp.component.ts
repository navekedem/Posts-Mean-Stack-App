import { Component , OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from '../auth.service';
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./signUp.component.html",
  styleUrls: ["./signUp.component.css"]
})
export class SignUpComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService){

  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    })
  }
  ngOnDestroy(): void {
   this.authStatusSub.unsubscribe();
  }

  onSignup(signupForm: NgForm) {
    if(signupForm.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signupForm.value.email , signupForm.value.password);
  }


}
