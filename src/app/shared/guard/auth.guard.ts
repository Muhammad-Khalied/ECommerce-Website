import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  let _router = inject(Router);
  let platForm = inject(PLATFORM_ID);

  if(isPlatformBrowser(platForm)){
    if(localStorage.getItem('userToken') == null){
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
