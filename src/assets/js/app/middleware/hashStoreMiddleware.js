import { toHash } from '../globals/hashStore';

export default function hashStoreMiddleware(store) {
    return (next) => (action) => {
        const result = next(action);

        toHash(store);

        return result;
    };
}
