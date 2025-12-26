import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout";
import { X, Zap, Check, X as CloseIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CameraPage() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState(false);
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
      }
    }
  };

  const toggleFlash = () => {
    setFlashActive(!flashActive);
    // In a real app we would use track.applyConstraints({ advanced: [{ torch: true }] })
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Flash Effect Overlay */}
        {flashActive && !hasPhoto && (
          <div className="absolute inset-0 bg-white/20 z-10 pointer-events-none animate-pulse" />
        )}

        {/* Camera Feed / Photo Preview */}
        <div className="absolute inset-0 flex items-center justify-center">
          {hasPhoto ? (
            <img src={photoData!} className="w-full h-full object-cover" alt="Captured" />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Viewfinder Corners (Starts on the line horizontally above the top of the circle) */}
          {!hasPhoto && (
            <div className="absolute w-full px-4 top-[100px] pointer-events-none z-20">
              <div className="w-full aspect-[4/3] relative">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white/60 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white/60 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white/60 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white/60 rounded-br-xl" />
              </div>
            </div>
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-12 left-0 right-0 flex justify-between px-8 z-30">
          <button 
            onClick={toggleFlash}
            className={cn(
              "p-3 backdrop-blur rounded-full transition-colors",
              flashActive ? "bg-yellow-400 text-black" : "bg-black/40 text-white"
            )}
          >
            <Zap size={24} fill={flashActive ? "currentColor" : "none"} />
          </button>
          {hasPhoto && (
            <button 
              onClick={() => setHasPhoto(false)}
              className="p-3 bg-black/40 backdrop-blur rounded-full text-white"
            >
              <CloseIcon size={24} />
            </button>
          )}
        </div>

        {/* Capture / Decision Buttons */}
        <div className="absolute bottom-32 left-0 right-0 flex justify-center items-center gap-8 z-30">
          {!hasPhoto ? (
            <button 
              onClick={takePicture}
              className="w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center p-1 bg-white shadow-lg active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full border-[3px] border-orange-400 bg-transparent" />
            </button>
          ) : (
            <div className="flex gap-6 items-center">
              <button 
                onClick={() => setHasPhoto(false)}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
              >
                <X size={32} strokeWidth={3} />
              </button>
              
              <button className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg uppercase tracking-widest text-sm animate-bounce">
                Analyze Meal
              </button>

              <button 
                onClick={() => setHasPhoto(false)}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
              >
                <Check size={32} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
}
