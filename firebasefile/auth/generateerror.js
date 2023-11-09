import { FirebaseError } from '@firebase/util'



export default async function generateerror   (e)  {
    var error = "Bilinmeyen Bir Hata Oluştu";
    if(e instanceof FirebaseError){
        console.log(e.code)
        switch (e.code) {
            case "auth/invalid-email":
                error = "Geçersiz Email";
              break;
            case "auth/wrong-password":
                error = "Yanlış Şifre";
              break;
            case "auth/weak-password":
                error = "Zayıf ";
              break;
            case "auth/email-already-in-use":
                error = "Email Zaten Kullanımda";
              break;
            case "auth/account-exists-with-different-credential":
                error = "Email Zaten Mevcut";
              break;
            case "auth/user-disabled":
                error = "Kullanıcı Uygun Değil";
              break;
            case "auth/user-not-found":
                error = "Kullanıcı Bulunamadı";
              break;
            case "auth/requires-recent-login":
                error = "Yeniden Giriş Yapınız";
              break;
            default:
                error = "Bilinmeyen Bir Hata Oluştu";
          }
    }
    return error;


}