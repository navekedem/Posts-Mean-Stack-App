import { NgModule } from "@angular/core";
import {RouterModule, Routes } from '@angular/router';
import { PostListComponent } from "./Posts/posts-list/posts-list.component";
import { PostCreateComponent } from "./Posts/posts-create/post-create.component";

const routes: Routes = [
  {path: '' , component: PostListComponent},
  {path: 'create' , component: PostCreateComponent},
  {path: 'edit/:postId' ,component: PostCreateComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRountingModule {

}
