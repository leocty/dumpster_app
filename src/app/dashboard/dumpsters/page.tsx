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
  Select,
  Badge,
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
import { useDumpster } from '@/app/hooks/useDumpster';
import { Dumpster, DumpsterStatus } from '@/app/types/Dumpster';
import PaginationControls from '@/app/ui/components/PaginationControls';
import SearchControls from '@/app/ui/components/SearchControls';
import SelectDumsterStatus from '@/app/ui/components/SelectDumsterStatus';
import TextArea from 'antd/es/input/TextArea';

const { Title } = Typography;

export default function DumpsterPage() {
  const {createDumpster, getDumpsters, getDumpstersById, updateDumpster,deleteDumpster} = useDumpster();
  const [dumpsters, setDumpsters] = useState<Dumpster[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDumpster, setEditingDumpster] = useState<Dumpster>();
  
  
  const [form] = Form.useForm();
  const hasShown = useRef(false);

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalDumpsters, setTotalDumpsters] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Obtener 
  const fetchDumpsters =async (page = currentPage, size = pageSize, search = searchTerm, field = searchField) => {
    setLoading(true);
     setIsSearching(!!search);
    try {
      const response = await getDumpsters(page, size, search,field);
      setDumpsters(response.data);
      setTotalDumpsters(response.total);
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
    { value: 'size', label: 'Size' },
    { value: 'weight', label: 'Weight' },
    { value: 'name', label: 'Name' },
    { value: 'dumpsterStatus', label: 'Dumpster Status' },
    { value: 'description', label: 'Description' }, 
  ];
    // Handler para búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a primera página al buscar
    fetchDumpsters(1, pageSize, value, searchField);
  };

  // Handler para cambiar campo de búsqueda
  const handleFieldChange = (value) => {
    setSearchField(value);
    if (searchTerm) {
      setCurrentPage(1);
      fetchDumpsters(1, pageSize, searchTerm, value);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setCurrentPage(1);
    fetchDumpsters(1, pageSize, '', 'all');
  };
  
  // Cambiar página
  const handlePageChange = (page:number, size:number) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchDumpsters(page, size);
  };

  // Cambiar tamaño de página
  const handleSizeChange = (size:number) => {
    setCurrentPage(1);  
    setPageSize(size);
    fetchDumpsters(1, size);
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchDumpsters(currentPage, pageSize);
  };

  useEffect(() => {
    setLoading(true)
    fetchDumpsters();
  }, []);

  // Crear 
  const handleCreate = async (values:Dumpster) => {
    try {
      const newDumpster = await createDumpster(values);
      setDumpsters([...dumpsters,newDumpster]); 

      message.success('Dumpster created successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Actualizar 
  const handleUpdate = async (values:Dumpster) => {
    try {
        if(editingDumpster){

      const updatedDumpster = await updateDumpster(editingDumpster.id, values);
      setDumpsters(dumpsters.map(dumpster => 
        dumpster.id === editingDumpster.id ? { ...dumpster, ...updatedDumpster } : dumpster
      ));
      message.success('Dumpster update successfully');
      setModalVisible(false);
      setEditingDumpster(undefined);
      form.resetFields();}

    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Eliminar 
  const handleDelete =  async (id:number) => {
    try {
      await deleteDumpster(id);
      message.success('Dumpster delete successfully'); 
      if (dumpsters.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchDumpsters(currentPage - 1, pageSize);
      } else {
        fetchDumpsters(currentPage, pageSize);
      }
    } catch (error:eny) {
      message.error(error.message);
    }
  };

  // Abrir modal para editar
  const handleEdit = (dumpster:Dumpster) => {
    setEditingDumpster(dumpster);
    form.setFieldsValue(dumpster);
    setModalVisible(true);
  };

  // Abrir modal para crear
  const handleAdd = () => {
    setEditingDumpster(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingDumpster(undefined);
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
      title: 'Name',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      sorter: (a, b) =>  a.name.localeCompare(b.name),
    }, 
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      sorter: (a, b) =>  a.id - b.id,
    },
     {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      sorter: (a, b) =>  a.id - b.id,
    },
       
    {
      title: 'Dumpster Status',
      dataIndex: 'dumpsterStatus',
      key: 'dumpsterStatus',
        render: (dumpsterStatus:DumpsterStatus) => ( 
               <Tag color={dumpsterStatus.colorCode} key={dumpsterStatus.name}>
              {dumpsterStatus.name.toUpperCase()}
            </Tag>
            ) 
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) =>  a.description.localeCompare(b.description),
    },    
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record:Dumpster) => (
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
            title="Are you sure you want to delete this dumpster?"
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
         <Title level={2}>Dumpster Management</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
         
           <SearchControls
          searchTerm={searchTerm}
          searchField={searchField}
          onSearch={handleSearch}
          onFieldChange={handleFieldChange}
          onClearSearch={handleClearSearch}
          loading={loading}
          searchFields={searchFields}
          totalResults={totalDumpsters}      
      />
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
              New Dumpster
            </Button>
          </Space>
        </div>   
   
       <Table
          columns={columns}
          dataSource={dumpsters}
          loading={loading}
          rowKey="id"
         pagination={false}
        />

         <PaginationControls
          current={currentPage}
          pageSize={pageSize}
          total={totalDumpsters}
          onChange={handlePageChange} 
          onSizeChange={handleSizeChange}
          showSizeChanger={true} 
         showTotal = {true}
        />
        <Modal
          title={editingDumpster ? 'Edit Dumpster' : 'New Dumpster'}
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingDumpster ? handleUpdate : handleCreate}
          >
            <Form.Item
              label="Size"
              name="size"
              rules={[{ required: true, message: 'Please enter dumpster size' }]}
            >
               
          <Select>
            <Select.Option value="15">15</Select.Option>
            <Select.Option value="20">20</Select.Option>
            <Select.Option value="25">25</Select.Option>
          </Select>
        </Form.Item>

         {/*  <Form.Item
              label="Weight"
              name="weight"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber
                placeholder="Weight" />
            </Form.Item> */}

            <Form.Item
              label=" Name"
              name="serialNumber"
              rules={[{ required: true, message: 'Please enter dumpster id' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>

             <Form.Item
              label="Dumster Status"
              name="dumpsterStatus"
              rules={[{ required: true, message: 'Please enter dumpster status' }]}
            >
               
          <SelectDumsterStatus onValueChange={(value) =>
              {
               
               form.setFieldsValue({
               dumpsterStatus: value,
              });
              }
            }
            editValue={editingDumpster?.id.toString()}/> 
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
                  {editingDumpster ? 'Update' : 'Add'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
