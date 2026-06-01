import uuid
from random import randint  # Importa randint qui
from sqlite3 import IntegrityError

from django.forms import modelformset_factory
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate, get_user_model, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from .models import Quiz, Question, PendingEmailChange, Answer, QuizResult, QuestionResult
from .forms import QuizForm, EmailVerificationForm, ProfileForm, PasswordChangeCustomForm, EmailChangeForm, \
    QuestionForm, AnswerForm, MCQForm, TFForm, ClozeForm
from social_core.exceptions import AuthForbidden
import csv
from .forms import CSVImportForm
import logging
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .forms import CustomUserCreationForm
from .models import ActivationCode
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)


def home(request):
    if request.user.is_authenticated:
        logger.debug(f'User {request.user.username} is authenticated')
    else:
        logger.debug('User is not authenticated')

    quizzes = Quiz.objects.all()
    context = {
        'quizzes': quizzes
    }
    return render(request, 'home.html', context)


User = get_user_model()


def register_email(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if User.objects.filter(email=email).exists():
            messages.error(request, "L'email è già registrata. Effettua il login o usa un'altra email.")
            return redirect('register_email')

        code = randint(1000, 9999)  # Usa randint qui

        # Controlla se esiste già un codice di attivazione per l'email
        activation_code, created = ActivationCode.objects.update_or_create(
            email=email,
            defaults={'code': code, 'expiry': timezone.now() + timezone.timedelta(minutes=3)}
        )

        send_mail(
            'Codice di attivazione',
            f'Il tuo codice di attivazione è {code}',
            'youssefeljihad84@gmail.com',
            [email],
            fail_silently=False,
        )
        request.session['email'] = email
        return redirect('verify_email')
    return render(request, 'registration/register_email.html')


def verify_email(request):
    if 'email' not in request.session:
        messages.error(request, "Sessione scaduta. Inserisci nuovamente la tua email.")
        return redirect('register_email')

    if request.method == 'POST':
        code = request.POST.get('code')
        try:
            activation_code = ActivationCode.objects.get(code=code, email=request.session.get('email'))
            if activation_code.expiry > timezone.now():
                request.session['verified'] = True
                messages.success(request, "Email verificata con successo. Procedi con la registrazione.")
                return redirect('register_user')
            else:
                messages.error(request, "Il codice è scaduto. Richiedi un nuovo codice.")
        except ActivationCode.DoesNotExist:
            messages.error(request, "Codice non valido.")
    return render(request, 'registration/verify_email.html')


def register_user(request):
    email = request.session.get('email')
    if not email:
        messages.error(request, "Nessuna email trovata nella sessione. Si prega di registrarsi di nuovo.")
        return redirect('register_email')

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.email = email
            user.save()
            user.backend = 'django.contrib.auth.backends.ModelBackend'  # Specifica il backend qui
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            messages.success(request, "Registrazione completata con successo. Benvenuto!")
            return redirect('home')
    else:
        form = CustomUserCreationForm(initial={'email': email})

    return render(request, 'registration/register_user.html', {'form': form, 'email': email})


def resend_code(request):
    email = request.session.get('email')
    if not email:
        messages.error(request, "Nessuna email trovata nella sessione. Si prega di registrarsi di nuovo.")
        return redirect('register_email')

    code = randint(1000, 9999)

    # Aggiorna il codice di attivazione con il nuovo codice e la nuova scadenza
    activation_code, created = ActivationCode.objects.update_or_create(
        email=email,
        defaults={'code': code, 'expiry': timezone.now() + timezone.timedelta(minutes=3)}
    )

    send_mail(
        'Codice di attivazione',
        f'Il tuo nuovo codice di attivazione è {code}',
        'youssefeljihad84@gmail.com',
        [email],
        fail_silently=False,
    )
    messages.success(request, "Il codice di attivazione è stato rispedito.")
    return redirect('verify_email')


def login_view(request):
    if request.method == 'POST':
        username_or_email = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username_or_email, password=password)

        if user is None:
            # Prova a autenticare usando l'email
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if user is not None:
            login(request, user)
            if not request.POST.get('remember_me'):
                request.session.set_expiry(0)  # La sessione scade alla chiusura del browser
            messages.success(request, 'Login effettuato con successo. Bentornato!')
            return redirect('home')
        else:
            messages.error(request, 'Login fallito. Controlla username/email e password.')

    form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})


