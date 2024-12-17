import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { analyzeFood } from './api/aiStudio'; // Make sure this import path is correct

function App() {
  const webcamRef = useRef(null);
  const [calorieInfo, setCalorieInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureImage = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot(); // Capture image as Base64
    try {
      setLoading(true);
      const result = await analyzeFood(imageSrc); // Send captured image to AI
      setCalorieInfo(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#85A98F] to-[#B2C9AD]   p-4">
  {/* Title */}
  <h1 className="text-4xl font-bold text-[#66785F] mb-6">
    Calorie Detector
  </h1>

  {/* Webcam */}
  <div className="border-2 border-[#66785F] rounded-lg overflow-hidden shadow-md mb-4">
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="w-full h-64 object-cover"
    />
  </div>

  {/* Button */}
  <button
    onClick={captureImage}
    disabled={loading}
    className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#91AC8F] hover:bg-[#85A98F]"
    }`}
  >
    {loading ? "Analyzing..." : "Capture & Analyze"}
  </button>

  {/* Calorie Info */}
  {calorieInfo && (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Calorie Information:
      </h2>
      <pre className="text-gray-600 bg-gray-100 p-3 rounded-md whitespace-pre-wrap">
        {calorieInfo}
      </pre>
    </div>
  )}
</div>

  );
}

export default App; // Make sure this line is present!
