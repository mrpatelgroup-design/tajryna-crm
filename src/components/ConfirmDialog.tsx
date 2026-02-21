import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Delete Item', message = 'Are you sure you want to delete this item? This action cannot be undone.' }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-3 rounded-full bg-rose-100">
          <AlertTriangle className="size-6 text-rose-600" />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 h-9 rounded-md border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-9 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors">Delete</button>
        </div>
      </div>
    </Modal>
  );
}
