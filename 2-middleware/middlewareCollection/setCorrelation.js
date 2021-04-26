module.exports = () => {
  return (req, res, next) => {
    const CORRELATION_TOKEN = "x-correlation-id";
    let correlationId = req.headers[CORRELATION_TOKEN];

    if (!correlationId) {
      correlationId = Date.now().toString();
      req.headers[CORRELATION_TOKEN] = correlationId;
      console.log("correlationId", correlationId);
    }
    res.set(CORRELATION_TOKEN, correlationId);

    return next();
  };
};
