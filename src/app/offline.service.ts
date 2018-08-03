import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ListItem, Theme, Lyrics} from './listItem';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MessageService} from './message.service';

@Injectable({
    providedIn: 'root'
})
export class OfflineService {

    songsKey = 'songs';
    themesKey = 'themes';
    lyricsKey = 'lyrics';

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    log(message: string) {
        this.messageService.add(message);
    }

    // songs

    getSongs(): Observable<ListItem[]> {
        let e;
        if (e = localStorage.getItem(this.songsKey)) {
            return of(JSON.parse(e));
        }
    }

    setSongs(songs: ListItem[]) {
        localStorage.setItem(this.songsKey, JSON.stringify(songs));
    }

    getSong(id) {
        const songs = JSON.parse(localStorage.getItem(this.songsKey));
        for (const s of songs) {
            if (s._id === id) {
                return of(s);
            }
        }
    }

    // setSong(id, s) {
    //     localStorage.setItem(this.songKey + id, JSON.stringify(s));
    // }
    //
    // deleteSong(id) {
    //     localStorage.removeItem(this.songKey + id);
    // }

    // themes

    getThemes(): Observable<Theme[]> {
        return of(JSON.parse(localStorage.getItem(this.themesKey)));
    }

    setThemes(themes: Theme[]) {
        localStorage.setItem(this.themesKey, JSON.stringify(themes));
    }

    getTheme(id) {
        const themes = JSON.parse(localStorage.getItem(this.themesKey));
        for (const theme of themes) {
            if (theme._id === id) {
                return of(theme);
            }
        }
    }

    // setTheme(id, t) {
    //     localStorage.setItem(this.themeKey + id, JSON.stringify(t));
    // }
    //
    // deleteTheme(id) {
    //     localStorage.removeItem(this.themeKey + id);
    // }

    // lyrics

    getLyrics(): Observable<Lyrics[]> {
        return of(JSON.parse(localStorage.getItem(this.lyricsKey)));
    }

    setLyrics(lyrics: Lyrics[]) {
        localStorage.setItem(this.lyricsKey, JSON.stringify(lyrics));
    }

    getLyric(id) {
        const lyr = JSON.parse(localStorage.getItem(this.lyricsKey));
        for (const l of lyr) {
            if (l.songId === id) {
                return of(l);
            }
        }
    }

    // setLyric(id, t) {
    //     localStorage.setItem(this.lyricKey + id, JSON.stringify(t));
    // }
    //
    // deleteLyric(id) {
    //     localStorage.removeItem(this.lyricKey + id);
    // }

    getCapacityString() {
        // return '';
        if (localStorage.getItem(this.songsKey) && localStorage.getItem(this.themesKey) && localStorage.getItem(this.lyricsKey)) {
            console.log('getting');
            const l = localStorage.getItem(this.songsKey).length +
                localStorage.getItem(this.themesKey).length +
                localStorage.getItem(this.lyricsKey).length;
            return (l / 1024).toFixed(0).toString() + 'KB';
        } else {
            return '0B';
        }
    }
}
