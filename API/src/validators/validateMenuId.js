import { isPositiveInteger } from './HelperValidators';

const validateMenuId = (request, response, next) => {
  if (!isPositiveInteger(request.params.menuId)) {
    response.status(400);
    return response.json({
      status: 400,
      message: 'Invalid params type'
    });
  }

  return next();
};

export default validateMenuId;
