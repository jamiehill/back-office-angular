var BaseView = require('../BaseView');
var uid = require('../../../../../../common/util/UIDUtil');
var HorsesViewPM = require('./HorsesViewPM');
var iconsTpl = require('../components/ItemIcons.tpl.html');
var menuTpl = require('../components/OptionsMenu.tpl.html');
var nameTpl = require('../components/ItemName.tpl.html');


module.exports = BaseView.extend({


    /**
     *
     */
    onShow: function(){
        this.pm = new HorsesViewPM();
        this.sortHorses();
        this.initGrid();
    },


    sortHorses: function(){

    },


    /**
     * Default grid columns - applies to both main/sub grids
     * @returns {*[]}
     */
    defaultColumns: function(scope, size){
        return [
            { field: 'name', caption: 'Name', size: size+'px',
                render: function (record) {
                    return _.template(nameTpl, {name:record.name});
                }
            },
            { field: 'ad', caption: 'Act/Displ', size: scope.smColumn, style: 'text-align: center',
                render: function (record) {
                    return _.template(iconsTpl, record);
                }
            },
            { field: 'position', caption: 'Position', size: scope.smColumn, sortable: false, attr: 'align=center'},
            { field: 'result', caption: 'Result', size: scope.smColumn, sortable: false, attr: 'align=center'},
            { field: 'lp', caption: 'LP', size: scope.smColumn, sortable: true, attr: 'align=center'},
            { field: 'sp', caption: 'SP', size: scope.smColumn, sortable: true, attr: 'align=center'},
            { field: 'dh', caption: 'DH Deduction', size: scope.mdColumn, sortable: true, attr: 'align=center'},
            { field: 'start', caption: 'Starting Price', size: scope.mdColumn, sortable: true, attr: 'align=center'},
            { field: 'pl', caption: 'P/L', size: scope.smColumn, sortable: true, attr: 'align=center'},
            { field: 'bets', caption: 'Bets', size: scope.smColumn, sortable: true, attr: 'align=center'},
            { field: 'stake', caption: 'Stake', size: scope.smColumn, sortable: true, attr: 'align=center'},
            { field: 'liab', caption: 'Liab', size: scope.smColumn, sortable: true, attr: 'align=center'}
//                    { field: 'blank', caption: 'Options'}
        ]
    },


    /**
     * @param e
     */
    onOpenOptions: function(e){
        var options = {
            id: record.item.id,
            name: record.item.name,
            items: [
                { title:'View Bets', class:'showBets' },
                { title:'Set Results', class:'setResults' },
                { title:'Unset results', class:'unsetResults' },
                { title:'Settle', class:'settle' },
                { title:'Un-Settle', class:'unsettle' },
                { title:'View Audit', class:'viewAudit' },
                { title:'View All Bets', class:'viewAll' }
            ]
        };

        if ($('body > ul').hasClass('menuOpen')) {
            $('body > ul').find('.menuOpen').remove();
        }

        var top  = $(e.target).offset().top + 12,
            left = $(e.target).offset().left - 3;

        var tpl = _.template(menuTpl, options);
        $(tpl).prependTo('body');

        var $menu = $('body').find('.menuOpen');
        $menu.css({'top': top+'px'});
        $menu.css({'left': left+'px'});
    },


    /**
     * Parses the specified collection to w2grid record hash
     */
    parseRecords: function(models){
        return _.map(models, function(item){
            return {
                recid: item.id,
                name: item.get('name'),
                ad: {
                    type: 'html',  id: 'activeDisplay',caption: 'Active/Displayed',
                    html: "<div class='fa fa-cog fa-fw'></div><div class='fa fa-cog fa-fw'></div>"
                },
                item: item,
                position: item.get('position'),
                result: item.get('result'),
                lp: item.get('lp'),
                sp: item.get('sp'),
                dh: item.get('dh'),
                start: item.get('start'),
                bets: item.get('bets'),
                stake: item.get('stake'),
                liab: item.get('liab')
            };
        });
    }

});
