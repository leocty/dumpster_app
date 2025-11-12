 import axios from "axios";
import { api } from "../lib/api"; 
import { BusinessExpenses } from "../types/BusinessExpenses";
export function useBusinessExpenses()  { 
    
  // CREATE
  const createBusinessExpenses = async (businessExpensesData:BusinessExpenses) => {
    try {
      const response : BusinessExpenses = (await api.post('/businessexpenses', businessExpensesData)).data;
      return response;
    } catch (error) {
        if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error create Business Expenses.');
    }
  };

  // READ
  const getBusinessExpenses = async (page = 1, limit = 10,searchTerm = '',searchField= '') => {
    try {
      const response = await api.get('/businessexpenses');
      let  allBusinessExpenses:BusinessExpenses[] = response.data;
      // Aplicar filtro de búsqueda si hay término
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allBusinessExpenses = allBusinessExpenses.filter(businessExpenses =>
         ((searchField=="all"||searchField=="date") && businessExpenses.date.toLowerCase().includes(term))||
         ((searchField=="all"||searchField=="beneficiary") && businessExpenses.beneficiary.toLowerCase().includes(term))|| 
         ((searchField=="all"||searchField=="invoice") && businessExpenses.invoice.toLowerCase().includes(term))|| 
         ((searchField=="all"||searchField=="paymentMethod") && businessExpenses.paymentMethod.toLowerCase().includes(term))||  
         ((searchField=="all"||searchField=="specificArea") && businessExpenses.specificArea.toLowerCase().includes(term))||  
         ((searchField=="all"||searchField=="description") && businessExpenses.description.toLowerCase().includes(term))
        );
      }
      // Paginación manual
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBusinessExpenses = allBusinessExpenses.slice(startIndex, endIndex);
      
      return {
        data: paginatedBusinessExpenses,
        total: allBusinessExpenses.length,
        page,
        limit,
        totalPages: Math.ceil(allBusinessExpenses.length / limit)
      };
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error getting Business Expenses.');
    }
  };

 const getBusinessExpensesById = async (id:number) => {
    try {
      const response = await api.get(`/businessexpenses/${id}`);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error getting Business Expenses.');
    }
  };

  // UPDATE
  const updateBusinessExpenses = async (id:number, businessExpensesData:BusinessExpenses) => {
    try {
      const response = await api.put(`/businessexpenses/${id}`, businessExpensesData);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error update Business Expenses.');
    }
  };

  // DELETE
  const deleteBusinessExpenses = async (id:number) => {
    try {
      const response = await api.delete(`/businessexpenses/${id}`);
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) 
      throw new Error(error.response?.data||error.message||'Error delete Business Expenses');
    }
  };

  return {createBusinessExpenses, getBusinessExpenses, getBusinessExpensesById, updateBusinessExpenses,deleteBusinessExpenses};
};