import { Component, OnInit } from '@angular/core';
import {ListItem, Lyrics, AdminLyrics} from '../listItem';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {SongsService} from '../songs.service';
import {switchMap} from 'rxjs/internal/operators';

const s1 = '@media screen and (min-width: 900px) {\n' +
    '        input[type=text], select, input[type=number], input[type=date] {\n' +
    '            padding: 12px 20px !important;\n' +
    '            margin: 5px 0 !important;\n' +
    '            font-size: 16px !important;\n' +
    '        }\n' +
    '        textarea {\n' +
    '            font-size: 16px !important;\n' +
    '        }\n' +
    '        .triple {\n' +
    '            font-size: 17px !important;\n' +
    '        }\n' +
    '        .space {\n' +
    '            height: 8vw !important;\n' +
    '        }\n' +
    '        .half {\n' +
    '            width: 50% !important;\n' +
    '            left: 25% !important;\n' +
    '            margin-top: 8vw !important;\n' +
    '        }\n' +
    '        .edit {\n' +
    '            width: 100% !important;\n' +
    '            /*padding: 0 !important;*/\n' +
    '        }\n' +
    '        .song-list {\n' +
    '            width: 28% !important;\n' +
    '            margin: 1% !important;\n' +
    '        }\n' +
    '        .left {\n' +
    '            position: absolute !important;\n' +
    '            width: 40% !important;\n' +
    '            left: 5% !important;\n' +
    '        }\n' +
    '        .right {\n' +
    '            position: absolute !important;\n' +
    '            width: 40% !important;\n' +
    '            left: 50% !important;\n' +
    '        }\n' +
    '    }';

const dynamicStyles = [ s1 ];

@Component({
    selector: 'app-admin-lyrics',
    templateUrl: './admin-lyrics.component.html',
    styleUrls: ['./admin-lyrics.component.css', '../admin/admin.component.css']
})
export class AdminLyricsComponent implements OnInit, AdminLyrics {

    song: ListItem = null;
    lyrics: Lyrics = null;

    lyr: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private songService: SongsService
    ) {}

    ngOnInit() {
        // this.loadScript();
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.songService.getSong(params.get('id')))
        ).subscribe(s => this.song = s );
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.songService.getLyric(params.get('id')))
        ).subscribe(l => { this.lyrics = l; this.lyr = l.lyrics; }, error2 => this.log(error2.messsage) );
        this.loadStyle();
    }

    save() {
        if (this.lyrics) {
            if (this.lyr.length === 0) {
                this.delete();
                return;
            }
            this.lyrics.lyrics = this.lyr;
            this.songService.editLyrics(this.lyrics).subscribe(this.lyricsHandler, null, () => {
                this.log('saved');
                this.router.navigate(['/admin'])
            });
        } else {
            this.add();
        }
    }

    add() {
        this.lyrics = {
            _id: null,
            songId: this.song._id,
            lyrics: this.lyr
        };
        this.songService.addLyrics(this.lyrics).subscribe(this.lyricsHandler, null, () => {
            this.log('added');
            this.router.navigate(['/admin'])
        });
    }

    delete() {
        this.songService.deleteLyrics(this.lyrics.songId).subscribe();
        this.router.navigate(['/admin']);
        this.log('deleted');
    }

    lyricsHandler(l: Lyrics) {
        this.lyrics = l;
        this.lyr = l.lyrics;
    }

    log(m: string) {
        this.songService.log(m);
    }



    eraseStyle() {
        let e;
        for (let i = 0; i < dynamicStyles .length; i++) {
            if (e = document.getElementById('style-admin-lyr-' + i) ) {
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
            node.id = 'style-admin-lyr-' + i;
            // node.async = false;
            // node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }
}
