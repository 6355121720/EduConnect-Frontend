import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchQuestions } from '../../../api/qnaApi';
import { Search } from 'lucide-react';

const QConnectMainPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  const fetchQuestions = async (reset = false) => {
    try {
      setLoading(true);
      const res = await searchQuestions({
        search,
        page: reset ? 0 : page,
        size: 2,
      });

      if (res.status === 200) {
        const newQuestions = res.data.content;
        setQuestions((prev) =>
          reset ? newQuestions : [...prev, ...newQuestions]
        );
        setHasMore(!res.data.last);
        setError(null);
      } else {
        setError('Failed to load questions');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(true);
  }, [])

  // Run fetch when page changes (for Load More)
  useEffect(() => {
    if (page === 0) return; // page 0 fetch handled by searchHandler
    fetchQuestions(false);
    // eslint-disable-next-line
  }, [page]);

  const searchHandler = () => {
    setQuestions([]);
    setPage(0);
    fetchQuestions(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-300">Q-Connect</h1>
        <div className="flex gap-4">
          <Link
            to="post"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Ask Question
          </Link>
          <Link
            to="myquestion"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            My Question
          </Link>
        </div>
      </div>

      <div className="flex p-4 bg-black text-white gap-4 items-center mb-6">
        <Search onClick={searchHandler} className="cursor-pointer" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchHandler()}
          className="border border-white rounded-md p-1 bg-transparent text-white"
          placeholder="Search questions..."
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center w-16">
                  <button className="text-gray-500 hover:text-blue-600">↑</button>
                  <span className="font-semibold text-black">
                    {question.votes || 0}
                  </span>
                  <button className="text-gray-500 hover:text-blue-600">↓</button>
                </div>

                <div className="flex-1">
                  <Link
                    to={`question/${question.id}`}
                    className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {question.title}
                  </Link>
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {question.description}
                  </p>

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

                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <div>
                      Asked by{' '}
                      <span className="font-medium text-gray-700">
                        {question.author.username}
                      </span>{' '}
                      on {formatDate(question.createdAt)}
                    </div>
                    <div>
                      {question.noOfAnswers || 0}{' '}
                      {question.noOfAnswers === 1 ? 'answer' : 'answers'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            Load More Questions
          </button>
        </div>
      )}

      {!loading && !hasMore && questions.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          No more questions to load
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No questions found. Be the first to ask one!
        </div>
      )}
    </div>
  );
};

export default QConnectMainPage;
