'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { UI_STRING_DEFAULTS, type UiStrings } from '@/config/uiStrings'

const UiStringsContext = createContext<UiStrings>(UI_STRING_DEFAULTS)

/**
 * Supplies the locale's interface texts (Strapi "Тексты интерфейса") to every
 * client component. Mounted once in the [locale] layout with values already
 * resolved on the server, so there is no client fetch and no flash.
 */
export function UiStringsProvider({ value, children }: { value: UiStrings; children: ReactNode }) {
  return <UiStringsContext.Provider value={value}>{children}</UiStringsContext.Provider>
}

/** Interface texts for the current locale; English defaults outside a provider. */
export const useUiStrings = (): UiStrings => useContext(UiStringsContext)
