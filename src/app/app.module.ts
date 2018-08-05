import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './list/list.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { AdminLyricsComponent } from './admin-lyrics/admin-lyrics.component';
import { LyricsComponent } from './lyrics/lyrics.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatProgressBarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    AdminComponent,
    LoginComponent,
    MessagesComponent,
    AdminLyricsComponent,
    LyricsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FroalaEditorModule,
    FroalaViewModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
