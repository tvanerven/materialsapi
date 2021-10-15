import { Concept } from './concept';

export interface Material {
    id: number;
    doi: string;
    name: string;
    author: string;
    concept: Concept[];
}