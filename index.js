const { MongoClient } = require('mongodb');

main().then(() => {
    console.log("connect")
}).catch(err => console.log(err));


async function main() {
    // Connection URI
    const uri = 'mongodb://127.0.0.1:27017/mongotut';

    // Create a new MongoClient
    const client = new MongoClient(uri);

    try {
        // Connect the client to the server
        await client.connect();
        // Specify the database and collection



        // Aggregation Pipeline
        const database = client.db('tut');
        // const countries = database.collection('countries');

        // A country is big if:

        // it has an area of at least three million (i.e., 30000 km2), or
        // it has a population of at least twenty-five million (i.e., 25000000).
        // Write a solution to find the name, population, and area of the big countries.
        // let res = await countries.aggregate([
        //     {
        //         $match: { area: { $gte: 30000 }, population: { $gte: 25000000 }, }
        //     },
        //     {
        //         $project: {
        //             _id:0,
        //             name:1,
        //             population:1,
        //             area:1
        //         }
        //     }
        // ]).toArray();
        // console.log(res)


        // returns the total order quantity of medium size pizzas grouped by pizza name
        // const countries = database.collection('pizzas');
        // let res = await countries.aggregate([
        //     {
        //         $match: { size: "medium" }
        //     },
        //     {
        //         $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
        //     },
        //     {
        //         $sort: { totalQuantity: 1 }
        //     }

        // ]).toArray()
        // console.log(res)
        const sales = database.collection('sales');
        let res = await sales.aggregate([
            // {
            //     $lookup: {
            //         from: "product",        // The collection to join with
            //         localField: "product_id", // Field from the input documents
            //         foreignField: "product_id", // Field from the documents of the "from" collection
            //         as: "product_details"    // The name of the new array field to add to the output documents
            //     }
            // },
            // { $unwind: "$product_details" },
            {
                $lookup: {
                    from: "product",
                    let: { product_id: "$product_id" },  // Variable for the product_id in the Sales collection
                    pipeline: [
                        { $match: { $expr: { $eq: ["$product_id", "$$product_id"] } } },  // Match product_id in the Product collection
                        { $project: { _id: 0, product_name: 1 } }  // Project only the fields you need
                    ],
                    as: "product_details"
                }
            },
            {
                $unwind: "$product_details"  // Flatten the product_details array
            }
        ]).toArray()
        console.log(res)
    }
    catch (err) {
        console.log(err)
    }
}