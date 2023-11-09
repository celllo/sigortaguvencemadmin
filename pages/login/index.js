'use client'
import { useRouter } from 'next/router';
import React, { useContext, useState,useEffect } from 'react';
import AppConfig from '@/layout/AppConfig';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { CircularProgress, Alert, Snackbar } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import signIn from "@/firebasefile/auth/signin";
import Head from 'next/head';
import Image from 'next/image';
import myGif from '@/public/layout/images/loading.gif'




        

const LoginPage = () => {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errormessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open , setOpen] = useState(false);




    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const handleForm = async (event) => {
        localStorage.clear();

        setErrorMessage(null)
        setLoading(true);
        const { result, error } = await signIn(email, password);
        setLoading(false);
        


        if (error) {
            setErrorMessage(error);
            return ;
        }

        // else successful
        return router.push("/")
       
    }
    useEffect(() => {

        if (typeof window !== 'undefined' && window.localStorage) {
            let username = localStorage.getItem('user');

            if(username){
setOpen(true);
            }
            
          
            
          }
      
        
        


    }, []); 
    
    return (
        <>
        <Head>
        <title>Giriş Yap</title>
        <meta name="description" content="Mobil App Admin Paneli" />
        
      </Head>
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
             <img src={`/layout/images/icon3.png`} height={100} width={250} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />

                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Hoşgeldiniz!</div>
                            <span className="text-600 font-medium">Devam Etmek İçin Giriş Yapın</span>
                        </div>

                        <div>
                        <Dialog closable={false} visible={loading} style={{ width: '250px', height: "250px" }}  >
                        
                    
                        {/* <CircularProgress style={{'color': 'yellow'}}/> */}
                      
                        <Image
                        style = {{display: "block",
                            margin: "0 auto",
                           
                             }}
  src={myGif}
  priority={true} 
width={175}
height={175}
 
  alt={`loading`}
  unoptimized={true}
/>


                       
                        </Dialog>
                        {errormessage && <Alert severity="error">{errormessage}</Alert>}
                        <Snackbar open={open} autoHideDuration={3000} onClose={() => {setOpen(false);  localStorage.clear();
}}>
  <Alert severity="error" sx={{ width: '100%' }}>
   Giriş İçin Yetkiniz Yok!
  </Alert>
</Snackbar>
                            <label  className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText inputid="email1" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}  className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label  className="block text-900 font-medium text-xl mb-2">
                                Şifre
                            </label>
                            <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" feedback={false}></Password>

                           
                            <Button label="Giriş Yap" className="w-full p-3 text-xl" onClick={() => handleForm()} >

                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;