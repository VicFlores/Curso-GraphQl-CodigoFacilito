const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const { graphiqlExpress, graphqlExpress } = require('graphql-server-express');

const courseType = require('./types/course.type');
const courseResolvers = require('./resolvers/resolvers.type');

const userType = require('./types/user.type');
const userResolvers = require('./resolvers/user.resolvers');

const app = express();

const typeDefs = `
    type Alert {
        message: String
    }

    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }
`;

const resolvers = {  };

const courseSchema = makeExecutableSchema({
    typeDefs: [typeDefs, courseType, userType],
    resolvers: merge( resolvers, courseResolvers, userResolvers )
});

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: courseSchema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); 

mongoose.connect( 'mongodb://localhost/graphqlDB',
    { useNewUrlParser: true, useUnifiedTopology: true  }
);

app.listen( 4000, () => {
    console.log('Server running')
} );