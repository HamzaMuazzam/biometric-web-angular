import { Component, OnInit, NgZone } from '@angular/core';

declare global {
  interface Window {
    TWJSBridge: any;
    onImageReceived: any;
    onBiometricCompletion: any;
    collectIsoData: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  status: string = 'Idle';
  previewImage: string | null = null;
  previewLabel: string = '';
  receivedIsoData: string = '';
  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    window.onImageReceived = this.onImageReceived.bind(this);
    window.onBiometricCompletion = this.onBiometricCompletion.bind(this);
    window.collectIsoData = this.collectIsoData.bind(this);
  }

  capture(type: string): void {
    this.clearPreview();
    this.status = `Requesting ${type.replace('_', ' ')}...`;

    if (window.TWJSBridge?.onButtonClick) {
      window.TWJSBridge.onButtonClick(type);
    } else {
      this.status = 'TWJSBridge not initialized';
    }
  }

  /* 🔥 ANDROID → IMAGE */
  onImageReceived(type: string, base64Data: string): boolean {
    this.zone.run(() => {
      console.error('onImageReceived.././././');

      this.previewImage = `data:image/jpeg;base64,${base64Data}`;
      this.previewLabel = type.replace('_', ' ');
      this.status = ` captured successfully`;
    });
    return true;
  }

  /* 🔥 ANDROID → BIOMETRIC */
  onBiometricCompletion(base64Data: string): boolean {
    return this.onImageReceived('FINGERPRINT', base64Data);
  }

  /* 🔥 ANDROID → ISO */
  collectIsoData(chunk: string): string {
    this.zone.run(() => {
      console.error('Received ISO data:././//', chunk);
      this.receivedIsoData = chunk;
      this.status = 'ISO Data Received././.';
    });
    return 'true';
  }

  clearPreview(): void {
    this.previewImage = null;
    this.previewLabel = '';
  }
}

