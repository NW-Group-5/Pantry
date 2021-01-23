let recipes = Array($('.recipe-card'));
//Adds a click event to each of the saved recipes
recipes.forEach($card => {
    $card.on('click', (event) => {
        let recipe = $(event.currentTarget);
        let id = recipe.data('id');
        //Makes two calls to spoonacular to retrieve data
        $.get(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=4c518723a8c64afda5507797e5167881`, (data) => {
            $.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=4c518723a8c64afda5507797e5167881`, data2 => {
                //Removes links at the end of the summary.
                let summary = data2.summary.slice(0, data2.summary.indexOf('Try <a'));
                //Makes an array with the full ingredient names with units and amounts
                let ingredients = data2.extendedIngredients.map(ingredient => ingredient.original);
                //Creates the data to send into our render function
                let recipeData = {
                    name: data2.title,
                    ingredients: ingredients,
                    imgURL: data2.image,
                    recipeSteps: data[0].steps,
                    summary: summary
                };
                //Calls the jumbotron render
                renderRecipe(recipeData);
            });
        });
    });
});

//Function that renders the recipe data to the page
const renderRecipe = data => {
    let $recipeDiv = $('.jumbo');
    let $blurDiv = $('.blur');
    let $recipeImg = $(`<img class="jumbo-image" src=${data.imgURL}>`);
    let $recipeName = $(`<h1 class='jumbo-name'>${data.name}</h1>`);
    let $recipeSummary = $(`<p class='jumbo-summary'>${data.summary}</p>`);
    let $recipeIngredients = $('<ul class="jumbo-ingredients"></ul>');
    let $recipeSteps = $('<ul class="jumbo-steps"></ul>');
    let $close = $('<button class="jumbo-close">X</button>');

    $recipeDiv.css('visibility', 'visible');
    $blurDiv.css('visibility', 'visible');
    $recipeDiv.append($close);
    $recipeDiv.append($recipeName);
    $recipeDiv.append($recipeImg);
    $recipeDiv.append($recipeSummary);
    $recipeDiv.append($recipeIngredients);
    $recipeDiv.append($recipeSteps);

    data.ingredients.forEach(ingredient => {
        let ingItem = $(`<li class='jumbo-ingredient'>${ingredient}</li>`);
        $recipeIngredients.append(ingItem);
    });
    data.recipeSteps.forEach(step => {
        let stepItem = $(`<li class='jumbo-step'>${step.number}. ${step.step}</li>`);
        $recipeSteps.append(stepItem);
    });

    let summaryLinks = Array($('.jumbo-summary a'));
    summaryLinks.forEach($link => {
        $link.attr('href', '');
    });

    $('.jumbo-close').on('click', () => {
        $recipeDiv.html('');
        $recipeDiv.css('visibility', 'hidden');
        $blurDiv.css('visibility', 'hidden');
    });
};

