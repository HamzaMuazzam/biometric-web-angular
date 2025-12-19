import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  status: string = 'Idle';
  previewImage: string | null = null;
  previewLabel: string = '';

  capture(type: string) {
    this.status = `Capturing ${type.replace('_', ' ')}...`;

    // Simulating a biometric call (Since I don't have your biometric.js)
    // You would call your actual biometric functions here
    console.log(`Action triggered: ${type}`);

    // Example: updating the UI after a fake delay
    setTimeout(() => {
      this.status = `${type} Captured Successfully`;
      // this.previewImage = 'assets/sample-image.png';
      this.previewLabel = type;
    }, 1000);
  }
}
