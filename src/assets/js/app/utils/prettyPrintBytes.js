const KB = 1024;
const MB = 1048576;
const GB = 1073741824;

export default function prettyPrintBytes(bytes, decimal = 1) {
    if (bytes < KB) {
        return bytes + ' bytes';
    } else if (bytes >= KB && bytes < MB) {
        return (bytes / KB).toFixed(decimal) + ' KB';
    } else if (bytes >= MB && bytes < GB) {
        return (bytes / MB).toFixed(decimal) + ' MB';
    } else if (bytes >= GB) {
        return (bytes / GB).toFixed(decimal) + ' GB';
    }
}
