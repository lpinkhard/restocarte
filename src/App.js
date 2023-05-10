import React, { Suspense, lazy } from 'react';
import 'semantic-ui-css/semantic.min.css';
import "@aws-amplify/ui-react/styles.css";
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

const Present = lazy(() => import('./Present'));
const Manage = lazy(() => import('./Manage'));
const Tags = lazy(() => import('./Tags'));
const RestaurantSetup = lazy(() => import('./RestaurantSetup'));
const SignUp = lazy(() => import('./SignUp'));

function App() {
    return (
        <Router>
            <Suspense fallback={<div className="LoadingDisplay">Loading...</div>}>
                <Routes>
                    <Route path="/:restaurantId" element={<Present/>}/>
                    <Route path="/:restaurantId/:tableId" element={<Present/>}/>
                    <Route path='/manage' element={<Manage/>} />
                    <Route path='/tags' element={<Tags/>} />
                    <Route path='/restaurant-setup' element={<RestaurantSetup/>} />
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