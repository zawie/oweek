export const colleges = [
    'Baker', 
    'Will Rice',
    'Hanszen', 
    'Wiess',
    'Jones', 
    'Brown', 
    'Lovett', 
    'Sid Rich', 
    'Martel', 
    'McMurtry',
    'Duncan'
]

export function getPresident(index: number): string {
    const presidents = [
        'Edgar Lovett',
        'William Houston',
        'Kenneth Pitzer',
        'Norman Hackerman',
        'George Rupp',
        'Malcolm Gillis',
        'David Leebron',
        'Reginald DesRoches'
    ]

    return presidents[index % presidents.length]
}