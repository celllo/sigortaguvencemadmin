
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import { ProductService } from '@/service/ProductService';
import { CircularProgress, Alert } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

import { InputText } from 'primereact/inputtext';
import baseUrl  from '@/utils/baseUrl';
import { useAuthContext } from '@/context/AuthContext';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { BrandsService } from '@/service/BrandsService';
import { BaseService } from '@/service/BaseService';

import { ConfigsService } from '@/service/ConfigsService';





export default function BrandDetail() {
    const { user } = useAuthContext();

    const router = useRouter();
    const [brand, setBrand] = useState(null);
    const [brandadress, setBrandAdress] = useState([]);

    const [countries, setCountries] = useState();
    const [cities, setCities] = useState();
    const [districts, setDistricts] = useState();
    const [city, setCity] = useState();
    const [country, setCountry] = useState();
    const [district, setDistrict] = useState();



    const { id } = router.query;

    const [selectedadressid, setselectedadressid] = useState(null);
    const [selectedtaxid, setselectedtaxid] = useState(null);
    const [isupdate, setsetisupdate] = useState(false);
    const [countrysearchname, setcountrysearchname] = useState("");




    const [loading, setLoading] = useState(true);
    const [loadingdialog, setLoadindialog] = useState(false);

    const [errorgetbrand, seterrorgetbrand] = useState(null);
    const [erroraddadress, seterroraddadress] = useState(null);

    const [storagedialog, setstoragedialog] = useState(false);
    const [discountdialog, setdiscountdialog] = useState(false);

  
    const [taxno, settaxno] = useState("");
    const [taxname, settaxname] = useState("");
    const [taxvergidairesi, settaxvergidairesi] = useState("");

    const [mail, setmail] = useState("");
    const [tel, settel] = useState("");
    const [neighboor, setneighboor] = useState("");
    const [street, setstreet] = useState("");
    const [desc, setdesc] = useState("");

    const [apartment_no, setapartment_no] = useState("");
    const [building_no, setbuilding_no] = useState("");
    const [floor, setfloor] = useState("");






    const [dropdownItemBrand, setdropdownItemBrand] = useState(null);
    const [brandname, setBrandName] = useState("");
    const [brands, setBrands] = useState([]);
    const [loadingbrands, setLoadingBrands] = useState(false);




 



    

    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Yüzdelik', code: 'percent' },
        { name: 'Fiyatsal', code: 'direct' }];
        const [calendarValue, setCalendarValue] = useState(null);
    




    useEffect(() => {
        
       
        if(router.isReady){
            
          
            getbrand();
            getcountries("");

            
         }
      }, [router.isReady]);

      const getbrand = async () => {
       
        setLoading(true);
       
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            const url = `${baseUrl}/brand?id=${encodeURIComponent(id)}`;

            BaseService.get(url,token).then((object) => {
            if(object.succes){
                
              if(object.data == null){
                showalertgetbrandserror(
                    {
                        "succes" : false,
                        "error" : "Marka Bulunamadı",
                        
                    } 
                );
              }else{

                setBrand(object.data);
                setBrandAdress(object.data[0].models);
              

              }
                
       
               
                setLoading(false);
       
                }else{
                    showalertgetbrandserror(object);
                    setLoading(false);
       
       
                }
       
           
        }).catch((message) => {
            setLoading(false);

            showalertgetbrandserror({
            "succes" : false,
            "error" : message.toString()
            
        });
           // console.log(error);
       
       
        });
    });
         
       
          }


          const getcountries = async (searchname) => {
       
            setLoading(true);
           
            var token = "";
            const url = `${baseUrl}/country?name=${encodeURIComponent(searchname)}`;
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
            
            BaseService.get(url,token).then((object) => {
                if(object.succes){
                    
                  if(object.data == null){
                    showalertgetbrandserror(
                        {
                            "succes" : false,
                            "error" : "Ülke Bulunamadı",
                            
                        } 
                    );
                  }else{
                    //console.log(object.data);
    
                    setCountries(object.data);

                  }
                    
           
                   
                    setLoading(false);
           
                    }else{
                        showalertgetbrandserror(object);
                        setLoading(false);
           
           
                    }
           
               
            }).catch((message) => {
                setLoading(false);
    
                showalertgetbrandserror({
                "succes" : false,
                "error" : message.toString()
                
            });
               // console.log(error);
           
           
            });
         });
             
           
              }

              const getDistricts = async (cityid) => {
       
                setLoading(true);
               
                var token = "";
                const url = `${baseUrl}/districts?CityId=${encodeURIComponent(cityid)}`;

                user.getIdToken().then(function(idToken) {  
                   token =  idToken;
                }).then(()=>{

                    BaseService.get(url,token).then((object) => {
                    if(object.succes){
                        
                      if(object.data == null){
                        showalertgetbrandserror(
                            {
                                "succes" : false,
                                "error" : "İlçe Bulunamadı",
                                
                            } 
                        );
                      }else{
        
                        setDistricts(object.data);
                      
        
                      }
                        
               
                       
                        setLoading(false);
               
                        }else{
                            showalertgetbrandserror(object);
                            setLoading(false);
               
               
                        }
               
                   
                }).catch((message) => {
                    setLoading(false);
        
                    showalertgetbrandserror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });
                   // console.log(error);
               
               
                });
             });
                 
               
                  }
   
          const showalertgetbrandserror = (neweeror) => {
            seterrorgetbrand(neweeror);
   
   
   
          setTimeout(() => {
            seterrorgetbrand(null);
   
         } , 3000);
       };
       const showalertaddadresserror = (neweeror) => {
        seterroraddadress(neweeror);



      setTimeout(() => {
        seterroraddadress(null);

     } , 3000);
   };

       

