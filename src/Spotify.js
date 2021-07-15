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

export const SPOTIFY_ACCESS_URL = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`

export {spotify}

export default class Spotify extends React.Component {

    componentDidMount() {
        this.handleToken()
    }
    
    handleToken = () => {
        const item = localStorage.getItem("spotify_access_token")

        if (item !== null) {
            spotify.setAccessToken(item)
            console.log("Spotify Authorized!")
            return
        }
    }

    render() {
        return (
            <>
            </>
        )
    }
}