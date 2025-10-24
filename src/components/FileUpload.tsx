import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle2, AlertCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadedFile } from '@/types';

interface FileUploadProps {
  onUpload: (file: File) => Promise<UploadedFile>;
  onRemove?: (fileId: string) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

const FileUpload = ({
  onUpload,
  onRemove,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  className = ""
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        const uploadedFile = await onUpload(file);
        setUploadedFiles(prev => [...prev, uploadedFile]);
      } catch (error) {
        console.error('Upload failed:', error);
        // Add failed file to list
        setUploadedFiles(prev => [...prev, {
          id: Math.random().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: '',
          status: 'error',
          progress: 0
        }]);
      }
    }
    
    setUploading(false);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple
  });

  const handleRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    onRemove?.(fileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.includes('pdf')) return '📄';
    return '📁';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to select files
        </p>
        <p className="text-xs text-muted-foreground">
          Max size: {formatFileSize(maxSize)} • {acceptedTypes.join(', ')}
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
            >
              <div className="text-2xl">{getFileIcon(file.type)}</div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
                
                {file.status === 'uploading' && (
                  <div className="mt-2">
                    <Progress value={file.progress} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {file.progress}% uploaded
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {file.status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                {file.status === 'uploading' && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(file.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Uploading files...</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
