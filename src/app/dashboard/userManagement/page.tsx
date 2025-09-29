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
  notification,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons'; 
import '@ant-design/v5-patch-for-react-19';
import { useUserManagement } from '@/app/hooks/useUserManagement';
import { User } from '@/app/types/User';
import PaginationControls from '@/app/ui/components/PaginationControls';
import SearchControls from '@/app/ui/components/SearchControls';

const { Title } = Typography;

export default function UserManagementPage() {
  const {createUser, getUsers, getUsersById, updateUser,deleteUser} = useUserManagement();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User>();
  const [form] = Form.useForm();
  const hasShown = useRef(false);

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Obtener usuarios
  const fetchUsers =async (page = currentPage, size = pageSize, search = searchTerm, field = searchField) => {
    setLoading(true);
     setIsSearching(!!search);
    try {
      const response = await getUsers(page, size, search,field);
      setUsers(response.data);
      setTotalUsers(response.total);
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
    { value: 'username', label: 'User name' },
    { value: 'role', label: 'Role' }, 
  ];
    // Handler para búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a primera página al buscar
    fetchUsers(1, pageSize, value, searchField);
  };

  // Handler para cambiar campo de búsqueda
  const handleFieldChange = (value) => {
    setSearchField(value);
    if (searchTerm) {
      setCurrentPage(1);
      fetchUsers(1, pageSize, searchTerm, value);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setCurrentPage(1);
    fetchUsers(1, pageSize, '', 'all');
  };
  
  // Cambiar página
  const handlePageChange = (page:number, size:number) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchUsers(page, size);
  };

  // Cambiar tamaño de página
  const handleSizeChange = (size:number) => {
    setCurrentPage(1);  
    setPageSize(size);
    fetchUsers(1, size);
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchUsers(currentPage, pageSize);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Crear usuario
  const handleCreate = async (values:User) => {
    try {
      const newUser = await createUser(values);
      setUsers([...users,newUser]); 

      message.success('User created successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error:any) {
      message.error(error.message);
    }
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Please confirm your password'));
    }
    if (value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('The passwords do not match'));
    }
    return Promise.resolve();
  };

  // Actualizar usuario
  const handleUpdate = async (values:User) => {
    try {
        if(editingUser){

      const updatedUser = await updateUser(editingUser.id, values);
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updatedUser } : user
      ));
      message.success('User update successfully');
      setModalVisible(false);
      setEditingUser(undefined);
      form.resetFields();}
       fetchUsers();
    } catch (error:any) {
      message.error(error.message);
    }
  };

  // Eliminar usuario
  const handleDelete =  async (id:number) => {
    try {
      await deleteUser(id);
      message.success('User delete successfully'); 
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchUsers(currentPage - 1, pageSize);
      } else {
        fetchUsers(currentPage, pageSize);
      }
    } catch (error:eny) {
      message.error(error.message);
    }
  };

  // Abrir modal para editar
  const handleEdit = (user:User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  // Abrir modal para crear
  const handleAdd = () => {
    setEditingUser(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingUser(undefined);
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
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },    
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record:User) => (
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
            title="Are you sure you want to delete this user?"
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
         <Title level={2}>User Management</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
         
           <SearchControls
          searchTerm={searchTerm}
          searchField={searchField}
          onSearch={handleSearch}
          onFieldChange={handleFieldChange}
          onClearSearch={handleClearSearch}
          loading={loading}
          searchFields={searchFields}
          totalResults={totalUsers}      
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
              New User
            </Button>
          </Space>
        </div>   
   
       <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
         pagination={false}
        />

         <PaginationControls
          current={currentPage}
          pageSize={pageSize}
          total={totalUsers}
          onChange={handlePageChange} 
          onSizeChange={handleSizeChange}
          showSizeChanger={true} 
         showTotal = {true}
        />
        <Modal
          title={editingUser ? 'Edit User' : 'New User'}
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingUser ? handleUpdate : handleCreate}
          >
            <Form.Item
              label="User Name"
              name="username"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="User name" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                     { required: true, message: 'Please enter your password' },
                     { min: 6, message: 'The password must be at least 6 characters long' }
                     ]}
            >
              <Input.Password placeholder="**********" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your password' }
                , { validator: validateConfirmPassword }
              ]}
            >
             <Input.Password placeholder="**********" />
            </Form.Item>
             <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please enter your role' }]}
            >
               
          <Select>
            <Select.Option value="ADMIN">Administrator</Select.Option>
            <Select.Option value="MANAGER">Manager</Select.Option>
            <Select.Option value="USER">User</Select.Option>
          </Select>
        </Form.Item>
            
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingUser ? 'Update' : 'Add'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
