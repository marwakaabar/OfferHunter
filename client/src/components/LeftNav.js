import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UidContext } from '../components/AppContext';


const LeftNav = () => {
    const uid = useContext(UidContext);
    return (
        <div className="left-nav-container">
            <div className="icons">
                <div className="icons-bis">
                    <NavLink to='/' exact activeClassName="active-left-nav">
                       <div><img src="/img/icons/home.svg" alt="home" /></div> <div><h3>Home</h3></div> 
                    </NavLink>
                    <br />
                    <NavLink to='/profile' exact activeClassName="active-left-nav">
                        <img src="/img/icons/user.svg" alt="user" />
                        <h3>Profile</h3>
                    </NavLink>
                    {
                        uid && (<NavLink to='/chat' exact activeClassName="active-left-nav">
                            <img src="/img/icons/message1.svg" alt="chat" />
                            <h3>Chat</h3>
                        </NavLink>)
                    }
                    {
                        uid && (<NavLink to='/cart' exact activeClassName="active-left-nav">
                            <img src="/img/icons/addcart.svg" alt="cart" />
                            <h3>Cart</h3>
                        </NavLink>)
                    }
                    <br /><br />
                    <NavLink to="/contact" exact activeClassName="active-left-nav">
                        <div>
                            <img style={{
                                marginLeft: "4px",
                            }} src="/img/icons/report.svg" alt="report" />
                        </div>
                        <h3>Report</h3>
                    </NavLink>

                </div>
            </div>
        </div>
    );
};

export default LeftNav;