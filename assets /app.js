/*app.js
 *************************************/
(function ($, console) {
   "use strict";

   // some bindings for footer element (used by updateFooter() below)
   var footerModel = new $.bb.models.Footer();
   var footerView = new $.bb.views.Footer({'el': $('footer .navbar-inner'), 'model': footerModel});

   /**
    * A utility to update the footer text bindings from other views
    */
   $.bb.updateFooter = function(props) {
      footerModel.set(props);
   };

   /**
    * Display a message box at the base of the page
    */
   $.bb.showMessage = function(txt, type, timeout) {
      if( arguments.length === 2 && typeof(type) === 'number' ) {
         timeout = type;
         type = null;
      }
      var $t = $.bb.appendTemplate($('#messages'), 'message-template', {'txt': txt||'', 'class': messageClass(type)});
      $t.click($t.remove.bind($t));
      if( timeout ) {
         setTimeout(function() {
            if( $t.is(':visible') ) {
               $t.fadeOut(750, $t.remove.bind($t));
            }
         }, timeout*1000);
      }
   };

   jQuery(function($) {
      $.bb.updateFooter();
      BackboneFirebase.DEFAULT_INSTANCE = 'https://YOURINSTANCE.firebaseio.com/';
      $.bb.Router.init(footerModel);
   });

   //change the Bootstrap default from warning to info
   function messageClass(type) {
      switch(type) {
         case 'warning':
            return '';
         case '':
            return 'alert-info';
         default:
            return 'alert-'+type;
      }
   }

})(jQuery, window.console);