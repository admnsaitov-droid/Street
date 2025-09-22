'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function HtmlLangSetter() {
  const pathname = usePathname()

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean)
    const locale = segments[0] || 'en'
    
    console.log('🌐 Setting lang to:', locale, 'from pathname:', pathname)
    
    if (locale && locale.length === 2 && /^[a-z]{2}$/.test(locale)) {
      document.documentElement.lang = locale
      console.log('✅ Lang set to:', locale)
    } else {
      document.documentElement.lang = 'en'
      console.log('✅ Lang set to default: en')
    }
  }, [pathname])

  return null
}
