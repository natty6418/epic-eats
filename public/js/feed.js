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

    // Actions (Like, Comment, Save)
    const actions = document.createElement('div');
    actions.classList.add('recipe-actions');
    
    const like = document.createElement('button');
    like.textContent = 'Like';
    actions.appendChild(like);
    
    const comment = document.createElement('button');
    comment.textContent = 'Comment';
    actions.appendChild(comment);
    
    const save = document.createElement('button');
    save.textContent = 'Save';
    actions.appendChild(save);
    
    article.appendChild(actions);
    
    return article;
}


async function load_feed(){
    const response = await fetch('/api/feed');
    if (response.status === 401){
        window.location.href = '/';
        return;
    };
    const json = await response.json();
    if (json.length === 0) {
        const feed = document.getElementById('recipe-feed');
        const message = document.createElement('p');
        message.textContent = 'No recipes found';
        feed.appendChild(message);
        return;
    }
    console.log(json);
    const feed = document.getElementById('recipe-feed');
    json.forEach(data => {
        const article = generate_article(data);
        feed.appendChild(article);
    });
}

load_feed();