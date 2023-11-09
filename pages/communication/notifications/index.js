import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { CircularProgress, Alert } from '@mui/material';
import { InputSwitch } from 'primereact/inputswitch';
import { useAuthContext } from '@/context/AuthContext';
import { Dropdown } from 'primereact/dropdown';



import { ContactUsService } from '@/service/ContanctUsService';
import { BaseService } from '@/service/BaseService';
import { InputText } from 'primereact/inputtext';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';

const Socials = () => {
    const { user } = useAuthContext();

    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loadingadd, setLoadingadd] = useState(false);

    const [deletedialog, setDeleteDialog] = useState(false);

    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    const [notifications, setNotifications] = useState([]);
    const [errorgetnotifications, seterrorGetnotifications] = useState(null);
    const [errorsendnotificaiton, seterrorSendnotification] = useState(null);

    const [notifid, setNotifid] = useState(null);
    const [title, setTitle] = useState("");
    const [bodydata, setBody] = useState("");
    const [topic, setTopic] = useState("");
    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);

    const [sendnotifsucces, setsendnotifsucces] = useState(false);


    const [loading, setLoading] = useState(true);

    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Herkes', code: 'all' },
        { name: 'Kullanıcı', code: 'tc' },
        { name: 'Admin', code: 'admin' }];

        const [dropdownItemUser, setdropdownItemUser] = useState(null);
        const [users, setUsers] = useState([]);
        const [identityNumber, setidentityNumber] = useState("");

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
    const onFilterUser = (e) => {
        setdropdownItemUser(null)
        setidentityNumber(e);
        getusers(e);
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
    const fetchNotifsData = async () => {
     
        setLoading1(true);
    
    var token = "";
    user.getIdToken().then(function(idToken) {  
       token =  idToken;
    }).then(()=>{
    ContactUsService.getNotifs(token).then((object) => {
        // console.log(object);
         if(object.succes){
            setNotifications(object.data);
            
    
            
            setLoading1(false);
    
             }else{
                showalert(object);
                setLoading1(false);
    
    
             }
    
        
     }).catch((message) => {
        setLoading1(false);

        showalert( {
            "succes" : false,
            "error" : message.toString()
            
        } );
        // console.log(error);
    
    
     }); });

   
     
    
  
      }
      const getusers = async (identityNumber) => {
       
        setLoading(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/users?identityNumber=${encodeURIComponent(identityNumber)}&page=${encodeURIComponent(0)}&size=${encodeURIComponent(20)}`;
   
           BaseService.get(url,token).then((object) => {
            if(object.succes){
               let newdata = [];
               object.data?.forEach((element) => {
                   newdata.push({"id" : element.identityNumber , "label" : `TC:${element.identityNumber} ${element.name == null ? "" : element.name} ${element.surname == null ? "" :  element.surname} Telefon:${element.telephone} Puan:${element.total_point == null ? 0 : element.total_point}`})
               })
   
               setUsers(newdata)
                
       
               
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
      const sendNotif = async () => {
        if(title == null || title == ""){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen Başlık Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        if(bodydata == null || bodydata == ""){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen İçerik Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        if(dropdownItem == null){
            showalert(
                {
                    "succes" : false,
                    "error" : "Lütfen Konu Seçiniz",
                    
                } 
            );
            return;
        }
        var body = {};

        if(dropdownItem.code == "tc"){
            body = JSON.stringify({
                "body" : bodydata,
    "title": title,
    "topic" : dropdownItemUser.id
            } );
            
            
        }else{
            body = JSON.stringify({
                "body" : bodydata,
    "title": title,
    "topic" : dropdownItem.code
            } );
        }
        
        setLoadingadd(true);
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
                        setBody("");
                        setTitle("");
                        setTopic("");
                        setUsers(null);
                        setidentityNumber("");

                        setLoadingadd(false);
                        setsendnotifsucces(true);
    
                        fetchNotifsData();
        
                        }else{
                            showalert(data);
                            setLoadingadd(false);

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoadingadd(false);
                    console.log(message);
                    
                    showalert({
                        "succes" : false,
                        "error" : message.toString(),
                        
                    } );
    
                }) ; });
      }

     

      const updateswitch= async (newvalue,newid) => {
       
        setLoading1(true);

        const url = `${baseUrl}/notifs/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
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
            fetchNotifsData();

            }else{
                showalert(data);
           setLoading1(false);


            }
           // setUploadedFile([data]);
          })
          .catch((message) => {
            showalert({
                "succes" : false,
                "error" : message.toString()
                
            });
            setLoading1(false);



          }); });
      }
     

   

 

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


      
        
        fetchNotifsData();
        


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
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            body: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            topic: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },


            
            
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

    const DialogFooterSuccesProduct = (
        <>
            <Button type="button" label="Tamam" icon="pi pi-times" onClick={() => setsendnotifsucces(false)} text />
        </>
    );
   

  
  





   
   



    const header1 = renderHeader1();

    return (
        <div>
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Bildirimler</h5>

                    <DataTable
                        value={notifications}
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
                        <Column field="title" header="Başlık" filter filterPlaceholder="Başlığa Göre Arayınız" style={{ minWidth: '12rem' }} />
                        <Column field="body" header="İçerik" filter filterPlaceholder="İçeriğe Göre Arayınız" style={{ minWidth: '12rem' }} />

                        <Column field="topic" header="Gönderilen" filter filterPlaceholder="Konuya Göre Arayınız" style={{ minWidth: '12rem' }} />

                        

                       
                        <Column header="Gönderilme Tarihi" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}  />
                        
                        


                        <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  />



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
                       
                      
                    </div>
                    <div className="field col-12 md:col-6">

                        </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label >Başlık</label>
                            <InputText  value={title} id="title" type="text" onChange={(e)=> setTitle(e.target.value)}/>
                        </div>


                        <div className="field col-12 md:col-12">
                            <label >İçerik</label>
                            <InputText value={bodydata} id="body"  type="text" onChange={(e)=> setBody(e.target.value)}/>
                        </div>


                        

                        <div className="field col-12 md:col-6">
                            <label >Gönderim Şekli</label>
                            <Dropdown id="type" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div>

                        {
                            dropdownItem == null ?
<div className="field col-12 md:col-12"></div> :
                            dropdownItem.code == "tc" ? 
                            
                             <div className="field col-12 md:col-12">
                            <label >Kullanıcı Arayınız</label>
                            <InputText value={identityNumber} id="identity" type="text"onChange={(e)=> onFilterUser(e.target.value)} /> 

                            <div className=" col-12 mt-5 ">
                            {identityNumber == null || identityNumber == "" ?  <label >Kullanıcı TC No Giriniz</label> :
                         loading ? <CircularProgress /> : 

                            <Dropdown    id="user" value={dropdownItemUser} onChange={(e) => setdropdownItemUser(e.value) } options={users}   optionLabel="label" placeholder="Kullanıcı Seçiniz"></Dropdown>}
                        </div>
                            

                        </div> : <div className="field col-12 md:col-12"></div> 
                        }

                        <div className="field col-12 md:col-12"> 


</div>
                      
                      
                       
                       
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Gönder" outlined onClick={() =>sendNotif()} />
</div>


<Dialog closable={false} visible={loadingadd} style={{ width: '200px', height: "200px" }}  >
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


<Dialog  visible={sendnotifsucces} onHide={() => setsendnotifsucces(false)} style={{ width: '350px' }} modal footer={DialogFooterSuccesProduct}>
                        <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-thumbs-up mr-3" style={{ fontSize: '2rem' }} />
                                <span>Bildirim Başarıyla Gönderilmiştir</span>
                            </div>
                        </Dialog>


   

    
                    </div>
                </div>
            </div> 
            </div> 

            
            

    );
};

export default Socials;



