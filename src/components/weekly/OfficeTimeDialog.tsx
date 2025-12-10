import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface OfficeTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (arrivalTime: string, departureTime: string) => void;
  initialArrivalTime?: string;
  initialDepartureTime?: string;
}

export function OfficeTimeDialog({
  open,
  onOpenChange,
  onConfirm,
  initialArrivalTime = '09:00',
  initialDepartureTime = '18:00',
}: OfficeTimeDialogProps) {
  const [arrivalTime, setArrivalTime] = useState(initialArrivalTime);
  const [departureTime, setDepartureTime] = useState(initialDepartureTime);

  const handleConfirm = () => {
    onConfirm(arrivalTime, departureTime);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px]">
        <DialogHeader>
          <DialogTitle>Horário no Escritório</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="arrival-time">Hora de Chegada</Label>
            <Input
              id="arrival-time"
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="departure-time">Hora de Saída</Label>
            <Input
              id="departure-time"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}