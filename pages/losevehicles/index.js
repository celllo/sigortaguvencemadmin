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



const LoseVehicles = () => {
    const { user } = useAuthContext();
    const router = useRouter();


 
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownItemRequestStatus, setdropdownItemRequestStatus] = useState(  { name: 'Aktif', code: true },
    );


    const dropdownItemsRequestTypes = [
        { name: 'Aktif', code: true },
        { name: 'Pasif', code: false },
        


      

    ];

    const [dropdownItemRequestType, setDropdownItemRequestType] = useState(null);

   

    const [requesttypedialog, setrequesttypedialog] = useState(false);
    const [selectedrequestid, setselectedrequestid] = useState(null);


    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);
    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState(1);

    const clearFilter1 = () => {
        setGlobalFilterValue1("");
        getrequests(0,"",dropdownItemRequestStatus.code);
        
     };
 
     const onGlobalFilterChange1 = (e) => {
         const value = e.target.value;
        
         setGlobalFilterValue1(value);
         getrequests(page,value,dropdownItemRequestStatus.code);
     };

     const changePage = (newPage) => {
        if(parseInt(newPage) == 0){
            return;

        }
        if(parseInt(newPage) > totalpage){
            return;

        }
        setPage(parseInt(newPage));
        getrequests(newPage,globalFilterValue1,dropdownItemRequestStatus.code);
       }

       const onTypeChange = (e) => {
        setdropdownItemRequestStatus(e);
        setPage(0);
        getrequests(0,globalFilterValue1,e.code);

       

    };

       

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
                <div className="mb-2">
                          <label >Sigorta Durumu </label>
                            <Dropdown id="actiontype" value={dropdownItemRequestStatus} onChange={(e) => {
                                onTypeChange(e.value)}} options={dropdownItemsRequestTypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                          </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Sigorta Sahibi TC" />
                </span>
            </div>
        );
    };
    
    const getrequests = async (page,value,type) => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/vehiclelossrequest?identity=${encodeURIComponent(value)}&page=${encodeURIComponent(page-1)}&size=${encodeURIComponent(10)}&is_checked=${encodeURIComponent(type)}`;

        BaseService.get(url,token).then((object) => {
        //console.log(object);
         if(object.succes){
            setRequest(object.data);
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


       
        getrequests(0,globalFilterValue1,dropdownItemRequestStatus.code);

        

       

    }, []); // eslint-disable-line react-hooks/exhaustive-deps


 
    const updaterequesttypetemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{ setselectedrequestid(rowData.id); setrequesttypedialog(true)} } />
            
        </div>
        
        ;
    };
    const updaterequesttype = async () => {
        setrequesttypedialog(false);
        if(dropdownItemRequestType == null){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen İstek Durumu Seçiniz",
                    
                } 
            );
            return;
        }
       
        setLoading(true);
        var token = "";
       
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/vehiclelossrequest/activepassive?id=${encodeURIComponent(selectedrequestid)}&status=${encodeURIComponent(dropdownItemRequestType.code)}`;
            BaseService.get(url,token).then((data) => {
                console.log(data);
                console.log(url);


                    if(data.succes){
                        setDropdownItemRequestType(null);

                        getrequests(page,globalFilterValue1,dropdownItemRequestStatus.code);

    
                        setLoading(false);

                        }else{
                            showalert({
                            "succes" : false,
                            "error" : data.message
                            
                        });
                        setLoading(false);

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoading(false);
    
                    
                    showalert({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
    
                }) ; 
            
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


  
   
 

   

   

 

   

  

  

   




  

    const statusTypeBodyTemplate = (rowData) => {
        switch(rowData.is_checked) {
            case true:
            return <label  >Aktif</label> ;
            
        case  false:
        return <label>Pasif</label> ;
       
        default:
        return <label>Aktif</label> ;
          }

         
        
    };

   


    const requestusernoBodyTemplate = (rowData) => {
       
        if(rowData.user == null){
            return <label></label> ;

        }
        return <label>{rowData.user.name == null ? "" :rowData.user.name } {rowData.user.surname == null ? "" :rowData.user.surname } TC:{rowData.user.identityNumber} Telefon:{rowData.user.telephone}</label>
        
    };

    
     const DialogFooterRequestType = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setrequesttypedialog(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updaterequesttype()} text autoFocus />
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
                    <h5>Değer Kaybı İstekleri</h5>
                    <DataTable
                        value={request}
                        
                        
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

                        <Column field="id" header="İstek Sahibi Bilgiler"  body={requestusernoBodyTemplate} />
                        <Column field="price" header="Aracın Değeri"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="tramer" header="Tramer"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="modelYear" header="Aracın Kilometresi"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="priceLoss" header="Değer Kaybı"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                        <Column field="id" header="İstek Durumu"  body={statusTypeBodyTemplate} />
                        <Column field="id" header="İstek Durumunu Güncelle"  body={updaterequesttypetemplate} />

                        


                        
                    

                        

                        <Column header="Oluşturulma Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}   />
                        
                        {/* <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  /> */}

                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading} count={totalpage} page={page}   onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>

                    <Dialog header="İstek Durumunu Güncelle" visible={requesttypedialog} onHide={() => setrequesttypedialog(false)} style={{ width: '350px' }} modal footer={DialogFooterRequestType}>
                        

                        <div className="grid formgrid">
    
                       <div className="col-12 mb-2  ">
                       <label >İstek Durumu </label>
                         <Dropdown id="situation" value={dropdownItemRequestType} onChange={(e) => {
                             setDropdownItemRequestType(e.value)}} options={dropdownItemsRequestTypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
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

export default LoseVehicles;



