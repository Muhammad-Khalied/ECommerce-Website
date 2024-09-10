import { AuthService } from './../../../shared/services/auth.service';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { FlowbiteService } from '../../../shared/services/flowbite.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {
  isLogin: boolean = false;
  cartItemsNumber! : number;
  platform = inject(PLATFORM_ID);
  constructor(private _auth: AuthService, private _router: Router, private _cart: CartService, private flowbiteService: FlowbiteService) { }



  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
      });

    this._cart.cartItemsNumber.subscribe({
      next:(res)=>{
        this.cartItemsNumber = res;
      }
    })

    this._auth.userData.subscribe(() => {
      if (this._auth.userData.getValue() == null) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    });
  }

  logout(){
    if(isPlatformBrowser(this.platform)){
      localStorage?.removeItem('userToken');
      localStorage?.removeItem('pageNumber');
    }
    this._auth.userData.next(null);
    this._router.navigate(['/login']);
  }

}
