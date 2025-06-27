import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem("token")

  if(token) {
    const cloneRequete = req.clone(
      {setHeaders : {"Authorization" : token}})
    return next(cloneRequete);
  }

  return next(req);
};