import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { CircularProgress, Alert } from '@mui/material';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import Link from "next/link";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import { useAuthContext } from '@/context/AuthContext';



import { ContactUsService } from '@/service/ContanctUsService';
import { Checkbox } from 'primereact/checkbox';

import { InputText } from 'primereact/inputtext';
import baseUrl from '@/utils/baseUrl';
import errorImageUrl from '@/utils/errorimageUrl';
import fileUrl from '@/utils/fileUrl';

const Socials = () => {
    const { user } = useAuthContext();

    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loadingadd, setLoadingadd] = useState(false);

    const [deletedialog, setDeleteDialog] = useState(false);

    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    const [socials, setSocials] = useState([]);
    const [errorgetsocials, seterrorgetsocials] = useState(null);
    const [erroraddsocials, seterroraddsocials] = useState(null);

    const [socialid, setSocialid] = useState(null);
    const [name, setName] = useState("");
    const [iospath, setIosPath] = useState("");
    const [showmenu, setShowMenu] = useState(false);

    const [path, setPath] = useState("");
    const [file, setFile] = useState([]);










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
    const fetchSocialsData = async () => {

        setLoading1(true);

        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        ContactUsService.getSocials(token).then((object) => {
            // console.log(object);
            if (object.succes) {
                setSocials(object.data);



                setLoading1(false);

            } else {
                showalerterror(object);
                setLoading1(false);


            }


        }).catch((message) => {
            setLoading1(false);

            showalerterror({
                "succes" : false,
                "error" : message.toString()
                
            });
            // console.log(error);


        }); });





    }

    const addSocial = async () => {
        if (name == null || name == "") {
            showaddalerterror(
                {
                    "succes": false,
                    "error": "Lütfen Ad Bilgisini Giriniz",

                }
            );
            return;
        }
        if (path == null || path == "") {
            showaddalerterror(
                {
                    "succes": false,
                    "error": "Lütfen Link Bilgisini Giriniz",

                }
            );
            return;
        }
        if ((file.length === 0)) {
            showaddalerterror(
                {
                    "succes": false,
                    "error": "Lütfen Resim Ekleyiniz",

                }
            );
            return;
        }
        setLoadingadd(true);




        const formData = new FormData();
        

        // await new Promise((resolve, reject) => {

        //     for (let x of file) {

        //         formData.append(`file`, x.file,);

        //     }

        //     resolve(true);
        // });

        formData.append("file", file[0].file);
        formData.append('dir', "social");









        //formData.append('files[]', file.map((e)=> e.file));
        const url = `${baseUrl}/file`;

        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(url, {
            body: formData,

            method: 'POST',
            headers: { "Authorization": `Bearer ${token}` } 


        })

            .then(response => {
                return response.json();
            }).then(data => {
                if (data.succes) {
                    
                    if (data.data.path.length == 0) {
                        setLoadingadd(false);

                        showaddalerterror(
                            {
                                "succes": false,
                                "error": "Resim Yükleme Hatası",

                            }
                        );
                        return;
                    } else{
                        addSocialDatatoImage(data.data.path);
                    }



                } else {
                    setLoadingadd(false);

                    showaddalerterror(data);

                }
                // setUploadedFile([data]);
            })
            .catch(({ message }) => {
                setLoadingadd(false);

                showaddalerterror({
                    "succes": false,
                    "error": message,

                });
            });

        });



       



    }


 const addSocialDatatoImage = async (files) => {
    var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
    fetch(`${baseUrl}/socials`, {
        method: "POST",
        body: JSON.stringify({
            "name": name,
            "path": path,
            "ios_path" : iospath,
            "show_menu" : showmenu,
            "image": files[0]
        }),
        headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }
    })
        .then((res) => res.json())
        .then(data => {
            if (data.succes) {
                setPath("");
                setName("");
                setFile([]);
                setLoadingadd(false);


                fetchSocialsData();

            } else {
                showaddalerterror(data);
                setLoadingadd(false);



            }

        }) // Manipulate the data retrieved back, if we want to do something with it
        .catch(message => {
            setLoadingadd(false);


            showaddalerterror({
                "succes": false,
                "error": message,

            });

        }); });
 }



    function handleChange(event) {


        setFile(event);

    }

    const updateswitch = async (newvalue, newid) => {
        


        setLoading1(true);

        const url = `${baseUrl}/socials/activepassive?id=${encodeURIComponent(newid)}&status=${encodeURIComponent(newvalue)}`;


        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(url, {
            method: "GET",


            headers: {
                'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}`

            }
        })

            .then(response => {
                return response.json();
            }).then(data => {
                if (data.succes) {
                    fetchSocialsData();

                } else {
                    showalerterror(data);
                    setLoading1(false);


                }
                // setUploadedFile([data]);
            })
            .catch((message) => {
                setLoading1(false);

                showalerterror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });


            }); })
    }


    const showalerterror = (neweeror) => {
        seterrorgetsocials(neweeror);



        setTimeout(() => {
            seterrorgetsocials(null);

        }, 3000);
    };

    const showaddalerterror = (neweeror) => {
        seterroraddsocials(neweeror);



        setTimeout(() => {
            seterroraddsocials(null);

        }, 3000);
    };

    //delete type 
    const deleteTemplate = (rowData) => {

        return <div>
            <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={() => setdelete(rowData.id)} />
            <Dialog header="Silme İşlemi Onayı" visible={deletedialog} onHide={() => setDeleteDialog(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>Sosyal Linki Silmek İstediğinize Emin Misiniz?</span>
                </div>
            </Dialog>
        </div>

            ;
    };
    const confirmationDialogFooter = (
        <>
            <Button type="button" label="Hayır" icon="pi pi-times" onClick={() => setDeleteDialog(false)} text />
            <Button type="button" label="Evet" icon="pi pi-check" onClick={() => deletesocial()} text autoFocus />
        </>
    );
    const setdelete = (event) => {
        setDeleteDialog(true);
        setSocialid(event);


    }
    const deletesocial = async () => {
        setDeleteDialog(false);
        setLoading1(true);
        var token = "";
        user.getIdToken().then(function(idToken) {  
           token =  idToken;
        }).then(()=>{
        fetch(`${baseUrl}/socials?id=${encodeURIComponent(socialid)}`, {
            method: "DELETE",
            headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}`}
        })
            .then((res) => res.json())
            .then(data => {
                if (data.succes) {
                    fetchSocialsData();

                } else {
                    showalerterror(data);
                    setLoading1(false);


                }

            }) // Manipulate the data retrieved back, if we want to do something with it
            .catch(message => {
                showalerterror({
                    "succes" : false,
                    "error" : message.toString()
                    
                });
                setLoading1(false);
            }); })


    }


    useEffect(() => {




        fetchSocialsData();



        initFilters1();
    }, []);


    function formatingDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    }
    const formatDate = (value) => {
        //return value;
        //console.log(value);
        //return value;


        var xx = formatingDate(value);

        return xx;
    };



    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            detail: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },




            //verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };



    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.show_menu, 'text-pink-500 pi-times-circle': !rowData.show_menu })}></i>;
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };

    const imageBodyTemplate = (rowData) => {
        return <img id={rowData.id} src={`${fileUrl}${rowData.image}`} onError={(e) => (e.target.src = `${errorImageUrl}`)} alt={rowData.image} className="shadow-2" width={100} />;
    };

    const linkTemplate = (rowData) => {
        return <Link href={rowData.path} className="imagebutton" target="_blank" rel="noopener noreferrer">

            {rowData.path}

        </Link>;
    };










    const switchTemplate = (rowData) => {


        return (

            <InputSwitch checked={rowData.is_checked} onChange={(e) => {


                updateswitch(e.value, rowData.id);
            }} />

        );
    };














    const header1 = renderHeader1();

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>Mesajlar</h5>
                        {errorgetsocials && <Alert style={{ marginBottom: "10px" }} severity="error">{errorgetsocials.error}</Alert>}

                        <DataTable
                            value={socials}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="id"
                            filters={filters1}
                            filterDisplay="menu"
                            loading={loading1}
                            responsiveLayout="scroll"
                            emptyMessage="Mesaj Bulunamadı"
                            header={header1}
                        >
                            <Column field="name" header="Ad" filter filterPlaceholder="Ada Göre Arayınız" style={{ minWidth: '12rem' }} />
                            <Column header="Resim" body={imageBodyTemplate} />

                            <Column field="path" header="Link" style={{ minWidth: '12rem' }} body={linkTemplate} />
                            <Column field="ios_path" header="IOS Path" style={{ minWidth: '12rem' }} />
                            <Column field="show_menu" header="Menüde Göster" style={{ minWidth: '12rem' }} body={verifiedBodyTemplate} />




                            <Column header="Oluşturulma Tarihi" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} />




                            <Column field="is_checked" header="Aktif" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={switchTemplate} />
                            <Column field="id" header="Sil" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={deleteTemplate} />



                        </DataTable>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h5>Bize Yazın Tipi Ekle</h5>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            {loadingadd && <CircularProgress />}
                        </div>

                    </div>
                    <div className="field col-12 md:col-6">
                        {erroraddsocials && <Alert severity="error">{erroraddsocials.error}</Alert>}

                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Sosyal Link Adı</label>
                            <InputText value={name} id="name" type="text" onChange={(e) => setName(e.target.value)} />
                        </div>


                        <div className="field col-12 md:col-12">
                            <label >Link</label>
                            <InputText value={path} id="path" type="text" onChange={(e) => setPath(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label >IOS Path</label>
                            <InputText value={iospath} id="path" type="text" onChange={(e) => setIosPath(e.target.value)} />
                        </div>
                        <div className="col-12 mb-2  ">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="option" value="leading" checked={showmenu} onChange= {(e) => setShowMenu(e.checked)}  />
                                <label htmlFor="checkOption1">Menüde Gösterilsin Mi?</label>
                            </div>
                        </div>

                        <div className="field col-12 md:col-12">

                            <Dropzone accept='image/*' label="Resmini Buraya Sürükle veya Ekle" onChange={handleChange} value={file}>

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
                            <Button type="button" label="Ekle" outlined onClick={() => addSocial()} />
                        </div>





                    </div>
                </div>
            </div>
        </div>




    );
};

export default Socials;



