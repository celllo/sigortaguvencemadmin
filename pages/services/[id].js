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
    const [updateselectedoption, setupdateselectedoption] = useState(null);
    const [isoption, setisoption] = useState(false);

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
    const [newname, setNewName] = useState("");
   

    const [question, setQuestion] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [information, setInformation] = useState("");
    const [hinttext, setHintText] = useState("");
    const [path, setNewPath] = useState("");

    const [leadingcheckbox, setleadingcheckbox] = useState(false);

    const [leadingcheckboxupdatequestion, setleadingcheckboxupdatecheckbox] = useState(false);



    const [errorvisible, seterrorvisible] = useState(false);


    const [error, seterror] = useState(null);


    const [optionname, setoptionname] = useState("");
    const [optioninformation, setoptioninformation] = useState("");
    const [optionray, setoptionray] = useState(null);
    const [optionallianz, setoptionrayallian] = useState(null);
    const [optionquick, setoptionquick] = useState(null);


    const [ordervisible, setordervisible] = useState(false);
    const [selectedorderid, setselectedorderid] = useState(false);

    const [order, setorder] = useState(false);

    const [optionvisible, setoptionvisible] = useState(false);
    const [selectedoptionid, setselectedoptionid] = useState(false);

    const [option, setoption] = useState(false);


    const [questioninfovisible, setquestioninfovisible] = useState(false);
    const [questioninfotexttextvisible, setquestioninfotexttextvisible] = useState(false);
    const [newinfotext, setnewinfotext] = useState("");
    const [newinfotextbool, setnewinfotextbool] = useState("");
    const [selectedquestionid, setselectedquestionid] = useState(false);
    const questioninfoboolitems = [
        { name: 'Evet', code: true },
        { name: 'Hayır', code: false },

    ];

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
      //updatename

      const updatename = async () => {
        if((newname == null) || newname == ""){
            showalert(
                {
                    "succes" : false,
                    "error" : "Lütfen İsim Giriniz",
                    
                } 
            );
            return;
        }
       
        setLoading(true);
        var body = {};
    
      
            body = JSON.stringify({
               "id": id,
             "name" : newname,
               
               
            } )
    
     
    
        
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
        const url = `${baseUrl}/service`;
        BaseService.put(url,body,token).then((object) => {
            // console.log(object);
             if(object.succes){
                        
                        
                        setLoading(false);
                        getservices();
    
        
                
        
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


          const bedefaultTemplateQuestion = (rowData) => {
          
            return   <div>
                <Button label="Default Cevap Yap"   onClick={() => { 
               updateoptiondefault(rowData.id) 
                }} />
                           
            </div>
            
            ;
        };

          const updateoptiondefault = async (id) => {
            setLoading2(true);
    
    
          
            
            var token = "";
            const url = `${baseUrl}/option/default`;
           
            var body = {};
             body  = JSON.stringify({
               "id" : id
                      
                   } )
    
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
                BaseService.put(url,body,token).then((data) => {
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

    const updateTemplateoption = (rowData) => {
          
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() => { 
            setupdateselectedoption(rowData.id);
            setisoption(true);
           setaddoptiondialog(true); 
            }} />
                        
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
        <Button type="button" label= {isoption ? "Güncelle" : "Ekle"} icon="pi pi-check" onClick={() => isoption ? updateoption() : addoption()} text autoFocus />
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
          "allianzOtherCode" : optionallianz,
          "rayOtherCode" : optionray,
          "quickOtherCode" : optionquick
           
           
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
                    setoptionray("");
                    setoptionrayallian("");
                    setoptionquick("");



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

      const updateoption = async () => {
        var body = {"id" : updateselectedoption};
    
      
           
        if(optionname != null && optionname != ""){
           body.name = optionname;
        }
        if(optioninformation != null && optioninformation != ""){
          body.information = optioninformation;
        }

        if(optionallianz != null && optionallianz != ""){
            body.allianzOtherCode = optionallianz;
          }
        if(optionray != null && optionray != ""){
            body.rayOtherCode = optionray;
          }
          if(optionquick != null && optionquick != ""){
            body.quickOtherCode = optionquick;
          }
       
       
        setaddoptiondialog(false)
        setLoading2(true);
        
        body = JSON.stringify(body);
     
    
        
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
        const url = `${baseUrl}/option`;
        BaseService.put(url,body,token).then((object) => {
            // console.log(object);
             if(object.succes){
                        setoptionname("");
                        setoptioninformation("");
                        setoptionray("");
                        setoptionrayallian("");
                        setoptionquick("");
    
    
    
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
       "isExtra": leadingcheckboxupdatequestion,  
              
           } )
  }else{
    if(path == null){
        body = JSON.stringify({
            "question": question,
           "surveyId": service.survey.id,
           "subtitle": subtitle,
           "information": information,
           "optional": leadingcheckbox, 
           "questionType": dropdownItem.code, 
           "hintText": hinttext,  
           "isExtra": leadingcheckboxupdatequestion,  

                  
                  
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
           "path" :path,
           "isExtra": leadingcheckboxupdatequestion,  

                  
                  
               } )
    }
   

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
                    setNewPath("");


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
    const onleadingCheckboxChangeUpdateQuestion = (e) => {
        setleadingcheckboxupdatecheckbox(e.checked);
        if(e.checked){
            setleadingcheckbox(true);

        }else{
            setleadingcheckbox(false);
        }
    
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

    const optionalBodyQuestionTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.isExtra, 'text-pink-500 pi-times-circle': !rowData.isExtra })}></i>;
    };


    const optionDefaultTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.defaultAnswerxId != null, 'text-pink-500 pi-times-circle': rowData.defaultAnswerxId == null })}></i>;
    };


    //Option Güncelleme

    const DialogFooterOption = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setoptionvisible(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updateoptionorder()} text autoFocus />
        </>
    );

    const updateoptiontemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{ setselectedoptionid(rowData.id); setoptionvisible(true)} } />
            
        </div>
        
        ;
    };
    const updateoptionorder = async () => {
        setoptionvisible(false);
        if(order == null || order == ""){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen Order Giriniz",
                    
                } 
            );
            return;
        }
       
        setLoading(true);
        var token = "";
        var body = {};
        body  = JSON.stringify({
          id : selectedoptionid,
          order: order
                 
              } )
       
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/question`;
            BaseService.put(url,body,token).then((data) => {
                
                


                    if(data.succes){
                        setoption("");

                        getservices();

    
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


      



    //Order Güncelleme

    const DialogFooterOrder = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setordervisible(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updateorder()} text autoFocus />
        </>
    );

    const updateordertemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{ setselectedorderid(rowData.id); setordervisible(true)} } />
            
        </div>
        
        ;
    };
    const updateorder = async () => {
        setordervisible(false);
        if(order == null || order == ""){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen Order Giriniz",
                    
                } 
            );
            return;
        }
       
        setLoading(true);
        var token = "";
        var body = {};
        body  = JSON.stringify({
          id : selectedorderid,
          order: order
                 
              } )
       
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/option`;
            BaseService.put(url,body,token).then((data) => {
                
                


                    if(data.succes){
                        setorder("");

                        getservices();

    
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



    const questionisinfoTemplate = (rowData) => {
        

        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.showHint == true, 'text-pink-500 pi-times-circle': rowData.showHint != true })}></i>;
    };


    //Info Text Güncelleme

    const DialogFooterInfoText = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setquestioninfotexttextvisible(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updatequestioninfo()} text autoFocus />
        </>
    );

    const updateinfotexttemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{ setselectedquestionid(rowData.id); setquestioninfotexttextvisible(true)} } />
            
        </div>
        
        ;
    };
    const updatequestioninfo = async () => {
        setquestioninfotexttextvisible(false);
        if(newinfotext == null || newinfotext == ""){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen Yeni Açıklamayı Giriniz",
                    
                } 
            );
            return;
        }
       
        setLoading(true);
        var token = "";
        var body = {};
        body  = JSON.stringify({
          id : selectedquestionid,
          information: newinfotext
                 
              } )
       
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/question`;
            BaseService.put(url,body,token).then((data) => {
                
                


                    if(data.succes){
                        setnewinfotext("");

                        getservices();

    
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


      



    //Info Visibility Güncelleme

    const DialogFooterInfoVisibility = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setquestioninfovisible(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updatequestioninfobool()} text autoFocus />
        </>
    );

    const updateinfobooltemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{ setselectedquestionid(rowData.id); setquestioninfovisible(true)} } />
            
        </div>
        
        ;
    };
    const updatequestioninfobool = async () => {
        setquestioninfovisible(false);
        if(newinfotextbool == null ){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen Açıklama Görünürlüğü Seçiniz",
                    
                } 
            );
            return;
        }
       
        setLoading(true);
        var token = "";
        var body = {};
        body  = JSON.stringify({
          id : selectedquestionid,
          showHint: newinfotextbool.code
                 
              } )
       
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/question`;
            BaseService.put(url,body,token).then((data) => {
                
                


                    if(data.succes){
                        setnewinfotextbool(null);

                        getservices();

    
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
                            setisoption(false);
                            setaddoptiondialog(true);
                        }} />
                        </div>
                        <Dialog header={isoption ?"Cevap Seçeneğini Güncelle": "Cevap Seçeneği Ekle" }  visible={addoptiondialog} onHide={() => setaddoptiondialog(false)} style={{ width: '350px' }} modal footer={DialogFooterAddOption}>
                        

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

                        <div  className="col-12 mb-2"> 
                            <label >Ray Sigorta Kodu </label>
                            
                        <InputText id="optioninfo" value={optionray} type="text" onChange={(e)=> setoptionray(e.target.value)}/>
                        </div>

                        <div  className="col-12 mb-2"> 
                            <label >Allianz Sigorta Kodu </label>
                            
                        <InputText id="optioninfo" value={optionallianz} type="text" onChange={(e)=> setoptionrayallian(e.target.value)}/>
                        </div>

                        <div  className="col-12 mb-2"> 
                            <label >Quick Sigorta Kodu </label>
                            
                        <InputText id="optioninfo" value={optionquick} type="text" onChange={(e)=> setoptionquick(e.target.value)}/>
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
                    <Column field="rayOtherCode" header="Ray Sigorta Kodu" ></Column>
                    <Column field="allianzOtherCode" header="Allianz Sigorta Kodu" ></Column>
                    <Column field="quickOtherCode" header="Quick Sigorta Kodu" ></Column>

                    <Column field="id" header="Default Mu?"  style={{ minWidth: '8rem' }} body={optionDefaultTemplate}  />

                    <Column field="id" header="Seçeneği Default Değer Yap"  style={{ minWidth: '8rem' }} body={bedefaultTemplateQuestion}  />
                    <Column field="order" header="Seçenek Sıralaması"  style={{ minWidth: '8rem' }}   />
                    <Column field="id" header="Seçenek Sıralaması Güncelle"  style={{ minWidth: '8rem' }} body={updateordertemplate}  />


                    <Column field="id" header="Seçeneği Güncelle"  style={{ minWidth: '8rem' }} body={updateTemplateoption}  />
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
<div className="col-12">

<div className="card">
                <div className="grid formgrid">
                    
                <div className="p-fluid formgrid grid">

<div className="field col-12 md:col-8">
                            <h5>İsim Güncelleme</h5>
                        </div>

                        <div className="field col-12 md:col-12">
                        <label htmlFor="subtitle">Sigortanın Yeni İsmi</label>

                            <InputText value={newname} id="sds" type="text"onChange={(e)=> setNewName(e.target.value)} />
                        </div>


                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="İsmi Güncelle" outlined onClick={() =>updatename()} />
</div>
</div>


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
                                <Checkbox inputId="checkOption1" name="option" value="leading" checked={leadingcheckboxupdatequestion} onChange={onleadingCheckboxChangeUpdateQuestion} />
                                <label >Düzenleme Sorusu Mu?</label>
                            </div>
                        </div>
                        {
                            leadingcheckboxupdatequestion ?  
                            <div> </div> : 
                            <div className="col-12 md:col-12">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="option" value="leading" checked={leadingcheckbox} onChange={onleadingCheckboxChange} />
                                <label >Soru Cevaplaması Zorunlu Değil?</label>
                            </div>
                        </div>
                        }
                          
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
                        </div> :
                        dropdownItem.code == "singleselect" || dropdownItem.code == "multiselect" ? 
                            
                        <div className="field col-12 md:col-6">
                        <label >Soru İstek Adresi </label>
                        <InputText value={path} id="desc" type="text"onChange={(e)=> setNewPath(e.target.value)} />
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


<Dialog  visible={ordervisible} onHide={() => setordervisible(false)} style={{ width: '350px' }}  modal footer={DialogFooterOrder} >
<div className="field col-12 md:col-6">

<label >Sıralama Seç</label>
</div>
           
<InputNumber  value={order} onValueChange={(e) => setorder(e.value)}  mode="decimal" showButtons></InputNumber>
</Dialog>

<Dialog  visible={optionvisible} onHide={() => setoptionvisible(false)} style={{ width: '350px' }}  modal footer={DialogFooterOption} >
<div className="field col-12 md:col-6">

<label >Sıralama Seç</label>
</div>
           
<InputNumber  value={order} onValueChange={(e) => setorder(e.value)}  mode="decimal" showButtons></InputNumber>
</Dialog>

<Dialog  visible={questioninfotexttextvisible} onHide={() => setquestioninfotexttextvisible(false)} style={{ width: '350px' }}  modal footer={DialogFooterInfoText} >
<div className="field col-12 md:col-6">

<label >Açıklama Düzenle</label>
</div>
           
<InputText value={newinfotext} id="newdesc" type="text"onChange={(e)=> setnewinfotext(e.target.value)} />
</Dialog>

<Dialog  visible={questioninfovisible} onHide={() => setquestioninfovisible(false)} style={{ width: '350px' }}  modal footer={DialogFooterInfoVisibility} >
<div className="field col-12 md:col-6">

<label >Açıklama Görünsün Mü?</label>
</div>
           
<Dropdown id="type" value={newinfotextbool} onChange={(e) => setnewinfotextbool(e.value)} options={questioninfoboolitems} optionLabel="name" placeholder="Seçiniz"></Dropdown>
</Dialog>
                        <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                            <h5>Sorular</h5>
                        </div>


                
                    </div>
                    <h1></h1>


                    <DataTable value={questions}  loading={loading} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll" rowExpansionTemplate={rowExpansionTemplate} dataKey="id" >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="order" header="Order"  />

                        <Column field="question" header="        Soru       "  />
                        <Column field="subtitle" header="Soru Alt Başlığı"  />
                        <Column field="information" header="Soru Açıklaması"  />
                        <Column field="id" header="Açıklamayı Düzenle"  style={{ minWidth: '8rem' }} body={updateinfotexttemplate}  />
                    <Column field="id" header="Açıklama Görünürlüğü"  style={{ minWidth: '8rem' }} body={questionisinfoTemplate}  />
                    <Column field="id" header="Açıklamayı Görünür Yap"  style={{ minWidth: '8rem' }} body={updateinfobooltemplate}  />
                        <Column field="id" header="Soru Tipi"  body={questionTypeBodyTemplate} />
                        <Column field="id" header="Soru Yazı İçeriği Tipi"  body={questiontypenameBodyTemplate} />
                        <Column field="hintText" header="İpucu"  />


                        <Column field="id" header="Cevaplamak Zorunlu Mu?"  body={optionalBodyTemplate} />
                        <Column field="id" header="Düzenleme Sorusu Mu?"  body={optionalBodyQuestionTemplate} />
                        <Column field="id" header="Soru Sıralaması" body={updateoptiontemplate} />

                        <Column header="Oluşturulma Tarihi" field="createdAt" dataType="date"  body={dateBodyTemplate}  />
                        <Column field="id" header="Kullanımda"   body={switchTemplate}  />
                        <Column field="id" header="Sil"   body={deleteTemplateQuestion}  />
                        <Column field="path" header="Adres"    />



                        



                    </DataTable>
                </div>
            </div>
            </div>


            
            
            </div>
           
    );
};

export default Services;



