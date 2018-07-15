import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {SongsService} from '../songs.service';
import {ListItem, Theme} from '../listItem';
import {strictEqual} from 'assert';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    edit = true;
    add = false;
    theme = false;

    newTheme = false;

    themes: Theme[] = [];
    songs: ListItem[] = [];

    constructor(
        private route: Router,
        private songService: SongsService
    ) { }

    ngOnInit() {
        this.Guard();
        this.getThemes();
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

    getThemes() {
        this.songService.getThemes().subscribe(t => {
            this.themes = t;
            if (t.length) {
                let c = t[0].id;
                let i = 1;
                while (i < t.length) {
                    if (t[i].id > c) {
                        c = t[i].id;
                    }
                    i++;
                }
                Theme.count = c;
            }
        });
    }

    private log(message: string) {
        this.songService.log(message);
    }

    logOut() {
        localStorage.removeItem('logged');
        this.route.navigate(['/login']);
    }

    addSong(num: number, tit: string, th: string, dat: string) {
        let i = 0;
        while (i < this.songs.length) {
            if (this.songs[i].id == num) {
                this.log('song with id ' + num + ' already exist');
                return;
            }
            ++i;
        }
        const song: ListItem = {
            id: num,
            name: tit,
            theme: th,
            date: dat,
            views: 0
        };

        this.songService.addSong(song).subscribe(
            arrived => this.songs.push(arrived),
            null,
            () => {this.log('added'); this.add = false; this.edit = true; this.theme = false; }
            );
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

    deleteSong(id: number) {
        this.songService.deleteSong(id).subscribe();
        for (let i = 0; i < this.songs.length; ++i) {
            if (this.songs[i].id === id) {
                delete this.songs[i];
                break;
            }
        }
    }


    addTheme(tit: string) {
        let i = 0;
        while (i < this.themes.length) {
            if (this.themes[i].name == tit) {
                this.log('theme already exist');
                return;
            }
            ++i;
        }
        const theme = new Theme(tit);


        this.songService.addTheme(theme).subscribe(
            arrived => this.themes.push(arrived),
            null,
            () => {this.log('added'); this.newTheme = false; }
            );
    }

    editTheme(num: number, tit: string) {
        if (!tit.length) {
            this.deleteTheme(num);
            return;
        }
        let theme: Theme = {
            id: num,
            name: tit
        };

        this.songService.editTheme(theme).subscribe(
            arrived => this.themes[this.themes.indexOf(theme)] = arrived,
            null,
            () => this.log('saved')
        );
    }

    deleteTheme(id: number) {
        this.songService.deleteTheme(id).subscribe();
        this.log('deleted');
        for (let i = 0; i < this.themes.length; ++i) {
            if (this.themes[i].id === id) {
                delete this.themes[i];
                break;
            }
        }
    }

}
