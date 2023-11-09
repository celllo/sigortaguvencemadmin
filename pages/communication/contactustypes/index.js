import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { CircularProgress, Alert } from '@mui/material';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { useAuthContext } from '@/context/AuthContext';


import { ContactUsService } from '@/service/ContanctUsService';

import { InputText } from 'primereact/inputtext';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';

const ContactUsTypes = () => {
    const { user } = useAuthContext();

    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loadingadd, setLoadingadd] = useState(false);

    const [deletedialog, setDeleteDialog] = useState(false);
    const [solutionmaildialog, setSolutionMailDialog] = useState(false);


 
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    const [contacttypes, setContactTypes] = useState([]);
    const [errorgetmessages, seterrorgetmessages] = useState(null);
    const [erroraddmessages, seterroraddmessages] = useState(null);

    const [typeid, settypeid] = useState(null);
    const [name, setName] = useState(null);
    const [detail, setDetail] = useState(null);







    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Arama Kelimesi" />
                </span>
            </div>
        );
    };
    const fetchContactTypeData = async () => {
     
    setLoading1(true);
    
    var token = "";
    user.getIdToken().then(function(idToken) {  
       token =  idToken;
    }).then(()=>{
    ContactUsService.getMessageTypes(token).then((object) => {
        // console.log(object);
         if(object.succes){
            setContactTypes(object.data);
            
    
            
             setLoading1(false);
    
             }else{
                showalerterror(object);
                setLoading1(false);
    
    
             }
    
        
     }).catch((message) => {
        setLoading1(false);

        showalerterror({
            "succes" : false,
            "error" : message.toString()
            
        });
        // console.log(error);
    
    
     }); });

   
     
    
  
      }

      const addConcatusType = async () => {
        if(name == null || name == ""){
            showaddalerterror(
               {
                    "succes" : false,
                    "error" : "Lütfen Ad Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        if(detail == null || detail == ""){
            showaddalerterror(
               {
                    "succes" : false,
                    "error" : "Lütfen Detay Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        setLoadingadd(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/contactustypes`, {
            method: "POST",
             body: JSON.stringify({
                "name" : name,
                "detail" : detail,
            } ),    
            headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
                .then(data => {
                    if(data.succes){
                        setDetail("");
                        setName("");
                        setLoadingadd(false);

    
                        fetchContactTypeData();
        
                        }else{
                            showaddalerterror(data);
                            setLoadingadd(false);

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoadingadd(false);
    
                    
                    showaddalerterror({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
    
                }) ; });
      }

      const updateswitch= async (newvalue,newid) => {
        console.log(newvalue);
        console.log(newid);


        setLoading1(true);

        const url = `${baseUrl}/contactustypes/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(url, {
                method: "GET",  
                
                
            headers: {    'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}`

             } })
        
          .then(response => {
            return response.json();
          }) .then(data => {
            if(data.succes){
            fetchContactTypeData();

            }else{
                showalerterror(data);
           setLoading1(false);


            }
           // setUploadedFile([data]);
          })
          .catch((message) => {
            setLoading1(false);

            showalerterror({
                "succes" : false,
                "error" : message.toString()
                
            });


          }); });
      }
     

      const showalerterror = (neweeror) => {
        seterrorgetmessages(neweeror);



       setTimeout(() => {
        seterrorgetmessages(null);

      } , 3000);
    };

    const showaddalerterror = (neweeror) => {
        seterroraddmessages(neweeror);



       setTimeout(() => {
        seterroraddmessages(null);

      } , 3000);
    };

     //delete type 
     const deleteTemplate = (rowData) => {
                
        return   <div>
            <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={() => setdelete(rowData.id)} />
                        <Dialog header="Silme İşlemi Onayı" visible={deletedialog} onHide={() => setDeleteDialog(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                <span>Tipi Silmek İstediğinize Emin Misiniz?</span>
                            </div>
                        </Dialog>
        </div>
        
        ;
    };
    const confirmationDialogFooter = (
        <>
            <Button type="button" label="Hayır" icon="pi pi-times" onClick={() => setDeleteDialog(false)} text />
            <Button type="button" label="Evet" icon="pi pi-check" onClick={() => deletetype()} text autoFocus />
        </>
    );
    const setdelete = (event) => {
        setDeleteDialog(true);
        settypeid(event);
    
    
    } 
    const deletetype = async () => {
        setDeleteDialog(false);
        setLoading1(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/contactustypes?id=${encodeURIComponent(typeid)}`, {
            method: "DELETE",    
        headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
                .then((res) => res.json())
                .then(data => {
                    console.log(data);
                    if(data.succes){
                    fetchContactTypeData();
    
                    }else{
                   showalerterror(data);
                   setLoading1(false);
    
    
                    }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message =>  {
                    showalerterror({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
                   setLoading1(false);
                } ) ; });
         
      
          }
      

    useEffect(() => {


      
        
        fetchContactTypeData();
        


        initFilters1();
    }, []); 

   
    function formatingDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }
    const formatDate = (value) => {
        //return value;
        //console.log(value);
        //return value;
       
        
var xx =  formatingDate(value);
        
        return xx;
    };

  

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            detail: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },


            
            
            //verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

   



    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };
 

  





    const switchTemplate = (rowData) => {
       

        return (
            
         <InputSwitch checked={rowData.is_checked} onChange={(e) =>{ 
           

            updateswitch(e.value,rowData.id);
        }} />
            
        );
    };
   

  
  





   
   



    const header1 = renderHeader1();

    return (
        <div>
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Mesajlar</h5>
                    {errorgetmessages && <Alert style={{ marginBottom : "10px"}} severity="error">{errorgetmessages.error}</Alert>}

                    <DataTable
                        value={contacttypes}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="Mesaj Bulunamadı"
                        header={header1}
                    >
                        <Column field="name" header="Tip Adı" filter filterPlaceholder="Ada Göre Arayınız" style={{ minWidth: '12rem' }} />
                        <Column field="detail" header="Tip Detayo" filter filterPlaceholder="Detaya Göre Arayınız" style={{ minWidth: '12rem' }} />

                        

                       
                        <Column header="Oluşturulma Tarihi" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}  />
                        
                        


                        <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  />
                        <Column field="id" header="Sil"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={deleteTemplate}  />



                    </DataTable>
                </div>
            </div>
            </div>
            <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Bize Yazın Tipi Ekle</h5>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                        {loadingadd && <CircularProgress />}
                        </div>
                      
                    </div>
                    <div className="field col-12 md:col-6">
                    {erroraddmessages && <Alert severity="error">{erroraddmessages.error}</Alert>}

                        </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Tip Adı</label>
                            <InputText value={name} id="name" type="text" onChange={(e)=> setName(e.target.value)}/>
                        </div>


                        <div className="field col-12 md:col-12">
                            <label htmlFor="name">Tip Detayı</label>
                            <InputText value={detail} id="detail"  type="text" onChange={(e)=> setDetail(e.target.value)}/>
                        </div>
                      
                      
                       
                       
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Ekle" outlined onClick={() =>addConcatusType()} />
</div>


   

    
                    </div>
                </div>
            </div> 
            </div> 

            
            

    );
};

export default ContactUsTypes;



