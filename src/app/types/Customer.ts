export interface Customer {
  id: number;
  name: string;
  taxId: string;
  homeAddress: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  zipCode: string;
  description: string;
  workAddress: WorkAddress[];
}
export interface WorkAddress {
  id: number;
  addressName: string; 
  address: string; 
  addressCity: string; 
  addressState: string; 
  addressZipCode: string; 
  contactName: string; 
  contactPhone: string; 
  latitude: number; 
  longitude: number; 
  customerId:string
}
 
  