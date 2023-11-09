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



const Brands = () => {
    const { user } = useAuthContext();
    const router = useRouter();


    const [filters1, setFilters1] = useState(null);
    const [loading2, setLoading2] = useState(false);
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 
    const [file, setFile] = useState([]);

    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    //Marka ekle 
    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Marka', code: 'brand' },
        { name: 'Tedarikçi', code: 'reseller' },
        { name: 'Reklam Veren', code: 'advertiser' }
    ];
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [leadingcheckbox, setleadingcheckbox] = useState(false);

    const [errorbrandsvisible, seterrorbrandsvisible] = useState(false);
    const [errorbrands, seterrorbrands] = useState(null);

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
    const getbrands = async () => {
       
     setLoading(true);
     var token = "";
     user.getIdToken().then(function(idToken) {  
        token =  idToken;
     }).then(()=>{
        const url = `${baseUrl}/brand`;

        BaseService.get(url,token).then((object) => {
        console.log(object);
         if(object.succes){
            setBrands(object.data);
             
    
            
             setLoading(false);
    
             }else{
                showalertbranderror(object);
                 setLoading(false);
    
    
             }
    
        
     }).catch((message) => {
        setLoading(false);

        showalertbranderror({
            "succes" : false,
            "error" : message.toString()
            
        });
        // console.log(error);
    
    
     }); 
    });
      
    
       }

       const showalertbranderror = (neweeror) => {
        seterrorbrands(neweeror);


        seterrorbrandsvisible(true);

       setTimeout(() => {
        seterrorbrands(null);
        seterrorbrandsvisible(false);

      } , 3000);
    };

  
      

    useEffect(() => {


       
        
        getbrands();
        

       

        initFilters1();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


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

            const url = `${baseUrl}/productbrand/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
            var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
                BaseService.get(url,token).then((data) => {
                if(data.succes){
                getbrands();

                }else{
                showalertbranderror(data);
               setLoading(false);


                }
               // setUploadedFile([data]);
              })
              .catch((message) => {
                setLoading(false);

                showalertbranderror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });


              }); 
            });
          
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
    const onleadingCheckboxChange = (e) => {
        setleadingcheckbox(e.checked);
    
    };

    // Marka Ekle 

    const onInputNameChange = (event) => {
        //console.log(event);
        setName(event);
    
   
  }

  const onInputPhoneChange = (event) => {
    //console.log(event);
    setPhone(event);


}
const onInputMailChange = (event) => {
setMail(event);


}

function uploadFile() {
    if(name == null || name == ""){
        showalertbranderror(
         {
                "succes" : false,
                "error" : "Lütfen İsim Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(mail == null || mail == ""){
        showalertbranderror(
           {
                "succes" : false,
                "error" : "Lütfen Mail Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if(phone == null || phone ==""){
        showalertbranderror(
            {
                "succes" : false,
                "error" : "Lütfen Telefon Bilgisini Giriniz",
                
            } 
        );
        return;
    }
    if((file.length === 0)){
        showalertbranderror(
            {
                "succes" : false,
                "error" : "Lütfen Resim Ekleyiniz",
                
            } 
        );
        return;
    }
    const formData = new FormData();
        
    
    formData.append("file", file[0].file);
    formData.append('dir', "brands");


    var token = "";
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
                BaseService.upload(formData,token).then((data) => {

                    if (data.succes) {
                        
                        if (data.data.path.length == 0) {
                            setLoading2(false);
    
                            showalertbranderror(
                                {
                                    "succes": false,
                                    "error": "Resim Yükleme Hatası",
    
                                }
                            );
                            return;
                        } else{
                            addbrand(data.data.path);
                        }
    
    
    
                    } else {
                        setLoading2(false);
    
                        showalertbranderror(data);
    
                    }
                    // setUploadedFile([data]);
                })
                .catch(({ message }) => {
                    setLoading2(false);
    
                    showalertbranderror({
                        "succes": false,
                        "error": message,
    
                    });
                }); 
            });

}

const addbrand = async (image) => {
   
   
    setLoading2(true);
    var body = {};

  
        body = JSON.stringify({
            "name" : name,
            "mail" : mail,
            "tel" : phone,
            "path" : image[0],
           
           
        } )

 

    
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
    const url = `${baseUrl}/brand`;
    BaseService.post(url,body,token).then((object) => {
        // console.log(object);
         if(object.succes){
            setName("");
                    setMail("");
                    setPhone("");
                    setFile([]);
                    getbrands();
                    setLoading2(false);
             
    
            
    
             }else{
                showalertbranderror(object);
                 setLoading(false);
    
    
             }
    
        
     }).catch((message) => {
        setLoading(false);

        showalertbranderror({
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

            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            
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

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const detayTemplate = (rowData) => {
       return <Button style={{margin: "5px"}} type="button" label="Detay" onClick={() => {
                    
            router.push(`/brands/${rowData.id}`);
                           }} />
    };

   
    const typeBodyTemplate = (rowData) => {
        switch(rowData.rule_type) {
            case "brand":
             return <label  >Marka</label> ;
            case  "reseller":
                return <label>Tedarikçi</label> ;
            
            case  "advertiser":
                return <label>Reklam Veren</label> ;
            
           
            default:
               
            return <label>Marka</label> ;
              // varsayılan kod bloğu
          }
        
        
    };
   

 

   

  

    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.is_checked, 'text-pink-500 pi-times-circle': !rowData.is_checked })}></i>;
    };

    const verifiedFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };

   




    const imageBodyTemplate = (rowData) => {
        return <img src={`${fileUrl}${rowData.path}`} onError={(e) => (e.target.src = `${errorImageUrl}`)} alt={rowData.path} className="shadow-2" width={100} />;
    };

   

   

  

   

   

    const header1 = renderHeader1();

    return (
        <div>

        <div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Sigorta Şirketi Ekle</h5>
                        </div>
                       

                      
                    </div>
                    <Dialog closable={false} visible={loading2} style={{ width: '200px', height: "200px" }}  >
                        <div style={{top: "75px", left: "75px" , width : "50px", height: "50px", position: "absolute"} }>
                    
                    <CircularProgress />
                    

                       </div>
                        </Dialog>
                    <Dialog  visible={errorbrandsvisible} onHide={() => seterrorbrandsvisible(false)} style={{ width: '350px' }} modal >
                        <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />

                                <label>{errorbrands == null ? "" :  errorbrands.error}</label>
                            </div>
                        </Dialog>
                   
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Marka Adı</label>
                            <InputText value={name} id="name" type="text" onChange={(e)=> onInputNameChange(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="mail">Mail</label>
                            <InputText value={mail} id="mail" type="text"onChange={(e)=> onInputMailChange(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="phone">Telefon</label>
                            <InputText value={phone} id="phone" type="text"onChange={(e)=> onInputPhoneChange(e.target.value)} />
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
<Button type="button"  label="Ekle" outlined onClick={() =>uploadFile()} />
</div>


   

    
                    </div>
                </div>
            </div> 

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Sigorta Şirketleri</h5>
                    <DataTable
                        value={brands}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="Marka Bulunamadı."
                        header={header1}
                    >
                        <Column field="name" header="İsim" filter filterPlaceholder="İsme Göre Ara" style={{ minWidth: '12rem' }} />
                        <Column field="tel" header="Telefon" filter filterPlaceholder="Telefona Göre Ara" style={{ minWidth: '12rem' }} />
                        <Column field="mail" header="Mail" filter filterPlaceholder="Maile Göre Ara" style={{ minWidth: '12rem' }} />
                        <Column header="Resim" body={imageBodyTemplate} />



                        <Column header="Oluşturulma Tarihi" filterField="createdAt" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}  />
                        
                        <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  />
                        <Column field="id" header="Detay"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={detayTemplate}  />

                    </DataTable>
                </div>
            </div>
            </div>


            
            
            </div>
           
    );
};

export default Brands;



