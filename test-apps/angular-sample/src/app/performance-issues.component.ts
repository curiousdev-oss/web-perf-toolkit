// Angular component with intentional performance issues

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription, interval } from "rxjs";
import { map } from "rxjs/operators";

// 🚨 Rule: no-heavy-namespace-imports - should trigger errors
import * as _ from "lodash";
import * as moment from "moment";
import * as rxjs from "rxjs";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  tags: Array<{ name: string; active: boolean }>;
}

@Component({
  selector: "app-performance-issues",
  template: `
    <div class="products">
      <!-- 🚨 Rule: img-requires-dimensions - should trigger errors -->
      <img src="hero-banner.jpg" alt="Hero Banner" />

      <div class="product-grid">
        <div *ngFor="let product of products" class="product-card">
          <!-- Missing dimensions on images - should trigger errors -->
          <img [src]="product.imageUrl" [alt]="product.name" />
          <h3>{{ product.name }}</h3>
          <p>\${{ product.price }}</p>
          <button (click)="processProduct(product)">Process</button>
        </div>
      </div>

      <!-- More images without dimensions -->
      <div class="gallery">
        <img src="gallery1.jpg" alt="Gallery 1" />
        <img src="gallery2.jpg" alt="Gallery 2" />
        <img src="gallery3.jpg" alt="Gallery 3" />
      </div>
    </div>
  `,
  styleUrls: ["./performance-issues.component.css"],
})
export class PerformanceIssuesComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private subscription?: Subscription;

  // 🚨 Rule: no-memory-leaks - should trigger error (empty ngOnDestroy)
  ngOnDestroy(): void {
    // Empty ngOnDestroy - should trigger error
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupTimers();
    this.setupSubscriptions();
  }

  // 🚨 Rule: no-blocking-apis - should trigger warnings
  loadProducts(): void {
    // Synchronous localStorage access - should trigger warning
    const cached = localStorage.getItem("products");

    if (cached) {
      // Large JSON parsing - should trigger warning
      this.products = JSON.parse(cached);
    } else {
      // Blocking alert - should trigger warning
      alert("No cached products found");
      this.products = this.generateSampleProducts();
    }
  }

  // 🚨 Rule: no-memory-leaks - should trigger errors
  setupTimers(): void {
    // setInterval without cleanup - should trigger error
    setInterval(() => {
      this.updateProductPrices();
    }, 5000);

    // Long setTimeout - should trigger error
    setTimeout(() => {
      console.log("Long delay completed");
    }, 180000); // 3 minutes
  }

  setupSubscriptions(): void {
    // 🚨 Rule: no-memory-leaks - Observable subscription without unsubscribe
    interval(1000)
      .pipe(map((value) => value * 2))
      .subscribe((value) => {
        console.log("Interval value:", value);
      }); // Should trigger error - no unsubscribe

    // Another subscription without cleanup
    this.getProductUpdates().subscribe((products) => {
      this.products = products;
    }); // Should trigger error
  }

  getProductUpdates(): Observable<Product[]> {
    return new Observable((observer) => {
      observer.next(this.products);
    });
  }

  // 🚨 Rule: no-inefficient-loops - should trigger errors
  processProduct(product: Product): void {
    const allProducts = this.products;

    for (const p of allProducts) {
      // DOM query in loop - should trigger error
      const element = document.querySelector(`[data-product="${p.id}"]`);

      // JSON operations in loop - should trigger error
      const serialized = JSON.stringify(p);
      console.log("Processing:", serialized);

      // Array operations in loop - should trigger error
      const activeTags = p.tags.filter((tag) => tag.active);
    }
  }

  // 🚨 Rule: no-expensive-dom-operations - should trigger warnings
  updateProductDisplay(): void {
    for (const product of this.products) {
      const element = document.getElementById(`product-${product.id}`);

      if (element) {
        // Direct style manipulation in loop - should trigger warning
        element.style.backgroundColor =
          product.price > 50 ? "lightgreen" : "lightcoral";

        // Layout-triggering reads - should trigger warning
        const height = element.offsetHeight;
        const width = element.offsetWidth;

        // More DOM queries in loop - should trigger warning
        const priceElement = element.querySelector(".price");
      }
    }
  }

  // 🚨 Rule: prefer-efficient-data-structures - should trigger warnings
  searchProducts(searchTerm: string): Product[] {
    // Inefficient existence check - should trigger warning
    const productNames = this.products.map((p) => p.name);
    if (productNames.indexOf(searchTerm) !== -1) {
      console.log("Product name exists");
    }

    // Inefficient find for existence - should trigger warning
    if (this.products.find((p) => p.name === searchTerm)) {
      console.log("Found product");
    }

    // Inefficient filter for count - should trigger warning
    if (this.products.filter((p) => p.price > 100).length > 0) {
      console.log("Has expensive products");
    }

    // JSON cloning - should trigger warning
    const productsCopy = JSON.parse(JSON.stringify(this.products));

    return productsCopy;
  }

  // Object.keys in loop - should trigger warning
  analyzeProductData(): void {
    for (const product of this.products) {
      const keys = Object.keys(product); // Should trigger warning in loop
      keys.forEach((key) => {
        console.log(`${key}: ${(product as any)[key]}`);
      });
    }
  }

  private generateSampleProducts(): Product[] {
    return [
      {
        id: "1",
        name: "Laptop",
        price: 999,
        imageUrl: "laptop.jpg",
        tags: [{ name: "electronics", active: true }],
      },
      {
        id: "2",
        name: "Phone",
        price: 599,
        imageUrl: "phone.jpg",
        tags: [{ name: "mobile", active: true }],
      },
    ];
  }

  private updateProductPrices(): void {
    // Update logic here
  }

  // Template string with images - should trigger warnings
  generateProductHTML(product: Product): string {
    return `
      <div class="product">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
      </div>
    `;
  }

  // Multiple string concatenation - should trigger warning
  buildProductDescription(product: Product): string {
    return (
      "Product: " +
      product.name +
      " costs $" +
      product.price +
      " and has ID: " +
      product.id
    );
  }

  // For-in on array - should trigger warning
  processProductArray(productArray: Product[]): void {
    for (const index in productArray) {
      console.log(productArray[index]);
    }
  }
}
