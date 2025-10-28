import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface SurveyQuestion {
    id: string;
    question: string;
    type: 'likert' | 'text';
    required: boolean;
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
    { id: 'satisfaccion', question: '¿Qué tan satisfecho estás con la aplicación? (1-10)', type: 'likert', required: true },
    { id: 'utilidad', question: '¿Qué tan útil encontraste la aplicación? (1-10)', type: 'likert', required: true },
    { id: 'confianza', question: '¿Qué tan confiables consideras los datos mostrados? (1-10)', type: 'likert', required: true },
    { id: 'recomendacion', question: '¿Recomendarías esta aplicación a otros? (1-10)', type: 'likert', required: true },
    { id: 'gusto1', question: '¿Qué te gustó más de la aplicación?', type: 'text', required: true },
    { id: 'gusto2', question: 'Menciona una característica adicional que te gustaría ver:', type: 'text', required: true },
    { id: 'disgusto1', question: '¿Qué te disgustó de la aplicación?', type: 'text', required: true },
    { id: 'disgusto2', question: '¿Qué mejorarías de la interfaz?', type: 'text', required: true },
    { id: 'facilidad', question: '¿Qué tan fácil fue usar la aplicación? (1-10)', type: 'likert', required: true },
    { id: 'navegacion', question: '¿Qué tan intuitiva fue la navegación? (1-10)', type: 'likert', required: true },
    { id: 'rendimiento', question: '¿Cómo calificarías el rendimiento de la aplicación? (1-10)', type: 'likert', required: true },
    { id: 'diseno', question: '¿Qué opinas del diseño visual? (1-10)', type: 'likert', required: true },
    { id: 'contenido', question: '¿Los datos proporcionados son suficientes? (1-10)', type: 'likert', required: true },
    { id: 'recomendaciones', question: '¿Qué otras funcionalidades sugieres?', type: 'text', required: true },
    { id: 'general', question: 'Comentarios adicionales:', type: 'text', required: false },
];

const SurveyPage: React.FC = () => {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (questionId: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required questions
        const missingRequired = SURVEY_QUESTIONS.filter(q =>
            q.required && !formData[q.id]
        );

        if (missingRequired.length > 0) {
            alert('Por favor completa todas las preguntas requeridas.');
            return;
        }

        setIsSubmitting(true);

        try {
            const answers = Object.entries(formData).map(([qid, value]) => ({
                qid,
                value,
            }));

            // Guardar localmente en localStorage
            const surveyData = {
                name: user?.username || user?.email?.split('@')[0] || 'Usuario',
                email: user?.email || '',
                answers,
                submittedAt: new Date().toISOString(),
            };

            // Obtener encuestas existentes
            const existingSurveys = localStorage.getItem('stockSimulatorSurveys');
            const surveys = existingSurveys ? JSON.parse(existingSurveys) : [];
            surveys.push(surveyData);

            // Guardar
            localStorage.setItem('stockSimulatorSurveys', JSON.stringify(surveys));

            console.log('✅ Encuesta guardada:', surveyData);
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting survey:', error);
            alert('Error al enviar la encuesta. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        ¡Gracias por tu opinión!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Tu encuesta ha sido enviada exitosamente. Tus comentarios nos ayudan a mejorar.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({});
                        }}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Enviar otra encuesta
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📋 Encuesta de Satisfacción
                        </h1>
                        <p className="text-gray-600">
                            Por favor comparte tu opinión sobre la aplicación. Tus respuestas nos ayudan a mejorar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {SURVEY_QUESTIONS.map((question) => (
                            <div key={question.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {question.question}
                                    {question.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {question.type === 'likert' ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">1</span>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={formData[question.id] || '5'}
                                            onChange={(e) => handleChange(question.id, e.target.value)}
                                            className="flex-1"
                                            required={question.required}
                                        />
                                        <span className="text-sm text-gray-500">10</span>
                                        <span className="text-sm font-semibold text-blue-600 w-12 text-center">
                                            {formData[question.id] || '5'}
                                        </span>
                                    </div>
                                ) : (
                                    <textarea
                                        value={formData[question.id] || ''}
                                        onChange={(e) => handleChange(question.id, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        required={question.required}
                                        placeholder="Escribe tu respuesta aquí..."
                                    />
                                )}
                            </div>
                        ))}

                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Encuesta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SurveyPage;

