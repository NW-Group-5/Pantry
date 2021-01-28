$(document).ready(function() {
    let recipes = Array($('.recipe-card'));
    //Adds a click event to each of the saved recipes
    recipes.forEach($card => {
        $card.on('click', getRecipeData);
    });
});

//Function to retrieve in-depth info on a recipe
const getRecipeData = (event) => {
    if (moreInfo) return;
    let recipe = $(event.currentTarget);
    let id = recipe.data('id'); 
    $.get(`/api/spoon/steps/${id}`, data => {
        data = JSON.parse(data);
        $.get(`/api/spoon/info/${id}`, data2 => {
            try {
                data2 = JSON.parse(data2);
                //Removes links at the end of the summary.
                let summary = data2.summary.slice(0, data2.summary.indexOf('Try <a'));
                //Makes an array with the full ingredient names with units and amounts
                let ingredients = data2.extendedIngredients.map(ingredient => ingredient.original);
                //Creates the data to send into our render function
                let recipeData = {
                    id: id,
                    name: data2.title,
                    ingredients: ingredients,
                    imgURL: data2.image,
                    recipeSteps: data[0].steps,
                    summary: summary
                };
                //Calls the jumbotron render
                renderRecipe(recipeData);
            } catch (e) {
                console.log(e);
                recipe.css('background', 'var(--shadow)');
                recipe.css('box-shadow', 'none');
                recipe.find('.card-title').text('Recipe data not found.');
                recipe.find('.card-title').css('color', 'var(--white)');
            };
        });
    });
};

//Flags for click events in relation to visibility of divs
let searchActive = false;
let moreInfo = false;

//Hidden divs
let $recipeDiv = $('.jumbo');
let $blurDiv = $('.blur');
let $searchContainer = $('.search-container');

//Function that renders the recipe data to the page
const renderRecipe = data => {
    //Sets flag to indicate that the info div is active
    moreInfo = true;
    //Creates info elements
    let $recipeImg = $(`<img class="jumbo-image" src=${data.imgURL}>`);
    let $recipeName = $(`<h1 class='jumbo-name' data-id=${data.id}>${data.name}</h1>`);
    let $recipeSummary = $(`<p class='jumbo-summary'>${data.summary}</p>`);
    let $recipeIngredients = $('<ul class="jumbo-ingredients"></ul>');
    let $recipeSteps = $('<ul class="jumbo-steps"></ul>');
    let $close = $('<button class="jumbo-close"><i class="far fa-times-circle"></i></button>');
    let $addRecipe;
    if (searchActive) $addRecipe = $('<button class="add-recipe">Save Recipe</button>');
    //Makes the info div visible and the blur div visible if it isn't already
    $recipeDiv.css('visibility', 'visible');
    if (!searchActive) $blurDiv.css('visibility', 'visible');
    //Appends elements
    $recipeDiv.append($close);
    $recipeDiv.append($recipeName);
    $recipeDiv.append($recipeImg);
    $recipeDiv.append($recipeSummary);
    $recipeDiv.append($recipeIngredients);
    $recipeDiv.append($recipeSteps);
    if (searchActive) $recipeDiv.append($addRecipe);
    //Adds ingredient list items
    data.ingredients.forEach(ingredient => {
        let ingItem = $(`<li class='jumbo-ingredient'>${ingredient}</li>`);
        $recipeIngredients.append(ingItem);
    });
    //Addsstep list items
    data.recipeSteps.forEach(step => {
        let stepItem = $(`<li class='jumbo-step'>${step.number}. ${step.step}</li>`);
        $recipeSteps.append(stepItem);
    });
    let summaryLinks = Array($('.jumbo-summary a'));
    //Un-links provided links in summary
    summaryLinks.forEach($link => {
        $link.attr('href', '');
    });
    //Adds click event to close icon to hide info div and blur if necessary
    $('.jumbo-close').click(() => {
        $recipeDiv.html('');
        $recipeDiv.css('visibility', 'hidden');
        if (!searchActive) $blurDiv.css('visibility', 'hidden');
        moreInfo = false;
    });
    //Alters icon on hover
    $('.jumbo-close').on('mouseover', () => {
        $('.jumbo-close').html('<i class="fas fa-times-circle"></i>');
    });
    $('.jumbo-close').on('mouseout', () => {
        $('.jumbo-close').html('<i class="far fa-times-circle"></i>');
    });

    if (searchActive) {
        $addRecipe.on('click', createRecipe);
    };
    //Hides infoDiv and blur if necessary
    if (!searchActive) {
        $('.blur').on('click', () => {
            $recipeDiv.html('');
            $recipeDiv.css('visibility', 'hidden');
            $blurDiv.css('visibility', 'hidden');
        });
    };
};

