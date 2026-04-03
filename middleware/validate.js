const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errList = errors.array().map(e => ({
      field:   e.path,    // which field failed
      message: e.msg,     // why it failed
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:  errList,
    });
  }

  next(); 
};

module.exports = validate;