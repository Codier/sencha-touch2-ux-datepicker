/**
 * An alternate iCal Style date picker
 */
Ext.define('Ext.ux.DatePicker', {
  extend: 'Ext.Panel',
  xtype: 'uxdatepicker',
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December'],
  weekstart: 1,
  config: {
    cls: 'ux-date-picker',
    value: new Date(),
    minDate: null,
    maxDate: null
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);

    me.element.on({
      tap: function(event, targetDom) {
        var target = Ext.get(targetDom);
        if (!target.hasCls('unselectable')) {
          var newDate = me.getCellDate(target);
  				me.setValue(newDate);
  				me.fireEvent('change', me, newDate);
  			}
      },
      delegate: 'td',
      scope: me
    });

    me.element.on({
      tap: function(event, targetDom) {
        var target = Ext.get(targetDom);
        if (target.hasCls("goto-prevmonth")) {
    		  me.loadTimeDelta('month', -1);
    		}

  			if (target.hasCls("goto-nextmonth")) {
  				me.loadTimeDelta('month', 1);
  			}
  			
  			if (target.hasCls("goto-prevyear")) {
    		  me.loadTimeDelta('year', -1);
    		}

  			if (target.hasCls("goto-nextyear")) {
  				me.loadTimeDelta('year', 1);
  			}
      },
      delegate: 'th',
      scope: me
    });
  },
  
  applyMinDate: function(newVal, oldVal) {
    if (!Ext.isDate(newVal)) {
	    newVal = null;
		}
		return newVal;
  },
  
  applyMaxDate: function(newVal, oldVal) {
    if (!Ext.isDate(newVal)) {
	    newVal = null;
		}
		return newVal;
  },
  
  applyValue: function(newVal, oldVal) {
    if (!Ext.isDate(newVal)) {
	    newVal = null;
		}
		if (! this.sameDay(newVal, oldVal)) {
		  return newVal;
		}
  },
  
  updateValue: function(newVal, oldVal) {
    this.refresh();
  },

	refresh : function() {
		var me = this;
		setTimeout(function() {
			var v = me.getValue(), d = v || new Date();
			me.element.setHtml(me.generateCalendar(d.getMonth(), d.getFullYear()));
			me.setToday();
			v && me.setSelected(v);
		}, 0);
	},
	
	generateCalendar: function(month, year) {
		return this.monthMarkup(month, year);
	},
	
	monthLength: function(month, year) {
		var dd = new Date(year, month, 0);
		return dd.getDate();
	},

	monthMarkup: function(month, year) {
		var c = new Date();
		c.setDate(1);
		c.setMonth(month);
		c.setFullYear(year);

		var x = parseInt(this.weekstart, 10);
		var s = (c.getDay() - x) % 7;
		if (s < 0) {
			s += 7;
		}

		var dm = this.monthLength(month, year);

		var this_month = '<table cellspacing="0"><thead><tr>';

		this_month += '<th class="goto-prevyear">' + this.days[(0+x)%7]+'</th>';
		this_month += '<th class="goto-prevmonth">' + this.days[(1+x)%7]+'</th>';
		this_month += '<th>' + this.days[(2+x)%7]+'</th>';
		this_month += '<th><span class="month-year-label">' + this.months[month] + ' ' + year + '</span>' + this.days[(3+x)%7] + '</th>';
		this_month += '<th>' + this.days[(4+x)%7]+'</th>';
		this_month += '<th class="goto-nextmonth">' + this.days[(5+x)%7]+'</th>';
		this_month += '<th class="goto-nextyear">' + this.days[(6+x)%7]+'</th>';
		this_month += '</tr>';
		this_month += '</thead>';

		this_month += '<tbody>';
		this_month += '<tr>';

		for ( var i=s; i>0; i-- ) {
			var this_y = (month-1)<0?year-1:year;
			this_month += this.dayMarkup(0, dm-i+1 , (month+11)%12, this_y, (s-i+x)%7);
		}

		dm = this.monthLength(month+1,year);
		for(i = 1; i <= dm; i++) {
			if ( (s%7) === 0 ) {
				this_month += '</tr>';
				this_month += '<tr>';
				s = 0;
			}
			this_month += this.dayMarkup(1, i , month, year, (s+x)%7);
			s++;
		}

		var j = 1;
		for (i = s; i < 7; i++ ) {
			 this_y = (month+1)>11?year+1:year;
			 this_month += this.dayMarkup(9, j , (month+1)%12, this_y, (i+x)%7);
			 j++;
		 }

		this_month += '</tr>';
		this_month += '</tbody>';
		this_month += '</table>';
		return this_month;
	},

	dayMarkup: function(format,day,month,year,column) {
		var classes = ['day'];
		if (format === 0) {
			classes.push('prevmonth');
		} else if (format == 9) {
			classes.push('nextmonth');
		}

		if (column === 0 || column == 6) {
			classes.push('weekend');
		}

		var datetime = year + '-' + (month + 1) + '-' + day;
		var date = new Date(year, month, day);

    if ((this.getMinDate() && date < this.getMinDate()) || (this.getMaxDate() && date > this.getMaxDate())) {
     classes.push('unselectable');
    }

		var this_day = '<td class="' + classes.join(' ') + '" datetime="' + datetime + '">';
		this_day += day;
		this_day += '</td>';

		return this_day;
	},

  getCellDate: function(dateCell) {
    var date = dateCell.dom.getAttribute('datetime');
		return this.stringToDate(date);
  },

  stringToDate: function(dateString) {
		var a = dateString.split('-');
		return new Date(Number(a[0]), (a[1]-1), Number(a[2]));
	},
	
	dateToString: function(date) {
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	},
	
	removeSelectedCell: function() {
		this.element.select('.selected').removeCls('selected');
	},
	
	setToday: function() {
		var date = new Date();
		this.element.select('td[datetime="' + date.getFullYear() + 
		                    '-' + (date.getMonth() + 1) + '-' + date.getDate() + '"]').addCls('today');
	},
	
	sameDay: function(date1, date2) {
	  if (!date1 || !date2) {
	    return false;
	  }
		return (date1.getDate && date2.getDate) && 
		       date1.getDate() == date2.getDate() && 
		       date1.getMonth() == date2.getMonth() && 
		       date1.getFullYear() == date2.getFullYear();
	},
	
	setSelected: function(date) {
		this.removeSelectedCell();
		
		this.element.query('td').forEach(function(tdDom) {
		  var td = Ext.get(tdDom);
			var clickedDate = this.getCellDate(td);
			if (!td.hasCls("prevmonth") && !td.hasCls("nextmonth") && this.sameDay(date, clickedDate)) {
				td.addCls('selected');
			}
		}, this);

		this.setToday();
	},

  loadTimeDelta: function(unit, delta) {
		var day;

		var selected = this.element.down('.selected');
		if (selected) {
			day = this.stringToDate(selected.dom.getAttribute('datetime')).getDate();
		} else {
			day = new Date().getDate();
		}

		var v = this.getValue() || new Date();
		
		var newDay;

		if (unit === 'month') {
		  newDay = new Date(v.getFullYear(), v.getMonth() + delta, day);
		} else if (unit === 'year') {
		  newDay = new Date(v.getFullYear() + delta, v.getMonth(), day);
		}


    if (this.getMinDate() && Ext.Date.getLastDateOfMonth(newDay) < this.getMinDate()) {
     return;
    }

    if (this.getMaxDate() && Ext.Date.getFirstDateOfMonth(newDay) > this.getMaxDate()) {
     return;
    }

    if (this.getMinDate() && newDay < this.getMinDate()) {
     newDay = Ext.Date.clone(this.getMinDate());
    }
    
    if (this.getMaxDate() && newDay > this.getMaxDate()) {
     newDay = Ext.Date.clone(this.getMaxDate());
    }

		this.setValue(newDay);
	}
});