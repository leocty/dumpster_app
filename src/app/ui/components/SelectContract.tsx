import { Select } from 'antd'; 
import { useSelectContract } from '@/app/hooks/useSelectContract';

const SelectContract = ({ onValueChange }) => {
  const {
     contracts,     
    loading,
    fetchContract,
    getObjectById
  } = useSelectContract();

  
    const finalOptions = contracts.length > 0 ? contracts :  [];
     
     const handleChange = (value) => {  
       
      if (onValueChange) {       
      onValueChange(getObjectById(value));
        }
      };


  return (
    <Select
      style={{ width: 200 }}
      placeholder="Selec Contract"
      loading={loading}
      options={finalOptions.map(option => ({
        value: option.id.toString(),
        label: option.customer.name +"-"+ (option.fixContract.fix.customAmount+option.fixContract.fix.landFillCost)
      }))}
      filterOption={false} // Pasando método del hook
      onChange={handleChange}      
      showSearch
      allowClear
    />
  );
};

export default SelectContract;