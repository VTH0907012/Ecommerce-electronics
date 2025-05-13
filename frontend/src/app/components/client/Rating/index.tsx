const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex  gap-1 text-yellow-400 mt-2">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.452a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.376 2.452c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.632 9.384c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {halfStar === 1 && (
        <svg
          key="half"
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-grad)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.452a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.376 2.452c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.632 9.384c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.957z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.452a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.376 2.452c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.632 9.384c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.957z"
          />
        </svg>
      ))}
    </div>
  );
};
export default Rating;
