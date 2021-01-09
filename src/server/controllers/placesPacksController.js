const path = require('path')

const Place = require('../models/Place')
const Task = require('../models/ToDoList')
const {findOneDestination, findOnePlace, findOneToDo} = require('../helpers/modelsUtils')


const addPP = async (req, resp) => {

    
    try {

        const d = await findOneDestination(req.body.destId)
      
        if (!!req.body.place) { // place is defined

            if(!d.places) { // places is undefined in destination, so create a new Place Object

                const p = new Place({
                    
                    destinationId: d._id,
                    places: [{type: req.body.type, place: req.body.place}]

                })

                const savedPlace = await p.save()
                
                console.log('svd', savedPlace)
                d.places = savedPlace._id

                await d.save()

                resp.send(savedPlace)
            } else {

               const p = await findOnePlace(d._id)

               p.places.push({type: req.body.type, place: req.body.place})
                resp.send(p)
            }
     


        } else if (!!req.body.pack) { // toDoList is defined


            if (!d.tasks) { // places is undefined in destination, so create a new Place Object

                const p = new Task({

                    destinationId: d._id,
                    tasks: [{ description: req.body.pack }]

                })

                const savedTask = await p.save()

                d.tasks = savedTask._id

                await d.save()
                resp.send(savedTask)
            } else {

                const p = await findOneToDo(d._id)

                p.tasks.push({description: req.body.task })

                resp.send(p)
            }


        }
        
    } catch (err) {

        resp.send(err)
        
    }
   
}

const deletePP = async (req, resp) => {





        // https://mongoosejs.com/docs/models.html#deleting

        // https://www.geeksforgeeks.org/mongoose-deletemany-function/

        const type = req.params.type // pack list or Place

        const p = await findOneToDo(req.params.ppId) // Place Or Pack ID

        if (!!p) return // nothing found (d is null)

        if( type == 'pack'){



            Task.deleteOne({ _id: p._id }, function (err) {
                if (err) return handleError(err);
                // deleted at most one  document
            })



        }else if (type == 'place'){
              

            Place.deleteOne({ _id: p._id }, function (err) {
                if (err) return handleError(err);
                // deleted at most one  document
            })

        }

        resp.send({ del: 'success' })

    
}

module.exports = {addPP, deletePP}