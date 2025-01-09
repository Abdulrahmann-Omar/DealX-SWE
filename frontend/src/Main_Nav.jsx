import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MainNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log("Search query:", searchQuery);
        if(searchQuery === "Youssef"){  
            navigate('/Search')
        }
    };

    if (location.pathname === '/') {
        return (
            <>
                <nav className="navbar">
                    <div className="logo">Deal<span>X</span></div>
                    <ul className="nav-links">
                        <li><NavLink to="/"> Home </NavLink> </li>
                        <li><NavLink to="/MainUser"> Products </NavLink></li>
                        <li><NavLink to="/Reward"> Rewards </NavLink></li>

                        <li><a href="#categories">Categories</a></li>
                        <li><a href="#deals">Deals</a></li>
                        <li>
                            <NavLink
                                to="/Login"
                                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            >
                                Login
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </>
        );
    } 
        return (
            <>
                <nav className="navbar">
                    <div className="logo">
                        Deal<span>X</span>
                    </div>
                    <ul className="nav-links">
                    <li><NavLink to="/"> Home </NavLink> </li>
                    <li><NavLink to="/MainUser"> Products </NavLink></li>
                    <li><a href="#categories">Categories</a></li>
                        <li><a href="#deals">Deals</a></li>
                    </ul>

                    <div className="search-bar">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <button type="submit">
                                <i className="fa fa-search"></i>
                            </button>
                        </form>
                    </div>

                    <div className="nav-icons">
                        <a href="#cart"><i className="fa fa-shopping-cart"></i></a>
                        <a ><NavLink to="/profile"><i className="fa fa-user"></i> </NavLink></a>
                    </div>
                </nav>
            </>
        );
    }



export default MainNav;
