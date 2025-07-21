import React from 'react';

type RateLimitError = {
  code: string;
  message: string;
  providerLimitHit: boolean;
  isRetryable: boolean;
};

const rateLimitResponse: RateLimitError = {
  code: "rate-limited",
  message: "You have hit the rate limit. Please upgrade to keep chatting.",
  providerLimitHit: false,
  isRetryable: true,
};

const BookingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Rate Limit Hit</h1>
        <p className="text-gray-700 mb-2">{rateLimitResponse.message}</p>
        {rateLimitResponse.isRetryable && (
          <p className="text-sm text-gray-500">You can try again later.</p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;

