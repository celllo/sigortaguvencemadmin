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



const Request = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const { id } = router.query;


    const [filters1, setFilters1] = useState(null);
    const [loading2, setLoading2] = useState(false);
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [request, setRequest] = useState();
    const [service, setService] = useState();
    const [serviceuser, setServiceuser] = useState();
    const [creteduser, setCreateduser] = useState();



    const [answers, setAnswers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [proposals, setProposals] = useState([]);


    const [textfieldtype, settextfieldtype] = useState([]);


    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(null);

    const [addoptiondialog, setaddoptiondialog] = useState(false);

    const [addselectedquestion, setaddselectedquestion] = useState(null);
    const [deleteconfirm, setdeleteconfirm] = useState(false);
    const [deleteidoption, setdeleteidoption] = useState(null);

    const dropdownItemsproposalTypes = [
        { name: 'Teklif Sürecinde', code: 'proposed' },
        { name: 'Reddedildi', code: 'denied' },
        { name: 'Kabul Edildi', code: 'accepted' },
        { name: 'Admin Tarafından Silindi', code: 'deletedbyadmin' }


      

    ];

    const [dropdownItemProposalType, setDropdownItemProposalType] = useState(null);

   

    const [proposaltypedialog, setproposaltypedialog] = useState(false);
    const [selectedproposalid, setselectedproposalid] = useState(null);

    const [dropdownItemBrand, setdropdownItemBrand] = useState(null);
    const [price, setPrice] = useState("");
    const [point, setPoint] = useState("");

    const [adminnote, setAdminNote] = useState("");
 


    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);





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
    const getrequest = async () => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/request/${encodeURIComponent(id)}`;

        BaseService.get(url,token).then((object) => {
       //console.log(object.data);
         if(object.succes){
            setRequest(object.data);
            setService(object.data.service);
            setServiceuser(object.data.userCreatedFor);
            setCreateduser(object.data.createdUser);

            setProposals(object.data.proposals);
            setAnswers(object.data.requestanswer.answers);


             
    
            
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
       const getbrands = async () => {
       
        setLoading(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/brand`;
   
           BaseService.get(url,token).then((object) => {
            if(object.succes){
               setBrands(object.data);
                
       
               
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
        
       
        if(router.isReady){
            
          
            getrequest();
            getbrands();
    
           
    
            initFilters1();

            
         }
      }, [router.isReady]);
      


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


  
   






const addproposal= async () => {
    if(price == null || price == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Fiyat Giriniz",
                
            } 
        );
        return;
    }

    if(point == null || point == ""){
        showalert(
         {
                "succes" : false,
                "error" : "Lütfen Kazanılacak Puan Bilgisini Giriniz",
                
            } 
        );
        return;
    }
 
   
    if(dropdownItemBrand == null){
        showalert(
            {
                "succes" : false,
                "error" : "Lütfen Şirket Seçiniz",
                
            } 
        );
        return;
    }
  

   
   
    setLoading2(true);
    var body = {};

        body = JSON.stringify({
            "requestId": id,
            "point" : point,
            "price": price,
            "brandId": dropdownItemBrand.id, 
            "proposedtoId": request.createdUser.id,
            "serviceId": request.serviceId,
            
            
                   
                   
                } )



   

  
       

 

    
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
    const url = `${baseUrl}/proposal`;
    BaseService.post(url,body,token).then((object) => {
         if(object.succes){
                   
                   
                    setPrice("");
                    setPoint("");

                    getrequest();
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

    const dateEndBodyTemplate = (rowData) => {
        return formatDate(rowData.endDate);
    };

    const brandTypeTemplate = (rowData) => {
        let brandname = "";
        for (let i = 0; i < brands.length; i++) {
            if(brands[i].id == rowData.brandId ){
                brandname = brands[i].name;
                break;
            }
             
              
        }
        return  <span >{brandname}</span>;
    };
    const deleteTemplate = (rowData) => {
        return   <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
        ;
    };

 
    const DialogFooterProposalType = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setproposaltypedialog(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updateproposaltype()} text autoFocus />
        </>
    );
    const updateproposaltypetemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{setselectedproposalid(rowData.id); setproposaltypedialog(true)} } />
            
        </div>
        
        ;
    };
    const updateproposaltype = async () => {
        setproposaltypedialog(false);
        if(dropdownItemProposalType == null){
            showalert(
               {
                    "succes" : false,
                    "error" : "Lütfen Teklif Durumu Seçiniz",
                    
                } 
            );
            return;
        }
       
        setLoading(true);
        var token = "";
        var body = {};
        body = JSON.stringify({
            "status" : dropdownItemProposalType.code,
            "id" : selectedproposalid,
            "from_admin" : true

            
        } );
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/proposal`;
            BaseService.put(url,body,token).then((data) => {

                    if(data.succes){
                        setDropdownItemProposalType(null);

    
                        getrequest();
        
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

      const updaterequesttype = async () => {
       
       
        setLoading2(true);
        var token = "";
        var body = {};
        body = JSON.stringify({
            "status" : "accepted",
            "id" : id,
            "from_admin" : true

            
        } );
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/request`;
            BaseService.put(url,body,token).then((data) => {
                    if(data.succes){
                        sendNotif();
    
                        }else{
                            showalert({
                            "succes" : false,
                            "error" : data.message
                            
                        });
                        setLoading2(false);

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoading2(false);
    
                    
                    showalert({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
    
                }) ; 
            
            });
      }

      const sendNotif = async () => {
       
        var body = {};
        if(adminnote == null || adminnote == ""){
            body = JSON.stringify({
                "body" : "Teklif Detaylarınıza Geçmiş Sigorta Sorgularım bölümünden ulaşabilirsiniz.",
    "title": "Teklifiniz Oluşturuldu",
    "topic" : creteduser.identityNumber
            } );
        }else{

            body = JSON.stringify({
                "body" : adminnote,
    "title": "Teklifiniz Oluşturuldu",
    "topic" : creteduser.identityNumber
            } );

        }
        //console.log(body);

       
           
        
        
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
                                               setLoading2(false);

                        setAdminNote("");

        
                        }else{
                            setLoading2(false);

                            showalert({
                                "succes" : false,
                                "error" : "Bildirim Gönderilemedi",
                                
                            } );

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoading2(false);

                    showalert({
                        "succes" : false,
                        "error" : "Bildirim Gönderilemedi",
                        
                    } );
    
                }) ; });
      }
   
   
   

 

   

  


   




    const imageBodyTemplate = (rowData) => {
        return <img src={`${fileUrl}${rowData.path}`} onError={(e) => (e.target.src = `${errorImageUrl}`)} alt={rowData.path} className="shadow-2" width={100} />;
    };

    const expandbpdy = (rowData) => {
      
        
        
    };
    const questionnameBodyTemplate = (rowData) => {
        if(rowData.servicequestion == null){
            return <label  ></label> ;
        }
        if(rowData.servicequestion.question == null){
            return <label  ></label> ;


        }else{
            return <label  >{rowData.servicequestion.question}</label> ;

        }
      
        
        
    };

    const questionTypeBodyTemplate = (rowData) => {
        if(rowData.servicequestion == null){
            return <label  ></label> ;
        }
        switch(rowData.servicequestion.questionType) {
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
    const proposalTypeBodyTemplate = (rowData) => {
        switch(rowData.status) {
        
            
        case  "proposed":
        return <label>Teklif Sürecinde</label> ;
        case "denied":
        return <label  >Reddedildi</label> ;
        case "accepted":
        return <label  >Kabul Edildi</label> ;
        case "deletedbyadmin":
        return <label  >Admin Tarafından Silindi</label> ;
        default:
        return <label>Teklif Sürecinde</label> ;
          }
        
    };

    const optionalBodyTemplate = (rowData) => {
        if(rowData.servicequestion == null){
            return <label  ></label> ;
        }
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': !rowData.servicequestion.optional, 'text-pink-500 pi-times-circle': rowData.servicequestion.optional })}></i>;
    };



   

   
    const rowExpansionTemplate = (rowData) => {
        
        return (
            <div className="orders-subtable">
                 <div className="grid formgrid">
                 {rowData.servicequestion.questionType == "text" ?
                <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <h5></h5>
            </div> : <>
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Seçilen Seçenekler</h5>
                        </div>
                       
                       
            </>
                }
                        
                      
                    </div>
                    
                    {rowData.servicequestion.questionType == "text" ?
                <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <></>
            </div> :
                <DataTable value={rowData.options} responsiveLayout="scroll">
                    <Column field="name" header="Ad" ></Column>
                    <Column field="information" header="Açıklama" ></Column>
                   
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
{serviceuser &&  <h5>Teklif Sahibi</h5>   }

{serviceuser &&  <span> {serviceuser.name && serviceuser.name}</span> }
{serviceuser &&  <span>  {serviceuser.surname && serviceuser.surname}</span> }

{serviceuser &&  <span> TC: {serviceuser.identityNumber && serviceuser.identityNumber}</span> }
{serviceuser &&  <span> Telefon: {serviceuser.telephone && serviceuser.telephone}</span> }

{creteduser && <h5>Teklif Oluşturan</h5>   }
{creteduser &&  <span> {creteduser.name && creteduser.name}</span> }
{creteduser &&  <span>  {creteduser.surname && creteduser.surname}</span> }

{creteduser &&  <span> TC: {creteduser.identityNumber && creteduser.identityNumber} </span> }

{creteduser &&  <span> Telefon: {creteduser.telephone && creteduser.telephone}</span> }

{service &&  <h5>{service.name && service.name} Teklif İsteği</h5> }





</div>
</div>
</div>

      

        <div className="grid">
        <div className="col-12">
                <div className="card">
<div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                            <h5>Verilen Cevaplar</h5>
                        </div>
                
                    </div>
                    <h1></h1>


                    <DataTable value={answers} var="x" loading={loading} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll" rowExpansionTemplate={rowExpansionTemplate} dataKey="id" >
                   
                        
                        <Column expander style={{ width: '3em' }}  />
                        <Column field="id" header="        Soru       "  body={questionnameBodyTemplate}/>
                        <Column field="answer" header="Soru Cevabı" />
                        <Column field="id" header="Soru Tipi"  body={questionTypeBodyTemplate} />

                        <Column field="id" header="Cevaplamak Zorunlu Mu?"  body={optionalBodyTemplate} />

                        

                        <Column header="Oluşturulma Tarihi" field="createdAt" dataType="date"  body={dateBodyTemplate}  />



                    </DataTable>
                </div>
            </div>
            </div>

            <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Teklif Ekle</h5>
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
                    <label htmlFor="name">Teklif Fiyatı</label>
                    <InputNumber value={price} onValueChange={(e) => setPrice(e.value)} mode="decimal" minFractionDigits={2}></InputNumber>
                    </div>
                    <div className="field col-12 md:col-6">
                            <label >Teklif Verilen Sigorta Şirketi </label>
                            <Dropdown id="type" value={dropdownItemBrand} onChange={(e) => setdropdownItemBrand(e.value)} options={brands} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                        </div> 
                    
                        <div className="field col-12 md:col-6">
                    <label htmlFor="name">Kazanılacak Puan</label>
                    <InputNumber value={point} onValueChange={(e) => setPoint(e.value)} mode="decimal" minFractionDigits={2}></InputNumber>
                    </div>
                    <div className="field col-12 md:col-4"> 

</div>
<div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Ekle" outlined onClick={() =>addproposal()} />
</div>
                   


                    <div className="col-12 mb-2 lg:col-12 lg:mb-0">
                            <h5>Teklif Oluşturuldu Bildirimi Gönder</h5>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="adminnote">Bildirim Notu</label>
                            <InputText value={adminnote} id="adminnote" type="text"onChange={(e)=> setAdminNote(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-12">
                            <span>Bildirim notu eklendiği zaman kullanıcıya bildirim olarak not alanındaki içerik gönderilir. Boş bırakıldığında ise otomatik teklif oluşturuldu bildirimi gönderilir.</span>
                        </div>
                      
                         
                       
                       
                       
                        
                        <div className="field col-12"> 

</div>
                      
                       
                     
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
<Button type="button"  label="Gönder" outlined onClick={() =>updaterequesttype()} />
</div>


   

    
                    </div>
                </div>
            </div> 

            <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Teklifler</h5>
                    <DataTable
                        value={proposals}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="Teklif Bulunamadı."
                    >
                        <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
                        <Column field="brandId" header="Sigorta Şirketi" style={{ minWidth: '12rem' }} body={brandTypeTemplate} />

                        <Column field="price" header="Fiyat" style={{ minWidth: '12rem' }} />
                        <Column field="point" header="Kazanılacak Puan" style={{ minWidth: '12rem' }} />
                        <Column field="id" header="Teklif Durumu" style={{ minWidth: '12rem' }} body={proposalTypeBodyTemplate} />
                        <Column field="id" header="Durumu Güncelle" style={{ minWidth: '12rem' }} body={updateproposaltypetemplate} />

                        
                        {/* <Column field="note" header="Bildirim Notu" style={{ minWidth: '12rem' }} /> */}

                        <Column header="Teklif Son Tarihi" filterField="createdAt" dataType="date" style={{ minWidth: '10rem' }} body={dateEndBodyTemplate}  />
                        <Column header="Oluşturulma Tarihi" filterField="createdAt" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}  />

                        <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  />

                    </DataTable>
                    <Dialog header="Teklif Durumunu Güncelle" visible={proposaltypedialog} onHide={() => setproposaltypedialog(false)} style={{ width: '350px' }} modal footer={DialogFooterProposalType}>
                        

                        <div className="grid formgrid">
    
                       <div className="col-12 mb-2  ">
                       <label >Teklif Durumu </label>
                         <Dropdown id="situation" value={dropdownItemProposalType} onChange={(e) => {
                             setDropdownItemProposalType(e.value)}} options={dropdownItemsproposalTypes} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                       </div>
                     
                       </div>

                     </Dialog>
                </div>
            </div>
            </div>

            
            
            </div>
           
    );
};

export default Request;



