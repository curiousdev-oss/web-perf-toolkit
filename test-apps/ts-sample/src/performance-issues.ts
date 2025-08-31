// TypeScript sample with intentional performance issues

// 🚨 Rule: no-heavy-namespace-imports - should trigger errors
import * as _ from "lodash";
import * as rxjs from "rxjs";
import * as dateFns from "date-fns";

// Types for our examples
interface User {
  id: string;
  name: string;
  email: string;
  preferences: Record<string, any>;
}

interface Product {
  id: string;
  name: string;
  price: number;
  tags: Array<{ name: string; active: boolean }>;
}

// 🚨 Rule: no-blocking-apis - should trigger warnings
class UserService {
  loadUser(id: string): User | null {
    // Synchronous localStorage access - should trigger warning
    const cached = localStorage.getItem(`user_${id}`);

    if (cached) {
      // Large JSON parsing - should trigger warning
      return JSON.parse(cached) as User;
    }

    // Blocking alert - should trigger warning
    alert("User not found in cache");
    return null;
  }

  saveUserPreferences(user: User): void {
    // Synchronous storage - should trigger warning
    localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
  }
}

// 🚨 Rule: no-inefficient-loops - should trigger errors
class ProductProcessor {
  processProducts(products: Product[]): void {
    for (const product of products) {
      // DOM query in loop - should trigger error
      const element = document.querySelector(
        `[data-product="${product.id}"]`
      ) as HTMLElement;

      // JSON operations in loop - should trigger error
      const serialized = JSON.stringify(product);
      console.log("Processing:", serialized);

      // Expensive array operations in loop - should trigger error
      const activeTags = product.tags.filter((tag) => tag.active);
      const tagNames = activeTags.map((tag) => tag.name);
    }
  }
}

// 🚨 Rule: no-expensive-dom-operations - should trigger warnings
class DOMManipulator {
  updateProductDisplay(products: Product[]): void {
    for (const product of products) {
      const element = document.getElementById(`product-${product.id}`);
      if (element) {
        // Direct style manipulation in loop - should trigger warning
        element.style.backgroundColor = product.price > 100 ? "gold" : "silver";

        // Layout-triggering property access - should trigger warning
        const currentHeight = element.offsetHeight;
        const currentWidth = element.offsetWidth;

        // More DOM queries in loop - should trigger warning
        const priceElement = element.querySelector(".price");
      }
    }
  }

  measureElements(): number[] {
    const elements = document.querySelectorAll(".product-card");
    const measurements: number[] = [];

    elements.forEach((element) => {
      // getBoundingClientRect in loop - should trigger warning
      const rect = element.getBoundingClientRect();
      measurements.push(rect.height);
    });

    return measurements;
  }
}

// 🚨 Rule: no-memory-leaks - should trigger errors
class EventManager {
  private timers: number[] = [];

  setupPeriodicUpdates(): void {
    // setInterval without cleanup - should trigger error
    setInterval(() => {
      this.updateProductPrices();
    }, 5000);

    // Long timeout - should trigger error
    setTimeout(() => {
      console.log("This runs after 2 minutes");
    }, 120000);
  }

  setupEventListeners(): void {
    // Event listeners without cleanup - should trigger error
    document.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);

    // DOM reference storage - should trigger error
    const headerElement = document.querySelector("header");
  }

  private updateProductPrices(): void {
    // Implementation
  }

  private handleScroll = (event: Event): void => {
    // Implementation
  };

  private handleResize = (event: Event): void => {
    // Implementation
  };
}

// 🚨 Rule: prefer-efficient-data-structures - should trigger warnings
class SearchService {
  findProducts(products: Product[], searchTerm: string): Product[] {
    // Inefficient existence check - should trigger warning
    const productIds = products.map((p) => p.id);
    if (productIds.indexOf(searchTerm) !== -1) {
      console.log("Product ID exists");
    }

    // Inefficient find for existence - should trigger warning
    if (products.find((p) => p.name === searchTerm)) {
      console.log("Product with name exists");
    }

    // Inefficient filter for count - should trigger warning
    if (products.filter((p) => p.price > 100).length > 0) {
      console.log("Has expensive products");
    }

    // JSON cloning - should trigger warning
    const productsCopy = JSON.parse(JSON.stringify(products));

    return productsCopy;
  }

  processProductData(products: Product[]): Record<string, Product[]> {
    const result: Record<string, Product[]> = {};

    for (const product of products) {
      // Object.keys in loop - should trigger warning
      const keys = Object.keys(product.preferences);

      keys.forEach((key) => {
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(product);
      });
    }

    return result;
  }
}

// 🚨 Rule: prefer-lazy-loading - should trigger warnings for template usage
class TemplateRenderer {
  generateProductHTML(products: Product[]): string {
    return `
      <div class="products">
        ${products
          .map(
            (product) => `
          <div class="product-card">
            <img src="${product.id}/image.jpg" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Heavy library import - should trigger warning
  async loadChartLibrary(): Promise<void> {
    // This should suggest dynamic import
    // const chart = await import('chart.js'); // Good
  }
}

// Multiple string concatenations - should trigger warning
function buildProductDescription(product: Product): string {
  const description =
    "Product: " +
    product.name +
    " (ID: " +
    product.id +
    ") costs $" +
    product.price +
    " and has " +
    product.tags.length +
    " tags";
  return description;
}

// Large array creation - should trigger warning
function createLargeDataSet(size: number): number[] {
  // Large array creation - should trigger warning
  return new Array(size).fill(0).map((_, i) => i);
}

// For-in on array - should trigger warning
function processUserArray(userArray: User[]): void {
  for (const index in userArray) {
    console.log(userArray[index]);
  }
}

export {
  UserService,
  ProductProcessor,
  DOMManipulator,
  EventManager,
  SearchService,
  TemplateRenderer,
};
