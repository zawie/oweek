import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'

import { StudentFamily, Student} from "../model/types";

export function FamilyTree(family: StudentFamily) {
    return <Tree label={StudentCardGroup(family.parents, false, "Advisors")}>
            <TreeNode label={StudentCardGroup([family.focus], true)}>
                {family.kids.map(kid =>
                <TreeNode label={StudentCardGroup([kid])}/>
                )}
            </TreeNode>
            {family.siblings.map(sibling =>
                <TreeNode label={StudentCardGroup([sibling])}/>
            )}
        </Tree>
}