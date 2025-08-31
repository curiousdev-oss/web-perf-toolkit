#!/bin/bash

# Test runner script for web-perf-toolkit ESLint plugin

echo "🧪 Running ESLint Plugin Tests"
echo "================================"

# Function to run tests with coverage
run_tests_with_coverage() {
    echo "📊 Running tests with coverage..."
    npm run test:coverage
}

# Function to run tests in watch mode
run_tests_watch() {
    echo "👀 Running tests in watch mode..."
    npm run test:watch
}

# Function to run specific test suites
run_specific_tests() {
    local test_type=$1
    case $test_type in
        "rules")
            echo "🔧 Running rule tests..."
            npm run test:rules
            ;;
        "index")
            echo "📁 Running index tests..."
            npm run test:index
            ;;
        "unit")
            echo "🧩 Running unit tests..."
            npm run test:unit
            ;;
        *)
            echo "❌ Unknown test type: $test_type"
            echo "Available types: rules, index, unit"
            exit 1
            ;;
    esac
}

# Function to run all tests
run_all_tests() {
    echo "🚀 Running all tests..."
    npm run test:all
}

# Function to run CI tests
run_ci_tests() {
    echo "🏗️ Running CI tests..."
    npm run test:ci
}

# Main script logic
case "${1:-all}" in
    "coverage")
        run_tests_with_coverage
        ;;
    "watch")
        run_tests_watch
        ;;
    "rules"|"index"|"unit")
        run_specific_tests "$1"
        ;;
    "ci")
        run_ci_tests
        ;;
    "all"|*)
        run_all_tests
        ;;
esac

echo ""
echo "✅ Tests completed!"
