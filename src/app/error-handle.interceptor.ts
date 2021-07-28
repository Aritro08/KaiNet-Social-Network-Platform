import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occured.';
                if (error.error instanceof ErrorEvent) {
                    errorMessage = `${error.error.message}`;
                } else {
                    errorMessage = `${error.status} - ${error.error.message}`;
                }
                this.dialog.open(ErrorComponent, {data: {message : errorMessage}});
                return throwError(errorMessage);
            })
        )
    }
}