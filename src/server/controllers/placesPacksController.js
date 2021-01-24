const path = require('path')

const Place = require('../models/Place')
const Task = require('../models/ToDoList')
const {
    findOneDestination,
    findOnePlace,
    findOneToDo
} = require('../helpers/modelsUtils')
const {
    findIndexInArrOfObjs
} = require('../helpers/helpers')
const mongoose = require('mongoose')

const addPP = async (req, resp) => {


    try {

        const d = await findOneDestination(req.body.destId)

        if (!!req.body.place) { // place is defined

            if (!d.places) { // places is undefined in destination, so create a new Place Object

                const p = new Place({

                    destinationId: d._id,
                    places: [{
                        type: req.body.type,
                        place: req.body.place
                    }]

                })

                const savedPlace = await p.save()


                d.places = savedPlace._id

                await d.save()

                resp.send(savedPlace)
            }
            else {

                const p = await findOnePlace(d._id)

                p.places.push({
                    type: req.body.type,
                    place: req.body.place
                })
                await p.save()
                resp.send(p)
            }


        }
        else if (!!req.body.pack) { // toDoList is defined


            if (!d.tasks) { // places is undefined in destination, so create a new Place Object

                const p = new Task({

                    destinationId: d._id,
                    tasks: [{
                        description: req.body.pack
                    }]

                })

                const savedTask = await p.save()

                d.tasks = savedTask._id

                await d.save()
                resp.send(savedTask)
            }
            else {

                const p = await findOneToDo(d._id)

                p.tasks.push({
                    description: req.body.pack
                })

                await p.save()

                resp.send(p)
            }


        }

    }
    catch (err) {

        resp.send(err)

    }

}

const deletePP = async (req, resp) => {


    // https://mongoosejs.com/docs/models.html#deleting

    // https://www.geeksforgeeks.org/mongoose-deletemany-function/

    const type = req.params.type // pack list or Place

    const id = req.params.ppId


    try {

        if (type == 'pack') {

            const t = await Task.findOne({
                'tasks._id': id
            })

            if (!t) return // undefined tasks( toDo List) doc, do nothing

            if (!t.tasks) return // undefined/null, do nothing

            const pos = t.tasks.findIndex(findIndexInArrOfObjs, {
                id
            }) // {id} is this object used in callback

            t.tasks.splice(pos, 1) // delete item found in pos

            t.save() // save after delete

            resp.send({
                del: 'success',
                code: 200,
                type: 'pack'
            })

        }
        else if (type == 'place') {

            const p = await Place.findOne({
                'places._id': id
            })

            if (!p) return // undefined places doc, do nothing

            if (!p.places) return // undefineddd places do nothing

            const pos = p.places.findIndex(findIndexInArrOfObjs, {
                id
            }) // {id} is this object used in callback

            p.places.splice(pos, 1) // delete item found in pos

            p.save() // save after delete

            resp.send({
                del: 'success',
                code: 200,
                type: 'place'
            })
        }


    }
    catch (err) {

        {
            err: err.message
        }
    }


}

module.exports = {
    addPP,
    deletePP
}