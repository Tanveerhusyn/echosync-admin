import React, { ChangeEvent } from 'react'
import Papa from 'papaparse'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { FaFileCsv } from 'react-icons/fa'

interface CSVUploaderProps {
    onUpload: (data: any[]) => void
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUpload }) => {
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    onUpload(result.data)
                },
                header: true,
            })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                    <FaFileCsv className="text-6xl text-blue-500" />
                    <h2 className="text-2xl font-semibold text-center">Upload CSV File</h2>
                    <p className="text-sm text-gray-500 text-center">
                        Select a CSV file to upload and process the data
                    </p>
                    <div className="w-full">
                        <Input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CSVUploader