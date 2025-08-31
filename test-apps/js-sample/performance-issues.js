// This file contains intentional performance issues to test our ESLint rules

// 🚨 Rule: no-heavy-namespace-imports
import * as _ from "lodash"; // Should trigger warning
import * as moment from "moment"; // Should trigger warning

// 🚨 Rule: no-blocking-apis
function getUserData() {
  const userData = localStorage.getItem("user"); // Should trigger warning
  const parsed = JSON.parse(userData); // Should trigger warning for potentially large data
  alert("User loaded!"); // Should trigger warning
  return parsed;
}

// 🚨 Rule: no-inefficient-loops
function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    // DOM query in loop - should trigger error
    const element = document.querySelector(`#item-${i}`);

    // JSON parsing in loop - should trigger error
    const data = JSON.parse(items[i]);

    // Console in loop - should trigger error
    console.log("Processing item:", data);

    // Array methods in loop - should trigger error
    const filtered = data.tags.filter((tag) => tag.active);
  }
}

// 🚨 Rule: no-expensive-dom-operations
function updateElements(elements) {
  for (let element of elements) {
    // Style access in loop - should trigger warning
    element.style.width = "100px";

    // Layout-triggering property access - should trigger warning
    const height = element.offsetHeight;

    // DOM query in loop - should trigger warning
    const child = element.querySelector(".child");
  }
}

// 🚨 Rule: no-memory-leaks
function setupEventHandlers() {
  // setInterval without cleanup - should trigger error
  setInterval(() => {
    updateData();
  }, 1000);

  // addEventListener without cleanup - should trigger error
  document.addEventListener("click", handleClick);

  // DOM reference storage - should trigger error
  const cachedElement = document.getElementById("main");

  // Long setTimeout - should trigger error
  setTimeout(() => {
    console.log("This runs after 1 minute");
  }, 60000);
}

// 🚨 Rule: prefer-efficient-data-structures
function inefficientSearches(items, targetId) {
  // Inefficient existence check - should trigger warning
  if (items.indexOf(targetId) !== -1) {
    console.log("Found item");
  }

  // Inefficient find for existence - should trigger warning
  if (items.find((item) => item.id === targetId)) {
    console.log("Item exists");
  }

  // Inefficient filter for count - should trigger warning
  if (items.filter((item) => item.active).length > 0) {
    console.log("Has active items");
  }

  // JSON cloning - should trigger warning
  const copy = JSON.parse(JSON.stringify(items));

  return copy;
}

// 🚨 Rule: prefer-lazy-loading
// Note: This would be caught in template literals or JSX
function createImageHTML() {
  return `
    <div>
      <img src="large-image1.jpg" alt="Large image" />
      <img src="large-image2.jpg" alt="Another large image" />
    </div>
  `;
}

// Multiple string concatenations - should trigger warning
function buildMessage(user, action, timestamp, location) {
  const message =
    "User " +
    user.name +
    " performed " +
    action +
    " at " +
    timestamp +
    " in " +
    location;
  return message;
}

// For-in loop on array - should trigger warning
function processArray(userArray) {
  for (const index in userArray) {
    console.log(userArray[index]);
  }
}

// Object.keys in loop - should trigger warning
function processObjects(objects) {
  for (let obj of objects) {
    const keys = Object.keys(obj); // Should trigger warning
    keys.forEach((key) => {
      console.log(obj[key]);
    });
  }
}
