export default function scrollWatch () {
  return {
      restrict: 'A',
      link: function(scope, elem, attr) {
          var start = 0;
          var limit = 50;
          scope.$root.scrollTop = false;
          elem.bind('scroll', function(e) {
            if(e.target.scrollTop - start > limit || start - e.target.scrollTop > limit ) {
              scope.$apply(function() {
                scope.$root.scrollTop = true;
              });
            } else {
              scope.$apply(function() {
                scope.$root.scrollTop = false;
              });
            }
          });
      }
  }
}
