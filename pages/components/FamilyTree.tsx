import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'

import { Scope, StudentRecord} from "../model/types";

type FamilyTreeProps = {
    scope: Scope
}

function FamilyTree(props: FamilyTreeProps) {
    const scope = props.scope;
    return <Tree label={StudentCardGroup(scope.parents, false, "Advisors")}>
        <TreeNode label={StudentCardGroup([scope.focus], true)}>
            {scope.kids.map(kid =>
            <TreeNode label={StudentCardGroup([kid])}/>
            )}
        </TreeNode>
        {scope.siblings.map(sibling =>
        <TreeNode key={sibling.id} label={StudentCardGroup([sibling])}/>
        )}
    </Tree>;
}

export default FamilyTree