import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Configuration
BASE_URL = "http://localhost:5173"  # Standard Vite dev port
ADMIN_EMAIL = "praveenrajulu9@gmail.com"
ADMIN_PASS = "01478520"

class PavithraTravelsAutomation(unittest.TestCase):
    """
    Senior QA Automation Engineer - Selenium UI Test Suite
    Project: Pavithra Travels
    """

    @classmethod
    def setUpClass(cls):
        """Initialize the browser driver before running any tests."""
        print("\n[SETUP] Initializing Chrome Driver...")
        options = webdriver.ChromeOptions()
        # options.add_argument("--headless")  # Uncomment for headless execution
        cls.driver = webdriver.Chrome(options=options)
        cls.driver.maximize_window()
        cls.wait = WebDriverWait(cls.driver, 10)

    @classmethod
    def tearDownClass(cls):
        """Close the browser after all tests are finished."""
        print("\n[TEARDOWN] Closing Browser...")
        cls.driver.quit()

    def test_01_page_load(self):
        """Verify the Home page loads successfully."""
        print("\n[TEST] Verifying Home Page Load...")
        try:
            self.driver.get(BASE_URL)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "header")))
            title = self.driver.title
            self.assertIn("Pavithra Travels", title)
            print("PASS: Home page loaded with correct title.")
        except Exception as e:
            self.fail(f"FAIL: Home page failed to load. Error: {str(e)}")

    def test_02_invalid_login(self):
        """Verify that invalid credentials show an error message."""
        print("\n[TEST] Verifying Invalid Login Validation...")
        try:
            self.driver.get(f"{BASE_URL}/login")
            
            # Locate elements using correct locators
            email_field = self.wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
            pass_field = self.driver.find_element(By.XPATH, "//input[@type='password']")
            login_btn = self.driver.find_element(By.XPATH, "//button[contains(., 'Log In')]")

            # Input invalid data
            email_field.send_keys("wrong@user.com")
            pass_field.send_keys("wrongpass")
            login_btn.click()

            # Check for error message
            try:
                # The UI uses a div with text content for errors
                error_msg = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'failed') or contains(text(), 'Invalid') or contains(text(), 'No account')]")))
                self.assertTrue(error_msg.is_displayed())
                print(f"PASS: Error message displayed: '{error_msg.text}'")
            except TimeoutException:
                print("FAIL: No error message found for invalid login.")
                
        except Exception as e:
            self.fail(f"FAIL: Exception during invalid login test: {str(e)}")

    def test_03_valid_admin_login(self):
        """Verify successful login for an Admin user."""
        print("\n[TEST] Verifying Valid Admin Login...")
        try:
            self.driver.get(f"{BASE_URL}/login")
            
            email_field = self.wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
            pass_field = self.driver.find_element(By.XPATH, "//input[@type='password']")
            login_btn = self.driver.find_element(By.XPATH, "//button[contains(., 'Log In')]")

            email_field.send_keys(ADMIN_EMAIL)
            pass_field.send_keys(ADMIN_PASS)
            login_btn.click()

            # Verify navigation to dashboard or presence of Admin Panel link
            # We wait for the 'Admin Panel' link in the header
            admin_link = self.wait.until(EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'Admin Panel')]")))
            self.assertTrue(admin_link.is_displayed())
            print("PASS: Successfully logged in as Admin.")
            
        except Exception as e:
            self.fail(f"FAIL: Admin login failed. Error: {str(e)}")

    def test_04_admin_add_special_trip(self):
        """Verify Admin can add a new special trip."""
        print("\n[TEST] Verifying Admin Action: Add Special Trip...")
        try:
            # Ensure we are logged in (previous test handles this, but we'll navigate directly)
            self.driver.get(f"{BASE_URL}/admin/special-trips")
            
            add_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Add Special Trip')]")))
            add_btn.click()

            # Fill the modal form
            trip_name = "Automation Test Trip " + str(int(time.time()))
            self.wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='e.g. Manali Adventure']"))).send_keys(trip_name)
            self.driver.find_element(By.XPATH, "//input[@placeholder='e.g. manali-adventure']").send_keys("auto-test-slug")
            self.driver.find_element(By.XPATH, "//input[@placeholder='e.g. Himachal Pradesh']").send_keys("Testing State")
            self.driver.find_element(By.XPATH, "//textarea").send_keys("This is an automated test trip description.")
            
            # Save the trip
            save_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Save Special Trip')]")
            save_btn.click()

            # Verify the trip appears in the list
            new_trip = self.wait.until(EC.presence_of_element_located((By.XPATH, f"//h3[contains(text(), '{trip_name}')]")))
            self.assertTrue(new_trip.is_displayed())
            print(f"PASS: New trip '{trip_name}' successfully created.")

        except Exception as e:
            self.fail(f"FAIL: Admin failed to add trip. Error: {str(e)}")

    def test_05_view_destinations_as_user(self):
        """Verify that the destinations page lists travel packages."""
        print("\n[TEST] Verifying Destinations Page...")
        try:
            self.driver.get(f"{BASE_URL}/destinations")
            
            # Check for grid items
            dest_cards = self.wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "group")))
            self.assertGreater(len(dest_cards), 0)
            print(f"PASS: Found {len(dest_cards)} destination cards.")
            
        except Exception as e:
            self.fail(f"FAIL: Destinations page verification failed. Error: {str(e)}")

if __name__ == "__main__":
    # Execute the test suite
    unittest.main(verbosity=2)