// select country 
const selectcountry = (country) => {
    if(country == null){
        setCountry(null);
        setCities(null);
    }else{
        setCountry(country);
    setCities(country.Cities);

    }
    
    setCity(null);
    setDistrict(null);




};

const updatefilldatas = (model) => {
    //console.log(model.Country);
    setCountry(model.Country);
    setCity(model.City);
    getDistricts(model.City.id);
    setDistrict(model.District);
    settaxname(model.tax.name);
    settaxno(model.tax.taxno);
    settaxvergidairesi(model.tax.taxadministiration);
    settel(model.telno);
    setmail(model.tax.mail);
    setneighboor(model.neighbourhood);
    setstreet(model.street);
    setbuilding_no(model.building_no);
    setapartment_no(model.apartment_no);
    setfloor(model.floor);
    setdesc(model.description);
    setselectedadressid(model.id);
    setselectedtaxid(model.tax.id);
    setsetisupdate(true);






};
const cleandata = ()=>{
    settaxname("");
    settaxno("");
    settaxvergidairesi("");
    settel("");
    setmail("");
    setneighboor("");
    setstreet("");
    setbuilding_no("");
    setapartment_no("");
    setfloor("");
    setdesc("");
    setsetisupdate(false);
    setcountrysearchname("");
    setCity(null);
    setCountries(null);
    setDistrict(null);
    setCountry(null);
    getcountries("");


}

