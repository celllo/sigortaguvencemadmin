import firebase_app from "@/firebasefile/config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import generateerror from "./generateerror";
import { UsersService } from '@/service/UsersService';
import signout from "@/firebasefile/auth/signout";


const auth = getAuth(firebase_app);

export default async function signIn(email, password) {
    let result = null,
        error = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
        let token = "";
        token = result._tokenResponse.idToken;

          await new Promise((resolve, reject) => {
            UsersService.getuserisadmin(token).then( async (object) => {
                 if(object.succes){
                    resolve(true);

                    error = null;
        
                     }else{
                    result = null;
                    error = "Giriş Yapmak İçin Yetkiniz Yok";
                localStorage.setItem('user', '1234');

                     await signout();
                        reject(false);
        
                     }
        
                
             })
           

        });
        


    } catch (e) {
       
        await signout();

        error = await generateerror(e);
        console.log(error);
        
    }

    return { result, error };
}