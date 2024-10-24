import { Routes } from '@angular/router';
import { HomeComponent } from './layout/pages/home/home.component';
import { CartComponent } from './layout/pages/cart/cart.component';
import { BrandComponent } from './layout/pages/brand/brand.component';
import { ProductsComponent } from './layout/pages/products/products.component';
import { CategoriesComponent } from './layout/pages/categories/categories.component';
import { LoginComponent } from './layout/pages/login/login.component';
import { RegisterComponent } from './layout/pages/register/register.component';
import { NotFoundComponent } from './layout/additions/not-found/not-found.component';
import { ProductDetailsComponent } from './layout/additions/product-details/product-details.component';
import { CheckoutComponent } from './layout/pages/checkout/checkout.component';
import { AllordersComponent } from './layout/pages/allorders/allorders.component';
import { WishlistComponent } from './layout/pages/wishlist/wishlist.component';
import { enterGuard } from './shared/guard/enter.guard';
import { ForgetPasswordComponent } from './layout/pages/forget-password/forget-password.component';
import { cartGuard } from './shared/guard/cart.guard';


export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, title: 'Home'},
    {path: 'productDetails/:id', component: ProductDetailsComponent, title: 'Details'},
    {path: 'cart', component: CartComponent, title: 'Cart'},
    {path: 'brands', component: BrandComponent, title: 'Brands'},
    {path: 'products', component: ProductsComponent, title: 'Products'},
    {path: 'category', component: CategoriesComponent, title: 'Categories'},
    {path: 'checkout', component: CheckoutComponent, title: 'Checkout', canActivate: [cartGuard]},
    {path: 'wishlist', component: WishlistComponent, title: 'Wish List'},
    {path: 'allorders', component: AllordersComponent, title: 'All Orders'},
    {path: 'login', component: LoginComponent, title: 'Login', canActivate: [enterGuard]},
    {path: 'forgetPassword', component: ForgetPasswordComponent, title: 'Forget Password'},
    {path: 'register', component: RegisterComponent, title: 'Register', canActivate: [enterGuard]},
    {path: '**', component: NotFoundComponent, title: 'Not Found'},
    
];
