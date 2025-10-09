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
  Divider,
  Spin, 
  List,
  Row,
  Col,
  Tag,
  InputNumber,
  Switch,
  Checkbox,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined, 
  FileAddOutlined,
  DollarOutlined,
  DownloadOutlined
} from '@ant-design/icons'; 
import '@ant-design/v5-patch-for-react-19'; 
import { Customer, WorkAddress } from '@/app/types/Customer';
import PaginationControls from '@/app/ui/components/PaginationControls';
import SearchControls from '@/app/ui/components/SearchControls';
import TextArea from 'antd/es/input/TextArea';
import { useContract } from '@/app/hooks/useContract';
import { Contract } from '@/app/types/Contract';
import PDFDownload from '@/app/ui/components/PDFDownload';
import FDatePicker from '@/app/ui/components/FDatePicker';

import dayjs from 'dayjs';

const { Title } = Typography;

export default function ContractPage() {
  const {getContractCreate,createContract,getContracts,editContractsPayments,editContractsData} = useContract();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalDetailVisible, setModalDetailVisible] = useState(false);   
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalPaymentsVisible, setModalPaymentsVisible] = useState(false);

  const [detailContract, setDetailContract] = useState<Contract>(); 

  const [formPaymentsContract] = Form.useForm();
  const [extraDaysOrTons, setExtraDaysOrTons] = useState(false);
  const [formEditContract] = Form.useForm();
    
  const hasShown = useRef(false);
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalContracts, setTotalContracts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Obtener Contract
  const fetchContracts =async (page = currentPage, size = pageSize, search = searchTerm, field = searchField) => {
    setLoading(true);
     setIsSearching(!!search);
    try {
      const response = await getContracts(page, size, search,field);
      setContracts(response.data);
      setTotalContracts(response.total);
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
    { value: 'Work Address Name', label: 'Work Address Name' },
    { value: 'Dumpster Name', label: 'Dumpster Name' }, 
    { value: 'Fix Description', label: 'Fix Description' }, 
    { value: 'Contract Status', label: 'Contract Status' }, 
       { value: 'Contract Payment Status', label: 'Contract Payment Status' }, 
    { value: 'Description', label: 'Description' },  
  ];

    // Handler para búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a primera página al buscar
    fetchContracts(1, pageSize, value, searchField);
  };

  // Handler para cambiar campo de búsqueda
  const handleFieldChange = (value) => {
    setSearchField(value);
    if (searchTerm) {
      setCurrentPage(1);
      fetchContracts(1, pageSize, searchTerm, value);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setCurrentPage(1);
    fetchContracts(1, pageSize, '', 'all');
  };
  
  // Cambiar página
  const handlePageChange = (page:number, size:number) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchContracts(page, size);
  };

  // Cambiar tamaño de página
  const handleSizeChange = (size:number) => {
    setCurrentPage(1);  
    setPageSize(size);
    fetchContracts(1, size);
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchContracts(currentPage, pageSize);
  };

  const handleDetails = (contract:Contract) => {      
    setDetailContract(contract);
    setModalDetailVisible(true);
  };

  const handlePDFDownload=(contract:Contract)=>{
    console.log(contract)
     try {
           Modal.info({
                   title: 'Download the PDF',
                   content: ( <div>
                    <p>You can download the PDF file using the following link.</p>
                   <PDFDownload data={contract} />
                   </div>
                   ), 
      });
    
    
        } catch (error:any) {
          message.error(error.message);
        }
  }


  function esISO8601ConDayjs(fechaString: string): boolean {
  // Day.js puede parsear ISO 8601 automáticamente
  const fecha = dayjs(fechaString);
  return fecha.isValid() && /^\d{4}-\d{2}-\d{2}/.test(fechaString);
}

   const handlePayments = async (contract:Contract) => {  
    formPaymentsContract.setFieldsValue({
     fixContractID:contract.fixContract.id, 
     madePaymentCustomAmount: contract.fixContract.madePaymentCustomAmount,
     madePaymentLandFillCost: contract.fixContract.madePaymentLandFillCost,  
     madePaymentTonsOverWeightAmount: contract.fixContract.madePaymentTonsOverWeightAmount,
     madePaymentDaysOverTimeAmount: contract.fixContract.madePaymentDaysOverTimeAmount,
     extraDaysOrTons:false, 
     paymentTonsOverWeightAmount: contract.fixContract.paymentTonsOverWeightAmount,
     paymentDaysOverTimeAmount: contract.fixContract.paymentDaysOverTimeAmount
    }); 
    setExtraDaysOrTons(false)
   setModalPaymentsVisible(true);
  };

   const handleEditContract = (contract:Contract) => {   
    formEditContract.setFieldsValue({
                                contractID: contract.id,
                                startDate: dayjs( contract.startDate),
                                endDate : dayjs(contract.endDate),
                                removalDate: esISO8601ConDayjs(contract.removalDate) 
                                                           ?dayjs(contract.removalDate)
                                                           :null,
                                contractPaymentStatus: contract.contractPaymentStatus,
                                contractStatus :  contract.contractStatus,
                                description :  contract.description
    });    
    console.log(esISO8601ConDayjs(contract.endDate));
    console.log(formEditContract.getFieldValue('endDate'));
    setModalEditVisible(true);
  };

  

 const handleContractDetailCancel = () => {
    setModalDetailVisible(false);
    setDetailContract(undefined);
  };

  const handleEditContractCancel = () => {
    setModalEditVisible(false);
  };
  
  const handleContractPaymentsCancel = () => {
     setModalPaymentsVisible(false);
  };
 
  const handlePaymentsEdit = async (values: any) => {
    setModalPaymentsVisible(false);
      setLoading(true);
      try {
      await editContractsPayments(values);
      fetchContracts();
    } catch (error:any) {
      if (!hasShown.current) {
      hasShown.current = true
     message.error(error.message);
    } 
    } finally {
      setLoading(false);
    }

   };

  const handleContractUpdate = async (values: any) => {
    setModalEditVisible(false);
      setLoading(true);
      try {
        console.log(values);
       await editContractsData({contractID: values.contractID,
                                startDate: values.startDate.format('YYYY-MM-DD').toString(),
                                removalDate: values.removalDate && values.removalDate.isValid()
                                            ? values.removalDate.format('YYYY-MM-DD').toString()
                                             :null  ,
                                endDate: values.endDate.format('YYYY-MM-DD').toString(),
                                contractPaymentStatus: values.contractPaymentStatus,
                                contractStatus :  values.contractStatus,
                                description :  values.description});
      fetchContracts();
    } catch (error:any) {
      if (!hasShown.current) {
      hasShown.current = true
     message.error(error.message);
    } 
    } finally {
      setLoading(false);
    } 
   };


   

  useEffect(() => {
    fetchContracts();
  }, []);

  // Columnas de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
       render: (customer:Customer) => (
        <Space direction="vertical" size={0}>
          <strong>{customer?.name}</strong>
          <small style={{ color: '#666' }}>{customer?.taxId}</small>          
        </Space>
      )
    },
    {
    title: 'workAddress',
    dataIndex: ['workAddress', 'address'],
    key: 'workAddress',
    },
    {
    title: 'Dumpster Size',
    dataIndex: ['dumpster', 'size'],
    key: 'dumpsterSize',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => a.endDate.localeCompare(b.endDate),
    },
    {
      title: 'Contract Status',
      dataIndex: 'contractStatus',
      key: 'contractStatus',     
    },
    ,
    {
      title: 'Contract Payment Status',
      dataIndex: 'contractPaymentStatus',
      key: 'contractPaymentStatus',     
    }, 
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record:Contract) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleDetails(record)}
          /> 
             <Button
            type="primary"
            icon={<DollarOutlined />}
            size="small"
            onClick={() => handlePayments(record)}
          /> 
            <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditContract(record)}
          />
             <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => handlePDFDownload(record)}
          /> 
        </Space>
      ),
    },
  ];


   const expandedRowRender = (contract:Contract) => {
  return (
    <div className='ml-12'>
      
     <div>
        <Space   size="small">
                                <p><strong>Custom Amount:</strong> </p> 
                                 <Tag color={ "#FFBF00"} > {contract.fixContract?.fix.customAmount} </Tag>
                                 <Tag color={contract.fixContract?.madePaymentCustomAmount?"#87d068":"#97161a"}  >
                                   {contract.fixContract?.paymentCustomAmount} </Tag>
                                <p><strong>Land Fill Cost:</strong> </p> 
                                   <Tag color={ "#FFBF00"}  > {contract.fixContract?.fix.landFillCost} </Tag>
                                   <Tag color={contract.fixContract?.madePaymentLandFillCost?"#87d068":"#97161a"}   >
                                     {contract.fixContract?.paymentLandFillCost} </Tag>
                                <p><strong>Tons Over Weight Amount:</strong> </p> 
                                 <Tag color={ "#FFBF00"} > {contract.fixContract?.fix.tonsOverWeightAmount} x tons </Tag>
                                 <Tag color={contract.fixContract?.madePaymentTonsOverWeightAmount?"#87d068":"#97161a"}  >
                                     {contract?.fixContract?.paymentTonsOverWeightAmount*contract?.fixContract?.fix.tonsOverWeightAmount} </Tag>
                                  <p><strong>Days Over Time Amount:</strong> </p> 
                                 <Tag color={ "#FFBF00"} > {contract.fixContract?.fix.daysOverTimeAmount} x days </Tag>
                                 <Tag color={contract.fixContract?.madePaymentDaysOverTimeAmount?"#87d068":"#97161a"}  >
                                    {contract?.fixContract?.paymentDaysOverTimeAmount*contract?.fixContract?.fix.daysOverTimeAmount} </Tag>
                          
                               </Space>
                        
                            
                        
                 
     </div>
     </div>
    );
  };
  

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
         <Title level={2}>Contract Management</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
         
           <SearchControls
          searchTerm={searchTerm}
          searchField={searchField}
          onSearch={handleSearch}
          onFieldChange={handleFieldChange}
          onClearSearch={handleClearSearch}
          loading={loading}
          searchFields={searchFields}
          totalResults={totalContracts}      
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
              href={`/dashboard/contracts/create`}
            >
              New Contract
            </Button>
          </Space>
          </Card>
        </div>   
   
       <Table
          columns={columns}
          dataSource={contracts}
          loading={loading}
          rowKey="id"
          pagination={false}
          expandable={{
                       expandedRowRender,
                       defaultExpandedRowKeys: ['0'], 
                      }}
        />           

         <PaginationControls
          current={currentPage}
          pageSize={pageSize}
          total={totalContracts}
          onChange={handlePageChange} 
          onSizeChange={handleSizeChange}
          showSizeChanger={true} 
         showTotal = {true}
        />

        <Modal
          title={ 'Contract Details'}
          open={modalDetailVisible}
          onCancel={handleContractDetailCancel}
          footer={null}
           width={1000}
        >
            <div>
      <div  style={{ marginBottom: 24 }}>
       
              <Card  title="Customer Information">
          <Row gutter={16}>
                <Col span={6}>
              <p><strong>Name:</strong> {detailContract?.customer.name} </p>
              </Col>
              <Col span={6}>
              <p><strong>Tax id:</strong> {detailContract?.customer.taxId}</p>
              </Col>
              <Col span={6}>
              <p><strong>Email:</strong> {detailContract?.customer.email}</p>
              </Col>
              <Col span={6}>
              <p><strong>Phone:</strong> {detailContract?.customer.phone}</p>
             </Col>
              </Row>
 
             
            <Row gutter={16}>
              <Col span={6}>
               <p><strong>Home Address:</strong> {detailContract?.customer.homeAddress}</p>
              </Col>
                <Col span={6}>
              <p><strong>City:</strong> {detailContract?.customer.city}</p>
              </Col>
                <Col span={6}>
              <p><strong>State:</strong> {detailContract?.customer.state}</p>
              </Col>
                <Col span={6}>
             <p><strong>Zip Code:</strong> {detailContract?.customer.zipCode}</p>
             </Col>
             </Row>
             
              <p><strong>Description:</strong> {detailContract?.customer.description}</p>
            </Card>
              <Divider />
        <Card  title="Work Address Information">
          <Row gutter={16}>
                <Col span={6}>
              <p><strong>Address:</strong> {detailContract?.workAddress.address}</p>
              </Col>
               <Col span={6}>
              <p><strong>City:</strong> {detailContract?.workAddress.addressCity}</p>
              </Col>
               <Col span={6}>
              <p><strong>State:</strong> {detailContract?.workAddress.addressState}</p>
              </Col>
               <Col span={6}>
              <p><strong>Zip Code:</strong> {detailContract?.workAddress.addressZipCode}</p>
              </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
              <p><strong>Contact Name:</strong> {detailContract?.workAddress.contactName}</p>
              </Col>
              <Col span={6}>
              <p><strong>Contact Phone:</strong> {detailContract?.workAddress.contactPhone}</p>
               </Col>
             </Row> 
            </Card>
               
              <Divider />
      
      <Card  title="Dumpster Information">
          <Row gutter={16}>
                <Col span={6}>
                 <p><strong>Serial Number:</strong> {detailContract?.dumpster.serialNumber}</p>
               </Col>
               <Col span={6}>
                 <p><strong>Size:</strong> {detailContract?.dumpster.size}</p>
              </Col>
              <Col span={6}>
                 <p><strong>Dumpster Status:</strong>  <Tag color={detailContract?.dumpster.dumpsterStatus.colorCode} key={detailContract?.dumpster.dumpsterStatus.name}>
                    {detailContract?.dumpster.dumpsterStatus.name.toUpperCase()}
                    </Tag></p>
               </Col>   
          </Row></Card>
            <Divider />
       <Card  title="Fix Information">
          <Space direction="vertical" size="small">
         
                             <Space size="small"><p><strong>Custom Amount:</strong> </p> 
                                 <Tag color={ "#FFBF00"} > {detailContract?.fixContract?.fix.customAmount} </Tag>
                                 <Tag color={detailContract?.fixContract?.madePaymentCustomAmount?"#87d068":"#97161a"}  >
                                   {detailContract?.fixContract?.paymentCustomAmount} </Tag>
                            </Space>
                            <Space size="small"> 
                                <p><strong>Land Fill Cost:</strong> </p> 
                                   <Tag color={ "#FFBF00"}  > {detailContract?.fixContract?.fix.landFillCost} </Tag>
                                   <Tag color={detailContract?.fixContract?.madePaymentLandFillCost?"#87d068":"#97161a"}   >
                                     {detailContract?.fixContract?.paymentLandFillCost} </Tag>
        
                                     </Space>
                            <Space size="small"> 
                                <p><strong>Tons Over Weight Amount:</strong> </p> 
                                 <Tag color={ "#FFBF00"} > {detailContract?.fixContract?.fix.tonsOverWeightAmount} x tons </Tag>
                                 <Tag color={detailContract?.fixContract?.madePaymentTonsOverWeightAmount?"#87d068":"#97161a"}  >
                                   {detailContract?.fixContract?.paymentTonsOverWeightAmount*detailContract?.fixContract?.fix.tonsOverWeightAmount} </Tag>
                                </Space>
                            <Space size="small"> 
                                <p><strong>Days Over Time Amount:</strong> </p> 
                                 <Tag color={ "#FFBF00"} > {detailContract?.fixContract?.fix.daysOverTimeAmount} x days</Tag>
                                 <Tag color={detailContract?.fixContract?.madePaymentDaysOverTimeAmount?"#87d068":"#97161a"}  >
                                   {detailContract?.fixContract?.paymentDaysOverTimeAmount*detailContract?.fixContract?.fix.daysOverTimeAmount} </Tag>
                           </Space>
                            
              </Space>                 
              </Card>
               <Divider />
      <Card  title="Contract Information">
          <Row gutter={16}>
                <Col span={6}>                
              <p><strong>Start Date:</strong> {detailContract?.startDate}</p>
              </Col>
              <Col span={6}> 
              <p><strong>End Date:</strong> {detailContract?.endDate}</p>
              </Col>
              <Col span={6}> 
              <p><strong>Removal Date:</strong> {detailContract?.removalDate? detailContract?.removalDate:"-"}</p>
              </Col>
              <Col span={6}> 
              <p><strong>Contract Status:</strong> {detailContract?.contractStatus}</p>
              </Col>
              <Col span={6}> 
              <p><strong>Contract Payment Status:</strong> {detailContract?.contractPaymentStatus}</p>
              </Col>
              <Col span={6}> 
              <p><strong>Description:</strong> {detailContract?.description}</p>
              </Col>
              </Row>
            </Card>
 
