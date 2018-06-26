export default function purchase(){
  return {
    restrict: "E",
    scope: {
      data: "="
    },
    templateUrl: "directives/purchase/purchase.htm",
    link: (scope, element, attrs) => {
      // console.log("link called: ", scope, element, attrs);
    }
  }
}
