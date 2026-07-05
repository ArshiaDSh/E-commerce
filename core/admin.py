from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Order, OrderItem

# Customizing how Products display in the admin list view
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'inventory', 'category', 'created_at']
    list_editable = ['price', 'inventory']
    prepopulated_fields = {'slug': ('name',)} # Automatically types the slug as you type the name
    search_fields = ['name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    prepopulated_fields = {'slug': ('name',)}

# Inline layouts let you see items directly inside the parent order page
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    raw_id_fields = ['product']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'created_at']
    list_filter = ['status']
    inlines = [OrderItemInline]

# Registering cart models for quick debugging if needed
admin.site.register(Cart)
admin.site.register(CartItem)