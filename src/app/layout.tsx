 
 'use client'
import "./globals.css";   
import '@ant-design/v5-patch-for-react-19';

 


export default  function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {   
  
    return (
        <html>
        <body className="min-h-screen bg-gray-100 text-gray-900">
        <div>{children}</div> 
        </body>
        </html>
    );
}