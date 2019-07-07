const Info = require('./Info');
const Drawer = require('./Drawer');
const Expression = require('./Expression');
const expressionManager = require('./expressionManager');
const {
    getTextSize
} = require('./common');

/**
 * Класс для реализации диаграммы последовательностей
 */
class ConsoleSequence {
    /**
     * 
     * @param {number=} linesBetween количество строк между смысловыми блоками
     */
    constructor(linesBetween = 1) {
        this.linesBetween = linesBetween;
    }

    /**
     * Разбирает текст диаграммы последовательностей и рисует его и возвращает массив из строк с символами рисунка
     * 
     * @param {string} str текст диаграммы последовательностей
     * @return {string[]}
     */
    make(str) {
        const expressions = str.split(/\n\r?/).map(line => expressionManager.getExpression(line.trim()));
        const info = new Info(this.linesBetween, expressions);
        return this._draw(info, expressions);
    }

    /**
     * Рисует выражения и возвращает массив из строк с символами рисунка
     * 
     * @param {Info} info информация
     * @param {Expression[]} expressions массив выражений
     * @return {string[]}
     */
    _draw(info, expressions) {
        let line = 0;
        const drawer = new Drawer(info.width, info.height);
        expressions.filter(anExpressions => expressionManager.isTitle(anExpressions))
            .forEach((anExpressions) => {
                if (line) {
                    line += info.linesBetween + 1;
                }
                line = anExpressions.draw(drawer, info, line);
            });

        if (line) {
            line += info.linesBetween + 1;
        }
        info.actors.forEach((actor, i) => {
            const size = getTextSize(info.aliases[actor] || actor);
            const width = Math.ceil((size.width - 1)/2) + 2;
            const start = info.offsetOfColumns[i] - width;
            drawer.drawRect(line, start, ' ' + (info.aliases[actor] || actor).replace(/\\n/g, '\\n '), info.actorHeight, size.width + 4);
        });
        line += info.actorHeight - 1;

        for (let j = 0; j < info.columns.length - 1; j++) {
            drawer.drawText(line, info.offsetOfColumns[j], '┬');
        }
        for (let i = line + 1; i < info.height - info.actorHeight; i++) {
            for (let j = 0; j < info.columns.length - 1; j++) {
                drawer.drawText(i, info.offsetOfColumns[j], '│');
            }
        }

        expressions.filter(anExpressions => !expressionManager.isTitle(anExpressions))
            .forEach((anExpressions) => {
                line += info.linesBetween + 1;
                const newLine = anExpressions.draw(drawer, info, line);
                if (line === newLine) {
                    line -= info.linesBetween + 1;
                } else {
                    line = newLine;
                }
            });

        line += info.linesBetween + 1;
        info.actors.forEach((actor, i) => {
            const size = getTextSize(info.aliases[actor] || actor);
            const width = Math.ceil((size.width - 1)/2) + 2;
            const start = info.offsetOfColumns[i] - width;
            drawer.drawRect(line, start, ' ' + (info.aliases[actor] || actor).replace(/\\n/g, '\\n '), info.actorHeight, size.width + 4);
        });
        for (let j = 0; j < info.columns.length - 1; j++) {
            drawer.drawText(info.height - info.actorHeight, info.offsetOfColumns[j], '┴');
        }
        line += info.actorHeight;

        return drawer.output;
    }
}

module.exports = ConsoleSequence;