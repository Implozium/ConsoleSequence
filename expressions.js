const Expression = require('./Expression');
const {
    getTextSize
} = require('./common');

class CommentExpression extends Expression {

}
CommentExpression.regexp = /^\s*#/;

class EmptyExpression extends Expression {

}
EmptyExpression.regexp = /^\s*$/;

class TitleExpression extends Expression {
    constructor(parts) {
        super(parts);
        this.message = parts[1];
    }

    getSize() {
        const size = getTextSize(this.message);
        size.width += 4;
        size.height += 2;
        return size;
    }

    changeInfo(info) {
        const size = this.getSize();
        info.height += info.linesBetween + size.height;
    }

    draw(drawer, info, line) {
        const size = this.getSize();
        drawer.drawRect(line, 0, ' ' + this.message.replace(/\\n/g, '\\n '), 0, size.width);
        return line + size.height - 1;
    }
}
TitleExpression.regexp = /title *: *(.+)/i;

class ParticipantExpression extends Expression {

    /**
     * 
     * @param {string[]} parts массив элементов для инициализации
     */
    constructor(parts) {
        super(parts);
        this.actor = parts[1];
        this.alias = parts[2];
    }

    extractAlias() {
        return this.alias ? [[this.alias, this.actor]] : [];
    }

    extractActors() {
        return this.alias ? [this.alias] : [this.actor];
    }
}
ParticipantExpression.regexp = /participant +(.+?)(?: +as +([^ ]+))?$/i;

class NoteExpression extends Expression {
    constructor(parts) {
        super(parts);
        this.message = '';
    }

    getSize() {
        const size = getTextSize(this.message);
        size.width += 4;
        size.height += 2;
        return size;
    }
}

class LRNoteExpression extends NoteExpression {
    constructor(parts) {
        super(parts);
        this.type = parts[1];
        this.actor = parts[2];
        this.message = parts[3];
    }

    changeInfo(info) {
        const size = this.getSize();
        if (this.type === 'left') {
            const i = info.actors.indexOf(this.actor);
            info.columns[i] = info.columns[i] > size.width ? info.columns[i] : size.width;
        } else {
            const i = info.actors.indexOf(this.actor);
            info.columns[i + 1] = info.columns[i + 1] > size.width ? info.columns[i + 1] : size.width;
        }
        info.height += info.linesBetween + size.height;
    }

    extractActors() {
        return [this.actor];
    }

    draw(drawer, info, line) {
        const size = this.getSize();
        if (this.type === 'left') {
            const i = info.actors.indexOf(this.actor);
            const start = info.offsetOfColumns[i] - size.width;
            drawer.drawRect(line, start, ' ' + this.message.replace(/\\n/g, '\\n '), 0, size.width);
        } else {
            const i = info.actors.indexOf(this.actor);
            const start = info.offsetOfColumns[i] + 2;
            drawer.drawRect(line, start, ' ' + this.message.replace(/\\n/g, '\\n '), 0, size.width);
        }
        return line + size.height - 1;
    }
}
LRNoteExpression.regexp = /note +(left|right) of +(.+) *: *(.+)/i;

class OverNoteExpression extends NoteExpression {
    constructor(parts) {
        super(parts);
        this.type = parts[1];
        this.actor = parts[2];
        this.actorTo = parts[3];
        this.message = parts[4];
    }

    changeInfo(info) {
        const size = this.getSize();
        if (!this.actorTo) {
            const i = info.actors.indexOf(this.actor);
            const width = Math.ceil((size.width - 1)/2);
            info.columns[i] = info.columns[i] > width ? info.columns[i] : width;
            info.columns[i+1] = info.columns[i+1] > width ? info.columns[i+1] : width;
        } else {
            const [i, j] = [info.actors.indexOf(this.actor), info.actors.indexOf(this.actorTo)].sort();
            const width = Math.ceil((size.width - (j - i + 1))/(j - i));
            for (let t = i + 1; t <= j; t++) {
                info.columns[t] = info.columns[t] > width ? info.columns[t] : width;
            }
        }
        info.height += info.linesBetween + size.height;
    }

    extractActors() {
        return this.actorTo ? [this.actor, this.actorTo] : [this.actor];
    }

    draw(drawer, info, line) {
        const size = this.getSize();
        if (!this.actorTo) {
            const i = info.actors.indexOf(this.actor);
            const width = Math.ceil((size.width - 1)/2);
            const start = info.offsetOfColumns[i] - width + 1;
            drawer.drawRect(line, start, ' ' + this.message.replace(/\\n/g, '\\n '), 0, size.width);
        } else {
            const [i, j] = [info.actors.indexOf(this.actor), info.actors.indexOf(this.actorTo)].sort();
            const width = info.offsetOfColumns[j] - info.offsetOfColumns[i] + 3;
            const start = info.offsetOfColumns[i] - 1;
            drawer.drawRect(line, start, ' ' + this.message.replace(/\\n/g, '\\n '), 0, width);
        }
        return line + size.height - 1;
    }
}
OverNoteExpression.regexp = /note +(over) +([^ ,]+)(?: *, *([^ ]+))? *: *(.+)/i;

class LineExpression extends Expression {
    constructor(parts) {
        super(parts);
        this.actor = parts[1];
        this.dash = parts[2];
        this.end = parts[3];
        this.actorTo = parts[4];
        this.message = parts[5];
    }

    extractActors() {
        return [this.actor, this.actorTo];
    }

    getSize() {
        const size = getTextSize(this.message);
        size.width += 2;
        size.height += 1;
        return size;
    }

    changeInfo(info) {
        const size = this.getSize();
        const [i, j] = [info.actors.indexOf(this.actor), info.actors.indexOf(this.actorTo)].sort();
        const width = Math.ceil((size.width - (j - i) + 1)/(j - i));
        for (let t = i + 1; t <= j; t++) {
            info.columns[t] = info.columns[t] > width ? info.columns[t] : width;
        }
        info.height += info.linesBetween + size.height;
    }

    draw(drawer, info, line) {
        const size = this.getSize();
        const [i, j] = [info.actors.indexOf(this.actor), info.actors.indexOf(this.actorTo)].sort();
        const width = info.offsetOfColumns[j] - info.offsetOfColumns[i] - 1;
        const start = info.offsetOfColumns[i] + 1;
        const reversed = info.actors.indexOf(this.actor) > info.actors.indexOf(this.actorTo);
        const sBody = this.dash === '-' ? '─' : '·';
        const sLeft = reversed ? (this.end === '>' ? '<' : '<<') : sBody;
        const sRight = !reversed ? (this.end === '>' ? '>' : '>>') : sBody;
        drawer.drawLine(line, start, ' ' + this.message.replace(/\\n/g, '\\n '), width, sLeft, sBody, sRight);
        if (reversed) {
            drawer.drawText(line + this.message.split('\\n').length, start + width, '┤');
        } else {
            drawer.drawText(line + this.message.split('\\n').length, start - 1, '├');
        }
        return line + size.height - 1;
    }
}
LineExpression.regexp = /([^ \-]+) *(-+)(>*) *([^ \->]+) *: *(.+)/i;

module.exports = {
    CommentExpression,
    EmptyExpression,
    TitleExpression,
    ParticipantExpression,
    LRNoteExpression,
    OverNoteExpression,
    LineExpression,
}