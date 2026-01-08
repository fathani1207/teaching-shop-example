from django.contrib import admin

from .models import Product, SiteSettings

admin.site.register(Product)
@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('orders_enabled',)