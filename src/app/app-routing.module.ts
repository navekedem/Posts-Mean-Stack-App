import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from "./Posts/posts-list/posts-list.component";
import { PostCreateComponent } from "./Posts/posts-create/post-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignUpComponent } from "./auth/signup/signUp.component";
import { AuthGuard } from "./auth/auth-guard";

const routes: Routes = [
  {path: '' , component: PostListComponent},
  {path: 'create' , component: PostCreateComponent , canActivate: [AuthGuard]},
  {path: 'edit/:postId' ,component: PostCreateComponent , canActivate: [AuthGuard]},
  {path: 'login' ,component: LoginComponent},
  {path: 'signup' ,component: SignUpComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRountingModule {

}
