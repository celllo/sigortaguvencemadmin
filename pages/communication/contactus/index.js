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
import { useAuthContext } from '@/context/AuthContext';


import { ContactUsService } from '@/service/ContanctUsService';

import { InputText } from 'primereact/inputtext';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';

const ContactUs = () => {
    const { user } = useAuthContext();

    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [solutiondialog, setSolutionDialog] = useState(false);
    const [solutionmaildialog, setSolutionMailDialog] = useState(false);
    const [solutionmailshowdialog, setSolutionMailShowDialog] = useState(false);



 
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    const [messages, setMessages] = useState([]);
    const [messagetypes, setMessageTypes] = useState([]);
    const [errorgetmessages, seterrorgetmessages] = useState(null);
    const [solutionid, setsolutionid] = useState(null);
    const [solution, setSolution] = useState(null);






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
    const fetchMessageData = async () => {
     
    setLoading1(true);
    
    var token = "";
    user.getIdToken().then(function(idToken) {  
       token =  idToken;
    }).then(()=>{
    ContactUsService.getMessages(token).then((object) => {
        // console.log(object);
         if(object.succes){
            setMessages(object.data);
            ContactUsService.getMessageTypes(token).then((object) => {
                // console.log(object);
                 if(object.succes){
                    setMessageTypes(object.data);
                     
            
                    
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
            
            
             });
    
            
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

      const addSolution = async () => {
        setSolutionDialog(false);
        if(solution == null){
            showalerterror(
               {
                    "succes" : false,
                    "error" : "Lütfen Çözüm Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        setLoading1(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/contactus`, {
            method: "PUT",
             body: JSON.stringify({
                "id" : solutionid,
                "adminNote" : solution,
                "is_resolved" : true
            } ),    
        headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
                .then((res) => res.json())
                .then(data => {
                    if(data.succes){
                        setsolutionid(null);
                        setSolution(null);

    
                        fetchMessageData();
        
                        }else{
                            showalerterror(data);
                          setLoading1(false);

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoading1(false);
    
                    
                    showalerterror({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
    
                }) ; });
      }

      const sendSolutionMail = async () => {
        setSolutionMailDialog(false);
        if(solution == null){
            showalerterror(
               {
                    "succes" : false,
                    "error" : "Lütfen Çözüm Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        setLoading1(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/contactus/answer`, {
        method: "POST",
        body: JSON.stringify({
            "id" : solutionid,
            "answer" : solution,
           
        } ),     
    headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then(data => {
                if(data.succes){
                    setsolutionid(null);
                        setSolution(null);

    
                        fetchMessageData();
                    
    
                    }else{
                        showalerterror(data);
                       
                      setLoading1(false);

    
                    }
            
            }) // Manipulate the data retrieved back, if we want to do something with it
            .catch(message => { 
                setLoading1(false);

                
                showalerterror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });

            }) ; });
      }
     

      const showalerterror = (neweeror) => {
        seterrorgetmessages(neweeror);



       setTimeout(() => {
        seterrorgetmessages(null);

      } , 3000);
    };
      

    useEffect(() => {


      
        
        fetchMessageData();
        


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
            surname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            mail: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            tel: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            
            
            //verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

   



    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };
 

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const messagetypeTemplate = (rowData) => {
        let selectedtypename = "";
        for (let i = 0; i < messagetypes.length; i++) {
            if(messagetypes[i].id == rowData.contactustypeId ){
                selectedtypename = messagetypes[i].name;
                break;
            }
             
              
        }
        return  <span >{selectedtypename}</span>;
    };
    const solutionTemplateprize = (rowData) => {
                
        return   <div>
            <Button label="Çözüm Ekle" icon="pi pi-plus" severity="success" onClick={() => {setsolutionid(rowData.id); setSolutionDialog(true)} } />
                        <Dialog header="Çözüm Ekleme" visible={solutiondialog} onHide={() => setSolutionDialog(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooterSolution}>
                        
                    <div className="col-12 mb-2  ">
                       <span >Çözüm: </span>
                       <InputText id="solution" type="text" onChange={(e)=> setSolution(e.target.value)}/>
                       </div>
                        </Dialog>
        </div>;
    };
    
    const confirmationDialogFooterSolution = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setSolutionDialog(false)} text />
            <Button type="button" label="Ekle" icon="pi pi-check" onClick={() => addSolution()} text autoFocus />
        </>
    );


    const solutionMailTemplate = (rowData) => {
        if(rowData.answer == null){
            return  <div>
            <Button label="Çözüm Maili Gönder" icon="pi pi-plus" severity="success" onClick={() => {setsolutionid(rowData.id); setSolutionMailDialog(true)} } />
                        <Dialog header="Çözüm Maili Gönder" visible={solutionmaildialog} onHide={() => setSolutionMailDialog(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooterSolutionMail}>
                        <span >Mail İçeriği: </span>
                    <div style={{marginTop : "10px"}}>
                       
                       <InputTextarea id="solution" style={{width: "300px"}} rows="7" onChange={(e)=> setSolution(e.target.value)}/>
                       </div>
                        </Dialog>
        </div>;
        } else{
            return <span> Mail Gönderildi</span>
        } 
        
    };

    const solutionMailShowTemplate = (rowData) => {
        if(rowData.answer != null){

            return  <div>
            <Button label="Maili Görüntüle" onClick={() => {setSolutionMailShowDialog(true)} } />
                        <Dialog header="Çözüm Maili" visible={solutionmailshowdialog} onHide={() => setSolutionMailShowDialog(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooterSolutionMailShow}>
                        <span >Mail İçeriği: </span>
                    <div style={{marginTop : "10px"}}>
                       
                      {rowData.answer}
                       </div>
                        </Dialog>
                        </div>;
        } else{
            return <span> Mail İçeriği Bulunmuyor</span>
        } 
      
        
    };
    
    const confirmationDialogFooterSolutionMail = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setSolutionMailDialog(false)} text />
            <Button type="button" label="Gönder" icon="pi pi-check" onClick={() => sendSolutionMail()} text autoFocus />
        </>
    );

    const confirmationDialogFooterSolutionMailShow = (
        <>
            <Button type="button" label="Tamam" icon="pi pi-times" onClick={() => setSolutionMailShowDialog(false)} text />
        </>
    );



   

    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.is_resolved, 'text-pink-500 pi-times-circle': !rowData.is_resolved })}></i>;
    };

  





   
   



    const header1 = renderHeader1();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Mesajlar</h5>
                    {errorgetmessages && <Alert style={{ marginBottom : "10px"}} severity="error">{errorgetmessages.error}</Alert>}

                    <DataTable
                        value={messages}
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
                        <Column field="name" header="İsmi" filter filterPlaceholder="Ada Göre Arayınız" style={{ minWidth: '12rem' }} />
                        <Column field="surname" header="Soyismi" filter filterPlaceholder="Soyada Göre Arayınız" style={{ minWidth: '12rem' }} />
                        <Column field="mail" header="Mail" filter filterPlaceholder="Maile Göre Arayınız" style={{ minWidth: '12rem' }} />
                        <Column field="tel" header="Telefon" filter filterPlaceholder="Telefona Göre Arayınız" style={{ minWidth: '12rem' }} />
                        <Column field="title" header="Mesaj Başlığı"  style={{ minWidth: '12rem' }} />

                        <Column field="question" header="Mesaj İçeriği"  style={{ minWidth: '12rem' }} />

                        <Column field="contactustypeId" header="Konu" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={messagetypeTemplate}  />

                        

                       
                        <Column header="Oluşturulma Tarihi" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}  />
                        
                        <Column field="is_resolved" header="Çözüm Varmı" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate}  />
                        <Column field="adminNote" header="Çözüm" style={{ minWidth: '12rem' }} />
                        

                        <Column field="id" header="Çözüm Ekle"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={solutionTemplateprize}  />
                        <Column field="id" header="Çözüm Maili Gör"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={solutionMailShowTemplate}  />

                        <Column field="id" header="Çözüm Maili Gönder"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={solutionMailTemplate}  />



                    </DataTable>
                </div>
            </div>
            </div>
            

    );
};

export default ContactUs;



