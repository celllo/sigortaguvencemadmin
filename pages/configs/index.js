import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { CircularProgress, Alert } from '@mui/material';
import { InputSwitch } from 'primereact/inputswitch';
import { useAuthContext } from '@/context/AuthContext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';



import { ConfigsService } from '@/service/ConfigsService';

import { InputText } from 'primereact/inputtext';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';

const Configs = () => {

    const { user } = useAuthContext();

  
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loadingadd, setLoadingadd] = useState(false);

    const [deletedialog, setDeleteDialog] = useState(false);

    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    const [configs, setConfigs] = useState([]);
    const [errorgetconfigs, seterrorGetconfigs] = useState(null);
    const [errorupdateconfigs, seterrorUpdateconfigs] = useState(null);

    const [configid, setConfigid] = useState(null);
    const [maxstep, setMaxstep] = useState("");
    const [maxencstep, setMaxencstep] = useState("");
    const [tlcoin, setTlcoin] = useState("");
    const [coinstep, setCoinstep] = useState("");

    const dropdownItemsSituations = [
        { name: 'Canlı', code: 'live' },
        { name: 'Güncellemede', code: 'updating' },
        { name: 'Hizmet Dışı', code: 'out_of_order' },
        { name: 'Geliştirme Sürecinde', code: 'dev' }
      

    ];

    const [dropdownItemApp, setDropdownItemApp] = useState(null);
    const [dropdownItemStore, setDropdownItemStore] = useState(null);



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
    const fetchConfigsData = async () => {
        setLoading1(true);

        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            ConfigsService.getConfigs(token).then((object) => {
                // console.log(object);
                 if(object.succes){
                    setConfigs(object.data);

                    setConfigid(object.data[0].id)

                    
            
                    
                     setLoading1(false);
            
                     }else{
                        showalerterror(object);
                        setLoading1(false);
            
            
                     }
            
                
             }).catch((message) => {
                setLoading1(false);
        
                showalerterror( {
                    "succes" : false,
                    "error" : message.toString()
                    
                } );
                // console.log(error);
            
            
             });

        });
     
    

    

   
     
    
  
      }



      const sendNotif = async () => {
  
    if(( maxstep == null || maxstep == "") && (maxencstep == null || maxencstep == "") && (tlcoin == null || tlcoin == "") && (coinstep == null || coinstep == "") && dropdownItemApp == null && dropdownItemStore == null ){
        showaddalerterror(
           {
                "succes" : false,
                "error" : "Güncellenecek İçerik Bulunmamaktadır",
                
            } 
        );
        return;
    }
    setLoadingadd(true);

    var body = {};
    if(dropdownItemApp != null ){
        body["app_status"] = dropdownItemApp.code;
        
    }
    if(dropdownItemStore != null ){
        body["shop_status"] = dropdownItemStore.code;
        
    }

        if(maxstep != null && maxstep != ""){
            body["max_step"] = maxstep;
            
        }
        if(maxencstep != null && maxencstep != ""){
            body["max_exchanged_step"] = maxencstep;

        }
        if(tlcoin != null && tlcoin != ""){
            body["tl_to_coin"] = tlcoin;

        }
        if(coinstep != null && coinstep != ""){
            body["coin_to_step"] = coinstep;

        }
        body["id"] = configid;

       


        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/configs`, {
            method: "PUT",
             body: JSON.stringify(body ),    
            headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
                .then(data => {
                    if(data.succes){
                        setMaxstep("");
                        setMaxencstep("");
                        setTlcoin("");
                        setCoinstep("");


                        setLoadingadd(false);

    
                        fetchConfigsData();
        
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
                        
                    } );
    
                }) ; });
      }

     

     

      const showalerterror = (neweeror) => {
        seterrorGetconfigs(neweeror);



       setTimeout(() => {
        seterrorGetconfigs(null);

      } , 3000);
    };

    const showaddalerterror = (neweeror) => {
        seterrorUpdateconfigs(neweeror);



       setTimeout(() => {
        seterrorUpdateconfigs(null);

      } , 3000);
    };

    //  //delete type 
    //  const deleteTemplate = (rowData) => {
                
    //     return   <div>
    //         <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={() => setdelete(rowData.id)} />
    //                     <Dialog header="Silme İşlemi Onayı" visible={deletedialog} onHide={() => setDeleteDialog(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
    //                         <div className="flex align-items-center justify-content-center">
    //                             <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
    //                             <span>Sosyal Linki Silmek İstediğinize Emin Misiniz?</span>
    //                         </div>
    //                     </Dialog>
    //     </div>
        
    //     ;
    // };
    // const confirmationDialogFooter = (
    //     <>
    //         <Button type="button" label="Hayır" icon="pi pi-times" onClick={() => setDeleteDialog(false)} text />
    //         <Button type="button" label="Evet" icon="pi pi-check" onClick={() => deletesocial()} text autoFocus />
    //     </>
    // );
    // const setdelete = (event) => {
    //     setDeleteDialog(true);
    //     setSocialid(event);
    
    
    // } 
    // const deletesocial = async () => {
    //     setDeleteDialog(false);
    //     setLoading1(true);

    //     fetch(`https://api.adimlayarakkazan.com/api/v1/socials?id=${encodeURIComponent(socialid)}`, {
    //         method: "DELETE",    
    //     headers: { 'Cache-Control': 'no-cache' } })
    //             .then((res) => res.json())
    //             .then(data => {
    //                 console.log(data);
    //                 if(data.succes){
    //                 fetchSocialsData();
    
    //                 }else{
    //                showalerterror(data);
    //                setLoading1(false);
    
    
    //                 }
                
    //             }) // Manipulate the data retrieved back, if we want to do something with it
    //             .catch(err =>  {
    //                 showalerterror(err.error);
    //                setLoading1(false);
    //             } ) ;
         
      
    //       }
      

    useEffect(() => {


      
        
        fetchConfigsData();
        


        initFilters1();
    }, []); 

    const appstatustype = (rowData) => {
            
        switch(rowData.app_status) {
            case "live":
             return <label  >Canlı</label> ;
            
            case  "updating":
                return <label>Güncellemede</label> ;
            case "out_of_order":
                return <label>Hizmet Dışı</label> ;
            case "dev":
                return <label>Geliştirme Sürecinde </label> ;
           
            default:
                    return <label>Canlı</label> ;
          }
          
         
        
    };

    const storestatustype = (rowData) => {
            
        switch(rowData.shop_status) {
            case "live":
             return <label  >Canlı</label> ;
            
            case  "updating":
                return <label>Güncellemede</label> ;
            case "out_of_order":
                return <label>Hizmet Dışı</label> ;
            case "dev":
                return <label>Geliştirme Sürecinde </label> ;
           
            default:
                    return <label>Canlı</label> ;
          }
          
        
        
    };

   
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
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            body: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            topic: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },


            
            
            //verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

   



    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.updatedAt);
    };

  

 

   

  





    const switchTemplate = (rowData) => {
       

        return (
            
         <InputSwitch checked={rowData.is_checked} onChange={(e) =>{ 
           

            updateswitch(e.value,rowData.id);
        }} />
            
        );
    };
   

  
  





   
   




    return (
        <div>
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Konfigürasyonlar</h5>
                    {errorgetconfigs && <Alert style={{ marginBottom : "10px"}} severity="error">{errorgetconfigs.error}</Alert>}

                    <DataTable
                        value={configs}
                        
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="Konfigürasyon Bulunamadı"
                    >
                        <Column field="max_step" header="Maks Adım"  style={{ minWidth: '12rem' }} />
                        <Column field="max_exchanged_step" header="Maks Arttırılan Adım"  style={{ minWidth: '12rem' }} />

                        <Column field="tl_to_coin" header="TL->Coin"  style={{ minWidth: '12rem' }} />
                        <Column field="coin_to_step" header="Coin->Step"  style={{ minWidth: '12rem' }} />
                        <Column field="app_status" header="Uygulama Durumu"  style={{ minWidth: '12rem' }}  body={appstatustype}/>
                        <Column field="shop_status" header="Mağaza Durumu"  style={{ minWidth: '12rem' }}  body={storestatustype} />

                        

                       
                        <Column header="Güncellenme Tarihi" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}  />
                        
                        





                    </DataTable>
                </div>
            </div>
            </div>
            <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Konfigürasyonları Güncelle</h5>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                        {loadingadd && <CircularProgress />}
                        </div>
                      
                    </div>
                    <div className="field col-12 md:col-6">
                    {errorupdateconfigs && <Alert severity="error">{errorupdateconfigs.error}</Alert>}

                        </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label >Maks Adım</label>
                            <InputNumber  value={maxstep} onValueChange={(e) => setMaxstep(e.value)}  mode="decimal"></InputNumber>

                        </div>


                        <div className="field col-12 md:col-12">
                            <label >Maks Arttırılan Adım</label>
                            <InputNumber  value={maxencstep} onValueChange={(e) => setMaxencstep(e.value)}  mode="decimal"></InputNumber>

                        </div>


                        <div className="field col-12 md:col-6">
                            <label >TL-Coin</label>
                            <InputNumber value={tlcoin} onValueChange={(e) => setTlcoin(e.value)} mode="decimal" minFractionDigits={2}></InputNumber>

                        </div>

                        <div className="field col-12 md:col-6">
                            <label >Coin-Step</label>
                            <InputNumber value={coinstep} onValueChange={(e) => setCoinstep(e.value)} mode="decimal" minFractionDigits={2}></InputNumber>
                        </div>
                        <div className="field col-12 md:col-6">
                       <label >Uygulama Durumu </label>
                         <Dropdown id="situation" value={dropdownItemApp} onChange={(e) => {
                             setDropdownItemApp(e.value)}} options={dropdownItemsSituations} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                       </div>

                       <div className="field col-12 md:col-6 ">
                       <label >Mağaza Durumu </label>
                         <Dropdown id="situation" value={dropdownItemStore} onChange={(e) => {
                             setDropdownItemStore(e.value)}} options={dropdownItemsSituations} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                       </div>

                        <div className="field col-12 md:col-12"> 


</div>


                      
                      
                       
                       
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Gönder" outlined onClick={() =>sendNotif()} />
</div>


   

    
                    </div>
                </div>
            </div> 
            </div> 

            
            

    );
};

export default Configs;



