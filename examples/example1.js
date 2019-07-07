const ConsoleSequence = require('../index');

let str = 
`# Example of a comment.
Title: Here is a big big big \\ntitle in far far galaxy
participant A
participant Adaf\\n af as C
Note left of A: Note to the\\nleft of A
A->C: Normal line\\nline
Note right of A: Note to the\\nright of A
Note over A: Note over A
B-->C: Dashed line
D-->>A: Dashed open arrow
Note over D: Note over D
Note over A,C: Note over both A and B`;

console.log(new ConsoleSequence(2).make(str).join('\n'));

str = 
`# Example of a comment.
Title: File Status Lifecycle
participant untracked as UNT
participant unmodified as UNM
participant modified as M
participant staged as S

UNT->UNM: add the file
UNM->M: edit the file
M->S: stage the file
UNM->UNT: remove the file
S->UNM: commit`;

console.log(new ConsoleSequence(0).make(str).join('\n'));

str = 
`participant C
participant B
participant A
Note right of A: By listing the participants\\n you can change their order`;

console.log(new ConsoleSequence(1).make(str).join('\n'));

str = 
`# Example of a comment.
Note left of A: Note to the\\n left of A
Note right of A: Note to the\\n right of A
Note over A: Note over A
Note over A,B: Note over both A and B`;

console.log(new ConsoleSequence(0).make(str).join('\n'));

str = 
`Andrew->China: Says Hello
Note right of China: China thinks\\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!`;

console.log(new ConsoleSequence(1).make(str).join('\n'));

str = 
`participant Клиент A as A
participant Клиент Б as B
participant Асинхронная операция as AO
participant Асинхронная операция as SAO

A->AO: запрос с данными
B->SAO: запрос с теми же данными
AO-->A: ответ
SAO-->B: ответ`;

console.log(new ConsoleSequence(0).make(str).join('\n'));

str = 
`participant Клиент A as A
participant Клиент Б as B
participant Асинхронная операция as AO

A->AO: запрос с данными
B->AO: запрос с теми же данными
Note over AO: Присоединения к\\nзапущенной операции  
AO-->A: ответ
AO-->B: ответ`;

console.log(new ConsoleSequence(1).make(str).join('\n'));