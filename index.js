const express = require('express');
const bodyParser = require('body-parser');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
//const bd = require('./cnn');

const PORT = 3000;
const endPoint = '/pizza_api';


const typeDefs = importSchema('./schema.graphql');
import resolvers from './resolvers';

let server = express();

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

server.use(endPoint, bodyParser.json(), graphqlExpress({
    schema
}));

server.use('/graphiql', graphiqlExpress({
    endpointURL: endPoint,
}));

server.listen(PORT, () => {
    console.log('GraphQL API listen in http://localhost:' + PORT + endPoint);
    console.log('GraphiQL listen in http://localhost:' + PORT + '/graphiql');
});

console.log("OK!!")
