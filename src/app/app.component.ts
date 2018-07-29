import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router
    ) {}

    ngOnInit() {
        this.loadScript();
    }

    shown() {
        const is = !(this.router.url.includes('admin') || this.router.url.includes('login'));
        if (is) {
            this.loadScript();
        }
        return is;
    }

    eraseScript() {
        const scripts = document.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; ++i) {
            if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("tabs.js")) {
                scripts[i].remove();
            }
        }
    }

    loadScript() {
        this.eraseScript();
        const dynamicScripts = [ 'tabs.js' ];

        for (let i = 0; i < dynamicScripts .length; i++) {
            const node = document.createElement('script');
            node.src = 'assets/js/' + dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }
}
