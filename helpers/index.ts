

export const shortAddress = (address: string, first = 6, last = -4) => {
    if (!address) return ''
    return `${address.slice(0, first)}...${address.slice(last)}`
}


export const secondsToDDHHMMSS = (totalSeconds: number) => {

    var days = Math.floor(totalSeconds / 24 / 60 / 60);
    var hoursLeft = Math.floor((totalSeconds) - (days * 86400));
    var hours = Math.floor(hoursLeft / 3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    var minutes = Math.floor(minutesLeft / 60);
    var seconds = totalSeconds % 60;

    let strDays: string = `${days}`
    let strHours: string = `${hours}`
    let strMinutes: string = `${minutes}`
    let strSeconds: string = `${seconds}`

    // Padding the values to ensure they are two digits
    if (hours < 10) { strHours = "0" + hours; }
    if (minutes < 10) { strMinutes = "0" + minutes; }
    if (seconds < 10) { strSeconds = "0" + seconds; }

    return {
        days: strDays,
        hours: strHours,
        minutes: strMinutes,
        seconds: strSeconds
    }
}


