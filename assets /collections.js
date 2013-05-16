/*collections.js
 *************************************/
(function ($) {
   "use strict";
   $.bb || ($.bb = {}); // namespace
   var C = $.bb.lists = {};
   
   C.Users = Backbone.Collection.extend({
      'model': $.bb.models.User,
      'url': "/users",
      'initialize': function() {
		  //update count for number of users
         this.updateCount();
         this.backboneFirebase = new BackboneFirebase(this, {idAttribute: '_id', syncManager: BackboneFirebaseAutoSync});
		 //add
         this.on('all', function(action, model) {
            switch(action) {
				//add user to count
               case 'add':
			   //remove user from count
               case 'remove':
                  this.updateCount();
                  break;
               default:
                  // do nothing
            }
         }, this);
      },
	  //update count in footer
      'updateCount': function() {
         $.bb.updateFooter({'userCount': this.length});
      }
   });
  
   C.Comments = Backbone.Collection.extend({
      model: $.bb.models.Comment,
      'url': "/comments",
      initialize: function(models, props) {
		 //update count for number of comments 
         this.updateCount();
         this.backboneFirebase = new BackboneFirebase(this, {idAttribute: '_id', 'syncManager': BackboneFirebaseAutoSync});
         this.on('all', function(action) {
            switch(action) {
               case 'add':
               case 'remove':
                  this.updateCount();
                  break;
               default:
               // do nothing
            }
         }, this);
      },
	  //update number of comments count in footer
      updateCount: function() {
         $.bb.updateFooter({'commentCount': this.length});
      }
   });
})(jQuery);