import React, { useState, useMemo } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import SendSMSModal from './send-sms-modal'
import { Card, CardContent } from '@/components/ui/card'

interface CSVDataTableProps {
    data: any[]
}

const CSVDataTable: React.FC<CSVDataTableProps> = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sentMessages, setSentMessages] = useState<Set<number>>(new Set())

    const itemsPerPage = 10

    const filteredData = useMemo(() => {
        return data.filter(row =>
            Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }, [data, searchTerm])

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredData.slice(start, start + itemsPerPage)
    }, [filteredData, currentPage])

    const handleSendSMS = (row: any, index: number) => {
        setSelectedRow(row)
        setIsModalOpen(true)
    }

    const handleMessageSent = (index: number) => {
        setSentMessages(prev => new Set(prev).add(index))
    }

    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <div className="mb-4">
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.keys(data[0]).map((header) => (
                                    <TableHead className="text-sm font-medium capitalize" key={header}>{header}</TableHead>
                                ))}
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.map((row, index) => (
                                <TableRow key={index}>
                                    {Object.values(row).map((cell: any, cellIndex) => (
                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                    <TableCell>
                                        {sentMessages.has(index) ? (
                                            <span className="text-green-500">Sent</span>
                                        ) : (
                                            <Button onClick={() => handleSendSMS(row, index)}>Send SMS</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                isActive={currentPage === 1}

                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(i + 1)}
                                    isActive={currentPage === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                isActive={currentPage === totalPages}

                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                <SendSMSModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    recipient={selectedRow?.phone || ''}
                    onMessageSent={() => {
                        const index = currentData.findIndex(row => row === selectedRow)
                        if (index !== -1) {
                            handleMessageSent(index)
                        }
                    }}
                />
            </CardContent>
        </Card>
    )
}

export default CSVDataTable