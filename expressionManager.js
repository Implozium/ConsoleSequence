const Expression = require('./Expression');
const {
    CommentExpression,
    EmptyExpression,
    TitleExpression,
    ParticipantExpression,
    LRNoteExpression,
    OverNoteExpression,
    LineExpression,
} = require('./expressions');

/**
 * Менеджер для выражений
 */
const expressionManager = {
    /**
     * Массив конструкторов для выражений
     * 
     * @type {typeof Expression[]}
     */
    expressionConstructors: [
        CommentExpression,
        EmptyExpression,
        TitleExpression,
        ParticipantExpression,
        LRNoteExpression,
        OverNoteExpression,
        LineExpression,
    ],

    /**
     * Массив конструкторов для заголовков
     * 
     * @type {typeof Expression[]}
     */
    titles: [
        TitleExpression,
    ],

    /**
     * Возвращает экземпляр выражения для указаной строки или выбрасывает исключение при не нахождении выражения для строки
     * 
     * @throws {Error} при не нахождении выражения для строки
     * @param {string} line строка выражения
     * @return {Expression}
     */
    getExpression(line) {
        const anExpressionConstructor = this.expressionConstructors.find(anExpressionConstructor => anExpressionConstructor.is(line));
        if (anExpressionConstructor) {
            return new anExpressionConstructor(anExpressionConstructor.parts(line));
        }
        throw new Error('Cannot found right constructor of expression for line: "' + line + '"');
    },

    /**
     * Проверяет является ли данное выражение заголовком
     * 
     * @param {Expression} anExpression 
     * @return {boolean}
     */
    isTitle(anExpression) {
        // @ts-ignore
        return this.titles.includes(anExpression.constructor);
    }
};

module.exports = expressionManager;