@login_required
def logout_view(request):
    logout(request)
    messages.success(request, 'Sei stato disconnesso. Arrivederci!')
    return redirect('home')


@login_required
def profile_settings(request):
    if request.method == 'POST':
        profile_form = ProfileForm(request.POST, instance=request.user)
        if profile_form.is_valid():
            profile_form.save()
            messages.success(request, 'Profilo aggiornato con successo.')
            return redirect('profile_settings')
    else:
        profile_form = ProfileForm(instance=request.user)
    return render(request, 'profile/settings.html', {'profile_form': profile_form})


def create_activation_code(email):
    # Elimina codici scaduti o duplicati
    ActivationCode.objects.filter(email=email).delete()
    code = randint(100000, 999999)
    expiry = timezone.now() + timedelta(minutes=10)
    activation_code = ActivationCode.objects.create(
        email=email,
        code=code,
        expiry=expiry
    )
    return activation_code


@login_required
def profile_change_email(request):
    global email_form
    if request.method == 'POST':
        form = EmailChangeForm(request.POST)
        if form.is_valid():
            new_email = form.cleaned_data['new_email']
            try:
                activation_code = create_activation_code(new_email)
                send_mail(
                    'Verifica la tua nuova email',
                    f'Clicca sul seguente link per verificare la tua nuova email: '
                    f'http://localhost:8000/profile/verify_new_email/{activation_code.code}/',
                    'youssefeljihad84@gmail.com',
                    [new_email],
                    fail_silently=False,
                )
                messages.success(request,
                                 'Abbiamo inviato un link di verifica alla tua nuova email. Per favore verifica la '
                                 'tua email.')
            except IntegrityError:
                messages.error(request,
                               'Si è verificato un errore durante l\'aggiornamento della tua email. Per favore riprova.')
            return redirect('profile_change_email')
    else:
        email_form = EmailChangeForm(instance=request.user)
    return render(request, 'profile/change_email.html', {'email_form': email_form})


@login_required
def profile_change_password(request):
    if request.method == 'POST':
        password_form = PasswordChangeCustomForm(user=request.user, data=request.POST)
        if password_form.is_valid():
            user = password_form.save()
            update_session_auth_hash(request, user)  # Aggiorna la sessione con la nuova password
            messages.success(request, 'Password aggiornata con successo.')
            return redirect('profile_change_password')
    else:
        password_form = PasswordChangeCustomForm(user=request.user)
    return render(request, 'profile/change_password.html', {'password_form': password_form})


@login_required
def profile_delete_account(request):
    if request.method == 'POST':
        user = request.user
        user.delete()
        messages.success(request, 'Account eliminato con successo.')
        return redirect('home')
    return render(request, 'profile/delete_account.html')


@login_required
def verify_new_email(request, code):
    try:
        pending_email_change = get_object_or_404(PendingEmailChange, code=code)
        if pending_email_change.is_expired():
            messages.error(request, 'Il codice di verifica è scaduto.')
        else:
            user = pending_email_change.user
            user.email = pending_email_change.new_email
            user.save()
            pending_email_change.delete()
            messages.success(request, 'La tua email è stata aggiornata con successo.')
    except PendingEmailChange.DoesNotExist:
        messages.error(request, 'Il codice di verifica non è valido.')

    return redirect('profile_settings')


@login_required
def quiz_detail(request, pk):
    quiz = get_object_or_404(Quiz, pk=pk)
    return render(request, 'quiz/quiz_detail.html', {'quiz': quiz})


