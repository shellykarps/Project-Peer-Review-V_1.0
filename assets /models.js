/*User.js
 *************************************/
(function ($) {
   "use strict";
   $.bb || ($.bb = {}); // namespace
   var M = $.bb.models = {};

   var ModelBase = Backbone.Model.extend({
      idAttribute: '_id',
      'keys': function() {
         return _.keys(this.attributes);
      },
      'toJSON': function() {
         return _.omit(this.attributes, this.idAttribute, 'routeUrl');
      }
   });

   M.User = ModelBase.extend({
      defaults: {
         'name': '',
         'email': ''
      },
      'url': 'users',
      'initialize': function(){
         this.set({'routeUrl': '#/user/delete/'+this.cid}, {'silent': true});
      }
   });

   M.Footer = ModelBase.extend({
      'defaults': {
         'route': 'home',
         'userCount': '*',
      }
   });

})(jQuery);