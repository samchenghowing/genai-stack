// QuizPage.tsx
import * as React from 'react';
import { useState } from 'react';
import TrueFalseQuestion from './TrueFalseQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';
import { Typography, Container, Button } from '@mui/material';

const QUIZ_API_ENDPOINT = 'http://localhost:8504/get-quiz';

// Define a type for the question types
type QuestionType = 'true-false' | 'multiple-choice' | 'short-answer';

// Update the Question interface
interface Question {
    id: number;
    question: string;
    type: QuestionType;
    correctAnswer: string;
    choices?: string[]; // Only used for multiple-choice questions
}


const QuizPage: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [questions, setQuestions] = React.useState<Question[]>([
        { id: 1, question: 'The sky is blue.', type: 'true-false', correctAnswer: 'true' },
        { id: 2, question: 'The grass is red.', type: 'true-false', correctAnswer: 'false' },
        { id: 3, question: 'Which color is the sky?', type: 'multiple-choice', correctAnswer: 'Blue', choices: ['Red', 'Green', 'Blue', 'Yellow'] },
        { id: 4, question: 'What is the color of the sun?', type: 'short-answer', correctAnswer: 'Yellow' },
    ]);
    const [userID, setUserID] = React.useState("1234");

    // TODO: get questions from DB: Generate by langchain tools/ sturucted output 
    // (Create question by textbook content, then verify and save it to db)
    // React.useEffect(() => {
    //     const abortController = new AbortController();
    //     const fetchQuestions = async () => {
    //         try {
    //             const response = await fetch(QUIZ_API_ENDPOINT/${userID}, {
    //                 signal: abortController.signal
    //             });
    //             const json = await response.json();
    //             setQuestions(json);
    //         } catch (error) {
    //             if (error.name !== 'AbortError') {
    //                 console.error(error);
    //             }
    //         }
    //     };

    //     fetchQuestions();
    //     return () => abortController.abort();
    // }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(score + 1);
        }
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            setIsQuizCompleted(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizCompleted(false);
    };

    const currentQuestion = questions[currentQuestionIndex];

    if (isQuizCompleted) {
        return (
            <Container style={{ textAlign: 'center', padding: 20 }}>
                <Typography variant="h4">Quiz Completed!</Typography>
                <Typography variant="h6">Your Score: {score} / {questions.length}</Typography>
                <Button variant="contained" color="primary" onClick={handleRestart} sx={{ mt: 2 }}>
                    Restart Quiz
                </Button>
            </Container>
        );
    }

    return (
        <Container>
            {currentQuestion.type === 'true-false' ? (
                <TrueFalseQuestion
                    question={currentQuestion.question}
                    correctAnswer={currentQuestion.correctAnswer}
                    onAnswer={handleAnswer}
                />
            ) : currentQuestion.type === 'multiple-choice' ? (
                <MultipleChoiceQuestion
                    question={currentQuestion.question}
                    choices={currentQuestion.choices!} // Non-null assertion
                    correctAnswer={currentQuestion.correctAnswer}
                    onAnswer={handleAnswer}
                />
            ) : currentQuestion.type === 'short-answer' ? (
                <ShortAnswerQuestion
                    question={currentQuestion.question}
                    correctAnswer={currentQuestion.correctAnswer}
                    onAnswer={handleAnswer}
                />
            ) : null}
        </Container>
    );
};

export default QuizPage;
