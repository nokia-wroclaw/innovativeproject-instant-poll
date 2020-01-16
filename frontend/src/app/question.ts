export class Question {
    id: number;
    type: string;
    question: string;
    action: string;
    answers: Array<string>;
    numberOfVotes: Array<number>;
    selected: Array<number> = [];
    hidden = true;
    hiddenResults: boolean;
    active: boolean;
    toPDF: boolean;
}