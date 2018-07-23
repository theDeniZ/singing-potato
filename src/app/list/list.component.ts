import { Component, OnInit } from '@angular/core';
import {ListItem, Theme} from '../listItem';
import {SongsService} from '../songs.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    songs: ListItem[];
    themes: Theme[];

    constructor(
        private songService: SongsService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getThemesAndSongs();
        // this.getSongs();
    }

    log(message: string) {
        this.songService.log(message);
    }

    getSongs() {
        this.songService.getSongs().subscribe(
            songs => {
                    this.songs = songs.sort(
                      (a, b) => {
                            return a.number - b.number;
                        });
                },
            error2 => this.log(error2),
            () => { this.loadScript(); }
        );
    }


    getThemesAndSongs() {
        this.songService.getThemes().subscribe(t => this.themes = t, error2 => this.log(error2.message), () => this.getSongs());
    }


    private getTheme(id: string): Theme {
        for (let t of this.themes) {
            if (t._id == id) {
                return t;
            }
        }
    }


    //
    // eraseScript() {
    //     const scripts = document.getElementsByTagName('script');
    //     for (let i = 0; i < scripts.length; ++i) {
    //         if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('js')) {
    //             scripts[i].remove();
    //         }
    //     }
    // }

    loadScript() {
        const dynamicScripts = ['jquery-1.11.2.min.js', 'bootstrap-table.js', 'list.js', 'jasny-bootstrap.js'];

        for (let i = 0; i < dynamicScripts .length; i++) {
            const node = document.createElement('script');
            node.src = 'assets/js/' + dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

    goTo(song: string) {
        this.router.navigate(['/song/' + song]);
    }

}
