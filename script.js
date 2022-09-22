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
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
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

// Event Listeners //

submit.addEventListener("submit", search_meals);
