/// <reference types="react-scripts" />

// Tipado de variables de entorno para Create React App (adaptado a tu proyecto)
declare namespace NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_SUPABASE_URL: string;
        readonly REACT_APP_SUPABASE_ANON_KEY: string;
        readonly REACT_APP_API_URL?: string;
        readonly PORT?: string;
    }
}