@login_required
def quiz_question(request, quiz_id, question_index):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = Question.objects.filter(quiz=quiz)
    total_questions = questions.count()

    if question_index < 1 or question_index > total_questions:
        return redirect('quiz_detail', quiz_id=quiz.id)

    question = questions[question_index - 1]

    if question.question_type == 'TF':
        true_answer = question.answers.get(text='True').id
        false_answer = question.answers.get(text='False').id
    else:
        true_answer = false_answer = None

    if request.method == 'POST':
        if request.method == 'POST':
            selected_answers = request.POST.getlist('answers')  # Ottieni le risposte selezionate
            request.session[f'quiz_{quiz_id}_question_{question.id}_answers'] = selected_answers  # Salva nella sessione
            request.session[f'quiz_{quiz_id}_started'] = True  # Imposta il flag per indicare che il quiz è iniziato

        if 'next' in request.POST:
            if question_index < total_questions:
                return redirect('quiz_question', quiz_id=quiz.id, question_index=question_index + 1)
            else:
                return redirect('quiz_summary', quiz_id=quiz.id)
        elif 'back' in request.POST:
            if question_index > 1:
                return redirect('quiz_question', quiz_id=quiz.id, question_index=question_index - 1)

    # Recupera le risposte salvate dalla sessione
    stored_answers = request.session.get(f'quiz_{quiz_id}_question_{question.id}_answers', [])

    return render(request, 'quiz/quiz_question.html', {
        'quiz': quiz,
        'question': question,
        'question_index': question_index,
        'total_questions': total_questions,
        'stored_answers': stored_answers,
        'true_answer': true_answer,
        'false_answer': false_answer,
    })


@login_required
def quiz_summary(request, quiz_id):
    quiz = get_object_or_404(Quiz, pk=quiz_id)
    questions = Question.objects.filter(quiz=quiz)
    results = []

    total_score = 0
    max_score = 0

    # Crea un nuovo risultato del quiz per ogni tentativo
    quiz_result = QuizResult.objects.create(
        user=request.user,
        quiz=quiz,
        total_score=0,  # Inizializza con 0, verrà aggiornato più tardi
        max_score=0
    )

    for question in questions:
        selected_answers = request.session.get(f'quiz_{quiz_id}_question_{question.id}_answers', [])
        correct_answers = question.answers.filter(is_correct=True)

        if all(answer.strip() == "" for answer in selected_answers):
            selected_answers = []

        result = {
            'question': question,
            'selected_answers': selected_answers,
            'correct_answers': correct_answers,
            'is_correct': False,
            'is_blank': False,
            'assigned_score': 0
        }

        max_score += question.points

        if not selected_answers:
            result['is_blank'] = True
        elif question.question_type == 'MCQ' or question.question_type == 'TF':
            correct_ids = correct_answers.values_list('id', flat=True)
            if set(map(int, selected_answers)) == set(correct_ids):
                result['is_correct'] = True
                result['assigned_score'] = question.points
                total_score += question.points
            else:
                result['assigned_score'] = -question.points
                total_score -= question.points
        elif question.question_type == 'CLOZE':
            if selected_answers and correct_answers:
                if selected_answers[0].strip().lower() == correct_answers[0].text.strip().lower():
                    result['is_correct'] = True
                    result['assigned_score'] = question.points
                    total_score += question.points
                else:
                    result['assigned_score'] = -question.points
                    total_score -= question.points
            else:
                result['is_blank'] = True

        # Salva il risultato per ogni domanda
        QuestionResult.objects.create(
            quiz_result=quiz_result,
            question=question,
            selected_answers=selected_answers,
            correct_answers=list(correct_answers.values_list('text', flat=True)),
            is_correct=result['is_correct'],
            is_blank=result['is_blank'],
            assigned_score=result['assigned_score']
        )
        results.append(result)

    # Impedisci che il punteggio totale vada sotto zero
    total_score = max(total_score, 0)

    # Aggiorna il risultato del quiz
    quiz_result.total_score = total_score
    quiz_result.max_score = max_score
    quiz_result.save()

    # Pulisci la sessione per evitare che i dati del quiz rimangano salvati
    clear_quiz_session(request)

    return render(request, 'quiz/quiz_summary.html', {
        'quiz': quiz,
        'results': results,
        'total_score': total_score,
        'max_score': max_score
    })


