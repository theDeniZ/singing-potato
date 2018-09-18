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
import {
    MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatProgressBarModule,
    MatToolbarModule, MatSidenavModule, MatListModule
} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    AdminComponent,
    LoginComponent,
    MessagesComponent,
    AdminLyricsComponent,
    LyricsComponent,
    MenuComponent,
    AboutComponent,
    ContactComponent
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
      MatToolbarModule,
      MatSidenavModule,
      MatIconModule,
      MatListModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
