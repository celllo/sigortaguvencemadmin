import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { UsersService } from '@/service/UsersService';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

import { useAuthContext } from '@/context/AuthContext';


import { InputText } from 'primereact/inputtext';
import baseUrl  from '@/utils/baseUrl';
import { CircularProgress, Alert,Pagination } from '@mui/material';
import { useRouter } from 'next/router'
import { BaseService } from '@/service/BaseService';



const TableDemo = () => {
    const { user } = useAuthContext();
    const router = useRouter();

  
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
  
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
   

    const [users, setUsers] = useState([]);
    const [errorgetuser, seterrorgetbrands] = useState(null);
    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState(1);
    const [usertypedialog, setusertypedialog] = useState(false);
    const [selecteduserid, setselecteduserid] = useState(null);

    const dropdownItemsUserType = [
        { name: 'Aktif', code: 'active' },
        { name: 'Ban', code: 'ban' },
        { name: 'Kalıcı Ban', code: 'permanent_bant' },
        { name: 'İncelemede', code: 'waiting_review' }
      

    ];

    const [dropdownItemUserType, setDropdownItemUserType] = useState(null);

    const clearFilter1 = () => {
       setGlobalFilterValue1("");
       getusers();
       
    };

    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
       
        setGlobalFilterValue1(value);
        fetchUserData(page,value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="TC Kimlik Numarası" />
                </span>
            </div>
        );
    };
    const fetchUserData = async (page,name) => {
    
    setLoading1(true);
    var token = "";
    user.getIdToken().then(function(idToken) {  
       token =  idToken;
       console.log(token);
    }).then(()=>{
    UsersService.getusers((page-1),10,name,token).then((object) => {
        // console.log(object);
         if(object.succes){
            setTotalpage(object.totalPages);
             setUsers(object.data)
             setLoading1(false);

             }else{
                 showalererror(object);
                 setLoading1(false);

             }

        
     }).catch((message) => {
        setLoading1(false);

        showalererror({
            "succes" : false,
            "error" : message.toString()
            
        });


     }); 
    });


     
     
   
      }

      const getusers = async () => {
    
        setLoading1(true);
        var token = "";
        const url = `${baseUrl}/users`;

    user.getIdToken().then(function(idToken) {  
       token =  idToken;
       console.log(token);
    }).then(()=>{

        BaseService.get(url,token).then((object) => {
            console.log(object);
             if(object.succes){
                 setUsers(object.data)
                 setLoading1(false);
    
                 }else{
                     showalererror(object);
                     setLoading1(false);
    
    
                 }
    
            
         }).catch((message) => {
            setLoading1(false);
    
            showalererror({
                "succes" : false,
                "error" : message.toString()
                
            });
    
    
         });
         });
    
    
         
         
       
          }
      const changePage = (newPage) => {
        setPage(parseInt(newPage));
        fetchUserData(newPage,globalFilterValue1);
       }

       const showalererror = (neweeror) => {
        seterrorgetbrands(neweeror);



       setTimeout(() => {
        seterrorgetbrands(null);
        

      } , 3000);
    };
      

    useEffect(() => {


        getusers();
        
        //fetchUserData(page,globalFilterValue1);
        

       

        initFilters1();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

   
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

    const DialogFooter_UserType = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setusertypedialog(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updateusertype()} text autoFocus />
        </>
    );
    const updateusertypetemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{console.log(rowData.id); setselecteduserid(rowData.id); setusertypedialog(true)} } />
            
        </div>
        
        ;
    };

    const updateusertype = async () => {
        setusertypedialog(false);
        if(dropdownItemUserType == null){
            showalererror(
               {
                    "succes" : false,
                    "error" : "Lütfen Kullanıcı Durumu Seçiniz",
                    
                } 
            );
            return;
        }
        setLoading1(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/users`, {
            method: "PUT",
             body: JSON.stringify({
                "user_status" : dropdownItemUserType.code,
                "id" : selecteduserid,
                "from_admin" : true

                
            } ),    
        headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
                .then((res) => res.json())
                .then(data => {

                    if(data.succes){
                        setDropdownItemUserType(null);

    
                        fetchUserData(page,globalFilterValue1);
        
                        }else{
                        showalererror({
                            "succes" : false,
                            "error" : data.message
                            
                        });
                        setLoading1(false);

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoading1(false);
    
                    
                    showalererror({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
    
                }) ; });
      }


    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            surname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            countryCode: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            
            //verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <img alt="flag" src={`/demo/images/flag/flag_placeholder.png`} className={`flag flag-${rowData.countryCode}`} width={30} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.countryCode}</span>
            </React.Fragment>
        );
    };

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };

 


    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };
   

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const userTypeTemplate = (rowData) => {
            
        if(!rowData.user_status){
            return <label></label> ;

        }
        switch(rowData.user_status) {
            case "active":
             return <label>Aktif</label> ;
            case  "ban":
            return <label>Ban</label> ;
            case  "permanent_bant":
            return <label> Kalıcı Ban</label> ;
            case  "waiting_review":
            return <label>İncelemede</label> ;
          
            
            
            
           
            default:
               
            return <label>İncelemede</label> ;
              // varsayılan kod bloğu
          }
        
        
    };


    const genderType = (rowData) => {
            
        if(!rowData.gender){
            return <label></label> ;

        }
        switch(rowData.gender) {
            case "male":
             return <label>Erkek</label> ;
            case  "female":
            return <label>Kadın</label> ;
            case  "notsay":
            return <label>Belirtmek İstemiyorum</label> ;
            case  "notset":
            return <label>Kayıt Yok</label> ;
          
            
            
            
           
            default:
               
            return <label>Kayıt Yok</label> ;
              // varsayılan kod bloğu
          }
        
        
    };

   



    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.is_checked, 'text-pink-500 pi-times-circle': !rowData.is_checked })}></i>;
    };

     /// is checked 
     const switchTemplate = (rowData) => {
       

        return (
            
         <InputSwitch checked={rowData.is_checked} onChange={(e) =>{ 
           

            updateswitch(e.value,rowData.id);
        }} />
            
        );
    };

    const updateswitch= async (newvalue,newid) => {
        setLoading1(true);

            const url = `${baseUrl}/users/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
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
                fetchUserData(page,globalFilterValue1);

                }else{
                showalererror(data);
               setLoading1(false);


                }
               // setUploadedFile([data]);
              })
              .catch((message) => {
                setLoading1(false);

                showalererror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });


              }); });
          
    }


  





    const header1 = renderHeader1();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Kullanıcılar</h5>
                    {errorgetuser && <Alert severity="error">{errorgetuser.error}</Alert>}


                    <DataTable
                        value={users}
                        
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="Kullanıcı Bulunamadı."
                        header={header1}
                    >
                        
                        <Column field="identityNumber" header="T.C. No" style={{ minWidth: '12rem' }} />
                        <Column field="name" header="İsmi" style={{ minWidth: '12rem' }} />
                        <Column field="surname" header="Soyismi"  style={{ minWidth: '12rem' }} />
                        <Column field="email" header="Mail"  style={{ minWidth: '12rem' }} />  
                        <Column field="telephone" header="Telefon"  style={{ minWidth: '12rem' }} />
                        <Column field="id" header="Cinsiyet"  body={genderType} />
                        <Column header="Oluşturulma Tarihi" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}  />
                        <Column field="id" header="Durumu"  body={userTypeTemplate} />
                        <Column field="id" header="Durumu Güncelle"  body={updateusertypetemplate} />
                        
                        <Column field="is_checked" header="Onaylı" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate}  />

                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading1} count={totalpage} page={page}    onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>
                </div>
            </div>
            <Dialog header="Kullanıcı Durumunu Güncelle" visible={usertypedialog} onHide={() => setusertypedialog(false)} style={{ width: '350px' }} modal footer={DialogFooter_UserType}>
                        

                        <div className="grid formgrid">
    
                       <div className="col-12 mb-2  ">
                       <label >Kullanıcı Durumu </label>
                         <Dropdown id="situation" value={dropdownItemUserType} onChange={(e) => {
                             setDropdownItemUserType(e.value)}} options={dropdownItemsUserType} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                       </div>
                     
                       </div>

                     </Dialog>
            </div>
            

    );
};

export default TableDemo;



