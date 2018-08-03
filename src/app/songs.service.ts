import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ListItem, Theme, Lyrics } from './listItem';
import {MessageService} from './message.service';
import {catchError, tap} from 'rxjs/internal/operators';
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

    static status = false;
    static singleTon;

    online$: Observable<boolean>;

    private url = 'https://j-serv-s.herokuapp.com/';
    // private url = 'http://localhost:3000/';
    private songsUrl = 'songs/';
    private themeUrl = 'themes/';
    private lyricsUrl = 'lyrics/';

    private time = 5000;



    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private offline: OfflineService
    ) {
        if (SongsService.singleTon) {
            this.log('ha ha');
            return SongsService.singleTon;
        } else {
            if (navigator && window) {
                this.online$ = merge(
                    of(navigator.onLine),
                    fromEvent(window, 'online').pipe(mapTo(true)),
                    fromEvent(window, 'offline').pipe(mapTo(false))
                );
            } else {
                const serv = this;
                this.online$ = Observable.create(obs => {
                    obs.next(SongsService.status);

                    setInterval(function () {
                        serv.http.get(serv.url + serv.themeUrl).subscribe(
                            _ => {
                                SongsService.status = true;
                                obs.next(true);
                            },
                            _ => {
                                SongsService.status = false;
                                obs.next(false);
                            }
                        );
                    }, serv.time);
                });
            }
        }
        SongsService.singleTon = this;
    }

    log(message: string) {
        this.messageService.add(message);
    }

    getSongs(): Observable<ListItem[]> {
        let observe: Observable<ListItem[]> = new Observable<ListItem[]>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.get<ListItem[]>(this.url + this.songsUrl, httpOptions).pipe(
                    tap(d => {this.offline.setSongs(d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                observe = this.offline.getSongs();
            }
        });
        return observe;
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
        let observe: Observable<ListItem> = new Observable<ListItem>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.get<ListItem>(this.url + this.songsUrl + id, htt).pipe(
                    tap(d => {this.offline.setSong(id, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                observe = this.offline.getSong(id);
            }
        });
        return observe;
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

        let observe: Observable<ListItem> = new Observable<ListItem>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.post<ListItem>(this.url + this.songsUrl, body, httpOptions).pipe(
                    tap(d => {this.offline.setSong(song._id, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                this.log('no can do, offline');
                observe = this.offline.getSong(song._id);
            }
        });
        return observe;
    }

    editSong(song: ListItem): Observable<ListItem> {
        let observe: Observable<ListItem> = new Observable<ListItem>();
        this.online$.subscribe(online => {
            if (online) {
                let body = new HttpParams();
                body = body.set('name', song.name);
                body = body.set('number', song.number.toString());
                body = body.set('date', song.date);
                body = body.set('theme', song.theme);
                body = body.set('name2', song.name2);
                body = body.set('key', song.key);
                observe = this.http.put<ListItem>(this.url + this.songsUrl + song._id, body, httpOptions).pipe(
                    tap(d => {this.offline.setSong(song._id, d); })
                );
            } else {
                this.log('no can do, offline');
            }
        });
        return observe;
    }

    deleteSong(id: string): Observable<{}> {
        let observe: Observable<{}> = new Observable<{}>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.delete(this.url + this.songsUrl + id, httpOptions);
                this.offline.deleteSong(id);
            } else {
                this.log('no can do, offline');
            }
        });
        return observe;
    }

    // themes

    getThemes(): Observable<Theme[]> {
        let observe: Observable<Theme[]> = new Observable<Theme[]>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.get<Theme[]>(this.url + this.themeUrl, httpOptions).pipe(
                    tap(d => {this.offline.setThemes(d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                observe = this.offline.getThemes();
            }
        });
        return observe;
    }

    getTheme(id: string): Observable<Theme> {
        let observe: Observable<Theme> = new Observable<Theme>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.get<Theme>(this.url + this.themeUrl + id, httpOptions).pipe(
                    tap(d => {this.offline.setTheme(id, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                observe = this.offline.getTheme(id);
            }
        });
        return observe;
    }

    addTheme(theme: Theme): Observable<Theme> {
        let observe: Observable<Theme> = new Observable<Theme>();
        this.online$.subscribe(online => {
            if (online) {
                let body = new HttpParams();
                body = body.set('name', theme.name);
                observe = this.http.post<Theme>(this.url + this.themeUrl, body, httpOptions).pipe(
                    tap(d => {this.offline.setTheme(theme._id, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                observe = this.offline.getTheme(theme._id);
            }
        });
        return observe;
    }

    editTheme(theme: Theme): Observable<Theme> {
        let observe: Observable<Theme> = new Observable<Theme>();
        this.online$.subscribe(online => {
            if (online) {
                let body = new HttpParams();
                body = body.set('name', theme.name);
                observe = this.http.put<Theme>(this.url + this.themeUrl + theme._id, body, httpOptions).pipe(
                    tap(d => {this.offline.setTheme(theme._id, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                this.log('no can do, offline');
            }
        });
        return observe;
    }

    deleteTheme(id: string): Observable<{}> {
        let observe: Observable<{}> = new Observable<{}>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.delete(this.url + this.themeUrl + id, httpOptions);
                this.offline.deleteTheme(id);
            } else {
                this.log('no can do, offline');
            }
        });
        return observe;
    }

    // lyrics

    // getLyrics(): Observable<Lyrics[]> {
    //     let observe: Observable<Lyrics[]> = new Observable<Lyrics[]>();
    //     this.online$.subscribe(online => {
    //         if (online) {
    //             observe = this.http.get<Lyrics[]>(this.url + this.lyricsUrl, httpOptions).pipe(
    //                 tap(d => {this.offline.setLyrics(d); })
    //             );
    //         } else if (localStorage.getItem('offlineMode')) {
    //             observe = this.offline.getLyrics();
    //         }
    //     });
    //     return observe;
    // }

    getLyric(id: string): Observable<Lyrics> {
        let observe: Observable<Lyrics> = new Observable<Lyrics>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.get<Lyrics>(this.url + this.lyricsUrl + id, httpOptions).pipe(
                    tap(d => {this.offline.setLyric(id, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                observe = this.offline.getLyric(id);
            }
        });
        return observe;
    }

    addLyrics(lyrics: Lyrics): Observable<Lyrics> {
        let observe: Observable<Lyrics> = new Observable<Lyrics>();
        this.online$.subscribe(online => {
            if (online) {
                let body = new HttpParams();
                body = body.set('songId', lyrics.songId);
                body = body.set('lyrics', lyrics.lyrics);
                observe = this.http.post<Lyrics>(this.url + this.lyricsUrl, body, httpOptions).pipe(
                    tap(d => {this.offline.setLyric(lyrics.songId, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                observe = this.offline.getLyric(lyrics.songId);
            }
        });
        return observe;
    }

    editLyrics(lyrics: Lyrics): Observable<Lyrics> {
        let observe: Observable<Lyrics> = new Observable<Lyrics>();
        this.online$.subscribe(online => {
            if (online) {
                let body = new HttpParams();
                body = body.set('songId', lyrics.songId);
                body = body.set('lyrics', lyrics.lyrics);
                observe = this.http.put<Lyrics>(this.url + this.lyricsUrl + lyrics.songId, body, httpOptions).pipe(
                    tap(d => {this.offline.setLyric(lyrics.songId, d); })
                );
            } else if (localStorage.getItem('offlineMode')) {
                this.log('no can do, offline');
            }
        });
        return observe;
    }

    deleteLyrics(id: string): Observable<{}> {
        let observe: Observable<{}> = new Observable<{}>();
        this.online$.subscribe(online => {
            if (online) {
                observe = this.http.delete(this.url + this.lyricsUrl + id, httpOptions);
                this.offline.deleteTheme(id);
            } else {
                this.log('no can do, offline');
            }
        });
        return observe;
    }

    storeDataToLocal() {
        this.getThemes().subscribe();
        this.getSongs().subscribe(songs => {
            for (let s of songs) {
                this.getSong(s._id).subscribe();
                this.getLyric(s._id).subscribe();
            }
        });
    }

    clearLocalStorage() {
        const a = localStorage.getItem('logged');
        localStorage.clear();
        if (a) {
            localStorage.setItem('logged', 'true');
        }
    }


}
