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
import { BaseService } from '@/service/BaseService';

import { Dropdown } from 'primereact/dropdown';

import { ContactUsService } from '@/service/ContanctUsService';
import { useAuthContext } from '@/context/AuthContext';

import { InputText } from 'primereact/inputtext';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';

const Faq = () => {
    const { user } = useAuthContext();

    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(false);
    const [loadingadd, setLoadingadd] = useState(false);

    const [deletedialog, setDeleteDialog] = useState(false);


 
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    const [faq, setFaq] = useState([]);
    const [errorgetmessages, seterrorgetmessages] = useState(null);
    const [erroraddmessages, seterroraddmessages] = useState(null);

    const [faqid, setFaqId] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);

    const [dropdownItemLang, setDropdownItemLang] = useState(null);
    const [dropdownItemLang2, setDropdownItemLang2] = useState(null);

    const dropdownItemsLang = [
        { name: 'Türkçe', code: 'tr' },
        { name: 'İngilizce', code: 'en' }
       


    ];

    useEffect(() => {
        
       
            
          
            fetchLangData();

            
         
      },[] );


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

                <div>

               
                
                </div>
                {/* <div className="mb-2">
                          <label >Dil </label>
                            <Dropdown id="actiontype" value={dropdownItemLang} onChange={(e) => {
                                onLangChange(e.value)}} options={dropdownItemsLang} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                          </div> */}
                
            </div>
        );
    };
    const onLangChange = (e) => {
        setDropdownItemLang(e);
       fetchLangData(e.code);
    };
    const fetchLangData = async () => {
     
    setLoading1(true);
    
    var token = "";
    user.getIdToken().then(function(idToken) {  
       token =  idToken;
    }).then(()=>{
    ContactUsService.getfaq("tr",token).then((object) => {
        // console.log(object);
         if(object.succes){
            setFaq(object.data);
            
    
            
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

      const addFaq = async () => {
       
        if(question == null || question == ""){
            showaddalerterror(
               {
                    "succes" : false,
                    "error" : "Lütfen Soru Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        if(answer == null || answer == ""){
            showaddalerterror(
               {
                    "succes" : false,
                    "error" : "Lütfen Cevap Bilgisini Giriniz",
                    
                } 
            );
            return;
        }
        setLoadingadd(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/faq`, {
            method: "POST",
             body: JSON.stringify({
                "question" : question,
                "answer" : answer,
                "code" : "tr"
            } ),    
            headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json' , "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
                .then(data => {
                    if(data.succes){
                        setQuestion("");
                        setAnswer("");
                        setLoadingadd(false);
                            fetchLangData();

                        
    
        
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
        


        setLoading1(true);

        const url = `${baseUrl}/faq/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
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
                                <span>SSS'i Silmek İstediğinize Emin Misiniz?</span>
                            </div>
                        </Dialog>
        </div>
        
        ;
    };
    const confirmationDialogFooter = (
        <>
            <Button type="button" label="Hayır" icon="pi pi-times" onClick={() => setDeleteDialog(false)} text />
            <Button type="button" label="Evet" icon="pi pi-check" onClick={() => deletefaq()} text autoFocus />
        </>
    );
    const setdelete = (event) => {
        setDeleteDialog(true);
        setFaqId(event);
    
    
    } 
    const deletefaq = async () => {
        setDeleteDialog(false);
        setLoading1(true);
        var token = "";
        var token = "";
        const url = `${baseUrl}/faq`;
        var deletelist = [];
        deletelist.push(faqid);
        var body = {};
         body  = JSON.stringify({
           id : deletelist
                  
               } )
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            BaseService.deletewithbody(url,body,token).then((data) => {
                    console.log(data);
                    if(data.succes){
                    fetchLangData();
    
                    }else{
                        showalerterror({
                            "succes" : false,
                            "error" : data.message.toString()
                            
                        });
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
            answer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            question: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },


            
            
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
                    <h5>SSS</h5>
                    {errorgetmessages && <Alert style={{ marginBottom : "10px"}} severity="error">{errorgetmessages.error}</Alert>}

                    <DataTable
                        value={faq}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="SSS Bulunamadı"
                        header={header1}
                    >
                        <Column field="question" header="Soru" filter filterPlaceholder="Soruya Göre Arayınız" style={{ minWidth: '12rem' }} />
                        <Column field="answer" header="Cevap" filter filterPlaceholder="Cevaba Göre Arayınız" style={{ minWidth: '12rem' }} />

                        

                       
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
                            <h5>SSS Ekle</h5>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                        {loadingadd && <CircularProgress />}
                        </div>
                      
                    </div>
                    <div className="field col-12 md:col-6">
                    {erroraddmessages && <Alert severity="error">{erroraddmessages.error}</Alert>}

                        </div>
                    <div className="p-fluid formgrid grid">
                    {/* <div className="field col-12 md:col-6">
                            <label >Dil Kodu</label>
                            <Dropdown id="actiontype" value={dropdownItemLang2} onChange={(e) => {
                                setDropdownItemLang2(e.value)}} options={dropdownItemsLang} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> */}
                        <div className="field col-12 md:col-12">
                            <label >Soru</label>
                            <InputText  value={question} id="question" type="text" onChange={(e)=> setQuestion(e.target.value)}/>
                        </div>

                       

                        <div className="field col-12 md:col-12">
                            <label >Cevap</label>
                            <InputTextarea  rows={3} value={answer} id="answer"  type="text" onChange={(e)=> setAnswer(e.target.value)}/>
                        </div>
                      
                      
                       
                       
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Ekle" outlined onClick={() =>addFaq()} />
</div>


   

    
                    </div>
                </div>
            </div> 
            </div> 

            
            

    );
};

export default Faq;



