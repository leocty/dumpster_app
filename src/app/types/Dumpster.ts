export interface Dumpster {
  id: number;
  name: string;
  size: number;
  weight: number;
  description: string;
  dumpsterStatus:DumpsterStatus;
}

export interface DumpsterStatus {
  id: number;
  name: string; 
  colorCode:string;
  isActive:string;
  description: string;  
}