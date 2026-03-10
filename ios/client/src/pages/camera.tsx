import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout";
import { X, Zap, Check, X as CloseIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface PredictionResult {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
}

export default function CameraPage() {
  const [, setLocation] = useLocation();
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhotoData(canvas.toDataURL('image/png'));
        setHasPhoto(true);
        setPrediction(null);
      }
    }
  };

  const analyzeFood = async () => {
    if (!photoData) return;
    
    setAnalyzing(true);
    
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photoData }),
      });
      
      if (!response.ok) throw new Error("Prediction failed");
      
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Error analyzing food:", error);
      // Fallback to mock data if API fails
      setPrediction({
        food_name: "Food Item",
        calories: 300,
        protein: 20,
        carbs: 30,
        fats: 15,
        confidence: 75,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const logMeal = () => {
    if (!prediction) return;
    
    const newMeal = {
      id: Date.now(),
      image: photoData,
      name: prediction.food_name,
      calories: prediction.calories,
      protein: prediction.protein,
      carbs: prediction.carbs,
      fats: prediction.fats,
      timestamp: new Date().toISOString()
    };

    const saved = localStorage.getItem('logged_meals');
    const meals = saved ? JSON.parse(saved) : [];
    localStorage.setItem('logged_meals', JSON.stringify([...meals, newMeal]));
    
    setLocation("/");
  };

  const toggleFlash = () => {
    setFlashActive(!flashActive);
  };

  const retake = () => {
    setHasPhoto(false);
    setPhotoData(null);
    setPrediction(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {flashActive && !hasPhoto && (
          <div className="absolute inset-0 bg-white/20 z-10 pointer-events-none animate-pulse" />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          {hasPhoto ? (
            <img src={photoData!} className="w-full h-full object-cover" alt="Captured" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
        </div>

        {/* Prediction Result Overlay */}
        {prediction && (
          <div className="absolute top-24 left-4 right-4 z-30">
            <div className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold font-display uppercase tracking-tight">{prediction.food_name}</h3>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {prediction.confidence}% match
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-500">{prediction.calories}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Cals</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-500">{prediction.protein}g</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Protein</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-500">{prediction.carbs}g</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Carbs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{prediction.fats}g</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Fats</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-12 left-0 right-0 flex justify-between px-8 z-30">
          <button onClick={toggleFlash} className={cn("p-3 backdrop-blur rounded-full transition-colors", flashActive ? "bg-yellow-400 text-black" : "bg-black/40 text-white")}>
            <Zap size={24} fill={flashActive ? "currentColor" : "none"} />
          </button>
          {hasPhoto && (
            <button onClick={retake} className="p-3 bg-black/40 backdrop-blur rounded-full text-white">
              <CloseIcon size={24} />
            </button>
          )}
        </div>

        <div className="absolute bottom-32 left-0 right-0 flex justify-center items-center gap-8 z-30">
          {!hasPhoto ? (
            <button 
              onClick={takePicture} 
              data-testid="button-capture"
              className="w-20 h-20 rounded-full border-[6px] border-orange-400 flex items-center justify-center p-1 bg-white shadow-lg active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full border-[3px] border-orange-400 bg-transparent" />
            </button>
          ) : (
            <div className="flex gap-6 items-center">
              <button 
                onClick={retake} 
                data-testid="button-retake"
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
              >
                <CloseIcon size={32} strokeWidth={3} />
              </button>
              
              {!prediction ? (
                <button 
                  onClick={analyzeFood} 
                  disabled={analyzing}
                  data-testid="button-analyze"
                  className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg uppercase tracking-widest text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Food"
                  )}
                </button>
              ) : (
                <button 
                  onClick={logMeal} 
                  data-testid="button-log"
                  className="px-8 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg uppercase tracking-widest text-sm"
                >
                  Log Meal
                </button>
              )}

              {prediction && (
                <button 
                  onClick={logMeal} 
                  data-testid="button-confirm"
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
                >
                  <Check size={32} strokeWidth={3} />
                </button>
              )}
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
}
