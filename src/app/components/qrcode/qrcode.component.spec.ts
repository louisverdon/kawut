import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QRCodeComponent } from './qrcode.component';
import * as QRCode from 'qrcode';

describe('QRCodeComponent', () => {
  let component: QRCodeComponent;
  let fixture: ComponentFixture<QRCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QRCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRCodeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate QR code when sessionId is provided', () => {
    const spy = spyOn(QRCode, 'toCanvas');
    component.sessionId = 'test-session';
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should not generate QR code when sessionId is empty', () => {
    const spy = spyOn(QRCode, 'toCanvas');
    component.sessionId = '';
    component.ngAfterViewInit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should regenerate QR code when sessionId changes', () => {
    const spy = spyOn(QRCode, 'toCanvas');
    component.sessionId = 'old-session';
    component.ngAfterViewInit();
    spy.calls.reset();

    component.sessionId = 'new-session';
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should display session ID', () => {
    component.sessionId = 'test-session';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.session-id').textContent).toContain('test-session');
  });
}); 