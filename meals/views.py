# meals/views.py

from rest_framework import viewsets, parsers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Category, SubCategory, Meal, MealHistory
from .serializers import (
     CategorySerializer,
     SubCategorySerializer,
     MealSerializer,
     MealHistorySerializer
 )

class CategoryViewSet(viewsets.ModelViewSet):
     queryset = Category.objects.all().order_by('order')
     queryset = Category.objects.all()  # order alanı sorunsuz zaten
     serializer_class = CategorySerializer
     permission_classes = [AllowAny]
     parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

class SubCategoryViewSet(viewsets.ModelViewSet):
     queryset = SubCategory.objects.all().order_by('order')
     queryset = SubCategory.objects.all()  # order alanı sorunsuz zaten
     serializer_class = SubCategorySerializer
     permission_classes = [AllowAny]
     parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

class MealViewSet(viewsets.ModelViewSet):
     queryset = Meal.objects.all().order_by('order')
     queryset = Meal.objects.all()  # order alanı eklenene kadar sıralamayı kaldırıyoruz
     serializer_class = MealSerializer
     permission_classes = [AllowAny]
     parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

class MealHistoryViewSet(viewsets.ModelViewSet):
    queryset = MealHistory.objects.all()
    serializer_class = MealHistorySerializer
    permission_classes = [AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        """
        ?meal=<id> parametresine göre filtrele. 
        Parametre yoksa tüm history’leri döner.
        """
        qs = super().get_queryset()
        meal_id = self.request.query_params.get('meal')
        if meal_id:
            qs = qs.filter(meal_id=meal_id)
        return qs

    def create(self, request, *args, **kwargs):
        """
        Eğer o yemeğe ait bir history zaten varsa, POST yerine update (PATCH) yap.
        Yoksa normal create.
        """
        meal_id = request.data.get('meal')
        # meal_id mutlaka sayı olmalı:
        try:
            meal_obj = Meal.objects.get(pk=int(meal_id))
        except Exception:
            return Response(
                {"detail": "Geçersiz veya bulunamayan meal ID."},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = MealHistory.objects.filter(meal=meal_obj).first()
        if existing:
            # var olan kaydı güncelle
            serializer = self.get_serializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        # hiç yoksa yeni yarat
        return super().create(request, *args, **kwargs)
