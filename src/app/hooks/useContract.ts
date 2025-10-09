 import axios from "axios";
import { api } from "../lib/api";
import { Customer, WorkAddress } from "../types/Customer";
import { constants } from "buffer";
import { Dumpster } from "../types/Dumpster";
import { Fix } from "../types/Fix";
import { Contract } from "../types/Contract";

export function useContract()  { 
    

 const getContractCreate = async () => {
    try {
      const responseCustomer = await api.get('/customers');
      const allCustomers:Customer[] = responseCustomer.data;
      
     const responseDumpster = await api.get('/dumpsters');
     const  allDumpsters:Dumpster[] = responseDumpster.data;
      
     const responseFix = await api.get('/fix');
      const  allFixs:Fix[] = responseFix.data;

      return {
          allCustomers: allCustomers,
          allDumpsters: allDumpsters,
          allFixs: allFixs,
       };

    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error getting Data');
    }
  };



  // CREATE
  const createContract = async (customersData:any) => {
    try {
      const response  = (await api.post('/contract', customersData)).data;
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error create contract');
    }
  };
 
   const editContractsPayments = async (data:any) => {
    try {
      const response = await api.post(`/contract/editpayments`, data);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error update contract');
    }
  };
  const editContractsData = async (data:any) => {
    try {
      const response = await api.post(`/contract/editdata`, data);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error update contract');
    }
  };

  // READ
  const getContracts = async (page = 1, limit = 10,searchTerm = '',searchField= '') => {
    try {
      const response = await api.get('/contract');
      let  allContracts:Contract[] = response.data;
      // Aplicar filtro de búsqueda si hay término
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allContracts = allContracts.filter(contract =>
          ((searchField=="all"||searchField=="Customer name") && contract.customer.name.toLowerCase().includes(term)) ||
          ((searchField=="all"||searchField=="Work Address Name") && contract.workAddress.addressName.toLowerCase().includes(term)) ||
          ((searchField=="all"||searchField=="Dumpster Name") && contract.dumpster.name.toLowerCase().includes(term)) ||
          ((searchField=="all"||searchField=="Fix Description") && contract.fixContract.fix.description.toLowerCase().includes(term)) ||
          ((searchField=="all"||searchField=="Contract Status") && contract.contractStatus.toLowerCase().includes(term)) ||
        ((searchField=="all"||searchField=="Contract Payment Status") && contract.contractPaymentStatus.toLowerCase().includes(term))||
      ((searchField=="all"||searchField=="Description") && contract.description.toLowerCase().includes(term)));
      
      }
      // Paginación manual
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCustomer = allContracts.slice(startIndex, endIndex);
      
      return {
        data: paginatedCustomer,
        total: allContracts.length,
        page,
        limit,
        totalPages: Math.ceil(allContracts.length / limit)
      };
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error getting contracts');
    }
  };

 const getCustomersById = async (id:number) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error getting customers');
    }
  };

  // UPDATE
  const updateCustomer = async (id:number, CustomersData:Customer) => {
    try {
      const response = await api.put(`/customers/${id}`, CustomersData);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error update customers');
    }
  };

  // DELETE
  const deleteCustomer = async (id:number) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error delete customers');
    }
  };

  const deleteWorkAddress = async (id:number) => {
    try {
      const response = await api.delete(`/customers/workaddress/${id}`);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error delete Work Address');
    }
  };

  return {getContractCreate,createContract,getContracts,editContractsPayments,editContractsData};
};