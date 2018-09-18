import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AdminLyricsComponent } from './admin-lyrics/admin-lyrics.component';
import { LyricsComponent } from './lyrics/lyrics.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'song/:id', component: LyricsComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'admin/:id', component: AdminLyricsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
