'use client'

import React, { useState } from 'react'
import CSVUploader from '@/components/csv-uploader'
import CSVDataTable from '@/components/csv-data-table'
import { Button } from '@/components/ui/button'

const RequestReview = () => {
    const [csvData, setCsvData] = useState<any[]>([])

    const handleCSVUpload = (data: any[]) => {
        setCsvData(data)
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Request Review</h1>
            <CSVUploader onUpload={handleCSVUpload} />
            {csvData.length > 0 && <CSVDataTable data={csvData} />}
        </div>
    )
}

export default RequestReview