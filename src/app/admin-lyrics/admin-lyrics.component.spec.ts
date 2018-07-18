import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLyricsComponent } from './admin-lyrics.component';

describe('AdminLyricsComponent', () => {
  let component: AdminLyricsComponent;
  let fixture: ComponentFixture<AdminLyricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLyricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
