import { Customer, WorkAddress } from "./Customer";
import { Dumpster } from "./Dumpster";
import { Fix } from "./Fix";

export interface Contract {
    id:number;
    customer:Customer;
    workAddress:WorkAddress;
    dumpster:Dumpster;
    fixContract:FixContract;
    startDate:string;
    endDate:string;
    removalDate:string;
    contractStatus:string;
    contractPaymentStatus:string;
    description:string;
}
 
 export interface FixContract {
    id:number;
    fix:Fix;
    contractId:number;
    paymentCustomAmount:number;
    madePaymentCustomAmount:boolean;
    paymentLandFillCost:number;
    madePaymentLandFillCost:boolean;
    paymentTonsOverWeightAmount:number;
    madePaymentTonsOverWeightAmount:boolean;
    paymentDaysOverTimeAmount:number;
    madePaymentDaysOverTimeAmount:boolean;
    description:string;    
}
  