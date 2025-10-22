import { useState, useEffect } from 'react';
import { Contract } from '../types/Contract';
import { api } from '../lib/api';
import axios from 'axios';

export const useSelectContract = () => {
  const [contracts, setContracts] = useState([]);  
  const [contractMap, setContractMap] = useState(new Map());    
  const [loading, setLoading] = useState(false);


 
  const fetchContract = async () => {
    setLoading(true);
    try {
       const response = await api.get('/contract');       
      setContracts(response.data);


       const newMap = new Map();
      response.data.forEach((item:Contract) => {
        newMap.set(item.id.toString(), item);
      });    
      
      setContractMap(newMap);
 
    } catch (error) {
       if (axios.isAxiosError(error)) 
      console.error(error.response?.data||error.message||'Error fetching contract:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const getObjectById = (id:number) => {    
    return contractMap.get(id.toString());
  };

    useEffect(() => {
    fetchContract();
  }, []);

  return {
    contracts,  
    contractMap,    
    loading,
    fetchContract,
    getObjectById
  };
};