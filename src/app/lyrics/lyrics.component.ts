import { Component, OnInit } from '@angular/core';
import {switchMap} from 'rxjs/internal/operators';
import {SongsService} from '../songs.service';
import {ListItem, Lyrics, Theme} from '../listItem';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';


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
    selector: 'app-lyrics',
    templateUrl: './lyrics.component.html',
    styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit {

    song: ListItem = new ListItem();
    lyrics: Lyrics = new Lyrics();
    theme: Theme = new Theme('');

    lyr = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private songService: SongsService
    ) {}

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.songService.getSong(params.get('id'), true))
        ).subscribe(s =>
            {
                this.song = s;
                this.songService.getTheme(this.song.theme).subscribe(t => this.theme = t);
            }
        );
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.songService.getLyric(params.get('id')))
        ).subscribe(l => {this.lyrics = l; this.lyr = l.lyrics; } );
        this.loadStyle();
    }

    eraseStyle() {
        let e;
        for (let i = 0; i < dynamicStyles .length; i++) {
            if (e = document.getElementById('style-lyrics-' + i) ) {
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
            node.id = 'style-lyrics-' + i;
            // node.async = false;
            // node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }
}
