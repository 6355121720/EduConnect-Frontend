const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50 text-center">
      <h1 className="text-5xl font-bold text-yellow-600 mb-4">403</h1>
      <p className="text-2xl text-gray-800 mb-2">Unauthorized Access</p>
      <p className="text-gray-600">
        You don’t have permission to view this page.
      </p>
    </div>
  );
};

export default Unauthorized;
