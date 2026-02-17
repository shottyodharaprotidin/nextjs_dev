"use client"
import {useState, useEffect} from 'react'
import { ThemeProvider } from 'next-themes'

const Providers = ({children}) => {

    const [mounted, setMounted] = useState(false)
  
    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
      setMounted(true)
    }, [])
  
    if (!mounted) {
      return <>{children}</>
    }
  return (
    <ThemeProvider 
      attribute="data-theme"
      defaultTheme="light" 
      themes={['light', 'skin-dark']}
      enableSystem={false}
    >
        {children}
    </ThemeProvider>
  )
}

export default Providers