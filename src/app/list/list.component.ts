import { Component, OnInit } from '@angular/core';
import { ListItem } from '../listItem';
import {SongsService} from '../songs.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    songs: ListItem[];

    constructor(private songService: SongsService) { }

    ngOnInit() {
        this.getSongs();
    }

    getSongs() {
        this.songService.getSongs().subscribe(songs => this.songs = songs, null, () => { this.loadScript(); });
    }

    eraseScript() {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; ++i) {
            if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('list')) {
                scripts[i].remove();
            }
        }
    }

    loadScript() {
        const dynamicScripts = ['jquery-1.11.2.min.js', 'bootstrap-table.js', 'list.js'];

        for (let i = 0; i < dynamicScripts .length; i++) {
            const node = document.createElement('script');
            node.src = 'assets/list/' + dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

}
