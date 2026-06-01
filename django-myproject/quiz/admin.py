from django.contrib import admin
from .models import Quiz, Question, Answer
from .forms import MCQForm, TFForm, ClozeForm


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 1


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'question_type', 'quiz', 'points')
    list_filter = ('quiz', 'question_type')

    def get_form(self, request, obj=None, **kwargs):
        if obj:
            if obj.question_type == 'MCQ':
                self.form = MCQForm
            elif obj.question_type == 'TF':
                self.form = TFForm
            elif obj.question_type == 'CLOZE':
                self.form = ClozeForm
        return super().get_form(request, obj, **kwargs)


class QuizAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at', 'author')
    list_filter = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    search_fields = ('name', 'description')


admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer)
