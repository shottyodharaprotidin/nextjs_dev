"use client"
import {useState, useEffect} from 'react'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/lib/LanguageContext'

const Providers = ({children}) => {

    const [mounted, setMounted] = useState(false)
  
    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
      setMounted(true)
    }, [])
  
  return (
    <LanguageProvider>
        {mounted ? (
            <ThemeProvider 
            attribute="data-theme"
            defaultTheme="light" 
            themes={['light', 'skin-dark']}
            enableSystem={false}
            >
                {children}
            </ThemeProvider>
        ) : (
            <>{children}</>
        )}
    </LanguageProvider>
  )
}

export default Providers