//Elements relating to ingredient searches
let $ingredientSearch = $('#ingredient-input');
let $ingredientAdd = $('.submit-ingredient');

//Function to provide suggestions to the ingredient search bar
const ingredientSearchHandler = (event) => {
    let value = $(event.currentTarget).val();
    //Limit for length of search to save API calls
    if (value.length > 15) return;
    $.get(`/api/spoon/suggestions/${value}`, (data) => {
        $('#ingredients').html('');
        console.log(data)
        JSON.parse(data).forEach(ingredient => {
            //Title cases ingredient names
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

//Triggers suggestions on each key stroke
$ingredientSearch.on('keyup', ingredientSearchHandler);

//Adds ingredient to database and #renders new ingredient#
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
                let $newLi = $(`<li class="ingredient">${data.name}</li>`);
                $('.ingredients ul').append($newLi);
            });
            return;
        };
    };
    $ingredientSearch.val('');
    alert('Invalid ingredient!');
});

//Function generate cards for recipes
const createRecipeCard = recipeData => {
    let $recipeCard = $(`<div class="search-card" data-id=${recipeData.id}><img src=${recipeData.image} class="card-img" alt=${recipeData.title}><div class="card-body"><h5 class="card-title">${recipeData.title}</h5></div></div>`);
    $recipeCard.on('click', getRecipeData);
    $searchContainer.append($recipeCard);
};

//Recipe search function
const recipeSearch = () => {
    //Sets flag to indicate the visibility of the search div
    searchActive = true;
    //Collects toggled ingredients and formats the query
    let $ingredients = $('.ingredient-on');
    let ingredientArray = [];
    for (let i = 0; i < $ingredients.length; i++) {
        ingredientArray.push($ingredients[i].innerText.split(' ').join(''));
    };
    let ingredientString = ingredientArray.join(',+');

    $.get(`/api/spoon/byingredients/${ingredientString}`, data => {
        try {
            //If the results were empty it sends an alert and returns
            if (JSON.parse(data).length === 0) {
                searchActive = false;
                alert('Something went wrong! No recipes were found.');
                return;
            };
            console.log(JSON.parse(data));
            JSON.parse(data).forEach(recipe => {
                createRecipeCard(recipe);
            });
            //Makes necessary divs visible
            $searchContainer.css('visibility', 'visible');
            $blurDiv.css('visibility', 'visible');
            $blurDiv.on('click', () => {
                //If the info div is not visible then blur click will hide the search
                if (!moreInfo) {
                    $searchContainer.html('');
                    $searchContainer.css('visibility', 'hidden');
                    $blurDiv.css('visibility', 'hidden');
                    searchActive = false;
                }
            });
        } catch (e) {
            //If access is denied in the query, or some other error, an alert is sent
            searchActive = false;
            console.log(e);
            alert('Something went wrong! No recipes were found.');
        };
    });
};

$('.recipe-search').on('click', recipeSearch);

//function to change ingredient class on click
$(".ingredient").on("click", event => {
    $(event.currentTarget).toggleClass("ingredient-on")
})

//create recipe in db post method
//render recipe to recipe div

//Adds recipe to database
const createRecipe = () => {
    $.post('/api/Recipes', {
        name: $('.jumbo-name').text(),
        recipeID: $('.jumbo-name').data('id'),
        summary: $('.jumbo-summary').text(),
        imageURL: $('.jumbo-image').attr('src'),
        UserAccountId: $('.brand-img').data('id')
    }).then(data => {
        createFavoriteRecipeCard(data)
        $(".empty-data").css("visibility", "hidden")
        $blurDiv.css("visibility", "hidden")
        $recipeDiv.css("visibility", "hidden").html("")
        $searchContainer.css("visibility", "hidden").html("")
    moreInfo = false
    searchActive = false
    });

};

//Render recipe to favorites
const createFavoriteRecipeCard = favoriteRecipe => {
    let $recipeCard = $(`<div class="recipe-card" data-id=${favoriteRecipe.id}><img src=${favoriteRecipe.imageURL} class="card-img" alt=${favoriteRecipe.name}><div class="card-body"><h5 class="card-title">${favoriteRecipe.name}</h5></div></div>`);
    $recipeCard.on('click', getRecipeData);
    $(".recipes").append($recipeCard);
};