'use client'

import * as React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props'
import { IMAGE_VARIANTS, ImageVariantType } from '@/models/Product.model'
import { apiClient, ProductFormData } from '@/lib/api-client'
import { toast } from 'sonner'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import MainLayout from '../layouts/MainLayout'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { FileUpload } from '../FileUpload'
import Spinner from '../ui/Spinner'
import { cn } from '@/lib/utils'

export default function ProductForm() {
  const [submitting, setSubmitting] = React.useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      variants: [
        {
          type: 'SQUARE' as ImageVariantType,
          price: 9.99,
          license: 'personal'
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  })

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue('imageUrl', response.filePath)
    toast.success('Image uploaded successfully!')
  }

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true)

    try {
      await apiClient.createProduct(data)
      toast.success('Product created successfully!')

      setValue('name', '')
      setValue('description', '')
      setValue('imageUrl', '')
      setValue('variants', [
        {
          type: 'SQUARE' as ImageVariantType,
          price: 9.99,
          license: 'personal'
        }
      ])
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create product'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MainLayout className='max-w-xl'>
      <h1 className='text-2xl font-bold'>Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='border-b border-gray-900/10 pb-12'>
          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8'>
            <div className='col-span-full'>
              <label
                htmlFor='name'
                className='block text-sm/6 font-medium text-gray-900'
              >
                Product Name
              </label>
              <div className='mt-2'>
                <input
                  id='name'
                  type='text'
                  placeholder='Write name of the product'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className='mt-1 text-sm/6'>
                    <span className='text-red-600'>{errors.name.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='description'
                className='block text-sm/6 font-medium text-gray-900'
              >
                Description
              </label>
              <div className='mt-2'>
                <textarea
                  id='description'
                  rows={3}
                  className='block min-h-20 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  defaultValue={''}
                  {...register('description', {
                    required: 'Description is required'
                  })}
                />
              </div>
              <p className='mt-1 text-sm/6 text-gray-600'>
                Write a few sentences about the product.{' '}
                {errors.description && (
                  <span className='text-red-600'>
                    {errors.description.message}
                  </span>
                )}
              </p>
            </div>

            <div className='col-span-full'>
              <label className='block text-sm/6 font-medium text-gray-900'>
                Product Image
              </label>
              <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                <div className='text-center'>
                  <PhotoIcon
                    aria-hidden='true'
                    className='mx-auto size-12 text-gray-300'
                  />
                  <div className='mt-4 flex justify-center text-sm/6 text-gray-600'>
                    <FileUpload onSuccess={handleUploadSuccess} />
                  </div>
                  <p className='text-xs/5 text-gray-600'>
                    PNG, JPG, JPEG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className='col-span-full'>
              <label className='block text-sm/6 font-medium text-gray-900'>
                Image Variants
              </label>
              <div className='mt-2 space-y-4'>
                {fields.map((field, i) => (
                  <div
                    key={i}
                    className='rounded-2xl border border-gray-100 p-4 shadow'
                  >
                    <div className='grid grid-cols-1 gap-4'>
                      <div className='sm:col-span-2 sm:col-start-1'>
                        <label
                          htmlFor='ratio'
                          className='block text-sm/6 font-medium text-gray-900'
                        >
                          Size & Aspect Ratio
                        </label>
                        <div className='mt-2 grid grid-cols-1'>
                          <select
                            className='col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                            {...register(`variants.${i}.type`)}
                          >
                            {Object.entries(IMAGE_VARIANTS).map(
                              ([key, value]) => (
                                <option key={key} value={value.type}>
                                  {value.label} ({value.dimensions.width}x
                                  {value.dimensions.height})
                                </option>
                              )
                            )}
                          </select>
                          <ChevronDownIcon
                            aria-hidden='true'
                            className='pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4'
                          />
                        </div>
                      </div>

                      <div className='sm:col-span-2'>
                        <label
                          htmlFor='license'
                          className='block text-sm/6 font-medium text-gray-900'
                        >
                          License
                        </label>
                        <div className='mt-2 grid grid-cols-1'>
                          <select
                            className='col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                            {...register(`variants.${i}.license`)}
                          >
                            <option value='personal'>Personal Use</option>
                            <option value='commercial'>Commercial Use</option>
                          </select>
                          <ChevronDownIcon
                            aria-hidden='true'
                            className='pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4'
                          />
                        </div>
                      </div>

                      <div className='sm:col-span-2'>
                        <label
                          htmlFor='price'
                          className='block text-sm/6 font-medium text-gray-900'
                        >
                          Price
                        </label>
                        <div className='mt-2'>
                          <div className='flex items-center rounded-md bg-white px-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600'>
                            <div className='shrink-0 text-base text-gray-500 select-none sm:text-sm/6'>
                              ₹
                            </div>
                            <input
                              id='price'
                              type='number'
                              step='0.01'
                              min='0.01'
                              placeholder='0.00'
                              aria-describedby='price-currency'
                              className='block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6'
                              {...register(`variants.${i}.price`, {
                                valueAsNumber: true,
                                required: 'Price is required',
                                min: {
                                  value: 0.01,
                                  message: 'Price must be greater than 0'
                                }
                              })}
                            />
                            <div
                              id='price-currency'
                              className='shrink-0 text-base text-gray-500 select-none sm:text-sm/6'
                            >
                              INR
                            </div>
                          </div>
                          {errors.variants?.[i]?.price && (
                            <span className='mt-2 text-sm text-red-600'>
                              {errors.variants?.[i]?.price?.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='sm:col-span-2'>
                        <button
                          type='button'
                          className='inline-flex items-center gap-x-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-xs hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500'
                          onClick={() => remove(i)}
                          disabled={fields.length === 1}
                        >
                          <TrashIcon
                            aria-hidden='true'
                            className='-ml-0.5 size-5'
                          />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type='button'
                className='mt-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-xs hover:bg-indigo-100'
                onClick={() =>
                  append({
                    type: 'SQUARE' as ImageVariantType,
                    price: 9.99,
                    license: 'personal'
                  })
                }
              >
                <PlusIcon aria-hidden='true' className='-ml-0.5 size-5' />
                Add variant
              </button>
            </div>
          </div>
        </div>

        <div className='mt-12 flex items-center justify-end gap-x-6'>
          <button
            type='submit'
            className={cn(
              'flex h-10 w-full items-center justify-center rounded-md px-3 text-sm/6 font-semibold text-white shadow-xs',
              submitting
                ? 'bg-indigo-300'
                : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            )}
            disabled={submitting}
          >
            {submitting ? <Spinner className='size-5' /> : 'Create Product'}
          </button>
        </div>
      </form>
    </MainLayout>
  )
}
