/*views.js
 *************************************/
(function ($, console) {
   "use strict";
   $.bb || ($.bb = {}); // namespace
   var V = $.bb.views = {};

   var userList = null; // set by loadUsers()


   /** BASE
    ***********************/

   var ViewBase = Backbone.View.extend({

      // Applies Backbone.ModelBinder bindings to the data
      applyDataBindings: function(template, $to, bindings) {
         bindings = _.extend({
            'routeUrl': { 'selector': '[href=""]', 'elAttribute': 'href' },
            'name': { 'selector': '[data-name="name"]' }
         }, bindings||{});
         var factory = $.bb.bindings.factory({'template': template, 'bindings': bindings});
         var binder = new Backbone.CollectionBinder(factory);
         binder.bind(this.collection, $to);
         this._subscriptions.push(binder);
      },

      // show the html panel
      'show': function() {
         this.$el.show();
      },

      // hide the html panel
      'hide': function() {
         this.$el.hide();
      },

      // jQuery/Bootstrap validation
      'addValidation': function() {
         this.$el.find('form').on('submit', false).validate({
            highlight: function(label) {
               $(label).closest('.control-group').addClass('error').removeClass('success');
            },
            'success': function(label) {
               $(label).closest('.control-group').addClass('success').removeClass('error');
            },
            'submitHandler': _.bind(this.addEntry, this)
         });
      },

      // remove a record
      addDeleteTrigger: function(selector, root) {
         var collection = this.collection;
         var $e = root? this.$el.find(root) : this.$el;
         $e.on('click.deleteTrigger', selector, function(e) {
            var cid = ($(this).attr('href').match(/\/([^/]+)$/)||[])[1];
            if( cid ) {
               collection.remove( collection.get(cid) );
            }
            e.preventDefault();
            return false;
         });
         this._addSubscription(function() { $e.off('click.deleteTrigger') });
      },

      // add a record
      'addEntry': function(form, evt) {
         var values = {};
         $(form).find('input[type=text], select').each(function() {
            var $self = $(this);
            var k = _.str.trim($self.attr('name'));
            values[k] = _.str.trim($self.val());
         });
         this.collection.add([values]);
         evt.preventDefault();
         return false;
      },

      // changes the default text in a field
      'updateInputTextOnAdd': function($e, prefix, suffix) {
         suffix || (suffix = '');
         var list = this.collection;
         var fn = _.bind(function() {
            $e.val(prefix+(list.length+1)+suffix);
         }, this);
         list.on('add', fn);
         this._addSubscription(function() { list.off('add', fn) });
      },

      '_subscriptions': [], // see destroy()

      // free resources if destroyed
      'destroy': function() {
         _.each(this._subscriptions, function(sub) {
            if( sub.dispose ) { sub.dispose(); }
            else if( sub.unbind ) { sub.unbind(); }
         });
        
      },

      // a wrapper for creating disposable subscriptions
      '_addSubscription': function(fn) {
         this._subscriptions.push({
            'dispose': _.bind(fn, this)
         });
      }
   });



   /** FOOTER
    ***********************/

   V.Footer = Backbone.View.extend({
      initialize: function(props) {
		  
         var bindings = $.bb.bindings.collect(this.$el, this.model.keys(), props && props.bind);
         this._binder = new Backbone.ModelBinder();
         this._binder.bind(this.model, this.el, bindings);
      }
   });


   /** HOME
    ***********************/

   V.Home = ViewBase.extend({});


   // loads the shared user list only once and returns on demand
   function loadUsers() {
      if( !userList ) {
         userList = new $.bb.lists.Users();
      }
      return userList;
   }

})(jQuery, console);