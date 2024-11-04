import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import Home from '../../pages/Home';
import Profile from '../../pages/Profile';
import User from '../../pages/User';
import Chat from '../../pages/Chat';
import Article from '../../pages/Article';
import AddArticle from '../../pages/AddArticle';
import EditArticle from '../../pages/EditArticle';
import ArticleDetails from '../../pages/ArticleDetails';
import Cart from '../../pages/Cart';
import Navbar from '../Navbar';
import Contact from '../../pages/Contact';

const index = () => {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/Profile" exact component={Profile} />
                <Route path="/Chat" exact component={Chat} />
                <Route path="/article" exact component={Article} />
                <Route path="/add-article" exact component={AddArticle} />
                <Route path="/edit-article/:id" exact component={EditArticle} />
                <Route path="/article/:id" exact component={ArticleDetails} />
                <Route path="/contact" exact component={Contact}/>
                <Route path="/Cart" exact component={Cart} />
                <Route path="/User/:userId" exact component={User} />
                <Redirect to="/" />
            </Switch>
        </Router>
    );
};

export default index;