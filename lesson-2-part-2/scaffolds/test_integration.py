"""
Integration Tests - Test how multiple components work together

These tests verify complete user flows that involve multiple API endpoints
working together, just like a real user would interact with the system.
"""

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from ..models import Product, Order


class UserPurchaseFlowTests(TestCase):
    """Test the complete user purchase flow"""

    def setUp(self):
        """Set up test data before each test"""
        self.client = APIClient()

        # Create a product that users can purchase
        self.product = Product.objects.create(
            name='Baby Onesie',
            description='Comfortable cotton onesie',
            price='15.99',
            imageUrl='/onesie.jpg'
        )

    def test_new_user_can_register_and_purchase(self):
        """
        Complete flow: Register -> Browse Products -> Create Order

        This simulates what a new user would do:
        1. Create an account
        2. Look at available products
        3. Purchase a product
        """
        # Step 1: Register a new user
        register_response = self.client.post('/api/auth/register/', {
            'username': 'newbuyer',
            'email': 'buyer@example.com',
            'password': 'securepass123'
        })

        # TODO: Assert registration succeeded (status 201)
        # TODO: Extract the token from register_response.data['token']
        pass  # Replace with your assertions and token extraction
        token = None  # Replace None with the actual token extraction

        # Step 2: Get the list of products
        products_response = self.client.get('/api/products/')

        # TODO: Assert products endpoint returns 200
        # TODO: Assert at least one product is returned
        # TODO: Get the ID of the first product
        pass  # Replace with your assertions
        product_id = None  # Replace None with actual product ID extraction

        # Step 3: Create an order (requires authentication)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        order_response = self.client.post('/api/orders/', {
            'product_id': product_id,
            'card_number': '4111111111111111'  # Valid test card
        })

        # TODO: Assert order creation succeeded (status 201)
        # TODO: Assert order status is 'paid'
        # TODO: Assert card_last_four is '1111'
        pass  # Replace with your assertions

    def test_user_can_view_their_orders(self):
        """
        Flow: Register -> Purchase -> View Orders

        After purchasing, users should be able to see their order history.
        """
        # Step 1: Register and get token
        register_response = self.client.post('/api/auth/register/', {
            'username': 'orderviewer',
            'email': 'viewer@example.com',
            'password': 'viewerpass123'
        })
        token = register_response.data['token']

        # Step 2: Create an order
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        self.client.post('/api/orders/', {
            'product_id': self.product.id,
            'card_number': '4222222222222222'
        })

        # Step 3: Get list of orders
        orders_response = self.client.get('/api/orders/')

        # TODO: Assert orders endpoint returns 200
        # TODO: Assert exactly 1 order is returned
        # TODO: Assert the order contains the correct product name
        pass  # Replace with your assertions


class PaymentValidationTests(TestCase):
    """Test payment validation across the system"""

    def setUp(self):
        """Set up authenticated user and product"""
        self.client = APIClient()
        self.product = Product.objects.create(
            name='Test Item',
            description='Item for payment tests',
            price='25.00',
            imageUrl='/test.jpg'
        )

        # Register and authenticate a user
        response = self.client.post('/api/auth/register/', {
            'username': 'paymentuser',
            'email': 'payment@example.com',
            'password': 'paymentpass123'
        })
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

    def test_valid_card_creates_paid_order(self):
        """A valid 16-digit card number should create a paid order"""
        response = self.client.post('/api/orders/', {
            'product_id': self.product.id,
            'card_number': '1234567890123456'
        })

        # TODO: Assert status is 201 Created
        # TODO: Assert order status is 'paid'
        pass  # Replace with your assertions

    def test_declined_card_returns_payment_error(self):
        """Cards starting with 0000 should be declined"""
        response = self.client.post('/api/orders/', {
            'product_id': self.product.id,
            'card_number': '0000123456789012'
        })

        # TODO: Assert status is 402 Payment Required
        # TODO: Assert response contains an 'error' message
        pass  # Replace with your assertions

    def test_invalid_card_length_is_rejected(self):
        """Card numbers must be exactly 16 digits"""
        response = self.client.post('/api/orders/', {
            'product_id': self.product.id,
            'card_number': '123'  # Too short
        })

        # TODO: Assert status is 400 Bad Request
        pass  # Replace with your assertion
