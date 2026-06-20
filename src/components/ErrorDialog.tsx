import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ErrorDialogProps = Readonly<{
  open: boolean;
  onRetry: () => void;
}>;

export function ErrorDialog({ open, onRetry }: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>エラー</DialogTitle>
          <DialogDescription>通信エラーが発生しました。</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Button onClick={onRetry}>リトライ</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
