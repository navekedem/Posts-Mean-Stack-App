import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule, MatProgressSpinner, MatProgressSpinnerModule , MatPaginatorModule} from '@angular/material';
import {PostCreateComponent} from './Posts/posts-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './Posts/posts-list/posts-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRountingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
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
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
