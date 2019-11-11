import React, { useEffect } from 'react';
import axios from 'axios';
import qs from 'query-string';

export default function Auth() {
    const getAccessToken = async (code) => {
        return (await axios.post(`${process.env.REACT_APP_API}/oauth2/token/`, qs.stringify({
            grant_type: "authorization_code",
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            code: code
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })).data;
    }
    useEffect(() => {
        const fetchToken = async () => {
            const tokens = await getAccessToken(code)
            localStorage.setItem('tokens', JSON.stringify(tokens))
            window.history.replaceState('', '', `${window.location.origin}`);
        }
        const { code } = qs.parse(document.location.search);
        if (code)
            fetchToken();
    }, [])

    return (
        <div>
            <a href={`https://filerun.gregoirejoncour.xyz/oauth2/authorize/?scope=email profile upload list weblink download metadata&state&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}`}>Connexion</a>
        </div>
    )
}
