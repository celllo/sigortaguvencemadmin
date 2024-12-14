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



const CarUpdate = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const { id } = router.query;


    const [filters1, setFilters1] = useState(null);
    const [loading2, setLoading2] = useState(false);
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [service, setService] = useState();

    const [car, setCar] = useState();



    const [users, setUsers] = useState([]);

    const [chasisno, setChasisNo] = useState('');
    const [motorno, setMotorNo] = useState('');
    const [modelyear, setModelYear] = useState('');
    const [pasengerno, setPasengerNo] = useState('');

    const [calendarValue, setCalendarValue] = useState(null);
    const [calendarValueMuayene, setCalendarValueMuayene] = useState(null);




    const [carmodeltext, setCarmodeltext] = useState('');
    const [carmodels, setCarModels] = useState([]);
    const [carmodeltypes, setCarModelTypes] = useState([]);
    const [carmodeltypetext, setCarmodeltypetext] = useState('');

    const [fueltypes, setFueltypes] = useState([]);
    const [usagetypes, setUsagetypes] = useState([]);
    const [usagesubstancestypes, setUsagesubstancestypes] = useState([]);






    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(null);


    const [deleteconfirm, setdeleteconfirm] = useState(false);
    const [deleteidoption, setdeleteidoption] = useState(null);

    
   


   

    const [proposaltypedialog, setproposaltypedialog] = useState(false);
    const [selectedproposalid, setselectedproposalid] = useState(null);

    const [selectedcarModel, setSelectedCarModel] = useState(null);
    const [selectedcarModelType, setSelectedCarModelType] = useState(null);
    const [selectedUsageType, setSelectedUsageType] = useState(null);
    const [selectedUsageSubstances, setSelectedUsageSubstances] = useState(null);
    const [selectedFuelType, setSelectedFuelType] = useState(null);




 


    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);

    const [sucessvisible, setsucessvisible] = useState(false);
    const [success, setsuccess] = useState(null);



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
    const settescildate = (e) => {

        setCalendarValue(e.value);
    };
    const setmuayenedate = (e) => {

        setCalendarValueMuayene(e.value);
    };

    const onCarModel = (e) => {
        console.log(e.target.value);
        setCarmodeltext(e.target.value);
        getcarmodels(e.target.value);
        setSelectedCarModel(null);
        setCarmodeltypetext(null);
    };
    const onCarModelType = (e) => {
        console.log(e.value);
        setCarmodeltypetext(e.value);
        getcarmodeltypes(selectedcarModel.id,e.value);
        setSelectedCarModelType(null);
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
    const getcar = async () => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/car/${encodeURIComponent(id)}`;

        BaseService.get(url,token).then((object) => {
       //console.log(object.data);
         if(object.succes){
            setCar(object.data);
            setChasisNo(object.data.chasisno);
            setMotorNo(object.data.motorno);
            setModelYear(object.data.modelyear);
            setPasengerNo(object.data.passengerno);



            setUsers(object.data.users);
            if(object.data.carmodel != null){
            getcarmodels(object.data.carmodel.name);
            setCarmodeltext(object.data.carmodel.name);
            setSelectedCarModel(object.data.carmodel)
            if(object.data.carmodeltype != null){
                getcarmodeltypes(object.data.carmodel.id,object.data.carmodeltype.code);
                setCarmodeltypetext(object.data.carmodeltype.code);
                
                }
            }else{
                getcarmodels("");
                setCarmodeltext("");
            }
            
                if(object.data.carusagetype != null){
                    setSelectedUsageType(object.data.carusagetype);
                    
                    
                    if(object.data.carusagesubstance != null){

                        getusagesubstances(object.data.carusagetype.id,false);
                        setSelectedUsageSubstances(object.data.carusagesubstance)

                    }else{
                        
                        getusagesubstances(object.data.carusagetype.id,true);

                    }
                    }
                    
                    if(object.data.tescildate != null){
                     
                        const stringx = `${encodeURIComponent(object.data.tescildate.split("-")[1])}-${encodeURIComponent(object.data.tescildate.split("-")[2])}-${encodeURIComponent(object.data.tescildate.split("-")[0])} 00:00:00`.toString();
                        const date = new Date(stringx)
                      


                        setCalendarValue(date);

                        }

                        if(object.data.carfueltype != null){
                            setSelectedFuelType(object.data.carfueltype)
                            }


             
    
            
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
       const getcarmodels = async (value) => {
       
        setLoading(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/carmodel?name=${encodeURIComponent(value)}`;
            console.log(url);
           BaseService.get(url,token).then((object) => {
            if(object.succes){
               setCarModels(object.data);
               
                
       
               
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
          const getcarmodeltypes = async (carmodelid,value) => {
       
            setLoading(true);
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
               const url = `${baseUrl}/carmodeltype?code=${encodeURIComponent(value)}&carmodelId=${encodeURIComponent(carmodelid)}`;
       
               BaseService.get(url,token).then((object) => {
                if(object.succes){
                   setCarModelTypes(object.data);
                   if(object.data.length == 1){
                    setSelectedCarModelType(object.data[0]);
                   }
                    
           
                   
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
              const getfueltypes = async () => {
       
                setLoading(true);
                var token = "";
                user.getIdToken().then(function(idToken) {  
                   token =  idToken;
                }).then(()=>{
                   const url = `${baseUrl}/carfueltype`;
           
                   BaseService.get(url,token).then((object) => {
                    if(object.succes){
                       setFueltypes(object.data);
                        
               
                       
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

                  const getusagetypes = async () => {
       
                    setLoading(true);
                    var token = "";
                    user.getIdToken().then(function(idToken) {  
                       token =  idToken;
                    }).then(()=>{
                       const url = `${baseUrl}/carusagetype?size=${encodeURIComponent(40)}`;
               
                       BaseService.get(url,token).then((object) => {
                        if(object.succes){
                           setUsagetypes(object.data);
                            
                   
                           
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

                      const getusagesubstances = async (value,isnull) => {
       
                        setLoading(true);
                        var token = "";
                        user.getIdToken().then(function(idToken) {  
                           token =  idToken;
                        }).then(()=>{
                           const url = `${baseUrl}/carusagesubstance?carusagetypeId=${encodeURIComponent(value)}&size=${encodeURIComponent(40)}`;
                   
                           BaseService.get(url,token).then((object) => {
                            if(object.succes){
                               setUsagesubstancestypes(object.data);
                             


                               if(isnull){
                                console.log(isnull);
                                if(object.data != null){
                                    if(object.data.length > 0){
                                    setSelectedUsageSubstances(object.data[0]);
                                    }
                                   }
                               }
                               
                                
                       
                               
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

    const showsucces = (neweeror) => {
        setsuccess(neweeror);


        setsucessvisible(true);

       setTimeout(() => {
        setsuccess(null);
        setsucessvisible(false);

      } , 3000);
    };

    useEffect(() => {
        
       
        if(router.isReady){
            
          
            getcar();
            getfueltypes();
            getusagetypes();
    
           
    
            initFilters1();

            
         }
      }, [router.isReady]);
      


  

   
  


  
   






const updatecar= async () => {
    if(chasisno == null || chasisno == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Şase No Giriniz",
                
            } 
        );
        return;
    }

    if(chasisno.length != 17){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Geçerli Şase No Giriniz",
                
            } 
        );
        return;
    }

    if(motorno == null || motorno == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Kazanılacak Puan Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(modelyear == null || modelyear == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Model Yılı Giriniz",
                
            } 
        );
        return;
    }
    if(pasengerno == null || pasengerno == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Yolcu Sayısı Giriniz",
                
            } 
        );
        return;
    }
    if(selectedcarModel == null ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Araç Markası Seçiniz",
                
            } 
        );
        return;
    }
    if(selectedcarModelType == null ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Araç Modeli Seçiniz",
                
            } 
        );
        return;
    }
    if(selectedUsageType == null ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Kullanım Tarzı Seçiniz",
                
            } 
        );
        return;
    }
    if(selectedUsageSubstances == null ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Kullanım Amacı Seçiniz",
                
            } 
        );
        return;
    }
    if(selectedFuelType == null ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Yakıt Tipi Seçiniz",
                
            } 
        );
        return;
    }
    if(calendarValue == null ){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Tescil Tarihi Seçiniz",
                
            } 
        );
        return;
    }
   
    
 
   
    
  

   
   
    setLoading2(true);
    var body = {};
    if(calendarValueMuayene == null){
        body = JSON.stringify({
            "id" : id,
            "chasisno": chasisno,
            "motorno" : motorno,
            "passengerno" : pasengerno,
            "modelyear" : modelyear,
            "carusagetypeId" : selectedUsageType.id,
            "carusagesubstanceId" : selectedUsageSubstances.id,
            "carmodelId" : selectedcarModel.id,
            "carmodeltypeId" : selectedcarModelType.id,
            "carfueltypeId": selectedFuelType.id,
"tescildate" : calendarValue,
           // "tescildate": `${encodeURIComponent(calendarValue.toLocaleDateString().split(".")[0])}-${encodeURIComponent(calendarValue.toLocaleDateString().split(".")[1])}-${encodeURIComponent(calendarValue.toLocaleDateString().split(".")[2])}`,
            
            
            
                   
                   
                } )
    }else{
        body = JSON.stringify({
            "id" : id,
            "chasisno": chasisno,
            "motorno" : motorno,
            "passengerno" : pasengerno,
            "modelyear" : modelyear,
            "carusagetypeId" : selectedUsageType.id,
            "carusagesubstanceId" : selectedUsageSubstances.id,
            "carmodelId" : selectedcarModel.id,
            "carmodeltypeId" : selectedcarModelType.id,
            "carfueltypeId": selectedFuelType.id,
            "muayene" : calendarValueMuayene,
            "tescildate" : calendarValue,

            //"tescildate": `${encodeURIComponent(calendarValue.toLocaleDateString().split(".")[0])}-${encodeURIComponent(calendarValue.toLocaleDateString().split(".")[1])}-${encodeURIComponent(calendarValue.toLocaleDateString().split(".")[2])}`,
            
            
            
                   
                   
                } )
    }

        



   

  
    console.log(body);


 

    
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
    const url = `${baseUrl}/car`;
    BaseService.put(url,body,token).then((object) => {
         if(object.succes){
                   
                   
            showsucces({
                "succes" : true,
                "message" : "Başarıyla Güncellendi"
                
            });
                    setLoading2(false);
             
    
            
    
             }else{
                showalert(object);
                 setLoading2(false);
    
    
             }
    
        
     }).catch((message) => {
        setLoading2(false);
        //console.log(message);

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

    const dateEndBodyTemplate = (rowData) => {
        return formatDate(rowData.endDate);
    };

    

 
   
   

  

   

   

    const header1 = renderHeader1();

    return (
        <div>
           

      

       

            <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Araba Bilgileri</h5>
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

                    <Dialog  visible={sucessvisible} onHide={() => setsucessvisible(false)} style={{ width: '350px' }} modal >
                    <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-check mr-3" style={{ fontSize: '2rem' }} />

                    <label>{success == null ? "" :  success.message}</label>
                    </div>
                    </Dialog>
                   
                    <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-12">
                    {car &&  <label htmlFor="tcno"> TC veya Vergi No: {car.ownerid && car.ownerid}</label> }

                        </div>
                        <div className="field col-12 md:col-12">
                        {car &&  <label htmlFor="plate"> Plaka: {car.plate && car.plate}</label> }

                        </div>
                        <div className="field col-12 md:col-12">
                        {car &&  <label htmlFor="serino"> Seri No: {car.serialno && car.serialno}</label> }

                        </div>
                       
                    <div className="field col-12 md:col-6">
                            <label htmlFor="chasisno">Şase No</label>
                            <InputText value={chasisno} id="chasisno" type="text"onChange={(e)=> setChasisNo(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="motorno">Motor No</label>
                            <InputText value={motorno} id="motorno" type="text"onChange={(e)=> setMotorNo(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                    <label htmlFor="name">Model Yılı</label>
                    <InputNumber value={modelyear} onValueChange={(e) => setModelYear(e.value)} min={1900} max={2040} useGrouping={false}></InputNumber>
                    </div>
                    <div className="field col-12 md:col-6">
                    <label htmlFor="name">Yolcu Sayısı</label>
                    <InputNumber value={pasengerno} onValueChange={(e) => setPasengerNo(e.value)} min={0} max={100} useGrouping={false}></InputNumber>
                    </div>
                    <div className="field col-12 md:col-6">
                    <label htmlFor="carmodel">Kullanım Tarzı</label>

                            <Dropdown id="type" value={selectedUsageType} onChange={(e)=> {setSelectedUsageType(e.target.value); getusagesubstances(e.target.value.id,true); setSelectedUsageSubstances(null); }} options={usagetypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> 
                        {
                        selectedUsageType == null ? 
                        <div className="field col-12 md:col-6">
                        <label htmlFor="nullarac">Lütfen Kullanım Tarzı Seçiniz</label>
    
                            </div>  :  <div className="field col-12 md:col-6">
                    <label htmlFor="carmodeltype">Kullanım Amacı</label>
                  

                            <Dropdown id="type" value={selectedUsageSubstances} onChange={(e)=> setSelectedUsageSubstances(e.target.value)} options={usagesubstancestypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> 
                    }
                   
                    <div className="field col-12 md:col-6">
                    <label htmlFor="carmodel">Araç Markası</label>
                    <InputText value={carmodeltext} id="carmodel" type="text"onChange={onCarModel} />
                    <div style={{paddingTop:"10px"}}> </div>

                            <Dropdown id="type" value={selectedcarModel} onChange={(e)=> {setSelectedCarModel(e.target.value); getcarmodeltypes(e.target.value.id,""); setCarmodeltypetext(null); }} options={carmodels} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> 
                        <div className="field col-12 md:col-6">
                        </div>
                    {
                        selectedcarModel == null ? 
                        <div className="field col-12 md:col-6">
                        <label htmlFor="nullarac">Lütfen Araç Markası Seçiniz</label>
    
                            </div>  :  <div className="field col-12 md:col-6">
                    <label htmlFor="carmodeltype">Araç Modeli</label>
                    <InputNumber value={carmodeltypetext} id="carmodeltype" onChange={onCarModelType} useGrouping={false} placeholder="Araç Kodu" />
                    <small id="username-help">
        Aracın Kodunu Giriniz
    </small>
                    <div style={{paddingTop:"10px"}}> </div>

                            <Dropdown id="type" value={selectedcarModelType} onChange={(e)=> setSelectedCarModelType(e.target.value)} options={carmodeltypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> 
                    }
                    
                    <div className="field col-12 md:col-6">
                    </div>
                    <div className="field col-12 md:col-6">
                    <label htmlFor="carmodel">Yakıt Tipi</label>

                            <Dropdown id="type" value={selectedFuelType} onChange={(e)=> {setSelectedFuelType(e.target.value);}} options={fueltypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> 
                        <div className="field col-12 md:col-6">
                        </div>  
                    <div className="field col-12 md:col-6">
                    <label htmlFor="name">Tescil Tarihi </label>
                    <Calendar showIcon showButtonBar dateFormat="dd/mm/yy" value={calendarValue} onChange={settescildate}></Calendar>
                    </div>
                    <div className="field col-12 md:col-6">
                    <label htmlFor="name">Muayene Tarihi </label>
                    <Calendar showIcon showButtonBar dateFormat="dd/mm/yy" value={calendarValueMuayene} onChange={setmuayenedate}></Calendar>
                    <small id="username-help">
        Muayene Tarihini Boş Bırakabilirsiniz.
    </small>
                    </div>

                    <div className="field col-12 md:col-4"> 

</div>
<div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Güncelle" outlined onClick={() =>updatecar()} />
</div>
                   

    
                    </div>
                </div>
            </div> 

            <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Aracı Kayıt Edenler</h5>
                    <DataTable
                        value={users}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="Kullanıcı Bulunamadı."
                    >
                        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
                    <Column field="identityNumber" header="TC No"  ></Column>

                    <Column field="name" header="Adı"  ></Column>
                    <Column field="surname" header="Soyadı"  ></Column>
                    <Column field="birthDate" header="Doğum Tarihi"  ></Column>

                    </DataTable>
                    
                </div>
            </div>
            </div>

            
            
            </div>
           
    );
};

export default CarUpdate;



