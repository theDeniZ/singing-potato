import {ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {SearchProtocol, AdminUser, AdminLyrics} from '../listItem';
import {SongsService} from '../songs.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnDestroy {

    @Input()
    admin: AdminUser;

    @Input()
    lyrics: AdminLyrics;

    @Input()
    searchListener: SearchProtocol;

    @Input()
    viewer = false;

    private _mobileQueryListener: () => void;
    private _tabletQueryListener: () => void;

    mobileQuery: MediaQueryList;
    tabletQuery: MediaQueryList;
    selected = 2;

    constructor(
        private songService: SongsService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.tabletQuery = media.matchMedia('(max-width: 900px)');
        this._tabletQueryListener = () => changeDetectorRef.detectChanges();
        this.tabletQuery.addListener(this._tabletQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.tabletQuery.removeListener(this._tabletQueryListener);
    }


    log(message: string) {
        this.songService.log(message);
    }

    showSearch() {
        document.getElementById('search').style.display = '';
        document.getElementById('search-input').focus();
    }

    blurSearch(s: HTMLInputElement) {
        if (!s.value || s.value === '') {
            document.getElementById('search').style.display = 'none';
        }
    }

    applyFilter(v) {
        this.log('applying filter ' + v + 'on a obj: ' + this.searchListener);
        this.searchListener.applyFilter(v);
    }

    showAdd() {
        this.selected = 1;
        this.admin.showAdd();
    }

    showEdit() {
        this.selected = 2;
        this.admin.showEdit();
    }

    showTheme() {
        this.selected = 3;
        this.admin.showTheme();
    }

    logOut() {
        this.admin.logOut();
    }

    save() {
        this.lyrics.save();
    }

}
