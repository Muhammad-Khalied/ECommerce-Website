import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layout/additions/navbar/navbar.component";
import { FooterComponent } from "./layout/additions/footer/footer.component";
import { CartService } from './shared/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';
  platform = inject(PLATFORM_ID);
  
  constructor(private _cart:CartService){}
  ngOnInit(): void {
    if(isPlatformBrowser(this.platform)){
      if(localStorage.getItem('userTokwen') != null){
        this._cart.getCartProducts().subscribe({
          next:(res)=>{
            this._cart.cartItemsNumber.next(res.numOfCartItems);
            localStorage.setItem('cartItemsNumber', res.numOfCartItems);
          }
        })
      }
    }
  }
}
