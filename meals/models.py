from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    order = models.PositiveIntegerField(default=0)
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        help_text="Kategori için görsel yükleme alanı."
    )

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    image = models.ImageField(
        upload_to='subcategories/',
        blank=True,
        null=True,
        help_text="Alt kategori için görsel yükleme alanı."
    )
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Meal(models.Model):
    sub_category = models.ForeignKey(
        SubCategory, on_delete=models.CASCADE, related_name='meals',
        null=True, blank=True
    )
    name = models.CharField(max_length=200)
    konu_anlatimi = models.TextField(
        help_text="Yemeğin malzemeleri ve yapılışı gibi detaylı açıklama."
    )
    mevzuat = models.TextField(
        blank=True, null=True,
        help_text="Yemeğin tarihçesi veya ilginç bilgileri."
    )
    image = models.ImageField(
        upload_to='meals/',
        blank=True, null=True,
        help_text="Yemek için görsel (fotoğraf) yükleme alanı."
    )
    fiyat = models.DecimalField(
        max_digits=8, decimal_places=2,
        help_text="Yemeğin eklenme anındaki fiyat bilgisi."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name



class MealHistory(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name="histories")
    content = models.TextField()   # zengin metin HTML/MARKDOWN olarak
    attachments = models.FileField(upload_to="meal_history_files/", blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)