'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { getCookie } from 'typescript-cookie';

interface ChangeAvatarModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({
  open,
  setOpen,
}): React.ReactElement => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop,
  });

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    setIsSubmitting(true);
    const croppedBlob: Blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
    const formData = new FormData();
    formData.append('profile_picture', croppedBlob, 'avatar.jpg');
    fetch('/api/users/update-user', {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${getCookie('WALTER_API_TOKEN')}`,
      },
    })
      .then((response: Response) => response.json())
      .finally((): void => setIsSubmitting(false));
  };

  const getCroppedImageBlob = (imageSrc: string, crop: any): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        }, 'image/jpeg');
      };
      image.onerror = () => reject(new Error('Failed to load image'));
    });
  };

  const handleCancel = () => {
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel} className="relative z-10">
      {/* Modal backdrop */}
      <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      {/* Modal content */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6"
          >
            {/* Modal title */}
            <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
              Change Avatar
            </DialogTitle>

            {/* Modal description */}
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Upload and crop an image for your new avatar.
            </DialogDescription>

            {/* Modal content */}
            <div className="mt-4 space-y-6">
              {!imageSrc ? (
                <>
                  <div
                    {...getRootProps({
                      className:
                        'border-dashed border-2 border-gray-300 p-6 rounded-lg text-center cursor-pointer',
                    })}
                  >
                    <input {...getInputProps()} />
                    <p>Drag and drop an image here, or click to select a file</p>
                  </div>
                </>
              ) : (
                <div className="relative crop-container" style={{ height: '200px' }}>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // Square aspect ratio
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCancel}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Cancel
              </button>
              {imageSrc && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangeAvatarModal;
