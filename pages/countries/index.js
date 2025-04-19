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



const Countries = () => {
    const { user } = useAuthContext();
    const router = useRouter();


 
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [counrty, setCountry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownItemRequestStatus, setdropdownItemRequestStatus] = useState(  { name: 'Aktif', code: true },
    );


    const dropdownItemsRequestTypes = [
        { name: 'Aktif', code: true },
        { name: 'Pasif', code: false },
        


      

    ];

    const [name, setname] = useState("");
    const [code, setcode] = useState("");
    const [quickcode, setquickcode] = useState("");
    const [scope, setscope] = useState("");
    const [order, setorder] = useState("");



    const [dropdownItemRequestType, setDropdownItemRequestType] = useState(null);

   

    const [selectedcountry, setselectedcountry] = useState(null);
    const [selectedcountrydialog, setselectedcountrydialog] = useState(false);


    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);
    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState(1);

    const clearFilter1 = () => {
        setGlobalFilterValue1("");
        getcountries(0,"");
        
     };
 
     const onGlobalFilterChange1 = (e) => {
         const value = e.target.value;
        
         setGlobalFilterValue1(value);
         getcountries(page,value);
     };

     const changePage = (newPage) => {
        if(parseInt(newPage) == 0){
            return;

        }
        if(parseInt(newPage) > totalpage){
            return;

        }
        setPage(parseInt(newPage));
        getcountries(newPage,globalFilterValue1);
       }

       const onTypeChange = (e) => {
        setdropdownItemRequestStatus(e);
        setPage(0);
        getcountries(0,globalFilterValue1);

       

    };

       

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
               
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Ülke Adı" />
                </span>
            </div>
        );
    };
    
    const getcountries = async (page,value) => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/travelcountry?name=${encodeURIComponent(value)}&page=${encodeURIComponent(page-1)}&size=${encodeURIComponent(10)}`;

        BaseService.get(url,token).then((object) => {
        //console.log(object);
         if(object.succes){
            setCountry(object.data);
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


       
        getcountries(0,globalFilterValue1);

        

       

    }, []); // eslint-disable-line react-hooks/exhaustive-deps


 
    const updatecodetemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{ setselectedcountry(rowData.id); setselectedcountrydialog(true)} } />
            
        </div>
        
        ;
    };
    const updatecountry = async () => {
        var body = {"id" : selectedcountry};
    
        
           
        if(name != null && name != ""){
           body.name = name;
        }
        if(code != null && code != ""){
          body.code = code;
        }

        if(quickcode != null && quickcode != ""){
            body.quickCode = quickcode;
          }
        if(scope != null && scope != ""){
            body.scope = scope;
          }
          if(order != null && order != ""){
            body.order = order;
          }
       
       
        setselectedcountrydialog(false)
        setLoading(true);
        
        body = JSON.stringify(body);
     
    
        
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
        const url = `${baseUrl}/travelcountry`;
        BaseService.put(url,body,token).then((object) => {
            // console.log(object);
             if(object.succes){
                setname("");
                setcode("");
                setcode("");
                setquickcode("");
                setscope("");
                setorder("");

    
                        
    
                       
    
                        
                getcountries(page,globalFilterValue1);
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


  
   
 

   

   

 

   

  

  

   




  

  

   



    
     const DialogFooterUpdate = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setselectedcountrydialog(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updatecountry()} text autoFocus />
        </>
    );
   
   

   
    //  const rowExpansionTemplate = (rowData) => {
        
    //     return (
    //         <div className="orders-subtable">
    //              <div className="grid formgrid">
               
                        
                      
                 
                    
    //                 {rowData.vehicle == null ?
    //             <div className="col-12 mb-2 lg:col-4 lg:mb-0">
    //             <></>
    //         </div> :
    //             <DataTable value={rowData.vehicle.vehicleparts} responsiveLayout="scroll">
    //                 <Column field="name" header="Parça Adı"  ></Column>

    //                 <Column field="selectedStatusName" header="Durumu"  ></Column>
                   

                   
    //             </DataTable>  }
    //         </div>
    //         </div>
    //     );
    // };
   

  
    const header1 = renderHeader1();

   

   


    return (
        <div>
 

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ülkeler</h5>
                    <DataTable
                        value={counrty}
                        
                        
                        rows={10}
                        dataKey="id"
                       
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="İstek Bulunamadı."
                        header={header1}

                        // expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate}
                    >
                                                {/* <Column expander style={{ width: '3em' }} /> */}
                         {/* <Column field="id" header="ID"   /> */}

                        <Column field="id" header="ID"  />
                        <Column field="name" header="Ülke Adı"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="code" header="Kod"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="quickCode" header="Quick Kod"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="scope" header="Scope"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="order" header="Order"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />

                        <Column field="id" header="Kodları Güncelle"  body={updatecodetemplate} />

                        


                        
                    

                        

                        <Column header="Oluşturulma Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}   />
                        
                        {/* <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  /> */}

                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading} count={totalpage} page={page}   onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>



                      <Dialog header="Ülkeyi Güncelle"  visible={selectedcountrydialog} onHide={() => setselectedcountrydialog(false)} style={{ width: '350px' }} modal footer={DialogFooterUpdate}>
                                             
                     
                                                <div className="grid formgrid">
                                                <div className="col-12 mb-2">
                                             
                                                     <span>Lütfen Bilgileri Giriniz </span>
                                                     
                     
                                                 </div>
                                             
                                             <div  className="col-12 mb-2"> 
                                                 <label >Ülke Adı </label>
                                                 
                                             <InputText id="name" value={name} type="text" onChange={(e)=> setname(e.target.value)}/>
                                             </div>
                     
                                             <div  className="col-12 mb-2"> 
                                                 <label >Ülke Kodu</label>
                                                 
                                             <InputText id="code" value={code} type="text" onChange={(e)=> setcode(e.target.value)}/>
                                             </div>
                     
                                             <div  className="col-12 mb-2"> 
                                                 <label >Quick Ülke Kodu </label>
                                                 
                                             <InputText id="quickcode" value={quickcode} type="text" onChange={(e)=> setquickcode(e.target.value)}/>
                                             </div>
                     
                                             <div  className="col-12 mb-2"> 
                                                 <label >Scope </label>
                                                 
                                             <InputText id="scope" value={scope} type="text" onChange={(e)=> setscope(e.target.value)}/>
                                             </div>
                     
                                             <div  className="col-12 mb-2"> 
                                                 <label >Order </label>
                                                 
                                             <InputText id="order" value={order} type="text" onChange={(e)=> setorder(e.target.value)}/>
                                             </div>
                                             
                                            
                                               </div>
                                             
                                             </Dialog>

                     <Dialog  visible={errorvisible} onHide={() => seterrorvisible(false)} style={{ width: '350px' }} modal >
                        <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />

                                <label>{error == null ? "" :  error.error}</label>
                            </div>
                        </Dialog>


                </div>
            </div>
            </div>


            
            
            </div>
           
    );
};

export default Countries;



