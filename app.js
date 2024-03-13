const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3077;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/native', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});