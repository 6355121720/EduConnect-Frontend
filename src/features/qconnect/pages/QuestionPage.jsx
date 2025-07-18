import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  fetchQuestionById,
  postAnswer,
  voteQuestion,
  voteAnswer,
} from '../../../api/qnaApi';

const Question = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        const res = await fetchQuestionById(id);
        if (res.status === 200){
          console.log(res.data);
          setQuestion(res.data);
        }
        else{
          setError("Failed to load question.");
        }
      } catch (err) {
        setError(err.message || 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [id]);

  const handleVote = async (type) => {
    if (type === question.userVote) return;
    try {
      const res = await voteQuestion({
        questionId: question.id,
        userId: currentUser.id,
        type
      });
      if (res.status === 200){
        console.log("changing vote", type);
        let tempVoteCount = question.voteCount;

        if (question.userVote === "UPVOTE") tempVoteCount -= 2;
        if (question.userVote === "DOWNVOTE") tempVoteCount += 2;
        if (question.userVote === "") tempVoteCount += type === "UPVOTE" ? 1 : -1;
        setQuestion(prev => ({...prev, userVote: type, voteCount: tempVoteCount}));
      }
    } catch (err) {
      setError(err.message || 'Failed to vote');
    }
  };

  const handleAnswerVote = async (answerId, type) => {
    if (question.answers.filter(answer => answer.id === answerId)[0].userVote === type) return;
    console.log({answerId,
        userId: currentUser.id,
        type}, question.answers.filter(answer => answer.id === answerId)[0])
    try {
      const res = await voteAnswer({
        answerId,
        userId: currentUser.id,
        type
      });
      if (res.status === 200){
        console.log("answer vote", type);
        let userVote = question.answers.filter(answer => answer.id === answerId)[0].userVote;
        let tempVoteCount = question.answers.filter(answer => answer.id === answerId)[0].voteCount;

        if (userVote === "UPVOTE") tempVoteCount -= 2;
        if (userVote === "DOWNVOTE") tempVoteCount += 2;
        if (userVote === "") tempVoteCount += type === "UPVOTE" ? 1 : -1;
        setQuestion(prev => ({
          ...prev,
          answers: prev.answers.map(answer => answer.id === answerId ? {...answer, userVote:type, voteCount: tempVoteCount} : answer)
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to vote');
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      setError('Answer cannot be empty');
      return;
    }

    try {
      setSubmittingAnswer(true);
      const res = await postAnswer({
        questionId:question.id,
        description: answerContent,
        authorId: currentUser.id
      });
      if (res.status === 200){
        setQuestion(prev => ({
          ...prev,
          answers: [...prev.answers, res.data]
        }));
      }
      setAnswerContent('');
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to post answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center text-gray-500">Question not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center w-16">
              <button
                disabled={currentUser.id === question.author.id}
                onClick={() => handleVote('UPVOTE')}
                className={`text-gray-500 hover:text-blue-600 ${
                  question.userVote === 'UPVOTE' ? 'text-blue-600' : ''
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <span className="font-semibold text-lg text-black">
                {question.voteCount || 0}
              </span>
              <button
                disabled={currentUser.id === question.author.id}
                onClick={() => handleVote('DOWNVOTE')}
                className={`text-gray-500 hover:text-blue-600 ${
                  question.userVote === 'DOWNVOTE' ? 'text-blue-600' : ''
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {question.title}
              </h1>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{question.description}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                <div>
                  Asked by{' '}
                  <span className="font-medium text-gray-700">
                    {question.author.username}
                  </span>{' '}
                  on {formatDate(question.createdAt)}
                </div>
                {question.updatedAt !== question.createdAt && (
                  <div>edited {formatDate(question.updatedAt)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {question.answers.length}{' '}
          {question.answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>

        <div className="space-y-6">
          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center w-16">
                    <button
                      onClick={() => handleAnswerVote(answer.id, 'UPVOTE')}
                      className={`text-gray-500 hover:text-blue-600 ${
                        answer.userVote === 'UPVOTE' ? 'text-blue-600' : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <span className="font-semibold text-lg text-black">
                      {answer.voteCount || 0}
                    </span>
                    <button
                      onClick={() => handleAnswerVote(answer.id, 'DOWNVOTE')}
                      className={`text-gray-500 hover:text-blue-600 ${
                        answer.userVote === 'DOWNVOTE' ? 'text-blue-600' : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 text-black">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{answer.description}</p>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <div>
                        Answered by{' '}
                        <span className="font-medium text-gray-700">
                          {answer.author.username}
                        </span>{' '}
                        on {formatDate(answer.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentUser.id !== question.author?.id && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Answer
          </h2>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAnswerSubmit}>
            <textarea
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px] mb-4"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here..."
            />
            <button
              type="submit"
              disabled={submittingAnswer}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                submittingAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submittingAnswer ? 'Posting Answer...' : 'Post Answer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Question;

