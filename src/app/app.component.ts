import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


const s1 = '\n' +
    '@media screen and (min-width: 600px) {\n' +
    '    .tabs a {\n' +
    '        font-size: 16px !important;\n' +
    '        padding:10px 25px !important;\n' +
    '    }\n' +
    '}\n';

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

const dynamicScripts = [ tabsJS ];
const dynamicStyles = [ s1 ];

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
        this.loadStyle();
    }

    shown() {
        const is = !(this.router.url.includes('admin') || this.router.url.includes('login'));
        if (is) {
            this.loadScript();
        }
        return is;
    }

    eraseScript() {
        let e;
        for (let i = 0; i < dynamicScripts .length; i++) {
            if (e = document.getElementById('tab' + i) ) {
                e.remove();
            }
        }
    }

    loadScript() {
        this.eraseScript();
        for (let i = 0; i < dynamicScripts .length; i++) {
            const node = document.createElement('script');
            // node.src = 'assets/js/' + dynamicScripts [i];
            node.innerHTML = dynamicScripts [i];
            node.type = 'text/javascript';
            node.id = 'tab' + i;
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }


    eraseStyle() {
        let e;
        for (let i = 0; i < dynamicStyles .length; i++) {
            if (e = document.getElementById('st-' + i) ) {
                e.remove();
            }
        }
    }

    loadStyle() {
        this.eraseStyle();
        for (let i = 0; i < dynamicStyles .length; i++) {
            const node = document.createElement('style');
            // node.src = 'assets/js/' + dynamicScripts [i];
            node.innerHTML = dynamicStyles [i];
            // node.type = 'text/javascript';
            node.id = 'st-' + i;
            // node.async = false;
            // node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

}

