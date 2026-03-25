function validate(schema) {
  return (req, res, next) => {
    let result;

    if (schema && typeof schema.validate === 'function') {
      const validation = schema.validate(req.body, { abortEarly: false });
      result = {
        value: validation.value,
        errors: validation.error
          ? validation.error.details.map((detail) => ({
              message: detail.message,
              field: detail.path?.[0]
            }))
          : []
      };
    } else {
      result = typeof schema === 'function' ? schema(req.body, req) : { value: req.body };
    }

    const errors = result && Array.isArray(result.errors) ? result.errors : [];

    if (errors.length > 0) {
      const firstError = errors[0];
      return res.status(400).json({
        message: firstError.message,
        ...(firstError.field ? { field: firstError.field } : {})
      });
    }

    if (result && result.value) {
      req.body = result.value;
    }

    return next();
  };
}

module.exports = validate;
