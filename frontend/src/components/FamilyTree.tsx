import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'

import { StudentFamily, Student} from "../model/types";

export function FamilyTree(family: StudentFamily) {
    return <Tree label={StudentCardGroup(family.parents, "Advisors")}>
        {family.siblings.map(([sibling, nieces]: [Student, Student[]]) =>
            <TreeNode label={StudentCardGroup([sibling])}>
                {nieces.map(niece => <TreeNode label={StudentCardGroup([niece])}/>)}
            </TreeNode>
        )}
    </Tree>
}