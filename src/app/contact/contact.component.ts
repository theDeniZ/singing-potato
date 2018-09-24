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
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        this.loadStyle();
    }

    eraseStyle() {
        let e;
        for (let i = 0; i < dynamicStyles .length; i++) {
            if (e = document.getElementById('style-contact-' + i) ) {
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
            node.id = 'style-contact-' + i;
            // node.async = false;
            // node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

}
