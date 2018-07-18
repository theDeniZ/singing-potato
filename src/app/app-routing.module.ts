import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AdminLyricsComponent} from './admin-lyrics/admin-lyrics.component';
import {LyricsComponent} from './lyrics/lyrics.component';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'song/:id', component: LyricsComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'admin/:id', component: AdminLyricsComponent },
    { path: 'login', component: LoginComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
