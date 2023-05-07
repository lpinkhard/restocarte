import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import "@aws-amplify/ui-react/styles.css";
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Manage from './Manage';
import Present from './Present';
import SignUp from './SignUp';
import RestaurantSetup from "./RestaurantSetup";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/:restaurantId" element={<Present/>}/>
                <Route path='/manage' element={<Manage/>} />
                <Route path='/restaurant-setup' element={<RestaurantSetup/>} />
                <Route path='/sign-up' element={<SignUp/>} />
            </Routes>
        </Router>
    );
}

export default App;