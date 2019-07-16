module.exports = {
  emailValidator: email => {
    return (/\S+@\S+\.\S+/).test(email)
  }
};