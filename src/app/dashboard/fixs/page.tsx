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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons'; 
import '@ant-design/v5-patch-for-react-19';
 
import { Fix } from '@/app/types/Fix';
import PaginationControls from '@/app/ui/components/PaginationControls';
import SearchControls from '@/app/ui/components/SearchControls';
import TextArea from 'antd/es/input/TextArea';
import { useFix } from '@/app/hooks/useFix';

const { Title } = Typography;

export default function FixPage() {
  const {createFix, getFixs, getFixById, updateFix,deleteFix} = useFix();
  const [Fixs, setFixs] = useState<Fix[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFix, setEditingFix] = useState<Fix>();
  const [form] = Form.useForm();
  const hasShown = useRef(false);

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalFixs, setTotalFixs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Obtener 
  const fetchFixs =async (page = currentPage, size = pageSize, search = searchTerm, field = searchField) => {
    setLoading(true);
     setIsSearching(!!search);
    try {
      const response = await getFixs(page, size, search,field);
      setFixs(response.data);
      setTotalFixs(response.total);
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
     { value: 'description', label: 'Description' }, 
  ];
    // Handler para búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a primera página al buscar
    fetchFixs(1, pageSize, value, searchField);
  };

  // Handler para cambiar campo de búsqueda
  const handleFieldChange = (value) => {
    setSearchField(value);
    if (searchTerm) {
      setCurrentPage(1);
      fetchFixs(1, pageSize, searchTerm, value);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setCurrentPage(1);
    fetchFixs(1, pageSize, '', 'all');
  };
  
  // Cambiar página
  const handlePageChange = (page:number, size:number) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchFixs(page, size);
  };

  // Cambiar tamaño de página
  const handleSizeChange = (size:number) => {
    setCurrentPage(1);  
    setPageSize(size);
    fetchFixs(1, size);
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchFixs(currentPage, pageSize);
  };

  useEffect(() => {
    fetchFixs();
  }, []);

  // Crear 
  const handleCreate = async (values:Fix) => {
    try {
      const newFix = await createFix(values);
      setFixs([...Fixs,newFix]); 

      message.success('Fix created successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Actualizar 
  const handleUpdate = async (values:Fix) => {
    try {
        if(editingFix){

      const updatedFix = await updateFix(editingFix.id, values);
      setFixs(Fixs.map(Fix => 
        Fix.id === editingFix.id ? { ...Fix, ...updatedFix } : Fix
      ));
      message.success('Fix update successfully');
      setModalVisible(false);
      setEditingFix(undefined);
      form.resetFields();}

    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Eliminar 
  const handleDelete =  async (id:number) => {
    try {
      await deleteFix(id);
      message.success('Fix delete successfully'); 
      if (Fixs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchFixs(currentPage - 1, pageSize);
      } else {
        fetchFixs(currentPage, pageSize);
      }
    } catch (error:eny) {
      message.error(error.message);
    }
  };

  // Abrir modal para editar
  const handleEdit = (Fix:Fix) => {
    setEditingFix(Fix);
    form.setFieldsValue(Fix);
    setModalVisible(true);
  };

  // Abrir modal para crear
  const handleAdd = () => {
    setEditingFix(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingFix(undefined);
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
      title: 'Custom Amount',
      dataIndex: 'customAmount',
      key: 'customAmount',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Land Fill Cost',
      dataIndex: 'landFillCost',
      key: 'landFillCost',
      sorter: (a, b) => a.id - b.id,      
    },
    {
      title: 'Tons Over Weight Amount',
      dataIndex: 'tonsOverWeightAmount',
      key: 'tonsOverWeightAmount',
     sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Days Over Time Amount',
      dataIndex: 'daysOverTimeAmount',
      key: 'daysOverTimeAmount',
     sorter: (a, b) => a.id - b.id
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
      render: (_:any, record:Fix) => (
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
            title="Are you sure you want to delete this Fix?"
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
         <Title level={2}>Fix Management</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SearchControls
          searchTerm={searchTerm}
          searchField={searchField}
          onSearch={handleSearch}
          onFieldChange={handleFieldChange}
          onClearSearch={handleClearSearch}
          loading={loading}
          searchFields={searchFields}
          totalResults={totalFixs}      
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
              New Fix
            </Button>
          </Space>
          </Card>
        </div>   
   
       <Table
          columns={columns}
          dataSource={Fixs}
          loading={loading}
          rowKey="id"
         pagination={false}
        />

         <PaginationControls
          current={currentPage}
          pageSize={pageSize}
          total={totalFixs}
          onChange={handlePageChange} 
          onSizeChange={handleSizeChange}
          showSizeChanger={true} 
         showTotal = {true}
        />
        <Modal
          title={editingFix ? 'Edit Fix' : 'New Fix'}
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingFix ? handleUpdate : handleCreate}
          >
            <Form.Item
              label="Custom Amount"
              name="customAmount"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber placeholder="Custom Amount" />
            </Form.Item>

            <Form.Item
              label="Land Fill Cost"
              name="landFillCost"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber placeholder="Land Fill Cost" />
            </Form.Item> 

            <Form.Item
              label="Tons Over Weight Amount"
              name="tonsOverWeightAmount"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber
              // formatter={value => `${value||0}%`}
              // parser={value =>{return value ? value.replace('%', '') : ''} }
               placeholder="Tons Over Weight Amount" />
            </Form.Item> 

            <Form.Item
              label="Days Over Time Amount"
              name="daysOverTimeAmount"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber
              
              // formatter={value => `${value||0}%`}
              // parser={value =>{return value ? value.replace('%', '') : ''} }
               placeholder="Days Over Time Amount" />
            </Form.Item>
              
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
                  {editingFix ? 'Update' : 'Add'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
