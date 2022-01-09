import { Booking } from './../_models/booking';
import { Barber } from './../_models/barber';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookingService {


  baseUrl: string = "http://localhost:3000/";
  barbers$: Barber[] = [];

  constructor(private http: HttpClient) { }

  getBarbers() {

    return this.http.get<Barber[]>(this.baseUrl + 'barbers')//<Barber[]>
      .pipe(
        map((barbers:Barber[]) => {
          
          this.barbers$ = barbers;
          return barbers;
          
        })
      )
  }

  getAppointments() {
    return this.http.get(this.baseUrl +'appointments').pipe(//<Appointment>
      map(appointments => {
        // console.log(appointments)
        return appointments
      })
    )
  
  }
  getServices() {
    return this.http.get(this.baseUrl +'services').pipe(
      map(services => {
        return services;
      })
    )
  }

  bookAppointment(booking: Booking) {
    // console.log('booking.startDate',booking.startDate);
    // console.log(typeof(booking.barberId));
    // console.log(typeof(booking.serviceId));

    // return booking;

    return this.http.post(this.baseUrl + 'appointments', {
      startDate: booking.startDate, 
      barberId: booking.barberId,
      serviceId: booking.serviceId
      }).pipe(
      map((response: any) => {
        console.log(response);
      })
    )
  }
}
// return this.http.post(this.baseUrl + 'account/login', model).pipe(
//   map((response: User) => {
//     const user = response;
//     if (user) {
//       this.setCurrentUser(user);
//     }
//   })
// )

// "startDate": 1579698600, "barberId": 2,
// "serviceId": 2
