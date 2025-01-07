import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { BaseService } from '@/service/BaseService';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { CircularProgress, Alert } from '@mui/material';
import { Checkbox } from 'primereact/checkbox';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog';



const AddUser = () => {
    const { user } = useAuthContext();
    const router = useRouter();


    const [filters1, setFilters1] = useState(null);
    const [loading2, setLoading2] = useState(false);
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 







    const [phone, setPhone] = useState('');
    const [tcno, setTcNo] = useState('');

    
  

    const [calendarValue, setCalendarValue] = useState(null);




   






    const [loading, setLoading] = useState(false);










 


    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);

    const [sucessvisible, setsucessvisible] = useState(false);
    const [success, setsuccess] = useState(null);

 



    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

   
    const setbirthdate = (e) => {

        setCalendarValue(e.value);
    };
    

   

  


    const createuser = async () => {
       
        if(tcno == null || tcno == ""){
            showalert(
             {
                    "succes" : false,
                    "error" : "Lütfen Tc No Giriniz",
                    
                } 
            );
            return;
        }
        if(tcno.length != 11){
            showalert(
             {
                    "succes" : false,
                    "error" : "Lütfen Tc No 11 Hane Olacak Şekilde Giriniz",
                    
                } 
            );
            return;
        }
    
        if(phone == null || phone == ""){
            showalert(
             {
                    "succes" : false,
                    "error" : "Lütfen Telefon Numarasını Giriniz",
                    
                } 
            );
            return;
        }
        if(phone.length != 10){
            showalert(
             {
                    "succes" : false,
                    "error" : "Lütfen Telefon Numarasını (5**) *** ** ** Şeklinde Giriniz",
                    
                } 
            );
            return;
        }
    
        if(calendarValue == null){
            showalert(
             {
                    "succes" : false,
                    "error" : "Lütfen Doğum Tarihini Seçiniz",
                    
                } 
            );
            return;
        }
     setLoading(true);
     var body = {};
       
            body = JSON.stringify(
                {
                    "tel": phone,
                    "identity": tcno,
                    "birthDate": calendarValue.toISOString(),
                }
            )
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/request/checkforother`;
        //console.log(body);

        BaseService.post(url,body,token).then((object) => {
       //console.log(object.data);
         if(object.succes){
            setTcNo("");
            setPhone("");
            setCalendarValue(null);
            setLoading(false);

            showsucces({
                "message" :  "Kullanıcı Başarıyla Oluşturulmuştur"
            })
            
    
             }else{
            showalert(object);
            setLoading(false);
    
    
             }
    
        
     }).catch((message) => {
        setLoading(false);

        showalert({
            "succes" : false,
            "error" : message.toString()
            
        });
        // console.log(error);
    
    
     }); 
    });
      
    
       }
      

         
       
     

       const showalert = (neweeror) => {
        seterror(neweeror);


        seterrorvisible(true);

       setTimeout(() => {
        seterror(null);
        seterrorvisible(false);

      } , 3000);
    };

    const showsucces = (neweeror) => {
        setsuccess(neweeror);


        setsucessvisible(true);

       setTimeout(() => {
        setsuccess(null);
        setsucessvisible(false);

      } , 3000);
    };

    useEffect(() => {
        
       
        if(router.isReady){
            
          
          
    
           
    

            
         }
      }, [router.isReady]);
      


  

   
  


  
   




    
  
    function formatingDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }
    const formatDate = (value) => {
     
       
        
var xx =  formatingDate(value);
        
        return xx;
    };

   
  

 




   

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };

    const dateEndBodyTemplate = (rowData) => {
        return formatDate(rowData.endDate);
    };

    

 
   
   

  

   

   


    return (
        <div>
 <Dialog closable={false} visible={loading} style={{ width: '200px', height: "200px" }}  >
                    <div style={{top: "75px", left: "75px" , width : "50px", height: "50px", position: "absolute"} }> 
                    <CircularProgress />
                    </div>
                    </Dialog>
                    <Dialog  visible={errorvisible} onHide={() => seterrorvisible(false)} style={{ width: '350px' }} modal >
                    <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />

                    <label>{error == null ? "" :  error.error}</label>
                    </div>
                    </Dialog>

                    <Dialog  visible={sucessvisible} onHide={() => setsucessvisible(false)} style={{ width: '350px' }} modal >
                    <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-check mr-3" style={{ fontSize: '2rem' }} />

                    <label>{success == null ? "" :  success.message}</label>
                    </div>
                    </Dialog>


 <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Kullanıcı Bilgileri</h5>
                        </div>
                        </div>
                        <div className="p-fluid formgrid grid">

                        <div className="field col-12 md:col-6">
                        <label htmlFor="chasisno">Kullanıcı Tc No</label>
                            <InputNumber value={tcno} id="tcno" type="text"onChange={(e)=> setTcNo(e.value)} useGrouping={false} />
                        </div>
                        <div className="field col-12 md:col-6"/>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="motorno">Telefon  Numarası</label>
                            <InputNumber value={phone} id="plateno" type="text"onChange={(e)=> setPhone(e.value)} useGrouping={false} />
                        </div>
                        <div className="field col-12 md:col-6"/>
                        <div className="field col-12 md:col-6">
                    <label htmlFor="name">Doğum Tarihi </label>
                    <Calendar showIcon showButtonBar dateFormat="dd/mm/yy" value={calendarValue} onChange={setbirthdate}></Calendar>
                    </div>
                       
                        <div className="field col-12 md:col-6"/>

                        <div className="field col-12 md:col-4"> 
</div>               
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Kullanıcı Ekle" outlined onClick={() =>createuser()} />
</div>
                        </div>
                        </div>

                </div>



            
            </div>
    
           
    );
};

export default AddUser;



