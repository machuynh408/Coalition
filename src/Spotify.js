import React from 'react'
import Axios from 'axios';
import Api from 'spotify-web-api-node'

const REDIRECT_URI = "http://localhost:3000/"
const AUTH_URL = 'https://accounts.spotify.com/authorize'
const CLIENT_ID = ''
const CLIENT_SECRET = ''

let spotify = new Api({
    clientId: {CLIENT_ID},
    clientSecret: {CLIENT_SECRET},
    redirectUri: {REDIRECT_URI}
});

export {spotify}

export default class Spotify extends React.Component {

    componentDidMount() {
        this.handleToken()
    }
    
    handleToken = () => {
        const item = localStorage.getItem("access_token")

        if (item != null) {
            spotify.setAccessToken(item)
            console.log("Authorized!")
            return
        }

        const src = window.location.hash.split("&")
        const x = src[0]
        if (!x.startsWith("#access_token")) {
            return
        }
        var token = x.split("=")[1]
        spotify.setAccessToken(token)
        localStorage.setItem("access_token", token)
    }

    render() {
        const url = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`
        return (
            <div>
                <a className="btn btn--loginApp-link" href={url}>Spotify</a>
            </div>
        )
    }
}