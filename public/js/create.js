async function handleSubmit(evt){
    evt.preventDefault();
    const title = document.querySelector('input[name="title"]').value;
    const instructions = document.querySelector('textarea[name="instructions"]').value;
    const recipeImg = document.querySelector('input[name="recipe-img"]').value;
    const ingredients = [];
    const ingredientInputs = document.querySelectorAll('input[name="ingredient[]"]');
    const quantityInputs = document.querySelectorAll('input[name="quantity[]"]');
    ingredientInputs.forEach((ingredient, index) => {
        ingredient.value && ingredients.push({
            ingredient: ingredient.value,
            quantity: quantityInputs[index].value
        });
    });
    const data = {
        title,
        ingredients,
        instructions,
        image: recipeImg
    };

    const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    console.log(json);
    if (response.status === 200) {
        window.location.href = '/feed';
    } else {
        console.log(json);
        const form = document.getElementById('create-recipe-form');
        const error = document.createElement('p');
        error.textContent = json.error;
        form.appendChild(error);
        error.style.color = 'red';
    }
}

const ingredientsSection = document.getElementById('ingredients-section');
    
ingredientsSection.addEventListener('click', function(e) {
    if (e.target.className === 'add-ingredient') {
        const newIngredient = e.target.parentElement.cloneNode(true);
        newIngredient.querySelector('input[name="ingredient[]"]').value = '';
        newIngredient.querySelector('input[name="quantity[]"]').value = '';
        e.target.textContent = '-';
        e.target.className = 'remove-ingredient';
        ingredientsSection.appendChild(newIngredient);
    } else if (e.target.className === 'remove-ingredient') {
        e.target.parentElement.remove();
    }
});

const submitButton = document.getElementById('submit-recipe');
submitButton.addEventListener('click', (evt) =>handleSubmit(evt));
