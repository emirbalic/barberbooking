


//   }

export default class Utils {
    
    static getDateTime(time: string, dateUnix: number) {

        // let hours = this.formatHoursToUnix(time).hours   //time.substr(0, 2);
        let hoursUnix = this.formatHoursToUnix(time).hoursUnix   //parseInt(hours) * 3600000;

        // let minutes = this.formatMinutesToUnix(time).minutes;   //time.substr(3);
        let minuteUnix = this.formatMinutesToUnix(time).minuteUnix  //parseInt(minutes) * 60000;

        let exactDate = minuteUnix + hoursUnix + dateUnix;
        return exactDate;
    }

    static formatHoursToUnix(time: string){
        
        let hours = time.substr(0, 2);
        let hoursUnix = parseInt(hours) * 3600000;
        let formatHours ={
            hours,
            hoursUnix
        }
        return formatHours;
    }

    static formatMinutesToUnix(time: string){
        let minutes = time.substr(3);
        let minuteUnix = parseInt(minutes) * 60000;
        let formatMinutes ={
            minutes,
            minuteUnix
        }
        return formatMinutes;
    }





    // static formatMinutesToUnix(time: string){
    //     let hours = time.substr(0, 2);
    //     let minutes = time.substr(3);
    //     return 
    // }
}


////justintime
// let hours = time.substr(0, 2);
// let minutes = time.substr(3);

// let minuteUnix = parseInt(minutes) * 60000;
// let hoursUnix = parseInt(hours) * 3600000;

// let exactDate = minuteUnix + hoursUnix + dateUnix;
// return exactDate;