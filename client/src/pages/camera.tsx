import Layout from "@/components/layout";

export default function CameraPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-200 relative">
        <div className="absolute top-12 left-6 text-sm font-medium text-gray-500">9:41</div>
        <div className="absolute top-12 right-6 flex gap-1">
          <div className="w-4 h-4 bg-gray-900 rounded-sm" />
          <div className="w-4 h-4 bg-gray-900 rounded-sm" />
        </div>

        {/* Camera Viewfinder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4/5 aspect-[3/4] border-2 border-gray-400 relative rounded-2xl">
            {/* Viewfinder Corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-gray-400 -mt-1 -ml-1 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-gray-400 -mt-1 -mr-1 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-gray-400 -mb-1 -ml-1 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-gray-400 -mb-1 -mr-1 rounded-br-xl" />
          </div>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-32 left-0 right-0 flex justify-center">
          <div className="w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center p-1 bg-white shadow-lg">
            <div className="w-full h-full rounded-full border-4 border-orange-400 bg-transparent" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
