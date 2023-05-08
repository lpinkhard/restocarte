import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import "@aws-amplify/ui-react/styles.css";
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Manage from './Manage';
import Present from './Present';
import SignUp from './SignUp';
import RestaurantSetup from "./RestaurantSetup";
import Tags from "./Tags";

function App() {
    return (
        <Router>
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
        </Router>
    );
}

export default App;