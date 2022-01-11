export default class Utils {
    
    static getDateTime(time: string, dateUnix: number) {

        let hoursUnix = this.formatHoursToUnix(time).hoursUnix;

        let minuteUnix = this.formatMinutesToUnix(time).minuteUnix;

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
}
