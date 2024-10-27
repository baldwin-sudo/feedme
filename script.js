const correctPassword = "mesos"; // Set your password here

// Prompt for password on page load
window.onload = function () {
  const passwordInput = prompt(
    "Please enter the password to access the Online Fridge:"
  );
  if (passwordInput === correctPassword) {
    document.getElementById("ingredient-section").style.display = "block";
  } else {
    alert("Incorrect password. Access denied.");
    window.location.href = "about:blank"; // Redirect to a blank page if the password is incorrect
  }
};

// Function to add an ingredient to the list
function addIngredientToList(ingredient) {
  const li = document.createElement("li");
  li.textContent = ingredient;
  document.getElementById("ingredient-list").appendChild(li);
}

// Add event listener to the 'Add Ingredient' button
document.getElementById("add-button").addEventListener("click", function () {
  const ingredientInput = document.getElementById("ingredient");
  const ingredient = ingredientInput.value.trim();

  if (ingredient) {
    addIngredientToList(ingredient);
    ingredientInput.value = ""; // Clear the input
  }
});

// Add event listener for recipe suggestion button
document
  .getElementById("suggest-button")
  .addEventListener("click", async function () {
    const mood =
      document.getElementById("mood-selector").value ||
      document.getElementById("mood-input").value;
    const dayDescription = document.getElementById("day-description").value;
    const ingredients = Array.from(
      document.querySelectorAll("#ingredient-list li")
    ).map((li) => li.textContent);
    const cuisine = document.getElementById("cuisine-selector").value; // Get the selected cuisine

    // Prepare data to send
    const requestData = {
      mood: mood,
      day_description: dayDescription,
      ingredients: ingredients,
      cuisine: cuisine, // Include cuisine in the request
    };

    try {
      // Send POST request to the Flask API
      const response = await fetch("http://localhost:5000/suggest_recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json(); // Parse JSON response
      const recipeList = document.getElementById("recipe-suggestions");
      recipeList.innerHTML = ""; // Clear previous suggestions

      if (data.suggestions && data.suggestions.length > 0) {
        // If there are suggestions, display them
        data.suggestions.forEach((recipe) => {
          const li = document.createElement("li");
          li.textContent = recipe;
          recipeList.appendChild(li);
        });
      } else {
        // If no suggestions are found
        const li = document.createElement("li");
        li.textContent = "No recipes found for your ingredients.";
        recipeList.appendChild(li);
      }

      // Log user mood and day description
      console.log(`User Mood: ${mood}`);
      console.log(`Day Description: ${dayDescription}`);
    } catch (error) {
      console.error("Error fetching recipe suggestions:", error);
      const recipeList = document.getElementById("recipe-suggestions");
      recipeList.innerHTML = ""; // Clear previous suggestions
      const li = document.createElement("li");
      li.textContent = "Error fetching recipe suggestions.";
      recipeList.appendChild(li);
    }
  });

// Add event listeners for popular ingredient buttons
const ingredientButtons = document.querySelectorAll(".ingredient-button");
ingredientButtons.forEach((button) => {
  button.addEventListener("click", function () {
    addIngredientToList(button.textContent);
  });
});
