# quiz/models.py
from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser, Group, Permission
import uuid
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


class ActivationCode(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6)
    expiry = models.DateTimeField()

    def __str__(self):
        return f'{self.email} - {self.code}'


class CustomUser(AbstractUser):
    email_confirmed = models.BooleanField(default=False)
    description = models.TextField(max_length=300, blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name='user',
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='user',
    )


class PendingEmailChange(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    new_email = models.EmailField(unique=True)
    code = models.CharField(max_length=6)
    expiry = models.DateTimeField()

    def is_expired(self):
        return self.expiry < timezone.now()


class Quiz(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Question(models.Model):
    QUIZ_TYPES = [
        ('MCQ', 'Multiple Choice Question'),
        ('TF', 'True/False'),
        ('CLOZE', 'Cloze Question'),
    ]

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=10, choices=QUIZ_TYPES)
    text = models.TextField()
    correct_answer = models.TextField(blank=True)
    points = models.IntegerField(default=1)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class QuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    total_score = models.IntegerField()
    max_score = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.quiz.name}"


class QuestionResult(models.Model):
    quiz_result = models.ForeignKey(QuizResult, on_delete=models.CASCADE, related_name='question_results')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answers = models.JSONField(default=list)  # Usa JSONField per una lista di risposte selezionate
    correct_answers = models.JSONField(default=list)  # Usa JSONField per una lista di risposte corrette
    is_correct = models.BooleanField(default=False)
    is_blank = models.BooleanField(default=False)
    assigned_score = models.IntegerField(default=0)

    def __str__(self):
        return f"Result for {self.question.text} - Correct: {self.is_correct}"
