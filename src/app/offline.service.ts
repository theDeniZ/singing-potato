import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ListItem, Theme, Lyrics} from './listItem';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MessageService} from './message.service';

@Injectable({
    providedIn: 'root'
})
export class OfflineService {

    private songsKey = 'songs';
    private songKey = 'song/';

    private themesKey = 'themes';
    private themeKey = 'theme/';

    private lyricsKey = 'lyrics';
    private lyricKey = 'lyric/';

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    log(message: string) {
        this.messageService.add(message);
    }

    // songs

    getSongs(): Observable<ListItem[]> {
        return of(JSON.parse(localStorage.getItem(this.songsKey)));
    }

    setSongs(songs: ListItem[]) {
        localStorage.setItem(this.songsKey, JSON.stringify(songs));
    }

    getSong(id) {
        return of(JSON.parse(localStorage.getItem(this.songKey + id)));
    }

    setSong(id, s) {
        localStorage.setItem(this.songKey + id, JSON.stringify(s));
    }

    deleteSong(id) {
        localStorage.removeItem(this.songKey + id);
    }

    // themes

    getThemes(): Observable<Theme[]> {
        return of(JSON.parse(localStorage.getItem(this.themesKey)));
    }

    setThemes(themes: Theme[]) {
        localStorage.setItem(this.themesKey, JSON.stringify(themes));
    }

    getTheme(id) {
        return of(JSON.parse(localStorage.getItem(this.themeKey + id)));
    }

    setTheme(id, t) {
        localStorage.setItem(this.themeKey + id, JSON.stringify(t));
    }

    deleteTheme(id) {
        localStorage.removeItem(this.themeKey + id);
    }

    // lyrics

    getLyrics(): Observable<Lyrics[]> {
        return of(JSON.parse(localStorage.getItem(this.lyricsKey)));
    }

    setLyrics(lyrics: Lyrics[]) {
        localStorage.setItem(this.lyricsKey, JSON.stringify(lyrics));
    }

    getLyric(id) {
        return of(JSON.parse(localStorage.getItem(this.lyricKey + id)));
    }

    setLyric(id, t) {
        localStorage.setItem(this.lyricKey + id, JSON.stringify(t));
    }

    deleteLyric(id) {
        localStorage.removeItem(this.lyricKey + id);
    }
}
