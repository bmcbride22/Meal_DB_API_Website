const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const result_heading = document.getElementById("result-heading");
const meals_el = document.getElementById("meals");
const single_meal_el = document.getElementById("single-meal");

// Search meal and fetch from API
function search_meals(e) {
  e.preventDefault();

  //Clear single meal
  single_meal_el.innerHTML = "";

  // Get search term
  const search_term = search.value;

  // Check submission isn't empty
  if (search_term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search_term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        result_heading.innerHTML = `<h2>Search Results for ${search_term}: </h2>`;

        if (data.meals == null) {
          result_heading.innerHTML = `<p>There are no results matching ${search_term}</p>`;
        } else {
          meals_el.innerHTML = data.meals
            .map(
              (meal) =>
                `<div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3 class="meal-title">${meal.strMeal}</h3>
                  </div>
                </div>`
            )
            .join("");
        }
      });
    // Clear search text
    search.value = "";
  } else {
    alert("Please enter a valid search term before submitting");
  }
}

// Fetch meal using meal_id
function get_meal_by_id(meal_id) {
  console.log(meal_id);
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const meal = data.meals[0];

      add_meal_to_DOM(meal);
    });
}
// Fetch a random meal

function get_random_meal() {
  // Clear meals and heading
  meals_el.innerHTML = "";
  result_heading.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      add_meal_to_DOM(meal);
    });
}

// Add meal info to the dom
function add_meal_to_DOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_meal_el.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
      <h2 class="ingredients-title">
          <ul class="ingredient-list">
            ${ingredients
              .map(
                (ingredient) =>
                  `<li class="ingredient-list__item">${ingredient}</li>`
              )
              .join("")}
          </ul>
        </h2>
        <p class="instructions">${meal.strInstructions}</p>
      </div>

    </div>`;
}

// Event Listeners //

submit.addEventListener("submit", search_meals);
random.addEventListener("click", get_random_meal);

// Add event listener to the conatiner of each meal to get the
// data-mealid when thumbnail clicked on

// Need to find out if the meal info div belongs to the element we clicked

meals_el.addEventListener("click", (e) => {
  const meal_info = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (meal_info) {
    const meal_id = meal_info.getAttribute("data-mealid");
    get_meal_by_id(meal_id);
  }
});
