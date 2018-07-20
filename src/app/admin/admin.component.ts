import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {SongsService} from '../songs.service';
import {ListItem, Theme} from '../listItem';

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

    displayedSongs: ListItem[] = [];

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
        this.songService.getSongs().subscribe(
            s => {
                this.songs = s.sort(
                    (a, b) => {
                        return a.number - b.number;
                    });
                this.displayedSongs = this.songs;
        });
    }

    getThemes() {
        this.songService.getThemes().subscribe(t => this.themes = t, error2 => this.log(error2.message));
    }

    doSearch(str: string) {
        str = str.toLowerCase();
        this.displayedSongs = this.songs.filter(
            (song, index, list) => {
                return song.name.toLowerCase().includes(str) || song.number.toString().includes(str);
            }
        );
    }

    private log(message: string) {
        this.songService.log(message);
    }

    logOut() {
        localStorage.removeItem('logged');
        this.route.navigate(['/login']);
    }

    addSong(num: number, tit: string, thId: string, dat: string) {
        const song: ListItem = {
            _id: '',
            number: num,
            name: tit,
            theme: thId,
            date: dat.length > 0 ? dat : null,
            views: 0
        };

        this.songService.addSong(song).subscribe(
            arrived => this.songs.push(arrived),
            null,
            () => {this.log('added'); this.add = false; this.edit = true; this.theme = false; }
        );
    }

    editSong(id: string, n: number, tit: string, thId: string, dat: string, v: number) {
        const song: ListItem = {
            _id: id,
            number: n,
            name: tit,
            theme: thId,
            date: dat,
            views: v
        };
        this.songService.editSong(song).subscribe(
            arrived => this.songs[this.songs.indexOf(song)] = arrived,
            null,
            () => this.log('saved')
        );
    }

    deleteSong(id: string) {
        this.songService.deleteSong(id).subscribe();
        for (let i = 0; i < this.songs.length; ++i) {
            if (this.songs[i]._id === id) {
                delete this.songs[i];
                break;
            }
        }
        for (let i = 0; i < this.displayedSongs.length; ++i) {
            if (this.displayedSongs[i]._id === id) {
                delete this.displayedSongs[i];
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

    editTheme(num: string, tit: string) {
        if (!tit.length) {
            this.deleteTheme(num);
            return;
        }
        let theme: Theme = null;
        let i = -1;
        while (!theme && i < this.themes.length) {
            ++i;
            if (this.themes[i]._id == num) {
                theme = this.themes[i];
            }
        }
        theme.name = tit;

        this.songService.editTheme(theme).subscribe(
            arrived => this.themes[i] = arrived,
            null,
            () => this.log('saved')
        );
    }

    deleteTheme(id: string) {
        this.songService.deleteTheme(id).subscribe();
        this.log('deleted');
        for (let i = 0; i < this.themes.length; ++i) {
            if (this.themes[i]._id == id) {
                delete this.themes[i];
                break;
            }
        }
    }

}
