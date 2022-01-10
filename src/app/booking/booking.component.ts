import { Booking } from './../_models/booking';
import { Barber } from './../_models/barber';
import { Component, OnChanges, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
import { BookingService } from '../_services/booking.service';
import { Observable } from 'rxjs';
// import {DatePickerComponent} from 'ng2-date-picker';  
import { IAngularMyDpOptions, IMyDateModel, Year } from 'angular-mydatepicker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

import Utils from '../_utils/utils';



@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  time: any = {};

  disabled: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd.mm.yyyy',
    disableWeekends: true,
    disableUntil: this.disabled
    
  };

  model!: IMyDateModel;

  formCommonText: string = 'Book your appointment'
  formButtonText: string = 'Book appointment'

  firstElementInBarbers: string = 'Select Barber';
  firstElementInServices: string = 'Select Service';

  // barbers$!: Observable<Barber[]>;

  barber: any = {};
  service: any = {};

  barbers: any;
  appointments: any;
  services: any = [];

  daySet: boolean = false;
  priceSet: boolean = false;
  barberSet: boolean = false;
  selectedBarber: any = [];

  durationMinutes: number = 0;

  //===TIME RESTRICTION OPTIONS===
  workhours: any;
  MINTIME: string = '';//"0:00 AM"
  MAXTIME: string = '';//"23:59 PM"
  // barberName: any = null;

  //===LUNCH RESTRICTION OPTIONS===
  bookingDayLunchStart:number = 0;  
  bookingDayLunchFinish:number = 0;
  hackAClock: boolean=false;

  //===OVERLAP RESTRICTION OPTIONS===
  appointmentStart!: number;
  appointmentEnds!: number;

  //===THIS DAY RANGE===
  dayStart: any;
  dayFinish: any;
  actualDay: any = [];

  baseDayToCount: number = 0;

  constructor(private bookingService: BookingService) {//, private ref: ChangeDetectorRef
  }
  ngOnInit(): void {

    this.getBarbers();
    this.getServices();
    this.getAppointments();

    // this.barbers$ = this.bookingService.getBarbers();
    // console.log(typeof(this.barbers$));
  }
  getBarbers() {

    this.bookingService.getBarbers().subscribe(barbers => {
      this.barbers = barbers;
      this.barbers.unshift({
        firstName: this.firstElementInBarbers, 
      })
      
    });

  }
  getServices() {

    this.bookingService.getServices().subscribe(services => {

      this.services = services;

      this.services.forEach((service: any) => {
         
        service.durationUnix = service.durationMinutes * 60000;
       

      });

      this.services.unshift({
        name: this.firstElementInServices 
      })
       
    })
  }
  getAppointments() {
    this.bookingService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
      
    })

  }
  onSelectBarber($event: any) {
    // console.log('SELECTED!', $event)

    const barber = this.barbers.filter((m: any) => m.firstName !== this.firstElementInBarbers && m.id == $event);

    this.workhours = [];
     this.selectedBarber = barber;

    if (this.selectedBarber.length > 0) {
      this.workhours = barber.map((b: any) => (b.workHours));
      this.barberSet = true;
    } else {
      this.workhours = [];
      this.barberSet = false;
    }
  }
  addWorkingHours(day: string) {
    switch (day) {
      case 'Mon':
        console.log('Monday');
        this.MINTIME = '07:00 AM';
        this.MAXTIME = '03:00 PM';
        this.hackAClock = false;
        break;
      case 'Tue':
        console.log('Tuesday');
        this.MINTIME = '07:00 AM';
        this.MAXTIME = '03:00 PM';
        this.hackAClock = false;
        break;
      case 'Wed':
        console.log('Wednesday');
        this.MINTIME = '07:00 AM';
        this.MAXTIME = '03:00 PM';
        this.hackAClock = false;
        break;
      case 'Thu':
        console.log('Thursday');
        this.MINTIME = '12:00 AM';
        this.MAXTIME = '20:00 PM';
        this.hackAClock = true;
        break;
      default:
        console.log('Friday');
        this.MINTIME = '12:00 AM';
        this.MAXTIME = '20:00 PM';
        this.hackAClock = true;
      break;

    }
  }
  addLunchTimes(day: string) {
    let lunchTime = {
      start: 0,
      finish: 0,
    };
    switch (day) {
      case 'Mon':
        // console.log('Monday');
        lunchTime.start = 11 * 3600000;
        lunchTime.finish = 11 * 3600000 + 30 * 60000;

        break;
      case 'Tue':
        // console.log('Tuesday');
        lunchTime.start = 11 * 3600000;
        lunchTime.finish = 11 * 3600000 + 30 * 60000;
        break;
      case 'Wed':
        // console.log('Wednde');
        lunchTime.start = 11 * 3600000;
        lunchTime.finish = 11 * 3600000 + 30 * 60000;
        break;
      case 'Thu':
        // console.log('Thurs');
        lunchTime.start = 16 * 3600000;
        lunchTime.finish = 16 * 3600000 + 30 * 60000;
        break;
      default:
        // console.log('Firda');
        lunchTime.start = 16 * 3600000;
        lunchTime.finish = 16 * 3600000 + 30 * 60000;
        break;
    }
    return lunchTime;
  }
  onDateChanged($event: any) {
    
    this.MINTIME = '';
    this.MAXTIME = '';
    this.barber.time = '';

    let day = $event.singleDate.jsDate.toString().substring(0, 3);
    this.addWorkingHours(day);

    this.baseDayToCount = $event.singleDate.epoc * 1000;
    
    this.dayStart = $event.singleDate.epoc * 1000;
    this.dayFinish = this.dayStart + (24 * 3600000);

    this.bookingDayLunchStart = this.addLunchTimes(day).start + this.baseDayToCount;
    this.bookingDayLunchFinish = this.addLunchTimes(day).finish + this.baseDayToCount;

    this.actualDay = [];
    this.appointments.forEach((app: any) => {
     
        this.services.forEach((service: any) => {
          if (app.serviceId === service.id) {

            app.finishDate = app.startDate + service.durationUnix;

            app.baseDayToCount = this.baseDayToCount;

          }
        });      
        this.actualDay.push(app);
        this.addLunchTimes(day);
        
    });
    if (this.barber.date !== null) {
      this.daySet = true;
    } else {
      this.daySet = false;
    }
  }
  onTimeSet($event: any) {
    
    let hours = Utils.formatHoursToUnix($event).hoursUnix; 
    let minutes = Utils.formatMinutesToUnix($event).minuteUnix; 
    
    let appointmentStart;
    let appointmentEnds;
    
    //===due to the bug in timepicker===
    let hackedTime  = Utils.formatHoursToUnix('12').hoursUnix;
    if(this.hackAClock) {
       this.appointmentStart = appointmentStart = hours + minutes + this.baseDayToCount + hackedTime;
       this.appointmentEnds = appointmentEnds = hours + minutes + this.baseDayToCount + this.durationMinutes + hackedTime;
    } else {
      this.appointmentStart = appointmentStart = hours + minutes + this.baseDayToCount;
      this.appointmentEnds =  appointmentEnds = hours + minutes + this.baseDayToCount + this.durationMinutes;
    }

    if(appointmentEnds < this.bookingDayLunchStart || appointmentStart > this.bookingDayLunchFinish){
      this.appointments.forEach((appointment: any) => {
        if (appointment.startDate > this.dayStart && appointment.startDate < this.dayFinish) {
          console.log('appointment starts: ', new Date(appointment.startDate))
          console.log('appointment: ends', new Date(appointment.finishDate))
          if (this.appointmentEnds < appointment.startDate || this.appointmentStart > appointment.finishDate){
              console.log('yes it can');
              this.bookBarber();
          } else {
            console.log('no it can NOT')
            alert('Please pick other time for your appointment');
            this.appointmentStart = this.appointmentEnds = 0
          }
        } 
        else {
          console.log('other appointments on different days')
        }
      });
      
    } else {
      appointmentStart = appointmentEnds = 0;
      alert('Please pick other time for your appointment');
    } 
    
  }

  onSelectService($event: any) {
    this.assignPriceDurationAndService($event)
    if (this.barber.price !== undefined) {
      this.priceSet = true
    } else {
      this.priceSet = false
    }
  }

  assignPriceDurationAndService($event: any) {

    switch ($event) {
      case '15':
        this.barber.price = "15";
        this.durationMinutes = 20 * 60000;
        this.service.id = 1
        break;
      case '20':
        this.barber.price = "20"
        this.durationMinutes = 30 * 60000;
        this.service.id = 2
        break;
      case '30':
        this.barber.price = "30"
        this.durationMinutes = 50 * 60000;
        this.service.id = 3
        break;
      default:
        this.barber.price = undefined
        this.durationMinutes = 0;
        break;
    }
  }

  bookBarber() {
    let dateUnix = this.barber.date.singleDate.epoc * 1000;
    let exactDate = Utils.getDateTime(this.barber.time, dateUnix);
    
    
    let booking: Booking = {
      startDate: exactDate,
      barberId: parseInt(this.barber.id),
      serviceId: this.service.id
    }
    

    // this.bookingService.bookAppointment(booking).subscribe();//response => {}
  }
}



    // if (this.actualDay.length > 0) {

    //   // let transform =  "{ hour: '2-digit', minute: '2-digit' }";
    //   // alert(
    //   //   'On the chosed day following timeslots are already booked: \nFrom '
    //   //   + new Date(this.actualDay[0].startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' to '
    //   //   + new Date(this.actualDay[0].finishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
    //   //   '\nLunch time is from: ' 
    //   //   + new Date(this.actualDay[0].lunchStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' to '
    //   //   + new Date(this.actualDay[0].lunchFinish).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    //   //   '. \nYou are free to chose any other time slot. \n Please keep in mind the duration of your treatman. \n Shave - 20min \n Haircut - 30min \n Shave + Haircut - 50min'
    //   //   )
       
    // }


          // console.log('yes it can')
      // console.log(appointmentEnds < this.bookingDayLunchStart, 'meeting ends before lunch starts')
      // console.log(appointmentStart > this.bookingDayLunchFinish, 'meeting starts after lunch finishes')
      // console.log('no it can NOT')
      // console.log(appointmentEnds < this.bookingDayLunchStart, 'meeting ends before lunch starts')
      // console.log(appointmentStart > this.bookingDayLunchFinish, 'meeting starts after lunch finishes')


      // //CHECK ALL OF A GIVEN DAY VS THE CHOSEN ONE
    // this.appointments.forEach((appointment: any) => {
    //   if (appointment.startDate > this.dayStart && appointment.startDate < this.dayFinish) {
    //     console.log('appointments: ', appointment)
    //   }
    // });

    // if (this.actualDay.length > 0) {
    //   console.log('****** ACTUAL DAY EXISTS ******')
    //   this.actualDay.forEach((db: any) => {
    //     // console.log(db.barberId)
    //     console.log('startDate: ',new Date(db.startDate))
    //     console.log('finishDate: ',new Date(db.finishDate))
    //     // console.log('lunchStart: ',new Date(db.lunchStart))
    //     // console.log('lunchFinish: ',new Date(db.lunchFinish))
    //     // console.log(db.serviceId)
    //   //   console.log('on this day following timeslots are already booked: From '
    //   //     + new Date(this.actualDay[0].startDate).toLocaleTimeString('en-US') + ' to '
    //   //     + new Date(this.actualDay[0].finishDate).toLocaleTimeString('en-US') + '. You are free to chose any other')
    //   });
    // } else {
    //   console.log('******NO ACTUAL DAY******')
    //   this.actualDay.forEach((db: any) => {
    //     console.log('lunchStart: ',new Date(db.lunchStart))
    //     console.log('lunchFinish: ',new Date(db.lunchFinish))
    //   });
    // }