def clear_quiz_session(request):
    # Trova tutte le chiavi nella sessione relative al quiz
    quiz_keys = [key for key in request.session.keys() if key.startswith('quiz_')]
    for key in quiz_keys:
        del request.session[key]

    # Ridireziona alla homepage dopo aver pulito la sessione
    return redirect('home')


@login_required
def my_quizzes(request):
    quizzes = Quiz.objects.filter(author=request.user)  # Filtra i quiz creati dall'utente
    return render(request, 'profile/my_quizzes.html', {'quizzes': quizzes})


@login_required
def quiz_history(request):
    # Recupera i risultati del quiz per l'utente corrente, escludendo quelli senza risposte valide
    quiz_results = QuizResult.objects.filter(user=request.user).exclude(total_score=0).order_by('-completed_at')

    return render(request, 'profile/quiz_history.html', {
        'quiz_results': quiz_results
    })


@login_required
def clear_quiz_history(request):
    # Rimuovi tutti i risultati del quiz dell'utente corrente
    QuizResult.objects.filter(user=request.user).delete()
    messages.success(request, 'Cronologia dei quiz svuotata con successo.')
    return redirect('quiz_history')


@login_required
def view_quiz_summary(request, result_id):
    # Recupera il risultato del quiz specifico
    result = get_object_or_404(QuizResult, id=result_id, user=request.user)

    question_result_list = []

    for question_result in result.question_results.all():
        selected_answer_texts = []

        if question_result.question.question_type == 'CLOZE':
            # Se è una domanda CLOZE, non cerchiamo un ID, ma trattiamo la risposta come testo
            selected_answer_texts = question_result.selected_answers  # Risposte già in formato testo
        else:
            # Per le altre domande (MCQ, TF), recupera il testo delle risposte tramite gli ID
            for answer_id in question_result.selected_answers:
                try:
                    answer = Answer.objects.get(id=answer_id)
                    selected_answer_texts.append(answer.text)
                except Answer.DoesNotExist:
                    print(f"Answer with id {answer_id} not found!")

        # Aggiungi le risposte testuali come attributo al question_result
        question_result.selected_answer_texts = selected_answer_texts
        # Crea un dizionario per contenere i dettagli di ogni `question_result`
        question_result_list.append({
            'question_text': question_result.question.text,
            'selected_answer_texts': selected_answer_texts,
            'correct_answers': question_result.correct_answers,
            'is_correct': question_result.is_correct,
            'is_blank': question_result.is_blank,
            'assigned_score': question_result.assigned_score
        })

    return render(request, 'profile/view_quiz_summary.html', {
        'result': result,
        'question_result_list': question_result_list  # Passiamo la nuova lista al template
    })


@login_required
def edit_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id, author=request.user)

    if request.method == "POST":
        quiz_form = QuizForm(request.POST, instance=quiz)  # Usa l'istanza esistente del quiz
        if quiz_form.is_valid():
            quiz = quiz_form.save(commit=False)
            quiz.author = request.user
            quiz.save()
            request.session['quiz_id'] = quiz.id
            return redirect('add_question', quiz_id=quiz.id)
    else:
        quiz_form = QuizForm(instance=quiz)  # Precompila il form con i dati del quiz esistente

    return render(request, 'profile/edit_quiz.html', {
        'quiz_form': quiz_form,
        'quiz': quiz,  # Passa l'oggetto quiz al template
    })


