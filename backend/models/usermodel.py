from mongoengine import Document, StringField, EmailField

class User(Document):
    username = StringField(required=True, max_length=50)
    email = EmailField(required=True, unique=True)