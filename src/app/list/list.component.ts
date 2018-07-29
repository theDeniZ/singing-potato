import { Component, OnInit, ViewChild} from '@angular/core';
import {ListItem, Theme} from '../listItem';
import {SongsService} from '../songs.service';
import {Router} from '@angular/router';
import { MatTableDataSource, MatSort} from '@angular/material';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    songs: ListItem[];
    themes: Theme[];
    displayedColumns: string[] = ['number', 'name', 'theme', 'key', 'views', 'date'];
    dataSource = null;
    displayedSongs: ListItem[];
    theme: string = '';
    key: string = '';

    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

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
                    this.displayedSongs = this.songs;
                },
            error2 => this.log(error2),
            () => {
                this.dataSource = new MatTableDataSource(this.displayedSongs);
                this.dataSource.sort = this.sort;
                // this.dataSource.paginator = this.paginator;
                this.dataSource.filterPredicate =
                    (d: ListItem, f: string) => d.number.toString().includes(f) ||
                        d.name.toLowerCase().includes(f) || this.getTheme(d.theme).name.toLowerCase().includes(f) ||
                        d.name.toLowerCase().startsWith(f) || this.getTheme(d.theme).name.toLowerCase().startsWith(f) ||
                        d.name2.toLowerCase().startsWith(f) || d.name2.toLowerCase().includes(f);
            }
        );
    }


    getThemesAndSongs() {
        this.songService.getThemes().subscribe(t => this.themes = t, error2 => this.log(error2.message), () => this.getSongs());
    }


    private getTheme(id: string): Theme {
        return this.themes.find((t, i, a) => t._id === id);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    filterByTheme(t: string) {
        this.theme = t;
        this.displayedSongs = this.displayedSongs.filter((l, n, a) => l.theme === t);
        this.dataSource.data = this.displayedSongs;
    }

    filterByKey(k: string) {
        this.key = k;
        this.displayedSongs = this.displayedSongs.filter((l, n, a) => l.key === k);
        this.dataSource.data = this.displayedSongs;
    }

    clearFilterTheme() {
        this.theme = '';
        this.displayedSongs = this.songs;
        if (this.key.length > 0) {
            this.filterByKey(this.key);
        } else {
            this.dataSource.data = this.displayedSongs;
        }
    }

    clearFilterKey() {
        this.key = '';
        this.displayedSongs = this.songs;
        if (this.theme.length > 0) {
            this.filterByTheme(this.theme);
        } else {
            this.dataSource.data = this.displayedSongs;
        }
    }

    goTo(song: string) {
        this.router.navigate(['/song/' + song]);
    }

}


export interface List {
    _id: string;
    name: string;
    theme: string;
    views: number;
    date: string;
}