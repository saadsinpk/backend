const fast2sms = require("fast-two-sms");

exports.fast2sms = async ({ message, contactNumber }, next) => {
  try {
    console.log('message', contactNumber)
    const res = await fast2sms.sendMessage({
      authorization: process.env.FAST2SMS,
      message,
      numbers: [contactNumber],
    },);
    console.log(res);
  } catch (error) {
    next(error);
  }
};
