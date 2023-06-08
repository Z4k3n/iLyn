import sys
import json
import random
import re
import pywhatkit
import datetime
import spacy
import wikipediaapi
import requests
import dateparser

nlp = spacy.load("en_core_web_sm")
wiki_wiki = wikipediaapi.Wikipedia('en')


def greeting():
    responses = ["Hello!", "Hi!", "Hey there!"]
    return get_random_response(responses)


def get_current_datetime():
    current_datetime = datetime.datetime.now()
    date = current_datetime.strftime("%A, %d %B %Y")
    time = current_datetime.strftime("%H:%M:%S")
    response = f"Today is {date}. The current time is {time}."
    return response


def exit():
    responses = ["Goodbye!", "See you later!", "Take care!"]
    return get_random_response(responses)


def search_youtube(query):
    pywhatkit.playonyt(query)
    response = "Searching YouTube for: " + query
    return response


def search_wikipedia(topic):
    page = wiki_wiki.page(topic)
    if page.exists():
        paragraphs = page.text.split('\n')
        first_paragraph = paragraphs[0] if paragraphs else ""
        response = f"Here's what I found about {topic}:\n\n{first_paragraph}"
    else:
        response = f"Sorry, I couldn't find any information about {topic} on Wikipedia."
    return response


# Carga el archivo JSON de intenciones
with open('intents.json') as file:
    intents = json.load(file)['intents']


def create_task(message):
    task_title = extract_task_title(message)
    task_description = extract_task_description(message)
    task_due_date = extract_task_due_date(message)

    if task_title:
        task_data = {
            "title": task_title,
            "description": task_description,
            "duedate": task_due_date.strftime("%Y-%m-%d") if task_due_date else None
        }

        # Llamar al método del servidor.js para guardar la tarea
        response = requests.post(
            'http://localhost:3000/saveTask', json=task_data)

        if response.status_code == 200:
            return "Reminder added successfully! Don't forget to refresh the page to see changes."
        else:
            return "Sorry, I failed to create that reminder 2."
    else:
        return "Sorry, I failed to create that reminder."


def extract_task_title(message):
    doc = nlp(message)
    for ent in doc.ents:
        if ent.label_ == "TASK":
            return ent.text
    return "Reminder"


def extract_task_description(message):
    doc = nlp(message)

    verbs = [token for token in doc if token.pos_ == "VERB"]
    entities = [ent for ent in doc.ents if ent.label_ == "DATE"]

    if verbs and entities:
        verb_indices = [verb.i for verb in verbs]
        entity_indices = [entity.start for entity in entities]

        # Encuentra el índice del verbo más cercano a la entidad de fecha
        closest_verb_index = min(verb_indices, key=lambda x: min(
            abs(x - e) for e in entity_indices))

        # Construye la descripción utilizando los tokens entre el verbo más cercano y la entidad de fecha
        description_tokens = [
            token.text for token in doc[closest_verb_index + 1: entity_indices[0]] if not token.is_punct]
        if description_tokens:
            # Convertir el primer carácter en mayúscula
            description_tokens[0] = description_tokens[0].capitalize()
        description = " ".join(description_tokens)
        return description.strip()
    return ""


def extract_task_due_date(message):
    doc = nlp(message)
    for ent in doc.ents:
        if ent.label_ == "DATE":
            return parse_date(ent.text)
    return None


def parse_date(date_string):
    # Remover palabras no deseadas y caracteres especiales
    text = date_string.replace("next", "").strip()

    # Obtener el día de la semana actual
    current_day_of_week = datetime.datetime.now().date().weekday()

    # Intentar analizar la fecha utilizando dateparser
    parsed_date = dateparser.parse(text)

    if parsed_date:
        # Verificar si la fecha es anterior al día actual y ajustarla en consecuencia
        if parsed_date.date() < datetime.date.today():
            parsed_day_of_week = parsed_date.date().weekday()

            # Calcular la diferencia en días hasta el próximo día de la semana especificado
            days_difference = (parsed_day_of_week - current_day_of_week) % 7

            # Sumar la diferencia en días más una semana para obtener la fecha futura
            parsed_date += datetime.timedelta(days=days_difference + 7)

        return parsed_date.date()

    # Intentar analizar la fecha utilizando los formatos conocidos
    known_formats = ["%Y-%m-%d", "%d/%m/%Y"]

    for format in known_formats:
        try:
            parsed_date = datetime.datetime.strptime(
                date_string, format).date()
            return parsed_date
        except ValueError:
            pass

    return None


