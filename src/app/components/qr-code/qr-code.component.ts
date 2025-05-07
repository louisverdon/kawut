import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  template: `
    <div class="qr-code-container">
      <canvas #qrCanvas></canvas>
      <div class="session-info" *ngIf="displayText">
        <p>Session Code: <strong>{{ sessionId }}</strong></p>
        <p class="helper-text">{{ displayText }}</p>
      </div>
    </div>
  `,
  styles: [`
    .qr-code-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background-color: white;
      border-radius: 8px;
      border: 2px solid #333;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 220px;
      margin: 0 auto;
    }
    
    canvas {
      width: 200px;
      height: 200px;
    }
    
    .session-info {
      margin-top: 0.5rem;
      text-align: center;
      width: 100%;
      background-color: #f0f0f0;
      padding: 0.5rem;
      border-radius: 4px;
    }
    
    .session-info p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #333;
    }
    
    .helper-text {
      font-size: 0.8rem;
      color: #666;
    }
  `]
})
export class QrCodeComponent implements OnChanges {
  @Input() sessionId: string = '';
  @Input() displayText: string = 'Scan to join game';
  @ViewChild('qrCanvas', { static: true }) qrCanvas!: ElementRef;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessionId'] && this.sessionId) {
      this.generateQRCode();
    }
  }
  
  ngAfterViewInit(): void {
    if (this.sessionId) {
      this.generateQRCode();
    } else {
      // Generate a demo QR code if no session ID is provided
      this.generateDemoQRCode();
    }
  }
  
  private generateQRCode(): void {
    const canvas = this.qrCanvas.nativeElement;
    // Ensure we encode the URL properly, making sure direct=true is preserved
    const baseUrl = `${window.location.origin}/lobby/${this.sessionId}`;
    const joinUrl = `${baseUrl}?direct=true`;
    console.log('Generated QR code URL:', joinUrl);
    
    QRCode.toCanvas(canvas, joinUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#2196F3',
        light: '#FFFFFF'
      }
    }, (error) => {
      if (error) {
        console.error('Error generating QR code:', error);
      }
    });
  }
  
  private generateDemoQRCode(): void {
    const canvas = this.qrCanvas.nativeElement;
    const demoSessionId = 'DEMO' + Math.random().toString(36).substring(2, 7).toUpperCase();
    // Ensure we encode the URL properly, making sure direct=true is preserved
    const baseUrl = `${window.location.origin}/lobby/${demoSessionId}`;
    const joinUrl = `${baseUrl}?direct=true`;
    console.log('Generated demo QR code URL:', joinUrl);
    
    QRCode.toCanvas(canvas, joinUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#9C27B0',
        light: '#FFFFFF'
      }
    }, (error) => {
      if (error) {
        console.error('Error generating demo QR code:', error);
      }
    });
    
    // Update the session ID for display
    this.sessionId = demoSessionId;
  }
} 