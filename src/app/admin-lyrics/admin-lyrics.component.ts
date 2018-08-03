import { Component, OnInit } from '@angular/core';
import {ListItem, Lyrics} from '../listItem';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {SongsService} from '../songs.service';
import {switchMap} from 'rxjs/internal/operators';

@Component({
    selector: 'app-admin-lyrics',
    templateUrl: './admin-lyrics.component.html',
    styleUrls: ['./admin-lyrics.component.css', '../admin/admin.component.css']
})
export class AdminLyricsComponent implements OnInit {

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
    }

    edit() {
        if (this.lyr.length === 0) {
            this.delete();
            return;
        }
        this.lyrics.lyrics = this.lyr;
        this.songService.editLyrics(this.lyrics).subscribe(this.lyricsHandler, null, () => {this.log('saved'); this.router.navigate(['/admin'])});
    }

    add() {
        this.lyrics = {
            _id: null,
            songId: this.song._id,
            lyrics: this.lyr
        };
        this.songService.addLyrics(this.lyrics).subscribe(this.lyricsHandler, null, () => this.log('added'));
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



    loadScript() {
        const dynamicScripts = [ ];

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
