import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {SongsService} from './songs.service';
import { ProgressBarAPI } from './listItem';

const s1 = '\n' +
    '@media screen and (min-width: 600px) {\n' +
    '    .tabs a {\n' +
    '        font-size: 16px !important;\n' +
    '        padding:10px 25px !important;\n' +
    '    }\n' +
    '    .can-toggle {\n' +
    '        top: 15px !important;\n' +
    '    }\n' +
    '    .can-toggle.demo-rebrand-2 input[type="checkbox"]:checked ~ label .can-toggle__switch:after {\n' +
    '        -webkit-transform: translate3d(39px, 0, 0) !important;\n' +
    '        transform: translate3d(39px, 0, 0) !important;\n' +
    '    }\n' +
    '    .can-toggle.demo-rebrand-2 label {\n' +
    '        font-size: 9px !important;\n' +
    '    }\n' +
    '    .can-toggle.demo-rebrand-2 label .can-toggle__switch {\n' +
    '        height: 40px !important;\n' +
    '        -webkit-flex: 0 0 80px !important;\n' +
    '        -ms-flex: 0 0 80px !important;\n' +
    '        flex: 0 0 80px !important;\n' +
    '        border-radius: 40px !important;\n' +
    '    }\n' +
    '    .can-toggle.demo-rebrand-2 label .can-toggle__switch:before {\n' +
    '        left: 40px !important;' +
    '        font-size: 10px !important;\n' +
    '        line-height: 40px !important;\n' +
    '        width: 40px !important;\n' +
    '        padding: 0 6px !important;\n' +
    '    }\n' +
    '    .can-toggle.demo-rebrand-2 label .can-toggle__switch__inactive:before {\n' +
    '        left: 0 !important;' +
    '    }\n' +
    '    .can-toggle.demo-rebrand-2 label .can-toggle__switch:after {\n' +
    '        top: 2px !important;\n' +
    '        left: 2px !important;\n' +
    '        border-radius: 24px !important;\n' +
    '        width: 37px !important;\n' +
    '        line-height: 36px !important;\n' +
    '        font-size: 8px !important;\n' +
    '    }' +
    '    .floating {\n' +
    '        right: 6vw !important;\n' +
    '    }' +
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
export class AppComponent implements OnInit, ProgressBarAPI {

    checked = false;

    progressValue = 0;
    progressVisibility = false;

    constructor(
        private service: SongsService,
        private router: Router
    ) {
        SongsService.progressBar = this;
    }

    ngOnInit() {
        this.loadScript();
        this.loadStyle();
        this.checked = this.service.isOfflineOn();
    }

    // progressAPI

    setValue(value) {
        setTimeout(() => this.progressValue = value, 10);
    }

    setVisibility(v) {
        setTimeout(() => {this.handleVisibility(v); }, 10);
    }

    handleVisibility(v) {
        if (this.progressVisibility && !v) {
            while (this.progressValue < 100) {}
            setTimeout(() => {this.progressVisibility = v; }, 100);
        } else if (!this.progressVisibility && v) {
            this.progressVisibility = v;
        }
    }

    // handleVaue(v) {
    //     if ( this.progressVisibility ) {
    //         while (this.progressValue % 10 !== 0) {}
    //         setTimeout(() => this.progressValue = v, 100);
    //     }
    // }

    isOff() {
        return this.service.isOfflineOn();
    }

    shown() {
        const is = !(this.router.url.includes('admin') || this.router.url.includes('login'));
        if (is) {
            this.loadScript();
        }
        return is;
    }

    toggleOffline() {
        if (this.service.isOfflineOn()) {
            this.service.clearLocalStorage();
        } else {
            this.service.storeDataToLocal();
        }
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