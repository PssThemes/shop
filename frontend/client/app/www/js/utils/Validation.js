
  // TODO: move all this repeating validation functions in their own module.

export function validateEmail(email){
  if(email == ""){
    return { emailIsValid: false, emailError: "hey:) email is empty!!" };
  }
  // TODO: insert a regex validation here..
  else{
    return { emailIsValid: true, emailError: ""};
  }
}
