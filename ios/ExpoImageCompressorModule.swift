import ExpoModulesCore
import Compression
import UIKit

func getFileSize(at absolutePath: URL) -> Int? {
    do {
        // Retrieve file attributes
        let fileAttributes = try FileManager.default.attributesOfItem(atPath: absolutePath.path)
        
        // Access the file size attribute
        if let fileSize = fileAttributes[.size] as? Int {
            return fileSize
        }
    } catch {
        print("Error retrieving file size: \(error)")
    }
    
    return nil
}

extension UIImage {
    enum JPEGQuality: CGFloat {
        case lowest  = 0
        case low     = 0.25
        case medium  = 0.5
        case high    = 0.75
        case highest = 1
    }
    
    /// Returns the data for the specified image in JPEG format.
    /// If the image object’s underlying image data has been purged, calling this function forces that data to be reloaded into memory.
    /// - returns: A data object containing the JPEG data, or nil if there was a problem generating the data. This function may return nil if the image has no data or if the underlying CGImageRef contains data in an unsupported bitmap format.
    func jpeg(_ jpegQuality: JPEGQuality) -> Data? {
        return jpegData(compressionQuality: jpegQuality.rawValue)
    }
}

func saveImageToRandomPath(_ image: UIImage, _ quality: Float) -> URL? {
    // Generate a unique filename using UUID
    let uniqueFilename = UUID().uuidString + ".jpg"
    
    // Get the document directory path
    guard let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else {
        print("Could not find the documents directory.")
        return nil
    }
    
    // Create the full file path
    let fileURL = documentsDirectory.appendingPathComponent(uniqueFilename)
    
    // Convert the image to JPEG data
    guard let data = image.jpegData(compressionQuality: CGFloat(quality)) else {
        print("Failed to convert image to data.")
        return nil
    }
    
    // Write the data to the file
    do {
        try data.write(to: fileURL)
        print("Image saved successfully at: \(fileURL.path)")
        return fileURL
    } catch {
        print("Failed to save image: \(error)")
        return nil
    }
}

public class ExpoImageCompressorModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoImageCompressor')` in JavaScript.
        Name("ExpoImageCompressor")
        
        // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
        Constants([:])
        
        // Defines event names that the module can send to JavaScript.
        Events("onChange")
        
        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        //    Function("hello") {
        //      return "Hello world! 👋"
        //    }
        
        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        let _self = self;
        AsyncFunction("compress") { (fileName: String, compressionQuality: Float) in
            
            let quality = UIImage.JPEGQuality(rawValue: CGFloat(compressionQuality))
            print("Quality \(String(describing: quality))")
            print("Path \(fileName)")
            
            if let image = UIImage(contentsOfFile: fileName) {
                print("Image exists")
                
                let filePath = URL(fileURLWithPath: fileName)
                _self.sendEvent("onChange", [
                    "status": "compressing",
                    "data": "Image exists and started compressing",
                    "fileSize": getFileSize(at: filePath)
                ])
                
                if image.jpeg(quality ?? .medium) != nil {
                    print("Image compressed");
                    let path = saveImageToRandomPath(image, compressionQuality)
                    print("Image saved");
                    print(path?.absoluteString ?? "");
                    
                    _self.sendEvent("onChange", [
                        "status": "success",
                        "data": path?.absoluteString ?? "",
                        "fileSize": getFileSize(at: path!.absoluteURL)
                    ])
                    
                } else {
                    _self.sendEvent("onChange", [
                        "status": "failed",
                        "data": "Cannot read image"
                    ])
                }
            } else {
                print("Not compressed")
                self.sendEvent("onChange", [
                    "status": "failed",
                    "message": "Cannot find image",
                ])
            }
        }
        
        // Enables the module to be used as a native view. Definition components that are accepted as part of the
        // view definition: Prop, Events.
        View(ExpoImageCompressorView.self) {
            // Defines a setter for the `name` prop.
            Prop("name") { (view: ExpoImageCompressorView, prop: String) in
                print(prop)
            }
        }
    }
}
