"use client";

import React, { createContext, useContext } from "react";

const TranslationContext = createContext<any>(null);

export const TranslationProvider: React.FC<{ translations: any; children: React.ReactNode }> = ({
    translations,
    children,
}) => {
    return (
        <TranslationContext.Provider value={translations}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslations = () => {
    return useContext(TranslationContext);
};
