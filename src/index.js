const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const db = require('./models');
require('dotenv').config();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
// const auth = require('./middlewares/auth.middleware');

const port = process.env.PORT || 3000;


// MIDDLEWARES
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));


// ROUTES
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api/v1/', require('./routes/auth.routes'));
app.use('/api/v1/', require('./routes/user.routes'));
app.use('/api/v1/', require('./routes/post.routes'));
app.use('/api/v1/', require('./routes/comment.routes'));

// RUN SERVER
db.sequelize.sync().then(() => {
    console.log('Successfully connected to the database');
    app.listen(port, () => {
        console.log('Server started on port ' + port);
    });
});
