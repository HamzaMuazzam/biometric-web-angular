import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

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
   imports: [CommonModule],
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  status: string = 'Idle';
  previewImage: string | null = null;
  previewLabel: string = '';
  receivedIsoData: string = '';

  ngOnInit(): void {
    window.onImageReceived = this.onImageReceived.bind(this);
    window.onBiometricCompletion = this.onBiometricCompletion.bind(this);
    window.collectIsoData = this.collectIsoData.bind(this);
  }

  constructor(private zone: NgZone) {
    // expose callback for native bridge
      this.status = 'Fingerprint captured successfully';
    (window as any).onBiometricCompletion = (base64Data: string) => {
      this.zone.run(() => {
        this.previewImage = 'data:image/jpeg;base64,' + base64Data;
        this.previewLabel = 'Fingerprint';
      });
      return true;
    };
  }

  capture(type: string) {
    this.status = `Requesting ${type.replace('_', ' ')}...`;

    if ((window as any).TWJSBridge?.onButtonClick) {
      (window as any).TWJSBridge.onButtonClick(type);
    } else {
      this.status = 'TWJSBridge is not initialized';
    }
  }

  /* 🔥 ANDROID → IMAGE */
  onImageReceived(type: string, base64Data: string): boolean {
          this.status = `Image captured successfully`;
    this.zone.run(() => {
      console.error('onImageReceived.././././', type , base64Data);

      this.previewImage = `data:image/jpeg;base64,${base64Data}`;
      this.previewLabel = type.replace('_', ' ');
    });
    return true;
  }

  /* 🔥 ANDROID → BIOMETRIC */
  onBiometricCompletion(base64Data: string): boolean {
    return this.onImageReceived('FINGERPRINT', base64Data);
  }

  /* 🔥 ANDROID → ISO */
  collectIsoData(chunk: string): string {
      this.status = 'ISO Data Received........';
    this.zone.run(() => {
      console.error('Received ISO data:.......', chunk);
      this.receivedIsoData = chunk;
    });
    return 'true';
  }

  clearPreview(): void {
    this.previewImage = null;
    this.previewLabel = '';
  }
}

