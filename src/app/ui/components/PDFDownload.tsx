import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFGenerate from './PDFGenerate';
 

const PDFDownload = ({ data }) => (
  <PDFDownloadLink
    document={<PDFGenerate data={data} />}
    fileName={"Contract " +data.customer.name+" PDF.pdf"}
    className="bg-green-500 text-white px-4 py-2 rounded"
  >
    {({ loading }) => 
      loading ? 'Generate PDF...' : 'Download PDF'
    }
  </PDFDownloadLink>
);

export default PDFDownload;