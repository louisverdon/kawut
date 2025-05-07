import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  template: `
    <div class="qr-code-container">
      <canvas #qrCanvas></canvas>
      <p class="session-id">Session ID: {{ sessionId }}</p>
    </div>
  `,
  styles: [`
    .qr-code-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    canvas {
      max-width: 200px;
      height: auto;
    }
    .session-id {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class QRCodeComponent implements OnInit {
  @Input() sessionId: string = '';
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    if (this.sessionId) {
      this.generateQRCode();
    }
  }

  ngOnChanges() {
    if (this.sessionId) {
      this.generateQRCode();
    }
  }

  private generateQRCode() {
    const canvas = this.qrCanvas.nativeElement;
    const url = `${window.location.origin}/lobby/${this.sessionId}`;
    
    QRCode.toCanvas(canvas, url, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }).catch(err => {
      console.error('Error generating QR code:', err);
    });
  }
} 