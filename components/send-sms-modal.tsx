import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

interface SendSMSModalProps {
    isOpen: boolean
    onClose: () => void
    recipient: string
    onMessageSent: () => void
}

const SendSMSModal: React.FC<SendSMSModalProps> = ({ isOpen, onClose, recipient, onMessageSent }) => {
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSendMessage = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/twilio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to: recipient, message }),
            })

            if (response.ok) {
                console.log('SMS sent successfully')
                onMessageSent()
                onClose()
            } else {
                console.error('Failed to send SMS')
            }
        } catch (error) {
            console.error('Error sending SMS:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send SMS</DialogTitle>
                </DialogHeader>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="min-h-[100px]"
                />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Message'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SendSMSModal