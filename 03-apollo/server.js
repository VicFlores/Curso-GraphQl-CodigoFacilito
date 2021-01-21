const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const courses = require('./data')

const typeDefs = `
    type Course {
        id: ID!
        title: String!
        views: Int
    }

    input CourseInput {
        title: String!
        views: Int
    }

    type Query {
        getCourses( page: Int, limit: Int = 1 ): [Course]
        getCourse( id: ID! ): Course
    }

    type Mutation {
        addCourse( input: CourseInput ): Course
        updateCourse( id: ID!, input: CourseInput ): Course
        deleteCourse( id: ID! ):Alert
    }

    type Alert {
        message: String!
    }
`;

const resolvers = {
    Query: {
        getCourses( obj, { page, limit } ) {
            if ( page != undefined ) {
                return courses.slice( ( page - 1 ) * limit, ( page ) * limit );
            }

            return courses;
        },

        // * Obtener curso por id

        getCourse( obj, { id } ) {
            return courses.find( ( course ) => id === course.id );
        }
    },

    Mutation: {
        
        // * Agregar un curso

        addCourse( obj, { input } ) {
            const id = String( courses.length + 1 );
            const course = { id, ...input };
            courses.push( course );

            return course;
        },

        // * Actualizar curso
        
        updateCourse( obj, { id, input } ) {
            const courseIndex = courses.findIndex( ( course ) => id === course.id  )
            const course = courses[courseIndex];

            const newCourse = Object.assign( course, input )

            course[courseIndex] = newCourse;

            return newCourse;
        },

        // * Eliminar un curso

        deleteCourse( obj, { id } ) {
            courses = courses.filter( ( course ) => id !== course.id )
            return {
                message: `El curso ${ id } fue eliminado correctamente`
            }
        }
    }
}

const coursesSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const server = new ApolloServer({
    schema: coursesSchema
});

server.listen().then( ({ url }) => {
   console.log(`Server running in ${ url }`) 
});