import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ListItem, Theme, Lyrics } from './listItem';
import {MessageService} from './message.service';
import {catchError, count, tap} from 'rxjs/internal/operators';
import {OfflineService} from './offline.service';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
};

@Injectable({
    providedIn: 'root'
})
export class SongsService {

    // static status = false;
    // static singleTon;

    // online$: Observable<boolean>;

    private url = 'https://j-serv-s.herokuapp.com/';
    // private url = 'http://localhost:3000/';
    private songsUrl = 'songs/';
    private themeUrl = 'themes/';
    private lyricsUrl = 'lyrics/';

    private offlineString = 'offlineMode';



    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private offline: OfflineService
    ) {
        this.actualize();
        // if (SongsService.singleTon) {
        //     this.log('ha ha');
        //     return SongsService.singleTon;
        // } else {
        //     if (navigator && window) {
        //         this.online$ = merge(
        //             of(navigator.onLine),
        //             fromEvent(window, 'online').pipe(mapTo(true)),
        //             fromEvent(window, 'offline').pipe(mapTo(false))
        //         );
        //     } else {
        //         const serv = this;
        //         this.online$ = Observable.create(obs => {
        //             obs.next(SongsService.status);
        //
        //             setInterval(function () {
        //                 serv.http.get(serv.url + serv.themeUrl).subscribe(
        //                     _ => {
        //                         SongsService.status = true;
        //                         obs.next(true);
        //                     },
        //                     _ => {
        //                         SongsService.status = false;
        //                         obs.next(false);
        //                     }
        //                 );
        //             }, serv.time);
        //         });
        //     }
        // }
        // SongsService.singleTon = this;
    }

    log(message: string) {
        // this.messageService.add(message);
        console.log(message);
    }

    getSongs(): Observable<ListItem[]> {
        return this.http.get<ListItem[]>(this.url + this.songsUrl, httpOptions).pipe(
            tap(d => {this.offline.setSongs(d); }),
            catchError(() => {
                if (localStorage.getItem(this.offlineString)) {
                    return this.offline.getSongs();
                } else {
                    this.log('offline, no stored data');
                    return of(null);
                }
            })
        );
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
        return this.http.get<ListItem>(this.url + this.songsUrl + id, htt).pipe(
            catchError(() => {
                if (localStorage.getItem(this.offlineString)) {
                    return this.offline.getSong(id);
                } else {
                    this.log('offline, no stored data');
                    return of(null);
                }
            })
        );
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

        return this.http.post<ListItem>(this.url + this.songsUrl, body, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    editSong(song: ListItem): Observable<ListItem> {
        let body = new HttpParams();
        body = body.set('name', song.name);
        body = body.set('number', song.number.toString());
        body = body.set('date', song.date);
        body = body.set('theme', song.theme);
        body = body.set('name2', song.name2);
        body = body.set('key', song.key);
        return this.http.put<ListItem>(this.url + this.songsUrl + song._id, body, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    deleteSong(id: string): Observable<{}> {
        return this.http.delete(this.url + this.songsUrl + id, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    // themes

    getThemes(): Observable<Theme[]> {
        return this.http.get<Theme[]>(this.url + this.themeUrl, httpOptions).pipe(
            tap(d => {this.offline.setThemes(d); }),
            catchError(() => {
                if (localStorage.getItem(this.offlineString)) {
                    return this.offline.getThemes();
                } else {
                    this.log('offline, no stored data');
                    return of(null);
                }
            })
        );
    }

    getTheme(id: string): Observable<Theme> {
        return this.http.get<Theme>(this.url + this.themeUrl + id, httpOptions).pipe(
            catchError(() => {
                if (localStorage.getItem(this.offlineString)) {
                    return this.offline.getTheme(id);
                } else {
                    this.log('offline, no stored data');
                    return of(null);
                }
            })
        );
    }

    addTheme(theme: Theme): Observable<Theme> {
        let body = new HttpParams();
        body = body.set('name', theme.name);
        return this.http.post<Theme>(this.url + this.themeUrl, body, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    editTheme(theme: Theme): Observable<Theme> {
        let body = new HttpParams();
        body = body.set('name', theme.name);
        return this.http.put<Theme>(this.url + this.themeUrl + theme._id, body, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    deleteTheme(id: string): Observable<{}> {
        return this.http.delete(this.url + this.themeUrl + id, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    // lyrics

    getLyrics(): Observable<Lyrics[]> {
        return this.http.get<Lyrics[]>(this.url + this.lyricsUrl, httpOptions).pipe(
            tap(d => {this.offline.setLyrics(d); }),
            catchError(() => {
                if (localStorage.getItem(this.offlineString)) {
                    return this.offline.getLyrics();
                } else {
                    this.log('offline, no stored data');
                    return of(null);
                }
            })
        );
    }

    getLyric(id: string): Observable<Lyrics> {
        return this.http.get<Lyrics>(this.url + this.lyricsUrl + id, httpOptions).pipe(
            catchError(() => {
                if (localStorage.getItem(this.offlineString)) {
                    return this.offline.getLyric(id);
                } else {
                    this.log('offline, no stored data');
                    return of(null);
                }
            })
        );
    }

    addLyrics(lyrics: Lyrics): Observable<Lyrics> {
        let body = new HttpParams();
        body = body.set('songId', lyrics.songId);
        body = body.set('lyrics', lyrics.lyrics);
        return this.http.post<Lyrics>(this.url + this.lyricsUrl, body, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    editLyrics(lyrics: Lyrics): Observable<Lyrics> {
        let body = new HttpParams();
        body = body.set('songId', lyrics.songId);
        body = body.set('lyrics', lyrics.lyrics);
        return this.http.put<Lyrics>(this.url + this.lyricsUrl + lyrics.songId, body, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    deleteLyrics(id: string): Observable<{}> {
        return this.http.delete(this.url + this.lyricsUrl + id, httpOptions).pipe(
            catchError(() => {
                this.log('offline');
                return of(null);
            })
        );
    }

    actualize() {
        console.log('actualising');
        if (localStorage.getItem('date')) {
            const t = +((Date.now() - +localStorage.getItem('date')) / 1000).toFixed(0);
            if (t > 12 * 60 * 60) {  // 12 hours * 60 minutes * 60 seconds
                this.storeDataToLocal();
            }
            // this.log(t.toString());
        } else {
            this.storeDataToLocal();
        }
    }

    storeDataToLocal(callback: (size) => void = null) {

        let count = 0;
        const s = this;
        function complete(data) {
            if (data) {
                count++;
            }
            if (count === 3 && callback) {
                localStorage.setItem('date', Date.now().toString());
                localStorage.setItem(s.offlineString, 'true');
                callback(s.getCapacityString());
            }
        }


        this.getThemes().subscribe(complete);
        this.getSongs().subscribe(complete);
        this.getLyrics().subscribe(complete);
    }

    clearLocalStorage(andLoad = true) {
        localStorage.removeItem(this.offline.lyricsKey);
        localStorage.removeItem(this.offline.themesKey);
        localStorage.removeItem(this.offline.songsKey);
        localStorage.removeItem(this.offlineString);
        if (andLoad) {
            localStorage.setItem(this.offlineString, 'true');
            this.storeDataToLocal();
        }
    }

    getCapacityString() {
        return this.offline.getCapacityString();
    }

}
