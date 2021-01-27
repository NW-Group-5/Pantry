$(document).ready(function() {
    let recipes = Array($('.recipe-card'));
    //Adds a click event to each of the saved recipes
    recipes.forEach($card => {
        $card.on('click', (event) => {
            let recipe = $(event.currentTarget);
            let id = recipe.data('id');
            //Makes two calls to spoonacular to retrieve data
            $.get(`/api/spoon/steps/${id}`, data => {
                data = JSON.parse(data);
                $.get(`/api/spoon/info/${id}`, data2 => {
                    data2 = JSON.parse(data2);
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
    let $close = $('<button class="jumbo-close"><i class="far fa-times-circle"></i></button>');
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
    $('.jumbo-close').click((event) => {
        $recipeDiv.html('');
        $recipeDiv.css('visibility', 'hidden');
        $blurDiv.css('visibility', 'hidden');
    });
    $('.jumbo-close').on('mouseover', () => {
        $('.jumbo-close').html('<i class="fas fa-times-circle"></i>');
    });
    $('.blur').on('click', () => {
        $recipeDiv.html('');
        $recipeDiv.css('visibility', 'hidden');
        $blurDiv.css('visibility', 'hidden');
    });
    $('.jumbo-close').on('mouseout', () => {
        $('.jumbo-close').html('<i class="far fa-times-circle"></i>');
    });
};
let $ingredientSearch = $('#ingredient-input');
let $ingredientAdd = $('.submit-ingredient');
//Function to provide suggestions to the ingredient search bar
const ingredientSearchHandler = (event) => {
    let value = $(event.currentTarget).val();
    if (value.length > 15) return;
    $.get(`/api/spoon/suggestions/${value}`, (data) => {
        $('#ingredients').html('');
        JSON.parse(data).forEach(ingredient => {
            let nameArray = [];
            ingredient.name.split(' ').forEach(word => {
                let titleWord = word.charAt(0).toUpperCase() + word.substring(1);
                nameArray.push(titleWord);
            });
            let name = nameArray.join(' ');
            let $name = $(`<option name=${name}>${name}</option>`);
            $('#ingredients').append($name);
        });
    });
};
$ingredientSearch.on('keyup', ingredientSearchHandler);
$ingredientAdd.on('click', event => {
    event.preventDefault();
    let value = $ingredientSearch.val();
    let options = $('option');
    for (let option in options) {
        if (options[option].value === value) {
            $.post('/api/Ingredients', {
                name: value,
                UserAccountId: $('.brand-img').data('id')
            }).then(data => {
                $ingredientSearch.val('');
            });
            return;
        };
    };
    $ingredientSearch.val('');
    alert('Invalid ingredient!');
});

//Function generate cards for recipes
const createRecipeCard = recipeData => {
    let $recipeContainer = $('.recipes');
    let $recipeCard = $(`<div class="recipe-card" data-id=${recipeData.id}><img src=${recipeData.image} class="card-img" alt=${recipeData.name}><div class="card-body"><h5 class="card-title">${recipeData.name}</h5><p class="card-text">${recipeData.summary}</p></div></div>`);
    $recipeContainer.append($recipeCard);
};

//Recipe search function
const recipeSearch = () => {
    let ingredients = Array($('.ingredient-on')).map(ingredient => ingredient = ingredient.text()).join(',+');
    console.log(ingredients);
    $.get(`/api/spoon/byingredients/${ingredients}`, data => {
        console.log(data);
        data.forEach(recipe => {
            createRecipeCard(recipe);
        });
    })
}