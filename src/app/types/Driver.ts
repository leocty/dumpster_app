import { Contract } from "./Contract";

export interface Driver {
  id: number;
  firstName: string; 
  lastName:string;
  licenseNumber:string; 
  licenseType:string; 
  phone:string; 
  email:string; 
  isActive:boolean;  
  Transfers: Transfer[];
}
 
export interface Transfer {
  id: number;
  contract: Contract;
  driver: Driver;
  paymentPercentage: number;
  transferDate:string;
  transferType:string; 
  paymentStatus:string; 
  description:string;   
}
 