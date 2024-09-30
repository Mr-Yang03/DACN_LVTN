from pymongo import MongoClient

MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.2ttyec7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)

db = client["traffic-monitor"]
user_collection = db["user"]
user_collection.drop()

users_data = [
    {
        "username": "janedoe",
        "email": "janedoe@example.com",
        "password": "123",
        "role": "user"
    },
    {
        "username": "alice",
        "email": "alice@example.com",
        "password": "123",
        "role": "user"
    }
]

user_collection.insert_many(users_data)
print("Multiple users added successfully!")

for user in user_collection.find():
    print(user)
