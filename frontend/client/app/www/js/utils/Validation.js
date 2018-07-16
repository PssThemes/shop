
  // TODO: move all this repeating validation functions in their own module.

export function validateEmail(email){
  if(email == ""){
    return { emailIsValid: false, emailError: "hey:) email is empty!!" };
  }
  else if(!regexForEmail(email)){
    return { emailIsValid: false, emailError: "invalid email" };
  }
  // TODO: insert a regex validation here..
  else{
    return { emailIsValid: true, emailError: ""};
  }
}

function regexForEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
