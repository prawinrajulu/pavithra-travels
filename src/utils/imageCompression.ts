import imageCompression from 'browser-image-compression';

interface CompressionConfig {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
}

export const compressImage = async (
  file: File, 
  config: CompressionConfig = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true }
): Promise<File> => {
  const startTime = performance.now();
  console.log(`[DEBUG] Starting compression for: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

  try {
    const compressedFile = await imageCompression(file, config);
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`[DEBUG] Compression complete in ${duration}s`);
    console.log(`[DEBUG] New size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Maintain the original name and type but with new content
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('[DEBUG] Compression error:', error);
    throw error;
  }
};
