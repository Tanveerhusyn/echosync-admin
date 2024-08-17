"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Send, RefreshCw, Copy, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function ReviewGenerator() {
  const [reviewText, setReviewText] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://api.echosync.ai/reviews/generate-manual",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_review: reviewText }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = await response.json();
      setGeneratedResponse(data.response);
    } catch (err) {
      setError(
        "An error occurred while generating the response. Please try again.",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReviewText("");
    setGeneratedResponse("");
    setError("");
    setIsCopied(false);
  };

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          AI-Powered Review Response Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Let our AI assistant craft professional and empathetic replies to
          customer reviews. Simply paste the review, and we'll generate a
          tailored response.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste the customer review here..."
            value={reviewText}
            onChange={handleReviewChange}
            className="min-h-[150px]"
          />
          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={!reviewText.trim() || isLoading}
              className="flex-1 bg-[#181c31] text-white py-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Response
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {generatedResponse && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                Generated Response:
                <CopyToClipboard text={generatedResponse} onCopy={handleCopy}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`transition-all duration-300 ease-in-out ${
                      isCopied ? "bg-green-500 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                </CopyToClipboard>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{generatedResponse}</p>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <p className="text-xs text-gray-500">
                This response was generated by AI. Please review and adjust as
                needed before sending to the customer.
              </p>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
