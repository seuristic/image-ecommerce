'use client'

import AdminProductForm from '../../components/AdminProductForm'

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Admin Product Form</h1>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>
        <AdminProductForm />
      </div>
    </div>
  )
}
