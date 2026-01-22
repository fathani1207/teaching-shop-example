"""
Integration Tests - SOLUTION

These are the complete integration tests with all assertions filled in.
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

        self.product = Product.objects.create(
            name='Baby Onesie',
            description='Comfortable cotton onesie',
            price='15.99',
            imageUrl='/onesie.jpg'
        )

    def test_new_user_can_register_and_purchase(self):
        """
        Complete flow: Register -> Browse Products -> Create Order
        """
        # Step 1: Register a new user
        register_response = self.client.post('/api/auth/register/', {
            'username': 'newbuyer',
            'email': 'buyer@example.com',
            'password': 'securepass123'
        })

        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        token = register_response.data['token']

        # Step 2: Get the list of products
        products_response = self.client.get('/api/products/')

        self.assertEqual(products_response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(products_response.data), 1)
        product_id = products_response.data[0]['id']

        # Step 3: Create an order (requires authentication)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        order_response = self.client.post('/api/orders/', {
            'product_id': product_id,
            'card_number': '4111111111111111'
        })

        self.assertEqual(order_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(order_response.data['status'], 'paid')
        self.assertEqual(order_response.data['card_last_four'], '1111')

    def test_user_can_view_their_orders(self):
        """
        Flow: Register -> Purchase -> View Orders
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

        self.assertEqual(orders_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(orders_response.data), 1)
        self.assertEqual(orders_response.data[0]['product_name'], 'Baby Onesie')


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

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'paid')

    def test_declined_card_returns_payment_error(self):
        """Cards starting with 0000 should be declined"""
        response = self.client.post('/api/orders/', {
            'product_id': self.product.id,
            'card_number': '0000123456789012'
        })

        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)
        self.assertIn('error', response.data)

    def test_invalid_card_length_is_rejected(self):
        """Card numbers must be exactly 16 digits"""
        response = self.client.post('/api/orders/', {
            'product_id': self.product.id,
            'card_number': '123'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
