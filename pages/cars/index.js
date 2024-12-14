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



const Cars = () => {
    const { user } = useAuthContext();
    const router = useRouter();


 
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [globalFilterValueplate, setGlobalFilterValuePlate] = useState('');

 

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(null);
    const [dropdownItemRequestStatus, setdropdownItemRequestStatus] = useState(  { name: 'İncelemede', code: 'inreview' },
    );


    const dropdownItemsRequestTypes = [
        { name: 'Teklif Sürecinde', code: 'proposed' },
        { name: 'İncelemede', code: 'inreview' },
        { name: 'Talep Geri Alındı', code: 'deleted' },
        { name: 'Süreçte Değil', code: 'cannotprocess' },
        { name: 'Reddedildi', code: 'denied' },
        { name: 'Kabul Edildi', code: 'accepted' },
        { name: 'Admin Tarafından Silindi', code: 'deletedbyadmin' }


      

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
        setGlobalFilterValuePlate("");

        getcars(1,"","");
        
     };
 
     const onGlobalFilterChange1 = (e) => {
         const value = e.target.value;
        
         setGlobalFilterValue1(value);
         getcars(page,value,globalFilterValueplate);
     };
     const onGlobalFilterChangePlate = (e) => {
        const value = e.target.value;
       
        setGlobalFilterValuePlate(value);
        getcars(page,globalFilterValue1,value);
    };

     const changePage = (newPage) => {
        if(parseInt(newPage) == 0){
            return;

        }
        if(parseInt(newPage) > totalpage){
            return;

        }
        setPage(parseInt(newPage));
        getcars(newPage,globalFilterValue1,globalFilterValueplate);
       }

       

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
                {/* <div className="mb-2">
                          <label >İstek Türü </label>
                            <Dropdown id="actiontype" value={dropdownItemRequestStatus} onChange={(e) => {
                                onTypeChange(e.value)}} options={dropdownItemsRequestTypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                          </div> */}
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Sigorta Sahibi TC" />
                </span>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValueplate} onChange={onGlobalFilterChangePlate} placeholder="Plaka" />
                </span>
            </div>
        );
    };
    const renderHeaderUser = () => {
        return (
            <div className="flex justify-content-between">
                Araç Kullanıcıları
            </div>
        );
    };
    const onTypeChange = (e) => {
        setdropdownItemRequestStatus(e);
        getcars(1,globalFilterValue1,e.code);
    };
    const getcars = async (page,value,status) => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/car?identity=${encodeURIComponent(value)}&plate=${encodeURIComponent(status)}&page=${encodeURIComponent(page-1)}&size=${encodeURIComponent(10)}`;
        //console.log(url);

        BaseService.get(url,token).then((object) => {
        //console.log(object);
         if(object.succes){
            setCars(object.data);
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

    const sendNotif = async (identityNumber) => {
       
        var body = {};

       
            body = JSON.stringify({
                "body" : "Teklif Detaylarınıza Geçmiş Sigorta Sorgularım bölümünden ulaşabilirsiniz.",
    "title": "Teklifiniz Oluşturuldu",
    "topic" : identityNumber
            } );
        
        
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/notifs`, {
            method: "POST",
             body: body,   
            headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
                .then(data => {
                    if(data.succes){
                       
    
        
                        }else{
                            showalert({
                                "succes" : false,
                                "error" : "Bildirim Gönderilemedi",
                                
                            } );

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    
                    showalert({
                        "succes" : false,
                        "error" : "Bildirim Gönderilemedi",
                        
                    } );
    
                }) ; });
      }

  
      

    useEffect(() => {


       
        getcars(1,globalFilterValue1,globalFilterValueplate);

        

       

    }, []); // eslint-disable-line react-hooks/exhaustive-deps


     /// is checked 
     const switchTemplate = (rowData) => {
       

        return (
            
         <InputSwitch checked={rowData.is_checked} onChange={(e) =>{ 
           

            updateswitch(e.value,rowData.id);
        }} />
            
        );
    };

    const updateswitch= async (newvalue,newid) => {
        setLoading(true);

            const url = `${baseUrl}/service/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
                BaseService.get(url,token).then((data) => {
                if(data.succes){
                getservices();

                }else{
                showalert(data);
               setLoading(false);


                }
               // setUploadedFile([data]);
              })
              .catch((message) => {
                setLoading(false);

                showalert({
                    "succes" : false,
                    "error" : message.toString()
                    
                });


              }); 
            });
          
    }


 
    const onleadingCheckboxChange = (e) => {
        setleadingcheckbox(e.checked);
    
    };




 

  
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
    const deleteTemplate = (rowData) => {
        return   <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
        ;
    };

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const detayTemplate = (rowData) => {
       return <Button style={{margin: "5px"}} type="button" label="Güncelle" onClick={() => {
                    
            router.push(`/cars/${rowData.id}`);
                           }} />
    };
    const notifTemplate = (rowData) => {
        return <Button style={{margin: "5px"}} type="button" label="Bildirim Gönder" onClick={() => {
                     
             sendNotif(rowData.createdUser.identityNumber);
                            }} />
     };
    const proposalTypeBodyTemplate = (rowData) => {
        switch(rowData.status) {
        
            
        case  "proposed":
        return <label>Teklif Sürecinde</label> ;
        case "denied":
        return <label  >Reddedildi</label> ;
        case "accepted":
        return <label  >Kabul Edildi</label> ;
        case "deletedbyadmin":
        return <label  >Admin Tarafından Silindi</label> ;
        default:
        return <label>Teklif Sürecinde</label> ;
          }
        
    };

   

   

 

   

  

    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.is_checked, 'text-pink-500 pi-times-circle': !rowData.is_checked })}></i>;
    };

    const verifiedFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };

   




    const imageBodyTemplate = (rowData) => {
        return <img src={`${fileUrl}${rowData.path}`} onError={(e) => (e.target.src = `${errorImageUrl}`)} alt={rowData.path} className="shadow-2" width={100} />;
    };


    const carModelBodyTemplate = (rowData) => {
        if(rowData.carmodel == null){
            return <label  >Marka Bulunamadı</label> ;

        }else{
            return <label  >{rowData.carmodel.code}-{rowData.carmodel.name}</label> ;

        }
       
        
    };
    const carModelTypeBodyTemplate = (rowData) => {
        if(rowData.carmodeltype == null){
            return <label  >Araba Modeli Bulunamadı</label> ;

        }else{
            return <label  >{rowData.carmodeltype.code}-{rowData.carmodeltype.name}</label> ;

        }
       
        
    };

    const carUsageTypeBodyTemplate = (rowData) => {
        if(rowData.carusagetype == null){
            return <label  >Kullanım Tarzı Bulunamadı</label> ;

        }else{
            return <label  >{rowData.carusagetype.code}-{rowData.carusagetype.name}</label> ;

        }
       
        
    };

    const carUsageSubstancesBodyTemplate = (rowData) => {
        if(rowData.carusagesubstance == null){
            return <label  >Kullanım Amacı Bulunamadı</label> ;

        }else{
            return <label  >{rowData.carusagesubstance.code}-{rowData.carusagesubstance.name}</label> ;

        }
       
        
    };

    const carFuelTypeBodyTemplate = (rowData) => {
        if(rowData.carfueltype == null){
            return <label  >Yakıt Tipi Bulunamadı</label> ;

        }else{
            return <label  >{rowData.carfueltype.name}</label> ;

        }
       
        
    };

   


  
   

   
     const rowExpansionTemplate = (rowData) => {
        
        return (
            <div className="orders-subtable">
                 <div className="grid formgrid">

                        
                      
                 
                    
                    {rowData.users == null ?
                <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <></>
            </div> :
                <DataTable 
                emptyMessage="Kullanıcı Bulunamadı."
                header={headeruser}
                value={rowData.users} responsiveLayout="scroll">
                    <Column field="id" header="ID"  ></Column>
                    <Column field="identityNumber" header="TC No"  ></Column>

                    <Column field="name" header="Adı"  ></Column>
                    <Column field="surname" header="Soyadı"  ></Column>
                    <Column field="birthDate" header="Doğum Tarihi"  ></Column>
                   
                </DataTable>  }
            </div>
            </div>
        );
    };
   

  
    const header1 = renderHeader1();
    const headeruser = renderHeaderUser();

    

   

   


    return (
        <div>
 

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Kullanıcı Araçları</h5>
                    <DataTable
                        value={cars}
                        
                        
                        rows={10}
                        dataKey="id"
                       
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="Araba Bulunamadı."
                        header={header1}

                        expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate}
                    >
                                                <Column expander style={{ width: '3em' }} />
                                               
                         <Column field="plate" header="Araç Plakası"  ></Column>
                         <Column field="serialno" header="Seri Numarası"  ></Column>
                         <Column field="ownerid" header="TC veya Vergi No"  ></Column>
                         <Column field="chasisno" header="Şase Numarası"  ></Column>
                         <Column field="motorno" header="Motor Numarası"  ></Column>
                         <Column field="modelyear" header="Model Yılı"  ></Column>
                         <Column field="passengerno" header="Yolcu Sayısı"  ></Column>
                         <Column field="tescildate" header="Tescil Tarihi"  ></Column>



                        <Column field="id" header="Marka"  body={carModelBodyTemplate} />
                        <Column field="id" header="Araç Modeli"  body={carModelTypeBodyTemplate} />
                        <Column field="id" header="Kullanım Tarzi"  body={carUsageTypeBodyTemplate} />
                        <Column field="id" header="Kullanım Amacı"  body={carUsageSubstancesBodyTemplate} />
                        <Column field="id" header="Yakıt Tipi"  body={carFuelTypeBodyTemplate} />


                        
                        {/* <Column field="id" header="İstek Sahibi Bilgiler"  body={requestusernoBodyTemplate} />
                        <Column field="id" header="İstek Oluşturan Bilgiler"  body={requestcreateduserphoneBodyTemplate} />

                        <Column field="id" header="Sigorta Türü"  body={serviceTypeBodyTemplate} />
                        <Column field="id" header="Araç Bilgisi"  body={carInfoBodyTemplate} />
                        <Column field="id" header="Teklif Durumu"  body={statusTypeBodyTemplate} />
                        <Column field="id" header="Durumu Güncelle"  body={updaterequesttypetemplate} /> */}

                        {/* <Column field="id" header="Teklif Oluşturuldu Bildirimi Gönder"  body={notifTemplate} /> */}

                        
                    

                        

                        <Column header="Oluşturulma Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}   />
                        
                        {/* <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  /> */}
                        <Column field="id" header="Aracı Güncelle"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={detayTemplate}  />

                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading} count={totalpage} page={page}   onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>

                    {/* <Dialog header="İstek Durumunu Güncelle" visible={requesttypedialog} onHide={() => setrequesttypedialog(false)} style={{ width: '350px' }} modal footer={DialogFooterRequestType}>
                        

                        <div className="grid formgrid">
    
                       <div className="col-12 mb-2  ">
                       <label >İstek Durumu </label>
                         <Dropdown id="situation" value={dropdownItemRequestType} onChange={(e) => {
                             setDropdownItemRequestType(e.value)}} options={dropdownItemsRequestTypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                       </div>
                     
                       </div>

                     </Dialog> */}

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

export default Cars;



