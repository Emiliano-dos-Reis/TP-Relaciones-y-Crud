const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment')


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: [
                {association : 'genre'},
                {association : 'actors'}
            ]
        })
            .then(movies => {
            
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        
        db.Genre.findAll({
            order: [
                ['name' , 'ASC']
            ]
        })
            .then(genres => {
                
                return res.render('moviesAdd' , {
                    allGenres : genres
                })
            })
            .catch(error => console.log(error))
    },
    create: function (req,res) {

        const {title,rating,awards,release_date,length,genre_id} = req.body

        db.Movie.create({
            title : title.trim(),
            rating : +rating,
            awards : +awards,
            release_date,
            length : +length,
            genre_id : +genre_id

        })
            .then(movie => {
                return res.redirect('/movies/list')
            })
            .catch(error => console.log(error))
    },
    edit: function(req,res) {

    let genres = db.Genre.findAll({
        order: [['name','ASC']]
    })

    let movie = db.Movie.findByPk(req.params.id)
        
        Promise.all([genres,movie])
            .then(([genres,movie]) => {
                
                return res.render('moviesEdit' , {
                    allGenres : genres,
                    movie,
                    release_date : moment(movie.release_date).format('YYYY-MM-DD'), // PARA CAMBIAR EL FORMATO DEL "DATE" que viene de la base de datos
                })
            })
            .catch(error => console.log(error)) 
    },
    update: function (req,res) {

        const {title,rating,awards,release_date,length,genre_id} = req.body
        db.Movie.update({
            title : title.trim(),
            rating : +rating,
            awards : +awards,
            release_date : release_date,
            length : length,
            genre_id : +genre_id

        },{
            where:{
                id : req.params.id
            }
        })
        .then(() => res.redirect('/movies/list'))

        .catch(error => console.log(error)) 

    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                return res.render('moviesDelete' , {
                    movie
                })
            })
    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where:{
                id: req.params.id
            }
        })
            .then(() =>{
                return res.redirect('/movies/list')
            })
    }
}

module.exports = moviesController;