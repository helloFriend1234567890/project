// // server.js
// const express = require('express');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(express.static('public')); // Serve static files from the public folder

// app.get('/callback', async (req, res) => {
//     const code = req.query.code;

//     // Log the received authorization code
//     console.log('Received code:', code);

//     if (!code) {
//         console.error('Authorization code not provided');
//         return res.status(400).send('Authorization code not provided');
//     }

//     try {
//         console.log('Requesting access token...');
//         const response = await axios.post('https://api.fitbit.com/oauth2/token', null, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
//             },
//             params: {
//                 grant_type: 'authorization_code',
//                 code: code,
//                 redirect_uri: process.env.REDIRECT_URI,
//             },
//         });

//         const accessToken = response.data.access_token;
//         console.log('Access Token:', accessToken);

//         // Use the access token to fetch user data
//         const userData = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         // Fetching heart rate and steps
//         const heartRateData = await axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         const stepsData = await axios.get('https://api.fitbit.com/1/user/-/activities/date/today.json', {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         // Send the user data back to the client
//         res.json({
//             profile: userData.data,
//             heartRate: heartRateData.data,
//             steps: stepsData.data,
//         });
//     } catch (error) {
//         // Log the full error response for better debugging
//         console.error('Error fetching access token or user data:');
//         console.error('Error message:', error.message);
        
//         // Log the error response data if it exists
//         if (error.response) {
//             console.error('Error response data:', error.response.data);
//             console.error('Error response status:', error.response.status);
//             console.error('Error response headers:', error.response.headers);
//         } else {
//             console.error('No response data available:', error);
//         }
        
//         res.status(500).send('Error fetching access token or user data');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });



// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public folder

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    console.log('Received code:', code);

    if (!code) {
        console.error('Authorization code not provided');
        return res.status(400).send('Authorization code not provided');
    }

    try {
        console.log('Requesting access token...');
        const response = await axios.post('https://api.fitbit.com/oauth2/token', null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
            },
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
            },
        });

        const accessToken = response.data.access_token;
        console.log('Access Token:', accessToken);

        // Send access token back to client for future API requests
        res.json({ accessToken });
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        res.status(500).send('Error fetching access token');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

