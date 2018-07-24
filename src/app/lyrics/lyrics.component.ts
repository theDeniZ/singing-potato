import { Component, OnInit } from '@angular/core';
import {switchMap} from 'rxjs/internal/operators';
import {SongsService} from '../songs.service';
import {ListItem, Lyrics} from '../listItem';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
    selector: 'app-lyrics',
    templateUrl: './lyrics.component.html',
    styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit {

    song: ListItem = null;
    lyrics: Lyrics = null;

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
        ).subscribe(s => this.song = s );
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.songService.getLyric(params.get('id')))
        ).subscribe(l => {this.lyrics = l; this.lyr = l.lyrics;} );
    }

    getLyrics() {
        return this.lyrics.lyrics;
    }

}
