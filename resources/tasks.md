#### Load categories .
- REMOVED: create the functionality in the controller. 1
- REMOVED:  turn on child_added event only after the hole list of custom categories are loaded .. such that we don't do dumb shit with duplication..
I mean there will not be any data transfer since firebase cache is good.. but is still a pointless render for angular.
I've implemented this in terms of child_added event.

#### Add categories
- ui stuff 1
  - add ng-mode to input 1
  - add onEnter for input. 1

  - add on-click to the button. 1
- build the functionality in the controller.1
- make the backendService function 1
- test that it works in firebase. 1
- add the on created event. 1


#### Remove categories
- the ui button 1
- the on click event on it. 1
- remove functionality in controller   1
- remove functionality in backend service. 1
- test it in firebase. 1

- in controller add an event listener for the deleted one. 1
- build the backendService functionality of the on delete. 1
- test that it works 1


#### Edit categories
- handle the ui 1
- add actions in the controller.
- update in firebase.

- add event for update.
- create the onUpdateCustomCategory functionality using child_changed
