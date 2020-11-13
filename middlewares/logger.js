const Logger = require('../models/errorLog');

exports.logError = async function(level, body, error) {
  let newLog = new Logger({
    error: JSON.stringify(error),
    body: JSON.stringify(body),
    level
  });

  try {
    await newLog.save();
  } catch (error) {
    console.log(error);
  }
}
