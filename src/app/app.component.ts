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
        const dynamicScripts = [ tabsJS ];

        for (let i = 0; i < dynamicScripts .length; i++) {
            const node = document.createElement('script');
            // node.src = 'assets/js/' + dynamicScripts [i];
            node.innerHTML = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

}


const tabsJS = 'var tabs = $(\'.tabs\');\n' +
    'var items = $(\'.tabs\').find(\'a\').length;\n' +
    'var selector = $(".tabs").find(".selector");\n' +
    'var activeItem = tabs.find(\'.active\');\n' +
    'var activeWidth = activeItem.innerWidth();\n' +
    '$(".selector").css({\n' +
    '    "left": activeItem.position.left + "px",\n' +
    '    "width": activeWidth + "px"\n' +
    '});\n' +
    '\n' +
    '$(".tabs").on("click","a",function(){\n' +
    '    $(\'.tabs a\').removeClass("active");\n' +
    '    $(this).addClass(\'active\');\n' +
    '    var activeWidth = $(this).innerWidth();\n' +
    '    var itemPos = $(this).position();\n' +
    '    $(".selector").css({\n' +
    '        "left":itemPos.left + "px",\n' +
    '        "width": activeWidth + "px"\n' +
    '    });\n' +
    '});\n' +
    '\n' +
    '$(\'.active\').trigger(\'click\');';
