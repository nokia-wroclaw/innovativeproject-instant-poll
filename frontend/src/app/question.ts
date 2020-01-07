export class Question {
    id: number;
    type: string;
    question: string;
    action: string;
    answers: Array<string>;
    numberOfVotes: Array<number>;
    hidden: boolean;
    selected: Array<number> = [];
}