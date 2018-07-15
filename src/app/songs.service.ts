import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem } from './listItem';
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

    private url = 'https://j-serv-s.herokuapp.com/Songs';
    // private url = 'http://localhost:3000/Songs';

    constructor(
        private http: HttpClient,
                private messageService: MessageService
    ) { }

    log(message: string) {
        this.messageService.add(message);
    }

    getSongs(): Observable<ListItem[]> {
        return this.http.get<ListItem[]>(this.url);
    }

    addSong(song: ListItem): Observable<ListItem> {
        return this.http.post<ListItem>(this.url, song, httpOptions);
    }

    editSong(song: ListItem): Observable<ListItem> {
        return this.http.put<ListItem>(this.url + '/' + song.id, song, httpOptions);
    }

}
