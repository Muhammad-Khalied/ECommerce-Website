import { Component } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryItem, SubCategoryItem } from '../../../shared/interfaces/category';
import { LoadingComponent } from "../../additions/loading/loading.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categoryDone : boolean = false;
  subCategoryActive : boolean = false;
  categoryList : CategoryItem[] = [];
  subCategoryList : SubCategoryItem[] = [];
  subCategoryTitle : string = '';
  constructor(private _category: CategoryService) { }

  ngOnInit(): void {
    this.getAllCategories();
    localStorage.setItem('currentPage', 'category');
  }

  getAllCategories() {
    this._category.getCategories().subscribe({
        next: (response) => { 
          this.categoryList = response.data;
          this.categoryDone = true;
        },
        error: (error) => { 
          console.log(error);
          this.categoryDone = true;
        },
      });
  }

  getSubCategories(categoryId: string, title: string) {
    this.subCategoryActive = true;
    this._category.getSubcategoriesOfCategory(categoryId).subscribe({
      next: (response) => { 
        // console.log(response);
        this.subCategoryList = response.data;
        this.subCategoryTitle = title;
        this.subCategoryActive = false;
      },
      error: (error) => { 
        console.log(error);
        this.subCategoryActive = false;
      },
    });
  }

}
