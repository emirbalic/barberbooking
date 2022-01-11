import { GyphyService } from './../_services/gyphy.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-succes',
  templateUrl: './succes.component.html',
  styleUrls: ['./succes.component.scss']
})
export class SuccesComponent implements OnInit {

  text: string = "Appointment successfully booked"
  giphyUrl!: string;
  constructor(private gyphyService: GyphyService) { }

  giphy: any;

  ngOnInit(): void {
    this.getGyphy()
  }

  getGyphy() {
   this.giphy = this.gyphyService.getGyphy().subscribe(response => {
      // this.gyphy = response.data.images.downsized_medium.url;
      this.giphy = response;
      // console.log(this.giphy.data[this.getRandom()].images)
      this.giphyUrl = this.giphy.data[this.getRandom()].images.original.url;

    })
    // console.log(this.gyphy)

    
  }
  getRandom() {
    return Math.floor(Math.random() * 50);
  }

}
