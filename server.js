require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.get('/weather', async (req, res) => {
    try {
        const apiUrl = process.env.WEATHER_API_URL;
        const response = await axios.get(apiUrl);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/locate', async (req, res) => {
    const {lat, lng} = req.query;

    if (!lat || !lng) {
        return res.status(400).send('Latitude and Longitude are required');
    }
    try {
        const apiUrl = process.env.CURRENT_LOCATE_API;
        const response = await axios.get(apiUrl, {
            params: {
                q: `${lat}` + '+' + `${lng}`,
                key: process.env.OPENCAGE_API_KEY
            }
        })
        // res.send(response.data)
        if (response.data.status.code === 200) {
            res.send(response.data.results[0].components.state? response.data.results[0].components.state.replace('Province', ''): response.data.results[0].components._normalized_city);
        } else {
            res.status(500).send(response.data.error_message);
        }
    } catch (error) {
        res.send(error.toString());
    }
});
