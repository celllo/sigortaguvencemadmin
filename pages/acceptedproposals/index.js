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
import { CircularProgress, Alert,Pagination } from '@mui/material';
import { Checkbox } from 'primereact/checkbox';
import baseUrl  from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog';



const AcceptedProposals = () => {
    const { user } = useAuthContext();
    const router = useRouter();


    const [filters1, setFilters1] = useState(null);
    const [loading2, setLoading2] = useState(false);
    
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
 

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);


    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState(1);
   


    const [errorvisible, seterrorvisible] = useState(false);
    const [error, seterror] = useState(null);

   

     const changePage = (newPage) => {
        if(parseInt(newPage) == 0){
            return;

        }
        if(parseInt(newPage) > totalpage){
            return;

        }
        setPage(parseInt(newPage));
        getpropsal(newPage);
       }

  
  


       const getpropsal = async (page) => {
       
        setLoading(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
           const url = `${baseUrl}/proposal?status=accepted&page=${encodeURIComponent(page-1)}&size=${encodeURIComponent(10)}`;
   
           BaseService.get(url,token).then((object) => {
           //console.log(object);
            if(object.succes){
                if(object.totalPages == null){
                    setTotalpage(1);
                }else{
                    setTotalpage(object.totalPages);

                }

               setProposals(object.data);
                
       
               
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


       
        
        getpropsal(0,globalFilterValue1);
        

       

    }, []); // eslint-disable-line react-hooks/exhaustive-deps


  

  






 

  
    function formatingDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }
    const formatDate = (value) => {
     
       
        
var xx =  formatingDate(value);
        
        return xx;
    };

    const detayTemplate = (rowData) => {
        return <Button style={{margin: "5px"}} type="button" label="İstek Detayı" onClick={() => {
                     
             router.push(`/requests/${rowData.requestId}`);
                            }} />
     };
  




   

  
    const dateEndBodyTemplate = (rowData) => {
        return formatDate(rowData.endDate);
    };
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
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
  



   

   
 
   

 

   

  


   





   

   

  

   

   


    return (
        <div>

    

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Kabul Edilen Teklifler</h5>
                    <DataTable
                        value={proposals}
                        
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="Teklif Bulunamadı."
                    >
                      <Column field="id" header="ID"  ></Column>

<Column field="price" header="Teklif Fiyatı"  ></Column>
<Column field="id" header="Teklif Durumu" body={proposalTypeBodyTemplate}  ></Column>

<Column field="point" header="Teklif Puanı"  ></Column>

<Column field="note" header="Bildirim Notu" ></Column>
<Column header="Bitiş Tarihi" dataType="date" style={{ minWidth: '10rem' }} body={dateEndBodyTemplate} />

<Column header="Oluşturulma Tarihi"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />
<Column field="id" header="Detay"  bodyClassName="text-center" style={{ minWidth: '8rem' }} body={detayTemplate}  />

                    </DataTable>
                    <div className="flex justify-content-between" style={{padding : "10px"}}>
                      <label></label>
                      {/* color={layoutConfig.theme === 'bootstrap4-light-blue' ? "purple" : 'red'} */}
                    <Pagination disabled={loading} count={totalpage} page={page}   onClick={(e)=>changePage(e.target.innerText)}  style={{display: "block",  marginleft: "auto", marginright: "auto" }} />
                    <label></label>
            </div>

            <Dialog  visible={errorvisible} onHide={() => seterrorvisible(false)} style={{ width: '350px' }} modal >
                        <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />

                                <label>{error == null ? "" :  error.error}</label>
                            </div>
                        </Dialog>
                </div>
            </div>
            </div>


            
            
            </div>
           
    );
};

export default AcceptedProposals;



