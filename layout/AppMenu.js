import React, { useContext,useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { Button } from 'primereact/button';
import signout from "@/firebasefile/auth/signout";
import { useRouter } from 'next/router';




const AppMenu = () => {
    const [error, setError] = useState(null);
  const router = useRouter();
  const signoutfromapp = async (event) => {

    setError(null)

    const { result, error } = await signout();

    if (error) {
        setError(error);
        return console.log(error)
    }

    // else successful
    console.log(result)
    return router.push("/login")
   
}
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Ana Sayfa',
            items: [{ label: 'Ana Sayfa', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Özellikler',
            items: [
                { label: 'Kullanıcılar', icon: 'pi pi-fw pi-users', to: '/users' },

                { label: 'Sigorta İstekleri', icon: 'pi pi-fw pi-inbox', to: '/requests' },
                { label: 'Sigortalar', icon: 'pi pi-fw pi-map', to: '/insurances' },
                { label: 'Sigorta Oluştur', icon: 'pi pi-fw pi-plus', to: '/createinsurance' },
                { label: 'Kabul Edilen Teklifler', icon: 'pi pi-fw pi-thumbs-up-fill', to: '/acceptedproposals' },
                { label: 'Sigorta İptal İstekleri', icon: 'pi pi-fw pi-times-circle', to: '/cancelinsurances' },
                { label: 'Araçlar', icon: 'pi pi-fw pi-car', to: '/cars' },
                { label: 'Araç Ekle', icon: 'pi pi-fw pi-plus-circle', to: '/addcar' },

              
                
                // { label: 'Puanlar', icon: 'pi pi-fw pi-database', to: '/points' },

            ]
        },

        {
            label: 'Uygulama İçerikleri',
            items: [
                { label: 'Sigorta Türleri', icon: 'pi pi-fw pi-database', to: '/services' },
               
                { label: 'Markalar', icon: 'pi pi-fw pi-tags', to: '/brands' },
                { label: 'Puanlar', icon: 'pi pi-fw pi-star', to: '/points' },
                { label: 'Değer Kaybı İstekleri', icon: 'pi pi-fw pi-car', to: '/losevehicles' },
                { label: 'Daimi Mürtein İstekleri', icon: 'pi pi-fw pi-building', to: '/daimimurtein' },



            
            ]
        },
       
        {
            label: 'İletişim',
            items: [
                { label: 'Bize Yazın', icon: 'pi pi-fw pi-comments', to: '/communication/contactus' },
                { label: 'Bize Yazın Tipleri', icon: 'pi pi-fw pi-th-large', to: '/communication/contactustypes' },
                { label: 'S.S.S', icon: 'pi pi-fw pi-question-circle', to: '/communication/faq' },
                { label: 'Sosyal Linkler', icon: 'pi pi-fw pi-link', to: '/communication/socials' },
                { label: 'Bildirimler', icon: 'pi pi-fw pi-send', to: '/communication/notifications' },
                { label: 'Sms Gönder', icon: 'pi pi-fw pi-send', to: '/communication/sendsms' },


                


            
            ]
        },
        // {
        //     label: 'Prime Blocks',
        //     items: [
        //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
        //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://blocks.primereact.org', target: '_blank' }
        //     ]
        // },
        // {
        //     label: 'Utilities',
        //     items: [
        //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
        //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
        //     ]
        // },
       
        // {
        //     label: 'Hierarchy',
        //     items: [
        //         {
        //             label: 'Submenu 1',
        //             icon: 'pi pi-fw pi-bookmark',
        //             items: [
        //                 {
        //                     label: 'Submenu 1.1',
        //                     icon: 'pi pi-fw pi-bookmark',
        //                     items: [
        //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
        //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
        //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 1.2',
        //                     icon: 'pi pi-fw pi-bookmark',
        //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Submenu 2',
        //             icon: 'pi pi-fw pi-bookmark',
        //             items: [
        //                 {
        //                     label: 'Submenu 2.1',
        //                     icon: 'pi pi-fw pi-bookmark',
        //                     items: [
        //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
        //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 2.2',
        //                     icon: 'pi pi-fw pi-bookmark',
        //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // {
        //     label: 'Get Started',
        //     items: [
        //         {
        //             label: 'Documentation',
        //             icon: 'pi pi-fw pi-question',
        //             to: '/documentation'
        //         },
        //         {
        //             label: 'View Source',
        //             icon: 'pi pi-fw pi-search',
        //             url: 'https://github.com/primefaces/sakai-react',
        //             target: '_blank'
        //         }
        //     ]
        // }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            <Button style={{marginTop : "10px"}} label="Çıkış Yap" icon="pi pi-sign-out" severity="danger" onClick={() => signoutfromapp()} />


                {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;




