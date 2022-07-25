const db = require('../database/models');
const sequelize = db.sequelize;


const actorsController = {
    'list': (req, res) => {
        db.Actor.findAll({

            include : [
                {association:"movies"}
            ]
        })
            .then(actors => {
                return res.send(actors)
            })
    }
    

}

module.exports = actorsController; 