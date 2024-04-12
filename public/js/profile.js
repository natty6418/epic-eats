function generate_article(data) {
    const article = document.createElement('article');
    article.classList.add('recipe-card');
    
    const img = document.createElement('img');
    if (data.image) img.src = data.image;
    img.alt = 'Recipe Image';
    img.classList.add('recipe-image');
    article.appendChild(img);
    
    const h3 = document.createElement('h3');
    h3.textContent = data.title;
    article.appendChild(h3);

    // Ingredients List
    const ingredientsList = document.createElement('ul');
    ingredientsList.classList.add('ingredients-list');
    data.ingredients.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.ingredient}: ${item.quantity}`;
        ingredientsList.appendChild(li);
    });
    article.appendChild(ingredientsList);

    // Instructions
    const instructions = document.createElement('p');
    instructions.textContent = 'Instructions: ' + data.instructions;
    instructions.classList.add('recipe-instructions');
    article.appendChild(instructions);    
    return article;
}

async function load_my_recipes(){
    const response = await fetch('/api/my-recipes');
    if (response.status === 401){
        window.location.href = '/';
        return;
    };
    const json = await response.json();
    if (json.length === 0) {
        const saved_recipes = document.querySelector('#my-recipes-section .recipe-gallery');
        const p = document.createElement('p');
        p.textContent = 'You have not posted any recipes yet.';
        saved_recipes.appendChild(p);
        return;
    }
    const saved_recipes = document.querySelector('#my-recipes-section .recipe-gallery');
    json.forEach(recipe => {
        const article = generate_article(recipe);
        saved_recipes.appendChild(article);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    load_my_recipes();
});