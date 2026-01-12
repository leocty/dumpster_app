"use client"
import React, { useEffect, useState } from 'react';
import { Steps, Form, Input, Button, Card, Row, Col, Select, DatePicker, InputNumber, Divider, message, Radio, Table, Tag, Modal, Layout, Spin } from 'antd';
import { UserOutlined, ContainerOutlined, CheckCircleOutlined, PlusOutlined, SearchOutlined, HomeOutlined, RestOutlined } from '@ant-design/icons';
import { Customer, WorkAddress } from '@/app/types/Customer';
import { useCustomer } from '@/app/hooks/useCustomer';
import { useContract } from '@/app/hooks/useContract';
import { Dumpster, DumpsterStatus } from '@/app/types/Dumpster';
import { Fix } from '@/app/types/Fix';
import FDatePicker from '@/app/ui/components/FDatePicker';
import PDFDownload from '@/app/ui/components/PDFDownload';
import PDFGenerate from '@/app/ui/components/PDFGenerate';
import { useRouter } from 'next/navigation';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const ContractForm = () => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [customerType, setCustomerType] = useState('existing'); 
  const [workAddressType, setWorkAddressType] = useState('new'); 
  const [modalCustomerVisible, setModalCustomerVisible] = useState(false);
  const [customerSelected , setCustomerSelected] = useState<Customer | null>(null);
  const [modalWorkAddressVisible, setModalWorkAddressVisible] = useState(false);
  const [workAddressSelected, setWorkAddressSelected] = useState<WorkAddress | null>(null);

  const router = useRouter();

  const [modalDumpsterVisible, setModalDumpsterVisible] = useState(false);
  const [dumpsterSelected, setDumpsterSelected] = useState<Dumpster | null>(null);
  const [modalFixVisible, setModalFixVisible] = useState(false);
  const [fixSelected, setFixSelected] = useState<Fix | null>(null);

  const {getContractCreate,createContract,getContracts} = useContract();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dumpsters, setDumpsters] = useState<Dumpster[]>([]);
  const [fixs, setFixs] = useState<Fix[]>([]);
  const fetchData =async () => {
   setLoading(true);
    try {
      const response = await getContractCreate();
      if(response)
      setCustomers(response?.allCustomers||[]);
      setDumpsters(response?.allDumpsters||[]);
      setFixs(response?.allFixs||[]);
      } catch (error: unknown) {
       message.error(error instanceof Error ? error.message : 'An error occurred');
    }  finally {
      setLoading(false);
    } 
  };

   useEffect(  () => {
       fetchData();
    }, []);

  const [formData, setFormData] = useState({
    Customer: {
       id: "",
       name: "",
       taxId: "",
       homeAddress: "",
       city: "",
       state: "",
       email: "",
       phone: "",
       zipCode: "",
       description: ""
    },
    WorkAddress: {
        id: "",
        addressName: "",
        address: "",
        addressCity: "", 
        addressState: "", 
        addressZipCode: "", 
        contactName: "",
        contactPhone: "" 
    },
    dumsterId: "",
    fixId: "",
    baseWeight:"",
    startDate: "",
    endDate: "",  
    description: ""  
  });

    
  const steps = [
    {
      title: 'Customers',
      icon: <UserOutlined />,
    },
    {
      title: 'Work Address ',
      icon: <HomeOutlined />,
    },
    {
      title: 'Dumpster',
      icon: <RestOutlined />,
    },
    {
      title: 'Confirmation',
      icon: <CheckCircleOutlined />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
    console.log(formData);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = async (values: unknown) => {
     try {
      console.log(formData)
      const saveContract=await createContract(formData);
      form.resetFields();
      message.success('Contract created successfully');
      
      Modal.info({
               title: 'Download the PDF',
               content: ( <div>
                <p>You can download the PDF file using the following link.</p>
               <PDFDownload data={saveContract} />
               </div>
               ),
               onOk() {
                 router.push('/dashboard/contracts')  
               },
  });


    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : 'An error occurred');
    }
    
  };

   const updateFormData = (step: string, values: unknown) => {
  setFormData(prev => {
    if (prev.hasOwnProperty(step) && typeof prev[step] === 'object' &&
        !Array.isArray(prev[step]) && prev[step] !== null) {

      return {
        ...prev,
        [step]: { ...prev[step], ...values }
      };
    } else {

      return {
        ...prev,
        [step]: values
      };
    }
  });
};

  const handleSelectCustomer = async (customer: Customer) => {
   setCustomerSelected(customer);
    updateFormData('Customer', customer);
    setModalCustomerVisible(false);
    setWorkAddressSelected(null);
 };

   const handleSelectWorkAddress = (workAddress: WorkAddress) => {
   setWorkAddressSelected(workAddress);
    updateFormData('WorkAddress', workAddress);
    setModalWorkAddressVisible(false);
  };

  const handleSelectDumster = async (dumpster: Dumpster) => {
    setDumpsterSelected(dumpster);
    await updateFormData('dumsterId', dumpster.id);
    setModalDumpsterVisible(false);
 };

 const handleSelectFix= async (fix: Fix) => {
    setFixSelected(fix);
    await updateFormData('fixId', fix.id);
     setModalFixVisible(false);
 };
  const clearCustomerFields = () => {
 form.setFieldsValue({
       name: "",
       taxId: "",
       homeAddress: "",
       city: "",
       state: "",
       email: "",
       phone: "",
       zipCode: "",
       description: ""
      });
  }


  const clearWorkAddressFields = () => {
    form.setFieldsValue({
        addressName: "",
        address: "",
        addressCity: "", 
        addressState: "", 
        addressZipCode: "", 
        contactName: "",
        contactPhone: "" 
      });
  }

  const handleSelectCustomerTypeChange = (e: { target: { value: string } }) => {
    setCustomerType(e.target.value);
    // Limpiar datos del cliente al cambiar el tipo
     clearWorkAddressFields();
    if (e.target.value === 'new') {
      setCustomerSelected(null);
     clearCustomerFields();
    }
    console.log(customerSelected)
  };

   const handleSelectWorkAddressTypeChange = (e: { target: { value: string } }) => {
    setWorkAddressType(e.target.value);
    // Limpiar datos del cliente al cambiar el tipo
    console.log(workAddressSelected)
    if (e.target.value === 'new') {
      setWorkAddressSelected(null);
      clearWorkAddressFields();
    }
  };

  const customercolumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name' 
     },
    {
      title: 'Tax Id',
      dataIndex: 'taxId',
      key: 'taxId',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state'  
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'  
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone', 
    },
    {
      title: 'Zip Code',
      dataIndex: 'zipCode',
      key: 'zipCode' 
    },
    {
      title: 'Acción',
      key: 'accion',
      render: (_: unknown, record: Customer) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => handleSelectCustomer(record)}
        >
          Select
        </Button>
      ),
    },
  ];

  const workaddresscolumns = [
    {
      title: 'Name',
      dataIndex: 'addressName',
      key: 'addressName' 
     },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'City',
      dataIndex: 'addressCity',
      key: 'addressCity',
    },
    {
      title: 'State',
      dataIndex: 'addressState',
      key: 'addressState'  
    },
    {
      title: 'Zip Code',
      dataIndex: 'addressZipCode',
      key: 'addressZipCode' 
    },
    {
      title: 'Contact Name',
      dataIndex: 'contactName',
      key: 'contactName'  
    },
    {
      title: 'Contact Phone',
      dataIndex: 'contactPhone',
      key: 'contactPhone', 
    },
    {
      title: 'Acción',
      key: 'accion',
      render: (_: unknown, record: WorkAddress) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleSelectWorkAddress(record)}
        >
          Select
        </Button>
      ),
    },
  ];

   const dumpstercolumns = [
        {
          title: 'Size',
          dataIndex: 'size',
          key: 'size'
          },
        {
          title: 'Name',
          dataIndex: 'serialNumber',
          key: 'serialNumber',
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
         },    
    {
      title: 'Acción',
      key: 'accion',
      render: (_: unknown, record: Dumpster) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleSelectDumster(record)}
        >
          Select
        </Button>
      ),
    },
  ];

   const fixcolumns = [
    {
      title: 'Custom Amount',
      dataIndex: 'customAmount',
      key: 'customAmount' 
     },
    {
      title: 'Land Fill Cost',
      dataIndex: 'landFillCost',
      key: 'landFillCost',
    },
    {
      title: 'Tons Over Weight Amount',
      dataIndex: 'tonsOverWeightAmount',
      key: 'tonsOverWeightAmount',
       render: (value:number) => ( 
                   <p>{value}</p>
                 )   
    },
    {
      title: 'Days Over Time Amount',
      dataIndex: 'daysOverTimeAmount',
      key: 'daysOverTimeAmount'  ,
       render: (value:number) => ( 
                   <p>{value}</p>
                 ) 
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description', 
    } ,
    {
      title: 'Acción',
      key: 'accion',
      render: (_: unknown, record: Fix) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleSelectFix(record)}
        >
          Select
        </Button>
      ),
    },
  ];


  const Step1 = () => (
    <div>
      <Card title="Customer selection" style={{ marginBottom: 24 }}>
        <Form.Item  >
          <Radio.Group 
            value={customerType} 
            onChange={handleSelectCustomerTypeChange}
            style={{ width: '100%' }}
          >
            <Radio.Button value="existing" style={{ width: '50%', textAlign: 'center' }}>
              Existing Customer
            </Radio.Button>
            <Radio.Button value="new" style={{ width: '50%', textAlign: 'center' }}>
              New Customer
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        {customerType === 'existing' && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {customerSelected ? 
                  `Selected customer: ${customerSelected.name} - ${customerSelected.taxId}` : 
                  'No customer selected'
                }
              </span>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={() => setModalCustomerVisible(true)}
              >
                Find Customer
              </Button>
            </div> 
 
            {customerSelected && (
              <Card 
                size="small" 
                title="Selected Customer Information"
                style={{ marginBottom: 16 }}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <p><strong>Name:</strong> {customerSelected.name}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Tax id:</strong> {customerSelected.taxId}</p>
                  </Col>                 
                </Row>
                <Row gutter={16}>
                   <Col span={8}>
                    <p><strong>Home Address:</strong> {customerSelected.homeAddress}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>City:</strong> {customerSelected.city}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>State:</strong> {customerSelected.state}</p>
                  </Col>
                </Row>
                 <Row gutter={16}>
                   <Col span={8}>
                    <p><strong>Email:</strong> {customerSelected.email}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Phone:</strong> {customerSelected.phone}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Zip Code:</strong> {customerSelected.zipCode}</p>
                  </Col>
                </Row>
                 <Row gutter={16}>
                   <Col span={24}>
                    <p><strong>Description:</strong> {customerSelected.description}</p>
                  </Col>
                   
                </Row>
                <Button 
                  type="link" 
                  onClick={() => setModalCustomerVisible(true)}
                  style={{ padding: 0 }}
                >
                 Change Customer
                </Button>
              </Card>
            )}
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const datosCompletos = {
              ...values,
              id: customerSelected ? customerSelected.id : null 
            };
            updateFormData('Customer', datosCompletos);
           
            setWorkAddressType(customerSelected && customerSelected.workAddress.length>0?"existing":"new");
            next();
          }}
          initialValues={formData.Customer}
        >
          
          {customerType === 'new' && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
              label="Name"
              name="name"
              key= "customer_name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
              label="Tax Id"
              name="taxId"
              rules={[{ required: true, message: 'Please enter your tax id' }]}
            >
              <Input placeholder="Tax Id" />
            </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
              label="Home Address"
              name="homeAddress"
              rules={[{ required: true, message: 'Please enter your home address' }]}
            >
              <TextArea rows={2} placeholder="Home Address" />
            </Form.Item>
                </Col>
                <Col span={12}>
                 <Form.Item
              label="City"
              name="city"
              rules={[]}
            >
              <Input  placeholder="City" />
            </Form.Item>

                </Col>
              </Row>

               <Row gutter={16}>
                <Col span={12}>
                 <Form.Item
              label="State"
              name="state"
              rules={[]}
            >
              <Input  placeholder="State" />
            </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
              label="Zip Code"
              name="zipCode"
              rules={[]}
            >
              <Input  placeholder="Zip Code" />
            </Form.Item>
                </Col>
              </Row>

               <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Invalid email' }
                     ]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>
                </Col>
                <Col span={12}>
                 <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone' }]}
            >
             <Input placeholder="+1 234 567 8900" />
            </Form.Item>
                </Col>
              </Row>
               <Form.Item
              label="Description"
              name="description"
              rules={[ ]}
            >
             <TextArea rows={2} placeholder="Description" />
            </Form.Item>
            </>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              disabled={customerType === 'existing' && !customerSelected}
            >
              Nex
            </Button>
          </Form.Item>
        </Form>
      </Card>

      
      <Modal
        title="Selected Customer existing"
        open={modalCustomerVisible}
        onCancel={() => setModalCustomerVisible(false)}
        footer={null}
        width={1000}
      >
        <Table 
          columns={customercolumns} 
          dataSource={customers}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
        />
      </Modal>
    </div>
  );

   
  const Step2 = () => (
     <div>
      <Card title="Work Address selection" style={{ marginBottom: 24 }}>
        <Form.Item  >
          <Radio.Group 
            value={workAddressType} 
            onChange={handleSelectWorkAddressTypeChange}
            style={{ width: '100%' }}
          >
            <Radio.Button value="existing" style={{ width: '50%', textAlign: 'center' }} disabled={!customerSelected || customerSelected.workAddress.length===0}>
              Existing Work Address
            </Radio.Button>
            <Radio.Button value="new" style={{ width: '50%', textAlign: 'center' }}>
              New Work Address
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
 

        { workAddressType=== 'existing' && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {workAddressSelected ? 
                  `Selected Work Address: ${workAddressSelected.name} ${workAddressSelected.address}` : 
                  'No work address selected'
                }
              </span>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={() => setModalWorkAddressVisible(true)}
              >
                Find Work Address
              </Button>
            </div>

            {workAddressSelected && (
                <Card 
                size="small" 
                title="Selected Work Address Information"
                style={{ marginBottom: 16 }}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <p><strong>Name:</strong> {workAddressSelected.addressName}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Address:</strong> {workAddressSelected.address}</p>
                  </Col>                   
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <p><strong>City:</strong> {workAddressSelected.addressCity}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>State:</strong> {workAddressSelected.addressState}</p>
                  </Col>
                   <Col span={8}>
                    <p><strong>Zip Code:</strong> {workAddressSelected.addressZipCode}</p>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <p><strong>Contact Name:</strong> {workAddressSelected.contactName}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Contact Phone:</strong> {workAddressSelected.contactPhone}</p>
                  </Col>
                   
                </Row>
                <Button 
                  type="link" 
                  onClick={() => setModalWorkAddressVisible(true)}
                  style={{ padding: 0 }}
                >
                 Change Work Address
                </Button>
              </Card>
            )}
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const datosCompletos = {
              ...values,
              id: workAddressSelected ? workAddressSelected.id : null ,
              customerId: formData.Customer.id ? formData.Customer.id : null 
            };
            updateFormData('WorkAddress', datosCompletos);
            next();
          }}
          initialValues={formData.WorkAddress}
        >
          {workAddressType === 'new' && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                   <Form.Item
              label="Name"
              name="addressName" 
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
                </Col> 

                <Col span={12}>
                 <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                 <Form.Item
              label="City"
              name="addressCity"
              rules={[]}
            >
              <Input placeholder="City" />
            </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
              label="State"
              name="addressState"
              rules={[]}
            >
              <Input placeholder="State" />
            </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                 <Form.Item
              label="Contact Name"
              name="contactName"
              rules={[]}
            >
              <Input placeholder="Contact Name" />
            </Form.Item>
                </Col>
                <Col span={12}>
                 <Form.Item
              label="Contact Phone"
              name="contactPhone"
              rules={[]}
            >
              <Input placeholder="Contact Phone" />
            </Form.Item>
                </Col>
              </Row>

               <Row gutter={16}>
                <Col span={12}>
                 <Form.Item
              label="Zip Code"
              name="addressZipCode"
              rules={[]}
            >
              <Input placeholder="Zip Code" />
            </Form.Item>
                </Col>                 
              </Row>
            </>
          )}

          <Form.Item>
         <Button style={{ marginRight: 8 }} onClick={prev}>
          Previous
        </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              disabled={workAddressType === 'existing' && !workAddressSelected}
            >
              Nex
            </Button>
          </Form.Item>
        </Form>
      </Card>

        
      <Modal
        title="Selected Work Address existing"
        open={modalWorkAddressVisible}
        onCancel={() => setModalWorkAddressVisible(false)}
        footer={null}
        width={1000}
      >
        <Table 
          columns={workaddresscolumns} 
          dataSource={customerSelected?.workAddress}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
        />
      </Modal>
    </div>
    
  );

 const Step3 = () => (
      <div>
        <Row gutter={16}>
             <Col span={12}>
                  <Card title="Dumpster selection" style={{ marginBottom: 24 }}  extra={<Button 
                                                           type="primary" 
                                                           icon={<SearchOutlined />}
                                                           onClick={() => setModalDumpsterVisible(true)}
                                                            >
                                                             Find Dumpster
                                                       </Button>} >
                   { dumpsterSelected && (
        
                   <div>
                   <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>Name:</strong> {dumpsterSelected.serialNumber}</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>Size:</strong> {dumpsterSelected.size}</p>
                  </Col>                   
                   </Row>
                   <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>Description:</strong> {dumpsterSelected.description}</p>
                  </Col>
                  <Col span={12}>
                    <Tag color={dumpsterSelected.dumpsterStatus.colorCode} key={dumpsterSelected.dumpsterStatus.name}>
                    {dumpsterSelected.dumpsterStatus.name.toUpperCase()}
                    </Tag>
                  </Col>                   
                   </Row>              
                  </div>            
                    )}
 
                </Card>
             </Col>
            <Col span={12}>
                  <Card title="Fix selection" style={{ marginBottom: 24 }} extra={<Button 
                                                                                   type="primary" 
                                                                                   icon={<SearchOutlined />}
                                                                                   onClick={() => setModalFixVisible(true)}
                                                                                   >
                                                                                   Find Fix
                                                                                  </Button>} >
                  { fixSelected && (
                  <div>
                  <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>Custom Amount:</strong> {fixSelected.customAmount}</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>Land Fill Cost:</strong> {fixSelected.landFillCost}</p>
                  </Col>                   
                  </Row>
                  <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>Tons Over Weight Amount:</strong> {fixSelected.tonsOverWeightAmount}</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>Days Over Time Amount:</strong> {fixSelected.daysOverTimeAmount}</p>
                  </Col>                   
                  </Row>              
                  </div>          
                    )}
 
                  </Card>
           </Col>
        </Row>
    
       <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            await updateFormData('description', values.description); 
            await updateFormData('baseWeight', values.baseWeight); 
           if(dumpsterSelected && fixSelected)
            next();
          }}
          initialValues={formData.WorkAddress}
        >
           
            <>

             <Row gutter={16}>
               <Col span={24}>
                    <Form.Item
              label="Base Weight"
              name="baseWeight"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber
               style={{ width: '49%' }}
               stringMode
                placeholder="Base Weight" />
            </Form.Item> 
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                   <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
            <FDatePicker
                  showTime={false}
                  format="YYYY/MM/DD"
                  minDaysFromToday={0}
                  onChange={date=>{ updateFormData('startDate', date? date.format('YYYY-MM-DD').toString():""); }}
              />
            </Form.Item>
                </Col> 

                <Col span={12}>
                  <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
            <FDatePicker
                  showTime={false}
                  format="YYYY/MM/DD"
                  minDaysFromToday={0}
                  onChange={date=>{ updateFormData('endDate', date? date.format('YYYY-MM-DD').toString():""); }}
              />
            </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
               <Col span={24}>
                   <Form.Item
              label="Description"
              name="description"
              rules={[ ]}
            >
             <TextArea rows={2} placeholder="Description" />
            </Form.Item>
                </Col>
              </Row>
             
 
            </>
        

          <Form.Item>
         <Button style={{ marginRight: 8 }} onClick={prev}>
          Previous
        </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              disabled={!dumpsterSelected || !fixSelected}
            >
              Nex
            </Button>
          </Form.Item>
        </Form>



    <Modal
        title="Selected Dumpster"
        open={modalDumpsterVisible}
        onCancel={() => setModalDumpsterVisible(false)}
        footer={null}
        width={1000}
      >
        <Table 
          columns={dumpstercolumns} 
          dataSource={dumpsters}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
        />
      </Modal>
      <Modal
        title="Selected Fix"
        open={modalFixVisible}
        onCancel={() => setModalFixVisible(false)}
        footer={null}
        width={1000}
      >
        <Table 
          columns={fixcolumns} 
          dataSource={fixs}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
        />
      </Modal>
     </div>
  );

  const Step4 = () => (
    <div>
      <Card  style={{ marginBottom: 24 }}>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'> Contract Summary </h2>
              <Card  title="Customer Information">
          <Row gutter={16}>
                <Col span={6}>
              <p><strong>Name:</strong> {formData.Customer.name} </p>
              </Col>
              <Col span={6}>
              <p><strong>Tax id:</strong> {formData.Customer.taxId}</p>
              </Col>
              <Col span={6}>
              <p><strong>Email:</strong> {formData.Customer.email}</p>
              </Col>
              <Col span={6}>
              <p><strong>Phone:</strong> {formData.Customer.phone}</p>
             </Col>
              </Row>
 
             
            <Row gutter={16}>
              <Col span={6}>
               <p><strong>Home Address:</strong> {formData.Customer.homeAddress}</p>
              </Col>
                <Col span={6}>
              <p><strong>City:</strong> {formData.Customer.city}</p>
              </Col>
                <Col span={6}>
              <p><strong>State:</strong> {formData.Customer.state}</p>
              </Col>
                <Col span={6}>
             <p><strong>Zip Code:</strong> {formData.Customer.zipCode}</p>
             </Col>
             </Row>
             
              <p><strong>Description:</strong> {formData.Customer.description}</p>
            </Card>
              <Divider />
        <Card  title="Work Address Information">
          <Row gutter={16}>
                <Col span={6}>
              <p><strong>Address:</strong> {formData.WorkAddress.address}</p>
              </Col>
               <Col span={6}>
              <p><strong>City:</strong> {formData.WorkAddress.addressCity}</p>
              </Col>
               <Col span={6}>
              <p><strong>State:</strong> {formData.WorkAddress.addressState}</p>
              </Col>
               <Col span={6}>
              <p><strong>Zip Code:</strong> {formData.WorkAddress.addressZipCode}</p>
              </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
              <p><strong>Contact Name:</strong> {formData.WorkAddress.contactName}</p>
              </Col>
              <Col span={6}>
              <p><strong>Contact Phone:</strong> {formData.WorkAddress.contactPhone}</p>
               </Col>
             </Row> 
            </Card>
               
              <Divider />
      
      <Card  title="Dumpster Information">
          <Row gutter={16}>
                <Col span={6}>
                 <p><strong>Name:</strong> {dumpsterSelected?.serialNumber}</p>
               </Col>
               <Col span={6}>
                 <p><strong>Size:</strong> {dumpsterSelected?.size}</p>
              </Col>
              <Col span={6}>
                 <p><strong>Dumpster Status:</strong>  <Tag color={dumpsterSelected?.dumpsterStatus.colorCode} key={dumpsterSelected?.dumpsterStatus.name}>
                    {dumpsterSelected?.dumpsterStatus.name.toUpperCase()}
                    </Tag></p>
               </Col>   
          </Row></Card>
            <Divider />
       <Card  title="Fix Information">
          <Row gutter={16}>
                <Col span={6}> 
              <p><strong>Custom Amount:</strong> {fixSelected?.customAmount}</p>
              </Col>
              <Col span={6}> 
               <p><strong>Land Fill Cost:</strong> {fixSelected?.landFillCost}</p>
              </Col>
              <Col span={6}> 
              <p><strong>Tons Over Weight Amount:</strong> {fixSelected?.tonsOverWeightAmount}</p>
             </Col>
             <Col span={6}> 
              <p><strong>Days Over Time Amount:</strong> { fixSelected?.daysOverTimeAmount}</p>
              </Col>
              </Row>
              <p><strong>Description:</strong> {fixSelected?.description}</p>
              </Card>
               <Divider />
      <Card  title="Contract Information">
        
          <Row gutter={16}>
            <Col span={6}>                
              <p><strong>Base Weight:</strong> {formData.baseWeight}</p>
              </Col>
                <Col span={6}>                
              <p><strong>Start Date:</strong> {formData.startDate}</p>
              </Col> 
              <Col span={6}> 
              <p><strong>End Date:</strong> {formData.endDate}</p>
              </Col>
              <Col span={6}> 
              <p><strong>Description:</strong> {formData.description}</p>
              </Col>
              </Row>
            </Card>
</Card>
      <div style={{ textAlign: 'center' }}>
        <Button style={{ marginRight: 8 }} onClick={prev}>
          Previous
        </Button>
        <Button type="primary" onClick={onFinish}>
          Confirm
        </Button>
      </div>
    </div>
  );

  const stepContent = [
    <Step1 key="1" />,
    <Step2 key="2" />,
    <Step3 key="3" />,
    <Step4 key="4" />,
  ];
 if (loading) {
        return (<Layout> <Spin 
                size="large"
                className="custom-spin"
                 style={{
                         position: 'absolute',
                         top: '50%',
                         left: '50%',
                         transform: 'translate(-50%, -50%)'
                        }}
                /></Layout>)
      } 

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Steps current={current} style={{ marginBottom: 32 }}>
          {steps.map((item, index) => (
            <Step key={index} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <div className="steps-content">
          {stepContent[current]}
        </div>
      </Card>
    </div>
  );
};

export default ContractForm;