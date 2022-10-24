import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'

import { Scope, StudentRecord} from "../model/types";

type FamilyTreeProps = {
    scope: Scope
    doSearch: any
}

function FamilyTree(props: FamilyTreeProps) {
    const { scope, doSearch} = props;
    return <Tree label={StudentCardGroup(scope.parents, doSearch, false, "Advisors")}>
        <TreeNode label={StudentCardGroup([scope.focus], doSearch, true)}>
            {scope.kids.map(kid =>
            <TreeNode label={StudentCardGroup([kid], doSearch, false)}/>
            )}
        </TreeNode>
        {scope.siblings.map(sibling =>
        <TreeNode key={sibling} label={StudentCardGroup([sibling], doSearch, false)}/>
        )}
    </Tree>;
}

export default FamilyTree