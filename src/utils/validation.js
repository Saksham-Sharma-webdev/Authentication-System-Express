
const validateName = function(name){
  const nameRegex = /^(?=.{8,30}$)(?![_. ])(?!.*[_. ]{2})[a-zA-Z0-9._ ]+(?<![_. ])$/;
  if(!nameRegex.test(name)){
    return "Name is not valid."
  }
}

const validateEmail = function(email){
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  if(!emailRegex.test(email)){
    return "Email is not valid."
  }
}

const validatePassword = function(password){
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  if(!passwordRegex.test(password)){
    return "Password is not valid."
  }
}

export {validateEmail,validateName,validatePassword}