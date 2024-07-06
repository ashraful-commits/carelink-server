// export const errorHandler = (error, req, res, next) => {
//   const status = res.statusCode ? res.statusCode : 500;
//   res.status(status).json({ message: error.message });
// };
export const errorHandler = (error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "unknown error";
  return res.status(errorStatus).json({
    message: errorMessage,
    status: errorStatus,
    stack: error.stack,
    name: error.name,
  });
};
