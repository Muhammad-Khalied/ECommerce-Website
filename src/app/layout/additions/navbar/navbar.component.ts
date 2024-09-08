import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { FlowbiteService } from '../../../shared/services/flowbite.service';

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
    localStorage.removeItem('userToken');
    this._auth.userData.next(null);
    this._router.navigate(['/login']);
  }

}
