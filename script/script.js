const baseUrl = "https://www.themealdb.com/api/json/v1/1/";
const searchField = document.getElementById("search-field");
const searchButton = document.getElementById("search-btn");
const displayArea = document.getElementById("display");
const detailsArea = document.getElementById("details-area");

// Handle search button click
searchButton.addEventListener("click", ()=> searchMealsByKeyword(searchField.value));

// Search meal by name or any keyword
const searchMealsByKeyword = keyword =>{
    if (keyword != "") {
        showLoader(displayArea, true);
        const url = `${baseUrl}search.php?s=${keyword}`;
        fetch(encodeURI(url))
        .then(data=>data.json())
        .then(data=>{
            showLoader(displayArea, false);
            displayMeals(data);
        });
    } else {
        displayArea.innerHTML = "";
    }
}

// Display meals according to search result
const displayMeals = data => data.meals != null ? displayArea.innerHTML = createMealDisplayCards(data) : showNotFoundMessage();

// Create html element for holding each meal item's name and thumbnail
const createMealDisplayCards = data => {
    const meals = data.meals;
    let elementString = "";
    meals.forEach(data => {
        elementString += `<div class="food-item" onclick="displayMealDetails(${data.idMeal})">
            <div class="thumbnail">
                <img src="${data.strMealThumb}"/>
            </div>
            <div class="food-name">
                <h3>${data.strMeal}</h3>
            </div>
        </div>`;
    });
    return elementString;
}

// Display meal details
const displayMealDetails = id => {
    const url = `${baseUrl}lookup.php?i=${id}`;
    fetch(encodeURI(url))
        .then(data => data.json())
        .then(data => detailsArea.innerHTML = createMealDetailsElement(data));
}

// Create html element for holding meal details
const createMealDetailsElement = data => {
    const item = data.meals[0];
    let ingredients = "";
    let measurement = "";
    for(let i = 1; i <= 3; i++){
        ingredients += `<li><i class="material-icons">check_box</i> ${item["strIngredient"+i]}</li>`;
        measurement += `<li><i class="material-icons">check_box</i> ${item["strMeasure"+i]}</li>`;
    }
    return `<section id="modal">
      <div class="modal-content">
        <div class="modal-body">
          <div class="food-details">
            <button id="modal-btn" onclick="hideMealDetails()">X</button>
            <img src="${item.strMealThumb}" />
            <div class="details">
              <h1>${item.strMeal}</h1>
              <h4>Ingredients</h4>
              <ul>${ingredients+measurement}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

// Show not found message if search meal not exists
const showNotFoundMessage = () => displayArea.innerHTML = `<h1>Not found</h1><br>
<span class="material-icons" style="font-size:30px;padding: 20px 10px">sentiment_very_dissatisfied</span>`;

// Hide meal details
const hideMealDetails = ()=> detailsArea.innerHTML = "";

// Hide and show loader by passing parent element and true or false argument
const showLoader = (parentElement, condition) => condition ? parentElement.innerHTML = `<div class="loader"></div>` : "";