from django import template

from quiz.models import Answer

register = template.Library()


@register.filter
def get_item(dictionary, key):
    if isinstance(dictionary, dict):
        return dictionary.get(key)
    return None


@register.filter
def chr_filter(value):
    return chr(value)


@register.filter
def get_answer_by_id(question, answer_id):
    try:
        return question.answers.get(id=answer_id).text
    except Answer.DoesNotExist:
        return None


@register.filter
def get_answer_text(question, is_correct):
    try:
        return question.answers.get(is_correct=is_correct).text
    except Answer.DoesNotExist:
        return None


@register.filter
def any_non_empty(answers):
    """Verifica se c'è almeno una risposta non vuota."""
    return any(answer.strip() != "" for answer in answers)
