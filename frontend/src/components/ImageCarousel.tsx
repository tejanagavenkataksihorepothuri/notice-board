import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
    // Reset pan position if zooming out to fit
    if (zoomLevel <= 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Keyboard navigation and zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case 'Escape':
          closeFullscreen();
          break;
        case 'ArrowLeft':
          if (images && images.length > 1) prevImage();
          break;
        case 'ArrowRight':
          if (images && images.length > 1) nextImage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen, images, zoomLevel]);

  // Early return after all hooks
  if (!images || images.length === 0) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, imagePath: string) => {
    console.log('Image load error for:', imagePath);
    // Try direct URL without environment variable
    const directUrl = `http://localhost:5000${imagePath}`;
    console.log('Trying direct URL:', directUrl);
    (e.target as HTMLImageElement).src = directUrl;
    // If still fails, show placeholder
    setTimeout(() => {
      if ((e.target as HTMLImageElement).complete && (e.target as HTMLImageElement).naturalHeight === 0) {
        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlhOWE5YSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==';
      }
    }, 2000);
  };

  if (images.length === 1) {
    // Single image display
    return (
      <div className={`relative group ${className}`}>
        <img
          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${images[0]}`}
          alt={title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={openFullscreen}
          onError={(e) => handleImageError(e, images[0])}
          onLoad={() => console.log('Single image loaded successfully:', images[0])}
        />
        
        {/* Expand Button */}
        <button
          onClick={openFullscreen}
          className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Expand image"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        
        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onWheel={handleWheel}
          >
            <div className="relative max-w-full max-h-full">
              {/* Control Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <button
                  onClick={zoomOut}
                  disabled={zoomLevel <= 0.5}
                  className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <button
                  onClick={resetZoom}
                  className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-3 py-2 rounded-full transition-all duration-200 text-sm"
                  aria-label="Reset zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={zoomIn}
                  disabled={zoomLevel >= 5}
                  className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={closeFullscreen}
                  className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div
                className="overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${images[0]}`}
                  alt={title}
                  className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                    transformOrigin: 'center center'
                  }}
                  onError={(e) => handleImageError(e, images[0])}
                  draggable={false}
                />
              </div>
              
              {/* Instructions */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-4 py-2 rounded-full text-center">
                {zoomLevel > 1 ? (
                  <>Drag to pan • Scroll/+/- to zoom • Esc to close</>
                ) : (
                  <>Scroll/+/- to zoom • Esc to close • Drag when zoomed</>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Multiple images carousel
  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Main Image */}
        <div className="relative h-full overflow-hidden">
          <img
            src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${images[currentIndex]}`}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-opacity duration-300"
            onClick={openFullscreen}
            onError={(e) => handleImageError(e, images[currentIndex])}
            onLoad={() => console.log('Carousel image loaded successfully:', images[currentIndex])}
          />
          
          {/* Image Counter and Expand Button */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className="bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={openFullscreen}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Expand image"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onWheel={handleWheel}
        >
          <div className="relative max-w-full max-h-full">
            {/* Control Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                onClick={resetZoom}
                className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-3 py-2 rounded-full transition-all duration-200 text-sm"
                aria-label="Reset zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 5}
                className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={closeFullscreen}
                className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Next image"
                  style={{ right: '6rem' }} // Offset for control buttons
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
            
            <div
              className="overflow-hidden cursor-grab active:cursor-grabbing"
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${images[currentIndex]}`}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center center'
                }}
                onError={(e) => handleImageError(e, images[currentIndex])}
                draggable={false}
              />
            </div>
            
            {/* Fullscreen Image Counter */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-sm px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-4 py-2 rounded-full text-center">
              {zoomLevel > 1 ? (
                <>Drag to pan • Scroll/+/- to zoom • ← → for images • Esc to close</>
              ) : (
                <>Scroll/+/- to zoom • ← → for images • Esc to close • Drag when zoomed</>
              )}
            </div>
            
            {/* Fullscreen Thumbnail Navigation */}
            {images.length > 1 && images.length <= 10 && (
              <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      goToImage(index);
                      setZoomLevel(1);
                      setPanPosition({ x: 0, y: 0 });
                    }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex
                        ? 'border-white'
                        : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, image)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
