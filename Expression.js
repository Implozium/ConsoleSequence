const Info = require('./Info');
const Drawer = require('./Drawer');
const {
    getTextSize
} = require('./common');

/**
 * Класс для выражений - их лексического разбора и рисования
 */
class Expression {
    /**
     * 
     * @param {string[]} parts массив элементов для инициализации
     */
    constructor(parts) {

    }

    /**
     * Возвращает массив из массивов алиасов для акторов
     * 
     * @return {string[][]}
     */
    extractAlias() {
        return [];
    }

    /**
     * Возвращает массив акторов
     * 
     * @return {string[]}
     */
    extractActors() {
        return [];
    }

    /**
     * Возвращает размер блока этого выражения
     * 
     * @return {{width: number, height: number}} размер
     */
    getSize() {
        return getTextSize('');
    }

    /**
     * Изменяет объект **info** в рамках выражения
     * 
     * @param {Info} info объект информации
     */
    changeInfo(info) {}

    /**
     * Рисует выражение у рисовальщика
     * 
     * @param {Drawer} drawer рисовальщик
     * @param {Info} info объект информации
     * @param {number} line номер линии начала рисования
     * @return {number} новый номер линии окончания рисования
     */
    draw(drawer, info, line) {
        return line;
    }

    /**
     * Проверяет, подходит ли указаная строка для этого выражения
     * 
     * @param {string} line строка
     * @return {boolean}
     */
    static is(line) {
        return this.regexp.test(line);
    }

    /**
     * Возвращает части совпадения для этого выражения
     * 
     * @param {string} line строка
     * @return {?string[]} части совпадений
     */
    static parts(line) {
        return this.regexp.exec(line);
    }
}
/**
 * Регулярное выражение для сопоставления с образцом
 * @type {RegExp}
 */
Expression.regexp = /^.*$/;

module.exports = Expression;