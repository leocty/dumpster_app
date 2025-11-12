"use client";
import {  useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/hooks/useAuth';
import { Button, Form, Input, Layout, message, Spin } from "antd";
import React from "react";
import Image from "next/image";
import axios from "axios";

export default function LoginPage() { 
 const [messageApi, contextHolder] = message.useMessage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { user, login, logout } = useAuth();
    const [form] = Form.useForm();
   React.useEffect(() => {
    setLoading(false);
    logout();
   }, []);

    const handleSubmit = async () => {
        setLoading(true);
       
         try{
            await login(username,password);
            router.push("/dashboard/reports");           
         }catch (error) { 
            if (axios.isAxiosError(error)) {
            messageApi.error(error.message);
          
            }
            
          setLoading(false);
         }   
    };

      if (loading) {
        return (<Layout> {contextHolder}<Spin 
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
       <Layout >  
        {contextHolder}
         <div className="flex min-h-screen mt:300"> 
      <div className="relative w-1/2 hidden lg:block">
        <Image
          src="/dumpster_background .png"  
          alt="Dumpster Rental"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
       
       <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-6">
         
          <div className="text-center">
           
            <Image
             src="/dumpster_rental_logo.svg"  
             alt="Dumpster Rental"
             priority
             width={360}
             height={150}
             />
            <p className="text-gray-500">Log in to continue...</p>
          </div>
         <Form
            form={form}
            className="space-y-4"
            layout="vertical"
            onFinish={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <Form.Item
               name="username"
              rules={[
                { required: true, message: 'Please enter your User Name' } 
              ]}
            >
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                size="large"
                placeholder="User Name" />
            </Form.Item>   
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Form.Item
               name="password"
              rules={[
                { required: true, message: 'Please enter your Password' } 
              ]}
            >
              <Input 
               type="password" 
                placeholder="********"
                value={password} 
                size="large"
                onChange={(e) => setPassword(e.target.value)}  />

            </Form.Item>
               
            </div>
          
              <Button
              type="primary"  
              size="large" 
              htmlType="submit" 
              className="w-full"  >
                   Log in
                </Button>
         </Form>

             
          {/*
          <div className="flex justify-between text-sm text-gray-500">
            <a href="#" className="hover:underline">
              Crear cuenta
            </a>
            <a href="#" className="hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>*/}
        </div>
      </div>
        </div>
         
         </Layout>
    );
   
}
 