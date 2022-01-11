import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  success: boolean = false;
  constructor(
  ) { }

  addSucces() {
    this.success = true;
  }

}
