"""
Unit Tests - SOLUTION

These are the complete unit tests with all assertions filled in.
"""

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from ..models import Product


class ProductModelTests(TestCase):
    """Test the Product model"""

    def test_product_str_returns_name(self):
        """The string representation of a Product should be its name"""
        product = Product.objects.create(
            name='Baby Romper',
            description='Soft cotton romper for newborns',
            price='19.99',
            imageUrl='/images/romper.jpg'
        )

        self.assertEqual(str(product), 'Baby Romper')

    def test_product_has_correct_fields(self):
        """A Product should store all its fields correctly"""
        product = Product.objects.create(
            name='Baby Dress',
            description='Cute floral dress',
            price='29.99',
            imageUrl='/images/dress.jpg'
        )

        self.assertEqual(product.name, 'Baby Dress')
        self.assertEqual(product.description, 'Cute floral dress')
        self.assertEqual(str(product.price), '29.99')
        self.assertEqual(product.imageUrl, '/images/dress.jpg')


class ProductAPITests(TestCase):
    """Test the Product API endpoints"""

    def setUp(self):
        """Set up test data before each test"""
        self.client = APIClient()

        Product.objects.create(
            name='Test Product 1',
            description='First test product',
            price='10.00',
            imageUrl='/test1.jpg'
        )
        Product.objects.create(
            name='Test Product 2',
            description='Second test product',
            price='20.00',
            imageUrl='/test2.jpg'
        )

    def test_list_products_returns_200(self):
        """GET /api/products/ should return HTTP 200"""
        response = self.client.get('/api/products/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_products_returns_all_products(self):
        """GET /api/products/ should return all products in the database"""
        response = self.client.get('/api/products/')

        self.assertEqual(len(response.data), 2)

    def test_product_data_contains_required_fields(self):
        """Each product in the response should have name, price, and imageUrl"""
        response = self.client.get('/api/products/')
        product = response.data[0]

        self.assertIn('name', product)
        self.assertIn('price', product)
        self.assertIn('imageUrl', product)
