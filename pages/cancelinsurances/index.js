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



const CancelInsurances = () => {
    const { user } = useAuthContext();
    const router = useRouter();


    const [filters1, setFilters1] = useState(null);
    const [loading2, setLoading2] = useState(false);
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [insurances, setInsurances] = useState([]);
    const [loading, setLoading] = useState(true);


    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState(1);
   
    const [insurancetypedialog, setinsurancetypedialog] = useState(false);
    const [selectedinsuranceid, setselectedinsuranceid] = useState(null);

    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);
    const [dropdownItemInsuranceType, setDropdownItemInsuranceType] = useState(null);

    const dropdownItemsInsuranceTypes = [
        { name: 'Aktif', code: 'active' },
        { name: 'Pasif', code: 'passive' },
        { name: 'İptal', code: 'cancel' },
       
        { name: 'Admin Tarafından Silindi', code: 'deletedbyadmin' }


      

    ];
    const clearFilter1 = () => {
        setGlobalFilterValue1("");
        getinsurances(0,"");
        
     };
 
     const onGlobalFilterChange1 = (e) => {
         const value = e.target.value;
        
         setGlobalFilterValue1(value);
         getinsurances(page,value);
     };

     const changePage = (newPage) => {
        if(parseInt(newPage) == 0){
            return;

        }
        if(parseInt(newPage) > totalpage){
            return;

        }
        setPage(parseInt(newPage));
        getinsurances(newPage,globalFilterValue1);
       }

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Sigorta Sahibi TC" />
                </span>
            </div>
        );
    };
  


       const getinsurances = async (page,value) => {
       
        setLoading(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/insurance?identity=${encodeURIComponent(value)}&page=${encodeURIComponent(page-1)}&size=${encodeURIComponent(10)}&status=cancel`;
   
           BaseService.get(url,token).then((object) => {
           //console.log(object);
            if(object.succes){
                setTotalpage(object.totalPages);

               setInsurances(object.data);
                
       
               
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


       
        
        getinsurances(0,globalFilterValue1);
        

       

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

            const url = `${baseUrl}/insurance/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
                BaseService.get(url,token).then((data) => {
                if(data.succes){
                getinsurances(0,"");

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

  

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            subtitle: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            information: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },


            
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            
            //verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };




   

    const dateStartBodyTemplate = (rowData) => {
        return formatDate(rowData.startDate);
    };
    const dateEndBodyTemplate = (rowData) => {
        return formatDate(rowData.endDate);
    };
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };
    const deleteTemplate = (rowData) => {
        return   <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
        ;
    };

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const pdfTemplate = (rowData) => {
       return <a href={`${fileUrl}${rowData.pdf}`} target="_blank">
         <Button style={{margin: "5px"}} type="button" label="Görüntüle">

</Button>  
       </a>
       
    };
    const cancelTemplate = (rowData) => {
        return <a href={`${fileUrl}${rowData.cancelpath}`} target="_blank">
          <Button style={{margin: "5px"}} type="button" label="Görüntüle">
 
 </Button>  
        </a>
        
     };

    const ownerBodyTemplate = (rowData) => {
       
        if(rowData.userinsurance == null){
            return <label></label> ;

        }
        return <label>{rowData.userinsurance.name == null ? "" :rowData.userinsurance.name } {rowData.userinsurance.surname == null ? "" :rowData.userinsurance.surname } TC:{rowData.userinsurance.identityNumber} Telefon:{rowData.userinsurance.telephone}</label>
        
    };

    const createrBodyTemplate = (rowData) => {
       
        if(rowData.forotherinsurance == null){
            return <label></label> ;

        }
        return <label> {rowData.forotherinsurance.name == null ? "" :rowData.forotherinsurance.name } {rowData.forotherinsurance.surname == null ? "" :rowData.forotherinsurance.surname } TC:{rowData.forotherinsurance.identityNumber} Telefon:{rowData.forotherinsurance.telephone}</label>
        
    };


    const DialogFooterInsuranceType = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setinsurancetypedialog(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updateinsuracetype()} text autoFocus />
        </>
    );
    const updateinsuranceypetemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{console.log(rowData.id); setselectedinsuranceid(rowData.id); setinsurancetypedialog(true)} } />
            
        </div>
        
        ;
    };
    const updateinsuracetype = async () => {
        setinsurancetypedialog(false);
        if(dropdownItemsInsuranceTypes == null){
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
        var body = {};
        body = JSON.stringify({
            "id" : selectedinsuranceid,
            "status" : dropdownItemInsuranceType.code,          
        } );
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/insurance`;
            BaseService.put(url,body,token).then((data) => {
                    if(data.succes){
                        setDropdownItemInsuranceType(null);

    
                        getinsurances(page,globalFilterValue1);
                        
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
   

      const statusTypeBodyTemplate = (rowData) => {
        switch(rowData.status) {
            case "active":
            return <label  >Aktif</label> ;
            
        case  "passive":
        return <label>Pasif</label> ;
        case "cancel":
        return <label  >İptal İsteği Oluşturuldu</label> ;
    
        case "deletedbyadmin":
        return <label  >Admin Tarafından Silindi</label> ;
        default:
        return <label></label> ;
          }

         
        
    };

   
 
   

 

   

  


   





   

   

  

   

   

    const header1 = renderHeader1();

    return (
        <div>

    

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Sigortalar</h5>
                    <DataTable
                        value={insurances}
                        
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="Sigorta Bulunamadı."
                        header={header1}
                    >
                     <Column field="id" header="ID"  bodyClassName="text-center" style={{ minWidth: '8rem' }} />
                     <Column field="id" header="Sigorta Sahibi"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={ownerBodyTemplate}  />
                     <Column field="id" header="Sigortayı Oluşturan"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={createrBodyTemplate}  />




                        <Column header="Başlangıç Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateStartBodyTemplate} />
                        <Column header="Bitiş Tarihi" dataType="date" style={{ minWidth: '10rem' }} body={dateEndBodyTemplate} />

                        <Column header="Oluşturulma Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
                        <Column field="id" header="Sigorta Durumu"  body={statusTypeBodyTemplate} />

                        <Column field="id" header="Güncelle"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={updateinsuranceypetemplate}  />
                        <Column field="id" header="Sigorta Dosyası"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={pdfTemplate}  />
                        <Column field="id" header="İptal Poliçesi"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={cancelTemplate}  />


                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading} count={totalpage} page={page}   onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>

            <Dialog header="İstek Durumunu Güncelle" visible={insurancetypedialog} onHide={() => setinsurancetypedialog(false)} style={{ width: '350px' }} modal footer={DialogFooterInsuranceType}>
                        

                        <div className="grid formgrid">
    
                       <div className="col-12 mb-2  ">
                       <label >Sigorta Durumu </label>
                         <Dropdown id="situation" value={dropdownItemInsuranceType} onChange={(e) => {
                             setDropdownItemInsuranceType(e.value)}} options={dropdownItemsInsuranceTypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
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

export default CancelInsurances;



