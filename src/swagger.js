const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CMS API',
        description: 'EndPoints for CMS API',
    },
    host: 'e8207d986c0f.ngrok-free.app',
    basePath: '/api/v1',
    schemes: ['https'], // or https
    // securityDefinitions: {
    //     apiTokenAuth: {
    //         type: 'apiKey',
    //         in: 'header',
    //         name: 'Authorization',
    //         description: 'Enter your token directly (no Bearer prefix)'
    //     }
    // },
    // security: [
    //     { apiTokenAuth: [] }
    // ],

    tags: [  // ⬅️ Add this section
        {
            name: 'Auth',
            description: 'Authentication'
        },
        {
            name: 'Users',
            description: 'Users management',
        },
        {
            name: 'Posts',
            description: 'Posts management',
        }
    ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
    'src/routes/auth.routes.js',
    'src/routes/user.routes.js',
    'src/routes/post.routes.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
