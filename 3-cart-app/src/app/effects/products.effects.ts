import { Injectable } from "@angular/core";
import { ProductService } from "../services/product.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { findAll, load } from "../store/products.actions";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";

@Injectable()
export class ProductsEffects {
    loadProduct$;
    constructor(private actions$: Actions,
        private service: ProductService) { 
        
    this.loadProduct$ = createEffect(
        () => this.actions$.pipe(
            ofType(load),
            exhaustMap(() => this.service.findAll().pipe(
                map(products => (findAll({ products: products }))),
                catchError(() => EMPTY)
            ))
        )
    );
}



}