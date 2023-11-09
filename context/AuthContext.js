import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import firebase_app from '../firebasefile/config';
import { usePathname } from 'next/navigation';
import LoginPage from '@/pages/login/index';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import myGif from '@/public/layout/images/loading.gif'



const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,router
}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const routerx = useRouter();
 const  [token, setToken] = React.useState("");



    // const [myLocation, setMyLocation] = useState<Location | null>(null);
    const currentPage = usePathname();

    React.useEffect(() => {
        
        

        const unsubscribe = onAuthStateChanged(auth, (user) => {

            
            if (user) {
                setUser(user);
                
            } else {
                routerx.replace({
                    pathname: '/login',
                })
                setUser(null);

            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div style={{
     alignItems: "center",
     background: "#FFF",
     display: "flex",
     height: "100vh",
     justifyContent: "center",
     left: "0",
     position: "fixed",
     top: "0",
     transition: "opacity 0.2s linear",
     width: "100%",
     zIndex: "9999",
     opacity: "1",
     transform: "opacity 1s linear"}} > 
    
    <Image
                        style = {{display: "block",
                            margin: "0 auto",
                           
                             }}
  src={myGif}
  priority={true} 
width={175}
height={175}
 
  alt={`loading`}
  unoptimized={true}
/></div> :  user == null | user == undefined ?    <LayoutProvider><LoginPage/></LayoutProvider>  
   :  children}
        </AuthContext.Provider>
    );
};


