import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {SongsService} from '../songs.service';
import {ListItem, Theme} from '../listItem';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

const scroll = '// When the user scrolls down 20px from the top of the document, show the button\n' +
    'window.onscroll = function() {scrollFunction()};\n' +
    '\n' +
    'function scrollFunction() {\n' +
    '    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {\n' +
    '        document.getElementById("myBtn").style.display = "block";\n' +
    '    } else {\n' +
    '        document.getElementById("myBtn").style.display = "none";\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    '// When the user clicks on the button, scroll to the top of the document\n' +
    'function topFunction() {\n' +
    '    document.body.scrollTop = 0; // For Safari\n' +
    '    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera\n' +
    '}' +
    '$(function () {' +
    '$("html, body").animate({ scrollTop: $(document).height()*200000 }, "slow");' +
    '});';

const s1 = '@media screen and (min-width: 900px) {\n' +
    '        input[type=text], select, input[type=number], input[type=date] {\n' +
    '            padding: 12px 20px !important;\n' +
    '            margin: 5px 0 !important;\n' +
    '            font-size: 16px !important;\n' +
    '        }\n' +
    '        textarea {\n' +
    '            font-size: 16px !important;\n' +
    '        }\n' +
    '        .triple {\n' +
    '            font-size: 17px !important;\n' +
    '        }\n' +
    '        .space {\n' +
    '            height: 8vw !important;\n' +
    '        }\n' +
    '        .half {\n' +
    '            width: 50% !important;\n' +
    '            left: 25% !important;\n' +
    '            margin-top: 8vw !important;\n' +
    '        }\n' +
    '        .edit {\n' +
    '            width: 100% !important;\n' +
    '            /*padding: 0 !important;*/\n' +
    '        }\n' +
    '        .song-list {\n' +
    '            width: 28% !important;\n' +
    '            margin: 1% !important;\n' +
    '        }\n' +
    '        .left {\n' +
    '            position: absolute !important;\n' +
    '            width: 40% !important;\n' +
    '            left: 5% !important;\n' +
    '        }\n' +
    '        .right {\n' +
    '            position: absolute !important;\n' +
    '            width: 40% !important;\n' +
    '            left: 50% !important;\n' +
    '        }\n' +
    '    }';

