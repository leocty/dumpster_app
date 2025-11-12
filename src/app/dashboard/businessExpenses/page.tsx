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
  InputNumber,
  DatePicker,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons'; 
import '@ant-design/v5-patch-for-react-19';
 
import { BusinessExpenses } from '@/app/types/BusinessExpenses';
import PaginationControls from '@/app/ui/components/PaginationControls';
import SearchControls from '@/app/ui/components/SearchControls';
import TextArea from 'antd/es/input/TextArea';
import { useBusinessExpenses } from '@/app/hooks/useBusinessExpenses';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function BusinessExpensesPage() {
  const {createBusinessExpenses, getBusinessExpenses, getBusinessExpensesById, updateBusinessExpenses,deleteBusinessExpenses} = useBusinessExpenses();
  const [businessExpenses, setBusinessExpenses] = useState<BusinessExpenses[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBusinessExpenses, setEditingBusinessExpenses] = useState<BusinessExpenses>();
  const [form] = Form.useForm();
  const hasShown = useRef(false);

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalBusinessExpenses, setTotalBusinessExpenses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Obtener 
  const fetchBusinessExpenses =async (page = currentPage, size = pageSize, search = searchTerm, field = searchField) => {
    setLoading(true);
     setIsSearching(!!search);
    try {
      const response = await getBusinessExpenses(page, size, search,field);
      setBusinessExpenses(response.data);
      setTotalBusinessExpenses(response.total);
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
     { value: 'date', label: 'Date' }, 
      { value: 'beneficiary', label: 'Beneficiary' }, 
       { value: 'invoice', label: 'Invoice' }, 
        { value: 'paymentMethod', label: 'Payment Method' }, 
         { value: 'specificArea', label: 'Specific Area' }, 
         { value: 'description', label: 'Description' }, 
  ];
    // Handler para búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a primera página al buscar
    fetchBusinessExpenses(1, pageSize, value, searchField);
  };

  // Handler para cambiar campo de búsqueda
  const handleFieldChange = (value) => {
    setSearchField(value);
    if (searchTerm) {
      setCurrentPage(1);
      fetchBusinessExpenses(1, pageSize, searchTerm, value);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setCurrentPage(1);
    fetchBusinessExpenses(1, pageSize, '', 'all');
  };
  
  // Cambiar página
  const handlePageChange = (page:number, size:number) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchBusinessExpenses(page, size);
  };

  // Cambiar tamaño de página
  const handleSizeChange = (size:number) => {
    setCurrentPage(1);  
    setPageSize(size);
    fetchBusinessExpenses(1, size);
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchBusinessExpenses(currentPage, pageSize);
  };

  useEffect(() => {
    fetchBusinessExpenses();
  }, []);

  // Crear 
  const handleCreate = async (values:BusinessExpenses) => {
    values.date=values.date.format("YYYY-MM-DD HH:mm:ss").toString()
    try {
      const newBusinessExpenses = await createBusinessExpenses(values);
      setBusinessExpenses([...businessExpenses,newBusinessExpenses]); 

      message.success('Business Expenses created successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Actualizar 
  const handleUpdate = async (values:BusinessExpenses) => {
    values.date=values.date.format("YYYY-MM-DD HH:mm:ss").toString()
    try {
        if(editingBusinessExpenses){

      const updatedBusinessExpenses = await updateBusinessExpenses(editingBusinessExpenses.id, values);
      setBusinessExpenses(businessExpenses.map(BusinessExpenses => 
        BusinessExpenses.id === editingBusinessExpenses.id ? { ...BusinessExpenses, ...updatedBusinessExpenses } : BusinessExpenses
      ));
      message.success('Business Expenses update successfully');
      setModalVisible(false);
      setEditingBusinessExpenses(undefined);
      form.resetFields();}

    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Eliminar 
  const handleDelete =  async (id:number) => {
    try {
      await deleteBusinessExpenses(id);
      message.success('Business Expenses delete successfully'); 
      if (businessExpenses.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchBusinessExpenses(currentPage - 1, pageSize);
      } else {
        fetchBusinessExpenses(currentPage, pageSize);
      }
    } catch (error:eny) {
      message.error(error.message);
    }
  };

  // Abrir modal para editar
  const handleEdit = (BusinessExpenses:BusinessExpenses) => {
    
    setEditingBusinessExpenses(BusinessExpenses);
    
    form.setFieldsValue({
        date: dayjs(BusinessExpenses.date),
        totalAmount: BusinessExpenses.totalAmount,
        beneficiary: BusinessExpenses.beneficiary, 
        invoice: BusinessExpenses.invoice, 
        paymentMethod: BusinessExpenses.paymentMethod, 
        specificArea: BusinessExpenses.specificArea,
        description: BusinessExpenses.description 
      });
    setModalVisible(true);
  };

  // Abrir modal para crear
  const handleAdd = () => {
    setEditingBusinessExpenses(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingBusinessExpenses(undefined);
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
     sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    sorter: (a, b) => a.description.localeCompare(b.description),   
    },
    {
      title: 'Specific Area',
      dataIndex: 'specificArea',
      key: 'specificArea',
     sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Beneficiary',
      dataIndex: 'beneficiary',
      key: 'beneficiary',
    sorter: (a, b) => a.description.localeCompare(b.description),
    },    
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
    sorter: (a, b) => a.description.localeCompare(b.description),
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
      render: (_:any, record:BusinessExpenses) => (
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
            title="Are you sure you want to delete this Business Expenses?"
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
  return (
    <div style={{ padding: '24px' }}>
      <Card>
         <Title level={2}>Business Expenses Management</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SearchControls
          searchTerm={searchTerm}
          searchField={searchField}
          onSearch={handleSearch}
          onFieldChange={handleFieldChange}
          onClearSearch={handleClearSearch}
          loading={loading}
          searchFields={searchFields}
          totalResults={totalBusinessExpenses}      
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
              New Business Expenses
            </Button>
          </Space>
          </Card>
        </div>   
   
       <Table
          columns={columns}
          dataSource={businessExpenses}
          loading={loading}
          rowKey="id"
         pagination={false}
        />

         <PaginationControls
          current={currentPage}
          pageSize={pageSize}
          total={totalBusinessExpenses}
          onChange={handlePageChange} 
          onSizeChange={handleSizeChange}
          showSizeChanger={true} 
         showTotal = {true}
        />
        <Modal
          title={editingBusinessExpenses ? 'Edit Business Expenses' : 'New Business Expenses'}
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingBusinessExpenses ? handleUpdate : handleCreate}
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
             <DatePicker  format="YYYY-MM-DD HH:mm:ss" showTime  />
            </Form.Item>

            <Form.Item
              label="Total Amount"
              name="totalAmount"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber placeholder="Total Amountt" />
            </Form.Item> 

            <Form.Item
              label="Payment Method"
              name="paymentMethod"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <Select>
              <Select.Option value="CASH">Cash</Select.Option>
              <Select.Option value="BANK_TRANSFER">Bank Transfer</Select.Option>
              <Select.Option value="CREDIT_DEBIT_CARD">Card</Select.Option>
              <Select.Option value="CHECK">Check</Select.Option>  
              <Select.Option value="OTHERS">Others</Select.Option>             
              </Select>
            </Form.Item> 

             <Form.Item
              label="Specific Area"
              name="specificArea"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <Input placeholder="Specific Area" />
            </Form.Item> 

            <Form.Item
              label="Beneficiary"
              name="beneficiary"
              rules={[]}
            >
              <Input placeholder="Beneficiary" />
            </Form.Item> 
            <Form.Item
              label="Invoice"
              name="invoice"
              rules={[]}
            >
              <Input placeholder="Invoice" />
            </Form.Item> 
            
            <Form.Item
              label="Description"
              name="description"
              rules={[ { required: true, message: 'Please enter this field' }]}
            >
             <TextArea rows={2} placeholder="Description" />
            </Form.Item>
            
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingBusinessExpenses ? 'Update' : 'Add'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
