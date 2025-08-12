'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Upload, Download, X, ImageIcon, Info } from 'lucide-react'
import { toast } from 'sonner'
import { WidgetWrapper } from '@/components/tools/WidgetWrapper'
import { cn } from '@/lib/utils'

interface ImageInfo {
  name: string
  url: string
  width: number
  height: number
  aspectRatio: string
  fileSize: number
  fileSizeFormatted: string
  format: string
  lastModified: Date
}

export default function ImageSizeCheckerPage() {
  const t = useTranslations('widgets.imageSizeChecker')
  const [images, setImages] = useState<ImageInfo[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
    const divisor = gcd(width, height)
    return `${width / divisor}:${height / divisor}`
  }

  const processImage = (file: File): Promise<ImageInfo> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          const imageInfo: ImageInfo = {
            name: file.name,
            url: e.target?.result as string,
            width: img.width,
            height: img.height,
            aspectRatio: getAspectRatio(img.width, img.height),
            fileSize: file.size,
            fileSizeFormatted: formatBytes(file.size),
            format: file.type || 'unknown',
            lastModified: new Date(file.lastModified)
          }
          resolve(imageInfo)
        }
        
        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }
        
        img.src = e.target?.result as string
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  const handleFiles = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error(t('noImages'))
      return
    }
    
    const newImages: ImageInfo[] = []
    
    for (const file of imageFiles) {
      try {
        const imageInfo = await processImage(file)
        newImages.push(imageInfo)
      } catch (error) {
        toast.error(`${t('errorProcessing')} ${file.name}`)
      }
    }
    
    setImages(prev => [...prev, ...newImages])
    toast.success(`${newImages.length} ${t('imagesProcessed')}`)
  }, [t])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearAll = useCallback(() => {
    setImages([])
  }, [])

  const exportData = useCallback(() => {
    const data = images.map(img => ({
      name: img.name,
      width: img.width,
      height: img.height,
      aspectRatio: img.aspectRatio,
      fileSize: img.fileSizeFormatted,
      format: img.format
    }))
    
    const csv = [
      'Name,Width,Height,Aspect Ratio,File Size,Format',
      ...data.map(row => `"${row.name}",${row.width},${row.height},"${row.aspectRatio}","${row.fileSize}","${row.format}"`)
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'image-sizes.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success(t('exported'))
  }, [images, t])

  return (
    <WidgetWrapper>
      <Card>
        <CardHeader>
          <CardTitle>{t('uploadArea')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            )}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">{t('dragDrop')}</p>
            <p className="text-sm text-muted-foreground mb-4">{t('or')}</p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              {t('browseFiles')}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">{t('supportedFormats')}</p>
          </div>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <>
          <div className="flex justify-between items-center my-6">
            <h2 className="text-2xl font-bold">{t('results')} ({images.length})</h2>
            <div className="flex gap-2">
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                {t('exportCSV')}
              </Button>
              <Button onClick={clearAll} variant="outline">
                <X className="w-4 h-4 mr-2" />
                {t('clearAll')}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <Button
                    onClick={() => removeImage(index)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate" title={image.name}>
                    {image.name}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('dimensions')}:</span>
                      <span className="font-mono">{image.width} × {image.height}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('aspectRatio')}:</span>
                      <span className="font-mono">{image.aspectRatio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('fileSize')}:</span>
                      <span className="font-mono">{image.fileSizeFormatted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('format')}:</span>
                      <span className="font-mono">{image.format.split('/')[1]?.toUpperCase() || 'Unknown'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t('commonAspectRatios')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">{t('photography')}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>1:1</span>
                  <span className="text-muted-foreground">{t('square')}</span>
                </div>
                <div className="flex justify-between">
                  <span>4:3</span>
                  <span className="text-muted-foreground">{t('traditional')}</span>
                </div>
                <div className="flex justify-between">
                  <span>3:2</span>
                  <span className="text-muted-foreground">{t('classic35mm')}</span>
                </div>
                <div className="flex justify-between">
                  <span>16:9</span>
                  <span className="text-muted-foreground">{t('widescreen')}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('socialMedia')}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>1:1</span>
                  <span className="text-muted-foreground">Instagram {t('post')}</span>
                </div>
                <div className="flex justify-between">
                  <span>9:16</span>
                  <span className="text-muted-foreground">Instagram {t('story')}</span>
                </div>
                <div className="flex justify-between">
                  <span>16:9</span>
                  <span className="text-muted-foreground">YouTube {t('thumbnail')}</span>
                </div>
                <div className="flex justify-between">
                  <span>2:1</span>
                  <span className="text-muted-foreground">Twitter {t('header')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </WidgetWrapper>
  )
}