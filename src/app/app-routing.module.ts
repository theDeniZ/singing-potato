import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './Auth';

const routes: Routes = [
    { path: '', loadChildren: './list/list.component#ListComponent' }
    // { path: 'admin', component: AdminComponent, canActivate: AuthGuard }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
