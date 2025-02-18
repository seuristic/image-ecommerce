import { cn } from '@/lib/utils'
import { IKUpload } from 'imagekitio-next'
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props'
import * as React from 'react'

export const FileUpload = ({
  onSuccess,
  className,
  uploaded,
  setUploaded
}: {
  onSuccess: (response: IKUploadResponse) => void
  className?: string
  uploaded: boolean
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onError = (error: { message: string }) => {
    setError(error.message)
    setUploading(false)
  }

  const handleSuccess = (response: IKUploadResponse) => {
    setError(null)
    setUploading(false)
    onSuccess(response)
    setUploaded(true)
  }

  const handleStartUpload = () => {
    setUploading(true)
    setError(null)
  }

  const handleValidateFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type')
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (<= 5mb)')
    }

    return true
  }

  const labelText = uploading
    ? 'Uploading...'
    : error
      ? error
      : uploaded
        ? 'File uploaded!'
        : 'Upload a file'

  return (
    <label
      htmlFor='product-image'
      className={cn(
        'relative rounded-md bg-white font-semibold',
        uploaded
          ? 'text-green-500'
          : uploading
            ? 'text-gray-500'
            : 'cursor-pointer text-indigo-600 hover:text-indigo-500',
        error && 'text-red-500'
      )}
    >
      <IKUpload
        id='product-image'
        className={cn('sr-only', uploaded && 'text-green-500', className)}
        fileName='product-image.png'
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        validateFile={handleValidateFile}
        disabled={uploading || uploaded}
      />

      {labelText}
    </label>
  )
}