</div>
     
    </div>
        </Modal>

         <Modal
          title={ 'Contract Payments'}
          open={modalPaymentsVisible}
          onCancel={handleContractPaymentsCancel}
          footer={null}
           width={800}
         >
          <Form
            form={formPaymentsContract}
            layout="vertical"     
            className='m-12' 
            onFinish={(values) => {handlePaymentsEdit(values)}}    
          >
            <Form.Item
              name="fixContractID"
              hidden
            >
              <Input />
            </Form.Item>

           <Row gutter={8}>
            <Col span={12}>
            <Form.Item
          
                label={
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className='mr-2'>Is Payment Custom Amount</span>
                      <Form.Item   name="madePaymentCustomAmount" valuePropName="checked"  noStyle>
                          <Switch/>
                       </Form.Item>
                       </div>
                       }
           />
             </Col>
            <Col span={12}>
           <Form.Item
                label={
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className='mr-2'>Is Payment Land Fill Cost</span>
                      <Form.Item name="madePaymentLandFillCost" valuePropName="checked" noStyle>
                          <Switch/>
                       </Form.Item>
                       </div>
                       }
           />
            </Col>
           </Row>
           <Row gutter={8}>
             <Col span={12}>
           <Form.Item
             
                label={
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className='mr-2'>Is Payment Tons Over Weight Amount</span>
                      <Form.Item name="madePaymentTonsOverWeightAmount" valuePropName="checked"  noStyle>
                          <Switch/>
                       </Form.Item>
                       </div>
                       }
           />
             </Col>
             <Col span={12}>
           <Form.Item
                label={
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className='mr-2'>Is Payment Days Over Time Amount</span>
                      <Form.Item name="madePaymentDaysOverTimeAmount" valuePropName="checked" noStyle>
                          <Switch/>
                       </Form.Item>
                       </div>
                       }
           />
             </Col>
            </Row>
  
           
           <Form.Item
                label={
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className='mr-2'>Extra Days Or Tons</span>
                      <Form.Item name="extraDaysOrTons" valuePropName="checked" noStyle>
                          <Checkbox onChange={(e)=>{   setExtraDaysOrTons(e.target.checked)}}/>
                       </Form.Item>
                       </div>
                       }
           />
            {extraDaysOrTons == true && (
           <Row gutter={8}>
             <Col span={12}>
           <Form.Item
              label="Tons Over Time Amount"
              name="paymentTonsOverWeightAmount"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber
              placeholder="Tons Over Time Amount" />
            </Form.Item>
             </Col>
             <Col span={12}>
           <Form.Item
              label="Days Over Time Amount"
              name="paymentDaysOverTimeAmount"
              rules={[{ required: true, message: 'Please enter this field' }]}
            >
              <InputNumber
               placeholder="Days Over Time Amount" />
            </Form.Item>
             </Col>
            </Row>)}
           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleContractPaymentsCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update  
                </Button>
              </Space>
            </Form.Item>
            </Form>

           
        </Modal>

         <Modal
          title={ 'Update Contract'}
          open={modalEditVisible}
          onCancel={handleEditContractCancel}
          footer={null}
          width={800}
         >
           <Form
             form={formEditContract}
             layout="vertical"
             onFinish={(values) => {handleContractUpdate(values)}}
           >
             <>
             <Form.Item
              name="contractID"
              hidden
            >
              <Input />
            </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                   <Form.Item
              label="Start Date"
              name="startDate"
               
            >
            <FDatePicker
                  showTime={false}
                  format="YYYY/MM/DD"
                  minDaysFromToday={0}
                  //onChange={date=>{ updateFormData('startDate', date? date.format('YYYY-MM-DD').toString():""); }}
              />
                   </Form.Item>
                </Col> 

                <Col span={12}>
                  <Form.Item
                   label="End Date"
                   name="endDate"              
                   >
            <FDatePicker
                  showTime={false}
                  format="YYYY/MM/DD"
                  minDaysFromToday={0}
                 // onChange={date=>{ updateFormData('endDate', date? date.format('YYYY-MM-DD').toString():""); }}
              />
                 </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                   <Form.Item
              label="Removal Date"
              name="removalDate"               
            >
            <FDatePicker
                  showTime={false}
                  format="YYYY/MM/DD"
                  minDaysFromToday={0}
                  //onChange={date=>{ updateFormData('startDate', date? date.format('YYYY-MM-DD').toString():""); }}
              />
            </Form.Item>
                </Col> 

               
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                   <Form.Item
              label="Contract Payment Status"
              name="contractPaymentStatus"               
            >
              <Select>
              <Select.Option value="PENDING_PAYMENT">Pending payment</Select.Option>
              <Select.Option value="PARTIAL_PAYMENT">Partial payment</Select.Option>
              <Select.Option value="PAID">Paid</Select.Option>
              <Select.Option value="DELAY_PAYMENT">Delay payment</Select.Option>              
              </Select>
                   </Form.Item>
                </Col> 

                <Col span={12}>
                   <Form.Item
              label="Contract Status"
              name="contractStatus"               
            > 
           <Select>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="CANCELLED">Cancelled</Select.Option>              
              </Select>
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
        
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleEditContractCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update  
                </Button>
              </Space>
            </Form.Item>
           
        </Form>
           
        </Modal>

      </Card>
    </div>
  );
}
 

