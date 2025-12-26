"use client";

import React, { createContext, useContext } from "react";

// Create translation context
const TranslationContext = createContext<any>(null);

export const TranslationProvider: React.FC<{ translations: any; children: React.ReactNode }> = ({
    translations,
    children,
}) => {
    // Provide translations via context
    return (
        <TranslationContext.Provider value={translations}>
            {children}
        </TranslationContext.Provider>
    );
};
// Custom hook to use translations
export const useTranslations = () => {
    return useContext(TranslationContext);
};
