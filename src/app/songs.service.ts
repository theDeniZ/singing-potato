import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem, Theme } from './listItem';
import {MessageService} from './message.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable({
    providedIn: 'root'
})
export class SongsService {

    private url = 'https://j-serv-s.herokuapp.com';
    private songsUrl = '/Songs';
    private themeUrl = '/Themes';
    // private url = 'http://localhost:3000';

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
        return this.http.post<ListItem>(this.url + this.songsUrl, song, httpOptions);
    }

    editSong(song: ListItem): Observable<ListItem> {
        return this.http.put<ListItem>(this.url + this.songsUrl + '/' + song.id, song, httpOptions);
    }

    deleteSong(id: number): Observable<{}> {
        return this.http.delete(this.url + this.songsUrl + '/' + id);
    }

    getThemes(): Observable<Theme[]> {
        return this.http.get<Theme[]>(this.url + this.themeUrl);
    }

    addTheme(theme: Theme): Observable<Theme> {
        return this.http.post<Theme>(this.url + this.themeUrl, theme, httpOptions);
    }

    editTheme(theme: Theme): Observable<Theme> {
        return this.http.put<Theme>(this.url + this.themeUrl + '/' + theme.id, theme, httpOptions);
    }

    deleteTheme(id: number): Observable<{}> {
        return this.http.delete(this.url + this.themeUrl + '/' + id);
    }

}
