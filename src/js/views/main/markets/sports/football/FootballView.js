var BaseView = require('../BaseView');
var FootballViewPM = require('./FootballViewPM');


module.exports = BaseView.extend({


    /**
     *
     */
    initialize: function () {
        this.pm = new FootballViewPM();
    }


});