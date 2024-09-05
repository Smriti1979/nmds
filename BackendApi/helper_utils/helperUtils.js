

function hasSpecialCharacters(inputString) {
  // Define a regular expression pattern to match any of the specified special characters
  let regex = /@/;

  // Test the string against the regular expression
  return regex.test(inputString);
}
  



function checkSpecialCharter(inputString) {
  console.log("string",inputString)
  // Define a regular expression pattern to match any of the specified special characters
  const regex = /[!#$%^&*()+\=\[\]{};':"\\|,<>\/?]+/;

  // Test the string against the regular expression
  return regex.test(inputString);
}



function checkValidEmail(inputString) {
  // Define a regular expression pattern to match any of the specified special characters
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailRegex.test(inputString)) {
    return true;
} else {
  return false;
}

}
  

  module.exports = {
    hasSpecialCharacters: hasSpecialCharacters,
    checkSpecialCharter: checkSpecialCharter,
    checkValidEmail: checkValidEmail
  };