@login_required
def delete_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id, author=request.user)
    quiz.delete()
    return redirect('my_quizzes')  # Torna alla lista dei quiz dopo l'eliminazione


@login_required
def quiz_options(request):
    return render(request, 'quiz/quiz_options.html')


@login_required
def import_quiz(request):
    if request.method == 'POST':
        form = CSVImportForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['csv_file']
            reader = csv.reader(csv_file.read().decode('utf-8').splitlines())
            next(reader)  # Salta l'intestazione del CSV

            quiz_map = {}

            for row in reader:
                quiz_name = row[0]  # Nome del 'quiz_name'
                quiz_description = row[1]
                question_text = row[2]
                question_type = row[3]
                points = int(row[9])  # Assicurati che i punti siano gestiti correttamente come intero

                # Ottieni o crea il quiz
                if quiz_name not in quiz_map:
                    quiz, created = Quiz.objects.get_or_create(
                        name=quiz_name,
                        description=quiz_description,
                        author=request.user  # Assegna l'autore all'utente autenticato
                    )
                    quiz_map[quiz_name] = quiz
                else:
                    quiz = quiz_map[quiz_name]

                # Crea la domanda
                question = Question.objects.create(
                    quiz=quiz,
                    text=question_text,
                    question_type=question_type,
                    points=points
                )

                # Crea le risposte in base al tipo di domanda
                if question_type == 'MCQ':
                    answers = [row[4], row[5], row[6], row[7]]
                    correct_answer_index = int(row[8]) - 1  # Converti l'indice a base 1 in base 0
                    for i, answer_text in enumerate(answers):
                        if answer_text:
                            is_correct = (i == correct_answer_index)
                            Answer.objects.create(question=question, text=answer_text, is_correct=is_correct)

                elif question_type == 'TF':
                    correct_answer = row[8].lower() == 'true'
                    Answer.objects.create(question=question, text='True', is_correct=correct_answer)
                    Answer.objects.create(question=question, text='False', is_correct=not correct_answer)

                elif question_type == 'CLOZE':
                    correct_answer = row[8]
                    Answer.objects.create(question=question, text=correct_answer, is_correct=True)

            messages.success(request, 'Dati importati con successo!')
            return redirect('home')
        else:
            messages.error(request, 'Il form non è valido. Controlla il file selezionato.')
    else:
        form = CSVImportForm()

    return render(request, 'quiz/import_quiz.html', {'form': form})


@login_required
def create_quiz(request):
    if request.method == "POST":
        quiz_form = QuizForm(request.POST)
        if quiz_form.is_valid():
            quiz = quiz_form.save(commit=False)
            quiz.author = request.user
            quiz.save()
            request.session['quiz_id'] = quiz.id
            return redirect('add_question', quiz_id=quiz.id)
    else:
        quiz_form = QuizForm()

    return render(request, 'quiz/create_quiz.html', {
        'quiz_form': quiz_form,
    })


@login_required
def add_question(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)

    if request.method == 'POST':
        question_type = request.POST.get('question_type')
        if question_type == 'MCQ':
            return redirect('add_mcq_question', quiz_id=quiz.id)
        elif question_type == 'TF':
            return redirect('add_tf_question', quiz_id=quiz.id)
        elif question_type == 'CLOZE':
            return redirect('add_cloze_question', quiz_id=quiz.id)
        # Aggiungi ulteriori condizionali per altri tipi di domande

    questions = Question.objects.filter(quiz=quiz)
    return render(request, 'quiz/add_question.html', {'quiz': quiz, 'questions': questions})


