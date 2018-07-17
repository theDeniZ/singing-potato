import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem, Theme } from './listItem';
import {MessageService} from './message.service';
import {catchError, tap} from 'rxjs/internal/operators';

const httpOptions = {
    headers: new HttpHeaders({
        // 'Content-Type':  'application/json',
        // 'Authorization': 'my-auth-token'
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

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    log(message: string) {
        this.messageService.add(message);
    }

    getSongs(): Observable<ListItem[]> {
        return this.http.get<ListItem[]>(this.url + this.songsUrl);
    }

    addSong(song: ListItem): Observable<ListItem> {
        let body = new HttpParams();
        body = body.set('name', song.name);
        body = body.set('number', song.number.toString());
        body = body.set('date', song.date);
        body = body.set('themeId', song.theme._id);
        return this.http.post<ListItem>(this.url + this.songsUrl, body, httpOptions);
    }

    editSong(song: ListItem): Observable<ListItem> {
        let body = new HttpParams();
        body = body.set('name', song.name);
        body = body.set('number', song.number.toString());
        body = body.set('date', song.date);
        body = body.set('themeId', song.theme._id);
        return this.http.put<ListItem>(this.url + this.songsUrl + song._id, body, httpOptions);
    }

    deleteSong(id: string): Observable<{}> {
        return this.http.delete(this.url + this.songsUrl + id);
    }

    getThemes(): Observable<Theme[]> {
        return this.http.get<Theme[]>(this.url + this.themeUrl);
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
        return this.http.delete(this.url + this.themeUrl + id);
    }

}
