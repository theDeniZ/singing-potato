import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItem } from './listItem';

@Injectable({
    providedIn: 'root'
})
export class SongsService {

    private url = 'https://j-serv-s.herokuapp.com/Songs';
    // private url = 'http://localhost:3000/Songs';

    constructor(private http: HttpClient) { }

    getSongs(): Observable<ListItem[]> {
        return this.http.get<ListItem[]>(this.url);
    }

}
