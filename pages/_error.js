function Error({ statusCode }) {
    return (
       
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div className="flex flex-column align-items-center justify-content-center">
            <img src="/demo/images/notfound/logo-blue.svg" alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
            <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                    <h1 className="text-900 font-bold text-5xl mb-2"> {
            statusCode
        ? `Beklenmedik Bir Hata Oluştu : ${statusCode}`
        : 'Beklenmedik Bir Hata Oluştu'
        } </h1>
                    <Link href="/" className="w-full flex align-items-center py-5 border-300 border-bottom-1">
                        <span className="flex justify-content-center align-items-center bg-cyan-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                            <i className="text-50 pi pi-fw pi-home text-2xl"></i>
                        </span>
                        <span className="ml-4 flex flex-column">
                            <span className="text-900 lg:text-xl font-medium mb-1">Ana Sayfa</span>
                        </span>
                    </Link>
                    
                </div>
            </div>
        </div>
    </div>
    )
  }
   
  Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }
   
  export default Error