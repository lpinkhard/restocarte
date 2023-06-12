import React, { Suspense, lazy } from 'react';
import 'semantic-ui-css/semantic.min.css';
import "@aws-amplify/ui-react/styles.css";
import './App.css';
import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import i18n from "i18next";

const Present = lazy(() => import('./Present'));
const Manage = lazy(() => import('./Manage'));
const Tags = lazy(() => import('./Tags'));
const RestaurantSetup = lazy(() => import('./RestaurantSetup'));
const Appearance = lazy(() => import('./Appearance'));
const SignUp = lazy(() => import('./SignUp'));

function App() {
    const { t } = useTranslation();

    document.documentElement.lang = i18n.language;
    if (i18n.language.startsWith('ar') || i18n.language.startsWith('he')) {
        document.documentElement.dir = 'rtl';
        document.documentElement.className = 'rtl';
    }

    return (
        <Router>
            <Suspense fallback={<div className="LoadingDisplay">{t('loading')}</div>}>
                <Routes>
                    <Route path="/:restaurantId" element={<Present/>}/>
                    <Route path="/:restaurantId/:tableId" element={<Present/>}/>
                    <Route path='/manage' element={<Manage/>} />
                    <Route path='/tags' element={<Tags/>} />
                    <Route path='/restaurant-setup' element={<RestaurantSetup/>} />
                    <Route path='/appearance' element={<Appearance/>} />
                    <Route path='/sign-up' element={<SignUp/>} />
                    <Route
                        path="*"
                        element={<Navigate to="/manage" replace />}
                    />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;