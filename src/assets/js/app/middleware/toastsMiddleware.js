import { ADD_TOAST, removeToast } from '../redux/modules/toasts';

export default function toastsMiddleware(store) {
    return (next) => (action) => {
        const result = next(action);

        if (action.type === ADD_TOAST) {
            const { id, message } = result.payload;

            const duration =
                Math.max(Math.min(message.length * 100, 3500), 8000);

            setTimeout(() => {
                store.dispatch(removeToast(id));
            }, duration);
        }

        return result;
    };
}
