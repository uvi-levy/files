import React, { useState, useEffect, useCallback } from 'react'
import { Route, Redirect } from 'react-router-dom';
 
function redirectToLogin(routes) {
    window.location.href = routes ?
    `https://accounts.codes/files/login?routes=${routes}` :
        `https://accounts.codes/files/login`;
    return null
}
const ProtectedRoute = ({ component: Component, user, ...rest }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let routes = rest.computedMatch.params.nameVideo;
    let userName = rest.computedMatch.params.userName;
    useEffect(() => {
        const isLocal = window.location.hostname == "localhost"
        const url=`https://files.codes/${userName}/isPermission?isLocal=${isLocal}`;
           const isPermission = async () => {
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: user,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            if (response.status == 401) {
                setIsLoading(false)
                setIsLoggedIn(true)
                console.log('401 from pro...')
            }
            else {
                setIsLoading(false)
            }
        }
        isPermission()
    }, [])
 
    return isLoading ? null : isLoggedIn ?
        redirectToLogin(routes)
        :<Route {...rest} render={props => { return <Component {...rest} {...props} /> }} />
}
export default ProtectedRoute