// select city 
const selectcity = (city) => {
    setCity(city);
    getDistricts(city.id);
    setDistrict(null);





};

     //setstorage
     const confirmationSetAdressFooter = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setstoragedialog(false)} text />
            <Button type="button" label="Ekle" icon="pi pi-check" onClick={() => addadress()} text autoFocus />
        </>
    );

    const createtax = async () => { 



if(taxno == null ||taxno == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Vergi Numarası Giriniz",
              
          } 
      );
      return;
  }
  if(taxname == null ||taxname == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Şirket Bilgisi Giriniz",
              
          } 
      );
      return;
  }
  if(taxvergidairesi == null ||taxvergidairesi == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Vergi Dairesi Giriniz",
              
          } 
      );
      return;
  }
  if(mail == null ||mail == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Mail Giriniz",
              
          } 
      );
      return;
  }
  if(tel == null ||tel == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Telefon Giriniz",
              
          } 
      );
      return;
  }

  if(neighboor == null ||neighboor == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Mahalle Giriniz",
              
          } 
      );
      return;
  }
  if(street == null ||street == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Sokak Giriniz",
              
          } 
      );
      return;
  }
  if(desc == null ||desc == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Adres Açıklaması Giriniz",
              
          } 
      );
      return;
  }
  if(apartment_no == null ||apartment_no == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Apartman No Giriniz",
              
          } 
      );
      return;
  }
  if(building_no == null ||building_no == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Bina No Giriniz",
              
          } 
      );
      return;
  }
  if(floor == null ||floor == "" ){
    showalertaddadresserror(
          {
              "succes" : false,
              "error" : "Lütfen Kat Bilgisi Giriniz",
              
          } 
      );
      return;
  }



        if(country == null){
            showalertaddadresserror(
                  {
                      "succes" : false,
                      "error" : "Lütfen Ülke Seçiniz",
                      
                  } 
              );
              return;
          }
          if(city == null){
            showalertaddadresserror(
                  {
                      "succes" : false,
                      "error" : "Lütfen Şehir Seçiniz",
                      
                  } 
              );
              return;
          }
          if(district == null){
            showalertaddadresserror(
                  {
                      "succes" : false,
                      "error" : "Lütfen İlçe Seçiniz",
                      
                  } 
              );
              return;
          }
      
       
       
        
        setLoadindialog(true);
        
            var token = "";
            const url =`${baseUrl}/tax`;
            var body = JSON.stringify({
                "taxno" :taxno,
                "name" : taxname,
                "taxadministiration" : taxvergidairesi,
                "mail" : mail,
                "tel" : tel
            } );
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            BaseService.post(url,body,token).then((data) => {
                        if(data.succes){
                           
        
                            addadress(data.data.id);
            
                            }else{
                            showalertaddadresserror(data);
                               
                              setLoadindialog(false);
        
            
                            }
                    
                    }) // Manipulate the data retrieved back, if we want to do something with it
                    .catch(message => { 
                        setLoadindialog(false);
        
                        
                        showalertaddadresserror({
                            "succes" : false,
                            "error" : message.toString()
                            
                        });
        
                    }) ; 
            });
          
      
     
    
        
         
      
          }


          const updatetax = async () => { 



            if(taxno == null ||taxno == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Vergi Numarası Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(taxname == null ||taxname == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Şirket Bilgisi Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(taxvergidairesi == null ||taxvergidairesi == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Vergi Dairesi Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(mail == null ||mail == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Mail Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(tel == null ||tel == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Telefon Giriniz",
                          
                      } 
                  );
                  return;
              }
            
              if(neighboor == null ||neighboor == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Mahalle Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(street == null ||street == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Sokak Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(desc == null ||desc == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Adres Açıklaması Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(apartment_no == null ||apartment_no == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Apartman No Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(building_no == null ||building_no == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Bina No Giriniz",
                          
                      } 
                  );
                  return;
              }
              if(floor == null ||floor == "" ){
                showalertaddadresserror(
                      {
                          "succes" : false,
                          "error" : "Lütfen Kat Bilgisi Giriniz",
                          
                      } 
                  );
                  return;
              }
            
            
            
                    if(country == null){
                        showalertaddadresserror(
                              {
                                  "succes" : false,
                                  "error" : "Lütfen Ülke Seçiniz",
                                  
                              } 
                          );
                          return;
                      }
                      if(city == null){
                        showalertaddadresserror(
                              {
                                  "succes" : false,
                                  "error" : "Lütfen Şehir Seçiniz",
                                  
                              } 
                          );
                          return;
                      }
                    
                  
                   
                   
                    
                    setLoadindialog(true);
                    
                        var token = "";
                        var body =  JSON.stringify({
                            "id" : selectedtaxid,
                            "taxno" :taxno,
                            "name" : taxname,
                            "taxadministiration" : taxvergidairesi,
                            "mail" : mail,
                            "tel" : tel
                        } );
                        const url =`${baseUrl}/tax`;
                        user.getIdToken().then(function(idToken) {  
                       token =  idToken;
                    }).then(()=>{
                        BaseService.put(url,body,token).then((data) => {
                                    if(data.succes){
                                       
                    
                                        updateadress();
                        
                                        }else{
                                        showalertaddadresserror(data);
                                           
                                          setLoadindialog(false);
                    
                        
                                        }
                                
                                }) // Manipulate the data retrieved back, if we want to do something with it
                                .catch(message => { 
                                    setLoadindialog(false);
                    
                                    
                                    showalertaddadresserror({
                                        "succes" : false,
                                        "error" : message.toString()
                                        
                                    });
                    
                                }) ;
                             });
                      
                  
                 
                
                    
                     
                  
                      }
    
       const addadress = async (taxid) => {
        setLoadindialog(false);


      
       
       
        
        
            var token = "";
            var body = JSON.stringify({
                "neighbourhood" : neighboor,
"street" : street, 
"building_no" : building_no,
"apartment_no" : apartment_no,
"CountryId" : country.id,
"CityId": city.id,
"DistrictId" : district == null ? null :  district.id,
"description" : desc,
"taxId" : taxid,
"telno" : tel,
"floor" : floor,
"BrandId" : id
            } ); 
        const url = `${baseUrl}/addresses`;
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            BaseService.post(url,body,token).then((data) => {
                        if(data.succes){
                            setLoadindialog(false);                
                            settaxname("");
                            settaxno("");
                            settaxvergidairesi("");
                            settel("");
                            setmail("");
                            setneighboor("");
                            setstreet("");
                            setbuilding_no("");
                            setapartment_no("");
                            setfloor("");
                            setdesc("");
                            setCity(null);
                            setCountry(null);
                            setDistrict(null);



                            
        
                            getbrand();
            
                            }else{
                                showalertaddadresserror(data);
                               
                              setLoadindialog(false);
        
            
                            }
                    
                    }) // Manipulate the data retrieved back, if we want to do something with it
                    .catch(message => { 
                        setLoadindialog(false);
        
                        
                        showalertaddadresserror({
                            "succes" : false,
                            "error" : message.toString()
                            
                        });
        
                    }) ;
                 });
          
      
     
    
        
         
      
          }

          const updateadress = async () => {
            setLoadindialog(false);
    
    
          
           
           
            
            
                var token = "";
                var body = JSON.stringify({
                    id: selectedadressid,
                    "neighbourhood" : neighboor,
    "street" : street, 
    "building_no" : building_no,
    "apartment_no" : apartment_no,
    "CountryId" : country.id,
    "CityId": city.id,
    "DistrictId" : district == null ? null :  district.id,
    "description" : desc,
    "taxId" : selectedtaxid,
    "telno" : tel,
    "floor" : floor,
    "BrandId" : id
                } ); 
                var url = `${baseUrl}/addresses`;
            user.getIdToken().then(function(idToken) {  
               token =  idToken;
            }).then(()=>{
                BaseService.put(url,body,token).then((data) => {
                            if(data.succes){
                                setLoadindialog(false);                
                                settaxname("");
                                settaxno("");
                                settaxvergidairesi("");
                                settel("");
                                setmail("");
                                setneighboor("");
                                setstreet("");
                                setbuilding_no("");
                                setapartment_no("");
                                setfloor("");
                                setdesc("");
    
    
    
                                
            
                                getbrand();
                
                                }else{
                                    showalertaddadresserror(data);
                                   
                                  setLoadindialog(false);
            
                
                                }
                        
                        }) // Manipulate the data retrieved back, if we want to do something with it
                        .catch(message => { 
                            setLoadindialog(false);
            
                            
                            showalertaddadresserror({
                                "succes" : false,
                                "error" : message.toString()
                                
                            });
            
                        }) ; 
                    });
              
          
         
        
            
             
          
              }


       
    
const updatedescription = async () => {
    setupdatedescriptiondialog(false);


setLoadindialog(true);
// console.log(product.ProductDescription.id);
// console.log(description);
// setLoadindialog(false);
// return;

var token = "";
var body = JSON.stringify({
    "id" : product.ProductDescription.id,
    "name" : description
} ); 
const url = `${baseUrl}/productdescription`;
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
            BaseService.put(url,body,token).then((data) => {
            if(data.succes){
               

            setLoadindialog(false);
            setdescription("");

            getproducts();

            }else{
           showalertupdatedescritionerror(data);
            setLoadindialog(false);


            }
        
        }) // Manipulate the data retrieved back, if we want to do something with it
        .catch(message =>  {
            showalertupdatedescritionerror({
                "succes" : false,
                "error" : message.toString()
                
            });
            setLoadindialog(false);
        } ) ; 
    });
 

  }




