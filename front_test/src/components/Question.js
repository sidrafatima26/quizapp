import React from 'react';

const Question = ({ question, onAnswer }) => {
  const handleChange = (e) => {
    const answer = {
      answerText: e.target.value,
      isCorrect: e.target.value === question.correctAnswer,
    };
    onAnswer(answer);
  };

  return (
    <div>
      <h3>{question.question_text}</h3>
      {question.answers.map((answer) => (
        <div key={answer.id}>
          <input
            type="radio"
            name={question.id}
            value={answer.answer_text}
            onChange={handleChange}
          />
          {answer.answer_text}
        </div>
      ))}
    </div>
  );
};

export default Question;
