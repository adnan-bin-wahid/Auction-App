import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiRequestInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api')) {
    return next(request);
  }

  const apiRequest = request.clone({
    setHeaders: {
      Accept: 'text/plain',
    },
  });

  return next(apiRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.error instanceof ErrorEvent
          ? error.error.message
          : error.error?.message || error.message || 'Request failed.';

      return throwError(() => new Error(message));
    }),
  );
};
