'use client'
import { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Card,
  Typography,
  Popconfirm, 
  ColorPicker,
  Spin,
  Tag,
  DatePicker,
  DatePickerProps,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons'; 
import '@ant-design/v5-patch-for-react-19';
import { useTransfer } from '@/app/hooks/useTransfer';
import { Driver, Transfer } from '@/app/types/Driver';
import PaginationControls from '@/app/ui/components/PaginationControls';
import SearchControls from '@/app/ui/components/SearchControls';
import TextArea from 'antd/es/input/TextArea';
import { useDriver } from '@/app/hooks/useDriver';
import EnumSelect from '@/app/ui/components/EnumSelect';
import { TransferStatus, TransferType } from '@/app/types/enums';
import { RangePickerProps } from 'antd/es/date-picker';
import FDatePicker from '@/app/ui/components/FDatePicker';
import SelectContract from '@/app/ui/components/SelectContract';
import { Contract } from '@/app/types/Contract';
 

const { Title } = Typography;

export default function TransferPage(props: { params: Promise<{ id: string }> }) {
  
  const {createDriver, getDrivers, getDriverById, updateDriver,deleteDriver} = useDriver();
  
  const {createTransfer, getTransfers, updateTransfer,deleteTransfer} = useTransfer();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer>();
  const [form] = Form.useForm();
  const hasShown = useRef(false);

 const [driver, setDriver] = useState<Driver>();
 const [driverID, setDriverID] = useState('');

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Obtener 
  const fetchTransforms =async (id= driverID,page = currentPage, size = pageSize, search = searchTerm, field = searchField) => {
    setLoading(true);
     setIsSearching(!!search);
    try {
      const response = await getTransfers(id,page, size, search,field);
      setTransfers(response.data);
      setTotalTransfers(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setPageSize(response.limit);
    } catch (error:any) {
       if (!hasShown.current) {
      hasShown.current = true
     message.error(error.message);
    }
    } finally {
      setLoading(false);
    }
  };

    const searchFields = [
    { value: 'all', label: 'All fields' },
    { value: 'contractString', label: 'Contract' }, 
     { value: 'driverName', label: 'Driver Name' },
    { value: 'paymentPercentage', label: 'Payment Percentage' },
    { value: 'transferDate', label: 'Transfer Date' },
    { value: 'transferType', label: 'Transfer Type' },
    { value: 'paymentStatus', label: 'Payment Status' },
    { value: 'Description', label: 'Description' },
  ];
 
  
    // Handler para búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a primera página al buscar
    fetchTransforms( driverID,1, pageSize, value, searchField);
  };

  // Handler para cambiar campo de búsqueda
  const handleFieldChange = (value) => {
    setSearchField(value);
    if (searchTerm) {
      setCurrentPage(1);
      fetchTransforms( driverID,1, pageSize, searchTerm, value);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setCurrentPage(1);
   fetchTransforms( driverID,1, pageSize, '', 'all');
  };
  
  // Cambiar página
  const handlePageChange = (page:number, size:number) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchTransforms( driverID,page, size);
  };

  // Cambiar tamaño de página
  const handleSizeChange = (size:number) => {
    setCurrentPage(1);  
    setPageSize(size);
    fetchTransforms( driverID,1, size);
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchTransforms( driverID,currentPage, pageSize);
  };

  useEffect(() => {
    async function fetchData() {

   const params = await props.params;
   const response = await  getDriverById(params.id); 
   setDriver(response)
   setDriverID(response.id)
  fetchTransforms(response.id);
  }
  fetchData();
    }, []);


  // Crear 
  const handleCreate = async (values:Transfer) => {
    try {
      values.driver=driver;
      values.transferDate=values.transferDate.format('YYYY-MM-DD').toString()
      const newTransfer = await createTransfer(values);
      setTransfers([...transfers,newTransfer]); 

      message.success('Transfer created successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Actualizar 
  const handleUpdate = async (values:Transfer) => {
    try {
        if(editingTransfer){
      values.driver=driver;
      values.transferDate=values.transferDate.format('YYYY-MM-DD').toString()
      const updatedTransfer = await updateTransfer(editingTransfer.id, values);
      setTransfers(transfers.map(Transfer => 
        Transfer.id === editingTransfer.id ? { ...Transfer, ...updatedTransfer } : Transfer
      ));
      message.success('Transfer update successfully');
      setModalVisible(false);
      setEditingTransfer(undefined);
      form.resetFields();}

    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Eliminar 
  const handleDelete =  async (id:number) => {
    try {
      await deleteTransfer(id);
      message.success('Transfer delete successfully'); 
      if (transfers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchTransforms(driverID,currentPage - 1, pageSize);
      } else {
        fetchTransforms(driverID,currentPage, pageSize);
      }
    } catch (error:eny) {
      message.error(error.message);
    }
  };

  // Abrir modal para editar
  const handleEdit = (Transfer:Transfer) => {
    setEditingTransfer(Transfer);
    form.setFieldsValue(Transfer);
    setModalVisible(true);
  };

  // Abrir modal para crear
  const handleAdd = () => {
    setEditingTransfer(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingTransfer(undefined);
    form.resetFields();
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Contract',
      dataIndex: 'contract',
      key: 'contract',  
             render: (contract:Contract) => (
              <Space direction="vertical" size={0}>
                <strong>{contract?.customer.name}</strong>
                <small style={{ color: '#666' }}>{contract?.workAddress.address}</small> 
                <small style={{ color: '#666' }}>{"Base payment - "+(contract.fixContract.fix.customAmount+contract.fixContract.fix.landFillCost)}</small>          
              </Space>
            )
    },
    {
      title: 'Payment Percentage',
      dataIndex: 'paymentPercentage',
      key: 'paymentPercentage', 
       render: (paymentPercentage:string) => (<strong>  {paymentPercentage} % </strong>) 
    },
    {
      title: 'Transfer Date',
      dataIndex: 'transferDate',
      key: 'transferDate',
      sorter: (a, b) => a.transferDate.localeCompare(b.transferDate),
    },
    {
      title: 'Transfer Type',
      dataIndex: 'transferType',
      key: 'transferType',
      sorter: (a, b) => a.transferType.localeCompare(b.transferType),
    }, 
    
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      sorter: (a, b) => a.paymentStatus.localeCompare(b.paymentStatus),
    }, 
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },    
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record:Transfer) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Detail
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this dumpster status?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="dashed"
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
          return <Spin 
                  size="large"
                  className="custom-spin"
                   style={{
                           position: 'absolute',
                           top: '50%',
                           left: '50%',
                           transform: 'translate(-50%, -50%)'
                          }}
                  />
        } 

    const TransferStatusLabels = {
    [TransferStatus.PAID]: 'Paid',
    [TransferStatus.IN_PROGRESS]: 'In progress',
    [TransferStatus.PENDING_PAYMENT]: 'Pending payment'
  };

  const TransferTypeLabels = {
    [TransferType.DELIVERY]: 'Delivery',
    [TransferType.COLLECTION]: 'Collection' 
  };


   
  return (
    <div style={{ padding: '24px' }}>
      <Card>
         <Title level={2}>Transfers {driver?.firstName}  Management</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SearchControls
          searchTerm={searchTerm}
          searchField={searchField}
          onSearch={handleSearch}
          onFieldChange={handleFieldChange}
          onClearSearch={handleClearSearch}
          loading={loading}
          searchFields={searchFields}
          totalResults={totalTransfers}      
      />
      <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fafafa' }}>
           <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Update
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              New Transfer
            </Button>
          </Space>
          </Card>
        </div>   
   
       <Table
          columns={columns}
          dataSource={transfers}
          loading={loading}
          rowKey="id"
         pagination={false}
        />

         <PaginationControls
          current={currentPage}
          pageSize={pageSize}
          total={totalTransfers}
          onChange={handlePageChange} 
          onSizeChange={handleSizeChange}
          showSizeChanger={true} 
         showTotal = {true}
        />
        <Modal
          title={editingTransfer ? 'Edit Transfer' : 'New Transfer'}
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingTransfer ? handleUpdate : handleCreate}
          >
            <Form.Item
              name="driver"
              hidden
            >
              <Input />
            </Form.Item>

              <Form.Item
              label="Contract"
              name="contract"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
               
          <SelectContract 
          onValueChange={(value) =>
              {
               
               form.setFieldsValue({
               contract: value,
              });
              }
            }
            editValue={editingTransfer?.id.toString()}/> 
        </Form.Item>

            <Form.Item
              label="Payment Percentage"
              name="paymentPercentage"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <Input placeholder="Payment Percentage" />
            </Form.Item>

            <Form.Item
              label="Transfer Date"
              name="transferDate"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
            <FDatePicker
                  showTime={false}
                  format="YYYY/MM/DD"
                  minDaysFromToday={0}
                  //onChange={date=>{ updateFormData('startDate', date? date.format('YYYY-MM-DD').toString():""); }}
              />
            </Form.Item>

              
            <Form.Item
             label="Transfer Type"
             name="transferType"            
             rules={[{ required: true, message: 'Please select an option' }]}
             >
               <EnumSelect
                 enumObj={TransferType}
                 labelMap={TransferTypeLabels}
                />
           </Form.Item>
            
           { editingTransfer &&(<Form.Item
             label="Payment Status"
             name="paymentStatus"            
             rules={[{ required: true, message: 'Please select an option' }]}
             >
               <EnumSelect
                 enumObj={TransferStatus}
                 labelMap={TransferStatusLabels}
                />
           </Form.Item>
           )}

            <Form.Item
              label="Description"
              name="description"
              rules={[ ]}
            >
             <TextArea rows={2} placeholder="Description" />
            </Form.Item>
            
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingTransfer ? 'Update' : 'Add'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
