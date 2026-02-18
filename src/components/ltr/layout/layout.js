import Footer from "./footer";

import Header from "./header";




export default function Layout({ children, hideMiddleHeader = false }) {
  return (
   <>
      <Header hideMiddleHeader={hideMiddleHeader}/>
       {children}
      <Footer/>
   </>

  );
}