const Course = require('../models/course.model');
const User = require('../models/user.model');

module.exports = {
    Query: {

        // *  Obtener todos los cursos

        async getCourses( obj, { page, limit } ) {
           let courses = Course.find();
           if ( page != undefined ) {
            courses = courses.limit( limit ).skip( (page - 1) * limit )
           }
           return await courses;
        },

        // * Obtener curso por id

        async getCourse( obj, { id } ) {
            const course = await Course.findById( id );
            return course;
        }
    },

    Mutation: {
        
        // * Agregar un curso

        async addCourse( obj, { input, user } ) {
            const userDB = await User.findById( user );
            const course = new  Course( { ...input, user } );
            await course.save();
            userDB.courses.push( course );
            await userDB.save();
            return course;
        },

        // * Actualizar curso
        
        async updateCourse( obj, { id, input } ) {
            const course = await Course.findByIdAndUpdate( id, input );
            return course;
        },

        // * Eliminar un curso

        async deleteCourse( obj, { id } ) {
            await Course.deleteOne( { _id: id } );
            return {
                message: `El curso ${ id } fue eliminado correctamente`
            }
        }
    },

    Course: {
        async user( c ) {
            return await User.findById( c.user );
        }
    }
}