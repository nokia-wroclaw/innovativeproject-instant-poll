export class Question {
    id: number;
    type: string;
    question: string;
    answers: Array<string>;
    numberOfVotes: Array<number>;
    hidden: boolean;
    selected: string;
}