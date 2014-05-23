define(function () {

    // Private

    var monthToTextMap = {
        '0' : 'Jan',
        '1' : 'Feb',
        '2' : 'Mar',
        '3' : 'Apr',
        '4' : 'May',
        '5' : 'Jun',
        '6' : 'Jul',
        '7' : 'Aug',
        '8' : 'Sep',
        '9' : 'Oct',
        '10' : 'Nov',
        '11' : 'Dec'
    }

    function monthNumberToName(monthIndex) {
        return monthToTextMap[monthIndex + ''];
    }

    // Public

    return {
        formatTimeFromDate: function( date )
        {
            var zero = '0', hours, minutes, time;

            hours = date.getHours();
            minutes = date.getMinutes();

            hours = (zero+hours).slice(-2);
            minutes = (zero+minutes).slice(-2);

            time = hours + ':' + minutes;
            var ddmmyy = date.getDate()+' '+ monthNumberToName(date.getMonth());
            return ddmmyy+' '+time;
        },

        formatMMSSFromDate: function( date )
        {
            var zero = '0', minutes, seconds, time;

            minutes = date.getMinutes();
            seconds = date.getSeconds();

            minutes = (zero+minutes).slice(-2);
            seconds = (zero+seconds).slice(-2);

            time = minutes + ':' + seconds;
            return time;
        },

        formatHMMSSFromDate: function( date )
        {
            var zero = '0', hours, minutes, seconds, time;

            hours = date.getHours();
            minutes = date.getMinutes();
            seconds = date.getSeconds();

            minutes = (zero+minutes).slice(-2);
            seconds = (zero+seconds).slice(-2);

            time = hours+':'+ minutes + ':' + seconds;
            return time;
        },

        convertMatchTimefromSecs: function ( value )
        {
            var zero = '0', hours, minutes, seconds, time;
            time = new Date(0, 0, 0, 0, 0, value, 0);

            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();

            // Pad zero values to 00
            hours = (zero+hours).slice(-2);
            minutes = (zero+minutes).slice(-2);
            seconds = (zero+seconds).slice(-2);

            time = hours + ':' + minutes + ':' + seconds;
            return time;
        }
    }

});