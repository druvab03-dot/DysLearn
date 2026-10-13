"""Canonical English assessment passages, excluding parent instructions."""
import re

ASSESSMENT_TEXTS = {
    1: """I have a little dog.
His name is Bruno.
He likes to run and play in the park.
He has a big brown ball.
Every day, I play with him near my home.""",
    2: """Every morning, I pack my school bag.
I walk to school with my friends.
My best friend sits beside me in class.
We read books, write words, and draw pictures.
During lunch, we share food and play together.""",
    3: """One sunny morning, Rahul found a small puppy.
It was sitting near a big tree.
The puppy looked tired and hungry.
Rahul gave it some bread and water.
He asked his friends to help find its owner.
Soon, a little boy came running towards them.
He was happy to see his puppy again.""",
    4: """Our school has a beautiful garden.
It is filled with green plants and colourful flowers.
Every Friday, our class waters the plants.
We remove weeds and keep the garden clean.
Butterflies and bees often visit the flowers.
Our teacher says plants need sunlight, air, and water.
We work together to protect every living thing.""",
    5: """Ananya loved science and enjoyed building things.
One day, she decided to make a small windmill.
She collected cardboard, wooden sticks, and plastic bottles.
Her first model did not work properly.
She checked each part and tried again.
After several changes, the blades began to spin.
Her teacher praised her patience and creativity.
She learned that mistakes can help us succeed.""",
}


def get_assessment_text(class_number: int) -> str:
    try:
        return ASSESSMENT_TEXTS[int(class_number)]
    except (KeyError, TypeError, ValueError):
        raise ValueError("class_number must be between 1 and 5")


def get_assessment_words(class_number: int) -> list[str]:
    """Return words in passage order; punctuation is excluded from letter crops."""
    return re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?", get_assessment_text(class_number))
