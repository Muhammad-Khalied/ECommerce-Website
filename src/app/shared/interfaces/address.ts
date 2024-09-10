export interface ShippingDetails {
    shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
    details: string;
    phone:   string;
    city:    string;
}
