import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';
import React, {  useEffect ,useState} from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { DashboardService } from '@/service/DashboardService';
import { CircularProgress, Alert } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import CryptoJS from 'crypto-js';
const inter = Inter({ subsets: ['latin'] })

 function Home() {
   const { user } = useAuthContext()
   //const [dashboarddatas, setdashboarddatas] = useState(null);

   const [userdata, setuserdata] = useState(null);
   const [point, setpoint] = useState(null);
   const documentStyle = getComputedStyle(document.documentElement);
   const [userchart, setUserchart] = useState({});
   const [requestchart, setRequestChart] = useState({});
   const [insurancechart, setInsuranceChart] = useState({});
   const [pointchart, setPointChart] = useState({});

 







   const textColor = documentStyle.getPropertyValue('--text-color');
   const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
   const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
   const pieOptions = {
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                color: textColor
            }
        }
    }
};
   const [loading, setLoading] = useState(true);
   const [dashboarderror, setdashboarderror] = useState(null);
  // var currentdate = new Date(); 
  //  console.log(currentdate);
  //  var yesterday = new Date();
  //  yesterday.setDate(currentdate.getDate() - 1);
  //  console.log(yesterday);

   const [startcalendarValue, setStartCalendarValue] = useState(null);
   const [endcalendarValue, setEndCalendarValue] = useState(null);

//   const router = useRouter();
//   useEffect(() => {
//     if (user == null || user == undefined) router.push("/login")
// }, [user])

useEffect(() => {
 
  getdashboard();
}, []);

