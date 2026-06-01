from django.shortcuts import redirect
from quiz.models import Question


class ClearQuizSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Verifica se il flag del quiz è impostato nella sessione e se la richiesta non riguarda il quiz
        quiz_started_keys = [key for key in request.session.keys() if
                             key.startswith('quiz_') and key.endswith('_started')]
        quiz_started = any(quiz_started_keys)

        # Cancella i dati della sessione solo quando l'utente torna alla home page o a un'altra pagina fuori dal quiz
        if quiz_started and not request.path.startswith('/quizzes/quiz_question/') and not request.path.startswith(
                '/quizzes/quiz_summary/') and not request.path.startswith('/quizzes/start/'):

            # Trova tutti i quiz iniziati nella sessione e cancella le loro risposte
            print("Clearing quiz session data")  # Debugging
            for key in list(request.session.keys()):
                if key.startswith('quiz_') and key.endswith('_started'):
                    quiz_id = key.split('_')[1]
                    for i in range(1, Question.objects.filter(quiz_id=quiz_id).count() + 1):
                        if f'quiz_{quiz_id}_question_{i}_answers' in request.session:
                            del request.session[f'quiz_{quiz_id}_question_{i}_answers']
                    del request.session[key]

        return response
