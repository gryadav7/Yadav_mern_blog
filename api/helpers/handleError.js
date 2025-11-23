// export const handleError = (status) =>{
//     const error = new Error
//     error.statusCode = statusCode
//     error.message = message
//     return error
// }


export const handleError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
