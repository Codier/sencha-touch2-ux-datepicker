Ext.application({
  launch: function() {
    var picker = Ext.create('widget.uxdatepicker', {
      minDate: Ext.Date.add(new Date(), Ext.Date.DAY, -50),
      maxDate: Ext.Date.add(new Date(), Ext.Date.DAY, 50)
    });
    Ext.Viewport.add(picker);
  }
});
