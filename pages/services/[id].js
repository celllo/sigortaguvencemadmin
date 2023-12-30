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
import { CircularProgress, Alert } from '@mui/material';
import { Checkbox } from 'primereact/checkbox';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog';



const Services = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const { id } = router.query;


    const [filters1, setFilters1] = useState(null);
    const [loading2, setLoading2] = useState(false);
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [service, setService] = useState();
    const [questions, setQuestions] = useState([]);
    const [textfieldtype, settextfieldtype] = useState([]);


    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(null);

    const [addoptiondialog, setaddoptiondialog] = useState(false);

    const [addselectedquestion, setaddselectedquestion] = useState(null);
    const [deleteconfirm, setdeleteconfirm] = useState(false);
    const [deleteidoption, setdeleteidoption] = useState(null);
    const [file, setFile] = useState([]);

    //Question ekle 
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItemTextField, setdropdownItemTextField] = useState(null);

    const [deleteconfirmques, setdeleteconfirmques] = useState(false);
    const [deleteidques, setdeleteidques] = useState(null);
    const dropdownItems = [
        { name: 'Yazı', code: 'text' },
        { name: 'Tekli Seçme', code: 'singleselect' },
        { name: 'Çoklu Seçme', code: 'multiselect' }

    ];
   

    const [question, setQuestion] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [information, setInformation] = useState("");
    const [hinttext, setHintText] = useState("");
    const [leadingcheckbox, setleadingcheckbox] = useState(false);


    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);


    const [optionname, setoptionname] = useState("");
    const [optioninformation, setoptioninformation] = useState("");


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
    const getservices = async () => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/service/${encodeURIComponent(id)}`;

        BaseService.get(url,token).then((object) => {
         if(object.succes){
            setService(object.data);
            setQuestions(object.data.survey.servicequestions);
        console.log(object.data);
             
    
            
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
       const gettextfield = async () => {
       
        setLoading2(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/questiontype`;
   
           BaseService.get(url,token).then((object) => {
           //console.log(object);
            if(object.succes){
               settextfieldtype(object.data);
                
       
               
               setLoading2(false);
       
                }else{
               showalert(object);
               setLoading2(false);
       
       
                }
       
           
        }).catch((message) => {
            setLoading2(false);
   
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
        
       
        if(router.isReady){
            
          
            getservices();
            gettextfield();
    
           
    
            initFilters1();

            
         }
      }, [router.isReady]);


      //update image 

      function uploadFile() {
        if((file.length === 0)){
            showalert(
                {
                    "succes" : false,
                    "error" : "Lütfen Resim Ekleyiniz",
                    
                } 
            );
            return;
        }
        setLoading(true)
    
        const formData = new FormData();
            
        
        formData.append("file", file[0].file);
        formData.append('dir', "services");
    
    
        var token = "";
                user.getIdToken().then(function(idToken) {  
                   token =  idToken;
                }).then(()=>{
                    BaseService.upload(formData,token).then((data) => {
    
                        if (data.succes) {
                            
                            if (data.data.path.length == 0) {
                                setLoading(false)
    
        
                                showalert(
                                    {
                                        "succes": false,
                                        "error": "Resim Yükleme Hatası",
        
                                    }
                                );
                                return;
                            } else{
                                updateimage(data.data.path);
                            }
        
        
        
                        } else {
                            setLoading(false)
        
                            showalert(data);
        
                        }
                        // setUploadedFile([data]);
                    })
                    .catch(({ message }) => {
                        setLoading(false)
        
                        showalert({
                            "succes": false,
                            "error": message,
        
                        });
                    }); 
                });
    
    }
    
    const updateimage = async (image) => {
       
       
        setLoading(true);
        var body = {};
    
      
            body = JSON.stringify({
               "id": id,
             "icon_path" : image[0],
               
               
            } )
    
     
    
        
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
        const url = `${baseUrl}/service`;
        BaseService.put(url,body,token).then((object) => {
            // console.log(object);
             if(object.succes){
                        
                        setFile([]);
                        
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

            const url = `${baseUrl}/question/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
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
    const confirmationDialogFooterDeleteOption = (
        <>
            <Button type="button" label="Hayır" icon="pi pi-times" onClick={() => setdeleteconfirm(false)} text />
            <Button type="button" label="Evet" icon="pi pi-check" onClick={() => deleteoption()} text autoFocus />
        </>
    );
    const deleteoption = async () => {
        setdeleteconfirm(false);
        setLoading2(true);


      
        
        var token = "";
        const url = `${baseUrl}/option`;
        var deletelist = [];
        deletelist.push(deleteidoption);
        var body = {};
         body  = JSON.stringify({
           id : deletelist
                  
               } )

        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            BaseService.deletewithbody(url,body,token).then((data) => {
                    if(data.succes){
                    getservices();
                    setLoading2(false);

                    }else{
                showalert(data);
                   setLoading2(false);
    
    
                    }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message =>  {
                    showalert({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
                    setLoading2(false);
                } ) ;
         })
         
      
          }
    const deleteTemplateoption = (rowData) => {
          
        return   <div>
            <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={() => { 
            setdeleteidoption(rowData.id);
           setdeleteconfirm(true); 
            }} />
                        <Dialog header="Silme İşlemi Onayı" visible={deleteconfirm} onHide={() => setdeleteconfirm(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooterDeleteOption}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                <span>Silmek İstediğinize Emin Misiniz?</span>
                            </div>
                        </Dialog>
        </div>
        
        ;
    };

    const deleteTemplateQuestion = (rowData) => {
          
        return   <div>
            <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={() => { 
            setdeleteidques(rowData.id);
            setdeleteconfirmques(true); 
            }} />
                        <Dialog header="Silme İşlemi Onayı" visible={deleteconfirmques} onHide={() => setdeleteconfirm(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooterDeleteQuestion}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                <span>Silmek İstediğinize Emin Misiniz?</span>
                            </div>
                        </Dialog>
        </div>
        
        ;
    };
    const confirmationDialogFooterDeleteQuestion = (
        <>
            <Button type="button" label="Hayır" icon="pi pi-times" onClick={() => setdeleteconfirmques(false)} text />
            <Button type="button" label="Evet" icon="pi pi-check" onClick={() => deletequestion()} text autoFocus />
        </>
    );
    const deletequestion = async () => {
        setdeleteconfirmques(false);
        setLoading2(true);


      
        
        var token = "";
        const url = `${baseUrl}/question`;
        var deletelist = [];
        deletelist.push(deleteidques);
        var body = {};
         body  = JSON.stringify({
           id : deletelist
                  
               } )

        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            BaseService.deletewithbody(url,body,token).then((data) => {
                    if(data.succes){
                    getservices();
                    setLoading2(false);

                    }else{
                showalert(data);
                   setLoading2(false);
    
    
                    }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message =>  {
                    showalert({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
                    setLoading2(false);
                } ) ;
         })
         
      
          }


     /// is reseller
     const switchTemplateReseller = (rowData) => {
       

        return (
            
         <InputSwitch checked={rowData.is_reseller} onChange={(e) =>{ 
           

            updateswitchReseller(e.value,rowData.id);
        }} />
            
        );
    };

    const updateswitchReseller = async (newvalue,newid) => {
        setLoading(true);

            const url = `${baseUrl}/productbrand`;
            
            var body = {
                "id" : newid,
                "is_reseller" : newvalue
            };
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
            fetch(url, {
                method: "PUT",  
                body:  body, 
            headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
            
              .then(response => {
                return response.json();
              }) .then(data => {
                console.log(data);
                if(data.succes){
                getbrands();

                }else{
                showalertgetbranderror(data);
               setLoading(false);


                }
               // setUploadedFile([data]);
              })
              .catch((message) => {
                setLoading(false);

                showalertgetbranderror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });


              }); });
          
    }
   



const DialogFooterAddOption = (
    <>
        <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setaddoptiondialog(false)} text />
        <Button type="button" label="Ekle" icon="pi pi-check" onClick={() => addoption()} text autoFocus />
    </>
);
const addoption = async () => {
    if(optionname == null || optionname == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen İsim Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(optioninformation == null || optioninformation == ""){
        showalert(
           {
                "succes" : false,
                "error" : "Lütfen Cevap Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(addselectedquestion == null ){
        showalert(
           {
                "succes" : false,
                "error" : "Cevap Bilgisine Ulaşılamadı",
                
            } 
        );
        return;
    }
   
    setaddoptiondialog(false)
    setLoading2(true);
    var body = {};

  
        body = JSON.stringify({
            "name": optionname,
           "servicequestionId": addselectedquestion.id, 
          "information": optioninformation,
           
           
        } )

 

    
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
    const url = `${baseUrl}/option`;
    BaseService.post(url,body,token).then((object) => {
        // console.log(object);
         if(object.succes){
                    setoptionname("");
                    setoptioninformation("");
                    setaddselectedquestion(null);
                   

                    
                    getservices();
                    setLoading2(false);
             
    
            
    
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

const addquestion = async () => {
    if(question == null || question == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Soru Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(information == null || information == ""){
        showalert(
           {
                "succes" : false,
                "error" : "Lütfen Soru Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(subtitle == null || subtitle ==""){
        showalert(
            {
                "succes" : false,
                "error" : "Lütfen Soru Alt Başlık Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(dropdownItem == null){
        showalert(
            {
                "succes" : false,
                "error" : "Lütfen İpucu Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if( dropdownItem.code == "text"){
     
        if(dropdownItemTextField == null){
            showalert(
                {
                    "succes" : false,
                    "error" : "Lütfen İpucu Bilgisini Giriniz",
                    
                } 
            );
            return;
        }

        
    }

   
   
    setLoading2(true);
    var body = {};
    console.log(service.survey.id);


  if( dropdownItem.code == "text"){
    body = JSON.stringify({
        "question": question,
       "surveyId": service.survey.id,
       "subtitle": subtitle,
       "information": information,
       "optional": leadingcheckbox,
       "questionType": dropdownItem.code, 
       "servicequestiontypeId": dropdownItemTextField.id,
       "hintText": hinttext,  
              
           } )
  }else{
    body = JSON.stringify({
        "question": question,
       "surveyId": service.survey.id,
       "subtitle": subtitle,
       "information": information,
       "optional": leadingcheckbox, 
       "questionType": dropdownItem.code, 
       "hintText": hinttext,  

              
              
           } )

  }
       

 

    
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            console.log(body);
    const url = `${baseUrl}/question`;
    BaseService.post(url,body,token).then((object) => {
        console.log(object);
         if(object.succes){
                   
                   
                    setSubtitle("");
                    setQuestion("");
                    setInformation("");
                    setHintText("");

                    getservices();
                    setLoading2(false);
             
    
            
    
             }else{
                showalert(object);
                 setLoading2(false);
    
    
             }
    
        
     }).catch((message) => {
        setLoading2(false);
        console.log(message);

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

    const onleadingCheckboxChange = (e) => {
        setleadingcheckbox(e.checked);
    
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




   

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };
    const deleteTemplate = (rowData) => {
        return   <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
        ;
    };

 

   
   
   

 

   

  


   




    const imageBodyTemplate = (rowData) => {
        return <img src={`${fileUrl}${rowData.path}`} onError={(e) => (e.target.src = `${errorImageUrl}`)} alt={rowData.path} className="shadow-2" width={100} />;
    };

    const questiontypenameBodyTemplate = (rowData) => {
        if(rowData.servicequestiontype == null){
            return <label  ></label> ;
        }
        if(rowData.servicequestiontype.name == null){
            return <label  ></label> ;


        }else{
            return <label  >{rowData.servicequestiontype.name}</label> ;

        }
      
        
        
    };

    const questionTypeBodyTemplate = (rowData) => {
        switch(rowData.questionType) {
            case "text":
             return <label  >Yazı</label> ;
              // a kod bloğu
            
            case  "singleselect":
                return <label>Tekli Seçme</label> ;
              // b kod bloğu
            case "checkbox":
                return <label>Kutucuk İşaretleme</label> ;
            case "multiselect":
                return <label>Çoklu Seçme</label> ;
            default:
                return <label>Yazı</label> ;
              // varsayılan kod bloğu
          }
        
    };

    const optionalBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': !rowData.optional, 'text-pink-500 pi-times-circle': rowData.optional })}></i>;
    };



   

   
    const rowExpansionTemplate = (rowData) => {
        
        return (
            <div className="orders-subtable">
                 <div className="grid formgrid">
                 {rowData.questionType == "text" ?
                <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <h5>Cevap Seçeneğine Gerek Yoktur</h5>
            </div> : <>
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Cevap Seçenekleri</h5>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 ">
                        <Button label="Ekle" icon="pi pi-plus" severity="success" onClick={() => {
                            setaddselectedquestion(rowData);
                            setaddoptiondialog(true);
                        }} />
                        </div>
                        <Dialog header="Cevap Seçeneği Ekle" visible={addoptiondialog} onHide={() => setaddoptiondialog(false)} style={{ width: '350px' }} modal footer={DialogFooterAddOption}>
                        

                           <div className="grid formgrid">
                           <div className="col-12 mb-2">
                        
                                <span>Lütfen Bilgileri Giriniz </span>
                                

                            </div>
                        
                        <div  className="col-12 mb-2"> 
                            <label >Cevap Seçenek Adı </label>
                            
                        <InputText id="optionname" value={optionname} type="text" onChange={(e)=> setoptionname(e.target.value)}/>
                        </div>

                        <div  className="col-12 mb-2"> 
                            <label >Cevap Seçenek Açıklaması </label>
                            
                        <InputText id="optioninfo" value={optioninformation} type="text" onChange={(e)=> setoptioninformation(e.target.value)}/>
                        </div>
                        
                       
                          </div>
                        
                        </Dialog>
            </>
                }
                        
                      
                    </div>
                    
                    {rowData.questionType == "text" ?
                <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <></>
            </div> :
                <DataTable value={rowData.options} responsiveLayout="scroll">
                    <Column field="name" header="Ad" ></Column>
                    <Column field="information" header="Açıklama" ></Column>
                    <Column field="id" header="Seçeneği Sil"  style={{ minWidth: '8rem' }} body={deleteTemplateoption}  />
                   
                </DataTable>  }
            </div>
        );
    };

  

   

   

    const header1 = renderHeader1();

    return (
        <div>
            <div className="grid">

<div className="col-12">
<div className="card">
      

{service &&  <h5>{service.name && service.name}</h5> }





</div>
</div>
</div>

<div className="card">
                <div className="grid formgrid">
                    

<div className="field col-12 md:col-8">
                            <h5>Resim Güncelleme</h5>
                        </div>
<div className="field col-12"> 
<Dropzone accept='image/*'   label="Resmini Buraya Sürükle veya Ekle" onChange={(event)=>setFile(event)} value={file}>
{file.length != 0 && file.map((filex, index) => (
                                    <div key={index} >
                                        <FileMosaic {...filex} preview />

                                    </div>
                                ))}
                    </Dropzone>
</div>

<div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Resmi Güncelle" outlined onClick={() =>uploadFile()} />
</div>

                </div>
</div>

        <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Giriş Sorularını Ekle</h5>
                        </div>
                       

                      
                    </div>
                    <Dialog closable={false} visible={loading2} style={{ width: '200px', height: "200px" }}  >
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
                   
                    <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                    <label htmlFor="name">Soru</label>
                    <InputText value={question} id="name" type="text" onChange={(e)=> setQuestion(e.target.value)}/>
                    </div>
                   
                        <div className="field col-12 md:col-6">
                            <label htmlFor="subtitle">Soru Alt Başlığı</label>
                            <InputText value={subtitle} id="subtitle" type="text"onChange={(e)=> setSubtitle(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="desc">Soru Açıklaması</label>
                            <InputText value={information} id="desc" type="text"onChange={(e)=> setInformation(e.target.value)} />
                        </div>
                        
                          <div className="col-12 md:col-12">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="option" value="leading" checked={leadingcheckbox} onChange={onleadingCheckboxChange} />
                                <label >Soru Cevaplaması Zorunlu Değil?</label>
                            </div>
                        </div>
                          <div className="field col-12 md:col-6">
                            <label >Soru Tipi</label>
                            <Dropdown id="type" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div>
                        {
                            dropdownItem == null ?
<div className="field col-12 md:col-12"></div> :
                            dropdownItem.code == "text" ? 
                            
                            <div className="field col-12 md:col-6">
                            <label >Soru Yazı İçerik </label>
                            <Dropdown id="type" value={dropdownItemTextField} onChange={(e) => setdropdownItemTextField(e.value)} options={textfieldtype} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> : <div className="field col-12 md:col-12"></div> 
                        }
                   
                            <div className="field col-12 md:col-6">
                            <label htmlFor="desc">İpucu Metni</label>
                            <InputText value={hinttext} id="desc" type="text"onChange={(e)=> setHintText(e.target.value)} />
                        </div> 
                        
                       
                        
                        <div className="field col-12"> 

</div>
                      
                       
                        {/* <div className="field col-12 md:col-6">
                            <label htmlFor="state">Marka Tipi</label>
                            <Dropdown id="type" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> */}
                       
                        {/* <div className="col-12 md:col-12">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="option" value="leading" checked={leadingcheckbox} onChange={onleadingCheckboxChange} />
                                <label htmlFor="checkOption1">Tedarikçi Mi?</label>
                            </div>
                        </div> */}
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Ekle" outlined onClick={() =>addquestion()} />
</div>


   

    
                    </div>
                </div>
            </div> 

        <div className="grid">
        <div className="col-12">
                <div className="card">
<div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                            <h5>Sorular</h5>
                        </div>
                
                    </div>
                    <h1></h1>


                    <DataTable value={questions}  loading={loading} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll" rowExpansionTemplate={rowExpansionTemplate} dataKey="id" >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="question" header="        Soru       "  />
                        <Column field="subtitle" header="Soru Alt Başlığı"  />
                        <Column field="information" header="Soru Açıklaması"  />
                        <Column field="id" header="Soru Tipi"  body={questionTypeBodyTemplate} />
                        <Column field="id" header="Soru Yazı İçeriği Tipi"  body={questiontypenameBodyTemplate} />
                        <Column field="hintText" header="İpucu"  />

                        <Column field="id" header="Cevaplamak Zorunlu Mu?"  body={optionalBodyTemplate} />

                        

                        <Column header="Oluşturulma Tarihi" field="createdAt" dataType="date"  body={dateBodyTemplate}  />
                        <Column field="id" header="Kullanımda"   body={switchTemplate}  />
                        <Column field="id" header="Sil"   body={deleteTemplateQuestion}  />


                        



                    </DataTable>
                </div>
            </div>
            </div>


            
            
            </div>
           
    );
};

export default Services;