const taxnameBodyTemplate = (rowData) => {

                                        
      
        return <label  key={rowData.tax.name}> {rowData.tax.name}</label>;
    
    
    
};
const taxnoBodyTemplate = (rowData) => {

                                        
      
    return <label  key={rowData.tax.taxno}> {rowData.tax.taxno}</label>;



};
const taxmailBodyTemplate = (rowData) => {

                                        
      
    return <label  key={rowData.tax.mail}> {rowData.tax.mail}</label>;



};
const taxvergiBodyTemplate = (rowData) => {

                                        
      
    return <label  key={rowData.tax.taxadministiration}> {rowData.tax.taxadministiration}</label>;



};

const updateTemplate = (rowData) => {
    return <Button style={{margin: "5px"}} type="button" label="Güncelle" onClick={() => {
                 
         updatefilldatas(rowData);
                        }} />
 };

const dateBodyTemplate = (rowData) => {
    return formatingDateTime(rowData.createdAt);
};

const dateBodyEndTemplate = (rowData) => {
    return formatingDateTime(rowData.endAt);
};
function formatingDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
}

function formatingDateTime(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric' , hour: "numeric" , minute: "numeric"  };
    return new Date(string).toLocaleDateString([],options) + "";
}
const formatDate = (value) => {
 
   
    
var xx =  formatingDate(value);
    
    return xx;
};


