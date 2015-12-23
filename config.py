# Statement for enabling the development environment
DEBUG = True

# Define the application directory
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  

# Secret key for signing cookies
SECRET_KEY = "h6zpDjnI/u0H1Q+LO3QxLHLKZ8yLRMJ8i5mIeR0SsOc="

DATA_DIR = os.path.join(BASE_DIR, 'data')
