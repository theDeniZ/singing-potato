import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem, Theme, Lyrics } from './listItem';
import {MessageService} from './message.service';
import {catchError, tap} from 'rxjs/internal/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
};

@Injectable({
    providedIn: 'root'
})
export class SongsService {

    private url = 'https://j-serv-s.herokuapp.com/';
    // private url = 'http://localhost:3000/';
    private songsUrl = 'songs/';
    private themeUrl = 'themes/';
    private lyricsUrl = 'lyrics/';

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    log(message: string) {
        this.messageService.add(message);
    }

    getSongs(): Observable<ListItem[]> {
        return this.http.get<ListItem[]>(this.url + this.songsUrl, httpOptions);
    }

    getSong(id: string, inc: boolean = false): Observable<ListItem> {
        let htt = httpOptions;
        if (inc) {
            htt = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'add' : '1'
                })
            };
        }
        return this.http.get<ListItem>(this.url + this.songsUrl + id, htt);
    }

    addSong(song: ListItem): Observable<ListItem> {
        let body = new HttpParams();
        body = body.set('name', song.name);
        body = body.set('number', song.number.toString());
        if (song.date) {
            body = body.set('date', song.date);
        }
        if (song.name2) {
            body = body.set('name2', song.name2);
        }
        if (song.key) {
            body = body.set('key', song.key);
        }
        body = body.set('theme', song.theme);
        return this.http.post<ListItem>(this.url + this.songsUrl, body, httpOptions);
    }

    editSong(song: ListItem): Observable<ListItem> {
        let body = new HttpParams();
        body = body.set('name', song.name);
        body = body.set('number', song.number.toString());
        body = body.set('date', song.date);
        body = body.set('theme', song.theme);
        body = body.set('name2', song.name2);
        body = body.set('key', song.key);
        return this.http.put<ListItem>(this.url + this.songsUrl + song._id, body, httpOptions);
    }

    deleteSong(id: string): Observable<{}> {
        return this.http.delete(this.url + this.songsUrl + id, httpOptions);
    }

    //themes

    getThemes(): Observable<Theme[]> {
        return this.http.get<Theme[]>(this.url + this.themeUrl, httpOptions);
    }

    getTheme(id: string): Observable<Theme> {
        return this.http.get<Theme>(this.url + this.themeUrl + id, httpOptions);
    }

    addTheme(theme: Theme): Observable<Theme> {
        let body = new HttpParams();
        body = body.set('name', theme.name);
        return this.http.post<Theme>(this.url + this.themeUrl, body, httpOptions);
    }

    editTheme(theme: Theme): Observable<Theme> {
        let body = new HttpParams();
        body = body.set('name', theme.name);
        return this.http.put<Theme>(this.url + this.themeUrl + theme._id, body, httpOptions);
    }

    deleteTheme(id: string): Observable<{}> {
        return this.http.delete(this.url + this.themeUrl + id, httpOptions);
    }

    // lyrics

    getLyrics(): Observable<Lyrics[]> {
        return this.http.get<Lyrics[]>(this.url + this.lyricsUrl, httpOptions);
    }

    getLyric(id: string): Observable<Lyrics> {
        return this.http.get<Lyrics>(this.url + this.lyricsUrl + id, httpOptions);
    }

    addLyrics(lyrics: Lyrics): Observable<Lyrics> {
        let body = new HttpParams();
        body = body.set('songId', lyrics.songId);
        body = body.set('lyrics', lyrics.lyrics);
        return this.http.post<Lyrics>(this.url + this.lyricsUrl, body, httpOptions);
    }

    editLyrics(lyrics: Lyrics): Observable<Lyrics> {
        let body = new HttpParams();
        body = body.set('songId', lyrics.songId);
        body = body.set('lyrics', lyrics.lyrics);
        return this.http.put<Lyrics>(this.url + this.lyricsUrl + lyrics.songId, body, httpOptions);
    }

    deleteLyrics(id: string): Observable<{}> {
        return this.http.delete(this.url + this.lyricsUrl + id, httpOptions);
    }


}
