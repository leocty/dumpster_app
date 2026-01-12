import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  Font,
} from '@react-pdf/renderer'; 
import dayjs from 'dayjs';
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10,
    lineHeight: 1.4,
    position: 'relative',
  },
  section: {
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottom: '3pt solid #EEEEEE',
    paddingBottom: 6,
  },
  companyInfo: {
    flex: 1,
  },
  invoiceDetails: {
    flex: 1,
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#2C3E50',
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#2C3E50',
  },
  address: {
    fontSize: 10,
    marginBottom: 2,
    color: '#666666',
  },
  customerInfo: {
    backgroundColor: '#F9F9F9', 
    borderRadius: 5,
    marginBottom: 3,
  },
  serviceDetails: {
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    borderBottom: '1pt solid #EEEEEE',
    paddingBottom: 3,
    color: '#000000',
  },
  termsList: {
    marginLeft: 15,
    marginBottom: 5,
  },
  termsItem: {
    marginBottom: 3,
  },
  subList: {
    marginLeft: 15,
    marginTop: 4,
  },
  subListItem: {
    marginBottom: 3,
  },
  paymentInfo: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 3,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginBottom: 20,
    border: '1pt solid #DDDDDD',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #DDDDDD',
  },
  tableHeader: {
    backgroundColor: '#F2F2F2',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    flex: 1,
    borderRight: '1pt solid #DDDDDD',
  },
  tableCellLast: {
    padding: 8,
    flex: 1,
  },
  totalRow: {
    backgroundColor: '#F9F9F9',
    fontWeight: 'bold',
  },
  totalDue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 8,
    color: '#E74C3C',
  },
  qrPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#F5F5F5',
    border: '1pt dashed #CCCCCC',    
  },
  bold: {
    fontWeight: 'bold',
  },
  center: {
    textAlign: 'center',
  },
  pageNumber: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666666',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
    alignItems: 'flex-end',
  },
  threeColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  col33: {
    width: '32%',
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 60,  
  }
  , logo: {
    marginRight: 5,
    width: 40,
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 20, 
    left: 20,
    right: 20,
    backgroundColor: '#F8F9FA',
    padding: 5,
    borderTop: '3pt solid #DDDDDD',
  }
});
 
  function formatDate(dateString: string,format: string): string {
  // Day.js puede parsear ISO 8601 automáticamente
   dayjs.locale('en');
   return dayjs(dateString).format(format);;
}
const getTotalDue = (data: any) =>{
 let due=data.fixContract.fix.customAmount+data.fixContract.fix.landFillCost;
  if(data.fixContract.paymentDaysOverTimeAmount>0){
  due+=data.fixContract.fix.daysOverTimeAmount*data.fixContract.paymentDaysOverTimeAmount
  }
 if(data.fixContract.paymentTonsOverWeightAmount>0){
  due+=data.fixContract.fix.tonsOverWeightAmount*data.fixContract.paymentTonsOverWeightAmount
  }
 return due;
}
const PDFGenerate = ({ data }) => (
 <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        
        <Image 
                style={styles.logo}
                src="/logo.png" 
                alt="Logo"
               />
      
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>FW Dumpster LLC</Text>
          <Text style={styles.address}>4735 W Flagler St</Text>
          <Text style={styles.address}>MIAMI, FL 33134 United States</Text>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.invoiceNumber}>Invoice #{data.id.toString().padStart(6, '0')}</Text>
          <Text style={styles.bold}>Issue date</Text>
          <Text>{dayjs().format('MMM D, YYYY')}</Text>
        </View>
      </View>

     <View style={styles.twoColumn}> 
      {/* Customer Information */}
      <View style={[styles.customerInfo, styles.leftColumn]}>
        <Text><Text style={styles.bold}>Customer:</Text>{data.customer.name}</Text>
        <Text><Text style={styles.bold}>Phone:</Text> {data.customer.phone}</Text>
        <Text><Text style={styles.bold}>Address:</Text> {data.workAddress.address}</Text>
      </View>

      {/* Service Details */}
      <View style={[styles.serviceDetails,styles.leftColumn]}>
        <Text><Text style={styles.bold}>Service:</Text> {data.dumpster.size} yd dumpster</Text>
        <Text><Text style={styles.bold}>Duration:</Text>{formatDate(data.startDate,"MMM D, YYYY")} to {formatDate(data.endDate,"MMM D, YYYY")}</Text>
       </View>
      </View>
      {/* Pricing & Payments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing & Payments:</Text>
        <View style={styles.termsList}>
          <Text style={styles.termsItem}>1. Customer agrees to pay {data.fixContract.fix.customAmount+data.fixContract.fix.landFillCost} (base fee) for the {data.dumpster.size} yd. container which includes up to {data.baseWeight} tons of materials as well as any overages incurred due to overloading or additional days requested by the Customer. The containers include up to {data.baseWeight} tons, however due to strict weight limitations and associated dump fees any additional materials will be billed at ${data.fixContract.fix.tonsOverWeightAmount} per ton above {data.baseWeight} tons.</Text>
          <Text style={styles.termsItem}>2. Customer is responsible for any additional fees assessed by the landfill for certain items such as tires, appliances, etc.</Text>
          <Text style={styles.termsItem}>3. The container rental includes use for up to {Math.abs(dayjs(data.startDate).diff(dayjs(data.endDate), 'day'))} days. If the container is kept longer the {Math.abs(dayjs(data.startDate).diff(dayjs(data.endDate), 'day'))} days there will be an additional fee of ${data.fixContract.fix.daysOverTimeAmount} a day.</Text>
          <Text style={styles.termsItem}>4. Payment for all base fees as well as any known additional rental time will be due upon delivery of the container. Any additional fees due to overweight or other fees not paid upon delivery are due within 14 days of container pick up. Any unpaid balance after 7 days will start to accrue 15% interest from the date of container pick up until paid in full. There will be a minimum of a $25 late fee.</Text>
          <Text style={styles.termsItem}>5. If paying by check and the check is returned for insufficient funds from the banking institution the Customer is responsible for any returned check fees.</Text>
        </View>
      </View>

      {/* Dumpster Use Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dumpster Use:</Text>
        <View style={styles.termsList}>
          <Text style={styles.termsItem}>1. While refuse dumpsters are in your possession, you will NOT place or allow to be placed into the dumpster:</Text>
          <View style={styles.subList}>
            <Text style={styles.subListItem}>• Substances Hazardous to health such toxic or corrosive materials or liquids.</Text>
            <Text style={styles.subListItem}>• Liquids of any kind weather contained or not.</Text>
            <Text style={styles.subListItem}>• Cans, drums or other container of any kind unless tempted and crushed and incapable of carrying any liquid.</Text>
            <Text style={styles.subListItem}>• Medical waste or animal carcasses of any kind.</Text>
            <Text style={styles.subListItem}>• Any material not listed above however considered unsuitable for containment e.g., malodorous waste: asbestos, paint, tries, gas bottle, fluorescent tubes, light bulbs, vehicle batteries, household appliances such as but not limited to refrigerators, conventional ovens. microwave ovens, washer, dryer.</Text>
            <Text style={styles.subListItem}>• Extremely heavy material such as rock, dirt, or concrete. Please let us know and we can help you dispose of such heavy items in a more efficient manner.</Text>
          </View>
          <Text style={styles.termsItem}>2. All refuse shall remain within the confines of the dumpster and shall not exceed the top or sides. Every attempt shall be taken to equally disperse the weight of the refuse within the dumpster.</Text>
          <Text style={styles.termsItem}>3. Customer shall be liable for any loss or damage to rented equipment in excess of reasonable wear and tear.</Text>
        </View>
      </View>

      {/* Access and Ground Conditions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Access and Ground Conditions:</Text>
        <View style={styles.termsList}>
          <Text style={styles.termsItem}>1. The Customer will be responsible for the provision of free and suitable access to and from the delivery site (including the removal and reinstatement of local obstructions) and for ensuring suitable ground conditions.</Text>
        </View>
      </View>

      
    
        <View style={[styles.threeColumn, { backgroundColor: '#F0F8FF', padding: 8 }]}>
        <View style={[styles.col33, { alignItems: 'center' }]}>
          <Text style={styles.label}>Customer</Text>
          <Text>{data.customer.name}</Text>
          <Text>{data.customer.phone}</Text>
        </View>
        <View style={[styles.col33, { alignItems: 'center' }]}>
          <Text style={styles.label}>Invoice</Text>
          <Text>PDF created {dayjs().format('MMM D, YYYY')}</Text>
          <Text style={{ fontWeight: 'bold' }}>#{data.id.toString().padStart(6, '0')}</Text>
        </View>
        <View style={[styles.col33, { alignItems: 'center' }]}>
          <Text style={styles.label}>Payment</Text>
          <Text>Due {dayjs().format('MMM D, YYYY')}</Text>
          <Text>${getTotalDue(data)}</Text>
        </View>        
      </View>
      </View>
      {/*Footer*/}
      
       <View style={styles.footer}>
        <View style={[styles.threeColumn, { display: 'flex', alignItems: 'flex-start'},styles.footer]}>
           <View style={styles.qrPlaceholder}>
            <Text>[QR Code Space]</Text>
          </View>
          <View>
            <Text style={styles.bold}>Pay online</Text>
            <Text>To pay your invoice go to https://squareup.com/u/ill.juffBS</Text>
            <Text>Or open the camera on your mobile device and place the QR code in the camera's view.</Text>
          </View>
       </View>
         <Text style={styles.pageNumber}>Page 1 of 2</Text>
       </View>
       
       
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
       
      {/* Header */}
      <View style={styles.header}>
        
        <Image 
                style={styles.logo}
                src="/logo.png" 
                alt="Logo"
               />
      
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>FW Dumpster LLC</Text>
          <Text style={styles.address}>4735 W Flagler St</Text>
          <Text style={styles.address}>MIAMI, FL 33134 United States</Text>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.invoiceNumber}>Invoice #{data.id.toString().padStart(6, '0')}</Text>
          <Text style={styles.bold}>Issue date</Text>
          <Text>{dayjs().format('MMM D, YYYY')}</Text>
        </View>
      </View>


      {/* Items Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Items</Text>
          <Text style={styles.tableCell}>Quantity</Text>
          <Text style={styles.tableCell}>Price</Text>
          <Text style={styles.tableCellLast}>Amount</Text>
        </View>
        
        {/* Table Rows */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Custom Amount</Text>
          <Text style={styles.tableCell}>1</Text>
          <Text style={styles.tableCell}>${data.fixContract.fix.customAmount+data.fixContract.fix.landFillCost}</Text>
          <Text style={styles.tableCellLast}>${data.fixContract.fix.customAmount+data.fixContract.fix.landFillCost}</Text>
        </View>
        
         { data.fixContract.paymentDaysOverTimeAmount>0 && (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{data.fixContract.paymentDaysOverTimeAmount} days overweight x ${data.fixContract.fix.daysOverTimeAmount}</Text>
          <Text style={styles.tableCell}>1</Text>
          <Text style={styles.tableCell}>${data.fixContract.paymentDaysOverTimeAmount*data.fixContract.fix.daysOverTimeAmount}</Text>
          <Text style={styles.tableCellLast}>${data.fixContract.paymentDaysOverTimeAmount*data.fixContract.fix.daysOverTimeAmount}</Text>
        </View>
         )}
         { data.fixContract.paymentTonsOverWeightAmount>0 && (
         <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{data.fixContract.paymentTonsOverWeightAmount} tons overweight x ${data.fixContract.fix.tonsOverWeightAmount} </Text>
          <Text style={styles.tableCell}>1</Text>
          <Text style={styles.tableCell}>${data.fixContract.paymentTonsOverWeightAmount*data.fixContract.fix.tonsOverWeightAmount}</Text>
          <Text style={styles.tableCellLast}>${data.fixContract.paymentTonsOverWeightAmount*data.fixContract.fix.tonsOverWeightAmount}</Text>
        </View>
         )}

        <View style={[styles.tableRow, styles.totalRow]}>
          <Text style={styles.tableCell}>Subtotal</Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCellLast}>${getTotalDue(data)}</Text>
        </View>
      </View>

      {/* Total Due */}
      <View style={styles.totalDue}>
        <Text>Total Due: ${getTotalDue(data)}</Text>
      </View>
</View>
       <View style={styles.footer}>
        <View style={[styles.threeColumn, { display: 'flex', alignItems: 'flex-start'},styles.footer]}>
           <View style={styles.qrPlaceholder}>
            <Text>[QR Code Space]</Text>
          </View>
          <View>
            <Text style={styles.bold}>Pay online</Text>
            <Text>To pay your invoice go to https://squareup.com/u/ill.juffBS</Text>
            <Text>Or open the camera on your mobile device and place the QR code in the camera's view.</Text>
          </View>
       </View>
         <Text style={styles.pageNumber}>Page 1 of 2</Text>
       </View>

    </Page>
  </Document>
);

export default PDFGenerate;


