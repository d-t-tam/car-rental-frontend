import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PaymentService, type PaymentMethod, type ProcessPaymentData } from "@/services/payment.service";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  totalPrice: number;
  totalPaid?: number;
  onPaymentSuccess?: (transactionId: number) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "Banking", "E-Wallet", "Wallet"];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  totalPrice,
  totalPaid = 0,
  onPaymentSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingAmount = totalPrice - totalPaid;

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setAmount(remainingAmount.toString());
      setPaymentMethod("");
      setNotes("");
      setError(null);
    }
  }, [isOpen, remainingAmount]);

  const validateForm = (): boolean => {
    setError(null);

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    if (Number(amount) > remainingAmount) {
      setError(`Amount cannot exceed remaining balance of $${remainingAmount.toFixed(2)}`);
      return false;
    }

    if (!paymentMethod) {
      setError("Please select a payment method");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const paymentData: ProcessPaymentData = {
        booking_id: bookingId,
        amount: Number(amount),
        payment_method: paymentMethod as PaymentMethod,
        notes: notes || undefined,
      };

      const response = await PaymentService.processPayment(paymentData);

      toast.success("Payment processed successfully!");
      onPaymentSuccess?.(response.payment.transaction_id);
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (err as { message?: string }).message ||
        "Failed to process payment";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Complete your payment for booking #{bookingId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Summary */}
          <div className="space-y-2 bg-muted/30 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Paid:</span>
              <span className="font-semibold">${totalPaid.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
              <span>Remaining:</span>
              <span className="text-primary">${remainingAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              max={remainingAmount}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Max: ${remainingAmount.toFixed(2)}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method *</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              disabled={isLoading}
            >
              <SelectTrigger id="method">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method === "E-Wallet" ? "E-Wallet" : method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any payment notes or reference..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
