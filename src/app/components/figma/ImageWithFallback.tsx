import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fillMode?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setDidError(true)
    setIsLoading(false)
  }

  const { src, alt, style, className, fillMode = 'cover', ...rest } = props

  const imageStyles: React.CSSProperties = {
    ...style,
    objectFit: fillMode
  }

  return didError ? (
    <div
      className={`relative inline-block bg-slate-50 text-center align-middle overflow-hidden border border-slate-100 ${className ?? ''}`}
      style={style}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4">
        <div className="bg-slate-200/50 p-4 rounded-full">
          <img src={ERROR_IMG_SRC} alt="Error" className="h-10 w-10 opacity-40 grayscale" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image Unavailable</span>
      </div>
    </div>
  ) : (
    <div className={`relative ${className} overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-[#FF8C00]/20 border-t-[#FF8C00] rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full" 
        style={imageStyles} 
        {...rest} 
        onLoad={() => setIsLoading(false)}
        onError={handleError} 
      />
    </div>
  )
}
