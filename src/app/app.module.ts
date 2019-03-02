import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import {
  MatInputModule,
  MatDialogModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from "@angular/material";
import { PostCreateComponent } from "./Posts/posts-create/post-create.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./Posts/posts-list/posts-list.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRountingModule } from "./app-routing.module";
import { LoginComponent } from "./auth/login/login.component";
import { SignUpComponent } from "./auth/signup/signUp.component";
import { AuthInterceptor } from "./auth/auth-intercepator";
import { ErrorInterceptor } from "./error-intercepator";
import { ErrorComponent } from "./error/error.component";

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignUpComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRountingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
