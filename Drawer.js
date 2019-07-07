/**
 * Класс для рисования в тексте
 */
class Drawer {
    /**
     * 
     * @param {number} width ширина
     * @param {number} height высота
     */
    constructor(width, height) {
        this.output = new Array(height).fill(0).map(() => ' '.repeat(width));
    }

    /**
     * Возвращает новую строку в которой заменены с указаной строки символы на строку замены
     * 
     * @param {string} str строка
     * @param {number} offset отступ в строке
     * @param {string} newstr строка замены
     * @return {string}
     */
    replace(str, offset, newstr) {
        return (str.substring(0, offset) + newstr + str.substring(offset + newstr.length)).substring(0, str.length + 1);
    }

    /**
     * Рисует текст на указаной строке с указаным отступом
     * 
     * @param {number} line номер строки
     * @param {number} offset отступ
     * @param {string} newstr строка
     */
    drawText(line, offset, newstr) {
        this.output[line] = this.replace(this.output[line], offset, newstr);
    }

    /**
     * Рисует прямоугольник с текстом, с символами по умолчанию
     * 
     * @param {number} line номер строки
     * @param {number} offset отступ
     * @param {string} text текст
     * @param {number} minHeight минимальная высота
     * @param {number} width ширина
     */
    drawRect(line, offset, text, minHeight, width) {
        this.rawDrawRect(line, offset, text, minHeight, width, ['┌', '┐', '┘', '└'], ['─', '│', '─', '│']);
    }


    /**
     * Рисует прямоугольник с текстом
     * 
     * @param {number} line номер строки
     * @param {number} offset отступ
     * @param {string} text текст
     * @param {number} minHeight минимальная высота
     * @param {number} width ширина
     * @param {string[]} sCorners массив символов углов, в указаном порядке: верх-лево, верх-право, низ-право, низ-лево
     * @param {string[]} sEdges массив символов граней, в указаном порядке: верх, право, низ, лево
     */
    rawDrawRect(line, offset, text, minHeight, width, sCorners, sEdges) {
        this.output[line] = this.replace(this.output[line], offset, sCorners[0] + sEdges[0].repeat(width - 2) + sCorners[1]);
        const strArr = text.split('\\n');
        minHeight = minHeight || strArr.length + 2;
        for (let j = 0; j < minHeight - 2; j++) {
            this.output[line + j + 1] = this.replace(this.output[line + j + 1], offset, sEdges[3] + this.replace(' '.repeat(width - 2), 0, strArr[j] ? strArr[j] : '') + sEdges[1]);
        }
        this.output[line + minHeight - 1] = this.replace(this.output[line + minHeight - 1], offset, sCorners[3] + sEdges[2].repeat(width - 2) + sCorners[2]);
    }

    /**
     * Рисует линию, со специальными окончаниями
     * 
     * @param {number} line номер строки
     * @param {number} offset отступ
     * @param {string} text текст
     * @param {number} width ширина
     * @param {string} sLeft левый символ линии
     * @param {string} sBody центральный символ линии
     * @param {string} sRight правый символ линии
     */
    drawLine(line, offset, text, width, sLeft, sBody, sRight) {
        const strArr = text.split('\\n');
        for (let j = 0; j < strArr.length; j++) {
            this.output[line + j] = this.replace(this.output[line + j], offset, strArr[j]);
        }
        this.output[line + strArr.length] = this.replace(this.output[line + strArr.length], offset, sLeft + sBody.repeat(width - sLeft.length - sRight.length) + sRight);
    }
}

module.exports = Drawer;