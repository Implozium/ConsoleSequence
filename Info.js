const Expression = require('./Expression');
const {
    getTextSize
} = require('./common');

/**
 * Класс для сохранения информации о выражениях
 */
class Info {
    /**
     * 
     * @param {number} linesBetween 
     * @param {Expression[]} expressions 
     */
    constructor(linesBetween, expressions) {
        const obj = this._extractAliasesAndActors(expressions);
        /**
         * @type {string[]}
         */
        this.actors = obj.actors;
        this.aliases = obj.aliases;
        this.linesBetween = linesBetween;
        
        this.actorHeight = this.actors.reduce((max, actor) => {
            const size = getTextSize(this.aliases[actor] || actor);
            return size.height > max ? size.height : max; 
        }, 0) + 2;

        this.height = this.actorHeight + this.linesBetween + this.actorHeight;

        this.columns = new Array(this.actors.length + 1).fill(0);

        this.actors.forEach((actor, i) => {
            const size = getTextSize(this.aliases[actor] || actor);
            const width = Math.ceil((size.width - 1)/2) + 2;
            this.columns[i] = this.columns[i] > 0 ? this.columns[i] + width + 1 : width;
            this.columns[i+1] = this.columns[i+1] > 0 ? this.columns[i+1] + width + 1 : width;
        });

        expressions.forEach(anExpression => anExpression.changeInfo(this));

        this.width = this.columns.reduce((res, column) => res + column + 1, 0);

        expressions.forEach((anExpression) => {
            const size = anExpression.getSize();
            if (this.width < size.width) {
                this.width = size.width;
            }
        });

        this.offsetOfColumns = this.columns.map((column, i) => {
            const arr = this.columns.slice(0, i + 1);
            return arr.reduce((sum, w) => sum + w, 0) + arr.length;
        });
    }

    /**
     * Извлекает акторов и их алиасы из выражений
     * 
     * @param {Expression[]} expressions 
     * @returns {{actors: string[], aliases: Object.<string, string>}}
     */
    _extractAliasesAndActors(expressions) {
        return expressions.reduce((obj, anExpression) => {
            anExpression.extractAlias().forEach(([alias, actor]) => {
                obj.aliases[alias] = actor;
            });
            anExpression.extractActors().forEach((actor) => {
                if (!obj.actors.includes(actor)) {
                    obj.actors.push(actor);
                }
            });
            return obj;
        }, {
            actors: [],
            aliases: {},
        });
    }
}

module.exports = Info;