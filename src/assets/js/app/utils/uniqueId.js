let lastId = 0;

export default function uniqueId(prefix = 'id-') {
    return `${prefix}${++lastId}`;
}
