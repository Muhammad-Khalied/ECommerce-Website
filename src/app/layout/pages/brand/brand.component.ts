import { Brand } from './../../../shared/interfaces/cart-product';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { BrandService } from '../../../shared/services/brand.service';
import { BrandItem } from '../../../shared/interfaces/brand';
import { LoadingComponent } from "../../additions/loading/loading.component";
import { get } from 'http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent {
  brandList : BrandItem[] = [];
  brandDone : boolean = false;
  brandLoading : boolean = false;
  brandDetails!: BrandItem ;
  platform = inject(PLATFORM_ID);

  constructor(private _brand: BrandService) { }

  ngOnInit(): void {
    this.getAllBrands();
    if(isPlatformBrowser(this.platform))
      localStorage.setItem('currentPage', 'brand');
  }

  getAllBrands() {
    this._brand.getBrands().subscribe({
      next: (response) => {
        // console.log(response);
        this.brandList = response.data;
        this.brandDone = true;
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  getSpecificBrand(id: string) {
    this.brandLoading = true;
    this._brand.getSpecificBrand(id).subscribe({
      next: (response) => {
        this.brandLoading = false;
        this.brandDetails = response.data;
        this.showModal();
      },
      error: (error) => {
        console.log(error);
        this.brandLoading = false;
      },
    })
  }

  showModal() {
    var modal = document.getElementById("my-model");
    if (modal) {
      modal.style.display = "block";  // Ensure modal is visible
      setTimeout(() => {
        if(modal)
        {
          modal.classList.add("show");
          modal.classList.add("bg-shade");
        }
      }, 10); // Small delay to ensure transition is applied
    }
  }
  
  hideModal() {
    var modal = document.getElementById("my-model");
    if (modal) {
      modal.classList.remove("show");
      modal.classList.remove("bg-shade");
      // Delay changing the display property until after the transition ends
      setTimeout(() => {
        if(modal)
          modal.style.display = "none";
      }, 500);  // Duration should match the CSS transition time (0.5s)
    }
  }
  


}
