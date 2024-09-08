import { Component } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { Category } from '../../../shared/interfaces/product';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss'
})
export class CategorySliderComponent {

  categoryList!: Category[];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  constructor(private _categories:ProductService) { }
  
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this._categories.getCategories().subscribe({
        next: (response) => { 
          this.categoryList = response.data;
          this._categories.setCategoriesDone(true);
        },
        error: (error) => { 
          console.log(error);
          this._categories.setCategoriesDone(true);
        },
      });
  }


}
