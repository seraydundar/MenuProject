from rest_framework import serializers
from .models import Category, SubCategory, Meal, MealHistory

class MealSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = Meal
        fields = [
            'id', 'sub_category', 'name', 'konu_anlatimi', 'mevzuat',
            'image', 'fiyat', 'created_at', 'order'
        ]

class SubCategorySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    meals = MealSerializer(many=True, read_only=True)

    class Meta:
        model = SubCategory
        fields = ['id', 'category', 'name', 'order', 'image', 'meals']

class CategorySerializer(serializers.ModelSerializer):
    # tersine ilişkiden subcategory objelerini almak için:
    subcategories = SubCategorySerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Category
        fields = ['id', 'name', 'order', 'image', 'subcategories']



class MealHistorySerializer(serializers.ModelSerializer):
    # attachments artık zorunlu değil, tek dosya olarak geliyor
    attachments = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = MealHistory
        fields = ["id", "meal", "content", "attachments", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]

