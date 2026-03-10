// PicNEat iOS - API Integration
// Drop this into your SwiftUI app

import SwiftUI

// MARK: - API Models (Match Backend Response)

struct MealAnalysisResponse: Codable {
    let foods: [DetectedFood]
    let totalCalories: Int
    let totalProtein: Double
    let totalCarbs: Double
    let totalFats: Double
    let analysisTimeMs: Int
    
    enum CodingKeys: String, CodingKey {
        case foods
        case totalCalories = "total_calories"
        case totalProtein = "total_protein"
        case totalCarbs = "total_carbs"
        case totalFats = "total_fats"
        case analysisTimeMs = "analysis_time_ms"
    }
}

struct DetectedFood: Codable, Identifiable {
    let id = UUID()
    let name: String
    let portionGrams: Double
    let calories: Int
    let protein: Double
    let carbs: Double
    let fats: Double
    let confidence: Double
    let source: String
    
    enum CodingKeys: String, CodingKey {
        case name
        case portionGrams = "portion_grams"
        case calories, protein, carbs, fats, confidence, source
    }
}

// MARK: - API Service

class PicNEatAPI: ObservableObject {
    // CHANGE THIS to your Railway URL after deployment
    private let baseURL = "http://localhost:8000"
    // For local testing: "http://localhost:8000"
    
    @Published var isAnalyzing = false
    @Published var lastError: String?
    
    /// Analyze a food image
    func analyzeMeal(image: UIImage) async throws -> MealAnalysisResponse {
        guard let imageData = image.jpegData(compressionQuality: 0.8) else {
            throw APIError.invalidImage
        }
        
        let url = URL(string: "\(baseURL)/analyze-meal")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        // Create multipart form data
        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"food.jpg\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        // Make the request
        DispatchQueue.main.async {
            self.isAnalyzing = true
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        DispatchQueue.main.async {
            self.isAnalyzing = false
        }
        
        // Check response
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        // Decode response
        let decoder = JSONDecoder()
        return try decoder.decode(MealAnalysisResponse.self, from: data)
    }
    
    /// Health check
    func checkHealth() async throws -> Bool {
        let url = URL(string: "\(baseURL)/health")!
        let (_, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            return false
        }
        
        return httpResponse.statusCode == 200
    }
}

enum APIError: LocalizedError {
    case invalidImage
    case invalidResponse
    case serverError(Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return "Could not process image"
        case .invalidResponse:
            return "Invalid response from server"
        case .serverError(let code):
            return "Server error: \(code)"
        }
    }
}

// MARK: - Example Usage in SwiftUI View

struct CameraView: View {
    @StateObject private var api = PicNEatAPI()
    @State private var capturedImage: UIImage?
    @State private var analysisResult: MealAnalysisResponse?
    @State private var showingCamera = false
    
    var body: some View {
        ZStack {
            // Main content: either the live result UI or a simple “ready” state
            if let result = analysisResult {
                ResultView(result: result)
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "camera.viewfinder")
                        .font(.system(size: 64))
                        .foregroundColor(.accentColor)
                    Text("Tap the camera to snap your meal")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }

            // Small floating camera button in the bottom‑right
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button {
                        // Clear previous state and open camera
                        capturedImage = nil
                        analysisResult = nil
                        showingCamera = true
                    } label: {
                        Image(systemName: "camera.fill")
                            .font(.system(size: 20, weight: .semibold))
                            .foregroundColor(.black)
                            .padding(14)
                            .background(
                                Circle()
                                    .fill(Color.white)
                                    .shadow(color: .black.opacity(0.25), radius: 8, x: 0, y: 4)
                            )
                    }
                    .padding(.trailing, 24)
                    .padding(.bottom, 24)
                }
            }

            // Neil analysis progress overlay
            if api.isAnalyzing {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                ProgressView("Neil is analyzing your meal…")
                    .padding(20)
                    .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .padding()
            }
        }
        .sheet(isPresented: $showingCamera) {
            ImagePicker(image: $capturedImage)
        }
        .onChange(of: capturedImage) { newImage in
            if let image = newImage {
                analyzeImage(image)
            }
        }
    }
    
    private func analyzeImage(_ image: UIImage) {
        Task {
            do {
                let result = try await api.analyzeMeal(image: image)
                
                await MainActor.run {
                    analysisResult = result
                    
                    // TODO: Update your UI
                    // - Show calorie ring
                    // - Display Neil celebration
                    // - Add to meal log
                    // - Update streak
                }
            } catch {
                print("Analysis failed: \(error)")
                // Show error to user
            }
        }
    }
}

struct ResultView: View {
    let result: MealAnalysisResponse
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Total calories (big and bold)
            Text("\(result.totalCalories)")
                .font(.system(size: 72, weight: .bold))
                .foregroundColor(.orange)
            
            Text("CALORIES")
                .font(.caption)
                .foregroundColor(.gray)
            
            // Macros
            HStack(spacing: 20) {
                MacroView(value: result.totalProtein, label: "PROTEIN", color: .red)
                MacroView(value: result.totalCarbs, label: "CARBS", color: .yellow)
                MacroView(value: result.totalFats, label: "FATS", color: .blue)
            }
            
            Divider()
            
            // Detected foods
            ForEach(result.foods) { food in
                FoodRow(food: food)
            }
            
            // Confidence badge
            HStack {
                Image(systemName: food.source == "purdue" ? "building.2" : "globe")
                Text(food.source.uppercased())
                    .font(.caption)
                Spacer()
                Text("\(Int(food.confidence * 100))% match")
                    .font(.caption)
                    .foregroundColor(.green)
            }
            .padding(.top)
        }
        .padding()
    }
    
    private var food: DetectedFood {
        result.foods.first!
    }
}

struct MacroView: View {
    let value: Double
    let label: String
    let color: Color
    
    var body: some View {
        VStack {
            Text("\(Int(value))g")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
            Text(label)
                .font(.caption2)
                .foregroundColor(.gray)
        }
    }
}

struct FoodRow: View {
    let food: DetectedFood
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(food.name.capitalized)
                    .font(.headline)
                Text("\(Int(food.portionGrams))g portion")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            Text("\(food.calories) cal")
                .font(.title3)
                .fontWeight(.semibold)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Image Picker (for Camera)

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.dismiss) private var dismiss
    
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.image = image
            }
            parent.dismiss()
        }
        
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}

// MARK: - Quick Test Function

func testAPI() {
    Task {
        let api = PicNEatAPI()
        
        // 1. Check if backend is alive
        do {
            let healthy = try await api.checkHealth()
            print("✅ Backend health: \(healthy)")
        } catch {
            print("❌ Health check failed: \(error)")
        }
        
        // 2. Test with image (you provide the image)
        // let testImage = UIImage(named: "pizza")!
        // let result = try await api.analyzeMeal(image: testImage)
        // print("✅ Got \(result.totalCalories) calories!")
    }
}
