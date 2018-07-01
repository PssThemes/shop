export default function onEnter() {
  var linkFn = function(scope, element, attrs) {

    console.log("on enter directive..");

    element.bind("keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.onEnter);
        });
        event.preventDefault();
      }
    });
  };

  return {
    link: linkFn
  };
}
