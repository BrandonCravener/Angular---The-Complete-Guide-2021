import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { DataService } from '../shared/data.service';

import { UserComponent } from './user.component';
import { UserService } from './user.service';

describe('UserComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent]
    }).compileComponents();
  })

  it('should create app', () => {
    let fixture = TestBed.createComponent(UserComponent)
    let app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  })

  it('should grab users name from service', () => {
    let fixture = TestBed.createComponent(UserComponent)
    let app = fixture.debugElement.componentInstance;
    let userService = fixture.debugElement.injector.get(UserService)

    fixture.detectChanges()

    expect(userService.user.name).toEqual(app.user.name)
  })

  it('should display users name if authenticated', () => {
    let fixture = TestBed.createComponent(UserComponent)
    let app = fixture.debugElement.componentInstance;

    app.loggedIn = true

    fixture.detectChanges()

    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('p').textContent).toContain(app.user.name)
  })

  it('should not display users name if authenticated', () => {
    let fixture = TestBed.createComponent(UserComponent)
    let app = fixture.debugElement.componentInstance;

    fixture.detectChanges()

    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('p').textContent).not.toContain(app.user.name)
  })

  it('should not grab data if not async', () => {
    let fixture = TestBed.createComponent(UserComponent)
    let app = fixture.debugElement.componentInstance;
    let dataService = fixture.debugElement.injector.get(DataService)

    spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'))

    fixture.detectChanges()

    expect(app.data).toBe(undefined)
  })

  it('should grab data if async', waitForAsync(() => {
    let fixture = TestBed.createComponent(UserComponent)
    let app = fixture.debugElement.componentInstance;
    let dataService = fixture.debugElement.injector.get(DataService)

    spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'))

    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(app.data).toBe('Data')
    })
  }))

  it('should grab data if async', fakeAsync(() => {
    let fixture = TestBed.createComponent(UserComponent)
    let app = fixture.debugElement.componentInstance;
    let dataService = fixture.debugElement.injector.get(DataService)

    spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'))

    fixture.detectChanges()
    tick();

    expect(app.data).toBe('Data')
  }))
});
