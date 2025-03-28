import { UserManager } from "./userManager.js";
import { Funko } from "./funko.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { FunkoType, FunkoGenre } from "./enums.js";

// Test data
const TEST_USER = "test_user";
const TEST_FUNKO: Funko = {
  id: "1",
  name: "Test Funko",
  description: "A test funko pop",
  type: FunkoType.POP,
  genre: FunkoGenre.ANIMATION,
  franchise: "Test Franchise",
  number: 1,
  exclusive: true,
  specialFeatures: "Glows in the dark",
  marketValue: 100,
};

// Helper function to clean up test directory
function cleanupTestDirectory() {
  const testDir = path.join(process.cwd(), "data", TEST_USER);
  if (fs.existsSync(testDir)) {
    fs.rmdirSync(testDir, { recursive: true });
  }
}

// Main test function
function testUserManager() {
  console.log(chalk.blue.bold("\nStarting UserManager tests..."));
  cleanupTestDirectory();
  const userManager = new UserManager();

  // Test 1: Add Funko
  console.log(chalk.yellow("\nTest 1: Adding a new Funko"));
  const addResult1 = userManager.addFunkoToUser(TEST_USER, TEST_FUNKO);
  console.assert(addResult1, "Should successfully add new Funko");

  // Test 2: Add duplicate Funko
  console.log(chalk.yellow("\nTest 2: Adding duplicate Funko"));
  const addResult2 = userManager.addFunkoToUser(TEST_USER, TEST_FUNKO);
  console.assert(!addResult2, "Should fail to add duplicate Funko");

  // Test 3: List Funkos
  console.log(chalk.yellow("\nTest 3: Listing Funkos"));
  const funkos = userManager.listUserFunkos(TEST_USER);
  console.log(funkos);
  console.assert(funkos && funkos.length === 1, "Should list one Funko");

  // Test 4: Get specific Funko
  console.log(chalk.yellow("\nTest 4: Getting specific Funko"));
  const getResult = userManager.getFunkoFromUser(TEST_USER, TEST_FUNKO.id);
  console.assert(getResult, "Should successfully get existing Funko");

  // Test 5: Update Funko
  console.log(chalk.yellow("\nTest 5: Updating Funko"));
  const updatedFunko = { ...TEST_FUNKO, description: "Updated description" };
  const updateResult = userManager.updateFunkoInUser(TEST_USER, updatedFunko);
  console.assert(updateResult, "Should successfully update Funko");

  // Test 6: Remove Funko
  console.log(chalk.yellow("\nTest 6: Removing Funko"));
  const removeResult = userManager.removeFunkoFromUser(
    TEST_USER,
    TEST_FUNKO.id,
  );
  console.assert(removeResult, "Should successfully remove Funko");

  // Test 7: Verify removal
  console.log(chalk.yellow("\nTest 7: Verifying removal"));
  const emptyFunkos = userManager.listUserFunkos(TEST_USER);
  console.assert(!emptyFunkos, "Should show no Funkos after removal");

  // Test 8: Remove non-existent Funko
  console.log(chalk.yellow("\nTest 8: Removing non-existent Funko"));
  const removeFail = userManager.removeFunkoFromUser(TEST_USER, "nonexistent");
  console.assert(!removeFail, "Should fail to remove non-existent Funko");

  console.log(chalk.green.bold("\nAll tests completed!"));
  cleanupTestDirectory();
}

// Run the tests
testUserManager();