# Función para obtener una respuesta aleatoria de la lista de respuestas
def get_random_response(responses):
    return random.choice(responses)


def get_suggestion():
    suggestions = [
        "Organize your workspace.",
        "Make a to-do list for the day.",
        "Take a short break and stretch.",
        "Read a book or an article.",
        "Learn something new online.",

        "Do a quick workout or exercise.",
        "Try a new hobby or activity.",
        "Write in a journal or start a blog.",
        "Listen to your favorite music or podcast.",
        "Connect with a friend or family member."
    ]
    return random.choice(suggestions)


def extract_location(message):
    doc = nlp(message)
    for ent in doc.ents:
        if ent.label_ == "GPE":
            return ent.text
    return ""


def get_response(message):
    doc = nlp(message)
    for intent in intents:
        intent_tag = intent['tag']
        if intent_tag == "thanks":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    return mappings[intent_tag]()
        elif intent_tag == "greeting":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    return mappings[intent_tag]()
        elif intent_tag == "exit":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    return mappings[intent_tag]()
        elif intent_tag == "get_suggestion":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    return mappings[intent_tag]()
        elif intent_tag == "get_datetime":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    return mappings[intent_tag]()

    # Luego de verificar los intents que no funcionan, verificar los que sí funcionan
    for intent in intents:
        intent_tag = intent['tag']
        if intent_tag == "search_wikipedia":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    topic = extract_topic(message)
                    if topic:
                        return mappings[intent_tag](topic)
        elif intent_tag == "search_youtube":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    return mappings[intent_tag](message)

        elif intent_tag == "get_weather":
            location = extract_location(message)
            if location:
                return mappings[intent_tag](location)
        elif intent_tag == "create_task":
            for pattern in intent['patterns']:
                if is_matching_pattern(pattern, doc):
                    return mappings[intent_tag](message)

    return "I'm sorry, I don't understand."


def is_matching_pattern(pattern, doc):
    pattern_tokens = nlp(pattern)
    for token in pattern_tokens:
        if token.is_alpha and not token.is_stop:
            if not any(token.text.lower() == t.text.lower() for t in doc):
                return False
    return True


def extract_topic(message):
    keyword_pattern = re.compile(
        r"(?:search|look up|find)\s(?:on\s)?(?:Wikipedia\s)?(?:for)?\s(.+)", re.IGNORECASE)
    match = re.search(keyword_pattern, message)
    if match:
        return match.group(1).strip()
    return ""


def handle_thanks():
    responses = ["You're welcome!", "No problem!",
                 "Glad I could help!", "Anytime!"]
    return get_random_response(responses)


def get_weather(location):
    # Realiza una solicitud a la API de OpenWeather para obtener el clima en la ubicación especificada
    response = requests.get(
        f'http://api.openweathermap.org/data/2.5/weather?q={location}&appid=42e813bdf1a0a11a3e749c63509fa366')
    data = response.json()

    if response.status_code == 200:
        if 'weather' in data and len(data['weather']) > 0:
            weather_description = data['weather'][0]['description']
            temperature = data['main']['temp']
            temperature_celsius = temperature - 273.15  # Conversión de Kelvin a Celsius
            response = f"The weather in {location} is {weather_description}. The temperature is {temperature_celsius:.2f}°C."
        else:
            response = f"Sorry, I couldn't fetch the weather information for {location}."
    else:
        response = f"Sorry, an error occurred while fetching the weather information."

    return response


mappings = {
    "greeting": greeting,
    "exit": exit,
    "search_youtube": search_youtube,
    "search_wikipedia": search_wikipedia,
    "get_datetime": get_current_datetime,
    "create_task": create_task,
    "thanks": handle_thanks,
    "get_weather": get_weather,
    "get_suggestion": get_suggestion
}


# Obtiene el mensaje del argumento proporcionado por Node.js
message = sys.argv[1]

# Obtiene la respuesta en base al mensaje recibido
response = get_response(message)

# Imprime la respuesta para que Node.js la pueda capturar
print(response)
