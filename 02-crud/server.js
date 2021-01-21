const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
let courses = require('./data');

const app = express();

// El signo ! hace referencia que el campo es requerido

const courseSchema = buildSchema(`
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
`);

const root = {

    // * Ver todos los cursos
    getCourses( { page, limit } ) {
        if (page != undefined) {
            return courses.slice( ( page -1 ) * limit, ( page ) * limit )
        }
        
        return courses
    },

    // * Obtener curso por id

    getCourse( { id } ) {
        return courses.find( ( course ) => id === course.id );
    },

    // * Agregar un curso

    addCourse( { input } ) {
        const id = String( courses.length + 1 );
        const course = { id, ...input };
        courses.push( course );
        return course;
    },

    // * Actualizar curso
    // ? findIndex(): se ejecuta una vez por cada elemento adentro del arreglo
    // ? Object.assign(): Permite construir un nuevo arreglo

    updateCourse( { id, input } ) {
        const courseIndex = courses.findIndex( ( course ) => id === course.id  )
        const course = courses[courseIndex];

        const newCourse = Object.assign( course, input )

        course[courseIndex] = newCourse;

        return newCourse;
    },

    // * Eliminar un curso

    deleteCourse( { id } ) {
        courses = courses.filter( ( course ) => id !== course.id )
        return {
            message: `El curso ${ id } fue eliminado correctamente`
        }
    }
};

app.get('/', (req, res) => {
    res.json(courses);
});

// * middleware
app.use('/graphql', graphqlHTTP({
    schema: courseSchema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Server running');
});