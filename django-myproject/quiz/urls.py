from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # La homepage
    #path('quizzes/', views.quiz_list, name='quiz_list'),  # La vista principale dei quiz
    #path('quizzes/<int:quiz_id>/', views.quiz_detail, name='quiz_detail'),  # Vista dei dettagli del quiz
    #path('quizzes/create/', views.create_quiz, name='create_quiz'),  # Creazione dei quiz

    # URL per il reset della password
    path('password_reset/', auth_views.PasswordResetView.as_view(template_name='registration/password_reset/password_reset_form.html'), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='registration/password_reset/password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='registration/password_reset/password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset/password_reset_complete.html'), name='password_reset_complete'),

    # Include profile URLs
    path('profile/', include('quiz.profile_urls')),
    path('quiz-options/', views.quiz_options, name='quiz_options'),
    path('import-quiz/', views.import_quiz, name='import_quiz'),
    path('create_quiz/', views.create_quiz, name='create_quiz'),
    #path('add_question/', views.add_question, name='add_question'),
    path('add_question/<int:quiz_id>/', views.add_question, name='add_question'),
    path('add_mcq_question/<int:quiz_id>/', views.add_mcq_question, name='add_mcq_question'),
    path('add_tf_question/<int:quiz_id>/', views.add_tf_question, name='add_tf_question'),  # Aggiungi questa linea
    path('add_cloze_question/<int:quiz_id>/', views.add_cloze_question, name='add_cloze_question'),

    path('edit_mcq_question/<int:question_id>/', views.edit_mcq_question, name='edit_mcq_question'),
    path('edit_tf_question/<int:question_id>/', views.edit_tf_question, name='edit_tf_question'),
    path('edit_cloze_question/<int:question_id>/', views.edit_cloze_question, name='edit_cloze_question'),
    path('delete_question/<int:question_id>/', views.delete_question, name='delete_question'),
    path('save_quiz/<int:quiz_id>/', views.save_quiz, name='save_quiz'),  # Aggiungi questa linea

    path('quiz_detail/<int:pk>/', views.quiz_detail, name='quiz_detail'),
    path('quiz_question/<int:quiz_id>/<int:question_index>/', views.quiz_question, name='quiz_question'),
    path('quiz_summary/<int:quiz_id>/', views.quiz_summary, name='quiz_summary'),
    path('clear_quiz_session/', views.clear_quiz_session, name='clear_quiz_session'),

    # altre rotte

    #path('add_answer/<int:question_id>/', views.add_answer, name='add_answer'),
    path('quiz_detail/<int:pk>/', views.quiz_detail, name='quiz_detail'),  # Aggiungi questo


]