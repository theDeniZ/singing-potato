import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router) { }
    message = '';

    ngOnInit() {
    }

    login(name: string, pass: string) {
        if (
            (name === 'mind' && pass === 'sharp') ||
            (name === '380961548922' && pass === 'wasya2101') ||
            (name === 'sergio' && pass === 'Ohnedan2776')
        ) {
            localStorage.setItem('logged', 'true');
            this.router.navigate(['/admin']);
        } else {
            this.message = 'try again..';
        }
    }
}
