import { createConfirmDialog } from 'vuejs-confirm-dialog';
import HotkeyDialog from '@/components/Dialogs/HotkeyDialog.vue';

function hotkey(action: Function): void {
    const { reveal, onConfirm } = createConfirmDialog(HotkeyDialog, {
    })
 
    onConfirm(action as any)
    reveal()
}

export {
    hotkey,
}