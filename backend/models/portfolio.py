from mongoengine import Document, StringField, ListField, DictField

class Portfolio(Document):
    clerk_id = StringField(required=True, unique=True)
    template = StringField()
    primaryColor = StringField()
    secondaryColor = StringField()
    about = DictField()
    projects = ListField(DictField())
    involvement = DictField()