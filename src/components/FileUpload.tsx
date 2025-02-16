import { IKUpload } from 'imagekitio-next'
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props'
import * as React from 'react'

export const FileUpload = ({
  onSuccess
}: {
  onSuccess: (response: IKUploadResponse) => void
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
  }

  const handleStartUpload = () => {
    setUploading(true)
    setError(null)
  }

  return (
    <div className="space-y-2">
      <IKUpload
        fileName="product-image.png"
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        validateFile={(file: File) => {
          const validTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp'
          ]

          if (!validTypes.includes(file.type)) {
            setError('Invalid file type')
          }

          if (file.size > 5 * 1024 * 1024) {
            setError('File is too large (<= 5mb)')
          }

          return true
        }}
      />

      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
