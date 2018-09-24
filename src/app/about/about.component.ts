import { Component, OnInit } from '@angular/core';


const s1 = '@media screen and (max-width: 600px) {\n' +
    '    .center-box {\n' +
    '        width: calc(100% - 16px) !important;\n' +
    '    }\n' +
    '    .marg {\n' +
    '        display: none !important;\n' +
    '    }\n' +
    '}';

const dynamicStyles = [ s1 ];

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        this.loadStyle();
    }

    eraseStyle() {
        let e;
        for (let i = 0; i < dynamicStyles .length; i++) {
            if (e = document.getElementById('style-about-' + i) ) {
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
            node.id = 'style-about-' + i;
            // node.async = false;
            // node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

}
