import { Booking } from './../_models/booking';
import { Barber } from './../_models/barber';
import { HttpClient } from '@angular/common/http';
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
    // other options are here...
  };

  model!: IMyDateModel;

  // dateOptions = [
  //   disableWeekends: = true
  // ]



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



  //===THIS DAY RANGE===
  dayStart: any;
  dayFinish: any;
  actualDay: any = [];

  baseDayToCount: number = 0;

  constructor(private bookingService: BookingService) {//, private ref: ChangeDetectorRef
    // this.datePicker = new DatePickerComponent()
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
      // console.log(this.barbers)
      this.barbers.unshift({
        firstName: this.firstElementInBarbers, //'Select Barber',
        // lastNaem : 'Barber'
      })
      // this.barbers.map((barber: any) => {
      //   // console.log('barber.workHour: ',barber.workHours)
      // })
    });

  }
  getServices() {

    this.bookingService.getServices().subscribe(services => {

      this.services = services;

      this.services.forEach((service: any) => {
        // console.log(service);
        service.durationUnix = service.durationMinutes * 60000;
        // console.log(new Date(service.durationUnix))
        // console.log(new Date(0))

      });

      this.services.unshift({
        name: this.firstElementInServices//'Select Service',
      })
      // console.log(this.services);
    })
  }
  getAppointments() {
    this.bookingService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
      // console.log("appointments", appointments);
      // this.appointments.map((app: any) => console.log(new Date(app.startDate)))

      // this.appointments.map((app: any) => console.log(app.serviceId))
      // this.appointments.map((app: any) => console.log(app.startDate))

    })

  }
  onSelectBarber($event: any) {
    // console.log('SELECTED!', $event)

    const barber = this.barbers.filter((m: any) => m.firstName !== this.firstElementInBarbers && m.id == $event);

    this.workhours = [];
    // barber.map((b:any) => console.log(b.workHours))
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
        // console.log('Monday');
        this.MINTIME = '07:00 AM';
        this.MAXTIME = '03:00 PM';
        break;
      case 'Tue':
        // console.log('Tuesday');
        this.MINTIME = '07:00 AM';
        this.MAXTIME = '03:00 PM';
        break;
      case 'Wed':
        // console.log('Wednde');
        this.MINTIME = '07:00 AM';
        this.MAXTIME = '03:00 PM';
        break;
      case 'Thu':
        // console.log('Thurs');
        this.MINTIME = '00:00 PM';
        this.MAXTIME = '20:00 PM';
        break;
      default:
        // console.log('Firda');
        this.MINTIME = '00:00 PM';
        this.MAXTIME = '20:00 PM';
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
    // console.log('day:', typeof($event.singleDate.jsDate));
    // console.log('day:', $event.singleDate.jsDate.toString().substring(0,3));
    this.MINTIME = '';
    this.MAXTIME = '';
    this.barber.time = '';

    let day = $event.singleDate.jsDate.toString().substring(0, 3);
    this.addWorkingHours(day);

    this.baseDayToCount = $event.singleDate.epoc * 1000;
    // console.log('$event', $event.singleDate.epoc * 1000);
    // console.log('$event', new Date($event.singleDate.epoc * 1000));
    // console.log('day', day);  
    // console.log('baseDayToCount', baseDayToCount);  
    // console.log('baseDayToCount human readable', new Date(baseDayToCount));  

    this.dayStart = $event.singleDate.epoc * 1000;
    this.dayFinish = this.dayStart + (24 * 3600000);

    // // // console.log('this.dayStart', this.dayStart);
    // console.log('$start', new Date(this.dayStart));
    // // // console.log('this.dayFinish', this.dayFinish);
    // console.log('$finish', new Date(this.dayFinish));

    // // this.appointments.map((app: any) => console.log('all:', new Date(( app.startDate))));
    // this.appointments.forEach((app: any) => console.log('all:', new Date(( app.startDate))));

    this.actualDay = [];
    this.appointments.forEach((app: any) => {
      if (app.startDate > this.dayStart && app.startDate < this.dayFinish) {
        this.services.forEach((service: any) => {
          if (app.serviceId === service.id) {

            app.finishDate = app.startDate + service.durationUnix;

            app.baseDayToCount = this.baseDayToCount;

            console.log('appointment IN A LOOP: ', app)
          }
         
        });
        
        this.actualDay.push(app);
      }
      this.addLunchTimes(day);
      app.lunchStart = this.addLunchTimes(day).start + this.baseDayToCount;
      app.lunchFinish = this.addLunchTimes(day).finish + this.baseDayToCount;
      console.log('appointment after loop: ', app)

      
    });

    // console.log('this.actualDay', this.actualDay)
    // console.log('this.actualDay', new Date(this.actualDay[0].startDate))
    // console.log('this.actualDay', new Date(this.actualDay[0].finishDate))

    if (this.actualDay.length > 0) {
      // console.log(this.actualDay)

      // let transform =  "{ hour: '2-digit', minute: '2-digit' }";
      
      // this.actualDay.forEach((db:any) => {
      //   console.log(db)
      //   });

      // alert(
      //   'On the chosed day following timeslots are already booked: \nFrom '
      //   + new Date(this.actualDay[0].startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' to '
      //   + new Date(this.actualDay[0].finishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
      //   '\nLunch time is from: ' 
      //   + new Date(this.actualDay[0].lunchStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' to '
      //   + new Date(this.actualDay[0].lunchFinish).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      //   '. \nYou are free to chose any other time slot. \n Please keep in mind the duration of your treatman. \n Shave - 20min \n Haircut - 30min \n Shave + Haircut - 50min'
      //   )
       
    }
    // else {
    //   // this.workhours = [];
    // }





    // let today = this.appointments.map((appointment: any) => {
    //   appointment > this.dayStart && appointment < this.dayFinish
    // })
    // console.log('today: ', today);
    // today.map((app: any) => console.log('all:', app))//new Date(( app.startDate))));





    // console.log(new Date($event.singleDate.epoc * 1000))
    if (this.barber.date !== null) {
      this.daySet = true;
    } else {
      this.daySet = false;
    }
  }
  onTimeSet($event: any) {
    console.log('$event', $event);
    let hours = Utils.formatHoursToUnix($event).hoursUnix //$event.substr(0, 2);
    let minutes = Utils.formatMinutesToUnix($event).minuteUnix //$event.substr(0, 2);

    // console.log('hours: ', hours + minutes + this.baseDayToCount);
    console.log('appointment at: ', new Date(hours + minutes + this.baseDayToCount));
    console.log('appointment until: ', new Date(hours + minutes + this.baseDayToCount + this.durationMinutes));
    // let minutes = $event.substr(3);
    // console.log('this.durationMinutes', this.durationMinutes);
    let appointmentStart = hours + minutes + this.baseDayToCount;
    let appointmentEnds = hours + minutes + this.baseDayToCount + this.durationMinutes;


    if (this.actualDay.length > 0) {
      this.actualDay.forEach((db: any) => {

      });
    }

    // console.log('this.actualDay', this.actualDay);
    // // console.log('this.baseDayToCount', this.baseDayToCount);
    // // this.actualDay.bas
    

    if (this.actualDay.length > 0) {
      console.log('****** ACTUAL DAY EXISTS ******')
      this.actualDay.forEach((db: any) => {
        // console.log(db.barberId)
        console.log('startDate: ',new Date(db.startDate))
        console.log('finishDate: ',new Date(db.finishDate))
        // console.log('lunchStart: ',new Date(db.lunchStart))
        // console.log('lunchFinish: ',new Date(db.lunchFinish))
        // console.log(db.serviceId)
      //   console.log('on this day following timeslots are already booked: From '
      //     + new Date(this.actualDay[0].startDate).toLocaleTimeString('en-US') + ' to '
      //     + new Date(this.actualDay[0].finishDate).toLocaleTimeString('en-US') + '. You are free to chose any other')
      });
    } else {
      console.log('******NO ACTUAL DAY******')
      this.actualDay.forEach((db: any) => {
        console.log('lunchStart: ',new Date(db.lunchStart))
        console.log('lunchFinish: ',new Date(db.lunchFinish))
      });
    }



    // let hours = $event.substr(0, 2);
    // let minutes = $event.substr(3);
    // let minuteUnix = parseInt(minutes) * 60000;
    // let hoursUnix = parseInt(hours) * 3600000;

    // console.log('$minuteUnix', minuteUnix);
    // console.log('$hoursUnix', hoursUnix);
    // this.appointments.map((app: any) => console.log(app.startDate))

  }

  onSelectService($event: any) {
    // console.log('$event:', $event)
    // this.ref.detectChanges();

    // console.log("price", this.barber.price)
    this.assignPriceDurationAndService($event)
    if (this.barber.price !== undefined) {
      this.priceSet = true
      // console.log("not")
    } else {
      this.priceSet = false
      // console.log("undefined")
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

  // getDateTime (time: string, dateUnix:number) {
  //   let hours = time.substr(0, 2);
  //   let minutes = this.barber.time.substr(3);
  //   let minuteUnix = minutes * 60000;
  //   let hoursUnix = parseInt(hours) * 3600000;
  //   // let dateUnix = this.barber.date.singleDate.epoc * 1000;
  //   let exactDate = minuteUnix + hoursUnix + dateUnix;
  //   return exactDate;
  // }


  bookBarber() {
    let dateUnix = this.barber.date.singleDate.epoc * 1000;
    let exactDate = Utils.getDateTime(this.barber.time, dateUnix);//this.getDateTime(this.barber.time, dateUnix)
    // console.log('dateUnix', dateUnix)
    // console.log('dateUnix',(new Date(dateUnix)))

    // let exactDate = await this.getDateTime(this.barber.time, dateUnix)




    // // console.log(this.barber.time)
    // // console.log(typeof(this.barber.time))

    // console.log('exactDate',(new Date(exactDate)))
    // console.log('exactDate',exactDate)

    // console.log('randomdate',(new Date(1579698600)))
    // console.log('randomdate', 1579698600)

    // let hours = this.barber.time.substr(0, 2)
    // let minutes = this.barber.time.substr(3)
    // // console.log(minutes)
    // // console.log(hours)
    // let minuteUnix = minutes * 60000;
    // let hoursUnix = hours * 3600000;
    // let dateUnix = this.barber.date.singleDate.epoc * 1000;
    // // console.log(minuteUnix)
    // // console.log(hoursUnix)
    // // console.log(dateUnix)

    // let exactDate = minuteUnix + hoursUnix + dateUnix;
    // console.log(exactDate)
    // // console.log (new Date(exactDate ))


    // let dateOnly = (this.barber.date.singleDate.epoc * 1000)

    // console.log ((this.barber.date.singleDate.epoc * 1000))
    // console.log (new Date((this.barber.date.singleDate.epoc * 1000)))
    // console.log (new Date((this.barber.date.singleDate.epoc * 1000)))

    // console.log((Date.parse(this.barber.time)))
    // console.log('id: ', this.service.id)
    // console.log('durationMinutes', this.durationMinutes)

    // console.log ((this.barber.date.singleDate.epoc * 1000))
    // console.log ((this.barber.date.singleDate.epoc * 1000))
    //(new Date($event.singleDate.epoc * 1000))
    
    let booking: Booking = {
      startDate: exactDate,
      barberId: parseInt(this.barber.id),
      serviceId: this.service.id
    }
    
    console.log('booking',booking)
    console.log('this.durationMinutes',this.durationMinutes)

    // this.bookingService.bookAppointment(booking);

    // this.bookingService.bookAppointment(booking).subscribe(response => {
    //   console.log(response);
    // });


  }
}





// switch (day) {
    //   case 'Mon':
    //     console.log('Monday');
    //     this.MINTIME = '07:00 AM';
    //     this.MAXTIME = '03:00 PM';
    //     break;
    //   case 'Tue':
    //     console.log('Tuesday');
    //     this.MINTIME = '07:00 AM';
    //     this.MAXTIME = '03:00 PM';
    //     break;
    //   case 'Wed':
    //     console.log('Wednde');
    //     this.MINTIME = '07:00 AM';
    //     this.MAXTIME = '03:00 PM';
    //     break;
    //   case 'Thu':
    //     console.log('Thurs');
    //     this.MINTIME = '00:00 PM';
    //     this.MAXTIME = '20:00 PM';
    //     break;
    //   default:
    //     console.log('Firda');
    //     this.MINTIME = '00:00 PM';
    //     this.MAXTIME = '20:00 PM';
    //     break;

    // }