from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

# Membuat instance chatbot
chatbot = ChatBot('Ron Obvius')

# Menyiapkan percakapan untuk latihan
conversation = [
    'Hello, how are you?',
    'I am doing great.',
    'What is your name?',
    'My name is Ron Obvius.'
]

# Melatih chatbot (opsional tapi disarankan agar bot pintar)
trainer = ListTrainer(chatbot)
trainer.train(conversation)

# Mendapatkan satu respon
response = chatbot.get_response('What is your name?')
print(response)