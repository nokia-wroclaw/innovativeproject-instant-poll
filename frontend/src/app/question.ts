export class Question {
    id: number;
    type: string;
    question: string;
    answers: Array<string>;
    hidden: boolean;
}