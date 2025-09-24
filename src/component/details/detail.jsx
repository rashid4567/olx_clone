import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const formatFirestoreDate = (timestamp) => {
  if (!timestamp) return "No date";
  if (typeof timestamp === 'string') return timestamp;
  if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return "";
};

const Detail = () => {
  const location = useLocation();
  const { item } = location.state || {};

  console.log('Detail component received item:', item);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Item not found</h2>
          <Link to="/" className="text-blue-500 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to listings
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
           
            <div className="md:w-1/2">
              <img
                className="w-full h-96 object-contain bg-gray-100"
                src={item.imageUrl || 'https://via.placeholder.com/400x300'}
                alt={item.title || 'Product'}
              />
            </div>

         
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold mb-4" style={{ color: '#002f34' }}>
                {item.title || 'No title'}
              </h1>
              
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: '#002f34' }}>
                  ₹ {item.price?.toLocaleString() || '0'}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Category</h3>
                  <p className="text-gray-600">{item.category || 'No category'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{item.description || 'No description'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Seller</h3>
                  <p className="text-gray-600">{item.userName || 'Anonymous'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Posted On</h3>
                  <p className="text-gray-600">{formatFirestoreDate(item.createdAt)}</p>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;