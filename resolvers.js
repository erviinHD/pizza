const { db } = require('./cnn');

const pizzaResolver = {
    Query: {
        pizzas(root, { name }) {
            if (name == undefined) {
                return executeQuery('select * from Pizza', name);
            }
            return executeQuery('select * from Pizza where name=$1', name);
        },
        ingredients(root, { id }) {
            return executeQuery('select * from ingredient', id);
        }



    },
    Pizza: {
        ingredients(pizza1) { // Have to resolve the field "ingredients" when a "Pizza" object is requested
            const query = `SELECT ingredient.* FROM pizza_ingredients, ingredient
            WHERE pizza_ingredients.ingredient_id = ingredient.id 
                and pizza_ingredients.pizza_id = $1;`;
            return executeQuery(query, pizza1.id);

        }
    },

    Mutation: {
        async createPizza(root, { pizza }) {
            if (pizza == undefined) return null;
            const query = `INSERT INTO pizza (name,origin) values ($1, $2) returning *;`

            let res = await db.one(query, [pizza.name, pizza.origin]);
          

            //// insertar ingredientes

            if(res.id &&  pizza.ingredients && pizza.ingredients.length>0){
                pizza.ingredients.forEach(ingredientId => {
                    const query = `INSERT INTO pizza_ingredients (pizza_id, ingredient_id )
                    VALUES ($1, $2)`;
                    executeQuery(query, [res.id, ingredientId]);
                    
                });
            }
            return res;
        }
    }

}

function executeQuery(query, parameters) {
    let dataset = db.any(query, parameters)
        .then(res => res)
        .catch(err => err)
    return dataset;
}

export default pizzaResolver;