const dynamicStyles = [ s1 ];
const dynamicScripts = [ scroll ];

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    // online$: Observable<boolean>;
    offlineMode = 'Off';
    capacity = '';

    edit = true;
    add = false;
    theme = false;

    newTheme = false;

    themes: Theme[] = [];
    songs: ListItem[] = [];

    displayedSongs: ListItem[] = [];

    constructor(
        private route: Router,
        private songService: SongsService
    ) {
        // this.online$ = songService.online$;
    }

    ngOnInit() {
        this.Guard();
        this.getThemes();
        this.getSongs();
        if (localStorage.getItem('offlineMode')) {
            this.offlineMode = 'On';
        }
        this.capacity = this.songService.getCapacityString();
        this.loadStyle();
        this.loadScript();
    }

    Guard() {
        if (!localStorage.getItem('logged')) {
            this.route.navigate(['/login']);
        }
    }

    toggleOffline() {
        if (this.songService.isOfflineOn()) {
            this.songService.clearLocalStorage();
            this.offlineMode = 'Off';
            this.capacity = '0B';
        } else {
            this.songService.storeDataToLocal(size => {this.capacity = size; this.offlineMode = 'On'; });
        }
    }

    getSongs() {
        this.songService.getSongs().subscribe(
            s => {
                this.songs = s.sort(
                    (a, b) => {
                        return a.number - b.number;
                    });
                this.displayedSongs = this.songs;
        });
    }

    getThemes() {
        this.songService.getThemes().subscribe(t => this.themes = t, error2 => this.log(error2.message));
    }

    doSearch(str: string) {
        str = str.toLowerCase();
        this.displayedSongs = this.songs.filter(
            (song, index, list) => {
                return song.name.toLowerCase().includes(str) || song.number.toString().includes(str);
            }
        );
    }

    private log(message: string) {
        this.songService.log(message);
    }

    logOut() {
        localStorage.removeItem('logged');
        this.route.navigate(['/login']);
    }

    addSong(num: number, tit: string, thId: string, dat: string) {
        const song: ListItem = {
            _id: '',
            number: num,
            name: tit,
            theme: thId,
            date: dat.length > 0 ? dat : null,
            views: 0,
            name2: null,
            key: null
        };

        this.songService.addSong(song).subscribe(
            arrived => this.songs.push(arrived),
            null,
            () => {this.log('added'); this.add = false; this.edit = true; this.theme = false; }
        );
    }

    editSong(id: string, n: number, tit: string, thId: string, dat: string, v: number, n2: string, k: string) {
        const song: ListItem = {
            _id: id,
            number: n,
            name: tit,
            theme: thId,
            date: dat,
            views: v,
            name2: n2,
            key: k
        };
        this.songService.editSong(song).subscribe(
            arrived => this.songs[this.songs.indexOf(song)] = arrived,
            null,
            () => this.log('saved')
        );
    }

    deleteSong(id: string) {
        this.songService.deleteSong(id).subscribe();
        for (let i = 0; i < this.songs.length; ++i) {
            if (this.songs[i]._id === id) {
                delete this.songs[i];
                break;
            }
        }
        for (let i = 0; i < this.displayedSongs.length; ++i) {
            if (this.displayedSongs[i]._id === id) {
                delete this.displayedSongs[i];
                break;
            }
        }
    }


    addTheme(tit: string) {
        let i = 0;
        while (i < this.themes.length) {
            if (this.themes[i].name == tit) {
                this.log('theme already exist');
                return;
            }
            ++i;
        }
        const theme = new Theme(tit);


        this.songService.addTheme(theme).subscribe(
            arrived => this.themes.push(arrived),
            null,
            () => {this.log('added'); this.newTheme = false; }
        );
    }

    editTheme(num: string, tit: string) {
        if (!tit.length) {
            this.deleteTheme(num);
            return;
        }
        let theme: Theme = null;
        let i = -1;
        while (!theme && i < this.themes.length) {
            ++i;
            if (this.themes[i]._id == num) {
                theme = this.themes[i];
            }
        }
        theme.name = tit;

        this.songService.editTheme(theme).subscribe(
            arrived => this.themes[i] = arrived,
            null,
            () => this.log('saved')
        );
    }

    deleteTheme(id: string) {
        this.songService.deleteTheme(id).subscribe();
        this.log('deleted');
        for (let i = 0; i < this.themes.length; ++i) {
            if (this.themes[i]._id == id) {
                delete this.themes[i];
                break;
            }
        }
    }

    setZero() {
        for ( const song of this.songs ) {
            song.views = 0;
        }
    }

    eraseStyle() {
        let e;
        for (let i = 0; i < dynamicStyles .length; i++) {
            if (e = document.getElementById('style-admin-' + i) ) {
                e.remove();
            }
        }
    }

    loadStyle() {
        this.eraseStyle();
        for (let i = 0; i < dynamicStyles .length; i++) {
            const node = document.createElement('style');
            // node.src = 'assets/js/' + dynamicScripts [i];
            node.innerHTML = dynamicStyles [i];
            // node.type = 'text/javascript';
            node.id = 'style-admin-' + i;
            // node.async = false;
            // node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

    eraseScript() {
        let e;
        for (let i = 0; i < dynamicScripts .length; i++) {
            if (e = document.getElementById('script-admin-' + i) ) {
                e.remove();
            }
        }
    }

    loadScript() {
        this.eraseScript();
        for (let i = 0; i < dynamicScripts .length; i++) {
            const node = document.createElement('script');
            // node.src = 'assets/js/' + dynamicScripts [i];
            node.innerHTML = dynamicScripts [i];
            node.type = 'text/javascript';
            node.id = 'script-admin-' + i;
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }

}
