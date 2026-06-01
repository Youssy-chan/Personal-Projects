from django.urls import path
from . import views
from .views import my_quizzes, quiz_history, view_quiz_summary, edit_quiz, delete_quiz

urlpatterns = [
    path('settings/', views.profile_settings, name='profile_settings'),
    path('change_email/', views.profile_change_email, name='profile_change_email'),
    path('change_password/', views.profile_change_password, name='profile_change_password'),
    path('delete_account/', views.profile_delete_account, name='profile_delete_account'),
    path('verify_new_email/<int:code>/', views.verify_new_email, name='verify_new_email'),

    path('profile/my-quizzes/', my_quizzes, name='my_quizzes'),
    path('profile/edit-quiz/<int:quiz_id>/', edit_quiz, name='edit_quiz'),  # Aggiungi questo URL
    path('profile/delete-quiz/<int:quiz_id>/', delete_quiz, name='delete_quiz'),
    path('profile/quiz-history/', quiz_history, name='quiz_history'),
    path('profile/view-quiz-summary/<int:result_id>/', view_quiz_summary, name='view_quiz_summary'),
    path('profile/clear-quiz-history/', views.clear_quiz_history, name='clear_quiz_history'),
]