@login_required
def add_mcq_question(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)

    if request.method == 'POST':
        form = MCQForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.quiz = quiz
            question.question_type = 'MCQ'
            question.save()
            answers = form.cleaned_data['answers']
            correct_answer_1 = int(request.POST.get('correct_answer_1'))
            correct_answer_2 = request.POST.get('correct_answer_2')
            correct_answer_2 = int(correct_answer_2) if correct_answer_2 else None

            for idx, answer in enumerate(answers, start=1):
                is_correct = idx == correct_answer_1 or idx == correct_answer_2
                Answer.objects.create(
                    question=question,
                    text=answer['text'],
                    is_correct=is_correct
                )
            return redirect('add_question', quiz_id=quiz.id)
    else:
        form = MCQForm()

    return render(request, 'quiz/add_mcq_question.html', {'form': form, 'quiz': quiz})


@login_required
def add_tf_question(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)

    if request.method == 'POST':
        form = TFForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.quiz = quiz
            question.question_type = 'TF'
            question.save()
            form.save_answers(question)  # Salva le risposte
            return redirect('add_question', quiz_id=quiz.id)
    else:
        form = TFForm()

    return render(request, 'quiz/add_tf_question.html', {'form': form, 'quiz': quiz})


@login_required
def add_cloze_question(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)

    if request.method == 'POST':
        form = ClozeForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.quiz = quiz
            question.question_type = 'CLOZE'
            question.save()
            # Salva la risposta corretta
            Answer.objects.create(
                question=question,
                text=form.cleaned_data['correct_answer'],
                is_correct=True
            )
            return redirect('add_question', quiz_id=quiz.id)
    else:
        form = ClozeForm()

    return render(request, 'quiz/add_cloze_question.html', {'form': form, 'quiz': quiz})


@login_required
def edit_mcq_question(request, question_id):
    question = get_object_or_404(Question, id=question_id)

    if request.method == 'POST':
        form = MCQForm(request.POST, instance=question)
        if form.is_valid():
            question = form.save(commit=False)
            question.save()

            # Elimina le risposte esistenti e aggiungi quelle nuove
            Answer.objects.filter(question=question).delete()
            answers = form.cleaned_data['answers']
            correct_answers = form.cleaned_data['correct_answers']

            for idx, answer in enumerate(answers, start=1):
                is_correct = str(idx) in correct_answers
                Answer.objects.create(
                    question=question,
                    text=answer['text'],
                    is_correct=is_correct
                )
            return redirect('add_question', quiz_id=question.quiz.id)
        else:
            print(form.errors)  # Debug per errori di form
    else:
        form = MCQForm(instance=question)

    return render(request, 'quiz/edit_mcq_question.html', {'form': form, 'question': question})


@login_required
def edit_tf_question(request, question_id):
    question = get_object_or_404(Question, id=question_id)

    if request.method == 'POST':
        form = TFForm(request.POST, instance=question)
        if form.is_valid():
            form.save()
            return redirect('add_question', quiz_id=question.quiz.id)
    else:
        form = TFForm(instance=question)
        correct_answer = question.answers.get(is_correct=True).text
        form.initial['answer'] = 'T' if correct_answer == 'True' else 'F'

    return render(request, 'quiz/edit_tf_question.html', {'form': form, 'question': question})


@login_required
def edit_cloze_question(request, question_id):
    question = get_object_or_404(Question, id=question_id)

    if request.method == 'POST':
        form = ClozeForm(request.POST, instance=question)
        if form.is_valid():
            question = form.save(commit=False)
            question.save()
            # Aggiorna la risposta corretta
            Answer.objects.filter(question=question, is_correct=True).delete()
            Answer.objects.create(
                question=question,
                text=form.cleaned_data['correct_answer'],
                is_correct=True
            )
            return redirect('add_question', quiz_id=question.quiz.id)
    else:
        form = ClozeForm(instance=question)

    return render(request, 'quiz/edit_cloze_question.html', {'form': form, 'question': question})


@login_required
def delete_question(request, question_id):
    question = get_object_or_404(Question, id=question_id)
    quiz_id = question.quiz.id
    question.delete()
    return redirect('add_question', quiz_id=quiz_id)


@login_required
def save_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    quiz.save()
    return redirect('home')
