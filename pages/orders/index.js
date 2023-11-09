import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';


import { Dropdown } from 'primereact/dropdown';


import { CircularProgress, Alert, Pagination } from '@mui/material';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';


import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';
import { OrdersService } from '@/service/OrdersService';
import { useRouter } from 'next/router'

import { useAuthContext } from '@/context/AuthContext';









const Orders = () => {
    const router = useRouter();
    const { user } = useAuthContext();


    const [loading2, setLoading2] = useState(false);
    const [loading, setLoading] = useState(true);
  
    const [expandedRows, setExpandedRows] = useState(null);
    const [deletedisplayConfirmation, setdeleteDisplayConfirmation] = useState(false);
    const [deleteid, setdeleteid] = useState(null);
    const [errorfile, setErrorfile] = useState(null);
    const [errorvisible, seterrorvisible] = useState(false);

    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState(1);

    const dropdownItemsOrderSituation = [
        { name: 'İncelemede', code: 'inreview' },
        { name: 'Onaylandı', code: 'approved' },
        { name: 'Reddedildi', code: 'rejected' },
        { name: 'Hazırlanıyor', code: 'preparing' },
        { name: 'Kargoda', code: 'onway' },
        { name: 'Ulaştırıldı', code: 'reached' },
        { name: 'Kullanıcı Reddetti', code: 'userreject' },
        { name: 'Kullanıcı Onayladı', code: 'userapproved' }

    ];

    const [dropdownItemOrder, setDropdownItemOrder] = useState(null);
    const [orderid, setorderid] = useState(null);
    const [orderdialog, setorderdialog] = useState(false);



    





  
   
    ///Bonus Actions
    //delete
    const deleteTemplate = (rowData) => {
        return   <div>
            <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={() => setDeleteid(rowData.id)} />
                        <Dialog header="Silme İşlemi Onayı" visible={deletedisplayConfirmation} onHide={() => setdeleteDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                <span>Çözümü Eklemek İstediğinize Emin Misiniz?</span>
                            </div>
                        </Dialog>
        </div>
        
        ;
    };
    const confirmationDialogFooter = (
        <>
            <Button type="button" label="Hayır" icon="pi pi-times" onClick={() => setdeleteDisplayConfirmation(false)} text />
            <Button type="button" label="Evet" icon="pi pi-check" onClick={() => deletebonuses()} text autoFocus />
        </>
    );
    const setDeleteid = (event) => {
        setdeleteDisplayConfirmation(true);
        setdeleteid(event);
    
    
    } 
    const deletebonuses = async () => {
        setdeleteDisplayConfirmation(false);
        setLoading(true);


      
        
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/users/bonuses?id=${encodeURIComponent(deleteid)}`, {
            method: "DELETE",    
        headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
                .then((res) => res.json())
                .then(data => {
                    console.log(data);
                    if(data.succes){
                    getbonuses();
    
                    }else{
                   showalerterror(data);
                   setLoading(false);
    
    
                    }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message =>  {
                    
                    showalerterror({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
                   setLoading(false);
                } ) ; });
         
      
          }



    
       
         



          
          



      

  
  
        
        const stateTemplate = (rowData) => {
            
            if(!rowData.status){
                return <label></label> ;

            }
            switch(rowData.status) {
                case "inreview":
                 return <label>İncelemede</label> ;
                case  "approved":
                return <label>Onaylandı</label> ;
                case  "rejected":
                return <label> Reddedildi</label> ;
                case  "preparing":
                return <label>Hazırlanıyor</label> ;
                case  "onway":
                return <label>Kargoda</label> ;
                case  "reached":
                return <label>Ulaştırıldı</label> ;
                case  "userreject":
                return <label>Kullanıcı Reddetti</label> ;
                case  "userapproved":
                return <label>Kullanıcı Onayladı</label> ;
                
                
                
               
                default:
                   
                return <label>İncelemede</label> ;
                  // varsayılan kod bloğu
              }
            
            
        };
        const distTemplate = (rowData) => {
            
            if(rowData == null){
                return <label></label> ;

            }
            if(rowData.District == null){
                return <label></label> ;

            }
            if(rowData.District.name == null){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.District.name}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };
        const cityTemplate = (rowData) => {
            if(rowData == null){
                return <label></label> ;

            }
            if(rowData.City == null){
                return <label></label> ;

            }
            if(rowData.City.name == null){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.City.name}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };
        const countryTemplate = (rowData) => {
            if(rowData == null){
                return <label></label> ;

            }
            if(rowData.Country == null){
                return <label></label> ;

            }
            if(rowData.Country.name == null){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.Country.name}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };


        const nameTemplate = (rowData) => {
            
            if(rowData.User == null){
                return <label></label> ;

            }
            if(rowData.User.name == null){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.User.name}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };
        const surnameTemplate = (rowData) => {
            
            if(rowData.User == null){
                return <label></label> ;

            }
            if(rowData.User.surname == null){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.User.surname}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };
        const emailTemplate = (rowData) => {
            
            if(rowData.User == null){
                return <label></label> ;

            }
            if(rowData.User.email == null){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.User.email}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };
        const phoneTemplate = (rowData) => {
            
            if(rowData.User == null){
                return <label></label> ;

            }
            if(rowData.User.phone == null){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.User.phone}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };

        const producttypeTemplate = (rowData) => {
            
            switch(rowData.type) {
                case "virtual":
                 return <label  >Sanal</label> ;
                
                case  "real":
                    return <label>Gerçek</label> ;
                case "draw":
                    return <label>Çekiliş</label> ;
                case "collab":
                    return <label>İş Birliği</label> ;
                case "donation":
                    return <label>Bağış</label> ;
                default:
                        return <label>Gerçek</label> ;
              }
              
            
            
        };
        const brandTemplate = (rowData) => {
            
            if(!rowData.Brand.name){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.Brand.name}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };
        const qtyTemplate = (rowData) => {
            
            if(!rowData.OrderProducts.qty){
                return <label></label> ;

            }
           
                   
                return <label>{rowData.OrderProducts.qty}</label> ;
                  // varsayılan kod bloğu
              
            
            
        };

      

        
       
       
      
    const verifiedVirtualBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.is_only_virtual, 'text-pink-500 pi-times-circle': !rowData.is_only_virtual })}></i>;
    };

    const verifiedDoneBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.is_done, 'text-pink-500 pi-times-circle': !rowData.is_done })}></i>;
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
        setLoading(true);

            const url = `${baseUrl}/orders?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;
            
    
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
                console.log(data);
                if(data.succes){
                    getorders(page);

                }else{
               showalerterror(data);
               setLoading(false);


                }
               // setUploadedFile([data]);
              })
              .catch((message) => {
                setLoading(false);

                showalerterror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });


              }); });
          
    }
    
    const showalerterror = (neweeror) => {

        setErrorfile(neweeror);
        seterrorvisible(true);

       setTimeout(() => {
        setErrorfile(null);
        seterrorvisible(false);

      } , 3000);
    };


    const [orders, setOrders] = useState([]);


    const changePage = (newPage) => {
        setPage(parseInt(newPage));
        getorders(newPage);
       }

   
    const getorders = async (page) => {
       // setLoading1(true);
    //     const dat = await fetch(`https://adimlayarak.onrender.com/api/v1/users`);
    // const data = await dat.json();
    setLoading(true);


    var token = "";
    user.getIdToken().then(function(idToken) {  
       token =  idToken;
    }).then(()=>{
    OrdersService.getorders((page-1),10, token).then((object) => {
        // console.log(object);
        if (object.succes) {
            setTotalpage(object.totalPages);

            setOrders(object.data);



            setLoading(false);

        } else {
            showalerterror(object);
            setLoading(false);


        }


    }).catch((message) => {
        setLoading(false);

        showalerterror({
            "succes" : false,
            "error" : message.toString()
            
        });
        // console.log(error);


    }); });
     
  
      }
      

    useEffect(() => {


      
        
        getorders(1);
        

      

      
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

   

  
   

  

  

   

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };
    const DialogFooter_ordersituation = (
        <>
            <Button type="button" label="Vazgeç" icon="pi pi-times" onClick={() => setorderdialog(false)} text />
            <Button type="button" label="Güncelle" icon="pi pi-check" onClick={() => updatesituation()} text autoFocus />
        </>
    );
    const updatesituationtemplate = (rowData) => {
        return   <div>
            <Button label="Güncelle" icon="pi pi-inbox"  onClick={() =>{setorderid(rowData.id); setorderdialog(true)} } />
            
        </div>
        
        ;
    };

    const updatesituation = async () => {
        setorderdialog(false);
        if(dropdownItemOrder == null){
            showalerterror(
               {
                    "succes" : false,
                    "error" : "Lütfen Sipariş Durumu Seçiniz",
                    
                } 
            );
            return;
        }
        setLoading(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/orders`, {
            method: "PUT",
             body: JSON.stringify({
                "status" : dropdownItemOrder.code,
                "id" : orderid
                
            } ),    
        headers: { 'Cache-Control': 'no-cache','Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
                .then((res) => res.json())
                .then(data => {
                    if(data.succes){
                        setDropdownItemOrder(null);

    
                        getorders(page);
        
                        }else{
                        showalerterror(data);
                        setLoading(false);

    
        
                        }
                
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(message => { 
                    setLoading(false);
    
                    
                    showalerterror({
                        "succes" : false,
                        "error" : message.toString()
                        
                    });
    
                }) ; });
      }
    

 

   

    const imageBodyTemplate = (rowData) => {
        return <img src={`${fileUrl}${rowData.image}`} onError={(e) => (e.target.src = `${errorImageUrl}`)} alt={rowData.image} className="shadow-2" width={100} />;
    };


    const frequencyBodyTemplate = (rowData) => {
        switch(rowData.frequency) {
            case "once_a_day":
             return <label  >Günde 1 Defa</label> ;
              // a kod bloğu
            
            case  "use_one_time":
                return <label>1 Defa</label> ;
              // b kod bloğu
            break;
            case "no_restriction":
                return <label>Sıklık Yok</label> ;
            default:
                    return <label>Sıklık Yok</label> ;
              // varsayılan kod bloğu
          }
        
    };

  

  

    const rowExpansionTemplate = (rowData) => {
        let modellist = [];
        modellist.push(rowData.model);
        
        return (
            <div>
                <div className="orders-subtable">
                    <DataTable value={modellist} responsiveLayout="scroll">
                    <Column field="id" header="Şehir" body={cityTemplate}></Column>
                    <Column field="id" header="İlçe" body={distTemplate}></Column>

                        <Column field="neighbourhood" header="Mahalle"></Column>
                        <Column field="street" header="Sokak"></Column>
                        <Column field="building_no" header="Bino No"></Column>
                        <Column field="apartment_no" header="Apt No"></Column>
                        <Column field="description" header="Açıklama"></Column>
                        <Column field="id" header="Ülke" body={countryTemplate}></Column>

                       
                    </DataTable>
                </div>
                <div className="orders-subtable">
                    

                <DataTable value={rowData.Products} responsiveLayout="scroll">
                    <Column field="name" header="Ad" ></Column>
                    <Column field="subtitle" header="Alt Başlık" ></Column>
                    <Column field="id" header="Ürün Miktarı" body={qtyTemplate}></Column>

                    <Column field="id" header="Ürün Tipi" body={producttypeTemplate}></Column>
                    <Column field="id" header="Ürün Markası" body={brandTemplate}></Column>


                    

                


                   
                </DataTable>
                
            </div>

            </div>
            
        );
    };

    

   

    


    return (
       
<div>





     
            <div className="col-12">
                <div className="card">
<div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                            <h5>Siparişler</h5>
                        </div>
                        
                      
                    </div>
                    <div className="flex xalign-items-center justify-content-between">
                        <a></a>
                        <Button style={{margin: "5px"}} type="button" label="Sipariş Oluştur" onClick={() => {
                    
                    router.push(`/createorder`);
                                   }} />
                
                    </div>
                    <h1></h1>

                    {errorvisible && <Alert severity="error">{errorfile.error}</Alert>}

                    <DataTable  emptyMessage="Sipariş Bulunamadı" loading={loading} value={orders} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll" rowExpansionTemplate={rowExpansionTemplate} dataKey="id" >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="id" header="Id"  />

                        <Column field="id" header="Kullanıcı Adı" style={{ minWidth: '12rem' }} body={nameTemplate} />
                        <Column field="id" header="Kullanıcı Soyadı" style={{ minWidth: '12rem' }} body={surnameTemplate} />

                        <Column field="id" header="Kullanıcı Email" style={{ minWidth: '12rem' }} body={emailTemplate} />
                        <Column field="id" header="Kullanıcı Tel" style={{ minWidth: '12rem' }} body={phoneTemplate} />
                        
                        <Column field="total_cart" header="Tutar" sortable />
                        <Column field="status" header="Durumu" sortable body={stateTemplate} />
                        <Column field="id" header="Durumu Güncelle"  body={updatesituationtemplate} />

                        <Column field="id" header="Kullanımda"   body={switchTemplate}  />
                        
                        <Column field="id" header="Sanal Mı?"   body={verifiedVirtualBodyTemplate}  />
                        <Column field="id" header="Tamamlandı Mı?"   body={verifiedDoneBodyTemplate}  />

                        <Column header="Oluşturulma Tarihi" field="createdAt" dataType="date"  body={dateBodyTemplate}  />

                        

                       
                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading} count={totalpage} page={page}    onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>
                </div>
            </div>


            <Dialog header="Sipariş Durumunu Güncelle" visible={orderdialog} onHide={() => setorderdialog(false)} style={{ width: '350px' }} modal footer={DialogFooter_ordersituation}>
                        

                        <div className="grid formgrid">
    
                       <div className="col-12 mb-2  ">
                       <label >Sipariş Durumu </label>
                         <Dropdown id="situation" value={dropdownItemOrder} onChange={(e) => {
                             setDropdownItemOrder(e.value)}} options={dropdownItemsOrderSituation} optionLabel="name" placeholder="Seçiniz"></Dropdown>
                       </div>
                     
                       </div>

                     </Dialog>
            


</div>

      
    );
};

export default Orders;



