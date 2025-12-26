import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout";
import { Camera as CameraIcon, X, Zap } from "lucide-react";

export default function CameraPage() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
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

  return (
    <Layout>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Status Bar Mock */}
        <div className="absolute top-12 left-6 text-sm font-medium text-white z-20">9:41</div>
        <div className="absolute top-12 right-6 flex gap-1 z-20">
          <div className="w-4 h-4 bg-white/20 rounded-sm" />
          <div className="w-4 h-4 bg-white/20 rounded-sm" />
        </div>

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
          
          {/* Viewfinder Corners (Visible only when no photo) */}
          {!hasPhoto && (
            <div className="absolute w-4/5 aspect-[3/4] pointer-events-none">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white/60 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white/60 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white/60 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white/60 rounded-br-xl" />
            </div>
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-24 left-0 right-0 flex justify-between px-8 z-20">
          <button className="p-2 bg-black/40 backdrop-blur rounded-full text-white">
            <Zap size={20} />
          </button>
          {hasPhoto && (
            <button 
              onClick={() => setHasPhoto(false)}
              className="p-2 bg-black/40 backdrop-blur rounded-full text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-32 left-0 right-0 flex justify-center z-20">
          {!hasPhoto ? (
            <button 
              onClick={takePicture}
              className="w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center p-1 bg-white shadow-lg active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full border-[3px] border-orange-400 bg-transparent" />
            </button>
          ) : (
            <button className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg uppercase tracking-widest text-sm">
              Analyze Meal
            </button>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
}
