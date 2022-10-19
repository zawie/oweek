export type ID = number;

export type Student = {
    id: ID
    name: string
    imageSrc?: string
    college?: string
};

export type StudentFamily = {
    parents: Student[]                       //  Parents of this family
    siblings: [Student, Student[]][]     //  Your siblings and their children
    focus?: Student
}

export const demoFamily: StudentFamily = {
    parents: [{name: "Advisor", id: 100}, {name: "Co-Advisor", id: 101}],
    siblings: [1,2,3,4,5, 6, 7, 8, 9, 10].map(n => [
        {name: 'Student' + (n-1)*4, id: (n-1)*4},
        n == 3 || n == 7 ? [1,2,3,4,5, 6, 7, 8, 9, 10].map(m => {return {name: 'Student' + ((n-1)*4 + m), id: ((n-1)*4 + m)}}) : []
    ]),
}