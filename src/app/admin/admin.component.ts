import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {SongsService} from '../songs.service';
import {ListItem} from '../listItem';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    edit = true;
    add = false;

    themes = ['Прославление', 'Открытие'];

    songs: ListItem[] = [];

    constructor(
        private route: Router,
        private songService: SongsService
    ) { }

    ngOnInit() {
        this.Guard();
        this.getSongs();
    }

    Guard() {
        if (!localStorage.getItem('logged')) {
            this.route.navigate(['/login']);
        }
    }

    getSongs() {
        this.songService.getSongs().subscribe(s => this.songs = s);
    }

    private log(message: string) {
        this.songService.log(message);
    }

    logOut() {
        localStorage.removeItem('logged');
        this.route.navigate(['/login']);
    }

    addSong(num: number, tit: string, th: string, dat: string) {
        const song: ListItem = {
            id: num,
            name: tit,
            theme: th,
            date: dat,
            views: 0
        };

        this.songService.addSong(song).subscribe(arrived => this.songs.push(arrived), null, () => this.log('added'));
    }

    editSong(num: number, tit: string, th: string, dat: string, v: number) {
        const song: ListItem = {
            id: num,
            name: tit,
            theme: th,
            date: dat,
            views: v
        };

        this.songService.editSong(song).subscribe(arrived => this.songs[this.songs.indexOf(song)] = arrived, null, () => this.log('saved'));
    }
}
