/**
 * Вычисляет размер текста по ширине и высоте и возвращает его
 * 
 * @param {string=} message строка текста
 * @return {{width: number, height: number}} размер
 */
function getTextSize(message = '') {
    const lines = message.split('\\n');
    return {
        width: lines.reduce((max, line) => line.length > max ? line.length : max, 0),
        height: lines.length
    }
}

exports.getTextSize = getTextSize;