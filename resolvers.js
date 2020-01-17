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
    }

}

function executeQuery(query, parameters) {
    let dataset = db.any(query, parameters)
        .then(res => res)
        .catch(err => err)
    return dataset;
}

export default pizzaResolver;

