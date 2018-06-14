export default function onEsc() {
  var linkFn = function(scope, element, attrs) {
    element.bind("keyup", function(event) {
      if (event.which === 27) {
        scope.$apply(function() {
          scope.$eval(attrs.onEsc);
        });
        event.preventDefault();
      }
    });
  };

  return {
    link: linkFn
  };
}