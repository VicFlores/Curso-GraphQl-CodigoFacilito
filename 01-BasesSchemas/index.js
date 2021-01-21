const express = require('express');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, graphql, GraphQLInt } = require('graphql');

const app = express();

const courseType = new GraphQLObjectType({
    name: 'Course',
    fields: {
        title: { type: GraphQLString },
        views: { type: GraphQLInt }
    }
})

const Schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            message: {
                type: GraphQLString,
                resolve() {
                    return 'Hola Vic Flores'
                }
            },

            course: {
                type: courseType,
                resolve() {
                    return { title: 'Curso de GraphQl', views: 1000 }
                }
            }
        }
    })
});

app.get('/', (req, res) => {
    graphql(Schema, ' { message, course { title } } ')
        .then( r => res.json(r) )
        .catch(res.json)
});

app.listen(4000, () => {
    console.log('Server running');
});
