// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import {BrowserRouter , Routes, Route } from "react-router-dom";
import Home from './Guest_Page';
import Registering from './Registering-page';
import MainPage from './Main_User_Page';
import SearchResults from './results_page';
import Product from './ProductPage';
import CartPage from './Cart';
import { UserProvider } from './UserContext';
import ProfilePage from './ProfilePage';
import Reward from './App-RewardSystem';


const App = () => {

    return(
        <UserProvider>
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={<Home />} />
                <Route path ="/Cart" element={<CartPage/>}/>
                <Route path="/Login" element={<Registering.LoginForm />} />
                <Route path="/SignUp" element={<Registering.SignUpForm />} />
                <Route path="/MainUser" element={<MainPage/>}/>
                <Route path="/Search" element={<SearchResults />} />
                <Route path="/Product" element={<Product />} />
                <Route path="/Profile" element= { <ProfilePage/>}/>
                <Route path="/Reward" element= { <Reward/>}/>

            </Routes>
        
        </BrowserRouter>
        </UserProvider>
    );
}



export default App;
