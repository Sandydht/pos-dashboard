import { HttpInterceptorFn } from '@angular/common/http';

export const publicInterceptor: HttpInterceptorFn = (req, next) => {
  const publicReq = req.clone({
    setHeaders: {
      'X-App-Version': '1.0.0',
    },
  });

  return next(publicReq);
};
