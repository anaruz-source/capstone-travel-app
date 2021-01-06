const path = require('path')

const Place = require('../models/Place')
const Task = require('../models/ToDoList')
const {findOneDestination, findOnePlace, findOneToDo} = require('../helpers/modelsUtils')


const addPP = async (req, resp) => {
    
    try {

        const d = await findOneDestination(req.params.destinationId)

        if (!!req.body.place) { // place is defined

            if(!d.places) { // places is undefined in destination, so create a new Place Object

                const p = new Place({
                    
                    destId: d._id,
                    places: [{type: req.body.type, place: req.body.place}]

                })

                const savedPlace = await p.saved()

                d.places = savedPlace._id

                await d.save()
            } else {

               const p = await findOnePlace(d._id)

               p.places.push({type: req.body.type, place: req.body.place})
            }
     


        } else if (!!req.body.pack) { // toDoList is defined


            if (!d.tasks) { // places is undefined in destination, so create a new Place Object

                const p = new Task({

                    destId: d._id,
                    tasks: [{ description: req.body.task }]

                })

                const savedTask = await p.saved()

                d.tasks = savedTask._id

                await d.save()
            } else {

                const p = await findOneToDo(d._id)

                p.tasks.push({description: req.body.task })
            }


        }
        
    } catch (err) {
        
    }
   
}

const deletePP = async (req, resp) => {


}

module.exports = {addPP, deletePP}