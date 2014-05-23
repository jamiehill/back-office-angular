var uid = require('../../../../../common/util/UIDUtil');
var BaseViewPM = require('./BaseViewPM');
var iconsTpl = require('./components/ItemIcons.tpl.html');
var menuTpl = require('./components/OptionsMenu.tpl.html');
var nameTpl = require('./components/ItemName.tpl.html');
var commonModel = require('../../../../model/SportsCommonModel');
var apiServer = require('../../../../../common/services/ApiServer');


module.exports = Marionette.View.extend({


    smColumn: '80px',
    mdColumn: '120px',
    lgColumn: '200px',
    events: {
        "click .optionsMenu": "onOpenOptions"
    },


    /**
     * Once the dom element has been created, build the view
     */
    onShow: function(){
        this.pm = new BaseViewPM();
        $(document).click(this.onCloseOptions);
        this.initGrid();
    },


    /**
     * Build main grid
     */
    initGrid: function(){
        var scope = this;
        this.gridId = uid.getUid();

        var options = this.defaultOptions(this.gridId, true);
        options.columns = this.defaultColumns(scope, 350);
        options.onExpand = function (event) {
            scope.onExpandRow(event, scope, this);
        };
        options.onRefresh = function(target, data){
            scope.onGridRefresh(scope, target, data);
        };

        $(this.$el).w2grid(options);

        // TODO this should have been performed before arriving here.  should be an 'EventModel' that handles auto-load of selected events
        this.apiServer.getFullEventDetails(this, this.onInitData, this.model.id,this.commonModel.getSessionToken());
    },


    /**
     * Initialises and returns a new w2Grid instance for expanded rows
     * @param scope
     * @param name
     */
    initSubGrid: function(scope, name, instrs){
        var options = this.defaultOptions(name, false);
        options.columns = this.defaultColumns(scope, 315);
        options.records = this.parseRecords(instrs);
        options.show.lineNumbers = true;
        options.selectType = 'cell';
        options.onChange = function(event) {
            scope.onSelectionGridChange(event);
        };
        options.onRefresh = function (target, data) {
            scope.onGridRefresh(scope, target, data);
        };
        return $().w2grid(options);
    },


    /**
     * Grid initialisation options.  For views extending this base class,
     * override these methods to configure an alternative configuration.
     */


    /**
     * Defaults grid options - applies to both main/sub grids
     * @param name
     */
    defaultOptions: function(name, mainGrid){
        return {
            header: '',
            name: name,
            fixedBody: false,
            recordHeight: 30,
            show: {
                toolbar: false,
                footer: false,
                header: false,
                columnHeaders: mainGrid
            }
        }
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
            { field: 'stake', caption: 'Stake', size: scope.smColumn, style: 'text-align: center'},
            { field: 'liab', caption: 'Liab', size: scope.smColumn, style: 'text-align: center'},
            { field: 'spots', caption: 'Spots', size: scope.smColumn, style: 'text-align: center'},
            { field: 'percent', caption: '100%', size: scope.smColumn, style: 'text-align: center'},
            { field: 'dec', caption: 'Dec', size: scope.smColumn, style: 'text-align: center'}
//                    { field: 'blank', caption: 'Options' }
        ]
    },


    /**
     * Handlers
     */


    /**
     * TODO this should have been done prior to this view being added (@see 'initGrid' TODO)
     * @param resp
     */
    onInitData: function(resp){
        var response = resp.attributes.Response;
        if (response.status === 'ERROR') return;

        this.model.update(response.body.Node);

        w2ui[this.gridId].records = this.parseRecords(this.model.Markets.models);
        w2ui[this.gridId].refresh();
    },


    /**
     * Expand row handler
     * @param event
     * @param scope
     * @param grid
     */
    onExpandRow: function (event, scope, grid) {
        var item = grid.get(event.recid).item,
            height = item.Instruments.length * grid.recordHeight,
            subName = 'subgrid-' + item.id;

        // destroy any previous subgrid
        if (w2ui.hasOwnProperty(subName))
            w2ui[subName].destroy();

        // expand main grid to accomodate sub
        $('#'+ event.box_id).animate({ height: height+'px' }, 10);

        // build and add subGrid
        setTimeout(function () {
            var subGrid = scope.initSubGrid(scope, subName, item.Instruments.models);
            $('#'+ event.box_id).w2render(subGrid);

            subGrid.resize();
            grid.resize();

        }, 300);
    },


    /**
     * Refresh the grid
     * @param target
     * @param data
     */
    onGridRefresh: function (scope, target, data) {
        data.onComplete = function () {
//                    $('a[data-marketId]').unbind('click').click(function() {
//                        var action = $(this).attr('data-action');
//                        switch (action)
//                        {
//                            case 'showBets':
//                                scope.pm.showBets($(this).attr('data-marketId'), true);
//                                break;
//                            case 'setResults':
//                                scope.pm.setResults();
//                                break;
//                            case 'unsetResults':
//                                scope.pm.unsetResults();
//                                break;
//                            case 'settle':
//                                scope.pm.settleByMarket($(this).attr('data-marketId'));
//                                break;
//                            case 'unsettle':
//                                scope.pm.unsettleByScope('MARKET',$(this).attr('data-marketId'));
//                                break;
//                            case 'viewAudit':
//                                scope.pm.viewAudit();
//                                break;
//                        }
//                    });


//                    $('.cogBtn').click(function(e){
//
//                        var menu = $(this).next();
//                        if ($('body > ul').hasClass('menuOpen')) {
//                            $('body .menuOpen').appendTo($(this).parent());
//                            menu.removeClass('menuOpen').addClass('menuClosed').hide();
//
//                        } else {
//                            menu.appendTo('body');
//                            menu.css({'top': $(e.target).offset().top + 23});
//                            menu.css({'left': $(e.target).offset().left});
//                            menu.removeClass('menuClosed').addClass('menuOpen').show();
//                        }
//
//                    });


            // Close if outside click
//                    $(document).on('click', function(e){
//                        if (!$(e.target).hasClass('cogBtn')) {
//                            if ($('body > ul').hasClass('menuOpen')) {
//                                $.each($('.cogBtn'), function(el, val){
//                                    if ($(val).next().is('ul')) {
//                                    } else {
//                                        $('body > ul').appendTo($(val).parent());
//                                    }
//                                });
//                            }
//                        }
//                    });
        };
    },


    /**
     * Opens the 'options' menu for market/instrument
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
                { title:'View Audit', class:'viewAudit' }
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
     * Closes the options menu
     * @param e
     */
    onCloseOptions: function(e){
        if (($('body > ul').hasClass('menuOpen'))){
            $('body > ul').find('.menuOpen').remove();
        }
    },


    /**
     * @param event
     */
    onSelectionGridChange: function(event){
        var valueNew = event.value_new;
        var valueOld = event.value_previous;
        var grid = w2ui[event.target];
        console.log('selection grid change from '+valueNew+' to '+valueOld);
    },


    /**
     * Parses the specified collection to w2grid record hash
     */
    parseRecords: function(models){
        return _.map(models, function(item){
            return {
                recid:      item.id,
                name:       item.get('name'),
                item :      item,
                stake :     'Stake',
                liab :      'Liab.',
                spots :     'Spots',
                percent :   '%',
                dec :       'Dec.'
            };
        });
    }
});
