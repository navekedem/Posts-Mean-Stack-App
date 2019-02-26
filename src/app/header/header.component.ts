import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuth: boolean = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.userIsAuth = this.authService.getIsUserAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(result => {
        this.userIsAuth = result;
      });
  }

  onLogOut(){
    this.authService.logout();
  }
}
