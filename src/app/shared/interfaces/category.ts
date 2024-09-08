export interface CategoryItem {
    _id:       string;
    name:      string;
    slug:      string;
    image:     string;
    createdAt: Date;
    updatedAt: Date;
}


export interface SubCategoryItem {
    _id:       string;
    name:      string;
    slug:      string;
    category:  string;
    createdAt: Date;
    updatedAt: Date;
}
