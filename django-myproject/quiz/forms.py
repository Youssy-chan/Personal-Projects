from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User
from django import forms
from django.forms import inlineformset_factory

from .models import Quiz, PendingEmailChange, Question, Answer
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from .models import ActivationCode
from .models import CustomUser
from django.contrib.auth.forms import PasswordChangeForm

User = get_user_model()


class CSVImportForm(forms.Form):
    csv_file = forms.FileField(label='Seleziona un file CSV')


User = get_user_model()


class EmailVerificationForm(forms.Form):
    email = forms.EmailField(required=True)


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'readonly': 'readonly'}))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Un utente con questa email è già registrato.")
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Un utente con questo username è già registrato.")
        return username


class ProfileForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'description']


class EmailChangeForm(forms.ModelForm):
    new_email = forms.EmailField(required=True)

    class Meta:
        model = PendingEmailChange
        fields = ['new_email']

    def clean_new_email(self):
        new_email = self.cleaned_data.get('new_email')
        if CustomUser.objects.filter(email=new_email).exists():
            raise forms.ValidationError("Un utente con questa email è già registrato.")
        return new_email


class PasswordChangeCustomForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['old_password'].widget.attrs.update({'class': 'form-control'})
        self.fields['new_password1'].widget.attrs.update({'class': 'form-control'})
        self.fields['new_password2'].widget.attrs.update({'class': 'form-control'})


class QuizForm(forms.ModelForm):
    class Meta:
        model = Quiz
        fields = ['name', 'description']


class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['question_type', 'text', 'points']


class AnswerForm(forms.ModelForm):
    class Meta:
        model = Answer
        fields = ['text', 'is_correct']


class MCQForm(forms.ModelForm):
    answer_1 = forms.CharField(label='Risposta 1', max_length=200)
    answer_2 = forms.CharField(label='Risposta 2', max_length=200)
    answer_3 = forms.CharField(label='Risposta 3', max_length=200, required=False)
    answer_4 = forms.CharField(label='Risposta 4', max_length=200, required=False)
    correct_answer_1 = forms.ChoiceField(label='Risposta corretta (obbligatoria)',
                                         choices=[(1, 'Risposta 1'), (2, 'Risposta 2'), (3, 'Risposta 3'),
                                                  (4, 'Risposta 4')])
    correct_answer_2 = forms.ChoiceField(label='Risposta corretta (facoltativa)',
                                         choices=[(0, 'Nessuna'), (1, 'Risposta 1'), (2, 'Risposta 2'),
                                                  (3, 'Risposta 3'), (4, 'Risposta 4')], required=False)

    class Meta:
        model = Question
        fields = ['text', 'points']

    def __init__(self, *args, **kwargs):
        super(MCQForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            answers = Answer.objects.filter(question=self.instance)
            self.fields['answer_1'].initial = answers[0].text if len(answers) > 0 else ''
            self.fields['answer_2'].initial = answers[1].text if len(answers) > 1 else ''
            self.fields['answer_3'].initial = answers[2].text if len(answers) > 2 else ''
            self.fields['answer_4'].initial = answers[3].text if len(answers) > 3 else ''
            self.initial['correct_answer_1'] = next((i + 1 for i, a in enumerate(answers) if a.is_correct), None)
            self.initial['correct_answer_2'] = next(
                (i + 1 for i, a in enumerate(answers) if a.is_correct and i + 1 != self.initial['correct_answer_1']), 0)

    def clean(self):
        cleaned_data = super().clean()
        answers = [
            cleaned_data.get('answer_1'),
            cleaned_data.get('answer_2'),
            cleaned_data.get('answer_3'),
            cleaned_data.get('answer_4'),
        ]
        correct_answer_1 = cleaned_data.get('correct_answer_1')
        correct_answer_2 = cleaned_data.get('correct_answer_2')

        if correct_answer_1 == correct_answer_2:
            raise forms.ValidationError("Le risposte corrette devono essere diverse.")

        # Filtro le risposte vuote
        cleaned_answers = [answer for answer in answers if answer]

        cleaned_data['answers'] = [{'text': answer} for answer in cleaned_answers]
        cleaned_data['correct_answers'] = [correct_answer_1]
        if correct_answer_2 != '0':
            cleaned_data['correct_answers'].append(correct_answer_2)

        return cleaned_data


class TFForm(forms.ModelForm):
    answer = forms.ChoiceField(choices=[('T', 'True'), ('F', 'False')], widget=forms.RadioSelect)

    class Meta:
        model = Question
        fields = ['text', 'points']

    def save_answers(self, question):
        Answer.objects.filter(question=question).delete()
        Answer.objects.create(
            question=question,
            text='True',
            is_correct=(self.cleaned_data['answer'] == 'T')
        )
        Answer.objects.create(
            question=question,
            text='False',
            is_correct=(self.cleaned_data['answer'] == 'F')
        )

    def save(self, commit=True):
        question = super(TFForm, self).save(commit=False)
        if commit:
            question.save()
            self.save_answers(question)
        return question


class ClozeForm(forms.ModelForm):
    correct_answer = forms.CharField(widget=forms.Textarea, required=True)

    class Meta:
        model = Question
        fields = ['text', 'points', 'correct_answer']
