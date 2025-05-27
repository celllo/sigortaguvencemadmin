import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { BrandsService } from '@/service/BrandsService';
import { BaseService } from '@/service/BaseService';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { CircularProgress, Alert,Pagination } from '@mui/material';
import { Checkbox } from 'primereact/checkbox';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog';
import { JsonViewer } from '@textea/json-viewer'



const LoggerX = () => {
    const { user } = useAuthContext();
    const router = useRouter();


 
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(null);
    const [dropdownItemlogsStatus, setdropdownItemlogsStatus] = useState(  { name: 'Hepsi', code: '' },
    );


    const dropdownItemslogsTypes = [
        { name: 'Hepsi', code: '' },

        { name: 'Allianz', code: 'allianzWorker' },
     { name: 'Raynet', code: 'raynetWorker' },

        { name: 'Quick', code: 'quickHelper' },
        { name: 'Main', code: 'main' },

        { name: 'Satın Alma', code: 'buyOnlineLogger' },
        { name: 'Common', code: 'commonWorker' },

     


      

    ];

    const [dropdownItemlogsType, setDropdownItemlogsType] = useState(null);

   



    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);
    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState(1);

    const clearFilter1 = () => {
        setGlobalFilterValue1("");
        getlogs(0,"",dropdownItemlogsStatus.code);
        
     };
 
     const onGlobalFilterChange1 = (e) => {
         const value = e.target.value;
        
         setGlobalFilterValue1(value);
         getlogs(page,value,dropdownItemlogsStatus.code);
     };

     const changePage = (newPage) => {
        if(parseInt(newPage) == 0){
            return;

        }
        if(parseInt(newPage) > totalpage){
            return;

        }
        setPage(parseInt(newPage));
        getlogs(newPage,globalFilterValue1,dropdownItemlogsStatus.code);
       }

       

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
                <div className="mb-2">
                          <label >Servis </label>
                            <Dropdown id="actiontype" value={dropdownItemlogsStatus} onChange={(e) => {
                                onTypeChange(e.value)}} options={dropdownItemslogsTypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                          </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Mesaj" />
                </span>
            </div>
        );
    };

    const renderHeader2 = () => {
        return (
            <div className="flex justify-content-between">
                <label> Log İçeriği </label>
            </div>
        );
    };
    const onTypeChange = (e) => {
        setdropdownItemlogsStatus(e);
        getlogs(0,globalFilterValue1,e.code);
    };
    const getlogs = async (page,value,status) => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/logx?message=${encodeURIComponent(value)}&service=${encodeURIComponent(status)}&page=${encodeURIComponent(page-1)}&size=${encodeURIComponent(10)}`;

        BaseService.get(url,token).then((object) => {
        //console.log(object);
         if(object.succes){
            setLogs(object.data);
            setTotalpage(object.totalPages);

    
            
             setLoading(false);
    
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

 

  
      

    useEffect(() => {


       
        getlogs(0,globalFilterValue1,dropdownItemlogsStatus.code);

        

       

    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    

  







 

  
    function formatingDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric',day: 'numeric',hour: 'numeric',minute:'numeric' };
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
    const deleteTemplate = (rowData) => {
        return   <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
        ;
    };

 

   
   
    const serviceTypeBodyTemplate = (rowData) => {
        switch(rowData.service) {
        
            
        case  "quickHelper":
        return <label>Quick</label> ;
        case "raynetWorker":
        return <label  >Raynet</label> ;
        case "buyOnlineLogger":
        return <label  >Satın Alma</label> ;
        case "main":
        return <label  >Main</label> ;
        case "allianzWorker":
        return <label  >Allianz</label> ;
        case "commonWorker":
        return <label  >Common</label> ;
        default:
        return <label></label> ;
          }
        
    };

    const UserBodyTemplate = (rowData) => {
       
        if(rowData.user == null){
            return <label></label> ;

        }
        return <label>{rowData.user.name == null ? "" :rowData.user.name } {rowData.user.surname == null ? "" :rowData.user.surname } TC:{rowData.user.identityNumber} Telefon:{rowData.user.telephone}</label>
        
    };

   




     const rowExpansionTemplate = (rowData) => {
        
        if(rowData.meta == null){
            return <label></label> ;

        }
        return <JsonViewer value={rowData.meta} displayDataTypes={false}  displaySize={false}/>
       // return <label>{JSON.stringify(rowData.meta)}</label>
        
    };
   

  
    const header1 = renderHeader1();

   

   


    return (
        <div>
 

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Logs</h5>
                    <DataTable
                        value={logs}
                        
                        
                        rows={10}
                        dataKey="id"
                       
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="İstek Bulunamadı."
                        header={header1}

                        expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate}
                    >
                                                <Column expander style={{ width: '3em' }} />
                        <Column field="id" header="Id" />
                        <Column field="id" header="Servis Türü"  body={serviceTypeBodyTemplate} />
                        <Column field="message" header="Mesaj"   />

                        <Column field="userId" header="user Id"   />
                        <Column field="id" header="User"  body={UserBodyTemplate} />
                        <Column field="requestId" header="request Id"   />

                        <Column field="requestversionId" header="requestversion Id"   />
                        <Column field="proposalId" header="proposal Id"   />
                        <Column field="insuranceId" header="insurance Id"   />


                        
                    

                        

                        <Column header="Oluşturulma Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}   />
                        

                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading} count={totalpage} page={page}   onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>
x

                    
                </div>
            </div>
            </div>


            
            
            </div>
           
    );
};

export default LoggerX;