function getdashboard(){
  setdashboarderror(null);

  setLoading(true);
  var token = "";
  user.getIdToken().then(function(idToken) {  
     token =  idToken;
  }).then(()=>{
    DashboardService.getdashboard(token).then((object) => {
     //console.log(object);
      if(object.succes){
        
         
        //setdashboarddatas(object.data)
        setuserdata(object.user);
        setpoint(object.point);
        

        const pieData1 = {
          labels: object.user.userData.map(datax => 

            {
              switch(datax.user_status) {
                case "active":
                 return "Aktif" ;
                case  "ban":
                return"Ban" ;
                case  "permanent_bant":
                return "Kalıcı Ban";
                case  "waiting_review":
                return "İncelemede" ;
              
                
                
               default:
                   
                return "İncelemede";
                  // varsayılan kod bloğu
              } 
            }
             
           

           ),
          datasets: [
              {
                  data: object.user.userData.map(datax => 

                     datax.count
        
                   ),
                  backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500')],
                  hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400')]
              }
          ]
      };
      //   const barData = {
      //     labels: [""],
      //     datasets: object.user.userData.map(datax => ({

      //       label: datax.user_status,
      //       backgroundColor: documentStyle.getPropertyValue('--primary-500'),
      //       borderColor: documentStyle.getPropertyValue('--primary-500'),
      //       data: [datax.count]

      //     }) )
      // };
      const pieData2 = {
        labels: ["Toplam Puan", "Kullanılan Puan"],
        datasets: [
            {
                data: [object.point.total_point,object.point.used_point],
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--yellow-500'),documentStyle.getPropertyValue('--cyan-500'),documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400'),documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--yellow-400'),documentStyle.getPropertyValue('--cyan-400'),documentStyle.getPropertyValue('--green-500')]
            }
        ]
    };
      const pieData3 = {
        labels: object.requestsx.map(datax => 
        
          {
            switch(datax.status) {
              case "inreview":
               return "İncelemede" ;
              case  "proposed":
              return "Teklif Sürecinde"  ;
              case  "denied":
              return "Reddedildi"  ;
              case  "accepted":
              return "Kabul Edildi" ;
              case  "deleted":
              return "Talep Geri Alındı";
              case  "deletedbyadmin":
              return "Admin Tarafından Silindi" ;
            
              
              
              
             
              default:
                 
              return "İncelemede";
                // varsayılan kod bloğu
            }
          }
           
         

         ),
        datasets: [
            {
                data: object.requestsx.map(datax => 

                   datax.count
      
                 ),
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--yellow-500'),documentStyle.getPropertyValue('--cyan-500'),documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400'),documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--yellow-400'),documentStyle.getPropertyValue('--cyan-400'),documentStyle.getPropertyValue('--green-500')]
            }
        ]
    };

    const pieData4 = {
      labels: object.insurancesx.map(datax => 
       
        {
          switch(datax.status) {
            case "active":
             return "Aktif" ;
            case  "passive":
            return "Pasif"  ;
            case  "cancel":
            return "İptal İsteği Oluşturuldu"  ;
         
            case  "deletedbyadmin":
            return "Admin Tarafından Silindi" ;
          
            
            
            
           
            default:
               
            return "";
              // varsayılan kod bloğu
          }
        }
         
       

       ),
      datasets: [
          {
              data: object.insurancesx.map(datax => 

                 datax.count
    
               ),
              backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--yellow-500'),documentStyle.getPropertyValue('--cyan-500'),documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400'),documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--yellow-400'),documentStyle.getPropertyValue('--cyan-400'),documentStyle.getPropertyValue('--green-500')]
          }
      ]
  };
 
 



      setUserchart(pieData1);
      setRequestChart(pieData3);

      setInsuranceChart(pieData4);
      setPointChart(pieData2);
    

      
       //console.log(barData);
        setLoading(false);

         
          }else{
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

function getdashboardwithdate(){
  setdashboarderror(null);
  if(startcalendarValue == null || endcalendarValue == null){
    showalerterror({
      "succes" : false,
      "error" : "Lütfen Tarih Seçiniz"
      
  });
  return;
  }
  const now = Date.now();
      var timestamp = Date.parse(startcalendarValue);
     

      if(timestamp > now){
        showalerterror(
            {
                "succes" : false,
                "error" : "Lütfen Başlangıç Tarihini Bugün veya Daha Öncesi Bir Tarih Seçiniz",
                
            } 
        );
        return;
      }
      var timestampx = Date.parse(endcalendarValue);

      if(timestampx > now){
        showalerterror(
            {
                "succes" : false,
                "error" : "Lütfen Bitiş Tarihini Bugün veya Daha Öncesi Bir Tarih Seçiniz",
                
            } 
        );
        return;
      }
  setLoading(true);

  var timestampstart = Date.parse(startcalendarValue);
  var d = new Date(timestampstart);
  var  timeStampStart = d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();


  var timestampend = Date.parse(endcalendarValue);
  var dend = new Date(timestampend);
  var  timeStampEnd = dend.getFullYear() + '/' + (dend.getMonth()+1) + '/' + dend.getDate();
  var token = "";
  user.getIdToken().then(function(idToken) {  
     token =  idToken;
  }).then(()=>{
    DashboardService.getdashboardwithdate(timeStampStart,timeStampEnd,token).then((object) => {
     // console.log(object);
      if(object.succes){
        
         
        //setdashboarddatas(object.data)
        setuserdata(object.user);
        setpoint(object.point);

        const pieData1 = {
          labels: object.user.userData.map(datax => 

            {
              switch(datax.user_status) {
                case "active":
                 return "Aktif" ;
                case  "ban":
                return"Ban" ;
                case  "permanent_bant":
                return "Kalıcı Ban";
                case  "waiting_review":
                return "İncelemede" ;
              
                
                
                
               
                default:
                   
                return "İncelemede";
                  // varsayılan kod bloğu
              } 
            }
             
           

           ),
          datasets: [
              {
                  data: object.user.userData.map(datax => 

                     datax.count
        
                   ),
                  backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500')],
                  hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400')]
              }
          ]
      };
      //   const barData = {
      //     labels: [""],
      //     datasets: object.user.userData.map(datax => ({

      //       label: datax.user_status,
      //       backgroundColor: documentStyle.getPropertyValue('--primary-500'),
      //       borderColor: documentStyle.getPropertyValue('--primary-500'),
      //       data: [datax.count]

      //     }) )
      // };
      const pieData2 = {
        labels: ["Toplam Puan", "Kullanılan Puan"],
        datasets: [
            {
                data: [object.point.total_point,object.point.used_point],
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--yellow-500'),documentStyle.getPropertyValue('--cyan-500'),documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400'),documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--yellow-400'),documentStyle.getPropertyValue('--cyan-400'),documentStyle.getPropertyValue('--green-500')]
            }
        ]
    };
      const pieData3 = {
        labels: object.requestsx.map(datax => 
        
          {
            switch(datax.status) {
              case "inreview":
               return "İncelemede" ;
              case  "proposed":
              return "Teklif Sürecinde"  ;
              case  "denied":
              return "Reddedildi"  ;
              case  "accepted":
              return "Kabul Edildi" ;
              case  "deleted":
              return "Talep Geri Alındı";
              case  "deletedbyadmin":
              return "Admin Tarafından Silindi" ;
            
              
              
              
             
              default:
                 
              return "İncelemede";
                // varsayılan kod bloğu
            }
          }
           
         

         ),
        datasets: [
            {
                data: object.requestsx.map(datax => 

                   datax.count
      
                 ),
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--yellow-500'),documentStyle.getPropertyValue('--cyan-500'),documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400'),documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--yellow-400'),documentStyle.getPropertyValue('--cyan-400'),documentStyle.getPropertyValue('--green-500')]
            }
        ]
    };

    const pieData4 = {
      labels: object.insurancesx.map(datax => 
       
        {
          switch(datax.status) {
            case "active":
             return "Aktif" ;
            case  "passive":
            return "Pasif"  ;
            case  "cancel":
            return "İptal İsteği Oluşturuldu"  ;
         
            case  "deletedbyadmin":
            return "Admin Tarafından Silindi" ;
          
            
            
            
           
            default:
               
            return "";
              // varsayılan kod bloğu
          }
        }
         
       

       ),
      datasets: [
          {
              data: object.insurancesx.map(datax => 

                 datax.count
    
               ),
              backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--yellow-500'),documentStyle.getPropertyValue('--cyan-500'),documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--orange-400'),documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--yellow-400'),documentStyle.getPropertyValue('--cyan-400'),documentStyle.getPropertyValue('--green-500')]
          }
      ]
  };
 
 



      setUserchart(pieData1);
      setRequestChart(pieData3);

      setInsuranceChart(pieData4);
      setPointChart(pieData2);
    
    

        setLoading(false);
        }else{
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

const showalerterror = (neweeror) => {
  setdashboarderror(neweeror);



//  setTimeout(() => {
//   setdashboarderror(null);

// } , 3000);
};

const cleandata = ()=>{
  setdashboarderror(null);
  setEndCalendarValue(null);
  setStartCalendarValue(null);
  getdashboard();
 


}





const deneme = async ()=>{

if(true){
  
  var key = CryptoJS.enc.Base64.parse('YWFhYmJiY2NjZGRkZWVlZQ==');     // Use Utf8-Encoder. 
var iv  = CryptoJS.enc.Base64.parse('+ojdwfTS0CJ/YwIKVc5rCQ==');                     // Use Utf8-Encoder

var encryptedCP = CryptoJS.AES.encrypt("deneme", key, { iv: iv });
var decryptedWA = CryptoJS.AES.decrypt(encryptedCP, key, { iv: iv});

var encryptedBase64 = encryptedCP.toString();                              // Short for: encryptedCP.ciphertext.toString(CryptoJS.enc.Base64);
var decryptedUtf8 = decryptedWA.toString(CryptoJS.enc.Utf8);               // Avoid the Base64 detour.
                                                                           // Alternatively: CryptoJS.enc.Utf8.stringify(decryptedWA);  
console.log("Ciphertext (Base64)  : " + encryptedBase64)
console.log("Decrypted data (Utf8): " + decryptedUtf8); 
  
}else{

}
 



}

  return (
    <>
      <Head>
        <title>Sigorta Güvencem Dashboard</title>
        <meta name="description" content="Mobil App Admin Paneli" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon3.png" />
      </Head>
      <div className="col-12">
                <div className="card">
                <div className="flex justify-content-between">

                <h5>Tarihe Göre Ara</h5>
                <div>
                <Button style={{marginRight:"2px", marginBottom: "2px"}} type="button" label="Ara" icon="pi pi-search" onClick={() => getdashboardwithdate()}  />
                    
                <Button  style={{marginRight:"2px", marginBottom: "2px"}} type="button" label="Seçimi Temizle" icon="pi pi-times" onClick={() => cleandata()}  />
                {/* <Button  style={{marginRight:"2px", marginBottom: "2px"}} type="button" label="Deneme" icon="pi pi-times" onClick={() => deneme()}  /> */}

                </div>

                        
                    

                </div>
                <div className="col-12 "></div>

               
                <div className="grid formgrid"> 
                <div className="col-6 mb-2">
                       <span>İlk Tarih </span>
                       <Calendar showIcon showButtonBar dateFormat="dd/mm/yy" value={startcalendarValue} onChange={(e) => setStartCalendarValue(e.value)}></Calendar>
                       </div>
                       <div className="col-6 mb-2  ">
                       <span>Son Tarih </span>
                       <Calendar showIcon showButtonBar dateFormat="dd-mm-yy" value={endcalendarValue} onChange={(e) => {
                        setEndCalendarValue(e.value);
                        console.log(e);
                        
                        }}></Calendar>
                       </div>
                       
                </div>
                
                </div>
                
                </div>
      { loading ? <CircularProgress /> : dashboarderror != null ? <Alert severity="error">{dashboarderror.error}</Alert> :
   <div className="grid">
            <div className="col-12 lg:col-12 xl:col-12">
                <div className="card mb-0" style={{paddingBottom:"38px"}}>
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Kullanıcı Sayısı</span>
                            <div className="text-900 font-medium text-xl">{userdata.totaluserCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-blue-500 text-xl" />
                        </div>
                        
                    </div>
                  
                    <span className="text-500"> Toplam puanlardan</span>
                    <span className="text-green-500 font-medium"> %{parseFloat(point.used_point/point.total_point*100).toFixed(2)}</span>
                    <span className="text-500">  kullanıldı</span>
                   
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Kullanıcılar</h5>
                    <Chart type="pie" data={userchart} options={pieOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Puanlar</h5>
                    <Chart type="pie" data={pointchart} options={pieOptions}></Chart>
                </div>
            </div>
         
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">İstekler</h5>
                    <Chart type="pie" data={requestchart} options={pieOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Sigortalar</h5>
                    <Chart type="doughnut" data={insurancechart} options={pieOptions}></Chart>
                </div>
            </div>
         
           
            </div> }
     
    </>
  )
}
export default Home;