const verifiedBodyTemplate = (rowData) => {
    return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.is_live, 'text-pink-500 pi-times-circle': !rowData.is_live })}></i>;
};


const renderHeader1 = () => {
    return (
        <div className="flex justify-content-between">
             <span>
                 {brand && brand[0].name} Mağazası Şirket Bilgileri
                </span>
             <Button style={{margin: "5px"}}  type="button"  label="Stok Ekle"  onClick={() => {
                    
                    cleandata();
                }}  />
               
           
        </div>
    );
};
const header1 = renderHeader1();







   
  return (
    <>
    
  


       
            
                       

                        <Dialog closable={false} visible={loadingdialog} style={{ width: '200px', height: "200px" }}  >
                        <div style={{top: "75px", left: "75px" , width : "50px", height: "50px", position: "absolute"} }>
                    
                    <CircularProgress />
                    

                       </div>
                        </Dialog>


                    


            <div className="grid">

            <div className="col-12">
<div className="card">
                  
                    <DataTable
                        value={brandadress}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="Marka Adres Bilgisi Bulunamadı."
                        header={header1}
                    >
                        <Column field="neighbourhood" header="Mahalle"  style={{ minWidth: '12rem' }} />
                        <Column field="street" header="Sokak"  style={{ minWidth: '12rem' }} />
                        <Column field="description" header="Adres Açıklama"  style={{ minWidth: '12rem' }}/>
                        <Column field="building_no" header="Bina No"  style={{ minWidth: '12rem' }} />
                        <Column field="apartment_no" header="Apartman No"  style={{ minWidth: '12rem' }} />
                        <Column field="floor" header="Kat"  style={{ minWidth: '12rem' }} />

                        <Column header="Oluşturulma Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
                        <Column header="Şirket Adı"   style={{ minWidth: '10rem' }} body={taxnameBodyTemplate} />
                        <Column header="Şirket Vergi No"  style={{ minWidth: '10rem' }} body={taxnoBodyTemplate} />
                        <Column header="Vergi Dairesi"   style={{ minWidth: '10rem' }} body={taxvergiBodyTemplate} />
                        <Column header="Şirket Maili"   style={{ minWidth: '10rem' }} body={taxmailBodyTemplate} />
                        <Column header="Bilgileri Güncelleme"   style={{ minWidth: '10rem' }} body={updateTemplate} />

                        

                        
                    </DataTable>





    </div>
</div>
</div>


<div className="col-12">
                <div className="card">
                <div className="grid formgrid">
                        <div className="field col-12 md:col-8">
                            <h5>Adres Ekleme</h5>
                        </div>
                        <div className="field col-12 md:col-4">
                        <Button style={{margin: "5px"}}  type="button"  label="Bilgileri Temizle"  onClick={() => {
                    
                    cleandata();
                }}  />                        </div>
         
           
               
           
                       
                      
                    </div>
                    <div className="field col-12 md:col-6">
                    {errorgetbrand && <Alert severity="error">{errorgetbrand.error}</Alert>}

                        </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label >Vergi No:</label>
                            <InputNumber  value={taxno} onValueChange={(e) => settaxno(e.value)}  mode="decimal"></InputNumber>

                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Şirket Ünvanı</label>
                            <InputText id="taxname"  value={taxname} type="text" onChange={(e)=> settaxname(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Vergi Dairesi </label>
                            <InputText id="taxvergidairesi"  value={taxvergidairesi} type="text" onChange={(e)=> settaxvergidairesi(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Mail</label>
                            <InputText id="mail"  value={mail} type="text" onChange={(e)=> setmail(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Telefon</label>
                            <InputText id="tel"  value={tel} type="text" onChange={(e)=> settel(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label >Ülke Arayınız</label>
                            <InputText id="tel"  value={countrysearchname} type="text" onChange={(e)=>{ 
                                selectcountry(null);
                                setCountries(null);
                                setcountrysearchname(e.target.value)
                               
                                if(e.target.value.length > 4){
                                    getcountries(e.target.value);

                                }
                               

                               
                            } }/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label >Seçilen Ülke:  {country && country.name}</label>

                            <Dropdown id="country" value={country} onChange={(e) => {selectcountry(e.value) }} options={countries} optionLabel="name" placeholder="Yeni Ülke Seçimi"></Dropdown>

                        </div>
                        <div className="field col-12 md:col-6">
                            <label >Seçilen Şehir:  {city && city.name}</label>

                            <Dropdown id="city" value={city} onChange={(e) => {selectcity(e.value) }} options={cities} optionLabel="name" placeholder="Yeni Şehir Seçimi"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label >Seçilen İlçe:  {district && district.name}</label>

                            <Dropdown id="city" value={district} onChange={(e) => {setDistrict(e.value) }} options={districts} optionLabel="name" placeholder="Yeni İlçe Seçimi"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Mahalle</label>
                            <InputText id="neighboor"  value={neighboor} type="text" onChange={(e)=> setneighboor(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Sokak</label>
                            <InputText id="street"  value={street} type="text" onChange={(e)=> setstreet(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Açıklama</label>
                            <InputText id="desc"  value={desc} type="text" onChange={(e)=> setdesc(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Apartman No</label>
                            <InputText id="apartment_no"  value={apartment_no} type="text" onChange={(e)=> setapartment_no(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Bina No</label>
                            <InputText id="building_no"  value={building_no} type="text" onChange={(e)=> setbuilding_no(e.target.value)}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label >Kat</label>
                            <InputText id="floor"  value={floor} type="text" onChange={(e)=> setfloor(e.target.value)}/>
                        </div>


                     


                      
                     

                        <div className="field col-12 md:col-12"> 


</div>


                      
                      
                       
                       
                       

                        
                        <div className="field col-12 md:col-4"> 

</div>
                        
<div className="field col-12 md:col-4"> 
{
    isupdate ? <Button type="button"  label="Şirket Bilgisi Güncelle" outlined onClick={() =>updatetax()} />
: <Button type="button"  label="Şirket Bilgisi Ekle" outlined onClick={() =>createtax()} />

}
</div>


   

    
                    </div>
                </div>
            </div> 

    
    </>
  )
}
