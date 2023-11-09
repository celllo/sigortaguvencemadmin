import Layout from '@/layout/Layout';
import { LayoutProvider } from '../layout/context/layoutcontext';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import { locale , addLocale} from 'primereact/api';
import { AuthContextProvider } from '@/context/AuthContext'
import Notification from "@/components/PushNotificationLayout";

 
export default function MyApp({ Component, pageProps }) {

    locale("tr");

    
    addLocale(
        "tr",{
           "startsWith":"Başlangıç",
           "contains":"Barındırır",
           "notContains":"İçinde Barındırmaz",
           "endsWith":"Bitiş",
           "equals":"Eşittir",
           "notEquals":"Eşit Değildir",
           "noFilter":"Filtresiz",
           "lt":"Daha az",
           "lte":"Daha az veya Eşit",
           "gt":"Daha Fazla",
           "gte":"Daha fazla veya Eşit",
           "dateIs":"Tarih",
           "dateIsNot":"Tarih değildir",
           "dateBefore":"Tarihten önce",
           "dateAfter":"Tarihten sonra",
           "custom":"Özel",
           "clear":"Temiz",
           "apply":"Uygula",
           "matchAll":"Tümüyle eşleşir",
           "matchAny":"Herhangi birine eşleşir",
           "addRule":"Kural Ekle",
           "removeRule":"Kuralı Sil",
           "accept":"Tamam",
           "reject":"İptal",
           "choose":"Seç",
           "upload":"Yükle",
           "cancel":"Vazgeç",
           "dayNames":["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],
           "dayNamesShort":["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"],
           "dayNamesMin":["Pz","Pt","Sa","Ça","Pe","Cu","Ct"],
           "monthNames":["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
           "monthNamesShort":["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],
           "today":"Bugün",
           "weekHeader":"Hf",
           "firstDayOfWeek":0,
           "showMonthAfterYear": false,
           "dateFormat":"dd/mm/yy",
           "weak":"Zayıf",
           "medium":"Orta",
           "strong":"Güçlü",
           "passwordPrompt":"Şifre Giriniz",
           "emptyFilterMessage":"Kullanılabilir seçenek yok",
           "emptyMessage":"Sonuç bulunamadı",
           "aria": {
                 "trueLabel": "Doğru",
                 "falseLabel": "Yanlış",
                 "nullLabel": "Seçilmedi",
                 "pageLabel": "Sayfa",
                 "firstPageLabel": "İlk Sayfa",
                 "lastPageLabel": "Son Sayfa",
                 "nextPageLabel": "Sonraki Sayfa",
                 "previousPageLabel": "Önceki Sayfa"
           }
        }
     );

    
   
    
  if (Component.getLayout) {
      return  <AuthContextProvider> 

        <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}  <Notification/> </LayoutProvider>  
       

        
      
      </AuthContextProvider>
  } else {
      return (

        <AuthContextProvider>

        <LayoutProvider>
              <Layout>
                  <Component {...pageProps} /> 
                  <Notification/>
              </Layout>
          </LayoutProvider>


        
         

          </AuthContextProvider>

      );
  }
}
