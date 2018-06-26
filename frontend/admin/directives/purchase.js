function purchase(){
  return {
        restrict: 'A',
        template: "<a href='ts3server://{{details.serverName.value}}:{{details.port.value}}'>Teamspeak Server</a>",
        link: function (scope, element, attrs) {
            if(attrs.details){
                scope.details = scope.$eval(attrs.details);
            }
        }
    };
}
