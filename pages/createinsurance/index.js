import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { BaseService } from '@/service/BaseService';

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
import { InputNumber } from 'primereact/inputnumber';



const CreateInsurance = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const searchParams = new URLSearchParams(router.query);


    const [loading2, setLoading2] = useState(false);
    
 
    const [file, setFile] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingBrands, setLoadingBrands] = useState(true);


    const [loadingpoint, setLoadingPoint] = useState(false);


    
    const [identityNumber, setidentityNumber] = useState("");
    const [identityNumberPoint, setidentityNumberPoint] = useState("");
    const [dropdownItemUserPoint, setdropdownItemUserPoint] = useState(null);

    const [leadingcheckbox, setleadingcheckbox] = useState(false);
    const [leadingcheckboxpoint, setleadingcheckboxpoint] = useState(false);
    const [services, setServices] = useState([]);
    const [dropdownItemService, setdropdownItemService] = useState(null);

     const [brands, setBrands] = useState([]);
    const [dropdownItemBrand, setdropdownItemBrand] = useState(null);

    const [dropdownItemUser, setdropdownItemUser] = useState(null);

    const [users, setUsers] = useState([]);
    const [usersPoint, setUsersPoint] = useState([]);

    const [startcalendarValue, setStartCalendarValue] = useState(null);
    const [endcalendarValue, setEndCalendarValue] = useState(null);
    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);
    const [amount, setAmount] = useState("");
    const [addinsurancesucces, setaddinsurancesucces] = useState(false);


    const [carId, setCarId] = useState("");
    const [requestId, setRequestId] = useState("");
    const [requestVersionId, setrequestVersionId] = useState("");
    const [proposalId, setproposalId] = useState("");

  

    const onGlobalFilterChange1 = (e) => {
        setdropdownItemUser(null)
        setidentityNumber(e);
        getusers(e);
    };
    const onGlobalFilterChangePoint = (e) => {
        setdropdownItemUserPoint(null)
        setidentityNumberPoint(e);
        getuserspoint(e);
    };

   
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
                newdata.push({"id" : element.id, "tc":element.identityNumber  , "label" : `TC:${element.identityNumber} ${element.name == null ? "" : element.name} ${element.surname == null ? "" :  element.surname} Telefon:${element.telephone} Puan:${element.total_point == null ? 0 : element.total_point}`})
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
       const getuserspoint = async (identityNumber) => {
       
        setLoadingPoint(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/users?identityNumber=${encodeURIComponent(identityNumber)}&page=${encodeURIComponent(0)}&size=${encodeURIComponent(20)}`;
   
           BaseService.get(url,token).then((object) => {
            if(object.succes){
               let newdata = [];
               object.data?.forEach((element) => {
                   newdata.push({"id" : element.id ,"tc": element.identityNumber, "label" : `TC:${element.identityNumber} ${element.name == null ? "" : element.name} ${element.surname == null ? "" :  element.surname} Telefon:${element.phone} Puan:${element.total_point == null ? 0 : element.total_point}`})
               })
   
               setUsersPoint(newdata)
                
       
               
               setLoadingPoint(false);
       
                }else{
                   showalert(object);
                   setLoadingPoint(false);
       
       
                }
       
           
        }).catch((message) => {
            setLoadingPoint(false);
   
           showalert({
               "succes" : false,
               "error" : message.toString()
               
           });
           // console.log(error);
       
       
        }); 
       });
    }
    const getservices = async () => {
       
        setLoadingServices(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/service?is_checked=true`;
   
           BaseService.get(url,token).then((object) => {
           //console.log(object);
            if(object.succes){
                let newdata = [];
                object.data?.forEach((element) => {
                    newdata.push({"id" : element.id , "label" : ` ${element.name == null ? "" : element.name} `})
                })
               setServices(newdata);
                
       
               
               setLoadingServices(false);
       
                }else{
                   showalert(object);
                   setLoadingServices(false);
       
       
                }
       
           
        }).catch((message) => {
            setLoadingServices(false);
   
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


    const getbrands = async () => {
       
        setLoadingBrands(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/brand`;
   
           BaseService.get(url,token).then((object) => {
           console.log(object);
            if(object.succes){
                let newdata = [];
                object.data?.forEach((element) => {
                    newdata.push({"id" : element.id , "label" : ` ${element.name == null ? "" : element.name} `})
                })
               setBrands(newdata);
                
       
               
               setLoadingBrands(false);
       
                }else{
                   showalert(object);
                   setLoadingBrands(false);
       
       
                }
       
           
        }).catch((message) => {
            setLoadingBrands(false);
   
           showalert({
               "succes" : false,
               "error" : message.toString()
               
           });
           // console.log(error);
       
       
        }); 
       });
         
       
          }

       

  
      

  
    useEffect(() => {
        
       
        if(router.isReady){
        
          if(searchParams.get('carId') != null){
            
            setCarId(searchParams.get('carId'));

          }
          if(searchParams.get('requestId') != null){
            setRequestId(searchParams.get('requestId'));

          }
          if(searchParams.get('requestversionId') != null){
            setrequestVersionId(searchParams.get('requestversionId'));

          }
          if(searchParams.get('proposalId') != null){
            setproposalId(searchParams.get('proposalId'));

          }
         
         

         
        getservices();
        getbrands();


            
         }
      }, [router.isReady]);

    



    const onleadingCheckboxChange = (e) => {
        setleadingcheckbox(e.checked);
    
    };
    const onleadingCheckboxChangePoint = (e) => {
        setleadingcheckboxpoint(e.checked);
    
    };



function uploadFile() {
 



    
    if(identityNumber == null || identityNumber == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Kullanıcı Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(file == null || file == "" ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Sigorta Poliçe PDF Ekleyiniz",
                
            } 
        );
        return;
    }

    if(file.length == 0 ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Sigorta Poliçe PDF Ekleyiniz",
                
            } 
        );
        return;
    }

    
    if((amount == null || amount == "") && amount !=0){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Kazanılacak Puan Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(dropdownItemUser == null){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Sigorta Kullanıcısını Seçiniz",
                
            } 
        );
        return;
    }
    if(dropdownItemService == null){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Sigorta Türü Seçiniz",
                
            } 
        );
        return;
    }
     if(dropdownItemBrand == null){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Sigorta Şirketi Seçiniz",
                
            } 
        );
        return;
    }
    if(startcalendarValue == null || endcalendarValue == null){
        showalert({
          "succes" : false,
          "error" : "Lütfen Tarih Seçiniz"
          
      });
      return;
      }
      if(leadingcheckbox){
        if(dropdownItemUserPoint == null){
            showalert(
             {
                    "succes" : false,
                    "error" : "Lütfen Puan Kazanacak Kullanıcıyı Seçiniz",
                    
                } 
            );
            return;
        }

       
      }
      const now = Date.now();
          var timestamp = Date.parse(startcalendarValue);
         
          var timestampx = Date.parse(endcalendarValue);

          if(timestamp > timestampx){
            showalert(
                {
                    "succes" : false,
                    "error" : "Lütfen Başlangıç Tarihini Bitiş Tarihin Önce Bir Tarih Seçiniz",
                    
                } 
            );
            return;
          }
    
          if(timestampx < now){
            showalert(
                {
                    "succes" : false,
                    "error" : "Lütfen Bitiş Tarihini Bugün veya Daha Sonrası Bir Tarih Seçiniz",
                    
                } 
            );
            return;
          }
      setLoading2(true);
    
   
   
   
    const formData = new FormData();
        
    
    formData.append("file", file[0].file);
    formData.append('dir', "insurances");


    var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
                BaseService.upload(formData,token).then((data) => {

                    if (data.succes) {
                        
                        if (data.data.path.length == 0) {
                            setLoading2(false);
    
                            showalert(
                                {
                                    "succes": false,
                                    "error": "PDF Yükleme Hatası",
    
                                }
                            );
                            return;
                        } else{
                            createinsurance(data.data.path);
                        }
    
    
    
                    } else {
                        setLoading2(false);
    
                        showalert(data);
    
                    }
                    // setUploadedFile([data]);
                })
                .catch(({ message }) => {
                    setLoading2(false);
    
                    showalert({
                        "succes": false,
                        "error": message,
    
                    });
                }); 
            });

}

const createinsurance = async (pdf) => {
    var timestampstart = Date.parse(startcalendarValue);
    var d = new Date(timestampstart);
    var  timeStampStart = d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();
  
  
    var timestampend = Date.parse(endcalendarValue);
    var dend = new Date(timestampend);
    var  timeStampEnd = dend.getFullYear() + '/' + (dend.getMonth()+1) + '/' + dend.getDate();
   
    setLoading2(true);
    var body = {};

    if(leadingcheckbox){
        body = JSON.stringify({
            "startDate" : timeStampStart,
            "endDate" : timeStampEnd,

            "owneruserId" : dropdownItemUser.id,
            "createduserId" : dropdownItemUserPoint.id,
            "serviceId" : dropdownItemService.id,
            "brandId" : dropdownItemBrand.id,

            "proposalId": proposalId == "" ? null : proposalId,
            "requestId": requestId == "" ? null : requestId,
            "requestversionId": requestVersionId == "" ? null : requestVersionId,
"carId": carId == "" ? null : carId,
            "pdf" : pdf[0],
           
           
        } )

    }else{
    

        body = JSON.stringify({
            "startDate" : timeStampStart,
            "endDate" : timeStampEnd,
            "owneruserId" : dropdownItemUser.id,
            "createduserId" : dropdownItemUser.id,
            "serviceId" : dropdownItemService.id,
"proposalId": proposalId,
            "requestId": requestId,
            "requestversionId": requestVersionId,
"carId": carId,
            "pdf" : pdf[0],
           
           
        } )
    }

  

 

    
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
    const url = `${baseUrl}/insurance`;
    BaseService.post(url,body,token).then((object) => {
         if(object.succes){
                   
         
            
                   
            addpoint(object.data.id);
            
    
            
    
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

      const addpoint = async (insuranceid) => {
       
        var body2 = {};
        if(leadingcheckboxpoint){
           
            if(leadingcheckbox){
                body2 = JSON.stringify({
                    "point" : amount,
                    "status" : "used",
                    "userId" : dropdownItemUserPoint.id,
                    "insuranceId" : insuranceid,
                   
                } )
            }else{
                body2 = JSON.stringify({
                    "point" : amount,
                    "status" : "used",
                    "userId" : dropdownItemUser.id,
                    "insuranceId" : insuranceid,

                   
                } )
            }
        }else{
            if(leadingcheckbox){
                body2 = JSON.stringify({
                    "point" : amount,
                    "status" : "rewarded",
                    "userId" : dropdownItemUserPoint.id,
                    "insuranceId" : insuranceid,

                   
                } )
            }else{
                body2 = JSON.stringify({
                    "point" : amount,
                    "status" : "rewarded",
                    "userId" : dropdownItemUser.id,
                    "insuranceId" : insuranceid,

                   
                } )
            }
        }

       

        var token2 = "";
        user.getIdToken().then(function(idToken) {  
           token2 =  idToken;
        }).then(()=>{
    const url2 = `${baseUrl}/points`;
    BaseService.post(url2,body2,token2).then((object) => {
        //console.log(object);
      
         if(object.succes){
           
            setidentityNumberPoint("");
            setidentityNumber("");
            setAmount("");
            setdropdownItemUser(null);
            setdropdownItemUserPoint(null);
            setFile([]);
                   
            setLoading2(false);
            setaddinsurancesucces(true);
    
            
    
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


      const sendNotif = async (identityNumber) => {
       
        var body = {};

       
            body = JSON.stringify({
                "body" : "Sigortanızın poliçesine Sigorta Poliçelerim bölümünden ulaşabilirsiniz.",
    "title": "Sigortanız Oluşturuldu",
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
 

  
    function formatingDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }
    const formatDate = (value) => {
     
       
        
var xx =  formatingDate(value);
        
        return xx;
    };

  

    const DialogFooterSuccesProduct = (
        <>
            <Button type="button" label="Tamam" icon="pi pi-times" onClick={() => setaddinsurancesucces(false)} text />
        </>
    );




   

   

 

   

  

   

   

   

  

   

   


    return (
        <div>

        <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Sigorta Poliçesi Oluştur</h5>
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
                            <label >Sigorta Sahibi TC</label>
                            <InputText id="name" value={identityNumber} type="text" onChange={(e)=> onGlobalFilterChange1(e.target.value)}/>
                        </div>
                       
                        <div className="field col-12 md:col-12">
                            {identityNumber == null || identityNumber == "" ?  <label >Sigorta Sahibi Bilgisi Giriniz</label> :
                         loading ? <CircularProgress /> : 

                            <Dropdown    id="user" value={dropdownItemUser} onChange={(e) => setdropdownItemUser(e.value) } options={users}   optionLabel="label" placeholder="Kullanıcı Seçiniz"></Dropdown>}
                        </div>

                        <div className="field col-12 md:col-6">
                       <label>Sigorta Başlangıç Tarihi</label>
                       <Calendar showIcon showButtonBar dateFormat="dd/mm/yy" value={startcalendarValue} onChange={(e) => setStartCalendarValue(e.value)}></Calendar>
                       </div>

                       <div className="field col-12 md:col-6">
                       <label>Sigorta Bitiş Tarihi</label>
                       <Calendar showIcon showButtonBar dateFormat="dd-mm-yy" value={endcalendarValue} onChange={(e) => {
                        setEndCalendarValue(e.value);
                        
                        }}></Calendar>
                       </div>
                       <div className="field col-12 md:col-12">
                             <label >Sigorta Türü</label> 
                        { loadingServices ? <CircularProgress /> : 

                            <Dropdown    id="user" value={dropdownItemService} onChange={(e) => setdropdownItemService(e.value) } options={services}   optionLabel="label" placeholder="Sigorta Türü Seçiniz"></Dropdown>}
                        </div>
                        <div className="field col-12 md:col-12">
                             <label >Sigorta Şirketi</label> 
                        { loadingBrands ? <CircularProgress /> : 

                            <Dropdown    id="user" value={dropdownItemBrand} onChange={(e) => setdropdownItemBrand(e.value) } options={brands}   optionLabel="label" placeholder="Sigorta Şirketi Seçiniz"></Dropdown>}
                        </div>
                       <div className="col-12 md:col-12">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption2" name="option" value="leading" checked={leadingcheckboxpoint} onChange={onleadingCheckboxChangePoint} />
                                <label >Puan Kullanılacak Mı?</label>
                            </div>
                        </div>
                       <div className="col-12 mb-2 md:col-6 ">
                      {leadingcheckboxpoint ?  <label>Kullanılacak Puan </label> :<label>Kazanılacak Puan </label>}  
                     <InputNumber value={amount} onValueChange={(e) => setAmount(e.value)} mode="decimal" minFractionDigits={2}></InputNumber>
                       </div>
                       <div className="col-12 md:col-12">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="option" value="leading" checked={leadingcheckbox} onChange={onleadingCheckboxChange} />
                                <label >Puan Kazanacak Kullanıcı Farklı</label>
                            </div>
                        </div>

                        
                        {leadingcheckbox && <>
                            <div className="field col-12 md:col-6">
                            <label >Puan Sahibi TC</label>
                            <InputText id="name" value={identityNumberPoint} type="text" onChange={(e)=> onGlobalFilterChangePoint(e.target.value)}/>
                        </div>
                       
                        <div className="field col-12 md:col-12">
                            {identityNumberPoint == null || identityNumberPoint == "" ?  <label >Puan Sahibi Bilgisi Giriniz</label> :
                         loadingpoint ? <CircularProgress /> : 

                            <Dropdown    id="user" value={dropdownItemUserPoint} onChange={(e) => setdropdownItemUserPoint(e.value) } options={usersPoint}   optionLabel="label" placeholder="Kullanıcı Seçiniz"></Dropdown>}
                        </div>
                      
                        
                        </>}
                      
                        <div className="field col-12 md:col-6">
                            <label >Teklif ID</label>
                            <InputText id="teklif" value={proposalId} type="text" onChange={(e) => setproposalId(e.value)}/>
                            <small id="teklif-help">
        Teklif ID Boş Bırakabilirsiniz. Yenilemede otomatik teklif oluşması için gereklidir.
    </small>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label >İstek ID</label>
                            <InputText id="request" value={requestId} type="text" onChange={(e) => setRequestId(e.value)}/>
                            <small id="request-help">
                            İstek ID Boş Bırakabilirsiniz. Yenilemede otomatik teklif oluşması için gereklidir.
    </small>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label >İstek Versiyon ID</label>
                            <InputText id="requestversiyon" value={requestVersionId} type="text" onChange={(e) => setrequestVersionId(e.value)}/>
                            <small id="requestversiyon-help">
                            İstek Versiyon ID Boş Bırakabilirsiniz. Yenilemede otomatik teklif oluşması için gereklidir.
    </small>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label >Araba ID</label>
                            <InputText id="carid" value={carId} type="text" onChange={(e) => setCarId(e.value)}/>
                            <small id="carid-help">
                            Araba ID Boş Bırakabilirsiniz. Yenilemede otomatik teklif oluşması için gereklidir.
    </small>
                        </div>
                     
                       

                        <div className="field col-12"> 
<Dropzone accept='.pdf'   label="Sigorta PDF'ini Buraya Sürükle veya Ekle" onChange={(event)=>setFile(event)} value={file}>
{file.length != 0 && file.map((filex, index) => (
                                    <div key={index} >
                                        <FileMosaic {...filex} preview />

                                    </div>
                                ))}
                    </Dropzone>
</div>
                      
<Dialog  visible={addinsurancesucces} onHide={() => setaddinsurancesucces(false)} style={{ width: '350px' }} modal footer={DialogFooterSuccesProduct}>
                        <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-thumbs-up mr-3" style={{ fontSize: '2rem' }} />
                                <span>Sigorta Ekleme İşleminiz Başarılı</span>
                            </div>
                        </Dialog>
                     
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Ekle" outlined onClick={() =>uploadFile()} />
</div>


   

    
                    </div>
                </div>
            </div> 



            
            
            </div>
           
    );
};

export default CreateInsurance;



