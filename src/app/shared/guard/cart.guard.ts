import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';

export const cartGuard: CanActivateFn = (route, state) => {
  let _router = inject(Router);
  let platForm = inject(PLATFORM_ID);
  let cart = inject(CartService);

  if(isPlatformBrowser(platForm)){
    if(cart.cartItemsNumber.value == 0){
      _router.navigate([`/${localStorage.getItem('currentPage')}`]);
      return false;
    }
    else{
      return true;
    }
  }
  else{
    return false;
  }
};







