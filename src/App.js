import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Manage from './Manage';
import Present from './Present';
import SignUp from './SignUp';

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<Present />} />
                <Route path='/manage' element={<Manage/>} />
                <Route path='/sign-up' element={<SignUp/>} />
            </Routes>
        </Router>
    );
}

export default App;