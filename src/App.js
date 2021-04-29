import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import ProductDetail from './components/ProductDetail';
import Products from './components/Products';
import Profile from './components/Profile';
import SignUpForm from "./components/SignupForm";
import UpdateForm from './components/Update';
import cartService from './services/cartService';
import commentService from './services/commentService';
import loginService from './services/loginService';
import productService from './services/productService';


function App() {

    const [user, setUser] = useState(null)
    const history = useHistory()
    
    useEffect(() => {
        const loggedUserJSON= window.localStorage.getItem('logged')
        if (loggedUserJSON){
            const userLocal = JSON.parse(loggedUserJSON)
            console.log("user", userLocal)
            console.log("token", userLocal.token)
            productService.setToken(userLocal.token)
            commentService.setToken(userLocal.token)
            cartService.setToken(userLocal.token)

            setUser(userLocal)
        }
    }, [])

    const handleLogin = async (userObject) => {
        try{
            console.log(userObject)
            const response = await loginService.login(userObject)
            window.localStorage.setItem(
                'logged', JSON.stringify(response.user)
            )
            setUser(response.user)
            productService.setToken(response.user.token)
            commentService.setToken(response.user.token)
            cartService.setToken(response.user.token)
            return response.status
            
        } catch(exception) {
            console.log("ex", exception) 
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('logged')
        setUser(null)
    }



    return (
        <Router>
            <div className="container">
                <Navbar user={user} handleLogout={handleLogout}/>
                <Switch>
                    <Route exact path="/login">
                        < LoginForm handleLogin={handleLogin}/>
                    </Route>

                    <Route exact path="/signup">
                        <SignUpForm />
                    </Route>


                    <Route exact path="/dashboard">
                        <Dashboard />
                    </Route>

                    <Route exact path="/cart">
                        <Cart />
                    </Route>

                    <Route exact path="/product/:id">
                        <ProductDetail />
                    </Route>

                    <Route exact path="/update/product/:id">
                        <UpdateForm />
                    </Route>

                    <Route exact path="/products">
                        <Products />
                    </Route>

                    <Route exact path="/profile">
                        <Profile setUser={setUser} user={user} />
                    </Route>

                    <Route exact path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
