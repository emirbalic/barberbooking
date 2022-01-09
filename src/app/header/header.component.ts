import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerText: string = 'Book your barber';
  text1: string = "Great Hair Doesn\'t Happen By Chance. It Happens By Appointment!";
  text2: string = "So Don\'t Wait And Book Your Appointment Now!";
  

  constructor() { }

  ngOnInit(): void {
  }

}
