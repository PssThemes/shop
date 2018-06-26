export default function detailedPurchase(){
  return {
    restrict: "E",
    scope: {
      data: "="
    },
    templateUrl: "directives/detailed-purchase/detailed-purchase.htm",
    link: (scope, element, attrs) => {
      // console.log("link called: ", scope, element, attrs);
    }
  }
}
