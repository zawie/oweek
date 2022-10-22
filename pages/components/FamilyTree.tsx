import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'

import { StudentFamily, StudentRecord} from "../model/types";

type FamilyTreeProps = {
    family: StudentFamily
}

function FamilyTree(props: FamilyTreeProps) {
    const family = props.family
    return <Tree label={StudentCardGroup(family.parents, false, "Advisors")}>
        <TreeNode label={StudentCardGroup([family.focus], true)}>
            {family.kids.map(kid =>
            <TreeNode label={StudentCardGroup([kid])}/>
            )}
        </TreeNode>
        {family.siblings.map(sibling =>
        <TreeNode key={sibling.id} label={StudentCardGroup([sibling])}/>
        )}
    </Tree>;
}

export default FamilyTree