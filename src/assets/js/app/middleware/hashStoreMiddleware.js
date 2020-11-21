import { toHash } from '../globals/HashStore';

export default function hashStoreMiddleware(store) {
    return (next) => (action) => {
        const result = next(action);

        toHash(store);

        return result;
    };
}
